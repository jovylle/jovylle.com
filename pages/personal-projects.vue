<script setup>
// Fetch personal projects data from external API
const projectsData = await $fetch('https://pocket.uft1.com/data/personal-projects.json')
const allProjects = projectsData?.projects || []

// Reactive sorting and filtering
const sortBy = ref('priority')
const selectedCategory = ref('all')
const showFavoritesOnly = ref(true) // Default to showing favorites only

// Process and sort projects
const projects = computed(() => {
  let filteredProjects = [...allProjects]
  
  // Filter by favorites if enabled
  if (showFavoritesOnly.value) {
    filteredProjects = filteredProjects.filter(project => project.fav === true)
  }
  
  // Filter by category if selected
  if (selectedCategory.value !== 'all') {
    filteredProjects = filteredProjects.filter(project => 
      project.category === selectedCategory.value
    )
  }
  
  // Sort projects
  switch (sortBy.value) {
    case 'priority':
      return filteredProjects.sort((a, b) => (b.priority_level || 0) - (a.priority_level || 0))
    case 'recent':
      return filteredProjects.sort((a, b) => 
        new Date(b.updated_at) - new Date(a.updated_at)
      )
    case 'stars':
      return filteredProjects.sort((a, b) => (b.stars || 0) - (a.stars || 0))
    case 'name':
      return filteredProjects.sort((a, b) => 
        (a.title || a.name || '').localeCompare(b.title || b.name || '')
      )
    default:
      return filteredProjects
  }
})

// Get unique categories from projects
const availableCategories = computed(() => {
  const categories = new Set()
  allProjects.forEach(project => {
    if (project.category) {
      categories.add(project.category)
    }
  })
  return Array.from(categories).sort()
})

// Category display names
const categoryNames = {
  'tools-extensions': 'Tools & Extensions',
  'websites-cms': 'Websites & CMS',
  'game-tools': 'Game Tools',
  'experiments-utilities': 'Experiments & Utilities',
  'uncategorized': 'Other Projects'
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

// Normalize links array, keeping existing fields as fallback
const projectLinks = (project) => {
  if (Array.isArray(project?.links) && project.links.length) return project.links

  const links = []
  if (project?.repo) links.push({ label: 'Repo', url: project.repo, type: 'repo' })
  if (project?.live) links.push({ label: 'Live', url: project.live, type: 'live' })
  if (project?.netlify_live) links.push({ label: 'Netlify', url: `https://${project.netlify_live}`, type: 'live' })
  return links
}

const primaryLiveUrl = (project) => {
  const liveLink = projectLinks(project).find(link => link.type === 'live')
  if (liveLink?.url) return liveLink.url
  if (project?.live) return project.live
  if (project?.netlify_live) return `https://${project.netlify_live}`
  return null
}

// Meta tags for SEO (but keep it unlisted)
useHead({
  title: 'Personal Projects Archive - Jovylle',
  meta: [
    { name: 'description', content: `A comprehensive collection of ${allProjects.length} personal projects and experiments` },
    { name: 'robots', content: 'noindex, nofollow' }, // Keep it unlisted from search engines
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
          <!-- Favorites Filter -->
          <div class="flex items-center gap-2">
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
              <input 
                type="checkbox" 
                v-model="showFavoritesOnly"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              >
              <i class="bx bx-heart text-red-500"></i>
              Favorites Only
            </label>
          </div>

          <!-- Sort By -->
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
            <select 
              v-model="sortBy" 
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="priority">Priority level</option>
              <option value="recent">Most Recent</option>
              <option value="stars">Most Stars</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>

          <!-- Category Filter -->
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Category:</label>
            <select 
              v-model="selectedCategory" 
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Categories</option>
              <option v-for="category in availableCategories" :key="category" :value="category">
                {{ categoryNames[category] || category }}
              </option>
            </select>
          </div>

          <!-- Results Count -->
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Showing {{ projects.length }} of {{ allProjects.length }} projects
            <span v-if="showFavoritesOnly" class="text-red-500">(favorites)</span>
          </div>
        </div>
      </div>

      <!-- All Projects Grid -->
      <div class="mb-16">
        <!-- Projects Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="project in projects"
            :key="project.slug || project.name"
            class="bg-white dark:bg-ternary-dark rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border dark:border-gray-700"
          >
            <!-- Thumbnail -->
            <div v-if="project.thumbnail" class="mb-4">
              <img
                :src="project.thumbnail"
                :alt="project.title || project.name"
                class="w-full h-40 object-cover rounded-md border dark:border-gray-700"
                loading="lazy"
              />
            </div>

            <!-- Project Header -->
            <div class="mb-4">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-semibold text-primary-dark dark:text-primary-light">
                  {{ project.title || project.name }}
                </h3>
                <span
                  v-if="project.priority_level"
                  class="ml-2 inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200"
                >
                  P{{ project.priority_level }}
                </span>
                <i 
                  v-if="project.fav" 
                  class="bx bx-heart text-red-500 text-lg"
                  title="Favorite Project"
                ></i>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 min-h-[40px]">
                {{ project.description || 'No description available' }}
              </p>
            </div>

            <!-- Project Meta Info -->
            <div class="mb-4 flex flex-wrap gap-2 text-xs">
              <!-- Language -->
              <span 
                v-if="project.language"
                class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
              >
                {{ project.language }}
              </span>
              
              <!-- Stars -->
              <span 
                v-if="project.stars > 0"
                class="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full flex items-center"
              >
                <i class="bx bx-star mr-1"></i>
                {{ project.stars }}
              </span>
              
              <!-- Last Updated -->
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

              <!-- Netlify Status Badge (if available) -->
              <span
                v-if="project.netlify_status === 'current' && project.netlify_live"
                class="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 dark:text-green-200 bg-green-100 dark:bg-green-900 rounded-full"
              >
                <i class="bx bx-check-circle mr-1"></i>
                Deployed
              </span>

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