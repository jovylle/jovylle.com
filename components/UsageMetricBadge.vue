<script setup>
import {
  formatMetricBadge,
  formatMonthlyVisits,
  formatPeakBadge,
  formatPeakTooltip,
} from '~/utils/usageMetrics'

const props = defineProps({
  site: { type: Object, required: true },
  windowDays: { type: Number, default: 30 },
  compact: { type: Boolean, default: false },
  /** current = rolling window; peak = all-time high for portfolio story */
  variant: { type: String, default: 'peak' },
  peakTrackingSince: { type: String, default: null },
})

const label = computed(() => {
  if (props.variant === 'peak') return formatPeakBadge(props.site)
  return formatMetricBadge(props.site, props.windowDays)
})

const title = computed(() => {
  if (props.variant === 'peak') {
    return formatPeakTooltip(props.site, props.peakTrackingSince)
  }
  return `${props.site.label} — Cloudflare visits, ${props.windowDays}-day window`
})
</script>

<template>
  <span
    v-if="label"
    class="inline-flex items-center gap-1 rounded-full border-2 border-dashed border-[color:var(--divider)] dark:border-[color:var(--divider-dark)] px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-gray-600 dark:text-gray-300 whitespace-nowrap"
    :title="title"
  >
    <i class="bx bx-trophy text-sm" aria-hidden="true" />
    <span>{{ compact && variant === 'current' ? formatMonthlyVisits(site) : label }}</span>
  </span>
</template>
