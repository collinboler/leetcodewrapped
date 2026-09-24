# Charging for Wrapped Live

Research as of 2026-09-22. The links are the sources.

## Recommendation

- **Free:** every layout and theme, refreshed every 4 hours, with a small `leetcodewrapped.com` credit on the card. Each free embed advertises the product.
- **Pro:** **$19 one-time** at launch, then $29. You get no credit, custom colors, refreshes every 30 minutes, and future layouts. It is sold with a one-time checkout, not a subscription.
- **Payments:** [Polar](https://polar.sh/docs/merchant-of-record/fees). It is the merchant of record, so it handles sales tax and VAT for you. There's no monthly fee, and it charges 5% + 50¢ per sale (+1.5% on international cards). On a $19 sale you keep about $17.55.
- **Later:** a **club/bootcamp tier** at about $49 a semester or $12/mo, with a private leaderboard and a group card. This is the paid angle most likely to actually sell.

All of this is already built:
- the pricing section on the site
- `/api/checkout` and `/api/webhooks/polar`
- the free vs pro limits in `functions/_lib/plan.js`

To change a price, edit it in Polar and update the text in `public/index.html`.

## Why this model

**Nobody pays for the basic card.** Good LeetCode cards are already free and MIT-licensed:
- [JacobLinCool/LeetCode-Stats-Card](https://github.com/JacobLinCool/LeetCode-Stats-Card): about 950 stars, also runs on Cloudflare, and can be self-hosted.
- KnlnKS/leetcode-stats and songquanpeng/stats-cards.

The broader README-card space doesn't charge either: github-readme-stats (about 80k stars), streak-stats, and profile-trophy are free and run on donations or sponsors.

**People pay for polish and control, not for the card.** Examples:
- [WakaTime](https://wakatime.com/pricing): embeds are free. Paid plans ($9–14/mo) sell longer history and private leaderboards.
- [Elfsight](https://elfsight.com/pricing/): $5/mo removes its logo and raises view limits.
- [Holopin](https://www.holopin.io/pricing): free for individuals, $19–49/mo for organisations.

**One-time beats monthly for students.**
- [NeetCode Pro](https://neetcode.io/pro) sells a $297 lifetime plan alongside its $119/yr plan.
- Per-payment fees make small subscriptions expensive. On a $3/mo plan they eat about 13–22%; on a one-time $19–24 they take about 7%.

## Payment providers

| Provider | Fee (US card) | Handles tax? | Notes |
|---|---|---|---|
| **Polar** (chosen) | 5% + 50¢, +1.5% intl | Yes (merchant of record) | Webhooks use the Standard Webhooks spec. Bot Fight Mode must be off ([docs](https://polar.sh/docs/integrate/webhooks/delivery)). |
| Stripe Payment Links | 2.9% + 30¢, +0.5% Stripe Tax | No, you file taxes | Cheapest, but you register for and remit sales tax/VAT yourself. |
| Stripe Managed Payments | about 6.4% + 30¢ | Yes | Needs Stripe's approval. Good fallback. |
| Lemon Squeezy | 5% + 50¢ | Yes | Stripe is moving its users to Managed Payments. Don't build new on it. |
| Paddle | 5% + 50¢ | Yes | Needs a custom deal for prices under $10. |
| GitHub Sponsors | 0% (personal) | n/a | Add it anyway for tips. |

Switching providers only touches `functions/_lib/polar.js` and the webhook route. Plans are stored in KV as `user:<username>`, so nothing else depends on the provider.

## Risks

1. **The data source could go away. This is the biggest risk.**
   - LeetCode's [terms](https://leetcode.com/terms/) forbid "crawling," "scraping," or "spidering" the service, and its robots.txt disallows `/graphql`.
   - LeetCode [blocked Cloudflare Workers in March 2024](https://github.com/JacobLinCool/LeetCode-Stats-Card/issues/115) for about 9 days. The main site's functions already depend on this same endpoint.
   - Charging money makes a cease-and-desist more likely.

   Mitigations, some already in place and some to do:
   - Cache aggressively: done. Free cards make at most one call every 4 hours per user per edge location.
   - Serve stale stats when LeetCode fails: done.
   - Present Pro as supporting a best-effort service rather than promising uptime.
   - Keep a refund path: done. A full refund in Polar revokes Pro automatically.
2. **Trademark.**
   - "LEETCODE" is a [registered trademark](https://trademarks.justia.com/881/12/leetcode-88112995.html).
   - The spin-off is branded "Wrapped Live" and doesn't use LeetCode's logo, but the domain still includes "leetcode".
   - Say "for LeetCode" when describing it, and keep the "Not affiliated with LeetCode" footer. This is general practice, not legal advice.
3. **People may not buy.** Free alternatives are good, so expect low conversion on individual Pro. Revenue will come from volume through the free credit, plus the club tier.
4. **Cost at scale.** Pages Functions run on every card view, including cached ones. The Workers free plan covers 100k requests a day. Past that, the paid plan is $5/mo for 10M requests. GitHub's image proxy caches README cards, which reduces the load.

## What doesn't work

- **Ads on the cards.** An SVG in a README can't run ad scripts. [EthicalAds](https://www.ethicalads.io/publishers/) needs 50k+ pageviews a month. GitHub's [acceptable use policy](https://github.com/github/docs/blob/main/content/site-policy/acceptable-use-policies/github-acceptable-use-policies.md) limits promotional content in READMEs.
- **Affiliate links** are possible on the site, not the cards:
  - [Exponent](https://www.tryexponent.com/affiliate) pays 20% recurring.
  - [Design Gurus](https://www.designgurus.io/affiliate-program-terms) pays 20%.
  - I couldn't verify terms for AlgoExpert or Educative.
  - NeetCode and interviewing.io have no affiliate program that I could find.

## Next steps, in order

1. Launch free with the Polar sandbox, and test a full purchase and a refund end to end.
2. Add view counts for Pro. The web component can log impressions, since GitHub's image proxy hides README viewers. Workers Analytics Engine fits this better than KV writes.
3. Add a Wrapped-style yearly card as the first Pro-only layout, ready for December.
4. Pilot the club leaderboard with one university club before building billing for it.
