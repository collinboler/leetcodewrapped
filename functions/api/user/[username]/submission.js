import { fetchLeetCode, queries, jsonResponse, errorResponse } from '../../../_shared/leetcode.js';

export async function onRequestGet({ params, request }) {
  const { username } = params;
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '20', 10);

  if (!username) {
    return errorResponse('Username is required', 400);
  }

  try {
    const data = await fetchLeetCode(queries.submissions, { username, limit });
    
    const submissions = data.recentSubmissionList || [];

    return jsonResponse({
      count: submissions.length,
      submission: submissions,
    });
  } catch (error) {
    console.error('Submission error:', error);
    return errorResponse(error.message);
  }
}

