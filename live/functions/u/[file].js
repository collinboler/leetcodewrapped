// GET /u/:username.svg?layout=card|compact|heatmap&theme=auto|light|dark
import { getStats, demoStats } from '../_lib/leetcode.js';
import { getPlan, PLANS } from '../_lib/plan.js';
import { parseOptions, render, renderError } from '../_lib/render.js';

const USERNAME = /^[A-Za-z0-9_.-]{1,40}$/;

export async function onRequestGet(context) {
  const { params, request, env } = context;
  const url = new URL(request.url);
  let username = String(params.file);
  try {
    username = decodeURIComponent(username);
  } catch {}
  username = username.replace(/\.svg$/i, '');
  const options = parseOptions(url.searchParams);

  // Landing page preview; ?pro=1 shows what the Pro card looks like.
  if (username === '@demo') {
    const plan = url.searchParams.get('pro') === '1' ? PLANS.pro : PLANS.free;
    return svg(render(demoStats(), options, plan), 3600);
  }

  if (!USERNAME.test(username)) {
    return svg(renderError('Invalid username', 'Use your LeetCode handle, e.g. /u/your-name.svg', options), 60, false);
  }

  const plan = await getPlan(env, username);

  try {
    const stats = await getStats(context, username, plan.ttl);
    return svg(render(stats, options, plan), plan.ttl);
  } catch (error) {
    if (error.status === 404) {
      return svg(renderError('User not found', `No LeetCode profile named "${username}"`, options), 300, false);
    }
    console.error('card error', username, error);
    return svg(renderError('LeetCode is not responding', 'Stats will be back shortly', options), 60, false);
  }
}

// Errors still return 200 so the embed shows a readable card instead of a broken image.
function svg(body, maxAge, ok = true) {
  return new Response(body, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': `public, max-age=${maxAge}, s-maxage=${maxAge}${ok ? ', stale-while-revalidate=86400' : ''}`,
      'Access-Control-Allow-Origin': '*',
      'Content-Security-Policy': "default-src 'none'; img-src data:; style-src 'unsafe-inline'",
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
