<script setup>
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Jovylle Bermudez',
  alternateName: 'Jo Bermudez',
  url: 'https://jovylle.com',
  jobTitle: 'Full-Stack Web Developer',
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
        'Portfolio site for Jovylle Bermudez (Jo Bermudez), showcasing modern full-stack web development work across AI, writing, and consulting.',
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
