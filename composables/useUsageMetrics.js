import { USAGE_METRICS_URL, visibleSites } from '~/utils/usageMetrics'

/** Live usage metrics from content CDN — client-only so numbers stay fresh without rebuilds. */
export function useUsageMetrics() {
  const { data, pending, error, refresh } = useFetch(USAGE_METRICS_URL, {
    key: 'usage-metrics',
    server: false,
  })

  const sites = computed(() => visibleSites(data.value))
  const hasSites = computed(() => sites.value.length > 0)
  const updatedAt = computed(() => data.value?.updated_at ?? null)
  const windowDays = computed(() => data.value?.window_days ?? 30)

  return {
    metrics: data,
    sites,
    hasSites,
    updatedAt,
    windowDays,
    pending,
    error,
    refresh,
  }
}
