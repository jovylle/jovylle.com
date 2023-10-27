// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  // TODO: this is not working, make global
  // alias: {
  //   SANITY_PROJECT_ID: "x9czj6ra",
  //   SANITY_DATASET: "production",
  // },
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
