<script setup>
// const { data } = await useAsyncData('home', () => {

//   return queryContent('/').findOne()
// })
  const projects = await queryContent('post').find()
  console.log("post",projects)
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
