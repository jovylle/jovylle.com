import { CONTENT_ASSET_BASE } from '~/utils/config'

/** Browser-safe same-origin proxy (avoids CDN CORS). */
export const USAGE_METRICS_URL = '/api/usage-metrics'

/** Direct CDN URL — server-side only. */
export const USAGE_METRICS_UPSTREAM = `${CONTENT_ASSET_BASE}/data/usage-metrics.json`

export function normalizeHost(value) {
  if (!value) return ''
  try {
    const url = value.includes('://') ? value : `https://${value}`
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '')
  } catch {
    return String(value)
      .toLowerCase()
      .replace(/^www\./, '')
      .split('/')[0]
  }
}

export function repoToFullName(repoUrl) {
  const match = String(repoUrl || '').match(/github\.com[/:]([^/]+)\/([^/?#]+)/)
  if (!match) return null
  return `${match[1]}/${match[2].replace(/\.git$/, '')}`.toLowerCase()
}

/** Prefer visits (matches Cloudflare dashboard) then unique visitors. */
export function displayDailyAvg(site) {
  const visits = Number(site?.visits_daily_avg)
  if (Number.isFinite(visits) && visits > 0) return visits
  return Number(site?.daily_avg) || 0
}

export function displayMonthlyVisits(site) {
  const v = Number(site?.visits_30d)
  if (Number.isFinite(v) && v > 0) return v
  const daily = displayDailyAvg(site)
  if (daily > 0) return daily * 30
  return 0
}

/** Human-readable monthly visits for badges and cards. */
export function formatMonthlyVisits(site) {
  const n = displayMonthlyVisits(site)
  if (!n) return ''
  if (n >= 1000) {
    const rounded = Math.round(n / 100) / 10
    return `~${rounded}k visits/mo`
  }
  return `~${n} visits/mo`
}

/** @deprecated kept for resume.vue compat — use formatMonthlyVisits */
export function formatDailyVisitors(dailyAvg) {
  const n = Number(dailyAvg)
  if (!Number.isFinite(n) || n < 1) return ''
  if (n >= 1000) {
    const rounded = Math.round(n / 100) / 10
    return `~${rounded}k visits/mo`
  }
  const monthly = n * 30
  if (monthly >= 1000) {
    const rounded = Math.round(monthly / 100) / 10
    return `~${rounded}k visits/mo`
  }
  return `~${monthly} visits/mo`
}

export function formatMonthlyUniques(count) {
  const n = Number(count)
  if (!Number.isFinite(n) || n < 1) return ''
  if (n >= 1000) {
    const rounded = Math.round(n / 100) / 10
    return `~${rounded}k monthly uniques`
  }
  return `~${n} monthly uniques`
}

export function formatMetricBadge(site, windowDays = 30) {
  const label = formatMonthlyVisits(site)
  if (!label) return ''
  return `${label} · ${windowDays}d`
}

export function findMetricForProject(project, metricsData) {
  const sites = metricsData?.sites ?? []
  if (!sites.length || !project) return null

  const slug = String(project.slug || project.title || '')
    .toLowerCase()
    .trim()
  const repoName = repoToFullName(project.repo || project.repo_url)
  const domains = new Set()

  if (project.netlify_live) domains.add(normalizeHost(project.netlify_live))
  for (const link of project.links ?? []) {
    if (link?.url) domains.add(normalizeHost(link.url))
  }

  const matches = []

  for (const site of sites) {
    const match = site.match ?? {}
    const slugs = (match.slugs ?? []).map((s) => String(s).toLowerCase())
    const matchDomains = (match.domains ?? []).map(normalizeHost)
    const repos = (match.repos ?? []).map((r) => String(r).toLowerCase())

    let matched = false
    if (slug && slugs.includes(slug)) matched = true
    if (repoName && repos.includes(repoName)) matched = true
    if ([...domains].some((d) => d && matchDomains.includes(d))) matched = true
    if (
      site.hostnames?.some((h) => {
        const host = normalizeHost(h)
        return host && domains.has(host)
      })
    ) {
      matched = true
    }
    if (matched) matches.push(site)
  }

  if (!matches.length) return null
  return matches.sort((a, b) => displayDailyAvg(b) - displayDailyAvg(a))[0]
}

export function visibleSites(metricsData) {
  return (metricsData?.sites ?? []).filter(
    (site) => displayDailyAvg(site) > 0,
  )
}

export function formatUpdatedAt(iso) {
  if (!iso) return null
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(iso))
  } catch {
    return iso.slice(0, 10)
  }
}
