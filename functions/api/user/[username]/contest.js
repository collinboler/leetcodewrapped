import { fetchLeetCode, queries, jsonResponse, errorResponse } from '../../../_shared/leetcode.js';

export async function onRequestGet({ params }) {
  const { username } = params;

  if (!username) {
    return errorResponse('Username is required', 400);
  }

  try {
    const data = await fetchLeetCode(queries.contest, { username });

    return jsonResponse({
      contestRanking: data.userContestRanking,
      contestHistory: data.userContestRankingHistory || [],
    });
  } catch (error) {
    console.error('Contest error:', error);
    return errorResponse(error.message);
  }
}

