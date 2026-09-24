// Polar (merchant of record) helpers: checkout sessions + webhook verification.
// Env: POLAR_ACCESS_TOKEN, POLAR_PRODUCT_ID, POLAR_WEBHOOK_SECRET, POLAR_SERVER=sandbox|production

const API = {
  sandbox: 'https://sandbox-api.polar.sh',
  production: 'https://api.polar.sh',
};

export function polarConfigured(env) {
  return Boolean(env.POLAR_ACCESS_TOKEN && env.POLAR_PRODUCT_ID);
}

export async function createCheckout(env, { username, successUrl }) {
  const base = API[env.POLAR_SERVER] || API.sandbox;
  const response = await fetch(`${base}/v1/checkouts/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.POLAR_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      products: [env.POLAR_PRODUCT_ID],
      success_url: successUrl,
      // Copied onto the resulting order, which is how the webhook knows who paid.
      metadata: { username },
    }),
  });
  if (!response.ok) {
    throw new Error(`Polar checkout failed: ${response.status} ${await response.text()}`);
  }
  const checkout = await response.json();
  return checkout.url;
}

// Standard Webhooks: HMAC-SHA256 over `${id}.${timestamp}.${body}`, base64, sent as "v1,<sig>".
// Secrets created before 2026-09-08 use the raw secret bytes as the key; newer
// `whsec_` secrets are base64 after the prefix. Try both, like Polar's SDK does.
export async function verifyWebhook(request, secret) {
  const id = request.headers.get('webhook-id');
  const timestamp = request.headers.get('webhook-timestamp');
  const signatures = (request.headers.get('webhook-signature') || '')
    .split(' ')
    .map((s) => s.split(',')[1])
    .filter(Boolean);
  const body = await request.text();

  if (!id || !timestamp || !signatures.length || !secret) return null;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 5 * 60) return null;

  const encoder = new TextEncoder();
  const keys = [encoder.encode(secret)];
  try {
    keys.push(Uint8Array.from(atob(secret.replace(/^whsec_/, '')), (c) => c.charCodeAt(0)));
  } catch {}

  const payload = encoder.encode(`${id}.${timestamp}.${body}`);
  for (const raw of keys) {
    const key = await crypto.subtle.importKey('raw', raw, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, payload));
    const expected = btoa(String.fromCharCode(...mac));
    if (signatures.some((sig) => timingSafeEqual(sig, expected))) {
      return JSON.parse(body);
    }
  }
  return null;
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
