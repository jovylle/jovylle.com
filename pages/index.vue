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
    <HomeCards />
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
    meta: [{ name: 'description', content: 'Genuinely addicted to coding.' }]
  });
  
</script>
<style></style>
