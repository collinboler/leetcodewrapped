// <leetcode-stats username="your-name" layout="card" theme="auto"></leetcode-stats>
(() => {
  if (customElements.get('leetcode-stats')) return;

  const ORIGIN = new URL(document.currentScript?.src || 'https://live.leetcodewrapped.com/embed.js').origin;
  const OPTIONS = ['layout', 'theme', 'accent', 'bg', 'text'];
  const REFRESH_MS = 10 * 60 * 1000;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

  class LeetCodeStats extends HTMLElement {
    static get observedAttributes() {
      return ['username', ...OPTIONS];
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      this.load();
      this.timer = setInterval(() => this.load(), REFRESH_MS);
    }

    disconnectedCallback() {
      clearInterval(this.timer);
    }

    attributeChangedCallback() {
      if (this.isConnected) this.load();
    }

    get src() {
      const params = new URLSearchParams();
      for (const key of OPTIONS) {
        const value = this.getAttribute(key);
        if (value) params.set(key, value.replace(/^#/, ''));
      }
      const query = params.toString();
      return `${ORIGIN}/u/${encodeURIComponent(this.getAttribute('username'))}.svg${query ? `?${query}` : ''}`;
    }

    // Inline the SVG so heatmap tooltips work; fall back to a plain <img>.
    async load() {
      const username = this.getAttribute('username');
      if (!username) return;
      const src = this.src;
      let inner;
      try {
        const response = await fetch(src);
        const svg = await response.text();
        if (!svg.trimStart().startsWith('<svg')) throw new Error('not an svg');
        inner = svg;
      } catch {
        inner = `<img src="${esc(src)}" alt="LeetCode stats for ${esc(username)}">`;
      }
      if (src !== this.src) return; // attributes changed mid-request
      this.shadowRoot.innerHTML = `
        <style>
          :host { display: inline-block; max-width: 100%; line-height: 0; }
          a { display: block; border-radius: 14px; }
          svg, img { display: block; max-width: 100%; height: auto; }
        </style>
        <a href="https://leetcode.com/u/${encodeURIComponent(username)}/" target="_blank" rel="noopener" part="link">${inner}</a>`;
    }
  }

  customElements.define('leetcode-stats', LeetCodeStats);
})();
