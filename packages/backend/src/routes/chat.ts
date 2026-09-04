import express, { Request, Response } from 'express';
import { OpenAI } from 'openai';
import { getSupabase } from '../db';
import { generateId } from '@chalk-ai/shared';

export const chatRouter = express.Router();

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

const SYSTEM_PROMPT = `You are Chalk AI, an intelligent teacher assistant designed to help educators with their daily tasks. You specialize in:

1. Creating educational content (lesson plans, worksheets, quizzes)
2. Generating spreadsheets for grade tracking and student management
3. Creating presentations for classroom instruction
4. Building checklists and organizational tools
5. Providing teaching advice and pedagogical guidance

When users ask you to create documents, be ready to generate:
- Spreadsheets (grading sheets, attendance records, grade tracking)
- Presentations (lesson slides, parent information, professional development)
- Checklists (classroom setup, lesson planning, student progress tracking)
- Lesson plans (with standards alignment, learning objectives, activities)
- Worksheets (practice problems, assessment items, review sheets)

Always be practical, engaging, and focused on making teachers' jobs easier. Format your responses clearly and offer to generate documents when relevant.`;

chatRouter.post('/message', async (req: Request, res: Response) => {
  try {
    const { conversationId, message } = req.body;
    const userId = req.userId!;
    const supabase = getSupabase();

    let conversationData: any;
    if (conversationId) {
      const { data } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('user_id', userId)
        .single();
      conversationData = data;
    }

    if (!conversationData) {
      const { data } = await supabase
        .from('conversations')
        .insert([
          {
            user_id: userId,
            title: message.slice(0, 50),
            preview: message.slice(0, 100),
          },
        ])
        .select()
        .single();
      conversationData = data;
    }

    const userMsgId = generateId();
    await supabase.from('messages').insert([
      {
        id: userMsgId,
        conversation_id: conversationData.id,
        role: 'user',
        content: message,
      },
    ]);

    const { data: messagesData } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationData.id)
      .order('created_at', { ascending: true });

    const messages = (messagesData || []).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const openaiClient = getOpenAI();
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const assistantContent = response.choices[0].message.content || '';
    const assistantMsgId = generateId();

    await supabase.from('messages').insert([
      {
        id: assistantMsgId,
        conversation_id: conversationData.id,
        role: 'assistant',
        content: assistantContent,
      },
    ]);

    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationData.id);

    res.json({
      conversationId: conversationData.id,
      message: {
        id: assistantMsgId,
        role: 'assistant',
        content: assistantContent,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

chatRouter.get('/conversations', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const supabase = getSupabase();
    const { data } = await supabase
      .from('conversations')
      .select('id, title, preview, created_at, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(20);

    res.json(data || []);
  } catch (error) {
    console.error('Fetch conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

chatRouter.get('/conversation/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const supabase = getSupabase();

    const { data: conversation } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true });

    res.json({ ...conversation, messages: messages || [] });
  } catch (error) {
    console.error('Fetch conversation error:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

chatRouter.delete('/conversation/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const supabase = getSupabase();

    await supabase
      .from('conversations')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    res.json({ success: true });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});
