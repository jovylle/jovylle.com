<script setup>
import { formatMetricBadge, formatMonthlyVisits } from '~/utils/usageMetrics'

const props = defineProps({
  site: { type: Object, required: true },
  windowDays: { type: Number, default: 30 },
  compact: { type: Boolean, default: false },
})

const label = computed(() => formatMetricBadge(props.site, props.windowDays))
</script>

<template>
  <span
    v-if="label"
    class="inline-flex items-center gap-1 rounded-full border-2 border-dashed border-[color:var(--divider)] dark:border-[color:var(--divider-dark)] px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-gray-600 dark:text-gray-300 whitespace-nowrap"
    :title="`${site.label} — Cloudflare visits, ${windowDays}-day window`"
  >
    <i class="bx bx-trending-up text-sm" aria-hidden="true" />
    <span>{{ compact ? formatMonthlyVisits(site) : label }}</span>
  </span>
</template>
