import express, { Request, Response } from 'express';
import { OpenAI } from 'openai';
import { ConversationModel } from '../models/Conversation';
import { generateId, parsePrompt } from '@chalk-ai/shared';

export const chatRouter = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
      id: generateId(),
      role: 'user' as const,
      content: message,
      createdAt: new Date(),
    };

    conversation.messages.push(userMessage);

    const messages = conversation.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

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
      id: generateId(),
      role: 'assistant' as const,
      content: assistantContent,
      createdAt: new Date(),
    };

    conversation.messages.push(assistantMessage);
    conversation.updatedAt = new Date();
    await conversation.save();

    res.json({
      conversationId: conversation._id,
      message: assistantMessage,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

chatRouter.get('/conversations', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const conversations = await ConversationModel.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(20)
      .select('_id title preview createdAt updatedAt');

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

chatRouter.get('/conversation/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const conversation = await ConversationModel.findOne({ _id: id, userId });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

chatRouter.delete('/conversation/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    await ConversationModel.deleteOne({ _id: id, userId });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});
