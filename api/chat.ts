import { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { OpenAI } from 'openai';

const MONGODB_URI = process.env.MONGODB_URI || '';
const JWT_SECRET = process.env.JWT_SECRET || 'chalk-ai-secret-key';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

const messageSchema = new mongoose.Schema({
  id: String,
  role: { type: String, enum: ['user', 'assistant'] },
  content: String,
  attachments: [{ id: String, name: String, url: String, type: String, size: Number }],
  createdAt: { type: Date, default: Date.now },
});

const conversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'New Conversation' },
  preview: String,
  messages: [messageSchema],
  documentGenerated: {
    id: String,
    type: String,
    title: String,
    description: String,
    downloadUrl: String,
    createdAt: Date,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ConversationModel = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
}

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

    await connectDB();

    if (req.method === 'POST' && req.url?.includes('message')) {
      const { conversationId, message } = req.body;
      const userId = decoded.userId;

      let conversation = conversationId
        ? await ConversationModel.findOne({ _id: conversationId, userId })
        : null;

      if (!conversation) {
        conversation = await ConversationModel.create({
          userId,
          title: message.slice(0, 50),
          preview: message.slice(0, 100),
          messages: [],
        });
      }

      const userMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: message,
        createdAt: new Date(),
      };

      conversation.messages.push(userMessage);

      const messages = conversation.messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      }));

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

      const assistantMessage = {
        id: `msg-${Date.now()}-assist`,
        role: 'assistant',
        content: assistantContent,
        createdAt: new Date(),
      };

      conversation.messages.push(assistantMessage);
      conversation.updatedAt = new Date();
      await conversation.save();

      return res.json({
        conversationId: conversation._id,
        message: assistantMessage,
      });
    }

    if (req.method === 'GET' && req.url?.includes('conversations')) {
      const userId = decoded.userId;
      const conversations = await ConversationModel.find({ userId })
        .sort({ updatedAt: -1 })
        .limit(20)
        .select('_id title preview createdAt updatedAt');

      return res.json(conversations);
    }

    if (req.method === 'GET' && req.url?.includes('conversation/')) {
      const id = req.url.split('/').pop();
      const userId = decoded.userId;

      const conversation = await ConversationModel.findOne({ _id: id, userId });
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }

      return res.json(conversation);
    }

    if (req.method === 'DELETE' && req.url?.includes('conversation/')) {
      const id = req.url.split('/').pop();
      const userId = decoded.userId;

      await ConversationModel.deleteOne({ _id: id, userId });
      return res.json({ success: true });
    }

    res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
