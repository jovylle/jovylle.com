import { defineEventHandler, setHeader } from 'h3'

const FEED_TITLE = 'Jovylle Bermudez — Blog'
const FEED_SUBTITLE =
  'Writing on AI agents, full-stack development, developer tools, and cloud applications.'
const BLOG_BASE = 'https://hub.jovylle.com'
const SITE_BASE = 'https://jovylle.com'
const BLOG_INDEX =
  'https://content.jovylle.com/data/blogs/index.json'
const MAX_ITEMS = 10

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toRFC3339(date) {
  if (!date) return new Date().toISOString()
  const d = new Date(date)
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
}

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/atom+xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')

  let posts = []
  try {
    const blogs = await $fetch(BLOG_INDEX).catch(() => null)
    // Live index may be `{ "posts": [...] }` or a plain array.
    const list = Array.isArray(blogs) ? blogs : blogs && Array.isArray(blogs.posts) ? blogs.posts : []
    posts = list
      .filter((p) => p && p.slug)
      .filter((p) => p.date && p.excerpt) // drop test/draft posts (e.g. blog-post)
      .filter((p) => !(p.private === true))
      .filter((p) => !p.status || p.status === 'published')
      .sort((a, b) => toRFC3339(b.date).localeCompare(toRFC3339(a.date)))
      .slice(0, MAX_ITEMS)
  } catch {
    // non-fatal: index unavailable during build
  }

  const updated = posts.length
    ? toRFC3339(posts[0].date)
    : new Date().toISOString()

  const entries = posts
    .map((p) => {
      const url = `${BLOG_BASE}/posts/${escapeXml(p.slug)}`
      const pubDate = toRFC3339(p.date)
      return `  <entry>
    <title>${escapeXml(p.title || p.slug)}</title>
    <link rel="alternate" href="${url}"/>
    <id>${url}</id>
    <published>${pubDate}</published>
    <updated>${pubDate}</updated>
    <author><name>${escapeXml(p.author || 'Jovylle Bermudez')}</name></author>
  </entry>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(FEED_TITLE)}</title>
  <subtitle>${escapeXml(FEED_SUBTITLE)}</subtitle>
  <id>${SITE_BASE}/feed.xml</id>
  <link rel="self" href="${SITE_BASE}/feed.xml"/>
  <link rel="alternate" href="${SITE_BASE}"/>
  <updated>${updated}</updated>
${entries}
</feed>`
})
