# Copilot Instructions for jovylle.com

## Architecture Overview

This is a **Nuxt 3 + Nuxt Content** portfolio site with **Decap CMS** integration for content management. The site showcases projects, blog posts, and interactive features while maintaining performance through static generation.

### Key Components

- **Content Management**: Markdown files in `content/` directories managed via Decap CMS at `/admin`
- **Dynamic Routing**: `pages/[...slug].vue` handles all content pages using Nuxt Content's `<ContentDoc>`
- **Layout System**: Single `layouts/default.vue` with responsive navigation and dark mode toggle
- **Component Architecture**: Reusable Vue components in `components/` for cards, forms, and interactive features

## Development Patterns

### Content Structure
```
content/
├── post/          # Blog posts (layout: blog)
├── projects/      # Project showcases (layout: testss)
└── other/         # Utility pages and documentation
```

Content files use frontmatter with required fields: `layout`, `title`, `date`, and optional `thumbnail`.

### Page Generation Strategy
- **Static pages**: `/`, `/projects`, `/about`, `/contact`, `/posts`, `/game` (prerendered)
- **Dynamic content**: All content pages via `[...slug].vue`
- **Client-only**: `/game` and `/parallax` (ssr: false)

### Component Patterns

**Data Fetching**: Use `queryContent()` composable for content queries:
```vue
const projects = await queryContent('projects').find()
```

**Styling**: Tailwind CSS with custom classes in `assets/css/tailwind.css`:
- `my_hover` / `my_hover1` for link animations
- Dark mode: `dark:` prefixes with `darkMode` data property
- Responsive: Mobile-first approach with `sm:`, `md:`, `lg:` breakpoints

**External Dependencies**:
- Boxicons via CDN in `app.vue`
- Umami analytics in `nuxt.config.ts`
- Howler.js for audio features

## Content Management Workflow

### Decap CMS Configuration
- **Backend**: retired with the Netlify hosting — edit markdown directly
- **Local Development**: `npm run dev`, content in `content/`
- **Media**: Stored in `public/decap/images/uploads/`
- **Collections**: `blog` (posts), `projects`, and `test1` (experimental)

### Adding New Content
1. Create markdown files directly (Decap admin retired with Netlify hosting)
2. Follow naming convention: `YYYY-MM-DD-title.md` for date-based content
3. Include required frontmatter fields based on collection schema
4. Images uploaded via CMS are automatically optimized and stored correctly

## Component Integration

### Interactive Features
- **Chatbot**: `components/Chatbot.vue` with OpenAI integration and markdown rendering
- **Games**: Minesweeper and other games with client-side only rendering
- **Audio**: Howler.js integration for ambient sounds and audio tools

### Reusable Patterns
- **Card Components**: `HomeCards.vue`, `ProjectCard.vue` with consistent grid layouts
- **Form Handling**: `ContactForm.vue` with validation and submission logic
- **Navigation**: Responsive hamburger menu with smooth transitions

## Development Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run generate     # Static site generation
npm run preview      # Preview generated site
```

## Key Configuration Files

- `nuxt.config.ts`: SSR rules, prerender routes, content highlighting themes
- `tailwind.config.js`: Custom theme colors and responsive breakpoints
- `public/admin/config.yml`: Decap CMS collections and field definitions
- `tsconfig.json`: TypeScript configuration for Nuxt 3

## Performance Considerations

- **Image Optimization**: Use Nuxt's built-in image optimization for content images
- **Code Splitting**: Components are automatically code-split by Nuxt
- **Static Generation**: Content pages are statically generated for optimal performance
- **Dark Mode**: Implemented via Tailwind with reactive data properties

## Content Conventions

- **Projects**: Include technology badges, screenshots, and detailed descriptions
- **Blog Posts**: Use `layout: blog` with proper date formatting
- **Images**: Store in appropriate subdirectories under `public/` or use Decap CMS uploads
- **Links**: External links should open in new tabs, internal links use `<NuxtLink>`