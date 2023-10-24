// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  // TODO: this is not working, make global
  // alias: {
  //   SANITY_PROJECT_ID: "x9czj6ra",
  //   SANITY_DATASET: "production",
  // },
})
