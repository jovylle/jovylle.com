<template>
  <div
    :class='" text-lg overflow-hidden flex flex-col tracking-wider " + (darkMode?"dark bg-ternary-dark":"bg-ternary-light ")'
    style="--accent:#9CA3AF;--divider:#E9ECEF;--divider-dark:#404040"
  >
    <h1 class="sr-only">Jovylle Bermudez</h1>
    <div class="container mx-auto px-4 max-w-6xl flex flex-col min-h-[100vh] text-primary-dark dark:text-primary-light">
      <header v-if="!isHomePage" class="site-header">
        <div class="site-header__inner">
          <NuxtLink to="/" class="brand" aria-label="Home">Home</NuxtLink>

          <nav class="site-nav" aria-label="Main">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="nav-link"
              :class="{ 'nav-link--active': isNavActive(item.to) }"
            >
              {{ item.label }}
            </NuxtLink>
            <a
              class="nav-link nav-link--external"
              href="https://hub.jovylle.com"
              target="_blank"
              rel="noopener"
            >
              Blog &amp; Hub
              <span aria-hidden="true" class="nav-link__ext">↗</span>
            </a>
          </nav>

          <button
            type="button"
            class="menu-btn"
            aria-label="Toggle navigation menu"
            :aria-expanded="isMenuOpen"
            @click="isMenuOpen = !isMenuOpen"
          >
            <i v-if="isMenuOpen" class="bx bx-x" aria-hidden="true"></i>
            <i v-else class="bx bx-menu" aria-hidden="true"></i>
          </button>
        </div>

        <div class="mobile-nav" :class="{ 'mobile-nav--open': isMenuOpen }">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="mobile-nav__link"
            :class="{ 'mobile-nav__link--active': isNavActive(item.to) }"
            @click="closeMenu"
          >
            {{ item.label }}
          </NuxtLink>
          <a
            class="mobile-nav__link"
            href="https://hub.jovylle.com"
            target="_blank"
            rel="noopener"
            @click="closeMenu"
          >
            Blog &amp; Hub ↗
          </a>
          <NuxtLink
            to="/contact/"
            class="mobile-nav__link"
            :class="{ 'mobile-nav__link--active': isNavActive('/contact/') }"
            @click="closeMenu"
          >
            Contact
          </NuxtLink>
        </div>
      </header>
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
      isMenuOpen: false,
      navItems: [
        { to: '/highlights/', label: 'AI & Solutions' },
        { to: '/personal-projects/', label: 'Projects' },
        { to: '/impact/', label: 'Impact' },
        { to: '/uses', label: 'Uses' }
      ]
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
.site-header {
  padding: 1rem 0 0.75rem;
  /* leave room for the fixed top-right widget (~80px wide + 20px right offset) */
  padding-right: 96px;
  border-bottom: 2px dashed var(--divider);
  margin-bottom: 1.25rem;
}

.dark .site-header {
  border-bottom-color: var(--divider-dark);
}

.site-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  position: relative;
}

.brand {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: rgb(55 65 81);
  text-decoration: none;
  border: 2px dashed transparent;
  border-radius: 4px;
}

.dark .brand {
  color: rgb(229 231 235);
}

.brand:hover {
  border-color: var(--divider);
}

.dark .brand:hover {
  border-color: var(--divider-dark);
}

.site-nav {
  display: none;
}

@media (min-width: 768px) {
  .site-nav {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem 0.7rem;
  font-size: 0.825rem;
  font-weight: 500;
  line-height: 1.2;
  color: rgb(75 85 99);
  text-decoration: none;
  border: 2px dashed transparent;
  border-radius: 4px;
  transition: color 0.15s ease, border-color 0.15s ease;
  white-space: nowrap;
}

.dark .nav-link {
  color: rgb(209 213 219);
}

.nav-link:hover {
  color: rgb(17 24 39);
  border-color: var(--divider);
}

.dark .nav-link:hover {
  color: rgb(255 255 255);
  border-color: var(--divider-dark);
}

.nav-link--active,
.nav-link--active:hover {
  color: rgb(17 24 39);
  border-color: var(--accent);
}

.dark .nav-link--active,
.dark .nav-link--active:hover {
  color: rgb(255 255 255);
  border-color: var(--accent);
}

.nav-link__ext {
  font-size: 0.7rem;
  opacity: 0.6;
}

.menu-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-size: 1.25rem;
  line-height: 1;
  color: rgb(75 85 99);
  background: transparent;
  border: 2px dashed var(--divider);
  border-radius: 4px;
  cursor: pointer;
}

.dark .menu-btn {
  color: rgb(209 213 219);
  border-color: var(--divider-dark);
}

@media (min-width: 768px) {
  .menu-btn {
    display: none;
  }
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease, padding 0.25s ease, margin 0.25s ease;
}

.mobile-nav--open {
  max-height: 480px;
  padding: 0.75rem;
  margin-top: 0.75rem;
  border: 2px dashed var(--divider);
  border-radius: 4px;
}

.dark .mobile-nav--open {
  border-color: var(--divider-dark);
}

@media (min-width: 768px) {
  .mobile-nav {
    display: none;
  }
}

.mobile-nav__link {
  display: block;
  padding: 0.5rem 0.625rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(75 85 99);
  text-decoration: none;
  border: 2px dashed transparent;
  border-radius: 4px;
}

.dark .mobile-nav__link {
  color: rgb(209 213 219);
}

.mobile-nav__link:hover {
  color: rgb(17 24 39);
  border-color: var(--divider);
}

.dark .mobile-nav__link:hover {
  color: rgb(255 255 255);
  border-color: var(--divider-dark);
}

.mobile-nav__link--active,
.mobile-nav__link--active:hover {
  color: rgb(17 24 39);
  border-color: var(--accent);
}

.dark .mobile-nav__link--active,
.dark .mobile-nav__link--active:hover {
  color: rgb(255 255 255);
  border-color: var(--accent);
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
