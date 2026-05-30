<template>
  <div class="container mx-auto py-10 sm:py-20 max-w-4xl ecosystem-page">
    <ContentDoc path="/ecosystem">
      <template #not-found>
        <div class="min-h-[40vh] flex flex-col justify-center items-center">
          <h2 class="block">Ecosystem page not found.</h2>
          <NuxtLink to="/">
            <button class="underline underline-offset-8">Go back home</button>
          </NuxtLink>
        </div>
      </template>
    </ContentDoc>
  </div>
</template>

<script setup>
const DIAGRAM_ALT =
  'Architecture diagram: browsers to portfolio, Playbase, d1g.uk, and chat-widget; shared CDN and notifications; Netlify and GitHub; Umami analytics.';

useHead({
  title: 'Ecosystem Architecture — Jovylle',
  meta: [
    {
      name: 'description',
      content:
        'How jovylle.com, d1g.uk, Playbase, chat-widget, and ProjectMate connect as one production platform — shared ingress, embeds, and ops habits.',
    },
  ],
});

function loadMermaid() {
  if (import.meta.server) return Promise.resolve(null);
  if (window.mermaid) return Promise.resolve(window.mermaid);

  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-mermaid-loader="true"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.mermaid));
      existing.addEventListener('error', reject);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
    script.async = true;
    script.setAttribute('data-mermaid-loader', 'true');
    script.onload = () => resolve(window.mermaid);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function renderMermaidDiagrams() {
  const blocks = document.querySelectorAll('.ecosystem-page pre code.language-mermaid');
  if (!blocks.length) return;

  const mermaid = await loadMermaid();
  if (!mermaid) return;

  const isDark = document.documentElement.classList.contains('dark');
  mermaid.initialize({
    startOnLoad: false,
    theme: isDark ? 'dark' : 'default',
    securityLevel: 'strict',
  });

  let index = 0;
  for (const block of blocks) {
    const pre = block.parentElement;
    if (!pre) continue;

    const graph = block.textContent?.trim();
    if (!graph) continue;

    const host = document.createElement('div');
    host.className = 'mermaid-diagram my-8 overflow-x-auto rounded-lg border border-dashed border-[color:var(--divider)] dark:border-[color:var(--divider-dark)] p-4';
    host.setAttribute('role', 'img');
    host.setAttribute('aria-label', DIAGRAM_ALT);
    pre.replaceWith(host);

    try {
      const { svg } = await mermaid.render(`ecosystem-diagram-${index}`, graph);
      host.innerHTML = svg;
    } catch {
      host.innerHTML = `<p class="text-sm text-red-600 dark:text-red-400">Diagram failed to render. See markdown source for structure.</p>`;
    }
    index += 1;
  }
}

onMounted(async () => {
  await nextTick();
  await renderMermaidDiagrams();
});
</script>

<style scoped>
.ecosystem-page :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0 1.5rem;
  font-size: 0.95rem;
}

.ecosystem-page :deep(th),
.ecosystem-page :deep(td) {
  border: 1px dashed var(--divider);
  padding: 0.5rem 0.75rem;
  text-align: left;
  vertical-align: top;
}

.dark .ecosystem-page :deep(th),
.dark .ecosystem-page :deep(td) {
  border-color: var(--divider-dark);
}

.ecosystem-page :deep(th) {
  font-weight: 600;
}

.ecosystem-page :deep(.mermaid-diagram svg) {
  max-width: 100%;
  height: auto;
}
</style>
