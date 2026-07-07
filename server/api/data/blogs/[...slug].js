import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const BLOGS_DIR = join(process.cwd(), 'data', 'blogs')
const PROD_UPSTREAM = 'https://content.jovylle.com/data/blogs'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug?.endsWith('.json')) {
    throw createError({ statusCode: 400, statusMessage: 'Only .json files are served' })
  }

  const localPath = join(BLOGS_DIR, slug)
  if (existsSync(localPath)) {
    return JSON.parse(readFileSync(localPath, 'utf-8'))
  }

  try {
    return await $fetch(`${PROD_UPSTREAM}/${slug}`)
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'Failed to fetch from CDN' })
  }
})
