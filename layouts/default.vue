<template>
  <div
    :class='" text-lg overflow-hidden flex flex-col tracking-wider " + (darkMode?"dark bg-ternary-dark":"bg-ternary-light ")'
    style="--accent:#9CA3AF;--divider:#E9ECEF;--divider-dark:#404040"
  >
    <h1 class="sr-only">Jovylle Bermudez</h1>
    <div class="container mx-auto px-4 max-w-6xl flex flex-col min-h-[100vh] text-primary-dark dark:text-primary-light">
      <section v-if="!isHomePage" class="site-header-wrap">
        <div class="container sm:mx-auto">
          <div class="site-header-bar">
            <NuxtLink to="/" class="nav-home">Home</NuxtLink>
            <button
              type="button"
              class="site-menu-btn sm:hidden"
              aria-label="Toggle navigation menu"
              :aria-expanded="isMenuOpen"
              @click="isMenuOpen = !isMenuOpen"
            >
              <i v-if="isMenuOpen" class="bx bx-x" aria-hidden="true"></i>
              <i v-else class="bx bx-menu" aria-hidden="true"></i>
            </button>
            <nav
              :class="['site-nav', isMenuOpen ? 'site-nav--open' : '']"
              aria-label="Main"
            >
              <NuxtLink
                to="/highlights"
                class="nav-link"
                :class="{ 'nav-link--active': isNavActive('/highlights') }"
                @click="closeMenu"
              >
                AI & Solutions
              </NuxtLink>
              <NuxtLink
                to="/personal-projects"
                class="nav-link"
                :class="{ 'nav-link--active': isNavActive('/personal-projects') }"
                @click="closeMenu"
              >
                Projects
              </NuxtLink>
              <NuxtLink
                to="/impact"
                class="nav-link"
                :class="{ 'nav-link--active': isNavActive('/impact') }"
                @click="closeMenu"
              >
                Impact
              </NuxtLink>
              <NuxtLink
                to="/uses"
                class="nav-link"
                :class="{ 'nav-link--active': isNavActive('/uses') }"
                @click="closeMenu"
              >
                Uses
              </NuxtLink>
              <a
                class="nav-link nav-link--external"
                href="https://hub.jovylle.com"
                target="_blank"
                rel="noopener"
                @click="closeMenu"
              >
                Blog & Hub ↗
              </a>
              <NuxtLink
                to="/contact"
                class="nav-link sm:hidden"
                :class="{ 'nav-link--active': isNavActive('/contact') }"
                @click="closeMenu"
              >
                Contact
              </NuxtLink>
            </nav>
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
            <div class="my_hover">
              <div class="">
                <DarkmodeBtn :toggleDarkMode="toggleDarkMode" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

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
  watch: {
    '$route.path'() {
      this.isMenuOpen = false;
    }
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
    },
    closeMenu() {
      this.isMenuOpen = false;
    },
    isNavActive(path) {
      const current = this.$route.path;
      return current === path || current.startsWith(`${path}/`);
    }
  },
  mounted() {
    if (!document.querySelector('script[data-jovylle-embed]')) {
      const s = document.createElement('script');
      s.src = '/widget/embed-inline.js';
      s.async = true;
      s.setAttribute('data-jovylle-embed', 'true');
      s.setAttribute('data-position', 'top-right');
      s.setAttribute('data-size', 'medium');
      s.setAttribute('data-show-leaderboard', 'true');
      document.body.appendChild(s);
    }
  },
  beforeDestroy() {

  }
}
</script>

<style scoped>
.site-header-wrap {
  padding: 1rem 0 0.5rem;
}

@media (min-width: 640px) {
  .site-header-wrap {
    padding: 1.5rem 0 0.75rem;
  }
}

.site-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  position: relative;
}

.nav-home {
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: rgb(55 65 81);
  text-decoration: none;
}

.dark .nav-home {
  color: rgb(229 231 235);
}

.nav-home:hover {
  text-decoration: underline;
  text-decoration-style: dashed;
  text-underline-offset: 4px;
}

.site-menu-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem 0.5rem;
  font-size: 1.25rem;
  line-height: 1;
  color: rgb(75 85 99);
  background: transparent;
  border: 2px dashed var(--divider);
  border-radius: 4px;
}

.dark .site-menu-btn {
  color: rgb(209 213 219);
  border-color: var(--divider-dark);
}

.site-nav {
  display: none;
  flex-direction: column;
  gap: 0.25rem;
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  z-index: 40;
  min-width: 11rem;
  padding: 0.5rem;
  background: rgb(255 255 255);
  border: 2px dashed var(--divider);
  border-radius: 6px;
}

.dark .site-nav {
  background: rgb(31 41 55);
  border-color: var(--divider-dark);
}

.site-nav--open {
  display: flex;
}

@media (min-width: 640px) {
  .site-nav {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 0.25rem 1rem;
    position: static;
    min-width: 0;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: 0;
  }

  .dark .site-nav {
    background: transparent;
    border: none;
  }
}

.nav-link {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.625rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25;
  color: rgb(107 114 128);
  text-decoration: none;
  border-radius: 4px;
  transition: color 0.15s ease;
}

@media (min-width: 640px) {
  .nav-link {
    padding: 0.25rem 0.125rem;
  }
}

.dark .nav-link {
  color: rgb(156 163 175);
}

.nav-link:hover {
  color: rgb(55 65 81);
}

.dark .nav-link:hover {
  color: rgb(243 244 246);
}

.nav-link--active {
  color: rgb(17 24 39);
  text-decoration: underline;
  text-decoration-style: dashed;
  text-underline-offset: 4px;
  text-decoration-color: var(--accent);
}

.dark .nav-link--active {
  color: rgb(255 255 255);
}

.nav-link--external {
  white-space: nowrap;
}

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
