import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db';
import { authRouter } from './routes/auth';
import { chatRouter } from './routes/chat';
import { documentsRouter } from './routes/documents';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/chat', authMiddleware, chatRouter);
app.use('/api/documents', authMiddleware, documentsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Error handling
app.use(errorHandler);

// Connect to DB and start server
async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Chalk AI server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
