const ORIGIN = location.origin;
const USERNAME = /^[A-Za-z0-9_.-]{1,40}$/;
const DEFAULTS = { layout: 'card', theme: 'auto' };
const PLACEHOLDER = 'your-name';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const query = new URLSearchParams(location.search);
const state = {
  username: USERNAME.test(query.get('u') || '') ? query.get('u') : '',
  layout: ['card', 'compact', 'heatmap'].includes(query.get('layout')) ? query.get('layout') : DEFAULTS.layout,
  theme: ['auto', 'light', 'dark'].includes(query.get('theme')) ? query.get('theme') : DEFAULTS.theme,
  colors: {},
  tab: 'html',
  plan: 'free',
};

const els = {
  username: $('username'),
  preview: $('preview'),
  stage: $('stage'),
  note: $('preview-note'),
  snippet: $('snippet'),
  snippetHint: $('snippet-hint'),
  copy: $('copy'),
  badge: $('plan-badge'),
  colorsHint: $('colors-hint'),
  buy: $('buy'),
  buyHint: $('buy-hint'),
  toast: $('toast'),
};

/* ---------- urls & snippets ---------- */

function options() {
  const params = new URLSearchParams();
  if (state.layout !== DEFAULTS.layout) params.set('layout', state.layout);
  if (state.theme !== DEFAULTS.theme) params.set('theme', state.theme);
  for (const [key, value] of Object.entries(state.colors)) params.set(key, value);
  return params;
}

function cardUrl(username) {
  const query = options().toString();
  return `${ORIGIN}/u/${encodeURIComponent(username)}.svg${query ? `?${query}` : ''}`;
}

function previewUrl() {
  if (state.username) return cardUrl(state.username);
  const params = options();
  if (Object.keys(state.colors).length) params.set('pro', '1');
  const query = params.toString();
  return `${ORIGIN}/u/@demo.svg${query ? `?${query}` : ''}`;
}

const HINTS = {
  html: 'Works on any site. The SVG is inlined so heatmap tooltips work, and it refreshes while the page is open.',
  markdown: 'For GitHub READMEs and anywhere else that renders Markdown. GitHub caches images, so updates can take a bit longer to show.',
  url: 'Use it anywhere that accepts an image URL.',
};

function snippet() {
  const user = state.username || PLACEHOLDER;
  const url = cardUrl(user);
  const profile = `https://leetcode.com/u/${encodeURIComponent(user)}/`;

  if (state.tab === 'markdown') {
    const text = `[![LeetCode stats](${url})](${profile})`;
    return { text, html: `<span class="a">[![LeetCode stats]</span>(<span class="s">${esc(url)}</span>)<span class="a">]</span>(<span class="s">${esc(profile)}</span>)` };
  }

  if (state.tab === 'url') {
    return { text: url, html: `<span class="s">${esc(url)}</span>` };
  }

  const attrs = [['username', user], ...[...options()].map(([k, v]) => [k, k === 'layout' || k === 'theme' ? v : `#${v}`])];
  const text =
    `<script src="${ORIGIN}/embed.js" async></script>\n` +
    `<leetcode-stats ${attrs.map(([k, v]) => `${k}="${v}"`).join(' ')}></leetcode-stats>`;
  const attr = (k, v) => `<span class="a">${k}</span>=<span class="s">"${esc(v)}"</span>`;
  const html =
    `<span class="t">&lt;script</span> ${attr('src', `${ORIGIN}/embed.js`)} <span class="a">async</span><span class="t">&gt;&lt;/script&gt;</span>\n` +
    `<span class="t">&lt;leetcode-stats</span> ${attrs.map(([k, v]) => attr(k, v)).join(' ')}<span class="t">&gt;&lt;/leetcode-stats&gt;</span>`;
  return { text, html };
}

/* ---------- render ---------- */

function renderControls() {
  for (const group of document.querySelectorAll('.segmented')) {
    for (const button of group.querySelectorAll('button')) {
      button.setAttribute('aria-checked', String(button.dataset.value === state[group.dataset.key]));
    }
  }
  for (const tab of document.querySelectorAll('[role="tab"]')) {
    tab.setAttribute('aria-selected', String(tab.dataset.tab === state.tab));
  }
}

function renderPreview() {
  const src = previewUrl();
  if (els.preview.getAttribute('src') !== src) {
    els.stage.classList.add('loading');
    els.preview.src = src;
  }
  const refresh = state.plan === 'pro' ? 'refreshes every 30 minutes' : 'refreshes every 4 hours';
  els.note.textContent = state.username ? `Live card for ${state.username} · ${refresh}` : 'Sample data. Enter your username to see yours.';
}

function renderSnippet() {
  const { html } = snippet();
  els.snippet.innerHTML = html;
  els.snippetHint.textContent = HINTS[state.tab];
}

