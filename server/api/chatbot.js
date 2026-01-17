import { defineEventHandler, readBody, createError } from 'h3';
import fetch from 'node-fetch';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { message, context: customContext, skills, projects, aiSolutions } = body;

    if (!message) {
      throw createError({
        statusCode: 400,
        message: 'Message is required'
      });
    }

    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      throw createError({
        statusCode: 500,
        message: 'OpenAI API key not configured'
      });
    }

    // Build skills & experience from aiSolutions if available
    let skillsContext = '';
    let projectsContext = '';
    
    if (aiSolutions && Array.isArray(aiSolutions) && aiSolutions.length > 0) {
      skillsContext = aiSolutions.map(item => 
        `${item.tag}: ${item.title} - ${item.description}`
      ).join('\n');
      projectsContext = aiSolutions.filter(item => item.link).map(item =>
        `- ${item.title} (${item.tag}): ${item.description}${item.link ? ` [${item.link}]` : ''}`
      ).join('\n');
    } else {
      // Fallback to defaults
      skillsContext = `Chat Widget (Chatbot/AI), Game Tools & Community Feedback, Full Stack Deployment with Laravel & Next.js, Frontend UI/UX Craftsmanship, Real-Time API Integrations, Chrome Extensions with Game Automation, Content Workflows with Decap & CMS, Backend Engineering with PHP/Python/Node, AI + Automation Projects with OpenAI & Puppeteer`;
      projectsContext = `- Sunflower Land: Desert Digging Tool - High-performance web tool used by hundreds daily
- Personal Hub (hub.jovylle.com) - Comprehensive utility tools and services  
- Reaction Test Game (fast.jovylle.com) - Interactive game with leaderboard system
- Chat Widget (chat-widget.uft1.com) - Lightweight GPT-powered chatbot
- ChatGPT Clone - Python & GCP serverless implementation
- Weather App - Full-stack weather application`;
    }
    
    // Use custom context if provided, otherwise use default
    const systemMessage = customContext || `You are a helpful assistant for Jovylle's portfolio website. You help visitors learn about Jovylle's work, skills, and projects.

About Jovylle:
- Full-Stack Web Developer based in the Philippines
- Passionate about building modern web experiences with clean code and thoughtful design
- Enjoys solving complex technical challenges and creating tools that help people
- Has experience with game enhancement development using Java, working with API constraints
- Built production applications serving hundreds of daily users (e.g., Sunflower Land tools)
- Active in the web development community

Skills & Experience:
${skillsContext}

Notable Projects & Achievements:
${projectsContext}

Personality:
- Friendly and approachable, uses casual but professional tone
- Direct and helpful - gets to the point
- Genuinely excited about web development and technology
- Modest but confident about abilities
- Happy to discuss technical details or general questions

Keep responses concise (under 150 words), friendly, and helpful. If asked about specific projects, provide details about technologies used and challenges solved. If asked about availability for work, mention checking the contact page.`;
    
    console.log('🤖 Local API received context:', customContext ? 'Custom (' + customContext.substring(0, 50) + '...)' : 'Using default');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: message }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', response.status, errorData);
      throw createError({
        statusCode: response.status,
        message: `OpenAI API error: ${errorData.error?.message || 'Unknown error'}`
      });
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw createError({
        statusCode: 500,
        message: 'Invalid response format from OpenAI API'
      });
    }

    return data;
  } catch (error) {
    console.error('Error in chatbot API:', error);
    throw error;
  }
});