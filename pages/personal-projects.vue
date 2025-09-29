<script setup>
// Fetch personal projects data from external API
const projectsData = await $fetch('https://pocket.uft1.com/data/personal-projects.json')
const allProjects = projectsData?.projects || []

// Reactive sorting and filtering
const sortBy = ref('recent')
const selectedCategory = ref('all')

// Process and sort projects
const projects = computed(() => {
  let filteredProjects = [...allProjects]
  
  // Filter by category if selected
  if (selectedCategory.value !== 'all') {
    filteredProjects = filteredProjects.filter(project => 
      project.category === selectedCategory.value
    )
  }
  
  // Sort projects
  switch (sortBy.value) {
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
          <!-- Sort By -->
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
            <select 
              v-model="sortBy" 
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
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
            <!-- Project Header -->
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-primary-dark dark:text-primary-light mb-2">
                {{ project.title || project.name }}
              </h3>
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
              <!-- GitHub Repo Link -->
              <a
                v-if="project.repo"
                :href="project.repo"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-gray-800 hover:bg-gray-900 rounded-full transition-colors duration-200"
              >
                <i class="bx bxl-github mr-1"></i>
                GitHub
              </a>

              <!-- Live Site Link -->
              <a
                v-if="project.live || project.netlify_live"
                :href="project.live ? project.live : `https://${project.netlify_live}`"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors duration-200"
              >
                <i class="bx bx-link-external mr-1"></i>
                Live Site
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
                v-if="!project.live && !project.netlify_live"
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