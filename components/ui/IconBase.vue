<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none"
       :stroke="color" :stroke-width="strokeWidth" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <slot />
  </svg>
</template>

<script setup>
defineProps({
  size: { type: [Number, String], default: 20 },
  strokeWidth: { type: [Number, String], default: 1.75 },
  color: { type: String, default: 'currentColor' }
});
</script>

<style scoped>
svg { transition: opacity 180ms ease; }
:host(:hover) svg { opacity: .85; }
</style>


