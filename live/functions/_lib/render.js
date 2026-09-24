// SVG renderers. Everything is inline (styles, avatar) because SVGs loaded
// through <img> can't fetch external resources.

const FONT = `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif`;
const DIFFICULTY = { easy: '#1cbaba', medium: '#ffb700', hard: '#f63737' };
// Label text needs darker shades to stay readable on light backgrounds.
const DIFFICULTY_TEXT = {
  light: { easy: '#0b9393', medium: '#c47f00', hard: '#e02d3c' },
  dark: DIFFICULTY,
};
const THEMES = {
  light: { bg: '#ffffff', border: '#e6e6ea', text: '#18181b', muted: '#71717a', track: '#f0f0f3', accent: '#ffa116' },
  dark: { bg: '#0f0f12', border: '#26262c', text: '#f4f4f5', muted: '#8b8b95', track: '#1e1e24', accent: '#ffa116' },
};
const LAYOUTS = ['card', 'compact', 'heatmap'];
const HEX = /^[0-9a-f]{3}([0-9a-f]{3})?$/i;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function parseOptions(params) {
  const color = (key) => (HEX.test(params.get(key) || '') ? `#${params.get(key)}` : null);
  return {
    layout: LAYOUTS.includes(params.get('layout')) ? params.get('layout') : 'card',
    theme: ['light', 'dark'].includes(params.get('theme')) ? params.get('theme') : 'auto',
    bg: color('bg'),
    text: color('text'),
    accent: color('accent'),
  };
}

export function render(stats, options, plan) {
  const ctx = { stats, plan, id: `lc${Math.random().toString(36).slice(2, 8)}` };
  if (options.layout === 'compact') return compact(ctx, options);
  if (options.layout === 'heatmap') return heatmap(ctx, options);
  return card(ctx, options);
}

export function renderError(message, hint, options) {
  const W = 500;
  const H = 108;
  const body = `
    <circle cx="44" cy="54" r="16" class="tr"/>
    <text x="44" y="60" text-anchor="middle" font-size="16" class="b" style="fill:${DIFFICULTY.hard}">!</text>
    <text x="74" y="50" font-size="14" class="b">${esc(message)}</text>
    <text x="74" y="69" font-size="12" class="mu">${esc(hint)}</text>`;
  return frame(W, H, options, body, { plan: { branding: true } }, message);
}

/* ---------- layouts ---------- */

function card({ stats: s, plan, id }, options) {
  const W = 500;
  const H = 262;
  const P = 24;

  const sub = [s.ranking ? `Rank #${fmt(s.ranking)}` : null, s.contest?.topPercentage ? `Top ${s.contest.topPercentage}%` : null]
    .filter(Boolean)
    .join('  ·  ');

  const header = `
    ${avatar(s, P, P, 40, id)}
    <text x="76" y="41" font-size="16" class="b">${esc(truncate(s.username, 24))}</text>
    <text x="76" y="59" font-size="12" class="mu">${esc(sub || 'LeetCode')}</text>
    ${live(W - P, 41, plan)}`;

  const rows = ['easy', 'medium', 'hard']
    .map((key, i) => {
      const y = 98 + i * 30;
      const x0 = 136;
      const width = W - P - x0;
      const fill = s.total[key] ? Math.max(s.solved[key] ? 3 : 0, (s.solved[key] / s.total[key]) * width) : 0;
      return `
    <text x="${x0}" y="${y}" font-size="12" class="b d-${key}">${cap(key)}</text>
    <text x="${W - P}" y="${y}" font-size="12" text-anchor="end" class="num"><tspan class="b">${fmt(s.solved[key])}</tspan><tspan class="mu"> / ${fmt(s.total[key])}</tspan></text>
    <rect x="${x0}" y="${y + 7}" width="${width}" height="5" rx="2.5" class="tr"/>
    <rect x="${x0}" y="${y + 7}" width="${fill.toFixed(1)}" height="5" rx="2.5" class="bar" style="fill:${DIFFICULTY[key]};animation-delay:${0.15 + i * 0.1}s"/>`;
    })
    .join('');

  const body = `
    ${ring(s, 64, 128, 36)}
    ${rows}`;

  const cal = calendarStats(s.calendar);
  const tiles = [
    [fmt(cal.currentStreak), 'Current streak'],
    [fmt(s.calendar.maxStreak), 'Max streak'],
    [fmt(s.calendar.activeDays), 'Active days'],
    [s.contest ? fmt(s.contest.rating) : '—', 'Contest rating'],
  ]
    .map(
      ([value, label], i) => `
    <g class="in" style="animation-delay:${0.3 + i * 0.06}s">
      <text x="${P + i * 112}" y="222" font-size="18" class="b num">${value}</text>
      <text x="${P + i * 112}" y="240" font-size="11" class="mu">${label}</text>
    </g>`
    )
    .join('');

  const footer = `
    <line x1="${P}" y1="192.5" x2="${W - P}" y2="192.5" class="bds"/>
    ${tiles}`;

  return frame(W, H, options, header + body + footer, { plan }, `${s.username}'s LeetCode stats: ${s.solved.all} problems solved`);
}

