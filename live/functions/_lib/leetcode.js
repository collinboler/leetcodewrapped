// Fetches and normalizes everything a card needs in a single LeetCode GraphQL call.
const LEETCODE_API = 'https://leetcode.com/graphql';
const AVATAR_MAX_BYTES = 150 * 1024;

const QUERY = `
  query liveCard($username: String!) {
    allQuestionsCount { difficulty count }
    matchedUser(username: $username) {
      username
      profile { realName userAvatar ranking }
      submitStatsGlobal { acSubmissionNum { difficulty count } }
      userCalendar { streak totalActiveDays submissionCalendar }
    }
    userContestRanking(username: $username) { rating topPercentage attendedContestsCount }
  }
`;

export class LeetCodeError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function graphql(query, variables) {
  const response = await fetch(LEETCODE_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Referer': 'https://leetcode.com',
    },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new LeetCodeError(`LeetCode API error: ${response.status}`, 502);
  }

  const { data } = await response.json();
  return data;
}

// Returns the canonical username, or null if the profile doesn't exist.
export async function findUser(username) {
  const data = await graphql('query ($username: String!) { matchedUser(username: $username) { username } }', { username });
  return data?.matchedUser?.username || null;
}

export async function fetchStats(username) {
  const data = await graphql(QUERY, { username });
  const user = data?.matchedUser;
  if (!user) {
    throw new LeetCodeError('User not found', 404);
  }

  const count = (list, difficulty) => list?.find((x) => x.difficulty === difficulty)?.count || 0;
  const solvedList = user.submitStatsGlobal?.acSubmissionNum;
  const totalList = data.allQuestionsCount;
  const calendar = user.userCalendar || {};
  const contest = data.userContestRanking;

  let days = {};
  try {
    days = JSON.parse(calendar.submissionCalendar || '{}');
  } catch {}

  return {
    username: user.username,
    name: user.profile?.realName || '',
    ranking: user.profile?.ranking || null,
    avatar: await fetchAvatar(user.profile?.userAvatar),
    solved: {
      all: count(solvedList, 'All'),
      easy: count(solvedList, 'Easy'),
      medium: count(solvedList, 'Medium'),
      hard: count(solvedList, 'Hard'),
    },
    total: {
      all: count(totalList, 'All'),
      easy: count(totalList, 'Easy'),
      medium: count(totalList, 'Medium'),
      hard: count(totalList, 'Hard'),
    },
    calendar: {
      days,
      activeDays: calendar.totalActiveDays || 0,
      maxStreak: calendar.streak || 0,
    },
    contest: contest?.attendedContestsCount
      ? {
          rating: Math.round(contest.rating),
          topPercentage: contest.topPercentage,
          attended: contest.attendedContestsCount,
        }
      : null,
    fetchedAt: Date.now(),
  };
}

// SVGs served through <img> can't load external resources, so the avatar is inlined.
async function fetchAvatar(url) {
  if (!url) return null;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (!response.ok) return null;
    const type = response.headers.get('content-type') || 'image/png';
    if (!type.startsWith('image/')) return null;
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.length > AVATAR_MAX_BYTES) return null;
    let binary = '';
    for (let i = 0; i < bytes.length; i += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    }
    return `data:${type};base64,${btoa(binary)}`;
  } catch {
    return null;
  }
}

// Serves from the edge cache while fresh, refetches when stale, and falls back
// to stale data if LeetCode is down or rate limiting us.
export async function getStats(context, username, ttlSeconds) {
  const cache = caches.default;
  const key = new Request(new URL(`/__cache/stats/v1/${username.toLowerCase()}`, context.request.url));

  let stale = null;
  try {
    const hit = await cache.match(key);
    if (hit) {
      const data = await hit.json();
      if (Date.now() - data.fetchedAt < ttlSeconds * 1000) return data;
      stale = data;
    }
  } catch {}

  try {
    const data = await fetchStats(username);
    const put = cache.put(
      key,
      new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'max-age=604800' },
      })
    );
    context.waitUntil(put.catch(() => {}));
    return data;
  } catch (error) {
    if (stale && error.status !== 404) return stale;
    throw error;
  }
}

// Deterministic sample data for the landing page preview.
export function demoStats() {
  const days = {};
  const today = Math.floor(Date.now() / 86400000);
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let d = 0; d < 365; d++) {
    const weekday = (today - d + 4) % 7;
    const busy = weekday > 0 && weekday < 6 ? 0.62 : 0.38;
    if (d < 9 || rand() < busy) days[(today - d) * 86400] = 1 + Math.floor(rand() ** 2 * 9);
  }
  return {
    username: 'your-name',
    name: '',
    ranking: 48213,
    avatar: null,
    solved: { all: 612, easy: 204, medium: 331, hard: 77 },
    total: { all: 3700, easy: 890, medium: 1930, hard: 880 },
    calendar: { days, activeDays: Object.keys(days).length, maxStreak: 41 },
    contest: { rating: 1874, topPercentage: 8.2, attended: 23 },
    fetchedAt: Date.now(),
  };
}
