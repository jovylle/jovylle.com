# Rebuild jovylle.com when content CDN updates

`/personal-projects` is prerendered at build time. After you publish JSON to `content.jovylle.com`, trigger a Cloudflare Pages rebuild so the site picks up the new data.

## 1. Cloudflare Pages Deploy Hook

**Cloudflare Dashboard → Workers & Pages → jovylle-com → Settings → Build hooks → Add deploy hook**

Give it a name (e.g. "content-cdn-rebuild") and copy the hook URL.

Test:

```bash
curl -sf -X POST "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/YOUR_HOOK_ID"
```

## 2. GitHub Actions (content / CMS repo)

Store the hook URL as a secret, e.g. `JOVYLLE_CF_DEPLOY_HOOK`.

After your workflow deploys `/data` to the CDN:

```yaml
- name: Rebuild jovylle.com
  if: success()
  run: curl -sf -X POST "${{ secrets.JOVYLLE_CF_DEPLOY_HOOK }}"
```

No env vars or code changes needed on the jovylle.com Cloudflare Pages project.

## Notes

- Keep the deploy hook URL in GitHub secrets only — do not commit it.
- `/highlights` still loads JSON in the browser; only `/personal-projects` needs a rebuild for CDN JSON changes.
- The deploy hook triggers a new deployment of the latest commit (it does NOT rebuild from scratch — you need a new commit for that).

## Alternative: Deploy via API

To trigger a full build from a specific branch:

```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/{account_id}/pages/projects/jovylle-com/deploy" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  -d '{"branch": "main"}'
```
