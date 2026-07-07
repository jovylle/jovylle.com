<template>
  <div class="container mx-auto py-10 sm:py-20 max-w-4xl">
    <header class="mb-12 text-center">
      <h1 class="text-3xl sm:text-5xl font-semibold mb-4 text-ternary-dark dark:text-ternary-light">
        Blog
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">
        Thoughts, projects, and updates
      </p>
    </header>

    <div v-if="!posts.length" class="text-center text-gray-500 py-20">
      No posts yet.
    </div>

    <div v-else class="space-y-6">
      <article
        v-for="post in posts"
        :key="post.slug"
        class="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-gray-500 dark:hover:border-gray-400 transition-colors"
      >
        <NuxtLink :to="`/blog/${post.slug}`" class="block">
          <time class="text-sm text-gray-500 dark:text-gray-400">
            {{ formatDate(post.date) }}
          </time>
          <h2 class="text-xl font-semibold mt-1 text-ternary-dark dark:text-ternary-light">
            {{ post.title }}
          </h2>
          <p v-if="post.excerpt" class="mt-2 text-gray-600 dark:text-gray-400 line-clamp-2">
            {{ post.excerpt }}
          </p>
          <div v-if="post.tags?.length" class="flex flex-wrap gap-2 mt-3">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
              {{ tag }}
            </span>
          </div>
        </NuxtLink>
      </article>
    </div>
  </div>
</template>

<script setup>
const { data: posts } = await useAsyncData('blog-posts', () =>
  $fetch('/api/data/blogs/index.json')
)

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

useHead({
  title: 'Blog — Jovylle Bermudez',
  meta: [
    { name: 'description', content: 'Thoughts, projects, and updates from Jovylle Bermudez.' }
  ]
})
</script>
