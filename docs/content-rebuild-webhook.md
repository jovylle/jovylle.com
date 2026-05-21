# Rebuild jovylle.com when content CDN updates

`/personal-projects` is prerendered at build time. After you publish JSON to `content.jovylle.com`, trigger a Netlify rebuild so the site picks up the new data.

## 1. Netlify build hook (jovylle.com site)

**Site configuration → Build & deploy → Build hooks → Add build hook**

Copy the hook URL (looks like `https://api.netlify.com/build_hooks/...`).

Test:

```bash
curl -sf -X POST -d '{}' 'https://api.netlify.com/build_hooks/YOUR_HOOK_ID'
```

You should see a new deploy under **Deploys**.

## 2. GitHub Actions (content / CMS repo)

Store the hook URL as a secret, e.g. `JOVYLLE_NETLIFY_BUILD_HOOK`.

After your workflow deploys `/data` to the CDN:

```yaml
- name: Rebuild jovylle.com
  if: success()
  run: curl -sf -X POST -d '{}' "${{ secrets.JOVYLLE_NETLIFY_BUILD_HOOK }}"
```

No env vars or code changes needed on the jovylle.com Netlify site.

## Notes

- Keep the hook URL in GitHub secrets only — do not commit it.
- `/highlights` still loads JSON in the browser; only `/personal-projects` needs a rebuild for CDN JSON changes.
