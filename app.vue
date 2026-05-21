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

useHead({
  link: [
    { rel: 'stylesheet', href: 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' },
  ],
  meta: [
    {
      name: 'description',
      content:
        'Portfolio site for Jovylle Bermudez (Jo Bermudez), showcasing modern full-stack web development work across AI, writing, and consulting.',
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(personSchema, null, 2),
    },
  ],
})
</script>

<template>
  <NuxtLayout :name="layout">
    <NuxtPage />
  </NuxtLayout>
</template>

<script>
export default {
  data() {
    return {
      layout: 'default' // Example value, replace with your actual logic
    }
  }
}
</script>