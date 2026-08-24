import { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const MONGODB_URI = process.env.MONGODB_URI || '';
const JWT_SECRET = process.env.JWT_SECRET || 'chalk-ai-secret-key';

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

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectDB();

    if (req.method === 'POST' && req.url?.includes('register')) {
      const { email, name, password, subject, gradeLevel } = req.body;

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const hashedPassword = await bcryptjs.hash(password, 10);
      const user = await UserModel.create({
        email,
        name,
        password: hashedPassword,
        subject,
        gradeLevel,
        role: 'teacher',
      });

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          subject: user.subject,
          gradeLevel: user.gradeLevel,
        },
      });
    }

    if (req.method === 'POST' && req.url?.includes('login')) {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const validPassword = await bcryptjs.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          subject: user.subject,
          gradeLevel: user.gradeLevel,
        },
      });
    }

    res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
