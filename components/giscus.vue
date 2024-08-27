<template>
  <div id="giscus-comments"></div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // Create and append the Giscus script
  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.setAttribute('data-repo', 'jovylle/jovylle.com');
  script.setAttribute('data-repo-id', 'R_kgDOKkF1cw');
  script.setAttribute('data-category', 'Announcements');
  script.setAttribute('data-category-id', 'DIC_kwDOKkF1c84Ch9d2');
  script.setAttribute('data-mapping', 'pathname');
  script.setAttribute('data-strict', '0');
  script.setAttribute('data-reactions-enabled', '1');
  script.setAttribute('data-emit-metadata', '0');
  script.setAttribute('data-input-position', 'top');
  script.setAttribute('data-theme', 'dark_dimmed');
  script.setAttribute('data-lang', 'en');
  script.setAttribute('crossorigin', 'anonymous');
  script.async = true;

  // Append script to the DOM
  document.getElementById('giscus-comments').appendChild(script);
});
</script>

<style scoped>
/* Optional: Add any styles specific to Giscus */
</style>
