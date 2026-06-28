<script setup>
const {
  sites,
  hasSites,
  updatedAt,
  windowDays,
  pending,
  error,
  isSnapshot,
  snapshotNote,
} = useUsageMetrics({ preferSnapshot: true })

useHead({
  title: 'Live Usage — Jovylle Bermudez',
  meta: [
    {
      name: 'description',
      content:
        'Verified daily traffic for production tools — from Cloudflare Analytics.',
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
        <template v-if="isSnapshot">
          These numbers are a <strong>verified snapshot</strong> from Cloudflare Analytics (bots excluded, 30-day window).
          Live auto-sync will replace this once the pipeline is stable.
        </template>
        <template v-else>
          This page shows <strong>actual visitor counts</strong> from Cloudflare — synced daily.
          Only tools above a traffic threshold appear here.
        </template>
      </p>
      <p class="mt-4 text-sm text-gray-500 dark:text-gray-500">
        Share this link on LinkedIn:
        <a href="https://jovylle.com/impact" class="underline decoration-dashed">jovylle.com/impact</a>
      </p>
    </header>

    <div v-if="pending && !hasSites" class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6 text-sm text-gray-600 dark:text-gray-400">
      Loading latest usage metrics…
    </div>

    <div
      v-else-if="error"
      class="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700 p-6 text-sm text-amber-900 dark:text-amber-200"
    >
      <p class="font-medium mb-1">Usage metrics are not available right now.</p>
      <p class="text-xs opacity-90">
        The portfolio loads stats from content.jovylle.com after each sync. If you just ran the workflow, wait for the content CDN deploy to finish, then refresh.
      </p>
    </div>

    <div
      v-else-if="hasSites"
      class="space-y-4"
    >
      <p
        v-if="isSnapshot"
        class="rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800 px-4 py-3 text-sm text-emerald-900 dark:text-emerald-100"
      >
        Showing verified snapshot{{ snapshotNote ? ` — ${snapshotNote}` : '' }}
      </p>
      <UsageMetricsPanel
        :sites="sites"
        :updated-at="updatedAt"
        :window-days="windowDays"
        :show-source="!isSnapshot"
      />
      <p
        v-if="isSnapshot"
        class="text-xs text-gray-500 dark:text-gray-500"
      >
        Source: Cloudflare Analytics dashboard · {{ windowDays }}-day window · snapshot as of {{ updatedAt?.slice(0, 10) }}
      </p>
    </div>

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
