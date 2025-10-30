<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'dashed' }
})

const classes = computed(() => {
  const base = [
    'rounded-[8px] bg-white dark:bg-neutral-900 p-4',
    'border-[3px] border-[color:var(--divider)] dark:border-[color:var(--divider-dark)]'
  ]
  if (props.variant === 'dashed') base.push('border-dashed')
  return base
})
</script>

<style scoped>
</style>