function compact({ stats: s, plan }, options) {
  const W = 460;
  const H = 96;
  const x0 = 120;
  const x1 = W - 24;
  const width = x1 - x0;

  const keys = ['easy', 'medium', 'hard'].filter((k) => s.solved[k] > 0);
  const gap = 2;
  const usable = width - gap * Math.max(0, keys.length - 1);
  let x = x0;
  const segments = keys
    .map((key, i) => {
      const w = (s.solved[key] / s.solved.all) * usable;
      const rect = `<rect x="${x.toFixed(1)}" y="44" width="${w.toFixed(1)}" height="6" rx="3" class="bar" style="fill:${DIFFICULTY[key]};animation-delay:${0.1 + i * 0.12}s"/>`;
      x += w + gap;
      return rect;
    })
    .join('');

  const legend = ['easy', 'medium', 'hard']
    .map((key, i) => {
      const lx = x0 + i * 102;
      return `
    <circle cx="${lx + 3.5}" cy="70" r="3.5" style="fill:${DIFFICULTY[key]}"/>
    <text x="${lx + 12}" y="74" font-size="11" class="num"><tspan class="b">${fmt(s.solved[key])}</tspan><tspan class="mu"> ${cap(key)}</tspan></text>`;
    })
    .join('');

  const body = `
    <g class="in">
      <text x="24" y="50" font-size="28" class="b num">${fmt(s.solved.all)}</text>
      <text x="24" y="67" font-size="11" class="mu">solved</text>
    </g>
    <text x="${x0}" y="32" font-size="13" class="b">${esc(truncate(s.username, 18))}</text>
    ${live(x1, 32, plan)}
    <rect x="${x0}" y="44" width="${width}" height="6" rx="3" class="tr"/>
    ${segments}
    ${legend}`;

  return frame(W, H, options, body, { plan }, `${s.username}'s LeetCode stats: ${s.solved.all} problems solved`);
}

function heatmap({ stats: s, plan }, options) {
  const WEEKS = 53;
  const STEP = 13;
  const CELL = 10;
  const P = 24;
  const gx = P + 28;
  const gy = 80;
  const W = gx + WEEKS * STEP - (STEP - CELL) + P;
  const H = 216;

  const today = Math.floor(Date.now() / 86400000);
  const start = today - weekday(today) - (WEEKS - 1) * 7;
  const counts = dayCounts(s.calendar.days);
  let max = 0;
  let total = 0;
  for (let d = start; d <= today; d++) {
    const c = counts.get(d) || 0;
    max = Math.max(max, c);
    total += c;
  }
  const level = (c) => (c <= 0 ? 0 : Math.min(4, Math.ceil((c / max) * 4)));

  let grid = '';
  let months = '';
  for (let w = 0; w < WEEKS; w++) {
    const first = start + w * 7;
    const date = new Date(first * 86400000);
    if (date.getUTCDate() <= 7 && w < WEEKS - 2) {
      months += `<text x="${gx + w * STEP}" y="70" font-size="10" class="mu">${MONTHS[date.getUTCMonth()]}</text>`;
    }
    let cells = '';
    for (let r = 0; r < 7; r++) {
      const d = first + r;
      if (d > today) break;
      const c = counts.get(d) || 0;
      const label = `${c ? `${fmt(c)} submission${c === 1 ? '' : 's'}` : 'No submissions'} on ${formatDate(d)}`;
      cells += `<rect x="${gx + w * STEP}" y="${gy + r * STEP}" width="${CELL}" height="${CELL}" rx="2" class="h${level(c)}"><title>${label}</title></rect>`;
    }
    grid += `<g class="in" style="animation-delay:${(w * 0.012).toFixed(3)}s">${cells}</g>`;
  }

  const days = [
    [1, 'Mon'],
    [3, 'Wed'],
    [5, 'Fri'],
  ]
    .map(([r, label]) => `<text x="${P}" y="${gy + r * STEP + 9}" font-size="10" class="mu">${label}</text>`)
    .join('');

  const cal = calendarStats(s.calendar);
  const fy = gy + 7 * STEP - (STEP - CELL) + 26;
  const legendX = W - P - 34 - 5 * STEP;
  const legend = [0, 1, 2, 3, 4]
    .map((l) => `<rect x="${legendX + l * STEP}" y="${fy - 9}" width="${CELL}" height="${CELL}" rx="2" class="h${l}"/>`)
    .join('');

  const body = `
    <text x="${P}" y="40" font-size="15"><tspan class="b">${esc(truncate(s.username, 24))}</tspan><tspan class="mu" dx="10" font-size="13">${fmt(total)} submissions in the past year</tspan></text>
    ${live(W - P, 40, plan)}
    ${months}
    ${days}
    ${grid}
    <text x="${P}" y="${fy}" font-size="11" class="mu num">${fmt(s.calendar.activeDays)} active days  ·  ${fmt(cal.currentStreak)} current streak  ·  ${fmt(s.calendar.maxStreak)} max streak</text>
    <text x="${legendX - 6}" y="${fy}" font-size="10" text-anchor="end" class="mu">Less</text>
    ${legend}
    <text x="${W - P}" y="${fy}" font-size="10" text-anchor="end" class="mu">More</text>`;

  return frame(W, H, options, body, { plan }, `${s.username}'s LeetCode activity: ${total} submissions in the past year`);
}

