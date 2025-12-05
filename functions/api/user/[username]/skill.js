import { fetchLeetCode, queries, jsonResponse, errorResponse } from '../../../_shared/leetcode.js';

export async function onRequestGet({ params }) {
  const { username } = params;

  if (!username) {
    return errorResponse('Username is required', 400);
  }

  try {
    const data = await fetchLeetCode(queries.skills, { username });
    
    if (!data.matchedUser) {
      return errorResponse('User not found', 404);
    }

    const tags = data.matchedUser.tagProblemCounts || {};

    return jsonResponse({
      advanced: tags.advanced || [],
      intermediate: tags.intermediate || [],
      fundamental: tags.fundamental || [],
    });
  } catch (error) {
    console.error('Skill error:', error);
    return errorResponse(error.message);
  }
}

