<template>
  <article class="container mx-auto py-10 sm:py-20 max-w-4xl ecosystem-page">
    <template v-if="page">
      <header class="mb-8">
        <h1 class="!my-0">{{ page.title }}</h1>
        <p v-if="page.description" class="text-gray-600 dark:text-gray-400 mt-4 !pb-0">
          {{ page.description }}
        </p>
      </header>
      <ContentRenderer :value="page" />
    </template>
  </article>
</template>

<script setup>
const DIAGRAM_ALT =
  'Architecture diagram: browsers to portfolio, Playbase, d1g.uk, and chat-widget; shared CDN and notifications; Cloudflare, Vercel, Netlify, and GitHub; Cloudflare analytics.';

const { data: page } = await useAsyncData('ecosystem-page', () =>
  queryContent('/ecosystem').findOne()
);

useHead({
  title: 'Ecosystem Architecture — Jovylle',
  meta: [
    {
      name: 'description',
      content:
        page.value?.description ??
        'How jovylle.com, d1g.uk, Playbase, chat-widget, and ProjectMate connect as one production platform.',
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

function findMermaidBlocks(root) {
  return [...root.querySelectorAll('pre code')].filter((code) => {
    if (code.closest('[data-mermaid-rendered="true"]')) return false;
    const className = code.className ?? '';
    const text = code.textContent?.trim() ?? '';
    return (
      className.includes('mermaid') ||
      text.startsWith('flowchart') ||
      text.startsWith('graph ')
    );
  });
}

async function renderMermaidDiagrams(root) {
  const blocks = findMermaidBlocks(root);
  if (!blocks.length) return false;

  const mermaid = await loadMermaid();
  if (!mermaid) return false;

  const isDark = document.documentElement.classList.contains('dark');
  mermaid.initialize({
    startOnLoad: false,
    theme: isDark ? 'dark' : 'default',
    securityLevel: 'strict',
  });

  let index = 0;
  for (const block of blocks) {
    const pre = block.parentElement;
    if (!pre || pre.dataset.mermaidRendered === 'true') continue;

    const graph = block.textContent?.trim();
    if (!graph) continue;

    const host = document.createElement('div');
    host.className =
      'mermaid-diagram my-8 overflow-x-auto rounded-lg border border-dashed border-[color:var(--divider)] dark:border-[color:var(--divider-dark)] p-4';
    host.setAttribute('role', 'img');
    host.setAttribute('aria-label', DIAGRAM_ALT);
    host.dataset.mermaidRendered = 'true';
    pre.replaceWith(host);

    try {
      const { svg } = await mermaid.render(`ecosystem-diagram-${index}`, graph);
      host.innerHTML = svg;
    } catch {
      host.innerHTML =
        '<p class="text-sm text-red-600 dark:text-red-400">Diagram failed to render.</p>';
    }
    index += 1;
  }

  return true;
}

function setupMermaidRendering() {
  const root = document.querySelector('.ecosystem-page');
  if (!root) return;

  const run = () => {
    renderMermaidDiagrams(root);
  };

  run();

  const observer = new MutationObserver(run);
  observer.observe(root, { childList: true, subtree: true });

  onUnmounted(() => observer.disconnect());
}

onMounted(async () => {
  await nextTick();
  setupMermaidRendering();
});

watch(page, async () => {
  await nextTick();
  const root = document.querySelector('.ecosystem-page');
  if (root) await renderMermaidDiagrams(root);
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
