import { fetchLeetCode, queries, jsonResponse, errorResponse } from '../../../_shared/leetcode.js';

export async function onRequestGet({ params }) {
  const { username } = params;

  if (!username) {
    return errorResponse('Username is required', 400);
  }

  try {
    const data = await fetchLeetCode(queries.badges, { username });
    
    if (!data.matchedUser) {
      return errorResponse('User not found', 404);
    }

    return jsonResponse({
      badges: data.matchedUser.badges || [],
      upcomingBadges: data.matchedUser.upcomingBadges || [],
      badgesCount: (data.matchedUser.badges || []).length,
    });
  } catch (error) {
    console.error('Badges error:', error);
    return errorResponse(error.message);
  }
}

