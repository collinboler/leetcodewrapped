// GET /api/checkout?username=... → redirects to a Polar checkout for that LeetCode username.
import { findUser } from '../_lib/leetcode.js';
import { createCheckout, polarConfigured } from '../_lib/polar.js';

const USERNAME = /^[A-Za-z0-9_.-]{1,40}$/;

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const input = (url.searchParams.get('username') || '').trim();
  const back = (reason) => Response.redirect(`${url.origin}/?u=${encodeURIComponent(input)}&checkout=${reason}#pricing`, 303);

  if (!polarConfigured(env)) return back('unavailable');
  if (!USERNAME.test(input)) return back('invalid');

  try {
    // Pro is tied to the username, so make sure it's real (and use LeetCode's casing).
    const username = await findUser(input);
    if (!username) return back('not-found');

    const checkoutUrl = await createCheckout(env, {
      username,
      successUrl: `${url.origin}/?u=${encodeURIComponent(username)}&checkout=success`,
    });
    return Response.redirect(checkoutUrl, 303);
  } catch (error) {
    console.error('checkout error', error);
    return back('error');
  }
}
