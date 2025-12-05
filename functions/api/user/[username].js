import { fetchLeetCode, queries, jsonResponse, errorResponse } from '../../_shared/leetcode.js';

export async function onRequestGet({ params }) {
  const { username } = params;

  if (!username) {
    return errorResponse('Username is required', 400);
  }

  try {
    const data = await fetchLeetCode(queries.profile, { username });
    
    if (!data.matchedUser) {
      return errorResponse('User not found', 404);
    }

    const user = data.matchedUser;
    const profile = user.profile || {};

    return jsonResponse({
      username: user.username,
      name: profile.realName,
      birthday: profile.birthday,
      avatar: profile.userAvatar,
      ranking: profile.ranking,
      reputation: profile.reputation,
      gitHub: user.githubUrl,
      twitter: user.twitterUrl,
      linkedIN: user.linkedinUrl,
      website: profile.websites || [],
      country: profile.countryName,
      company: profile.company,
      school: profile.school,
      skillTags: profile.skillTags || [],
      about: profile.aboutMe,
    });
  } catch (error) {
    console.error('Profile error:', error);
    return errorResponse(error.message);
  }
}

