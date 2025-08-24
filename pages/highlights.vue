<template>
  <section class="mx-auto p-6">
    <div class="mb-6">
      <h2 class="text-3xl font-bold text-center">What I've Worked On</h2>
      <p class="text-center text-gray-600">Here are some selected examples of my work.</p>
    </div>
    <div v-if="loading" class="text-gray-500 text-center">Loading...</div>
    <div v-else-if="error" class="text-red-500 text-center">Failed to load projects.</div>
    <ul v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 list-none">
      <li
        v-for="item in highlights"
        :key="item.title"
        class="bg-white shadow rounded-lg p-5 border"
      >
        <div class="flex items-center gap-2 mb-2">
          <span class="font-semibold text-lg">{{ item.title }}</span>
          <span class="text-xs bg-gray-200 rounded px-2 py-0.5">{{ item.tag }}</span>
        </div>
        <p class="mb-2 text-gray-700">{{ item.description }}</p>
        <a
          v-if="item.link"
          :href="item.link"
          target="_blank"
          class="inline-block px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Visit
        </a>
      </li>
    </ul>

    <div class="flex justify-center mt-8">
      <a
        href="/projects"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Projects
      </a>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useHead } from '@vueuse/head'; // Ensure to import useHead if required

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

// Setting the document head information
useHead({
  title: 'Jovylle - What I\'ve Worked On',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  charset: 'utf-8',
  meta: [{ name: 'description', content: 'Selected examples of projects I have worked on, showcasing my capabilities as a developer.' }]
});
</script>

<style></style>