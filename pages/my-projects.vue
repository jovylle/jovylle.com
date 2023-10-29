<script setup>
// const { data } = await useAsyncData('home', () => {

//   return queryContent('/').findOne()
// })
  const projects = await queryContent('my-projects').find()
  console.log("projects",projects)
  // https://content.nuxt.com/composables/query-content
</script>

<template>
  <div>
    <ul>
      <li v-for="p in projects" :key="p._path">
        {{p.title}}
        <p>{{p.image}} - <a class="underline" :href="p._path">{{p._path}}</a></p>
      </li>
    </ul>
  </div>
</template>
