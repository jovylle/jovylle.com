<script setup>
const { data } = await useAsyncData('home', () => {

  return queryContent('/').findOne()
})
  const contentQuery = await queryContent().find()
  const contentQuery1 = await queryContent('other').find()
  console.log("contentQuery",contentQuery)
  console.log("contentQuery1",contentQuery1)
  // https://content.nuxt.com/composables/query-content
</script>

<template>
  <pre>
    {{ data }}
  </pre>
</template>
