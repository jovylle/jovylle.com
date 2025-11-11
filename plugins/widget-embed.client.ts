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
  script.setAttribute('data-title', 'AI Assistant');
  script.setAttribute('data-hide-portfolio', 'true');
  script.setAttribute('data-feedback-url', 'https://tally.so/r/WO9dWk');
  script.setAttribute('data-ai-context', `You are an AI assistant for Jovylle Bermudez's portfolio website. 

About Jovylle - AI Solutionist & Full-Stack Developer:
- 5+ years experience building AI-powered solutions
- Specializes in AI integration and modern web development
- AI Solutions Expert: GPT integration, AI chatbots, automation, intelligent systems
- Technical Stack: JavaScript, Vue.js, Nuxt.js, React, Node.js, Python, PHP, Laravel
- Databases: MySQL, MongoDB, PostgreSQL
- DevOps & AI: Docker, AWS, GCP, OpenAI API, Netlify

Featured AI & Solutions:
- AI Widget with GPT-4o-mini (this widget!) - Custom AI assistant system
- ChatGPT Clone - Python serverless on GCP with OpenAI integration
- Reaction Test Game (fast.jovylle.com) - Gamification solution
- Utility Tools Hub (uft1.com) - Developer productivity tools
- Wedding websites - Custom web solutions for clients
- Business automation tools - AI-powered workflows

Position: AI Solutionist - Using AI to solve real-world problems

Site History:
- Created: October 24, 2023
- Built with: Nuxt 3, Vue 3, Tailwind CSS
- Latest (Nov 2025): AI Widget v2.0 with GPT-4o-mini, notifications, markdown support

Keep responses friendly, concise (under 150 words), and emphasize AI solutions and technical innovation!`);

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


