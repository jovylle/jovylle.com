<script setup>
import { POCKET_ASSET_BASE } from '~/utils/config'

// Fetch personal projects data from external API
const projectsData = await $fetch('https://pocket.uft1.com/data/personal-projects.json')
// Only include published projects; drafts are excluded from display entirely
const allProjects = (projectsData?.projects ?? []).filter(
  (p) => (p.draft_or_published || '').toLowerCase() === 'published'
)

const TECH_UNSPECIFIED = 'uncategorized'

// Reactive sorting and filtering
const sortBy = ref('priority')
const selectedTech = ref('all')

const rawPossibleTechFilters = Array.isArray(projectsData?.possible_techs)
  ? projectsData.possible_techs.map((tech) => tech?.trim()).filter(Boolean)
  : []

const compareUpdated = (a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0)

const enrichedProjects = computed(() =>
  allProjects.map((project) => {
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
      displayTitle: project.title?.trim() || 'Untitled Project'
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
  if (rawPossibleTechFilters.length) {
    return Array.from(new Set(rawPossibleTechFilters))
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

const classifyLinkType = (label, url) => {
  const seed = `${label ?? ''} ${url ?? ''}`.toLowerCase()
  if (seed.includes('repo') || seed.includes('github')) return 'repo'
  if (seed.includes('live') || seed.includes('demo') || seed.includes('app') || seed.includes('site')) return 'live'
  return 'other'
}

// Normalize links array from API; fallback to project.repo when links is missing/empty
const projectLinks = (project) => {
  const raw =
    Array.isArray(project?.links) && project.links.length > 0
      ? project.links
      : project?.repo
        ? [{ label: 'Repo', url: project.repo }]
        : []

  return raw
    .filter((link) => link?.url)
    .map((link) => ({
      label: link.label || 'Link',
      url: link.url,
      type: classifyLinkType(link.label, link.url)
    }))
}

const primaryLiveUrl = (project) => {
  const liveLink = projectLinks(project).find((link) => link.type === 'live')
  return liveLink?.url ?? null
}

const resolveThumbnail = (thumbnail) => {
  if (!thumbnail) return null
  if (thumbnail.startsWith('http')) return thumbnail
  if (thumbnail.startsWith('/')) return `${POCKET_ASSET_BASE}${thumbnail}`
  return `${POCKET_ASSET_BASE}/${thumbnail}`
}

// Meta tags for SEO (but keep it unlisted)
useHead({
  title: 'Personal Projects Archive - Jovylle',
  meta: [
    { name: 'description', content: `A comprehensive collection of ${allProjects.length} personal projects and experiments` },
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