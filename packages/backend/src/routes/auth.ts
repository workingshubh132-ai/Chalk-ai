import express, { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { getSupabase } from '../db';
import { generateToken } from '../middleware/auth';

export const authRouter = express.Router();

authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, name, password, subject, gradeLevel } = req.body;
    const supabase = getSupabase();

    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const { data: user, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          name,
          password_hash: hashedPassword,
          subject,
          grade_level: gradeLevel,
          role: 'teacher',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    const token = generateToken(user.id);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        subject: user.subject,
        gradeLevel: user.grade_level,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const supabase = getSupabase();

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcryptjs.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        subject: user.subject,
        gradeLevel: user.grade_level,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});
