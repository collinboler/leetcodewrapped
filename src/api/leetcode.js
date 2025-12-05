const BASE_URL = 'http://localhost:3000';

export async function fetchUserProfile(username) {
  const response = await fetch(`${BASE_URL}/${username}`);
  if (!response.ok) throw new Error('User not found');
  return response.json();
}

export async function fetchUserSolved(username) {
  const response = await fetch(`${BASE_URL}/${username}/solved`);
  if (!response.ok) throw new Error('Failed to fetch solved problems');
  return response.json();
}

export async function fetchUserBadges(username) {
  const response = await fetch(`${BASE_URL}/${username}/badges`);
  if (!response.ok) throw new Error('Failed to fetch badges');
  return response.json();
}

export async function fetchUserContest(username) {
  const response = await fetch(`${BASE_URL}/${username}/contest`);
  if (!response.ok) throw new Error('Failed to fetch contest data');
  return response.json();
}

export async function fetchUserContestHistory(username) {
  const response = await fetch(`${BASE_URL}/${username}/contest/history`);
  if (!response.ok) throw new Error('Failed to fetch contest history');
  return response.json();
}

export async function fetchUserCalendar(username) {
  const response = await fetch(`${BASE_URL}/${username}/calendar`);
  if (!response.ok) throw new Error('Failed to fetch calendar');
  return response.json();
}

export async function fetchUserSubmissions(username, limit = 100) {
  const response = await fetch(`${BASE_URL}/${username}/submission?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch submissions');
  return response.json();
}

export async function fetchUserLanguageStats(username) {
  const response = await fetch(`${BASE_URL}/${username}/language`);
  if (!response.ok) throw new Error('Failed to fetch language stats');
  return response.json();
}

export async function fetchUserSkillStats(username) {
  const response = await fetch(`${BASE_URL}/${username}/skill`);
  if (!response.ok) throw new Error('Failed to fetch skill stats');
  return response.json();
}

// Fetch all data in parallel - no rate limiting needed for local API
export async function fetchAllUserData(username) {
  const [profile, solved, badges, contest, contestHistory, calendar, submissions, languageStats, skillStats] = await Promise.allSettled([
    fetchUserProfile(username),
    fetchUserSolved(username),
    fetchUserBadges(username),
    fetchUserContest(username),
    fetchUserContestHistory(username),
    fetchUserCalendar(username),
    fetchUserSubmissions(username, 500),
    fetchUserLanguageStats(username),
    fetchUserSkillStats(username),
  ]);

  return {
    profile: profile.status === 'fulfilled' ? profile.value : null,
    solved: solved.status === 'fulfilled' ? solved.value : null,
    badges: badges.status === 'fulfilled' ? badges.value : null,
    contest: contest.status === 'fulfilled' ? contest.value : null,
    contestHistory: contestHistory.status === 'fulfilled' ? contestHistory.value : null,
    calendar: calendar.status === 'fulfilled' ? calendar.value : null,
    submissions: submissions.status === 'fulfilled' ? submissions.value : null,
    languageStats: languageStats.status === 'fulfilled' ? languageStats.value : null,
    skillStats: skillStats.status === 'fulfilled' ? skillStats.value : null,
  };
}
