<template>
  <IconBase :size="size" :stroke-width="strokeWidth" :color="color">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 1 4 17.5z" />
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


