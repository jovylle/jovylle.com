<script setup>
  const items = await queryContent('other').find()
  console.log("other",items)
  // https://content.nuxt.com/composables/query-content
</script>

<template>
  <div></div>
  <div class="container mx-auto py-10 sm:py-20">
    <div class="min-h-[40vh]">
      <h2 class="block">Others.</h2>
      <ul>
        <li v-for="p in items" :key="p._path">
          <a class="underline" :href="p._path">{{p.title}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>
