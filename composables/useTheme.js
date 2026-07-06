import { DEFAULT_THEME, THEME_STORAGE_KEY, isValidTheme } from '~/utils/themes'

export function useTheme() {
  const theme = useState('theme', () => {
    if (import.meta.client) {
      const stored = localStorage.getItem(THEME_STORAGE_KEY)
      if (stored && isValidTheme(stored)) return stored
    }
    return DEFAULT_THEME
  })

  function setTheme(id) {
    if (!isValidTheme(id)) return
    theme.value = id
    if (import.meta.client) {
      localStorage.setItem(THEME_STORAGE_KEY, id)
      document.documentElement.setAttribute('data-theme', id)
    }
  }

  function cycleTheme() {
    const ids = ['default', 'windows-xp', 'newspaper', 'parallax']
    const idx = ids.indexOf(theme.value)
    setTheme(ids[(idx + 1) % ids.length])
  }

  if (import.meta.client) {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored && isValidTheme(stored)) {
      document.documentElement.setAttribute('data-theme', stored)
    }
  }

  return { theme, setTheme, cycleTheme }
}
