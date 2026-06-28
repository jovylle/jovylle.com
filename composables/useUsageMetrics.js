import usageMetricsSnapshot from '~/data/usage-metrics-snapshot.json'
import { USAGE_METRICS_URL, visibleSites } from '~/utils/usageMetrics'

/** Live usage metrics from content CDN — client-only so numbers stay fresh without rebuilds. */
export function useUsageMetrics(options = {}) {
  const { fallbackSnapshot = false, preferSnapshot = false } = options

  const { data, pending, error, refresh } = useFetch(USAGE_METRICS_URL, {
    key: 'usage-metrics',
    server: false,
  })

  const liveHasSites = computed(() => visibleSites(data.value).length > 0)

  const activeMetrics = computed(() => {
    if (preferSnapshot) return usageMetricsSnapshot
    if (liveHasSites.value) return data.value
    if (fallbackSnapshot && !pending.value) return usageMetricsSnapshot
    return data.value
  })

  const isSnapshot = computed(
    () =>
      preferSnapshot || (fallbackSnapshot && !pending.value && !liveHasSites.value),
  )

  const sites = computed(() => visibleSites(activeMetrics.value))
  const hasSites = computed(() => sites.value.length > 0)
  const updatedAt = computed(() => activeMetrics.value?.updated_at ?? null)
  const windowDays = computed(() => activeMetrics.value?.window_days ?? 30)
  const snapshotNote = computed(() =>
    isSnapshot.value ? usageMetricsSnapshot.note ?? null : null,
  )

  return {
    metrics: activeMetrics,
    sites,
    hasSites,
    updatedAt,
    windowDays,
    isSnapshot,
    snapshotNote,
    pending,
    error: computed(() => (isSnapshot.value ? null : error.value)),
    refresh,
  }
}
