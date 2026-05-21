# Rebuild jovylle.com when content CDN updates

When `content.jovylle.com` publishes new JSON, call this webhook so Netlify rebuilds jovylle.com and refreshes prerendered `/personal-projects`.

## 1. Netlify env vars (jovylle.com site)

In **Site configuration → Environment variables** (Production):

| Variable | Description |
|----------|-------------|
| `NETLIFY_BUILD_HOOK_URL` | From **Build & deploy → Build hooks → Add build hook**. Paste the full hook URL (e.g. `https://api.netlify.com/build_hooks/...`). |
| `REBUILD_WEBHOOK_SECRET` | Long random string you generate. Shared with the content repo only. |

Redeploy once after setting these so the function sees the vars.

## 2. Webhook URL

```http
POST https://jovylle.com/.netlify/functions/trigger-rebuild
X-Rebuild-Secret: <REBUILD_WEBHOOK_SECRET>
```

Or:

```http
Authorization: Bearer <REBUILD_WEBHOOK_SECRET>
```

Success: `202` with `{ "ok": true, "message": "Netlify rebuild triggered" }`.

## 3. Manual test

```bash
curl -sf -X POST \
  -H "X-Rebuild-Secret: YOUR_SECRET" \
  https://jovylle.com/.netlify/functions/trigger-rebuild
```

## 4. GitHub Actions (content / CMS repo)

After your workflow deploys `/data` to `content.jovylle.com`, add:

```yaml
- name: Rebuild jovylle.com (personal projects prerender)
  if: success()
  env:
    JOVYLLE_REBUILD_SECRET: ${{ secrets.JOVYLLE_REBUILD_SECRET }}
  run: |
    curl -sf -X POST \
      -H "X-Rebuild-Secret: ${JOVYLLE_REBUILD_SECRET}" \
      https://jovylle.com/.netlify/functions/trigger-rebuild
```

In the **content repo** GitHub settings → Secrets:

- `JOVYLLE_REBUILD_SECRET` — same value as `REBUILD_WEBHOOK_SECRET` on Netlify.

## 5. Direct build hook (alternative)

You can POST to `NETLIFY_BUILD_HOOK_URL` from the content repo without this function. The function keeps the build hook URL off the content repo and adds a shared secret.

## Notes

- `/personal-projects` is prerendered at build time; a rebuild is required for CDN JSON changes to appear there.
- `/highlights` still fetches in the browser (separate URL); it does not need a rebuild unless you change site code.
