const json = (statusCode, body, extraHeaders = {}) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    ...extraHeaders
  },
  body: JSON.stringify(body)
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Rebuild-Secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

/** POST with X-Rebuild-Secret or Authorization: Bearer <secret> to start a Netlify build. */
export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method Not Allowed' }, corsHeaders)
  }

  const secret = process.env.REBUILD_WEBHOOK_SECRET
  const buildHookUrl = process.env.NETLIFY_BUILD_HOOK_URL

  if (!secret || !buildHookUrl) {
    return json(
      503,
      { error: 'Rebuild webhook not configured on this site' },
      corsHeaders
    )
  }

  const provided =
    event.headers?.['x-rebuild-secret'] ||
    event.headers?.['X-Rebuild-Secret'] ||
    (event.headers?.authorization || event.headers?.Authorization || '')
      .replace(/^Bearer\s+/i, '')
      .trim()

  if (!provided || provided !== secret) {
    return json(401, { error: 'Unauthorized' }, corsHeaders)
  }

  try {
    const res = await fetch(buildHookUrl, { method: 'POST' })
    const detail = await res.text().catch(() => '')

    if (!res.ok) {
      return json(
        502,
        {
          error: 'Netlify build hook failed',
          status: res.status,
          detail: detail.slice(0, 300)
        },
        corsHeaders
      )
    }

    return json(
      202,
      { ok: true, message: 'Netlify rebuild triggered' },
      corsHeaders
    )
  } catch (err) {
    return json(
      500,
      { error: 'Failed to trigger rebuild', message: err?.message || 'Unknown error' },
      corsHeaders
    )
  }
}
