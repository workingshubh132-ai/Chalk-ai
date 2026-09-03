import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import { OpenAI } from 'openai';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';
const JWT_SECRET = process.env.JWT_SECRET || 'chalk-ai-secret-key';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

const SYSTEM_PROMPT = `You are Chalk AI, an intelligent teacher assistant designed to help educators with their daily tasks. You specialize in:

1. Creating educational content (lesson plans, worksheets, quizzes)
2. Generating spreadsheets for grade tracking and student management
3. Creating presentations for classroom instruction
4. Building checklists and organizational tools
5. Providing teaching advice and pedagogical guidance

Always be practical, engaging, and focused on making teachers' jobs easier.`;

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

    if (req.method === 'POST' && req.url?.includes('message')) {
      const { conversationId, message } = req.body;
      const userId = decoded.userId;

      let conversation;

      if (conversationId) {
        const { data } = await supabase
          .from('conversations')
          .select('*')
          .eq('id', conversationId)
          .eq('user_id', userId)
          .single();
        conversation = data;
      }

      if (!conversation) {
        const { data: newConv } = await supabase
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
        conversation = newConv;
      }

      // Save user message
      await supabase.from('messages').insert([
        {
          conversation_id: conversation.id,
          role: 'user',
          content: message,
        },
      ]);

      // Get all messages for context
      const { data: allMessages } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true });

      const messages = (allMessages || []).map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Call OpenAI
      const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 2000,
        temperature: 0.7,
      });

      const assistantContent = response.choices[0].message.content || '';

      // Save assistant message
      const { data: assistantMessage } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversation.id,
            role: 'assistant',
            content: assistantContent,
          },
        ])
        .select()
        .single();

      // Update conversation
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversation.id);

      return res.json({
        conversationId: conversation.id,
        message: assistantMessage,
      });
    }

    if (req.method === 'GET' && req.url?.includes('conversations')) {
      const userId = decoded.userId;
      const { data: conversations } = await supabase
        .from('conversations')
        .select('id, title, preview, created_at, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(20);

      return res.json(conversations || []);
    }

    if (req.method === 'GET' && req.url?.includes('conversation/')) {
      const id = req.url.split('/').pop();
      const userId = decoded.userId;

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

      return res.json({ ...conversation, messages: messages || [] });
    }

    if (req.method === 'DELETE' && req.url?.includes('conversation/')) {
      const id = req.url.split('/').pop();
      const userId = decoded.userId;

      await supabase
        .from('conversations')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      return res.json({ success: true });
    }

    res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
