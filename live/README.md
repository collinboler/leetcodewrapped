# wrapped live

embeddable, self-updating leetcode stats cards. a spin-off of leetcode wrapped, meant for `live.leetcodewrapped.com`.

```html
<script src="https://live.leetcodewrapped.com/embed.js" async></script>
<leetcode-stats username="your-name" layout="card" theme="auto"></leetcode-stats>
```

```md
[![LeetCode stats](https://live.leetcodewrapped.com/u/your-name.svg)](https://leetcode.com/u/your-name/)
```

## how it works

- `GET /u/:username.svg` renders an SVG card on a cloudflare pages function. options: `layout` (`card` | `compact` | `heatmap`), `theme` (`auto` | `light` | `dark`), and for pro users `accent`, `bg`, `text` (hex without `#`).
- one leetcode graphql call per refresh. results are kept in the edge cache: 4h for free, 30min for pro. if leetcode errors out, the last good stats are served instead.
- `embed.js` defines `<leetcode-stats>`. it inlines the SVG (so heatmap tooltips work), links to the profile, and refetches every 10 minutes while the page is open.
- pro belongs to a leetcode username, not to an account. the polar webhook writes `user:<username>` to the `PRO` kv namespace, and `PRO_USERS` gives free pro to a comma-separated list of usernames.

```
live/
├── functions/
│   ├── _lib/            # leetcode fetch + cache, svg renderer, plans, polar
│   ├── u/[file].js      # the card endpoint
│   └── api/             # checkout redirect, polar webhook, plan lookup
└── public/              # landing page / builder, embed.js
```

## run locally

```bash
cd live && npx wrangler pages dev public --kv PRO
```

put local secrets in `live/.dev.vars`. add `--binding PRO_USERS=your-name` to see a pro card.

## deploy

1. create a cloudflare pages project from this repo. set the root directory to `live`, leave the build command empty, and set the output directory to `public`.
2. add the custom domain `live.leetcodewrapped.com`. the cache API doesn't work on `*.pages.dev`, so you need a real domain.
3. run `npx wrangler kv namespace create PRO`, then bind it as `PRO` (either in the pages settings or in `wrangler.toml`).
4. set the environment variables:
   - `POLAR_ACCESS_TOKEN` (secret)
   - `POLAR_WEBHOOK_SECRET` (secret)
   - `POLAR_PRODUCT_ID`
   - `POLAR_SERVER`: `sandbox` or `production`
   - optionally `PRO_USERS`
5. in polar, create a one-time product and add a webhook pointing at `https://live.leetcodewrapped.com/api/webhooks/polar`, subscribed to `order.paid` and `order.refunded`. keep cloudflare bot fight mode off for the zone, because it blocks polar's deliveries.

see [MONETIZATION.md](MONETIZATION.md) for pricing and the reasoning behind it.
