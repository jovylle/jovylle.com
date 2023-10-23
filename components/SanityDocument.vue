<template>
  <div>
    <!-- <h1>{{ document.title }}</h1> -->
    <!-- <div v-html="document._rawBody"></div> -->
    <h1>JUST TRYING</h1>
  </div>
</template>

<script>
export default {
  async asyncData({ app, params }) {
    const document = await app.$sanity.fetch(`*[_type == "post" && slug.current == $slug][0]`, {
      slug: "test-post-hoho1"
      // slug: params.slug
    })
    console.log("document");
    console.log(document);
    return {
      document
    }
  }
}
</script>