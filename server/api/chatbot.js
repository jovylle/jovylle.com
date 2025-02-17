import { defineEventHandler, readBody } from 'h3';
import fetch from 'node-fetch';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { message, skills, projects } = body;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: `You are a helpful assistant to viewers of jovylle's web developer website (his name is 'Jovylle B.'). The user is viewing the portfolio of a developer with the following skills: ${skills.join(', ')} and the following projects: ${projects.map(p => p.name).join(', ')}. Answer the user's questions as if you are guiding them through the portfolio.` },
        { role: 'user', content: message }
      ],
      max_tokens: 150
    })
  });

  const data = await response.json();
  return data;
});