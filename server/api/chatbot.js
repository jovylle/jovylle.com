import { defineEventHandler, readBody, createError } from 'h3';
import fetch from 'node-fetch';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { message, context: customContext, skills, projects, aiSolutions, profile } = body;

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
      // Parse with full details: technologies, years, descriptions
      skillsContext = aiSolutions.map(item => {
        const techs = item.technologies ? ` (${item.technologies.join(', ')})` : '';
        const year = item.year ? ` [${item.year}]` : '';
        return `${item.tag}: ${item.title}${year}${techs} - ${item.description}`;
      }).join('\n\n');
      
      projectsContext = aiSolutions.filter(item => item.link).map(item =>
        `- ${item.title} (${item.tag}): ${item.description} → ${item.link}`
      ).join('\n');
    } else {
      // Minimal fallback if API fails
      skillsContext = `Full-Stack Web Developer with expertise in Vue, React, Node.js, Laravel, Python, and cloud deployments.`;
      projectsContext = `- Web applications serving hundreds of daily users
- Open-source tools and widgets
- Full-stack commercial projects`;
    }
    
    const profileContext = profile
      ? `Profile Summary:\n- ${profile.title}: ${profile.short_bio}\n- Tone: ${profile.tone}\n- Availability: ${profile.availability}\n- Contact path: ${profile.contact_path}\n`
      : `Profile Summary:\n- Full-Stack Web Developer focused on modern web experiences and developer tools.\n- Appreciates clean code, thoughtful design, and solving complex technical problems.\n- Availability: Open to opportunities.`;

    const roleInstructions = `
Always speak about Jovylle in third person, e.g., "Jovylle can help..."
Describe how his skills or projects solve the visitor's problem.
Keep answers concise (under 150 words) and friendly.
Avoid framing responses as the assistant offering personal services.
Mention relevant highlights when the visitor asks about capabilities.
`;

    const defaultSystemContent = `You are a helpful assistant for Jovylle's portfolio website. You help visitors learn about Jovylle's work, skills, and projects.

${roleInstructions}

${profileContext}

Skills & Experience:
${skillsContext}

Notable Projects & Achievements:
${projectsContext}

Personality & Communication:
- Friendly, approachable, and uses a casual but professional tone
- Direct and helpful - gets to the point quickly
- Genuinely excited about web development and technology
- Happy to discuss technical details or answer general questions

Keep responses concise (under 150 words), friendly, and helpful. If asked about specific projects, provide details about technologies used and challenges solved. For work inquiries, direct visitors to the contact page.`;

    const systemMessage = `${customContext ? customContext.trim() + '\n\n' : ''}${defaultSystemContent}`; 
    
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