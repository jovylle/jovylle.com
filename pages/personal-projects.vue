<script setup>
import { POCKET_ASSET_BASE } from '~/utils/config'

const API_URLS = {
  dev: 'https://pmji7qzap2.execute-api.ap-southeast-1.amazonaws.com/dev',
  prod: 'https://ltocvknz09.execute-api.ap-southeast-1.amazonaws.com/prod'
}

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

/** Get first image URL from a repo's README (Markdown or HTML img). Used as thumbnail fallback when API has none. */
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
    // Markdown image: ![alt](url)
    const mdMatch = raw.match(/!\[[^\]]*\]\s*\(\s*([^)\s]+)\s*\)/)
    if (mdMatch) {
      const url = mdMatch[1].trim()
      if (/^https?:\/\//i.test(url)) return url
      const base = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`
      return new URL(url, base).href
    }
    // HTML img: <img ... src="url" ...>
    const imgMatch = raw.match(/<img[^>]+src=["']([^"']+)["']/i)
    if (imgMatch) {
      const url = imgMatch[1].trim()
      if (/^https?:\/\//i.test(url)) return url
      const base = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`
      return new URL(url, base).href
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

async function fetchPersonalProjects() {
  console.log('personal-projects: fetchPersonalProjects start')

  const apiBaseUrl = process.dev ? API_URLS.dev : API_URLS.prod
  const [projectsData, githubRepos] = await Promise.all([
    $fetch(`${apiBaseUrl}/projects`).catch(() => []),
    fetchAllGitHubRepos()
  ])

  const rawProjects = Array.isArray(projectsData)
    ? projectsData
    : (projectsData?.projects ?? [])

  // Only show projects that are in our API and have is_published=true.
  // GitHub repos not in our API are treated as draft and not included.
  const publishedProjects = rawProjects.filter(
    (project) => project?.is_published === true
  )

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

        return {
          slug: project?.slug || project?.project_key || project?.external_id || project?.title,
          title: (project?.title || '').trim() || 'Untitled Project',
          displayTitle: (project?.title || '').trim() || 'Untitled Project',
          description,
          repo: repoUrl || null,
          links,
          thumbnail,
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

const TECH_UNSPECIFIED = 'uncategorized'

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
  if (thumbnail.startsWith('/')) return `${POCKET_ASSET_BASE}${thumbnail}`
  return `${POCKET_ASSET_BASE}/${thumbnail}`
}

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
            class="bg-white dark:bg-ternary-dark rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border dark:border-gray-700"
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
                <h3 class="text-lg font-semibold text-primary-dark dark:text-primary-light">
                  {{ project.displayTitle }}
                </h3>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 min-h-[40px]">
                {{ project.description || 'No description available' }}
              </p>
            </div>

            <!-- Project Meta Info -->
            <div class="mb-4 flex flex-wrap gap-2 text-xs">
              <span
                v-for="tech in project.techTags"
                :key="tech"
                class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full uppercase tracking-wide"
              >
                {{ techDisplayNames[tech] || tech }}
              </span>

              <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                {{ formatDate(project.updated_at) }}
              </span>
            </div>

            <!-- Project Links: clear separation between Live and Repo/Other -->
            <div class="space-y-3">
              <!-- Live / Demo links -->
              <div v-if="projectLinks(project).some((l) => l.type === 'live')" class="space-y-1">
                <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">Live</span>
                <div class="flex flex-wrap gap-2">
                  <a
                    v-for="link in projectLinks(project).filter((l) => l.type === 'live')"
                    :key="link.url || link.label"
                    :href="link.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 border border-blue-600"
                  >
                    <i class="bx bx-link-external mr-1.5"></i>
                    {{ link.label || 'View live' }}
                  </a>
                </div>
              </div>
              <!-- Repo / Code links -->
              <div v-if="projectLinks(project).some((l) => l.type === 'repo')" class="space-y-1">
                <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">Code</span>
                <div class="flex flex-wrap gap-2">
                  <a
                    v-for="link in projectLinks(project).filter((l) => l.type === 'repo')"
                    :key="link.url || link.label"
                    :href="link.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-gray-800 dark:bg-gray-600 text-white hover:bg-gray-900 dark:hover:bg-gray-500 transition-colors duration-200 border border-gray-700 dark:border-gray-500"
                  >
                    <i class="bx bxl-github mr-1.5"></i>
                    {{ link.label || 'Repo' }}
                  </a>
                </div>
              </div>
              <!-- Other links -->
              <div v-if="projectLinks(project).some((l) => l.type === 'other')" class="space-y-1">
                <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">Links</span>
                <div class="flex flex-wrap gap-2">
                  <a
                    v-for="link in projectLinks(project).filter((l) => l.type === 'other')"
                    :key="link.url || link.label"
                    :href="link.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-transparent text-gray-700 dark:text-gray-300 border border-gray-400 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <i class="bx bx-link-alt mr-1.5"></i>
                    {{ link.label || 'Link' }}
                  </a>
                </div>
              </div>
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
