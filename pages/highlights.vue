<template>
  <section class="max-w-2xl mx-auto p-6">
    <h2 class="text-3xl font-bold mb-4">Highlights</h2>
    <div v-if="loading" class="text-gray-500">Loading...</div>
    <div v-else-if="error" class="text-red-500">Failed to load highlights.</div>
    <ul v-else>
      <li v-for="item in highlights" :key="item.title" class="mb-6 border-b pb-4">
        <div class="flex items-center gap-2 mb-1">
          <span class="font-semibold">{{ item.title }}</span>
          <span class="text-xs bg-gray-200 rounded px-2 py-0.5">{{ item.tag }}</span>
        </div>
        <p class="mb-1">{{ item.description }}</p>
        <a v-if="item.link" :href="item.link" target="_blank" class="text-blue-600 hover:underline">Visit</a>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const highlights = ref([]);
const loading = ref(true);
const error = ref(false);

onMounted(async () => {
  try {
    const res = await fetch('https://pocket.uft1.com/data/highlights.json');
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    highlights.value = data.highlights || [];
  } catch (e) {
    error.value = true;
  } finally {
    loading.value = false;
  }
});
</script>