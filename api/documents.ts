import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { OpenAI } from 'openai';

const JWT_SECRET = process.env.JWT_SECRET || 'chalk-ai-secret-key';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (req.method === 'POST' && req.url?.includes('generate')) {
      const { conversationId, type, title, description } = req.body;
      const userId = decoded.userId;

      const prompts: Record<string, string> = {
        spreadsheet: `Create a CSV spreadsheet for: ${title}\nDescription: ${description}\n\nProvide the data in CSV format with headers and sample data.`,
        presentation: `Create presentation slide content for: ${title}\nDescription: ${description}\n\nProvide 5-7 slide titles and brief content for each.`,
        checklist: `Create a checklist for: ${title}\nDescription: ${description}\n\nProvide items in a structured checklist format with priorities.`,
        'lesson-plan': `Create a lesson plan for: ${title}\nDescription: ${description}\n\nInclude: objectives, materials, activities, assessment.`,
        worksheet: `Create a worksheet for: ${title}\nDescription: ${description}\n\nInclude various problem types and a key.`,
      };

      const prompt = prompts[type] || prompts['spreadsheet'];

      const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a teacher assistant creating educational documents. Format your responses clearly with proper structure.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 3000,
        temperature: 0.7,
      });

      const content = response.choices[0].message.content || '';

      const document = {
        id: `doc-${Date.now()}`,
        type,
        title,
        description,
        conversationId,
        userId,
        createdAt: new Date(),
      };

      return res.json({
        document,
        preview: content.slice(0, 500),
        fullContent: content,
      });
    }

    if (req.method === 'GET' && req.url?.includes('types')) {
      return res.json({
        types: [
          { id: 'spreadsheet', label: 'Grade Spreadsheet', icon: '📊' },
          { id: 'presentation', label: 'Lesson Presentation', icon: '🎯' },
          { id: 'checklist', label: 'Task Checklist', icon: '✓' },
          { id: 'lesson-plan', label: 'Lesson Plan', icon: '📖' },
          { id: 'worksheet', label: 'Student Worksheet', icon: '📝' },
        ],
      });
    }

    res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
