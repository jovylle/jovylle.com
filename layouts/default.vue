<template>
  <div
    :class='" text-lg overflow-hidden flex flex-col tracking-wider " + (darkMode?"dark bg-ternary-dark":"bg-ternary-light ")'
  >
    <div class="container mx-auto px-4 max-w-6xl flex flex-col min-h-[100vh] text-primary-dark dark:text-primary-light">
      <section class="">
        <div class="container sm:mx-auto">
          <div
            class="py-6 md:py-12 flex items-center justify-between flex-col sm:flex-row"
          >
            <div
              class="font-bold flex text-xl sm:text-3xl my_hover px-2 justify-between w-full sm:w-auto"
            >
              <div class="sm:hidden">
                <DarkmodeBtn :toggleDarkMode="toggleDarkMode" />
              </div>
              <NuxtLink class="text-center" to="/"> Home </NuxtLink>
              <div class="block sm:hidden text-right">
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
              :class="['font-bold sm:flex my-5 sm:my-0 space-x-0 sm:space-x-3 md:space-x-10  divide-y sm:justify-center divide-gray-200 sm:divide-y-0 w-[100vw] shadow-lg sm:shadow-none',isMenuOpen?'block':'hidden']"
            >
              <NuxtLink
                class="flex_center text-xl my_hover1 inline-flex py-3 sm:py-0 whitespace-nowrap"
                to="/about"
              >
                About me
              </NuxtLink>
              <NuxtLink
                class="flex_center text-xl my_hover1 inline-flex py-3 sm:py-0"
                to="/projects"
              >
                Projects
              </NuxtLink>
              <!-- <NuxtLink
                class="flex_center text-xl my_hover1 inline-flex py-3 sm:py-0"
                to="/posts"
              >
                Posts
              </NuxtLink> -->
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
              <div class="">
                <DarkmodeBtn :toggleDarkMode="toggleDarkMode" />
              </div>
              <NuxtLink class="" to="/contact">
                <button
                  id="contactbutton"
                  class=" scale-90 rounded-lg p-3 my_hover  bg-m4 px-4  "
                >
                  Contacts
                </button>
              </NuxtLink>
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
            class="pt-14 pb-10 flex-col sm:flex-row flex text-center justify-between"
          >
            <div class="my_hover">No Copyright © {{currentYear}} Jovylle</div>
            <div class="my_hover">Powered by NuxtJS</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      darkMode: true,
      currentYear: new Date().getFullYear(),
      isMenuOpen: false
    }
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
    },
  },
}
</script>
