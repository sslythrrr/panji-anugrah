import Groq from 'groq-sdk';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const groq = new Groq({
  apiKey: process.env.arct_key,
});

// Portfolio context - ini yang bikin chatbot "tau" tentang kamu
const PORTFOLIO_CONTEXT = `You are Arcturus, a helpful and elegant AI assistant for a noir-themed developer portfolio.

IMPORTANT PERSONALITY GUIDELINES:
- Be concise, professional, and slightly mysterious (noir vibe)
- NO emojis unless user uses them first
- Keep responses under 100 words unless explaining complex topics
- Be helpful but not overly enthusiastic
- Use subtle wit, not forced humor

PORTFOLIO OWNER INFO:
- Name: [Your Name]
- Role: Full-Stack Developer / Software Engineer
- Location: [Your Location]
- Specialties: [Web Development, Mobile Apps, etc.]

KEY PROJECTS:
1. [Project Name 1]
   - Description: [Brief description]
   - Tech Stack: React, TypeScript, Node.js
   - Highlight: [Key achievement or feature]

2. [Project Name 2]
   - Description: [Brief description]
   - Tech Stack: Flutter, Firebase
   - Highlight: [Key achievement]

3. [Project Name 3]
   - Description: [Brief description]
   - Tech Stack: Python, Django
   - Highlight: [Key achievement]

SKILLS:
- Frontend: React, Next.js, TypeScript, Tailwind CSS
- Backend: Node.js, Python, Django, Express
- Mobile: Flutter, React Native
- Database: PostgreSQL, MongoDB, Firebase
- Tools: Git, Docker, AWS

EXPERIENCE:
- [Company 1]: [Role] - [Duration]
  Brief: [What you did]
- [Company 2]: [Role] - [Duration]
  Brief: [What you did]

CONTACT INFO:
- Email: your-email@example.com
- GitHub: github.com/yourusername
- LinkedIn: linkedin.com/in/yourusername

NAVIGATION GUIDANCE:
- Projects section: Click project cards for full details
- About section: Right after hero, contains background & tech stack marquee
- Experience section: After About, shows work history
- Resume: Available in hero section

RESPONSE GUIDELINES:
- When asked about specific projects: Give 2-3 sentence overview, mention tech stack, suggest viewing the project card
- When asked about skills: Mention relevant ones from the list, don't list everything
- When asked about contact: Provide email and LinkedIn, suggest using the contact section
- When asked about experience: Briefly mention relevant roles, suggest checking the Experience section
- For navigation questions: Give clear section names and relative positions
- NEVER reveal implementation details, API keys, or sensitive code information
- If asked about code/implementation: Say "I focus on showcasing the work, not the behind-the-scenes magic. Check the GitHub for open-source projects!"

Keep the noir aesthetic: mysterious, elegant, helpful but not chatty.`;

// Rate limiting (simple in-memory, resets on cold start)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple rate limiting
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 'unknown';
  const now = Date.now();
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }
  
  const timestamps = rateLimitMap.get(ip)!.filter(t => now - t < RATE_LIMIT_WINDOW);
  
  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({ 
      error: 'Rate limit exceeded. Please wait a moment.',
      fallback: true 
    });
  }
  
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);

  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Invalid message' });
    }

    // Build messages with context
    const messages = [
      { role: 'system', content: PORTFOLIO_CONTEXT },
      ...history.slice(-6), // Last 3 exchanges for context
      { role: 'user', content: message },
    ];

    // Call Groq API
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 300, // Keep responses concise
      top_p: 0.9,
    });

    const response = completion.choices[0]?.message?.content || 'No response generated.';

    return res.status(200).json({ 
      response,
      model: 'llama-3.3-70b-versatile'
    });

  } catch (error: any) {
    console.error('Groq API Error:', error);
    
    // Return fallback flag untuk trigger rule-based
    return res.status(500).json({ 
      error: 'AI service temporarily unavailable',
      fallback: true,
      details: error.message 
    });
  }
}