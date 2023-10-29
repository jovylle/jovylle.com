<script>
export default {
  mounted() {
    window.addEventListener('scroll', this.parallaxEffect);
  },
  methods: {
    parallaxEffect() {
      const scroll = window.scrollY;
      const qs = (str) => this.$el.querySelector(str);
      // parallaxBackground.style.transform = `translateY(-${window.scrollY * 1}px)`;
      // Adjust the position of the div as the user scrolls
      qs(".moving-bg2").style.backgroundPositionY = -scroll * 1 + "px";
      qs(".moving").style.top = -scroll * 0.8 + "px";
      qs(".moving2").style.top = -scroll * 0.6 + "px";
    },
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.parallaxEffect);
  }
};
</script>

<template>
  <section class="py-20 sm:py-40">
    <div>
      <div class="moving-bg-style moving-bg2 aspect-square max-w-full w-80 mx-auto">
        <p class=" h-full flex items-center justify-center "><span class="text-4xl drop-shadow-2xl">BG MOVING</span></p>
      </div>
      <img
        class="moving-div moving2 relative left-20"
        src="https://picsum.photos/100"
        alt="image"
      />
      <div class="w-full">
        <img
          class="moving-div moving relative right-20 ml-auto"
          src="https://picsum.photos/150"
          alt="image"
        />
      </div>
    </div>
  </section>
</template>
<style scoped>
.moving-bg-style {
  background-image: url('https://picsum.photos/1000');
  background-position: center;
  background-size: auto;
}

.moving-div {
  width: 200px;
  height: 200px;
  background-color: #3498db;
  position: relative;
  transition: top 0.3s ease;
}
</style>
