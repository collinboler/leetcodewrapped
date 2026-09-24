// Plans are attached to a LeetCode username, so a Pro card stays Pro wherever it's embedded.
export const PLANS = {
  free: { id: 'free', ttl: 4 * 3600, branding: true, customColors: false },
  pro: { id: 'pro', ttl: 30 * 60, branding: false, customColors: true },
};

export async function getPlan(env, username) {
  const user = username.toLowerCase();

  // Manual comps: PRO_USERS="alice,bob" in the Pages env vars.
  const comped = (env.PRO_USERS || '').toLowerCase().split(',').map((s) => s.trim());
  if (comped.includes(user)) return PLANS.pro;

  // Paid: written by the payment webhook into the PRO KV namespace.
  if (env.PRO) {
    try {
      const record = await env.PRO.get(`user:${user}`, { type: 'json', cacheTtl: 300 });
      if (record && (!record.expiresAt || record.expiresAt > Date.now())) return PLANS.pro;
    } catch {}
  }

  return PLANS.free;
}
