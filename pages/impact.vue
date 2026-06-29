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
        'Verified monthly traffic for production tools — from Cloudflare Analytics.',
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

const totalMonthlyVisits = computed(() =>
  sites.value.reduce((sum, s) => sum + (Number(s.visits_30d) || 0), 0),
)
</script>

<template>
  <article class="container mx-auto max-w-4xl py-10 sm:py-16 px-4">
    <header class="mb-10">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400 mb-3">
        For recruiters &amp; collaborators
      </p>
      <h1 class="text-3xl sm:text-4xl font-bold mb-4">Real visitors on the things I've built</h1>
      <p class="text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
        These are real visitor counts from the last {{ windowDays }} days, pulled from my analytics
        dashboard with bots filtered out. Only sites with steady traffic show up here.
      </p>

      <!-- Summary stat strip -->
      <dl
        v-if="hasSites"
        class="mt-6 grid grid-cols-2 gap-3"
      >
        <div class="rounded-lg p-4 bg-white dark:bg-ternary-dark border-[3px] border-dashed border-[color:var(--divider)] dark:border-[color:var(--divider-dark)]">
          <dt class="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Live tools</dt>
          <dd class="text-2xl font-bold">{{ sites.length }}</dd>
        </div>
        <div class="rounded-lg p-4 bg-white dark:bg-ternary-dark border-[3px] border-dashed border-[color:var(--divider)] dark:border-[color:var(--divider-dark)]">
          <dt class="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Visitors (last {{ windowDays }} days)</dt>
          <dd class="text-2xl font-bold">{{ totalMonthlyVisits.toLocaleString() }}</dd>
        </div>
      </dl>
    </header>

    <!-- Loading -->
    <div
      v-if="pending && !hasSites"
      class="rounded-lg p-6 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-ternary-dark border-[3px] border-dashed border-[color:var(--divider)] dark:border-[color:var(--divider-dark)]"
    >
      Loading latest usage metrics…
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="rounded-lg p-6 text-sm bg-white dark:bg-ternary-dark border-[3px] border-dashed border-[color:var(--divider)] dark:border-[color:var(--divider-dark)]"
    >
      <p class="font-semibold mb-1 text-gray-800 dark:text-gray-200">Usage metrics are not available right now.</p>
      <p class="text-xs text-gray-600 dark:text-gray-400">
        The portfolio loads stats from content.jovylle.com after each sync. If you just ran the workflow,
        wait for the content CDN deploy to finish, then refresh.
      </p>
    </div>

    <!-- Data -->
    <div v-else-if="hasSites" class="space-y-4">
      <p
        v-if="isSnapshot"
        class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 border-2 border-dashed border-[color:var(--divider)] dark:border-[color:var(--divider-dark)]"
      >
        <span class="inline-block w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500" aria-hidden="true" />
        Numbers updated manually for now<template v-if="updatedAt"> — {{ updatedAt.slice(0, 10) }}</template>
      </p>

      <UsageMetricsPanel
        :sites="sites"
        :updated-at="updatedAt"
        :window-days="windowDays"
        :show-source="!isSnapshot"
      />

      <p v-if="isSnapshot" class="text-xs text-gray-500 dark:text-gray-500">
        Source: Cloudflare Analytics dashboard · {{ windowDays }}-day window · snapshot as of {{ updatedAt?.slice(0, 10) }}
      </p>
    </div>

    <!-- Empty -->
    <div
      v-else
      class="rounded-lg p-8 text-center text-gray-600 dark:text-gray-400 bg-white dark:bg-ternary-dark border-[3px] border-dashed border-[color:var(--divider)] dark:border-[color:var(--divider-dark)]"
    >
      <p class="font-semibold mb-2 text-gray-800 dark:text-gray-200">No tools above the traffic threshold yet</p>
      <p class="text-sm max-w-md mx-auto">
        Once a product gets steady visitors, it will show up here automatically. Nothing to configure on the portfolio side.
      </p>
    </div>

    <footer class="mt-12 pt-8 border-t-2 border-dashed border-[color:var(--divider)] dark:border-[color:var(--divider-dark)]">
      <div class="flex flex-wrap gap-3">
        <NuxtLink to="/personal-projects">
          <UiButton variant="outline-dashed">Projects archive</UiButton>
        </NuxtLink>
        <NuxtLink to="/ecosystem">
          <UiButton variant="outline-dashed">Ecosystem</UiButton>
        </NuxtLink>
        <NuxtLink to="/resume">
          <UiButton variant="outline-dashed">Resume</UiButton>
        </NuxtLink>
      </div>
    </footer>
  </article>
</template>
