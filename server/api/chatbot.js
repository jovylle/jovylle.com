import { defineEventHandler, readBody } from 'h3';
import fetch from 'node-fetch';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { message, context, skills, projects } = body;

  // Use custom context if provided, otherwise use default
  const systemMessage = context || `You are a helpful assistant for Jovylle's portfolio website. You help visitors learn about Jovylle's work, skills, and projects. 

Skills: ${skills ? skills.join(', ') : 'JavaScript, Vue, Nuxt, React, Node.js, Python, PHP, Laravel, MySQL, MongoDB, Git, Docker, AWS, GCP'}

Projects: ${projects ? projects.map(p => p.name).join(', ') : 'Portfolio Website, Reaction Test Game, ChatGPT Clone, Stick Figure Game, Melvorite Extension, Sunflower Land Helper'}

Keep responses concise (under 150 words), friendly, and helpful. Focus on Jovylle's technical expertise and project experience.`;
  
  console.log('🤖 Local API received context:', context ? 'Custom (' + context.substring(0, 50) + '...)' : 'Using default');

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

  const data = await response.json();
  return data;
});