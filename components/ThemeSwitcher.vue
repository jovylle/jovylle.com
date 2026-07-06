<template>
  <div class="theme-switcher" @click.stop>
    <button
      type="button"
      class="theme-switcher__trigger"
      :aria-label="`Theme: ${currentTheme.label}`"
      :title="`Theme: ${currentTheme.label}`"
      @click="open = !open"
    >
      <i :class="'bx ' + currentTheme.icon" aria-hidden="true"></i>
      <span class="theme-switcher__label">{{ currentTheme.label }}</span>
      <i class="bx bx-chevron-down" aria-hidden="true"></i>
    </button>
    <div v-if="open" class="theme-switcher__dropdown" @click="open = false">
      <button
        v-for="t in themes"
        :key="t.id"
        type="button"
        class="theme-switcher__option"
        :class="{ 'theme-switcher__option--active': t.id === theme }"
        @click="setTheme(t.id)"
      >
        <i :class="'bx ' + t.icon" aria-hidden="true"></i>
        {{ t.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { THEMES } from '~/utils/themes'
import { useTheme } from '~/composables/useTheme'

const { theme, setTheme } = useTheme()
const open = ref(false)

const themes = THEMES

const currentTheme = computed(() => THEMES.find((t) => t.id === theme.value) ?? THEMES[0])

function onClickOutside(e) {
  if (open.value && !e.target.closest('.theme-switcher')) {
    open.value = false
  }
}

if (import.meta.client) {
  document.addEventListener('click', onClickOutside)
}
</script>

<style scoped>
.theme-switcher {
  position: relative;
}

.theme-switcher__trigger {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  color: inherit;
  font-size: 0.82rem;
  cursor: pointer;
  transition: background 0.15s;
}

.theme-switcher__trigger:hover {
  background: rgba(128, 128, 128, 0.12);
}

.theme-switcher__label {
  font-size: 0.78rem;
  opacity: 0.85;
}

.theme-switcher__dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: var(--theme-dropdown-bg, #fff);
  border: 1px solid var(--theme-dropdown-border, #e5e7eb);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  min-width: 160px;
  z-index: 100;
  overflow: hidden;
}

.theme-switcher__option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.85rem;
  border: none;
  background: transparent;
  color: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  text-align: left;
  transition: background 0.12s;
}

.theme-switcher__option:hover {
  background: rgba(128, 128, 128, 0.08);
}

.theme-switcher__option--active {
  font-weight: 600;
  color: var(--theme-accent, #4f46e5);
}
</style>
