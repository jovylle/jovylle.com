<script setup>
const projects = await queryContent('decap/posts/test').find();
console.log("posts", projects);
</script>

<template>
  <div class="container mx-auto py-10 sm:py-20">
    <h2 class="block text-2xl font-bold mb-5">Posts</h2>
    <ul class="space-y-4">
      <li v-for="p in projects" :key="p._path" class="border-b pb-4">
        <a class=" underline inline-block" :href="p._path">
          <h3 class="text-xl font-semibold">{{ p.title }}</h3>
          <p class=" text-sm ">{{ p.date }}</p>
          <p class="mt-2">{{ p.excerpt }}</p>
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
}
</style>
