import mongoose from 'mongoose';
import { User } from '@chalk-ai/shared';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['teacher', 'admin'], default: 'teacher' },
  subject: String,
  gradeLevel: String,
  avatar: String,
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model<User & mongoose.Document>('User', userSchema);
