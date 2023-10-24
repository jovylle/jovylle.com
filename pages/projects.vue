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
const posts = ref([]);
try {
  //  [sample data I have](https://x9czj6ra.api.sanity.io/v2021-06-07/data/query/production?query=*[_type == "portfolioProject" ]{_id,title,subTitle,slug,mainImage}url)
  const response = await useFetch('https://'+'x9czj6ra'+'.api.sanity.io/v2021-06-07/data/query/'+'production'+'?query=*[_type == "portfolioProject" ]{_id,title,subTitle,slug,mainImage}')
  posts.value =  response.data._rawValue.result;
  console.log("posts", response.data._rawValue.result);
} catch (error) {
  console.error(error);
}
</script>
<template>
  <div>
    <div class="container mx-auto ">
      <section class="my-5 sm:my-14">
        <div class="space-x-10 text-center ">
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
            class="font-general-semibold text-2xl sm:text-5xl font-semibold mb-2 text-ternary-dark dark:text-ternary-light"
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
          v-if="posts.length"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 sm:gap-10"
        >
          <NuxtLink
            v-for="post in posts"
            :key="post._id"
            :to="'/project/'+post.slug.current"
            class="rounded-xl shadow-lg hover:shadow-xl overflow-hidden cursor-pointer mb-10 sm:mb-0 dark:border-4 dark:border-m4"
            aria-label="Single Project"
          >
            <!-- <div v-if="post.mainImage" class="bg-cover bg-center h-64 w-64" :style="`background-image: url(${post.mainImage?.asset._ref});`"></div> -->
            <div class="bg-cover bg-center aspect-video w-full overflow-hidden">
              <img
                v-if="post.mainImage"
                :src="urlFor(post.mainImage.asset._ref).auto('format').width(300).url()"
                :alt="post.title"
                class="bg-white"
                auto="format"
              />
              <img
                v-else
                src="https://raw.githubusercontent.com/jovyllebermudez/static/d37ee2dee7175a22031457d711dae74922faf3be/placeholder.png"
                :alt="post.title"
                class=" bg-white"
              />
            </div>
            <!-- <div class="rounded-t-xl overflow-hidden">
              <div v-if="post.mainImage" class="bg-cover bg-center h-64 w-64">
                <SanityImage
                  :asset-id="post.mainImage.asset._ref"
                  alt="post.title"
                  class=""
                  auto="format"
                />
              </div>
              <img
                v-else
                src="https://raw.githubusercontent.com/jovyllebermudez/static/d37ee2dee7175a22031457d711dae74922faf3be/placeholder.png"
                alt="post.title"
                class="rounded-t-xl border-none"
              />
            </div> -->
            <div class="text-center px-4 py-6">
              <p class="font-general-semibold text-xl font-semibold mb-2">
                {{ post.title }}
              </p>
              <span
                class="font-general-medium text-lg"
                >{{ post.subTitle }}</span
              >
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
      </section>
    </div>
  </div>
</template>
