<script setup>
// const { data } = await useAsyncData('home', () => {

//   return queryContent('/').findOne()
// })
  const projects = await queryContent('post').find()
  console.log("post",projects)
  // https://content.nuxt.com/composables/query-content
</script>

<template>
  <div></div>

  <div class="container mx-auto py-10 sm:py-20">
    <div class="min-h-[40vh]">
      <h2 class="block">Posts.</h2>
      <ul>
        <li v-for="p in projects" :key="p._path">
          <a class="underline" :href="p._path">{{p.title}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>
