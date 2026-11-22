# Key Files Overview

This document highlights the most important files for understanding the project. Paths are relative to the repository root.

## Essential Files

1. **README.md**
   - **Purpose**: Project overview, setup, embedding, and deployment instructions.

2. **AGENTS.md**
   - **Purpose**: Entry point for AI agents and new contributors: commands, hard rules, and known issues.

3. **package.json**
   - **Purpose**: Dependencies and scripts (`dev`, `build`, `generate`, `preview`, `deploy`). The `engines` field pins Node 22.

4. **nuxt.config.ts**
   - **Purpose**: Nuxt modules, the Nitro `cloudflare-pages` preset, prerender routes, and route rules (SSR off for `/game` and `/parallax`).

5. **tailwind.config.js**
   - **Purpose**: Tailwind theme extensions. Adds the site's `primary`, `secondary`, and `ternary` colors (light and dark variants), the `m1`–`m5` palette, and a single `accent` color (no dark variant).

6. **tsconfig.json**
   - **Purpose**: TypeScript configuration for the Nuxt project.

7. **.gitignore**
   - **Purpose**: Files Git ignores, such as `node_modules`, `.nuxt`, `dist`, and `.env`.

8. **layouts/default.vue**
   - **Purpose**: The global layout: header, mobile navigation, footer, and the widget loader for the site. Its header comment explains the `/home` check, the dark mode behavior, and the padding for the widget.

9. **pages/[...slug].vue**
   - **Purpose**: Catch-all route that renders any Nuxt Content document from `content/` through `<ContentDoc>`. It is not specific to blog posts.

10. **components/**
    - **Purpose**: Reusable Vue components (cards, forms, games, and UI primitives). `components/Chatbot.vue` is not imported anywhere.

11. **content/**
    - **Purpose**: Markdown content. Blog posts are in `content/post/`, project entries are in `content/projects/`, and miscellaneous pages are in `content/other/`.

12. **app.vue**
    - **Purpose**: Root component. Loads the Boxicons stylesheet.

13. **plugins/widget-embed.client.ts**
    - **Purpose**: Client-only plugin that loads the site widget (`public/widget/embed-inline.js`).

14. **public/widget/embed-inline.js**
    - **Purpose**: The embeddable widget. Its `data-*` attribute API is listed at the top of the file.

15. **server/api/chatbot.js**
    - **Purpose**: Chat endpoint that calls OpenAI. It is an open endpoint; read the warnings in the file header before changing it.

16. **example.env** and **.env.example**
    - **Purpose**: Example environment files. The only variable the code reads is `OPENAI_API_KEY` (plus optional `OPENAI_MODEL`).

### Purpose of This Document
This summary identifies the files that drive the site's structure and behavior, so that developers and AI agents can find the right starting point for a task.
