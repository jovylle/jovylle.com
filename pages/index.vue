<template>
  <div class="space-y-5 lg:space-y-8 max-w-[1280px] mx-auto">
    <section class="md:min-h-[40vh] flex_center py-8 ">
      <div class="container mx-auto block lg:flex_center">
        <!-- <div class="px-10 md:px-10">
          <img
            class="rounded-2xl max-h-[500px] my_hover"
            style="margin: auto 0"
            src="/me_face-500px-height-min.jpg"
            alt="programmer person"
          />
        </div> -->
        <div class=" lg:pr-0 p-5 sm:p-10 space-y-4 flex items-center flex-col text-center">
          <h1 class="text-3xl sm:text-4xl font-semibold uppercase my_hover">
            It's me, Jovylle
          </h1>
          <p class="text-xl dark:text-ternary-light py-3 max-w-[300px]">A Full-Stack Web Developer</p>
          <p class="text-sm text-gray-600 dark:text-gray-400 max-w-[400px]">
            Building modern web experiences with clean code and thoughtful design
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Check out
            <a
              href="https://github.com/jovylle"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-700 dark:text-gray-200 underline decoration-dashed decoration-1"
            >
              github.com/jovylle
            </a>
            — it’s the best.
          </p>
          <UiDivider />
          <div class="flex items-center gap-3">
            <NuxtLink to="/contact">
              <UiButton variant="primary">Get in touch</UiButton>
            </NuxtLink>
            <NuxtLink to="/highlights">
              <UiButton variant="outline-dashed">AI & Solutions</UiButton>
            </NuxtLink>
            <NuxtLink to="/hub">
              <UiButton variant="outline-dashed">Blog & Hub</UiButton>
            </NuxtLink>
            <NuxtLink to="/personal-projects">
              <UiButton variant="outline-dashed">Projects Archive</UiButton>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
    
  </div>
</template>
<script setup>

  // const { data } = await $fetch(
  //   'https://jojostrapibackend.herokuapp.com/api/items'
  // );

  // console.log(data);
  // console.log('data');

  // this one is gubot response
  // const { data: mymystrapi } = await useFetch('https://jojostrapibackend.herokuapp.com/api/items',{pick:['data']})
  // console.log(mymystrapi)
  // console.log("mymystrapi")

  let strapi = {};
  // data.forEach((item) => {
  //   strapi[item.attributes.key] = item.attributes.value;
  // });

  // const ressmystrapi = await $fetch('/api/mystrapi');
  // const ress = await $fetch('/api/hello');
  // console.log(ressmystrapi);
  // console.log(ress);
  // console.log('server apis');

  useHead({
    title: 'Jovylle',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    charset: 'utf-8',
    meta: [{ name: 'description', content: 'Welcome to Jovylle\'s portfolio, showcasing skills as a Full-Stack web developer.' }]
  });
  
</script>
<style></style>
