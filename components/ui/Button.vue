<template>
  <button
    :type="type"
    :class="[
      'inline-flex items-center justify-center select-none',
      'px-3 py-2 rounded-[4px] transition duration-150 ease-out',
      'focus-visible:outline-none focus-visible:ring-2',
      'active:translate-y-[2px] disabled:opacity-50 disabled:pointer-events-none',
      variantClass
    ]"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'primary' }, // 'primary' | 'outline' | 'outline-dashed'
  type: { type: String, default: 'button' }
})

const variantClass = computed(() => {
  if (props.variant === 'outline' || props.variant === 'outline-dashed') {
    return [
      'border-[3px] border-[var(--divider)] dark:border-[var(--divider-dark)]',
      props.variant === 'outline-dashed' ? 'border-dashed' : '',
      'bg-transparent text-gray-800 dark:text-gray-200',
      'hover:bg-black/5 dark:hover:bg-white/5',
      'focus-visible:ring-[color:var(--accent)]'
    ]
  }

  return [
    'bg-[color:var(--accent)] text-white',
    'hover:opacity-90',
    'focus-visible:ring-white/80'
  ]
})
</script>

<style scoped>
</style>


