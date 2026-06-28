<script setup>
const { sites, hasSites, updatedAt, windowDays, pending, error } = useUsageMetrics()

useHead({
  title: 'Live Usage — Jovylle Bermudez',
  meta: [
    {
      name: 'description',
      content:
        'Verified daily traffic for production tools — pulled from Cloudflare Analytics and updated automatically.',
    },
    {
      property: 'og:title',
      content: 'Live usage on my production tools',
    },
    {
      property: 'og:description',
      content:
        'Real visitor counts for shipped side projects. Only tools with meaningful traffic are listed.',
    },
    { property: 'og:type', content: 'website' },
  ],
})
</script>

<template>
  <article class="container mx-auto max-w-4xl py-10 sm:py-16 px-4">
    <header class="mb-10">
      <p class="text-sm font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
        For recruiters & collaborators
      </p>
      <h1 class="text-3xl sm:text-4xl font-bold mb-4">Live product usage</h1>
      <p class="text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
        This page shows <strong>actual visitor counts</strong> from Cloudflare — not estimates.
        Every hostname across your Cloudflare account is scanned; only tools above a traffic threshold appear here and update daily.
      </p>
      <p class="mt-4 text-sm text-gray-500 dark:text-gray-500">
        Share this link on LinkedIn:
        <a href="https://jovylle.com/impact" class="underline decoration-dashed">jovylle.com/impact</a>
      </p>
    </header>

    <div v-if="pending" class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6 text-sm text-gray-600 dark:text-gray-400">
      Loading latest usage metrics…
    </div>

    <div
      v-else-if="error"
      class="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700 p-6 text-sm text-amber-900 dark:text-amber-200"
    >
      Usage metrics are not available right now. Check back after the daily sync runs.
    </div>

    <UsageMetricsPanel
      v-else-if="hasSites"
      :sites="sites"
      :updated-at="updatedAt"
      :window-days="windowDays"
    />

    <div
      v-else
      class="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center text-gray-600 dark:text-gray-400"
    >
      <p class="font-medium mb-2">No tools above the traffic threshold yet</p>
      <p class="text-sm max-w-md mx-auto">
        Once a product gets steady visitors, it will show up here automatically. Nothing to configure on the portfolio side.
      </p>
    </div>

    <footer class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500">
      <NuxtLink to="/personal-projects" class="underline decoration-dashed mr-4">Projects archive</NuxtLink>
      <NuxtLink to="/ecosystem" class="underline decoration-dashed mr-4">Ecosystem</NuxtLink>
      <NuxtLink to="/resume" class="underline decoration-dashed">Resume</NuxtLink>
    </footer>
  </article>
</template>
