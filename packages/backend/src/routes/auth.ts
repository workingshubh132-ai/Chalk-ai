import express, { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { UserModel } from '../models/User';
import { generateToken } from '../middleware/auth';

export const authRouter = express.Router();

authRouter.post('/register', async (req: Request, res: Response) => {
  try {
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

    const token = generateToken(user._id.toString());
    res.json({
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
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id.toString());
    res.json({
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
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});
