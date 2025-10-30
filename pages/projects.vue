<script setup>
// SSR-safe redirect: do not render content or access undefined data
await navigateTo('/highlights', { replace: true })
</script>

<template>
  <div class="p-6 text-center">Redirecting…</div>
</template>