/* ---------- pieces ---------- */

function frame(W, H, options, body, { plan }, title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" role="img" aria-label="${esc(title)}">
  <title>${esc(title)}</title>
  <style>${styles(options, plan)}</style>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="14" class="bg"/>
  ${body}
</svg>`;
}

function styles(options, plan) {
  const custom = plan.customColors && (options.bg || options.text || options.accent);
  let schemes;
  if (custom) {
    const base = options.theme !== 'auto' ? options.theme : options.bg && luminance(options.bg) < 0.4 ? 'dark' : 'light';
    schemes = [palette({ ...THEMES[base], ...pick(options, base) })];
  } else if (options.theme === 'auto') {
    schemes = [palette(THEMES.light), palette(THEMES.dark)];
  } else {
    schemes = [palette(THEMES[options.theme])];
  }

  const vars = (p) =>
    `--bg:${p.bg};--bd:${p.border};--fg:${p.text};--mu:${p.muted};--tr:${p.track};--ac:${p.accent};` +
    `--de:${p.difficulty.easy};--dm:${p.difficulty.medium};--dh:${p.difficulty.hard};` +
    p.heat.map((c, i) => `--h${i}:${c}`).join(';');

  return `
    svg{${vars(schemes[0])}}
    ${schemes[1] ? `@media (prefers-color-scheme:dark){svg{${vars(schemes[1])}}}` : ''}
    text{font-family:${FONT};fill:var(--fg)}
    .b{font-weight:600}
    .num{font-variant-numeric:tabular-nums}
    .mu{fill:var(--mu)}
    .bg{fill:var(--bg);stroke:var(--bd)}
    .bds{stroke:var(--bd)}
    .tr{fill:var(--tr)}
    .ac{fill:var(--ac)}
    .d-easy{fill:var(--de)}.d-medium{fill:var(--dm)}.d-hard{fill:var(--dh)}
    .h0{fill:var(--h0)}.h1{fill:var(--h1)}.h2{fill:var(--h2)}.h3{fill:var(--h3)}.h4{fill:var(--h4)}
    .bar{transform-box:fill-box;transform-origin:left center;animation:grow 1s cubic-bezier(.22,1,.36,1) both}
    .seg{animation:draw 1.2s cubic-bezier(.22,1,.36,1) both}
    .in{animation:fade .6s ease both}
    .pulse{transform-box:fill-box;transform-origin:center;animation:pulse 2s ease-out infinite}
    @keyframes grow{from{transform:scaleX(0)}}
    @keyframes draw{from{stroke-dasharray:0 1000}}
    @keyframes fade{from{opacity:0}}
    @keyframes pulse{0%{transform:scale(1);opacity:.55}100%{transform:scale(3.2);opacity:0}}
    @media (prefers-reduced-motion:reduce){*{animation:none!important}}`;
}

// Custom colors fill in only what was supplied; the rest is derived so contrast holds.
function pick(options, base) {
  const out = {};
  const bg = options.bg || THEMES[base].bg;
  const text = options.text || THEMES[base].text;
  if (options.bg || options.text) {
    out.bg = bg;
    out.text = text;
    out.muted = mix(text, bg, 0.45);
    out.border = mix(bg, text, 0.12);
    out.track = mix(bg, text, 0.07);
  }
  if (options.accent) out.accent = options.accent;
  return out;
}

function palette(t) {
  const difficulty = luminance(t.bg) < 0.4 ? DIFFICULTY_TEXT.dark : DIFFICULTY_TEXT.light;
  return { ...t, difficulty, heat: [t.track, mix(t.track, t.accent, 0.3), mix(t.track, t.accent, 0.55), mix(t.track, t.accent, 0.8), t.accent] };
}

function ring(s, cx, cy, r) {
  const C = 2 * Math.PI * r;
  const keys = ['easy', 'medium', 'hard'].filter((k) => s.solved[k] > 0);
  const sum = keys.reduce((n, k) => n + s.solved[k], 0);
  // Round caps add half the stroke width to each end, so the dash gap has to cover them.
  const gap = keys.length > 1 ? 3 + 8 : 0;
  let offset = 0;
  const arcs = keys
    .map((key, i) => {
      const len = Math.max(0.5, (s.solved[key] / sum) * C - gap);
      const angle = -90 + (offset / C) * 360;
      offset += (s.solved[key] / sum) * C;
      return `<circle cx="${cx}" cy="${cy}" r="${r}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${len.toFixed(2)} ${(C - len).toFixed(2)}" transform="rotate(${angle.toFixed(2)} ${cx} ${cy})" class="seg" style="stroke:${DIFFICULTY[key]};animation-delay:${0.1 + i * 0.12}s"/>`;
    })
    .join('');

  return `
    <circle cx="${cx}" cy="${cy}" r="${r}" stroke-width="8" style="stroke:var(--tr)"/>
    ${arcs}
    <g class="in">
      <text x="${cx}" y="${cy + 1}" font-size="22" text-anchor="middle" class="b num">${fmt(s.solved.all)}</text>
      <text x="${cx}" y="${cy + 17}" font-size="10" text-anchor="middle" class="mu">solved</text>
    </g>`;
}

function avatar(s, x, y, size, id) {
  const r = size / 2;
  const cx = x + r;
  const cy = y + r;
  if (s.avatar) {
    return `<clipPath id="${id}-av"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
    <image href="${s.avatar}" x="${x}" y="${y}" width="${size}" height="${size}" clip-path="url(#${id}-av)" preserveAspectRatio="xMidYMid slice"/>
    <circle cx="${cx}" cy="${cy}" r="${r - 0.5}" class="bds"/>`;
  }
  return `<circle cx="${cx}" cy="${cy}" r="${r}" class="tr"/>
    <text x="${cx}" y="${cy + 5.5}" font-size="16" text-anchor="middle" class="b mu">${esc((s.username[0] || '?').toUpperCase())}</text>`;
}

function live(xRight, baseline, plan) {
  const cx = xRight - 3;
  const cy = baseline - 4;
  const label = plan.branding ? 'leetcodewrapped.com' : 'live';
  return `<circle cx="${cx}" cy="${cy}" r="3" class="ac pulse"/>
    <circle cx="${cx}" cy="${cy}" r="3" class="ac"/>
    <text x="${xRight - 12}" y="${baseline}" font-size="11" text-anchor="end" class="mu">${label}</text>`;
}

/* ---------- data helpers ---------- */

function dayCounts(days) {
  const map = new Map();
  for (const [ts, c] of Object.entries(days || {})) {
    const d = Math.floor(Number(ts) / 86400);
    map.set(d, (map.get(d) || 0) + Number(c));
  }
  return map;
}

function calendarStats(calendar) {
  const counts = dayCounts(calendar.days);
  const today = Math.floor(Date.now() / 86400000);
  // A streak is still alive if today hasn't been solved yet (UTC).
  let d = counts.get(today) ? today : today - 1;
  let currentStreak = 0;
  while (counts.get(d) > 0) {
    currentStreak++;
    d--;
  }
  return { currentStreak };
}

const weekday = (day) => (day + 4) % 7; // 1970-01-01 was a Thursday; 0 = Sunday

function formatDate(day) {
  const date = new Date(day * 86400000);
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

/* ---------- utils ---------- */

const fmt = (n) => Number(n || 0).toLocaleString('en-US');
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const truncate = (s, n) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function rgb(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

function mix(a, b, t) {
  const ca = rgb(a);
  const cb = rgb(b);
  return `#${ca.map((v, i) => Math.round(v + (cb[i] - v) * t).toString(16).padStart(2, '0')).join('')}`;
}

function luminance(hex) {
  const [r, g, b] = rgb(hex).map((v) => v / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
