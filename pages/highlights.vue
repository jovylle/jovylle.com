<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6 text-center">Highlights</h1>
    <HighlightGrid :items="highlights" />

    <div class="mt-10 text-center">
      <RouterLink to="/projects">
        <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          View All Projects
        </button>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HighlightGrid from '@/components/HighlightGrid.vue'

const highlights = ref([])

onMounted(async () => {
  const res = await fetch('/data/highlights.json')
  highlights.value = await res.json()
})
</script>
