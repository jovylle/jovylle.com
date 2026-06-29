<template>
  <div
    :class='" text-lg overflow-hidden flex flex-col tracking-wider " + (darkMode?"dark bg-ternary-dark":"bg-ternary-light ")'
    style="--accent:#9CA3AF;--divider:#E9ECEF;--divider-dark:#404040"
  >
    <h1 class="sr-only">Jovylle Bermudez</h1>
    <div class="container mx-auto px-4 max-w-6xl flex flex-col min-h-[100vh] text-primary-dark dark:text-primary-light">
      <header v-if="!isHomePage" class="site-header">
        <div class="site-header__inner">
          <NuxtLink to="/" class="brand" aria-label="Home">
            <span class="brand__mark">JB</span>
            <span class="brand__name">Jovylle</span>
          </NuxtLink>

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
              Blog & Hub
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
            <span class="menu-btn__bar" :class="{ 'menu-btn__bar--open': isMenuOpen }"></span>
            <span class="menu-btn__bar menu-btn__bar--mid" :class="{ 'menu-btn__bar--open': isMenuOpen }"></span>
            <span class="menu-btn__bar" :class="{ 'menu-btn__bar--open': isMenuOpen }"></span>
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
            Blog & Hub ↗
          </a>
          <NuxtLink
            to="/contact"
            class="mobile-nav__link"
            :class="{ 'mobile-nav__link--active': isNavActive('/contact') }"
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
        { to: '/highlights', label: 'AI & Solutions' },
        { to: '/personal-projects', label: 'Projects' },
        { to: '/impact', label: 'Impact' },
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
  position: sticky;
  top: 0;
  z-index: 50;
  margin: 0 -1rem 1rem;
  padding: 0 1rem;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: saturate(180%) blur(12px);
  -webkit-backdrop-filter: saturate(180%) blur(12px);
  border-bottom: 1px solid rgba(17, 24, 39, 0.06);
}

.dark .site-header {
  background: rgba(17, 24, 39, 0.72);
  border-bottom-color: rgba(255, 255, 255, 0.06);
}

.site-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  height: 56px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: inherit;
}

.brand__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: rgb(255 255 255);
  background: rgb(17 24 39);
  border-radius: 8px;
}

.dark .brand__mark {
  color: rgb(17 24 39);
  background: rgb(243 244 246);
}

.brand__name {
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: rgb(17 24 39);
}

.dark .brand__name {
  color: rgb(243 244 246);
}

.site-nav {
  display: none;
}

@media (min-width: 768px) {
  .site-nav {
    display: inline-flex;
    align-items: center;
    gap: 0.125rem;
    padding: 0.25rem;
    background: rgba(17, 24, 39, 0.04);
    border-radius: 999px;
  }

  .dark .site-nav {
    background: rgba(255, 255, 255, 0.06);
  }
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.4rem 0.85rem;
  font-size: 0.825rem;
  font-weight: 500;
  line-height: 1;
  color: rgb(75 85 99);
  text-decoration: none;
  border-radius: 999px;
  transition: color 0.15s ease, background-color 0.15s ease;
  white-space: nowrap;
}

.dark .nav-link {
  color: rgb(209 213 219);
}

.nav-link:hover {
  color: rgb(17 24 39);
  background: rgba(255, 255, 255, 0.6);
}

.dark .nav-link:hover {
  color: rgb(255 255 255);
  background: rgba(255, 255, 255, 0.08);
}

.nav-link--active {
  color: rgb(17 24 39);
  background: rgb(255 255 255);
  box-shadow: 0 1px 2px rgba(17, 24, 39, 0.06), 0 0 0 1px rgba(17, 24, 39, 0.04);
}

.dark .nav-link--active {
  color: rgb(17 24 39);
  background: rgb(243 244 246);
  box-shadow: none;
}

.nav-link__ext {
  font-size: 0.7rem;
  opacity: 0.6;
}

.menu-btn {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  width: 36px;
  height: 36px;
  background: transparent;
  border: 1px solid rgba(17, 24, 39, 0.1);
  border-radius: 10px;
  cursor: pointer;
}

.dark .menu-btn {
  border-color: rgba(255, 255, 255, 0.12);
}

@media (min-width: 768px) {
  .menu-btn {
    display: none;
  }
}

.menu-btn__bar {
  width: 16px;
  height: 1.5px;
  background: rgb(55 65 81);
  border-radius: 2px;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.dark .menu-btn__bar {
  background: rgb(229 231 235);
}

.menu-btn__bar--open:nth-child(1),
.menu-btn__bar:first-child.menu-btn__bar--open {
  transform: translateY(5.5px) rotate(45deg);
}

.menu-btn__bar--mid.menu-btn__bar--open {
  opacity: 0;
}

.menu-btn__bar--open:last-child {
  transform: translateY(-5.5px) rotate(-45deg);
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease, padding 0.25s ease;
}

.mobile-nav--open {
  max-height: 420px;
  padding: 0.5rem 0 0.75rem;
}

@media (min-width: 768px) {
  .mobile-nav {
    display: none;
  }
}

.mobile-nav__link {
  display: block;
  padding: 0.625rem 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgb(55 65 81);
  text-decoration: none;
  border-radius: 8px;
}

.dark .mobile-nav__link {
  color: rgb(209 213 219);
}

.mobile-nav__link:hover {
  background: rgba(17, 24, 39, 0.04);
}

.dark .mobile-nav__link:hover {
  background: rgba(255, 255, 255, 0.06);
}

.mobile-nav__link--active {
  color: rgb(17 24 39);
  background: rgba(17, 24, 39, 0.05);
}

.dark .mobile-nav__link--active {
  color: rgb(255 255 255);
  background: rgba(255, 255, 255, 0.08);
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
