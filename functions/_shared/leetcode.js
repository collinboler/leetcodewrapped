// Shared utility for LeetCode GraphQL requests
const LEETCODE_API = 'https://leetcode.com/graphql';

export async function fetchLeetCode(query, variables = {}) {
  const response = await fetch(LEETCODE_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Referer': 'https://leetcode.com',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`LeetCode API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(data.errors[0]?.message || 'GraphQL error');
  }

  return data.data;
}

// Helper to create JSON response with caching
export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}

export function errorResponse(message, status = 500) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// GraphQL Queries
export const queries = {
  profile: `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          realName
          userAvatar
          birthday
          ranking
          reputation
          websites
          countryName
          company
          school
          skillTags
          aboutMe
        }
        githubUrl
        twitterUrl
        linkedinUrl
      }
    }
  `,

  solved: `
    query userProblemsSolved($username: String!) {
      allQuestionsCount {
        difficulty
        count
      }
      matchedUser(username: $username) {
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `,

  calendar: `
    query userProfileCalendar($username: String!, $year: Int) {
      matchedUser(username: $username) {
        userCalendar(year: $year) {
          activeYears
          streak
          totalActiveDays
          submissionCalendar
        }
      }
    }
  `,

  languages: `
    query languageStats($username: String!) {
      matchedUser(username: $username) {
        languageProblemCount {
          languageName
          problemsSolved
        }
      }
    }
  `,

  skills: `
    query skillStats($username: String!) {
      matchedUser(username: $username) {
        tagProblemCounts {
          advanced {
            tagName
            tagSlug
            problemsSolved
          }
          intermediate {
            tagName
            tagSlug
            problemsSolved
          }
          fundamental {
            tagName
            tagSlug
            problemsSolved
          }
        }
      }
    }
  `,

  submissions: `
    query recentSubmissions($username: String!, $limit: Int) {
      recentSubmissionList(username: $username, limit: $limit) {
        title
        titleSlug
        timestamp
        statusDisplay
        lang
      }
    }
  `,

  badges: `
    query userBadges($username: String!) {
      matchedUser(username: $username) {
        badges {
          id
          name
          shortName
          displayName
          icon
          hoverText
          medal {
            slug
            config {
              iconGif
              iconGifBackground
            }
          }
          creationDate
          category
        }
        upcomingBadges {
          name
          icon
          progress
        }
      }
    }
  `,

  contest: `
    query userContestRankingInfo($username: String!) {
      userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
        totalParticipants
        topPercentage
        badge {
          name
        }
      }
      userContestRankingHistory(username: $username) {
        attended
        trendDirection
        problemsSolved
        totalProblems
        finishTimeInSeconds
        rating
        ranking
        contest {
          title
          startTime
        }
      }
    }
  `,
};

