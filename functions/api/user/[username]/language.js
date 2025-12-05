import { fetchLeetCode, queries, jsonResponse, errorResponse } from '../../../_shared/leetcode.js';

export async function onRequestGet({ params }) {
  const { username } = params;

  if (!username) {
    return errorResponse('Username is required', 400);
  }

  try {
    const data = await fetchLeetCode(queries.languages, { username });
    
    if (!data.matchedUser) {
      return errorResponse('User not found', 404);
    }

    return jsonResponse({
      languageProblemCount: data.matchedUser.languageProblemCount || [],
    });
  } catch (error) {
    console.error('Language error:', error);
    return errorResponse(error.message);
  }
}

