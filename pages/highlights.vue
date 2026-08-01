<template>
  <section class="mx-auto p-6">
    <div class="mb-6">
      <h2 class="text-3xl font-bold text-center">Skills & Solutions</h2>
      <p class="text-center text-gray-600 dark:text-gray-400">Technical challenges solved, features built, and technologies mastered</p>
      <p class="text-center text-sm text-gray-600 dark:text-gray-400 mt-3 max-w-2xl mx-auto">
        These projects run as one connected platform — shared embeds, CDN, and GitHub integrations.
        <NuxtLink
          to="/ecosystem/"
          class="text-gray-800 dark:text-gray-200 underline decoration-dashed decoration-1 underline-offset-4"
        >
          See Ecosystem Architecture →
        </NuxtLink>
      </p>
    </div>
    <div v-if="loading" class="text-gray-500 text-center">Loading...</div>
    <div v-else-if="error" class="text-red-500 text-center">Failed to load projects.</div>
    <ul v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 list-none">
      <li
        v-for="item in highlights"
        :key="item.title"
        class="bg-white dark:bg-ternary-dark rounded-lg p-5 border-[3px] border-dashed border-[color:var(--divider)] dark:border-[color:var(--divider-dark)]"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="font-semibold text-lg text-primary-dark dark:text-primary-light">{{ item.title }}</span>
            <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded px-2 py-0.5">{{ item.tag }}</span>
            <span
              v-if="item.year"
              class="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded px-2 py-0.5"
            >
              {{ item.year }}
            </span>
          </div>
        </div>
        
        <!-- Challenge/Problem Section -->
        <div v-if="item.challenge" class="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-4 border-yellow-400">
          <p class="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">Challenge:</p>
          <p class="text-sm text-yellow-700 dark:text-yellow-300">{{ item.challenge }}</p>
        </div>
        
        <!-- Description/Solution -->
        <p class="mb-3 text-gray-700 dark:text-gray-300">{{ item.description }}</p>
        
        <!-- Key Features Implemented -->
        <div v-if="item.features && item.features.length > 0" class="mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-green-400">
          <p class="text-sm font-medium text-green-800 dark:text-green-200 mb-2">Key Features Built:</p>
          <ul class="text-sm text-green-700 dark:text-green-300 list-disc list-inside space-y-1">
            <li v-for="feature in item.features" :key="feature">{{ feature }}</li>
          </ul>
        </div>
        
        <!-- Skills/Technologies Used -->
        <div v-if="item.technologies && item.technologies.length" class="mb-3">
          <p class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Technologies:</p>
          <div class="flex flex-wrap gap-1">
            <span 
              v-for="tech in item.technologies" 
              :key="tech"
              class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded font-medium"
            >
              {{ tech }}
            </span>
          </div>
        </div>

        <div class="flex gap-2 flex-wrap">
          <template v-if="item.links && item.links.length">
            <a
              v-for="link in item.links"
              :key="link.url || link.label"
              :href="link.url"
              target="_blank"
              rel="noopener"
            >
              <UiButton variant="outline-dashed">{{ link.label || 'View' }}</UiButton>
            </a>
          </template>
          <a v-else-if="item.link" :href="item.link" target="_blank" rel="noopener">
            <UiButton variant="outline-dashed">View</UiButton>
          </a>
          <a v-if="item.github" :href="item.github" target="_blank">
            <UiButton variant="outline">Source Code</UiButton>
          </a>
        </div>
      </li>
    </ul>
    <!-- <div class="flex justify-center mt-8">
      <NuxtLink to="/highlights">
        <UiButton variant="outline-dashed">More highlights</UiButton>
      </NuxtLink>
    </div> -->
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useHead } from '@vueuse/head';
import { CONTENT_ASSET_BASE } from '~/utils/config';

const highlights = ref([]);
const loading = ref(true);
const error = ref(false);

onMounted(async () => {
  try {
    const res = await fetch(`${CONTENT_ASSET_BASE}/data/highlights.json`);
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
  title: 'Jovylle - Technical Skills & Features Built',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  charset: 'utf-8',
  meta: [{ name: 'description', content: 'Full-stack developer showcasing technical skills, features built, and technologies mastered through real-world problem-solving.' }]
});
</script>

<style></style>