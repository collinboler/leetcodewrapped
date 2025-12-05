import { onRequestGet as __api_user__username__badges_js_onRequestGet } from "/Users/collinboler/Downloads/coding/misc/leetcodewrapped/functions/api/user/[username]/badges.js"
import { onRequestGet as __api_user__username__calendar_js_onRequestGet } from "/Users/collinboler/Downloads/coding/misc/leetcodewrapped/functions/api/user/[username]/calendar.js"
import { onRequestGet as __api_user__username__language_js_onRequestGet } from "/Users/collinboler/Downloads/coding/misc/leetcodewrapped/functions/api/user/[username]/language.js"
import { onRequestGet as __api_user__username__skill_js_onRequestGet } from "/Users/collinboler/Downloads/coding/misc/leetcodewrapped/functions/api/user/[username]/skill.js"
import { onRequestGet as __api_user__username__solved_js_onRequestGet } from "/Users/collinboler/Downloads/coding/misc/leetcodewrapped/functions/api/user/[username]/solved.js"
import { onRequestGet as __api_user__username__submission_js_onRequestGet } from "/Users/collinboler/Downloads/coding/misc/leetcodewrapped/functions/api/user/[username]/submission.js"
import { onRequestGet as __api_user__username__js_onRequestGet } from "/Users/collinboler/Downloads/coding/misc/leetcodewrapped/functions/api/user/[username].js"

export const routes = [
    {
      routePath: "/api/user/:username/badges",
      mountPath: "/api/user/:username",
      method: "GET",
      middlewares: [],
      modules: [__api_user__username__badges_js_onRequestGet],
    },
  {
      routePath: "/api/user/:username/calendar",
      mountPath: "/api/user/:username",
      method: "GET",
      middlewares: [],
      modules: [__api_user__username__calendar_js_onRequestGet],
    },
  {
      routePath: "/api/user/:username/language",
      mountPath: "/api/user/:username",
      method: "GET",
      middlewares: [],
      modules: [__api_user__username__language_js_onRequestGet],
    },
  {
      routePath: "/api/user/:username/skill",
      mountPath: "/api/user/:username",
      method: "GET",
      middlewares: [],
      modules: [__api_user__username__skill_js_onRequestGet],
    },
  {
      routePath: "/api/user/:username/solved",
      mountPath: "/api/user/:username",
      method: "GET",
      middlewares: [],
      modules: [__api_user__username__solved_js_onRequestGet],
    },
  {
      routePath: "/api/user/:username/submission",
      mountPath: "/api/user/:username",
      method: "GET",
      middlewares: [],
      modules: [__api_user__username__submission_js_onRequestGet],
    },
  {
      routePath: "/api/user/:username",
      mountPath: "/api/user",
      method: "GET",
      middlewares: [],
      modules: [__api_user__username__js_onRequestGet],
    },
  ]