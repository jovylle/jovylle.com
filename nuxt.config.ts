
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "Cebu Web Developer & AI Solutionist | Jovylle Bermudez",
      meta: [
        {
          name: "description",
          content:
            "Jovylle Bermudez is a Cebu-based full-stack web developer and AI solutionist building modern websites, apps, and AI-powered tools for businesses in Cebu and beyond.",
        },
        {
          name: "keywords",
          content:
            "Cebu web developer, Cebu software engineer, Cebu full stack developer, freelance web developer Cebu, AI developer Cebu, Jovylle Bermudez",
        },
        {
          property: "og:title",
          content: "Cebu Web Developer & AI Solutionist | Jovylle Bermudez",
        },
        {
          property: "og:description",
          content:
            "Cebu-based full-stack web developer and AI solutionist helping businesses ship modern, fast, and AI-powered web applications.",
        },
        { property: "og:type", content: "website" },
      ],
      script: [
        {
          src: "https://cloud.umami.is/script.js",
          defer: true,
          "data-website-id": "2a85dd0e-ac8c-4745-8bad-5e8fc05c3d4a",
        },
        {
          type: "application/ld+json",
          // Basic structured data to help Google understand who you are
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Jovylle Bermudez",
            jobTitle: "Full-Stack Web Developer & AI Solutionist",
            description:
              "Cebu-based software engineer specializing in modern web development and AI-powered solutions.",
            url: "https://jovylle.com",
            sameAs: [
              "https://github.com/jovylle",
              "https://www.linkedin.com/in/jovylle/",
            ],
            address: {
              "@type": "PostalAddress",
              addressLocality: "Cebu",
              addressRegion: "Central Visayas",
              addressCountry: "PH",
            },
          }),
        },
      ],
    },
  },
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/content"],
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
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ["/", "/projects", "/personal-projects", "/ecosystem", "/contact", "/game", "/resume", "/impact"],
      ignore: ["/private", "/private/**"],
    },
  },
  routeRules: {
    "/projects/2026-05-31-ecosystem-architecture": { redirect: "/ecosystem" },
    "/game": { ssr: false },
    "/parallax": { ssr: false },
    "/private": { prerender: false },
    "/private/**": { prerender: false },
  },
  // routeRules: { // not sure with this
  //   // Homepage pre-rendered at build time
  //   "/": { prerender: true },
  //   "/projects": { prerender: true },
  //   // // Product page generated on-demand, revalidates in background
  //   // "/products/**": { swr: 3600 },
  //   // // Blog post generated on-demand once until next deploy
  //   // "/blog/**": { isr: true },
  //   // // Admin dashboard renders only on client-side
  //   // "/admin/**": { ssr: false },
  //   // // Add cors headers on API routes
  //   // "/api/**": { cors: true },
  //   // // Redirects legacy urls
  //   // "/old-page": { redirect: "/new-page" },
  // },
})
