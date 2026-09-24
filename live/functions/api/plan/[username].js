// GET /api/plan/:username → { plan: 'free' | 'pro' } for the builder UI.
import { getPlan } from '../../_lib/plan.js';

export async function onRequestGet({ params, env }) {
  const plan = await getPlan(env, String(params.username));
  return new Response(JSON.stringify({ plan: plan.id }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' },
  });
}
