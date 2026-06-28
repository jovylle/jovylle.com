const USAGE_METRICS_UPSTREAM =
  'https://content.jovylle.com/data/usage-metrics.json'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Access-Control-Allow-Origin', '*')
  setHeader(event, 'Access-Control-Allow-Methods', 'GET, OPTIONS')
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type')
  setHeader(event, 'Cache-Control', 'public, max-age=300')

  if (event.method === 'OPTIONS') {
    return ''
  }

  try {
    return await $fetch(USAGE_METRICS_UPSTREAM)
  } catch (error) {
    console.error('Error fetching usage metrics:', error)
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to fetch usage metrics',
    })
  }
})
