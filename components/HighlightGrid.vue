<template>
  <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <HighlightCard v-for="item in items" :key="item.id" :item="item" />
  </div>
</template>

<script setup>
import HighlightCard from './HighlightCard.vue'

defineProps({
  items: Array
})
</script>
