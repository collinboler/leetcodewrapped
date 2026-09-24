// POST /api/webhooks/polar — grants/revokes Pro in the PRO KV namespace.
// Cloudflare Bot Fight Mode blocks Polar's deliveries, so keep it off for this zone.
import { verifyWebhook } from '../../_lib/polar.js';

export async function onRequestPost({ request, env }) {
  const event = await verifyWebhook(request, env.POLAR_WEBHOOK_SECRET);
  if (!event) return new Response('invalid signature', { status: 401 });
  if (!env.PRO) return new Response('PRO KV namespace not bound', { status: 500 });

  const order = event.data || {};
  const username = order.metadata?.username?.toLowerCase();
  if (!username) return new Response('ignored: no username', { status: 202 });

  if (event.type === 'order.paid') {
    await env.PRO.put(
      `user:${username}`,
      JSON.stringify({
        plan: 'pro',
        orderId: order.id,
        customerId: order.customer_id,
        since: Date.now(),
      })
    );
  } else if (event.type === 'order.refunded' && order.status === 'refunded') {
    await env.PRO.delete(`user:${username}`);
  }

  return new Response('ok');
}
