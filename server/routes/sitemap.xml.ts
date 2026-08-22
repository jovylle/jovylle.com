import { defineEventHandler, setHeader } from 'h3'

const SITE_BASE = 'https://jovylle.com'
const BLOG_BASE = 'https://hub.jovylle.com'
const BLOG_INDEX =
  'https://content.jovylle.com/data/blogs/index.json'

// Routes that actually render + are indexable on this site.
// NOTE: /projects redirects to /highlights; /blog and /hub redirect to
// hub.jovylle.com (external), so they are intentionally excluded.
const TOP_LEVEL_ROUTES = [
  '',
  '/about',
  '/uses',
  '/resume',
  '/contact',
  '/ecosystem',
  '/impact',
  '/highlights',
  '/personal-projects',
  '/game',
  '/noises',
]

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')

  const urls = TOP_LEVEL_ROUTES.map(
    (route) => `  <url>
    <loc>${SITE_BASE}${route}</loc>
  </url>`,
  )

  // Blog posts — live from content CDN, linking to the canonical public
  // post URL on the hub. Index may be `{ "posts": [...] }` or a plain array.
  try {
    const blogs = await $fetch(BLOG_INDEX).catch(() => null)
    const list = Array.isArray(blogs) ? blogs : blogs && Array.isArray(blogs.posts) ? blogs.posts : []
    if (Array.isArray(list)) {
      for (const post of list) {
        if (!post || !post.slug) continue
        if (!post.date || !post.excerpt) continue // drop test/draft posts
        if (post.private === true) continue
        if (post.status && post.status !== 'published') continue
        urls.push(`  <url>
    <loc>${BLOG_BASE}/posts/${escapeXml(post.slug)}</loc>
${post.date ? `\n    <lastmod>${escapeXml(post.date)}</lastmod>` : ''}
  </url>`)
      }
    }
  } catch {
    // non-fatal: blog index unavailable during build
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`
})
