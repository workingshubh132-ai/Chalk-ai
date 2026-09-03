import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';
const JWT_SECRET = process.env.JWT_SECRET || 'chalk-ai-secret-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

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
    if (req.method === 'POST' && req.url?.includes('register')) {
      const { email, name, password, subject, gradeLevel } = req.body;

      // Check if user exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await bcryptjs.hash(password, 10);

      // Create user
      const { data: user, error: createError } = await supabase
        .from('users')
        .insert([
          {
            email,
            name,
            password_hash: hashedPassword,
            subject,
            grade_level: gradeLevel,
          },
        ])
        .select()
        .single();

      if (createError) {
        return res.status(400).json({ error: 'Registration failed' });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          subject: user.subject,
          gradeLevel: user.grade_level,
        },
      });
    }

    if (req.method === 'POST' && req.url?.includes('login')) {
      const { email, password } = req.body;

      // Get user
      const { data: user, error: queryError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const validPassword = await bcryptjs.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          subject: user.subject,
          gradeLevel: user.grade_level,
        },
      });
    }

    res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
