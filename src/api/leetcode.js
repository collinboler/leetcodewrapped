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

export async function fetchUserSubmissions(username, limit = 20) {
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

// Fetch problem details (difficulty and tags)
export async function fetchProblemDetails(titleSlug) {
  try {
    const response = await fetch(`${BASE_URL}/select?titleSlug=${titleSlug}`);
    if (!response.ok) return null;
    return response.json();
  } catch (e) {
    return null;
  }
}

// Fetch problem details for multiple problems (all in parallel for speed)
async function fetchProblemDetailsForSlugs(titleSlugs) {
  const problemDetails = new Map();
  
  // Fetch ALL in parallel for maximum speed
  const results = await Promise.all(
    titleSlugs.map(slug => fetchProblemDetails(slug))
  );
  
  titleSlugs.forEach((slug, index) => {
    if (results[index]) {
      problemDetails.set(slug, results[index]);
    }
  });
  
  return problemDetails;
}

// Fetch ALL submissions with authentication (requires session cookie)
// Uses parallel pagination for speed
export async function fetchAllSubmissions(sessionCookie, totalNeeded) {
  const limit = 20; // LeetCode caps at 20 per request
  const numPages = Math.ceil(totalNeeded / limit);
  
  // Create all page requests in parallel
  const pagePromises = [];
  for (let page = 0; page < numPages; page++) {
    const offset = page * limit;
    pagePromises.push(
      fetch(`${BASE_URL}/submissions/all?offset=${offset}&limit=${limit}`, {
        headers: {
          'x-leetcode-session': sessionCookie,
        },
      }).then(res => res.ok ? res.json() : null)
    );
  }
  
  // Wait for all pages in parallel
  const results = await Promise.all(pagePromises);
  
  // Combine all submissions
  const allSubmissions = [];
  results.forEach(data => {
    if (data?.submissions) {
      allSubmissions.push(...data.submissions);
    }
  });

  return { submission: allSubmissions, count: allSubmissions.length };
}

// Calculate total submissions in a year from calendar data
function getYearSubmissionCount(calendarData, year) {
  const submissionCalendar = calendarData?.submissionCalendar;
  if (!submissionCalendar) return 0;

  let calendar = {};
  try {
    calendar = typeof submissionCalendar === 'string' 
      ? JSON.parse(submissionCalendar) 
      : submissionCalendar;
  } catch (e) {
    return 0;
  }

  let total = 0;
  Object.entries(calendar).forEach(([timestamp, count]) => {
    const date = new Date(parseInt(timestamp) * 1000);
    if (date.getUTCFullYear() === year) {
      total += count;
    }
  });

  return total;
}

// Process submissions to get 2025 stats
async function process2025Submissions(submissions) {
  const YEAR = 2025;
  
  // Filter to 2025 submissions only
  const submissions2025 = submissions.filter(sub => {
    const date = new Date(parseInt(sub.timestamp) * 1000);
    return date.getUTCFullYear() === YEAR;
  });

  // Get unique accepted problems in 2025
  const acceptedProblems = new Map(); // titleSlug -> problem info
  const allAttempts = new Map(); // titleSlug -> array of all attempts
  
  submissions2025.forEach(sub => {
    const slug = sub.titleSlug;
    
    // Track all attempts
    if (!allAttempts.has(slug)) {
      allAttempts.set(slug, []);
    }
    allAttempts.get(slug).push(sub);
    
    // Track accepted problems (first accepted submission)
    if (sub.statusDisplay === 'Accepted' && !acceptedProblems.has(slug)) {
      acceptedProblems.set(slug, sub);
    }
  });

  // Fetch problem details for all unique accepted problems (difficulty + tags)
  const uniqueSlugs = Array.from(acceptedProblems.keys());
  console.log(`Fetching problem details for ${uniqueSlugs.length} problems...`);
  const problemDetails = await fetchProblemDetailsForSlugs(uniqueSlugs);

  // Calculate difficulty breakdown for 2025
  const difficulty2025 = { easy: 0, medium: 0, hard: 0 };
  const topics2025 = {};
  
  acceptedProblems.forEach((sub, slug) => {
    const details = problemDetails.get(slug);
    if (details) {
      // Count difficulty
      const diff = details.difficulty?.toLowerCase();
      if (diff === 'easy') difficulty2025.easy++;
      else if (diff === 'medium') difficulty2025.medium++;
      else if (diff === 'hard') difficulty2025.hard++;
      
      // Count topics
      if (details.topicTags && Array.isArray(details.topicTags)) {
        details.topicTags.forEach(tag => {
          const tagName = tag.name || tag;
          topics2025[tagName] = (topics2025[tagName] || 0) + 1;
        });
      }
    }
  });

  // Convert topics to sorted array
  const topicsList2025 = Object.entries(topics2025)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Calculate language stats from 2025 accepted submissions
  const languageCount = {};
  acceptedProblems.forEach((sub) => {
    const lang = sub.lang;
    languageCount[lang] = (languageCount[lang] || 0) + 1;
  });

  const languageProblemCount = Object.entries(languageCount)
    .map(([languageName, problemsSolved]) => ({ languageName, problemsSolved }))
    .sort((a, b) => b.problemsSolved - a.problemsSolved);

  // Find most retried problem (most attempts before first accept)
  let mostRetried = null;
  let maxRetries = 0;
  
  allAttempts.forEach((attempts, slug) => {
    // Sort by timestamp
    attempts.sort((a, b) => parseInt(a.timestamp) - parseInt(b.timestamp));
    
    // Count attempts before first accept
    let retriesBeforeAccept = 0;
    for (const attempt of attempts) {
      if (attempt.statusDisplay === 'Accepted') break;
      retriesBeforeAccept++;
    }
    
    // Only count if eventually accepted
    const wasAccepted = attempts.some(a => a.statusDisplay === 'Accepted');
    if (wasAccepted && retriesBeforeAccept > maxRetries) {
      maxRetries = retriesBeforeAccept;
      mostRetried = {
        title: attempts[0].title,
        titleSlug: slug,
        attempts: attempts.length,
        retriesBeforeAccept,
      };
    }
  });

  // Top problems by submission count
  const problemsByAttempts = Array.from(allAttempts.entries())
    .map(([slug, attempts]) => ({
      title: attempts[0].title,
      titleSlug: slug,
      totalSubmissions: attempts.length,
      accepted: attempts.some(a => a.statusDisplay === 'Accepted'),
    }))
    .sort((a, b) => b.totalSubmissions - a.totalSubmissions)
    .slice(0, 5);

  return {
    uniqueProblemsSolved: acceptedProblems.size,
    totalSubmissions: submissions2025.length,
    languageStats2025: { languageProblemCount },
    difficulty2025,
    topics2025: topicsList2025,
    mostRetried,
    topProblemsByAttempts: problemsByAttempts,
    submissions2025,
  };
}

// Fetch all data in parallel - no rate limiting needed for local API
export async function fetchAllUserData(username, sessionCookie = null) {
  const YEAR = 2025;

  // First fetch calendar to know how many submissions we need
  const calendar = await fetchUserCalendar(username);
  
  // Get total submissions in 2025 from calendar
  const totalSubmissions2025 = getYearSubmissionCount(calendar, YEAR);
  console.log(`Total submissions in ${YEAR} from calendar: ${totalSubmissions2025}`);

  // Fetch base data in parallel
  const basePromises = [
    fetchUserProfile(username),
    fetchUserSolved(username),
    fetchUserBadges(username),
    fetchUserContest(username),
    fetchUserContestHistory(username),
    fetchUserLanguageStats(username),
    fetchUserSkillStats(username),
  ];

  const [profile, solved, badges, contest, contestHistory, languageStats, skillStats] = 
    await Promise.allSettled(basePromises);

  let submissions = null;
  let yearlyStats = null;

  // If authenticated, fetch all submissions for the year
  if (sessionCookie && totalSubmissions2025 > 0) {
    try {
      console.log(`Fetching ${totalSubmissions2025} submissions with auth...`);
      const allSubs = await fetchAllSubmissions(sessionCookie, totalSubmissions2025);
      submissions = allSubs;
      
      // Process to get 2025-specific stats (now async)
      yearlyStats = await process2025Submissions(allSubs.submission);
      console.log(`Processed ${yearlyStats.uniqueProblemsSolved} unique problems solved in ${YEAR}`);
    } catch (e) {
      console.error('Failed to fetch authenticated submissions:', e);
      // Fall back to unauthenticated
      const unauthSubs = await fetchUserSubmissions(username, 20);
      submissions = unauthSubs;
    }
  } else {
    // Unauthenticated - just get last 20
    const unauthSubs = await fetchUserSubmissions(username, 20);
    submissions = unauthSubs.status === 'fulfilled' ? unauthSubs.value : unauthSubs;
  }

  return {
    profile: profile.status === 'fulfilled' ? profile.value : null,
    solved: solved.status === 'fulfilled' ? solved.value : null,
    badges: badges.status === 'fulfilled' ? badges.value : null,
    contest: contest.status === 'fulfilled' ? contest.value : null,
    contestHistory: contestHistory.status === 'fulfilled' ? contestHistory.value : null,
    calendar,
    submissions,
    languageStats: languageStats.status === 'fulfilled' ? languageStats.value : null,
    skillStats: skillStats.status === 'fulfilled' ? skillStats.value : null,
    // 2025-specific stats (only available with auth)
    yearlyStats,
  };
}
