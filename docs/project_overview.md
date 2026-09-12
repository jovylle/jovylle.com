# Project Overview: jovylle.com + Quick Menu Widget

This document explains the purpose, UI rules, and high-level architecture for this project only.

## Purpose and Goals
- Build a personal site with a subtle, fun-focused widget that feels professional.
- Prioritize a fast reaction game and optional AI chat; portfolio links remain available but not loud.
- Keep the UI minimal with a distinct touch; uniform spacing, typography, and motion.

## UI Rules (Minimal with a Distinct Touch)
- Spacing scale: 4, 8, 12, 16 px. Prefer vertical rhythm of 4–8 px steps.
- Typography: minimum 16 px for readable body and UI text.
- Radius: 8 px for containers; 4 px for small controls (inputs, buttons, pills).
- Dividers, not boxes: use subtle horizontal dividers.
  - Light mode border: `#E9ECEF`
  - Dark mode border: `#404040`
- Accent color: `#9CA3AF` (rgb(156,163,175)). Neutral accent usable in both themes.
- Strokes, not shadows: use 3 px dashed stroke for interactive containers (cards, outline buttons); 1 px solid for dividers. No drop shadows.
- Motion: subtle transitions 150–200 ms; change opacity/color/translate ≤ 2 px.
- Icons: outline SVGs, 20×20, stroke-width 1.75, round caps/joins, `currentColor`.
- Embeds isolation: iframe/embed styles should be resilient to host CSS.

## Architecture Overview
- App: Nuxt.js site with pages and components.
- Widget: embeddable HTML file and JS embed script under `public/widget/`.
- AI Chat: Nuxt server route `/api/chatbot` for dev and Cloudflare Pages prod.
- Game: external reaction game with top 3 leaderboard display.
- Theming: light/dark toggle; preference stored in localStorage.

## References
- Widget overview: `docs/widget_overview.md`
- Key files map: `docs/project_key_files.md`

For questions or suggestions, reach me at `me@jovylle.com`.