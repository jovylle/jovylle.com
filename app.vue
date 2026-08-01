<script setup>
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
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
