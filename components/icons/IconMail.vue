<template>
  <IconBase :size="size" :stroke-width="strokeWidth" :color="color">
    <path d="M4 4h16v16H4z" />
    <path d="M22 6l-10 7L2 6" />
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


