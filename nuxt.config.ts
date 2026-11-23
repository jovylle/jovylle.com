
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "AI Engineer — Agent Systems & Automation | Jovylle Bermudez, Cebu",
      meta: [
        {
          name: "description",
          content:
            "AI engineer in Cebu, Philippines. I build and operate LLM agent systems in production: agent orchestration, MCP servers, RAG, and autonomous delivery pipelines — plus the full-stack work underneath them.",
        },
        {
          name: "keywords",
          content:
            "AI engineer Philippines, AI agent developer Cebu, LLM engineer Philippines, agent orchestration, MCP server developer, RAG engineer, AI automation engineer Cebu, full stack developer Cebu, Jovylle Bermudez",
        },
        {
          property: "og:title",
          content: "AI Engineer — Agent Systems & Automation | Jovylle Bermudez, Cebu",
        },
        {
          property: "og:description",
          content:
            "AI engineer in Cebu building LLM agent systems in production: orchestration, MCP servers, RAG, and autonomous delivery pipelines.",
        },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Jovylle Bermudez" },
        { property: "og:url", content: "https://jovylle.com" },
        {
          property: "og:image",
          content: "https://jovylle.com/og-default.png",
        },
        {
          property: "og:image:width",
          content: "1200",
        },
        {
          property: "og:image:height",
          content: "630",
        },
        {
          property: "og:image:alt",
          content: "Jovylle Bermudez — AI Engineer, Agent Systems & Automation, Cebu",
        },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "AI Engineer — Agent Systems & Automation | Jovylle Bermudez, Cebu" },
        {
          name: "twitter:description",
          content:
            "AI engineer in Cebu building LLM agent systems in production: orchestration, MCP servers, RAG, and autonomous delivery pipelines.",
        },
        { name: "twitter:image", content: "https://jovylle.com/og-default.png" },
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
            jobTitle: "AI Engineer — Agent Systems & Automation",
            description:
              "AI engineer in Cebu, Philippines, building and operating LLM agent systems in production: agent orchestration, MCP servers, retrieval-augmented generation, and autonomous delivery pipelines, on a nine-year full-stack foundation.",
            url: "https://jovylle.com",
            image: "https://jovylle.com/og-default.png",
            knowsAbout: [
              "AI agents and agent orchestration",
              "LLM integration (Claude, OpenAI)",
              "Model Context Protocol (MCP) servers",
              "Retrieval-augmented generation",
              "Autonomous delivery pipelines",
              "TypeScript, Node.js, React, Next.js",
              "AWS serverless (Lambda, DynamoDB, Bedrock)",
              "Full-stack web development",
            ],
            worksFor: {
              "@type": "Organization",
              name: "Jovylle Bermudez (Independent)",
            },
            sameAs: [
              "https://github.com/jovylle",
              "https://www.linkedin.com/in/jovylle/",
              "https://hub.jovylle.com",
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
    preset: "cloudflare-pages",
    prerender: {
      crawlLinks: true,
      routes: [
        "/",
        "/personal-projects",
        "/ecosystem",
        "/contact",
        "/game",
        "/resume",
        "/impact",
        "/sitemap.xml",
        "/feed.xml",
      ],
      ignore: ["/private", "/private/**"],
    },
  },
  routeRules: {
    "/projects/2026-05-31-ecosystem-architecture": { redirect: "/ecosystem" },
    "/game": { ssr: false },
    "/parallax": { ssr: false },
    "/private": { prerender: false },
    "/private/**": { prerender: false },
    "/sitemap.xml": { prerender: true },
    "/feed.xml": { prerender: true },
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
