export default defineNuxtPlugin(() => {
  if (process.server) return;

  // Avoid duplicate injection across navigations/HMR
  if (document.querySelector('script[data-jovylle-embed="true"]')) return;

  const script = document.createElement('script');
  script.src = '/widget/embed-inline.js';
  script.async = true;
  script.setAttribute('data-jovylle-embed', 'true');

  // Default configuration for global embed
  script.setAttribute('data-position', 'bottom-right');
  script.setAttribute('data-size', 'small');
  script.setAttribute('data-title', 'AI Assistant');
  script.setAttribute('data-show-leaderboard', 'true'); // Enable leaderboard for home page
  script.setAttribute('data-hide-portfolio', 'true');
  script.setAttribute('data-auto-open-on-notifications', 'true');
  script.setAttribute('data-notification-tab-title', 'Alerts');
  script.setAttribute('data-feedback-url', 'https://tally.so/r/WO9dWk');
  script.setAttribute('data-notifications-index', 'https://pocket.uft1.com/notifications/index.json');
  script.setAttribute('data-notifications-limit', '10');
  script.setAttribute('data-notification-tags', 'jovylle.com,all');
  script.setAttribute('data-ai-context', `You are an AI assistant for Jovylle Bermudez's portfolio website. Help visitors learn about Jovylle's technical skills, solutions, experience, and projects.

=== TECHNICAL SKILLS & EXPERTISE ===

Frontend Development:
- JavaScript (ES6+), TypeScript
- Vue.js, Nuxt.js (SSR, SSG, PWA)
- React, Next.js
- Tailwind CSS, CSS3, HTML5
- Responsive design, mobile-first approach

Backend Development:
- Node.js, Express.js
- Python (Flask, FastAPI, serverless)
- PHP, Laravel framework
- RESTful APIs, GraphQL

Databases & Data:
- MySQL, PostgreSQL (relational)
- MongoDB, Firebase (NoSQL)
- Database design, optimization, migrations

DevOps & Cloud:
- Docker, containerization
- AWS (Lambda, S3, EC2, CloudFront)
- Google Cloud Platform (Cloud Functions, App Engine)
- Netlify, Vercel (deployment)
- CI/CD pipelines, Git workflows

AI & Machine Learning:
- OpenAI API integration (GPT-3.5, GPT-4, GPT-4o-mini)
- AI chatbot development
- AI-powered automation
- Natural language processing

Tools & Technologies:
- Git, GitHub, GitLab
- Webpack, Vite, build tools
- Testing frameworks
- API development and integration

=== EXPERIENCE ===
- 5+ years of full-stack development experience
- Specialized in AI-powered solutions and modern web applications
- Built production applications for clients and personal projects
- Expertise in both frontend and backend development
- Strong problem-solving and solution architecture skills

=== SOLUTIONS & PROJECTS ===

AI Solutions:
- AI Widget (this widget!) - Embeddable AI assistant with GPT-4o-mini, notifications, markdown support
- ChatGPT Clone - Python serverless implementation on GCP with OpenAI integration
- AI-powered automation tools for business workflows

Web Applications:
- Reaction Test Game (fast.jovylle.com) - Real-time gamification solution with leaderboard
- Utility Tools Hub (uft1.com) - Collection of developer productivity tools
- Wedding websites - Custom, responsive web solutions for clients
- Portfolio website (jovylle.com) - Built with Nuxt 3, showcasing skills and projects

Technical Solutions:
- Serverless architectures
- API integrations
- Database optimization
- Performance optimization
- Cross-platform compatibility

=== POSITIONING ===
AI Solutionist - Using AI and modern technology to solve real-world problems. Focus on practical, scalable solutions that deliver value.

=== SITE INFO ===
- Created: October 24, 2023
- Built with: Nuxt 3, Vue 3, Tailwind CSS
- Latest Update (Nov 2025): AI Widget v2.0 with comprehensive features

=== RESPONSE GUIDELINES ===
- Be friendly, professional, and enthusiastic about technology
- Keep responses concise (under 150 words)
- Focus on technical skills, solutions, and experience
- Highlight AI expertise and full-stack capabilities
- Provide specific examples when relevant
- Emphasize problem-solving and innovation`);

  document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(script);
    
    // Wait for widget to load, then show recent updates
    setTimeout(() => {
      if (window.JovylleInlineWidget) {
        // Latest feature
        window.JovylleInlineWidget.addNotification({
          type: 'success',
          title: '🆕 Nov 11: New Features!',
          message: 'Optional leaderboard, custom widget titles, and AI & Solutions rebranding.',
          persistent: false
        });
        
        // Widget v2.0 launch
        setTimeout(() => {
          window.JovylleInlineWidget.addNotification({
            type: 'info',
            title: '🚀 Widget v2.0 Launched',
            message: 'GPT-4o-mini AI, markdown support, notification system, custom AI context, and chat-first UI.',
            persistent: true
          });
        }, 2000);
        
        // AI Solutionist positioning
        setTimeout(() => {
          window.JovylleInlineWidget.addNotification({
            type: 'info',
            title: '💡 AI Solutionist',
            message: 'Now highlighting 5+ years of AI-powered solutions. Ask me about AI integration projects!',
            persistent: true
          });
        }, 4000);
      }
    }, 2000);
  });
});


