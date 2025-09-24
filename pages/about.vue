<template>
  <div class="space-y-10 lg:space-y-32">
    <section class="mb-20 flex_center py-8">
      <div class="container mx-auto sm:flex_center flex flex-col space-y-5 sm:space-y-14">
        <h2 class="text-3xl sm:text-5xl text-center font-semibold my-8 my_hover">About Me</h2>
        <p class="text-center">Hello! I'm Jovylle, a Full-Stack Web Developer.</p>
        <p class="text-center">Here are my links:</p>
        <ul class="list-disc list-inside text-center">
          <li><a href="https://jovylle.com" target="_blank" rel="noopener noreferrer">jovylle.com</a></li>
          <li><a href="https://hub.jovylle.com" target="_blank" rel="noopener noreferrer">hub.jovylle.com</a></li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: 'Jovylle - About',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  charset: 'utf-8',
  meta: [{ name: 'description', content: 'Learn more about Jovylle, a Full-Stack web developer.' }]
});
</script>

<style></style>