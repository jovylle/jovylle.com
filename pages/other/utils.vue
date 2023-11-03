<template>
  <section>
    adsadas
    <div class="bg-primary-light"> primary-light</div>
    <div class="bg-secondary-light"> secondary-light</div>
    <div class="bg-ternary-light"> ternary-light</div>
    <div class="bg-primary-dark text-primary-light"> primary-dark</div>
    <div class="bg-secondary-dark text-secondary-light"> secondary-dark</div>
    <div class="bg-ternary-dark text-ternary-light"> ternary-dark</div>
    <div class="bg-m1 "> m1</div>
    <div class="bg-m2 "> m2</div>
    <div class="bg-m3 "> m3</div>
    <div class="bg-m4 "> m4</div>
    <div class="bg-m5 "> m5</div>
  </section>
  <section>
    <div class="container mx-auto">
      <div class="text-center py-14">
        <div class="text-4xl my-6 font-bold">
          Hey there. I'm Jovylle Bermudez
        </div>
        <div class="text-xl my-8">
          Hey there. I'm Jovylle Bermudez
        </div>
        <div class="text-xl my-8">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio, omnis! Atque consequatur aliquid excepturi illo quia, possimus explicabo animi eos error nihil nisi accusantium repudiandae obcaecati magnam rerum? Quam, dicta.
        </div>
        <div class="text-xl my-8">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio, omnis! Atque consequatur aliquid excepturi illo quia, possimus explicabo animi eos error nihil nisi accusantium repudiandae obcaecati magnam rerum? Quam, dicta.
        </div>
        <div>
          {{ohName2}}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
let ohName2 = ''
//     SAMPLE GET THROUGH API
// const {data}: {data:any} = await useFetch("/api/hello")
// const { data } = await useAsyncData("asd", () =>
//   $fetch("http://localhost:1337/api/items")
// );
// console.log(data);
// console.log("data");

// import type { Item } from "~/types";
// import type { Strapi4Response } from "@nuxtjs/strapi";

// const { find } = useStrapi4();

// const res = await find<Strapi4Response<Item>>("items", {
//   filters: {
//     key: {
//       $eq: "name",
//     },
//   },
// });
// const name = res.data[0].attributes.value;
// console.log(name);
</script>
<!-- <script lang="ts">
export default {
  layout: "custom",
};
</script>  -->
<style>
</style>