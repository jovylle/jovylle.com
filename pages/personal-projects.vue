<script setup>
// Fetch personal projects data
const projectsData = await $fetch('/data/personal-projects.json')
const projects = projectsData?.projects || []

// Group projects by category
const groupedProjects = computed(() => {
  const groups = {}
  projects.forEach(project => {
    if (!groups[project.category]) {
      groups[project.category] = []
    }
    groups[project.category].push(project)
  })
  return groups
})

// Category display names
const categoryNames = {
  'tools-extensions': 'Tools & Extensions',
  'websites-cms': 'Websites & CMS',
  'game-tools': 'Game Tools',
  'experiments-utilities': 'Experiments & Utilities'
}

// Meta tags for SEO (but keep it unlisted)
useHead({
  title: 'Personal Projects Archive - Jovylle',
  meta: [
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
          A comprehensive collection of {{ projects.length }} personal projects and experiments
        </p>
      </div>

      <!-- Projects by Category -->
      <div v-for="(categoryProjects, category) in groupedProjects" :key="category" class="mb-16">
        <!-- Category Header -->
        <div class="mb-8">
          <h2 class="text-2xl sm:text-3xl font-semibold mb-2 text-primary-dark dark:text-primary-light border-b-2 border-secondary-dark dark:border-secondary-light pb-2">
            {{ categoryNames[category] || category }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ categoryProjects.length }} project{{ categoryProjects.length !== 1 ? 's' : '' }}
          </p>
        </div>

        <!-- Projects Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="project in categoryProjects"
            :key="project.slug"
            class="bg-white dark:bg-ternary-dark rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border dark:border-gray-700"
          >
            <!-- Project Header -->
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-primary-dark dark:text-primary-light mb-2">
                {{ project.name }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {{ project.description }}
              </p>
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
                v-if="project.live"
                :href="project.live"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors duration-200"
              >
                <i class="bx bx-link-external mr-1"></i>
                Live Site
              </a>

              <!-- No Live Site Indicator -->
              <span
                v-if="!project.live"
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