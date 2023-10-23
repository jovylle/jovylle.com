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
      qs(".moving-bg2").style.backgroundPositionY = -scroll * 0.5 + "px";
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
  <div>
    <div class="parallax-container">
      <p>11111</p>
      <div class="parallax-background moving-bg2"></div>
      <div class="parallax-content">
        <p>asd</p>
      </div>
      <p>2222</p>
    </div>
    <div class="moving-div moving">moving-divmoving-div</div>
    <img class="moving-div moving2" src="https://picsum.photos/100" alt="image" />
  </div>
</template>
<style scoped>
.parallax-container {
  position: relative;
  height: 50vh;
  overflow: hidden;
}

.parallax-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://picsum.photos/400');
  background-size: cover;
  background-position: center;
}

.parallax-content {
  position: relative;
  z-index: 1;
  padding: 20px;
}
.moving-div {
  width: 200px;
  height: 200px;
  background-color: #3498db;
  position: relative;
  transition: top 0.3s ease;
}
</style>
