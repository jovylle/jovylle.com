<script setup>
import { POCKET_ASSET_BASE } from '~/utils/config'

// Fetch personal projects data from external API
const projectsData = await $fetch('https://pocket.uft1.com/data/personal-projects.json')
const allProjects = projectsData?.projects ?? []

const TECH_UNSPECIFIED = 'uncategorized'

// Reactive sorting and filtering
const sortBy = ref('priority')
const selectedTech = ref('all')

const compareUpdated = (a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0)

const enrichedProjects = computed(() =>
  allProjects.map((project) => {
    const techTags = Array.isArray(project.tech)
      ? project.tech.map((tag) => tag?.trim()).filter(Boolean)
      : []
    const normalizedTechs = techTags.length ? techTags : [TECH_UNSPECIFIED]

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
    case 'stars':
      return sortedProjects.sort((a, b) => (b.stars || 0) - (a.stars || 0))
    case 'name':
      return sortedProjects.sort((a, b) =>
        (a.displayTitle || '').localeCompare(b.displayTitle || '')
      )
    default:
      return sortedProjects
  }
})

// Get unique tech filters from projects
const availableTechFilters = computed(() => {
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

// Normalize links array, keeping existing fields as fallback
const projectLinks = (project) => {
  if (!Array.isArray(project?.links)) return []

  return project.links
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
              <option value="priority">Priority score</option>
              <option value="recent">Most Recent</option>
              <option value="stars">Most Stars</option>
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
              <div class="text-xs uppercase tracking-[0.3em] text-secondary-dark dark:text-secondary-light mb-2">
                {{ techDisplayNames[project.techLabel] || project.techLabel }}
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

              <span 
                v-if="project.stars > 0"
                class="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full flex items-center"
              >
                <i class="bx bx-star mr-1"></i>
                {{ project.stars }}
              </span>

              <span
                v-if="project.draft_or_published"
                class="px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 rounded-full uppercase tracking-wide"
              >
                {{ project.draft_or_published }}
              </span>

              <span
                v-if="project.priority_score != null"
                class="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full uppercase tracking-wide"
              >
                Priority {{ project.priority_score }}
              </span>

              <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                {{ formatDate(project.updated_at) }}
              </span>
            </div>

            <!-- Project Links -->
            <div class="flex flex-wrap gap-2">
              <a
                v-for="link in projectLinks(project)"
                :key="link.url || link.label"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200"
                :class="[
                  link.type === 'live'
                    ? 'text-white bg-blue-600 hover:bg-blue-700'
                    : 'text-white bg-gray-800 hover:bg-gray-900'
                ]"
              >
                <i v-if="link.type === 'repo'" class="bx bxl-github mr-1"></i>
                <i v-else-if="link.type === 'live'" class="bx bx-link-external mr-1"></i>
                {{ link.label || 'Link' }}
              </a>

              <!-- No Live Site Indicator -->
              <span
                v-if="!primaryLiveUrl(project)"
                class="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 rounded-full"
              >
                <i class="bx bx-code-alt mr-1"></i>
                Code Only
              </span>
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