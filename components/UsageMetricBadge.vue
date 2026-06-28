<script setup>
import { formatMetricBadge, displayDailyAvg } from '~/utils/usageMetrics'

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
    class="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300"
    :title="`${site.label} — Cloudflare unique visitors, ${windowDays}-day average`"
  >
    <i class="bx bx-trending-up text-sm" aria-hidden="true" />
    <span>{{ compact ? `~${displayDailyAvg(site)}/day` : label }}</span>
  </span>
</template>
