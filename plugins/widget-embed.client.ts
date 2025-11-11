export default defineNuxtPlugin(() => {
  if (process.server) return;

  // Avoid duplicate injection across navigations/HMR
  if (document.querySelector('script[data-jovylle-embed="true"]')) return;

  const script = document.createElement('script');
  script.src = '/widget/embed-with-leaderboard.js'; // Home version WITH leaderboard
  script.async = true;
  script.setAttribute('data-jovylle-embed', 'true');

  // Default configuration for global embed
  script.setAttribute('data-position', 'bottom-right');
  script.setAttribute('data-size', 'small');
  script.setAttribute('data-hide-portfolio', 'true');
  script.setAttribute('data-feedback-url', 'https://tally.so/r/WO9dWk');
  script.setAttribute('data-ai-context', `You are an AI assistant for Jovylle Bermudez's portfolio website. 

About Jovylle:
- Full-stack developer with 5+ years experience
- Specializes in modern web development
- Expert in: JavaScript, Vue.js, Nuxt.js, React, Node.js, Python, PHP, Laravel
- Databases: MySQL, MongoDB, PostgreSQL
- DevOps: Docker, AWS, GCP, Netlify

Featured Projects:
- Reaction Test Game (fast.jovylle.com) - Built with vanilla JS
- Utility Tools Hub (uft1.com) - Collection of developer tools
- ChatGPT Clone - Python serverless on GCP
- Wedding websites for multiple clients
- Various business automation tools

Site History:
- Created: October 24, 2023
- Built with: Nuxt 3, Vue 3, Tailwind CSS
- Latest Update (Nov 2025): New AI widget with notification system

Keep responses friendly, concise (under 150 words), and focused on technical skills and projects. Be enthusiastic about web development!`);

  document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(script);
    
    // Wait for widget to load, then show welcome notifications
    setTimeout(() => {
      if (window.JovylleInlineWidget) {
        // New features alert
        window.JovylleInlineWidget.addNotification({
          type: 'success',
          title: '🎉 Widget v2.0 Released!',
          message: 'New AI chat with GPT-4o-mini, notifications system, and markdown support. Try it out!',
          persistent: false
        });
        
        // Site history notification
        setTimeout(() => {
          window.JovylleInlineWidget.addNotification({
            type: 'info',
            title: '📅 Site Updates This Week',
            message: 'Nov 10-11: Major widget upgrade with custom AI context, notification badges, and chat-first UI!',
            persistent: true
          });
        }, 3000);
      }
    }, 2000);
  });
});


