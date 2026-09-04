import express, { Request, Response } from 'express';
import { OpenAI } from 'openai';
import { getSupabase } from '../db';

export const documentsRouter = express.Router();

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

documentsRouter.post('/generate', async (req: Request, res: Response) => {
  try {
    const { conversationId, type, title, description } = req.body;
    const userId = req.userId!;
    const supabase = getSupabase();

    const prompts = {
      spreadsheet: `Create a CSV spreadsheet for: ${title}\nDescription: ${description}\n\nProvide the data in CSV format with headers and sample data.`,
      presentation: `Create presentation slide content for: ${title}\nDescription: ${description}\n\nProvide 5-7 slide titles and brief content for each.`,
      checklist: `Create a checklist for: ${title}\nDescription: ${description}\n\nProvide items in a structured checklist format with priorities.`,
      'lesson-plan': `Create a lesson plan for: ${title}\nDescription: ${description}\n\nInclude: objectives, materials, activities, assessment.`,
      worksheet: `Create a worksheet for: ${title}\nDescription: ${description}\n\nInclude various problem types and a key.`,
    };

    const prompt = prompts[type as keyof typeof prompts] || prompts.spreadsheet;

    const openaiClient = getOpenAI();
    const response = await openaiClient.chat.completions.create({
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
    const docId = `doc-${Date.now()}`;

    const { data: document } = await supabase
      .from('documents')
      .insert([
        {
          id: docId,
          user_id: userId,
          conversation_id: conversationId,
          type,
          title,
          description,
          content,
        },
      ])
      .select()
      .single();

    res.json({
      document: {
        id: document.id,
        type: document.type,
        title: document.title,
        description: document.description,
        conversationId: document.conversation_id,
        userId: document.user_id,
        createdAt: document.created_at,
      },
      preview: content.slice(0, 500),
      fullContent: content,
    });
  } catch (error) {
    console.error('Document generation error:', error);
    res.status(500).json({ error: 'Failed to generate document' });
  }
});

documentsRouter.get('/types', (req: Request, res: Response) => {
  res.json({
    types: [
      { id: 'spreadsheet', label: 'Grade Spreadsheet', icon: '📊' },
      { id: 'presentation', label: 'Lesson Presentation', icon: '🎯' },
      { id: 'checklist', label: 'Task Checklist', icon: '✓' },
      { id: 'lesson-plan', label: 'Lesson Plan', icon: '📖' },
      { id: 'worksheet', label: 'Student Worksheet', icon: '📝' },
    ],
  });
});
