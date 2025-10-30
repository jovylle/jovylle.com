<script setup>
// Temporarily redirect projects to highlights to avoid confusion
await navigateTo('/highlights', { replace: true })
// Note: legacy code below retained for potential future use
// const projects = await queryContent('projects').find()

</script>
<template>
  <div>
    <div class="container mx-auto ">
      <!-- Projects grid -->
      <section class="pt-4 sm:pt-8 my-5 sm:my-8">
        <!-- Projects grid title -->
        <div class="text-center">
          <p
            class="font-general-semibold text-xl sm:text-2xl sm:text-5xl font-semibold mb-2 text-ternary-dark dark:text-ternary-light"
          >
            Projects
          </p>
        </div>
        <!-- Filter and search projects -->
        <div class="mt-10 sm:mt-10">
          <h3
            class="font-general-regular text-center text-secondary-dark dark:text-ternary-light text-md sm:text-xl font-normal mb-4"
          ></h3>
        </div>
        <!-- Projects grid -->
        <div
          v-if="projects.length"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 sm:gap-10"
        >
          <NuxtLink
            v-for="projectItem in projects"
            :key="projectItem._path"
            :to="projectItem._path"
            class="rounded-xl overflow-hidden cursor-pointer mb-10 sm:mb-0 flex flex-col max-w-[350px] mx-auto w-full bg-white dark:bg-ternary-dark border-[3px] border-dashed border-[color:var(--divider)] dark:border-[color:var(--divider-dark)]"
            aria-label="Single Project"
          >
            <!-- <div v-if="post.mainImage" class="bg-cover bg-center h-64 w-64" :style="`background-image: url(${post.mainImage?.asset._ref});`"></div> -->
            <div
              v-if="projectItem.image"
              class="bg-cover bg-center aspect-video w-full overflow-hidden max-h-[190px]"
              :style="`background-image: url(${projectItem.image})`"
            ></div>
            <div
              v-else-if="projectItem.thumbnail"
              class="bg-cover bg-center aspect-video w-full overflow-hidden max-h-[190px]"
              :style="`background-image: url(${projectItem.thumbnail})`"
            ></div>
            <div
              v-else
              class="bg-cover bg-center aspect-video w-full overflow-hidden max-h-[190px]"
              :style="'background-image: url(https://raw.githubusercontent.com/jovylle/static/d37ee2dee7175a22031457d711dae74922faf3be/placeholder.png)'"
            ></div>
            <div
              class="text-center px-4 py-6 flex justify-center items-center flex-1"
            >
              <p
                class="font-general-semibold text-md sm:text-xl font-semibold p-0"
              >
                {{ projectItem.title }}
              </p>
            </div>
          </NuxtLink>
        </div>
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 sm:gap-10"
        >
          <div
            class="rounded-xl cursor-pointer mb-10 sm:mb-0 bg-secondary-light dark:bg-ternary-dark border-[3px] border-dashed border-[color:var(--divider)] dark:border-[color:var(--divider-dark)]"
          >
            <div>
              <img
                src="https://nuxtjs-tailwindcss-portfolio.netlify.app/images/web-project-2.jpg"
                alt="post.title"
                class="rounded-t-xl border-none"
              />
            </div>
            <div class="text-center px-4 py-6">
              <p
                class="font-general-semibold text-xl text-ternary-dark dark:text-ternary-light font-semibold mb-2"
              >
                Loading
              </p>
            </div>
          </div>
        </div>
        <div class="py-8 sm:py-12 text-center">
          <div
            class="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
            role="alert"
          >
            <span class="font-medium">Ey!</span> Rest of the projects are to be
            added or not available
          </div>
        </div>
      </section>
      <section class="my-5 sm:my-8">
        <div class="text-center">
          <p
            class="font-general-semibold text-xl sm:text-2xl sm:text-5xl font-semibold mb-2 text-ternary-dark dark:text-ternary-light"
          >
            Other Links
          </p>
        </div>
        <div
          class="sm:space-x-10 text-center flex justify-center flex-col sm:block"
        >
          <NuxtLink class="underline inline-block mt-4" to="https://gptfree.uft1.com/" target="_blank">Chat Bot gpt3.5 ↗</NuxtLink>
          <NuxtLink class="underline inline-block mt-4" to="http://uft1.com/" target="_blank">Random Utility/Mini Tools List Site ↗</NuxtLink>
          <NuxtLink class="underline inline-block mt-4" to="https://friendmc.uft1.com/" target="_blank">Our Minecraft Server ↗</NuxtLink>
          <NuxtLink class="underline inline-block mt-4" to="https://sunflower-land-helper.jovylle.com/" target="_blank">Sunflowerland game Extension ↗</NuxtLink>
          <NuxtLink class="underline inline-block mt-4" to="https://flyingstickfigure.atcebu.win/" target="_blank">Stick Figure Simple PhaserJs Game ↗</NuxtLink>
          <NuxtLink class="underline inline-block mt-4" to="https://is-home-online.uft1.com/" target="_blank">Check if home server is online ↗</NuxtLink>
          <NuxtLink class="underline inline-block mt-4" to="/noises">♪ Rain Sound Noise ♪</NuxtLink>
          <NuxtLink class="underline inline-block mt-4" to="/parallax">Parallax Effect</NuxtLink>
          <!-- <NuxtLink class="underline inline-block mt-4" to="/game">minesweeper</NuxtLink> -->
          <!-- 
          <NuxtLink class="underline inline-block mt-4" to="https://flyingstickfigure.atcebu.win/" target="_blank">
            <i class="bx bx-link-external" ></i> 
            flying stick figure game
          </NuxtLink> 
          -->
        </div>
      </section>
      <!-- <section>
        <giscus />
      </section> -->
    </div>
  </div>
</template>

