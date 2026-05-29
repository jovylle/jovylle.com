<script setup>
import { CONTENT_ASSET_BASE } from '~/utils/config'

const PERSONAL_PROJECTS_JSON_URL =
  'https://content.jovylle.com/data/personal-projects.json'

const GITHUB_USER = 'jovylle'
const GITHUB_REPOS_URL = `https://api.github.com/users/${GITHUB_USER}/repos`

/** Extract owner/repo from a GitHub URL (e.g. https://github.com/jovylle/jovylle.com -> "jovylle/jovylle.com") */
function repoUrlToFullName(repoUrl) {
  if (!repoUrl || typeof repoUrl !== 'string') return null
  const trimmed = repoUrl.trim()
  const match = trimmed.match(/github\.com[/:]([^/]+)\/([^/?#]+)/)
  if (!match) return null
  return `${match[1]}/${match[2].replace(/\.git$/, '')}`
}

/** True if URL looks like a badge/SVG we don't want as thumbnail (e.g. License: MIT, shields.io). */
function isBadgeOrSvg(url) {
  if (!url || typeof url !== 'string') return true
  const u = url.trim().toLowerCase()
  return (
    u.endsWith('.svg') ||
    u.includes('img.shields.io') ||
    u.includes('shields.io') ||
    u.includes('badge')
  )
}

/** Get first real image URL from a repo's README (skips SVGs and badge images). Used as thumbnail fallback when API has none. */
async function getFirstImageFromGitHubReadme(owner, repo, defaultBranch = 'main') {
  try {
    const readme = await $fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      { headers: { Accept: 'application/vnd.github.v3+json' } }
    ).catch(() => null)
    if (!readme?.content) return null
    const raw =
      typeof Buffer !== 'undefined'
        ? Buffer.from(readme.content, 'base64').toString('utf8')
        : (typeof atob !== 'undefined' ? atob(readme.content) : '')
    const branch = defaultBranch || readme.url?.match(/ref=([^&]+)/)?.[1] || 'main'
    const base = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`

    /** Resolve relative URLs and return absolute href. */
    function resolveUrl(url) {
      const u = url.trim()
      if (/^https?:\/\//i.test(u)) return u
      try {
        return new URL(u, base).href
      } catch {
        return u
      }
    }

    // Collect all Markdown images: ![alt](url)
    const mdImages = [...raw.matchAll(/!\[[^\]]*\]\s*\(\s*([^)\s]+)\s*\)/g)].map((m) => resolveUrl(m[1]))
    for (const url of mdImages) {
      if (!isBadgeOrSvg(url)) return url
    }
    // Collect all HTML img src
    const htmlImages = [...raw.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map((m) => resolveUrl(m[1]))
    for (const url of htmlImages) {
      if (!isBadgeOrSvg(url)) return url
    }
    return null
  } catch {
    return null
  }
}

/** Fetch all GitHub repos across all pages (per_page=100) */
async function fetchAllGitHubRepos() {
  const all = []
  let page = 1
  let hasMore = true
  while (hasMore) {
    const url = `${GITHUB_REPOS_URL}?per_page=100&page=${page}`
    const chunk = await $fetch(url, {
      headers: { Accept: 'application/vnd.github.v3+json' }
    }).catch(() => [])
    const list = Array.isArray(chunk) ? chunk : []
    all.push(...list)
    hasMore = list.length === 100
    page += 1
  }
  return all
}

function classifyLinkType(label, url) {
  const seed = `${label ?? ''} ${url ?? ''}`.toLowerCase()
  if (seed.includes('repo') || seed.includes('github')) return 'repo'
  if (seed.includes('live') || seed.includes('demo') || seed.includes('app') || seed.includes('site') || seed.includes('home')) return 'live'
  return 'other'
}

/** Map content.jovylle.com JSON entries to the shape used by the page merger. */
function normalizeContentProject(project) {
  const repoUrl = (project?.repo_url || project?.repo || '').trim()
  const links = Array.isArray(project?.links) ? [...project.links] : []

  const addLiveLink = (raw) => {
    const trimmed = (raw || '').trim()
    if (!trimmed) return
    const url = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    if (!links.some((link) => link?.url === url)) {
      links.push({ url, label: 'Live' })
    }
  }

  addLiveLink(project?.live)
  addLiveLink(project?.netlify_live)

  const tech =
    Array.isArray(project?.tech) && project.tech.length
      ? project.tech
      : project?.language
        ? [project.language]
        : []

  return {
    ...project,
    repo_url: repoUrl,
    links,
    tech,
    is_published: project?.is_published === true || project?.status === 'published',
    private: project?.private === true || project?.is_private === true
  }
}

async function fetchPersonalProjects() {
  console.log('personal-projects: fetchPersonalProjects start')

  const [projectsData, githubRepos] = await Promise.all([
    $fetch(PERSONAL_PROJECTS_JSON_URL).catch(() => ({ projects: [] })),
    fetchAllGitHubRepos()
  ])

  const rawProjects = (
    Array.isArray(projectsData) ? projectsData : (projectsData?.projects ?? [])
  ).map(normalizeContentProject)

  // Only show published, non-private projects; hide forks when GitHub metadata is available.
  const publishedProjects = rawProjects.filter((project) => {
    const repoUrl = (project?.repo_url || '').trim()
    const fullName = repoUrlToFullName(repoUrl)
    const ghRepo = fullName
      ? githubRepos.find((r) => r.full_name === fullName)
      : null

    const isPrivate =
      project?.private === true ||
      project?.is_private === true ||
      project?.github_raw?.private === true ||
      ghRepo?.private === true

    const isFork = project?.github_raw?.fork === true || ghRepo?.fork === true

    return (
      project?.is_published === true &&
      isFork !== true &&
      !isPrivate
    )
  })

  const githubByFullName = new Map(
    githubRepos.map((r) => [r.full_name, r])
  )

  const allProjects = (
    await Promise.all(
      publishedProjects.map(async (project) => {
        const repoUrl = (project?.repo_url || '').trim()
        const fullName = repoUrlToFullName(repoUrl)
        const ghRepo = fullName ? githubByFullName.get(fullName) : null
        const descriptionFromGitHub = ghRepo?.description?.trim() || ''
        const description = descriptionFromGitHub || (project?.description || '').trim() || ''

        const rawLinks = Array.isArray(project?.links) ? project.links : []
        const links = []
        if (repoUrl) {
          links.push({ label: 'Repo', url: repoUrl, type: 'repo' })
        }
        rawLinks.forEach((link) => {
          if (!link?.url) return
          const url = link.url.trim()
          if (!url || url === repoUrl) return
          const type = link.type ?? classifyLinkType(link.label, url)
          links.push({ label: link.label || 'Link', url, type })
        })

        let thumbnail = project?.thumbnail || null
        if (!thumbnail && fullName) {
          const [owner, repo] = fullName.split('/')
          if (owner && repo) {
            thumbnail = await getFirstImageFromGitHubReadme(
              owner,
              repo,
              ghRepo?.default_branch || 'main'
            )
          }
        }

        const createdAt = project?.github_raw?.created_at || null
        const startedYear = createdAt ? new Date(createdAt).getFullYear() : null

        return {
          slug: project?.slug || project?.project_key || project?.external_id || project?.title,
          title: (project?.title || '').trim() || 'Untitled Project',
          displayTitle: (project?.title || '').trim() || 'Untitled Project',
          description,
          repo: repoUrl || null,
          links,
          thumbnail,
          created_at: createdAt,
          started_year: startedYear,
          updated_at: project?.updated_at || ghRepo?.updated_at || null,
          tech: Array.isArray(project?.tech) ? project.tech : [],
          priority_score: project?.priority_score ?? 100
        }
      })
    )
  ).filter(Boolean)

  const possibleTechs = []

  console.log(
    'personal-projects: api projects count',
    rawProjects.length,
    'published',
    publishedProjects.length
  )
  console.log(
    'personal-projects: github repos (all pages)',
    githubRepos.length
  )
  console.log(
    'personal-projects: merged projects count',
    allProjects.length
  )

  console.log('personal-projects: fetchPersonalProjects end')

  return {
    allProjects,
    possibleTechs
  }
}

const { data: personalProjectsData } = await useAsyncData(
  'personal-projects-data',
  fetchPersonalProjects,
  { server: true }
)

const allProjects = computed(() => personalProjectsData.value?.allProjects ?? [])
const PRIORITY_HIGHLIGHT_THRESHOLD = 100

const TECH_UNSPECIFIED = 'uncategorized'
const SIMPLE_ICONS_BASE = 'https://cdn.jsdelivr.net/npm/simple-icons@v13/icons'
const TECH_TAG_ICON_META = {
  js: { iconClass: 'bxl-javascript' },
  javascript: { iconClass: 'bxl-javascript' },
  ts: { iconClass: 'bxl-typescript' },
  typescript: { iconClass: 'bxl-typescript' },
  vue: { iconClass: 'bxl-vuejs' },
  vuejs: { iconClass: 'bxl-vuejs' },
  nuxt: { iconImage: `${SIMPLE_ICONS_BASE}/nuxtdotjs.svg` },
  nuxtjs: { iconImage: `${SIMPLE_ICONS_BASE}/nuxtdotjs.svg` },
  playstore: { iconClass: 'bxl-play-store' },
  'play-store': { iconClass: 'bxl-play-store' },
  android: { iconClass: 'bxl-android' },
  github: { iconClass: 'bxl-github' },
  anthropic: { iconImage: `${SIMPLE_ICONS_BASE}/anthropic.svg` },
  openai: { iconImage: `${SIMPLE_ICONS_BASE}/openai.svg` },
  firebase: { iconClass: 'bxl-firebase' },
  aws: { iconClass: 'bxl-aws' },
  'aws-bedrock': { iconImage: `${SIMPLE_ICONS_BASE}/amazonwebservices.svg` },
  'aws-s3': { iconImage: `${SIMPLE_ICONS_BASE}/amazons3.svg` },
  vercel: { iconImage: `${SIMPLE_ICONS_BASE}/vercel.svg` },
  node: { iconClass: 'bxl-nodejs' },
  nodejs: { iconClass: 'bxl-nodejs' },
  react: { iconClass: 'bxl-react' },
  tailwindcss: { iconImage: `${SIMPLE_ICONS_BASE}/tailwindcss.svg` },
  storybook: { iconImage: `${SIMPLE_ICONS_BASE}/storybook.svg` },
  gsap: { iconImage: `${SIMPLE_ICONS_BASE}/greensock.svg` },
  vite: { iconImage: `${SIMPLE_ICONS_BASE}/vite.svg` },
  netlify: { iconClass: 'bxl-netlify' },
  'aws-lambda': { iconImage: `${SIMPLE_ICONS_BASE}/awslambda.svg` },
  n8n: { iconImage: `${SIMPLE_ICONS_BASE}/n8n.svg` },
  'rest-api': { iconClass: 'bx-code-alt' },
  graphql: { iconImage: `${SIMPLE_ICONS_BASE}/graphql.svg` },
  laravel: { iconClass: 'bxl-laravel' },
  php: { iconClass: 'bxl-php' },
  mysql: { iconImage: `${SIMPLE_ICONS_BASE}/mysql.svg` },
  dynamodb: { iconImage: `${SIMPLE_ICONS_BASE}/amazondynamodb.svg` },
  redis: { iconClass: 'bxl-redis' },
  rag: { iconClass: 'bx-code-alt' },
  'prompt-engineering': { iconClass: 'bx-code-alt' },
  json: { iconClass: 'bx-code-alt' },
  [TECH_UNSPECIFIED]: { iconClass: 'bx-code-alt' }
}
const TECH_TAG_ALIASES = {
  'vue-3': 'vuejs',
  'vue-3-composition': 'vuejs',
  'nuxt-js': 'nuxtjs',
  'nuxtjs': 'nuxtjs',
  'react-js': 'react',
  'openai-api': 'openai',
  'anthropic-api': 'anthropic',
  'json-data-apis': 'json',
  'netlify-functions': 'netlify',
  'express-js': 'nodejs',
  'node-js': 'nodejs',
  'aws-lambda': 'aws-lambda',
  'serverless-workflows': 'rest-api',
  'rest-apis': 'rest-api',
  graphql: 'graphql',
  'aws-bedrock': 'aws-bedrock',
  'aws-s3-knowledge-base': 'aws-s3',
  'prompt-engineering': 'prompt-engineering'
}

const normalizeTechKey = (tech) =>
  String(tech ?? '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

const compactTechKey = (tech) =>
  String(tech ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '')

const resolveTechKey = (tech) => {
  const normalized = normalizeTechKey(tech)
  const compact = compactTechKey(tech)

  return (
    TECH_TAG_ALIASES[normalized] ||
    TECH_TAG_ALIASES[compact] ||
    normalized ||
    compact
  )
}

const techTagIconMeta = (tech) => {
  const key = resolveTechKey(tech)
  return TECH_TAG_ICON_META[key] || TECH_TAG_ICON_META[compactTechKey(tech)] || null
}

// Reactive sorting and filtering
const sortBy = ref('priority')
const selectedTech = ref('all')

const rawPossibleTechFilters = computed(() => personalProjectsData.value?.possibleTechs ?? [])

const compareUpdated = (a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0)

const enrichedProjects = computed(() =>
  allProjects.value.map((project) => {
    const techTags = Array.isArray(project.tech)
      ? project.tech.map((tag) => tag?.trim()).filter(Boolean)
      : []
    const normalizedTechs = techTags.length
      ? Array.from(new Set(techTags))
      : [TECH_UNSPECIFIED]

    return {
      ...project,
      techTags: normalizedTechs,
      techLabel: normalizedTechs[0],
      displayTitle: project.displayTitle || project.title?.trim() || 'Untitled Project'
    }
  })
)

// Process and sort projects
const projects = computed(() => {
  let filteredProjects = enrichedProjects.value

  if (selectedTech.value !== 'all') {
    filteredProjects = filteredProjects.filter((project) =>
      project.techTags.includes(selectedTech.value)
    )
  }

  const sortedProjects = [...filteredProjects]

  switch (sortBy.value) {
    case 'priority':
      return sortedProjects.sort((a, b) => {
        const priorityDiff =
          (b.priority_score ?? 0) - (a.priority_score ?? 0)
        return priorityDiff || compareUpdated(a, b)
      })
    case 'recent':
      return sortedProjects.sort(compareUpdated)
    case 'name':
      return sortedProjects.sort((a, b) =>
        (a.displayTitle || '').localeCompare(b.displayTitle || '')
      )
    default:
      return sortedProjects
  }
})

// Get unique tech filters from projects or API
const availableTechFilters = computed(() => {
  if (rawPossibleTechFilters.value.length) {
    return Array.from(new Set(rawPossibleTechFilters.value))
  }

  const techSets = new Set()
  enrichedProjects.value.forEach((project) => {
    project.techTags.forEach((tech) => techSets.add(tech))
  })

  return Array.from(techSets).sort((a, b) => {
    if (a === TECH_UNSPECIFIED) return 1
    if (b === TECH_UNSPECIFIED) return -1
    return a.localeCompare(b)
  })
})

// Tech display names
const techDisplayNames = {
  [TECH_UNSPECIFIED]: 'General Projects'
}

// Format date helper
const formatDate = (dateStr) => {
  if (!dateStr) return 'Unknown'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/** Host + path + search for display, without scheme (e.g. https://d1g.uk/x -> d1g.uk/x). */
function urlWithoutScheme(raw) {
  const s = (raw || '').trim()
  if (!s) return ''
  try {
    const u = new URL(/^https?:\/\//i.test(s) ? s : `https://${s}`)
    let out = u.hostname + (u.port ? `:${u.port}` : '')
    if (u.pathname && u.pathname !== '/') out += u.pathname
    if (u.search) out += u.search
    return out.replace(/\/$/, '') || u.hostname
  } catch {
    return s.replace(/^https?:\/\//i, '')
  }
}

/** When the link label is "Live", show "Live · example.com" so the destination is visible. */
function liveLinkButtonText(link) {
  const label = (link?.label || '').trim()
  const short = urlWithoutScheme(link?.url)
  if (label.toLowerCase() === 'live' && short) {
    return `Live · ${short}`
  }
  return label || 'View live'
}

// Links are already normalized from the projects API (repo + extra links)
const projectLinks = (project) => {
  const raw = Array.isArray(project?.links) && project.links.length > 0
    ? project.links
    : project?.repo
      ? [{ label: 'Repo', url: project.repo, type: 'repo' }]
      : []
  return raw
    .filter((link) => link?.url)
    .map((link) => ({
      label: link.label || 'Link',
      url: link.url,
      type: link.type ?? classifyLinkType(link.label, link.url)
    }))
}

const resolveThumbnail = (thumbnail) => {
  if (!thumbnail) return null
  if (thumbnail.startsWith('http')) return thumbnail
  if (thumbnail.startsWith('/')) return `${CONTENT_ASSET_BASE}${thumbnail}`
  return `${CONTENT_ASSET_BASE}/${thumbnail}`
}

const isHighlightedProject = (project) =>
  (project?.priority_score ?? 0) > PRIORITY_HIGHLIGHT_THRESHOLD

const visibleTechTags = (project) =>
  isHighlightedProject(project)
    ? project.techTags
    : project.techTags.slice(0, 3)

const pageDescription = computed(() =>
  `A comprehensive collection of ${allProjects.value.length} personal projects and experiments`
)

// Meta tags for SEO (but keep it unlisted)
useHead({
  title: 'Personal Projects Archive - Jovylle',
  meta: [
    { name: 'description', content: pageDescription.value },
    { name: 'robots', content: 'noindex, nofollow' } // Keep it unlisted from search engines
  ]
})
</script>

<template>
  <div class="container mx-auto py-10 sm:py-20">
    <div class="min-h-[40vh]">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-3xl sm:text-5xl font-semibold mb-4 text-ternary-dark dark:text-ternary-light">
          Personal Projects Archive
        </h1>
        <p class="text-lg text-secondary-dark dark:text-secondary-light">
          A comprehensive collection of {{ allProjects.length }} personal projects and experiments
        </p>
      </div>

      <!-- Sorting and Filtering Controls -->
      <div class="mb-12 bg-white dark:bg-ternary-dark rounded-lg shadow-lg p-6 border dark:border-gray-700">
        <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <!-- Sort By -->
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
            <select 
              v-model="sortBy" 
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="priority">Default Priority</option>
              <option value="recent">Most Recent</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>

          <!-- Category Filter -->
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Technology:</label>
            <select 
              v-model="selectedTech" 
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Technologies</option>
              <option v-for="tech in availableTechFilters" :key="tech" :value="tech">
                {{ techDisplayNames[tech] || tech }}
              </option>
            </select>
          </div>

          <!-- Results Count -->
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Showing {{ projects.length }} of {{ allProjects.length }} projects
          </div>
        </div>
      </div>

      <!-- All Projects Grid -->
      <div class="mb-16">
        <!-- Projects Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="project in projects"
            :key="project.slug || project.title"
            class="rounded-lg border p-6 transition-all duration-300"
            :class="isHighlightedProject(project)
              ? 'bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl border-gray-200 dark:border-gray-700'
              : 'bg-gray-100 dark:bg-gray-950 border-gray-300 dark:border-gray-800 shadow-md'"
          >
            <!-- Thumbnail -->
            <div v-if="project.thumbnail" class="mb-4">
              <img
                :src="resolveThumbnail(project.thumbnail)"
                :alt="project.title || project.name"
                class="w-full h-40 object-cover rounded-md border dark:border-gray-700"
                loading="lazy"
              />
            </div>

            <!-- Project Header -->
            <div class="mb-4">
              <div class="flex items-center justify-between mb-2 gap-2">
                <h3
                  class="m-0 font-semibold"
                  :class="isHighlightedProject(project)
                    ? 'text-lg text-primary-dark dark:text-primary-light'
                    : 'text-base text-gray-800 dark:text-gray-200'"
                >
                  {{ project.displayTitle }}
                </h3>
              </div>
              <div
                v-if="project.description"
                class="group/desc relative mb-3 min-h-[2.75rem]"
              >
                <p
                  class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 cursor-help"
                  :title="project.description"
                >
                  {{ project.description }}
                </p>
                <div
                  class="pointer-events-none absolute inset-x-0 top-full z-30 pt-1"
                  aria-hidden="true"
                >
                  <div
                    class="pointer-events-none max-h-72 overflow-y-auto rounded-md border border-gray-200 bg-white p-3 text-sm leading-relaxed text-gray-700 shadow-xl opacity-0 transition-opacity duration-150 invisible group-hover/desc:pointer-events-auto group-hover/desc:visible group-hover/desc:opacity-100 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
                  >
                    {{ project.description }}
                  </div>
                </div>
              </div>
              <p
                v-else
                class="text-sm text-gray-600 dark:text-gray-400 mb-3 min-h-[2.75rem]"
              >
                No description available
              </p>
            </div>

            <!-- Project Meta Info -->
            <div class="mb-4 flex flex-wrap gap-2 text-xs">
              <span
                v-for="tech in visibleTechTags(project)"
                :key="tech"
                class="px-2 py-1 rounded-full uppercase tracking-wide"
                :class="isHighlightedProject(project)
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'"
              >
                <i
                  v-if="techTagIconMeta(tech)?.iconClass"
                  class="bx mr-1 align-middle text-sm"
                  :class="techTagIconMeta(tech).iconClass"
                  aria-hidden="true"
                />
                <img
                  v-else-if="techTagIconMeta(tech)?.iconImage"
                  :src="techTagIconMeta(tech).iconImage"
                  :alt="`${tech} icon`"
                  class="inline-block mr-1 h-3.5 w-3.5 align-middle"
                  loading="lazy"
                />
                {{ techDisplayNames[tech] || tech }}
              </span>
              <span
                v-if="!isHighlightedProject(project) && project.techTags.length > 3"
                class="px-2 py-1 rounded-full uppercase tracking-wide bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                +{{ project.techTags.length - 3 }} more
              </span>

              <span
                v-if="project.started_year"
                class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
              >
                {{ project.started_year }}
              </span>
            </div>

            <!-- Project Links: label only inside each button -->
            <div class="flex flex-wrap gap-2">
              <!-- Live / Demo -->
              <a
                v-for="link in projectLinks(project).filter((l) => l.type === 'live')"
                :key="link.url || link.label"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 border border-blue-600"
              >
                <i class="bx bx-link-external"></i>
                {{ liveLinkButtonText(link) }}
              </a>
              <!-- Repo / Code -->
              <a
                v-for="link in projectLinks(project).filter((l) => l.type === 'repo')"
                :key="link.url || link.label"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 border"
                :class="isHighlightedProject(project)
                  ? 'bg-gray-800 dark:bg-gray-600 text-white hover:bg-gray-900 dark:hover:bg-gray-500 border-gray-700 dark:border-gray-500'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600'"
              >
                <i class="bx bxl-github"></i>
                {{ link.label || 'Repo' }}
              </a>
              <!-- Other -->
              <a
                v-for="link in projectLinks(project).filter((l) => l.type === 'other')"
                :key="link.url || link.label"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-transparent text-gray-700 dark:text-gray-300 border border-gray-400 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <i class="bx bx-link-alt"></i>
                {{ link.label || 'Link' }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Note -->
      <div class="text-center mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          This is a comprehensive archive of personal projects. Some may be experimental or incomplete.
        </p>
        <NuxtLink to="/" class="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
          ← Back to Main Site
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles for the personal projects page */
.transition-shadow {
  transition: box-shadow 0.3s ease-in-out;
}

/* Ensure consistent card heights */
.grid > div {
  display: flex;
  flex-direction: column;
}

/* Add some hover effects */
.bg-white:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease-in-out;
}

.dark .bg-ternary-dark:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease-in-out;
}
</style>
