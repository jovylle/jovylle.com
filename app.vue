<script setup>
useHead({
  link: [
    { rel: 'stylesheet', href: "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" }
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