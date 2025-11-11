<template>
  <div
    :class='" text-lg overflow-hidden flex flex-col tracking-wider " + (darkMode?"dark bg-ternary-dark":"bg-ternary-light ")'
    style="--accent:#9CA3AF;--divider:#E9ECEF;--divider-dark:#404040"
  >
    <div class="container mx-auto px-4 max-w-6xl flex flex-col min-h-[100vh] text-primary-dark dark:text-primary-light">
      <section class="">
        <div class="container sm:mx-auto">
          <div
            class="py-6 md:py-9 flex items-center justify-between flex-col sm:flex-row"
          >
            <div
              class="font-bold flex text-xl sm:text-3xl my_hover px-2 justify-between w-full sm:w-auto"
            >
              <!-- <div class="sm:hidden">
                <DarkmodeBtn :toggleDarkMode="toggleDarkMode" />
              </div> -->
              <NuxtLink class="text-center" v-if="!isHomePage" to="/"> Home </NuxtLink>
              <div v-if="!isHomePage" class="block sm:hidden text-right">
                <button
                  aria-label="show menu button"
                  @click="isMenuOpen = !isMenuOpen"
                  class="px-3 "
                >
                  <i v-if="isMenuOpen" class="bx bx-x my-1"></i>
                  <i v-if="!isMenuOpen" class="bx bx-menu my-1"></i>
                </button>
              </div>
            </div>
            <div
              v-if="!isHomePage" 
              :class="['font-bold sm:flex my-5 sm:my-0 space-x-0 sm:space-x-3 md:space-x-10  divide-y sm:justify-center divide-gray-200 sm:divide-y-0 w-[100vw] shadow-lg sm:shadow-none',isMenuOpen?'block':'hidden']"
            >
              <NuxtLink
                class="flex_center text-xl my_hover1 inline-flex py-3 sm:py-0"
                to="/highlights"
              >
                AI & Solutions
              </NuxtLink>
              <a
                class="flex_center text-xl my_hover1 inline-flex py-3 sm:py-0"
                href="https://hub.jovylle.com" target="_blank" rel="noopener"
              >
                Blog & Hub ↗
              </a>
              <NuxtLink
                class="flex_center text-xl my_hover1 inline-flex py-3 sm:py-0"
                to="/uses"
              >
                Uses
              </NuxtLink>
              <NuxtLink
                class="flex_center text-xl my_hover1 inline-flex py-3 sm:py-0 sm:hidden"
                to="/contact"
              >
                Contact
              </NuxtLink>
            </div>
            <div class="hidden sm:flex sm:items-center text-base text-primary-light space-x-2">
              <!-- <div class="">
                <DarkmodeBtn :toggleDarkMode="toggleDarkMode" />
              </div> -->
              <!-- <NuxtLink class="" to="/contact">
                <button
                  id="contactbutton"
                  class=" scale-90 rounded-lg p-3 my_hover  bg-m4 px-4  "
                >
                  Contacts
                </button>
              </NuxtLink> -->
            </div>
          </div>
        </div>
      </section>
      <section class="flex-1">
        <slot />
      </section>
      <section class="footer-section w-[100%]">
        <div class="container mx-auto">
          <div
            class="pt-12 pb-10 flex-col sm:flex-row flex text-center justify-between"
          >
            <div class="my_hover">No Copyright © {{currentYear}}</div>
            <!-- <div class="my_hover">No Copyright © {{currentYear}} Jovylle</div> -->
            <div class="my_hover">
              <div class="">
                <DarkmodeBtn :toggleDarkMode="toggleDarkMode" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    
    
    <!-- Quick Menu Widget via embed.js -->
    <div id="embedded-quick-menu"></div>
  </div>
</template>

<script>
 

export default {
  components: { },
  data() {
    return {
      darkMode: false,
      currentYear: new Date().getFullYear(),
      isMenuOpen: false
    };
  },
  computed: {
    isHomePage() {
      return this.$route.path === '/' || this.$route.path === '/home';
    }
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
    },
    
  },
  mounted() {
    // Load the embeddable quick menu widget (inline, no iframe)
    if (!document.querySelector('script[data-jovylle-embed]')) {
      const s = document.createElement('script');
      s.src = '/widget/embed-inline.js';
      s.async = true;
      s.setAttribute('data-jovylle-embed', 'true');
      s.setAttribute('data-position', 'top-right');
      s.setAttribute('data-size', 'medium');
      document.body.appendChild(s);
    }
  },
  beforeDestroy() {
    
  }
}
</script>

<style scoped>
.chatbot-toggle-button {
  position: fixed;
  top: 20px;
  right: 20px;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>