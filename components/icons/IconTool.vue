<template>
  <IconBase :size="size" :stroke-width="strokeWidth" :color="color">
    <path d="M21 21l-6-6" />
    <path d="M11 13a5 5 0 1 1 7.07-7.07L16 8l2 2 2.07-2.07A7 7 0 1 0 11 13z" />
  </IconBase>
</template>
<script setup>
import IconBase from "../ui/IconBase.vue";

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


