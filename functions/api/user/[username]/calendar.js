import { fetchLeetCode, queries, jsonResponse, errorResponse } from '../../../_shared/leetcode.js';

export async function onRequestGet({ params }) {
  const { username } = params;

  if (!username) {
    return errorResponse('Username is required', 400);
  }

  try {
    const data = await fetchLeetCode(queries.calendar, { username });
    
    if (!data.matchedUser) {
      return errorResponse('User not found', 404);
    }

    const calendar = data.matchedUser.userCalendar || {};

    return jsonResponse({
      activeYears: calendar.activeYears || [],
      streak: calendar.streak || 0,
      totalActiveDays: calendar.totalActiveDays || 0,
      submissionCalendar: calendar.submissionCalendar || '{}',
    });
  } catch (error) {
    console.error('Calendar error:', error);
    return errorResponse(error.message);
  }
}

