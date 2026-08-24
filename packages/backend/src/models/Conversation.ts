import mongoose from 'mongoose';
import { Conversation, Message } from '@chalk-ai/shared';

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

export const ConversationModel = mongoose.model<Conversation & mongoose.Document>(
  'Conversation',
  conversationSchema
);
