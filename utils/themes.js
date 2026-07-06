export const THEMES = [
  { id: 'default', label: 'Default', icon: 'bx-palette' },
  { id: 'windows-xp', label: 'Windows XP', icon: 'bx-windows' },
  { id: 'newspaper', label: 'Newspaper', icon: 'bx-news' },
  { id: 'parallax', label: 'Parallax', icon: 'bx-layer' },
]

export const DEFAULT_THEME = 'default'

export const THEME_STORAGE_KEY = 'jovylle-theme'

export function isValidTheme(id) {
  return THEMES.some((t) => t.id === id)
}

export function getTheme(id) {
  return THEMES.find((t) => t.id === id) ?? THEMES[0]
}
