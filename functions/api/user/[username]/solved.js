import { fetchLeetCode, queries, jsonResponse, errorResponse } from '../../../_shared/leetcode.js';

export async function onRequestGet({ params }) {
  const { username } = params;

  if (!username) {
    return errorResponse('Username is required', 400);
  }

  try {
    const data = await fetchLeetCode(queries.solved, { username });
    
    if (!data.matchedUser) {
      return errorResponse('User not found', 404);
    }

    const allQuestions = data.allQuestionsCount || [];
    const submissions = data.matchedUser.submitStatsGlobal?.acSubmissionNum || [];

    const getCount = (arr, diff) => arr.find(x => x.difficulty === diff)?.count || 0;

    return jsonResponse({
      solvedProblem: getCount(submissions, 'All'),
      easySolved: getCount(submissions, 'Easy'),
      mediumSolved: getCount(submissions, 'Medium'),
      hardSolved: getCount(submissions, 'Hard'),
      totalQuestions: getCount(allQuestions, 'All'),
      totalEasy: getCount(allQuestions, 'Easy'),
      totalMedium: getCount(allQuestions, 'Medium'),
      totalHard: getCount(allQuestions, 'Hard'),
    });
  } catch (error) {
    console.error('Solved error:', error);
    return errorResponse(error.message);
  }
}

