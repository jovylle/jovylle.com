# AGENTS.md

## What this is
jovylle.com: Jovylle Bermudez's personal portfolio. Nuxt 3, `@nuxt/content` v2, Tailwind.
It is deployed to Cloudflare Pages (Nitro `cloudflare-pages` preset) by GitHub Actions on push to `master`.
It also ships an embeddable quick-menu widget (`public/widget/embed-inline.js`) and an OpenAI-backed `/api/chatbot`.

## Layout
- `pages/`: file-based routes. `pages/[...slug].vue` renders `content/` Markdown.
- `layouts/default.vue`: global layout (header, nav, footer) and one of the two widget loaders.
- `plugins/widget-embed.client.ts`: the other widget loader (client only).
- `components/`: Vue components. `Chatbot.vue` is unused.
- `content/`: Markdown. `post/` (blog), `projects/`, `other/`.
- `public/`: static files. `public/widget/` holds the widget. `public/data/` holds local JSON.
- `server/api/`: `chatbot.js` (OpenAI proxy) and `usage-metrics.js` (proxy).
- `docs/`: project notes. `.github/copilot-instructions.md`: Copilot notes.

## Commands (verified)
Use Node 22. `engines` in `package.json` pins `>=22 <23`. CI hardcodes `node-version: 22` in `.github/workflows/deploy.yml`; nothing reads `.nvmrc`, so keep it in sync by hand.
- `npm ci`: install dependencies.
- `npm run dev`: dev server on http://localhost:3000.
- `npm run build`: production build. Passes on Node 22.
- `npm run preview` or `npx wrangler pages dev dist`: serve the built output.
- `npm run deploy`: publishes `dist` to Cloudflare Pages. Do not run it unless asked.
- There are no test, lint, or typecheck scripts.
- Node 26 fails `npm run build` with a `micromark-util-sanitize-uri` module-resolution error.
  To run under Node 22 without switching your shell: `npx -y node@22 $(which npm) run build`.

## Hard rules
- Never print, log, or commit secrets. `OPENAI_API_KEY` lives in `.env` (gitignored) or in Cloudflare Pages secrets.
- Do not push, deploy, or change the Cloudflare project unless the user asks.
- Do not change `/api/chatbot` behavior (CORS, the request `context` field, the key fallback) without asking. See its header.
- Read the header comments of a file before editing it. They explain the gotchas.
- `/personal-projects` is prerendered. Changes to its CDN JSON need a rebuild (`docs/content-rebuild-webhook.md`).
- When behavior changes, update the header comment or docs in the same change.

## Known issues
- Chat endpoint: `/api/chatbot` has no auth. CORS is an allowlist (`CHATBOT_ALLOWED_ORIGINS`), caller `context` goes in a user message (not the system prompt), and there are size and per-IP rate limits (best effort, per isolate on Cloudflare). A hard spend cap needs Cloudflare rate-limiting rules. Third-party embeds need their origin in the allowlist. The `aiSolutions` and `profile` body fields still reach the system prompt. Requests with no Origin header are also allowed, so the rate limit is the only spend control for non-browser callers.
- Duplicate widget loaders: `plugins/widget-embed.client.ts` and `layouts/default.vue` both inject `embed-inline.js` with different settings. The first one to run wins.
- Two 17 MB MP3 files in `public/` (`audio_257112ce99.mp3`, `soft-rain-ambient-111154.mp3`) are byte-identical (same git blob, `8619f230`). Check whether they are referenced before removing anything.
- 17 npm audit findings (2 critical, 13 moderate, 2 low) as of 2026-11-19. Not triaged.
- `components/Chatbot.vue` is dead code. `embed-inline.js` reads `data-hide-chat` and `data-show-only` but ignores them. `components/HomeCards.vue` dispatches a `toggle-chatbot` window event that nothing in the repo listens for.
- `/personal-projects` calls unauthenticated GitHub APIs at build time. When rate limited, it silently drops data.
- The `/home` check in `layouts/default.vue` has no matching route.
- The README's iframe query options are not applied by `mystery-widget.html`.

Comments at the top of key source files carry the details; read them before editing.
