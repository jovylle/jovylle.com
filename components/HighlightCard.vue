<template>
  <div class="bg-white dark:bg-zinc-900 shadow rounded-2xl overflow-hidden p-4 transition hover:scale-[1.02]">
    <div v-if="item.image" class="mb-4 rounded overflow-hidden">
      <img :src="item.image" :alt="item.title" class="w-full h-48 object-cover" />
    </div>
    <div class="text-sm text-gray-500 mb-1">{{ item.tag }}</div>
    <h2 class="text-lg font-bold mb-2">{{ item.title }}</h2>
    <p class="text-gray-700 dark:text-gray-300 text-sm">{{ item.description }}</p>
    <div v-if="item.link" class="mt-4">
      <a
        :href="item.link"
        target="_blank"
        rel="noopener"
        class="text-blue-500 hover:underline text-sm"
      >
        Visit &rarr;
      </a>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: Object
})
</script>
