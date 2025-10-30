export const handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        // Parse request body
        const { message, skills, projects } = JSON.parse(event.body);
        
        if (!message) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Message is required' })
            };
        }

        // Check if API key is available
        if (!process.env.OPENAI_API_KEY) {
            return {
                statusCode: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'OpenAI API key not configured' })
            };
        }

        // Call OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `You are a helpful assistant for Jovylle's portfolio website. You help visitors learn about Jovylle's work, skills, and projects. 

Skills: ${skills ? skills.join(', ') : 'JavaScript, Vue, Nuxt, React, Node.js, Python, PHP, Laravel, MySQL, MongoDB, Git, Docker, AWS, GCP'}

Projects: ${projects ? projects.map(p => p.name).join(', ') : 'Portfolio Website, Reaction Test Game, ChatGPT Clone, Stick Figure Game, Melvorite Extension, Sunflower Land Helper'}

Keep responses concise (under 150 words), friendly, and helpful. Focus on Jovylle's technical expertise and project experience.`
                    },
                    { role: 'user', content: message }
                ],
                max_tokens: 150,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        
        return {
            statusCode: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('Error in chatbot function:', error);
        
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: 'Sorry, I encountered an error. Please try again later.'
            })
        };
    }
};
