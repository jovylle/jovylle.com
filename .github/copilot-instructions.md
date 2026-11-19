# Copilot Instructions for jovylle.com

Read `AGENTS.md` first. It has the commands, hard rules, and known issues. Read the header comments of `layouts/default.vue`, `plugins/widget-embed.client.ts`, `pages/personal-projects.vue`, and `server/api/chatbot.js` before editing them.

## Stack and Hosting
- Nuxt 3 with `@nuxt/content` v2 and `@nuxtjs/tailwindcss`. Node 22.
- Nitro `cloudflare-pages` preset. Deployed by `.github/workflows/deploy.yml` on push to `master`.
- There is no CMS. Content is edited as Markdown files. Decap CMS and Netlify are retired and must not be reintroduced.

## Routes
- Defined by `pages/` (file-based). `/` is `pages/index.vue`. `/about`, `/contact`, `/resume`, `/impact`, `/ecosystem`, and `/personal-projects` have their own pages.
- `/projects` is a redirect to `/highlights`. There is no `/posts` route.
- Content documents are rendered by `pages/[...slug].vue` through `<ContentDoc>`.
- Prerendered: the routes listed in `nitro.prerender.routes` in `nuxt.config.ts`.
- Client-only (`ssr: false`): `/game` and `/parallax`. `/private` is excluded from prerendering.

## Content
- Markdown lives in `content/`: `post/` (blog posts), `projects/` (project entries), `other/` (miscellaneous pages).
- Filenames for dated content use `YYYY-MM-DD-title.md`. Check neighboring files for the frontmatter fields in use.
- `/personal-projects` is built from `content.jovylle.com` JSON plus the GitHub API at build time. Changes to that JSON take effect only after a rebuild.

## Conventions
- Styling is Tailwind. Shared hover animation is the `my_hover` class in `assets/css/tailwind.css`. Dark mode uses the `dark:` variant, driven by the `darkMode` data property in `layouts/default.vue`. That state is not saved.
- Internal links use `<NuxtLink>`. External links open in a new tab.
- Icons: Boxicons, loaded from unpkg in `app.vue`.
- Audio: Howler is used in `pages/noises.vue`.
- Analytics: the Umami script is in `nuxt.config.ts`.
- `@nuxt/image` is not installed. Use plain `<img>` tags, or add the module first.

## Components
- `components/` holds reusable pieces: cards (`HomeCards.vue`, `ProjectCard.vue`), `ContactForm.vue`, and games such as `MinesweeperGame.vue`.
- `components/Chatbot.vue` is not imported anywhere. It is dead code. The live chat is the widget (`public/widget/embed-inline.js`), which calls `/api/chatbot`.

## Commands
```bash
npm ci               # install (use Node 22)
npm run dev          # dev server
npm run build        # production build (must pass on Node 22)
npm run preview      # preview the build
```
There are no test or lint scripts.

## Do Not
- Do not change `/api/chatbot` behavior without asking. It is an open endpoint (see the file header warnings).
- Do not commit `.env` or any API key.
- Do not run `npm run deploy` unless asked.
