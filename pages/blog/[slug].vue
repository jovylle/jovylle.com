<template>
  <div class="container mx-auto py-10 sm:py-20 max-w-4xl">
    <template v-if="post">
      <header class="mb-8">
        <NuxtLink to="/blog" class="text-sm text-gray-500 dark:text-gray-400 hover:underline">
          &larr; Back to Blog
        </NuxtLink>
        <h1 class="text-3xl sm:text-4xl font-semibold mt-4 text-ternary-dark dark:text-ternary-light">
          {{ post.title }}
        </h1>
        <div class="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
          <time>{{ formatDate(post.date) }}</time>
          <span v-if="post.author">{{ post.author }}</span>
        </div>
        <div v-if="post.tags?.length" class="flex flex-wrap gap-2 mt-3">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            {{ tag }}
          </span>
        </div>
      </header>

      <article
        class="prose dark:prose-invert max-w-none"
        v-html="html"
      />
    </template>

    <div v-else class="text-center py-20 text-gray-500">
      Post not found.
    </div>
  </div>
</template>

<script setup>
import { marked } from 'marked'

const route = useRoute()
const slug = route.params.slug

const { data: post } = await useAsyncData(`blog-${slug}`, () =>
  $fetch(`/api/data/blogs/${slug}.json`).catch(() => null)
)

function extractMarkdown(post) {
  if (post?.content) return post.content
  if (post?.body) {
    const match = post.body.match(/^---\s*\n[\s\S]*?\n---\s*\n([\s\S]*)$/)
    if (match) return match[1]
    return post.body
  }
  return ''
}

const html = computed(() => {
  const md = extractMarkdown(post.value)
  if (!md) return ''
  return marked.parse(md)
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

useHead({
  title: () => post.value ? `${post.value.title} — Blog — Jovylle` : 'Blog — Jovylle',
  meta: () => post.value ? [
    { name: 'description', content: post.value.excerpt || post.value.title }
  ] : []
})
</script>
