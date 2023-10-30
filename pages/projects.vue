<script setup>
import { ref } from 'vue';
import imageUrlBuilder from '@sanity/image-url'
//  [the is the docs](https://www.sanity.io/docs/image-url#sanityimage-url)

const builder = imageUrlBuilder({
  projectId: 'x9czj6ra',
  dataset: 'production',
})
const urlFor = (source) => builder.image(source)
//  [the is the docs](https://www.sanity.io/docs/image-url#sanityimage-url)
//https://zp7mbokg.api.sanity.io/v2021-06-07/data/query/production?query=*[_id == $id]&$id="myId"
// TODO: make a global varialbe, maybe global state,
const projects = await queryContent('my-projects').find()
</script>
<template>
  <div>
    <div class="container mx-auto ">
      <section class="my-5 sm:my-14">
        <div
          class="sm:space-x-10 text-center flex justify-center flex-col sm:block"
        >
          <NuxtLink class="underline" to="/parallax">Parallax Effect</NuxtLink>
          <NuxtLink class="underline" to="https://quickchatgpt.netlify.app/"
            ><i class="bx bx-link-external"></i> Quick Chat Bot Tool</NuxtLink
          >
          <NuxtLink class="underline" to="https://theremnant.netlify.app/"
            ><i class="bx bx-link-external"></i> Christian Blog Site
          </NuxtLink>
        </div>
      </section>
      <!-- Projects grid -->
      <section class="pt-10 sm:pt-14 my-5 sm:my-14">
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
            class="rounded-xl shadow-lg hover:shadow-xl overflow-hidden cursor-pointer mb-10 sm:mb-0 dark:border-4 dark:border-m4 flex flex-col max-w-[350px] mx-auto"
            aria-label="Single Project"
          >
            <!-- <div v-if="post.mainImage" class="bg-cover bg-center h-64 w-64" :style="`background-image: url(${post.mainImage?.asset._ref});`"></div> -->
            <div
              v-if="projectItem.image"
              class="bg-cover bg-center aspect-video w-full overflow-hidden max-h-[190px]"
              :style="'background-image: url('+projectItem.image+')'"
            ></div>
            <div
              v-else
              class="bg-cover bg-center aspect-video w-full overflow-hidden max-h-[190px]"
              :style="'background-image: url(https://raw.githubusercontent.com/jovyllebermudez/static/d37ee2dee7175a22031457d711dae74922faf3be/placeholder.png)'"
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
            class="rounded-xl shadow-lg hover:shadow-xl cursor-pointer mb-10 sm:mb-0 bg-secondary-light dark:bg-ternary-dark"
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
        <div class="py-10 sm:py-20 text-center">
          <div
            class="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
            role="alert"
          >
            <span class="font-medium">Ey!</span> Rest of the projects are to be
            added
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
