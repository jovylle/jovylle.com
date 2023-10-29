
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/content"],
  css: ["boxicons/css/boxicons.min.css"],
  content: {
    highlight: {
      // Theme used in all color schemes.
      theme: {
        // Default theme (same as single string)
        default: "github-dark",
        // Theme used if `html.dark`
        dark: "github-dark-dimmed",
      },
      // preload: [
      //   "diff",
      //   "json",
      //   "js",
      //   "ts",
      //   "css",
      //   "shell",
      //   "html",
      //   "md",
      //   "javascript",
      // ],
    },
  },
  routeRules: {
    // Homepage pre-rendered at build time
    "/": { prerender: true },
    "/projects": { prerender: true },
    // // Product page generated on-demand, revalidates in background
    // "/products/**": { swr: 3600 },
    // // Blog post generated on-demand once until next deploy
    // "/blog/**": { isr: true },
    // // Admin dashboard renders only on client-side
    // "/admin/**": { ssr: false },
    // // Add cors headers on API routes
    // "/api/**": { cors: true },
    // // Redirects legacy urls
    // "/old-page": { redirect: "/new-page" },
  },
})
