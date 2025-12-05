// <define:__ROUTES__>
var define_ROUTES_default = {
  version: 1,
  include: ["/api/*"],
  exclude: []
};

// ../../../../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-dev-pipeline.ts
import worker from "/Users/collinboler/Downloads/coding/misc/leetcodewrapped/.wrangler/tmp/pages-HG2dhe/functionsWorker-0.765620769934285.mjs";
import { isRoutingRuleMatch } from "/Users/collinboler/.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-dev-util.ts";
export * from "/Users/collinboler/Downloads/coding/misc/leetcodewrapped/.wrangler/tmp/pages-HG2dhe/functionsWorker-0.765620769934285.mjs";
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        const workerAsHandler = worker;
        if (workerAsHandler.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return workerAsHandler.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  pages_dev_pipeline_default as default
};
//# sourceMappingURL=b1o9an98cad.js.map
