export default defineNuxtPlugin(() => {
  if (process.server) return;

  // Avoid duplicate injection across navigations/HMR
  if (document.querySelector('script[data-jovylle-embed="true"]')) return;

  const script = document.createElement('script');
  script.src = '/widget/embed.js';
  script.async = true;
  script.setAttribute('data-jovylle-embed', 'true');

  // Default configuration for global embed
  script.setAttribute('data-position', 'bottom-right');
  script.setAttribute('data-size', 'small');
  script.setAttribute('data-hide-chat', 'false');
  script.setAttribute('data-hide-portfolio', 'true');

  document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(script);
  });
});