function renderPlan() {
  const pro = state.plan === 'pro';
  els.badge.hidden = !pro;

  if (!state.username) {
    els.colorsHint.textContent = 'Colors apply to cards with Pro. The sample shows how they look.';
  } else {
    els.colorsHint.textContent = pro ? `${state.username} has Pro, so colors are live.` : `Colors apply once ${state.username} has Pro.`;
  }

  if (pro) {
    els.buy.textContent = `${state.username} already has Pro`;
    els.buy.setAttribute('aria-disabled', 'true');
    els.buy.removeAttribute('href');
  } else {
    els.buy.textContent = state.username ? `Get Pro for ${state.username}` : 'Get Pro';
    els.buy.removeAttribute('aria-disabled');
    els.buy.href = `/api/checkout?username=${encodeURIComponent(state.username)}`;
  }
  els.buyHint.textContent = 'Pro is linked to the username in the builder above.';
}

function syncUrl() {
  const params = new URLSearchParams();
  if (state.username) params.set('u', state.username);
  if (state.layout !== DEFAULTS.layout) params.set('layout', state.layout);
  if (state.theme !== DEFAULTS.theme) params.set('theme', state.theme);
  const query = params.toString();
  history.replaceState(null, '', `${location.pathname}${query ? `?${query}` : ''}${location.hash}`);
}

function render() {
  renderControls();
  renderPreview();
  renderSnippet();
  renderPlan();
  syncUrl();
}

/* ---------- plan lookup ---------- */

let planRequest = 0;
async function loadPlan() {
  const id = ++planRequest;
  state.plan = 'free';
  if (!state.username) return renderPlan();
  try {
    const response = await fetch(`/api/plan/${encodeURIComponent(state.username)}`);
    const { plan } = await response.json();
    if (id === planRequest) state.plan = plan;
  } catch {}
  if (id === planRequest) {
    renderPlan();
    renderPreview();
  }
}

/* ---------- events ---------- */

els.username.value = state.username;

let typing;
els.username.addEventListener('input', () => {
  clearTimeout(typing);
  typing = setTimeout(() => {
    const value = els.username.value.trim().replace(/^@/, '');
    if (value && !USERNAME.test(value)) {
      els.note.textContent = 'Usernames only use letters, numbers, and - _ .';
      return;
    }
    state.username = value;
    render();
    loadPlan();
  }, 400);
});

document.querySelectorAll('.segmented').forEach((group) => {
  group.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    state[group.dataset.key] = button.dataset.value;
    render();
  });
});

document.querySelectorAll('[role="tab"]').forEach((tab) => {
  tab.addEventListener('click', () => {
    state.tab = tab.dataset.tab;
    render();
  });
});

document.querySelectorAll('[data-color]').forEach((input) => {
  input.addEventListener('input', () => {
    state.colors[input.dataset.color] = input.value.slice(1);
    render();
  });
});

$('reset-colors').addEventListener('click', () => {
  state.colors = {};
  document.querySelectorAll('[data-color]').forEach((input) => (input.value = input.defaultValue));
  render();
});

els.preview.addEventListener('load', () => els.stage.classList.remove('loading'));
els.preview.addEventListener('error', () => {
  els.stage.classList.remove('loading');
  els.note.textContent = "Couldn't load the preview. Try again in a moment.";
});

let copied;
els.copy.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(snippet().text);
    els.copy.classList.add('done');
    els.copy.querySelector('span').textContent = 'Copied';
    clearTimeout(copied);
    copied = setTimeout(() => {
      els.copy.classList.remove('done');
      els.copy.querySelector('span').textContent = 'Copy';
    }, 1600);
  } catch {}
});

els.buy.addEventListener('click', (event) => {
  if (state.plan === 'pro') return event.preventDefault();
  if (!state.username) {
    event.preventDefault();
    els.buyHint.textContent = 'Enter your LeetCode username in the builder first.';
    $('builder').scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => els.username.focus({ preventScroll: true }), 400);
  }
});

/* ---------- checkout return ---------- */

const CHECKOUT_MESSAGES = {
  success: (u) => [`Payment received. ${u} is now Pro, and cards pick it up within a few minutes.`, 'success'],
  'not-found': (u) => [`We couldn't find a LeetCode profile named “${u}”.`],
  invalid: () => ["That doesn't look like a LeetCode username."],
  unavailable: () => ["Checkout isn't open yet. Check back soon."],
  error: () => ["Couldn't start checkout. Please try again."],
};

const checkout = query.get('checkout');
if (CHECKOUT_MESSAGES[checkout]) {
  const [message, tone] = CHECKOUT_MESSAGES[checkout](query.get('u') || 'your account');
  els.toast.textContent = message;
  els.toast.className = `toast ${tone || ''}`;
  els.toast.hidden = false;
  if (!location.hash) location.hash = 'pricing';
}

render();
loadPlan();
