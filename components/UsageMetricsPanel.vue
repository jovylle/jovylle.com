<script setup>
import {
  formatMonthlyUniques,
  formatUpdatedAt,
} from '~/utils/usageMetrics'

const props = defineProps({
  sites: { type: Array, default: () => [] },
  updatedAt: { type: String, default: null },
  windowDays: { type: Number, default: 30 },
  showSource: { type: Boolean, default: true },
})

const formattedDate = computed(() => formatUpdatedAt(props.updatedAt))
</script>

<template>
  <section v-if="sites.length" class="flex flex-col gap-5">
    <header class="flex flex-wrap justify-between gap-x-6 gap-y-3">
      <div>
        <h2 class="text-2xl font-bold mb-2">Per-site breakdown</h2>
      </div>
      <p v-if="formattedDate" class="self-start text-sm text-gray-500 dark:text-gray-400">
        Updated {{ formattedDate }}
      </p>
    </header>

    <ul class="grid gap-4 list-none p-0 m-0" style="grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));">
      <li
        v-for="site in sites"
        :key="site.id"
        class="flex flex-col rounded-lg p-5 bg-white dark:bg-ternary-dark border-[3px] border-dashed border-[color:var(--divider)] dark:border-[color:var(--divider-dark)] transition duration-150 hover:shadow-soft"
      >
        <div class="flex items-start justify-between gap-3 mb-4">
          <a
            :href="site.url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 font-semibold text-primary-dark dark:text-primary-light hover:underline decoration-dashed underline-offset-4"
          >
            {{ site.label }}
            <i class="bx bx-link-external text-sm opacity-70" aria-hidden="true" />
          </a>
          <UsageMetricBadge :site="site" :window-days="windowDays" compact />
        </div>

        <dl v-if="site.unique_visitors_30d && !site.grouped" class="grid grid-cols-2 gap-3 m-0">
          <div>
            <dt class="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-0.5">Monthly uniques</dt>
            <dd class="m-0 text-base font-bold">{{ formatMonthlyUniques(site.unique_visitors_30d) || '—' }}</dd>
          </div>
        </dl>

        <p
          v-if="site.grouped && site.hostname_breakdown?.length > 1"
          class="mt-3 text-xs text-gray-500 dark:text-gray-400 leading-relaxed"
        >
          {{ site.hostnames.length }} domains → same app
          <span class="block mt-1 text-[11px] opacity-80">({{ site.hostnames.join(', ') }})</span>
        </p>

        <p v-if="site.note" class="mt-2 text-xs italic text-gray-500 dark:text-gray-400">
          {{ site.note }}
        </p>
      </li>
    </ul>

    <p v-if="showSource" class="text-xs text-gray-500 dark:text-gray-400">
      Source: Cloudflare Analytics, updated daily
    </p>
  </section>
</template>
