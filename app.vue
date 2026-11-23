<script setup>
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Jovylle Bermudez',
  alternateName: 'Jo Bermudez',
  url: 'https://jovylle.com',
  jobTitle: 'AI Engineer — Agent Systems & Automation',
  addressCountry: 'PH',
  sameAs: ['https://facebook.com/twero'],
}

const route = useRoute()
const canonical = computed(() => {
  const path = route.path === '/' ? '' : route.path
  return `https://jovylle.com${path}`
})

useHead({
  link: [
    { rel: 'stylesheet', href: 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' },
    () => ({ rel: 'canonical', href: canonical.value }),
  ],
  meta: [
    {
      name: 'description',
      content:
        'AI engineer in Cebu, Philippines — building LLM agent systems, MCP servers and autonomous delivery pipelines in production.',
    },
    () => ({ property: 'og:url', content: canonical.value }),
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
