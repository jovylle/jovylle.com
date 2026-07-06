<script setup>
import { DEFAULT_THEME, THEME_STORAGE_KEY, isValidTheme } from '~/utils/themes'

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

if (import.meta.client) {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  const theme = stored && isValidTheme(stored) ? stored : DEFAULT_THEME
  document.documentElement.setAttribute('data-theme', theme)
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
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
