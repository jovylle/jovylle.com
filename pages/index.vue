<template>
  <div class="space-y-10 lg:space-y-32 max-w-[1280px] mx-auto">
    <section class="md:min-h-[80vh] flex_center py-8 ">
      <div class="container mx-auto block lg:flex_center">
        <div class="px-10 md:px-10">
          <img
            class="rounded-2xl max-h-[500px] my_hover"
            style="margin: auto 0"
            src="/me_face-500px-height-min.jpg"
            alt="programmer person"
          />
        </div>
        <div class=" lg:pr-0 p-5 sm:p-10 space-y-4 flex items-center flex-col text-center">
          <h1 class="text-3xl sm:text-4xl font-semibold uppercase my_hover">
            It's me, Jovylle
            <!-- {{response.data.attributes.Title}} -->
          </h1>
          <p class="text-m4 dark:text-ternary-light text-xl py-3 w-[200px]">A Full-Stack Web Developer</p>
          <!-- <HelloSvg class="w-[200px] h-[100px] mx-auto" /> -->
          <!-- <button
            id="resumebutton" class="hover:line-through my_hover hover:cursor-default rounded-lg border-2 border-m1 my-4 py-1 px-3 text-sm flex items-center space-x-1 mx-auto"
          >
            <span>See CV/Resume</span>
            <i class="bx bxs-right-top-arrow-circle"></i>
          </button> -->
        </div>
      </div>
    </section>
    <section class="md:min-h-[60vh] flex_center" id="about">
      <div class="container text-center space-y-10 sm:space-y-14">
        <h2
          class="text-3xl sm:text-5xl text-center font-semibold my-8 my_hover"
        >
          About me
        </h2>
        <div>
          <Coding class="h-[200px] mx-auto max-w-full" />
        </div>
        <div class="text-lg space-y-10 max-w-2xl mx-auto">
          <p class="my_hover">
            Hello, I'm Jovylle, a seasoned web developer with 6 years of experience. I specialize in solving complex problems and pride myself on being an analytical thinker. My journey has taken me through various aspects of web development, including front-end, back-end, and server-side work.
          </p>
          <p>
            As a problem solver, I thrive on challenges and excel at breaking them down into elegant solutions. My diverse skill set spans user-friendly front-end design, efficient back-end logic, and robust server-side development. I'm dedicated to staying updated with the latest industry trends and technologies to ensure that my work is both innovative and reliable. If you're seeking a versatile developer with a track record of delivering exceptional web solutions, I'm ready to discuss how I can contribute to your next project.
          </p>
        </div>
      </div>
    </section>
    <ContactSection />
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
  title: 'Jovylle Bermudez',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  charset: 'utf-8',
  meta: [{ name: 'description', content: 'Genuinely addicted to coding.' }]
});
</script>
<style></style>
