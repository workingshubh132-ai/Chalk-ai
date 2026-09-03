# 🚀 Supabase Setup Guide for Chalk AI

## What is Supabase?

Supabase is **PostgreSQL + Authentication + Real-time**. It's like Firebase but open-source and uses SQL.

- **Free tier**: 500MB storage, perfect for testing
- **Easy setup**: No infrastructure needed
- **SQL Database**: Familiar to developers
- **Built-in Auth**: User management included
- **Real-time**: WebSocket support

## Step 1: Create Supabase Project (2 minutes)

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub/Google
4. Create new project:
   - **Name**: `chalk-ai`
   - **Password**: Save this (you need it!)
   - **Region**: Pick closest to you
5. Wait 2-3 minutes for setup

## Step 2: Get Your Credentials

Go to **Settings → API**

You'll see:
```
SUPABASE_URL = https://your-project.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Copy all three and paste in `.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 3: Create Database Tables

Go to **SQL Editor** in Supabase dashboard and run this:

```sql
-- Create Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  subject VARCHAR(100),
  grade_level VARCHAR(100),
  avatar VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Conversations Table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) DEFAULT 'New Conversation',
  preview TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Messages Table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Documents Table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  download_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for Performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_documents_user_id ON documents(user_id);
```

That's it! Your database is ready. ✅

## Step 4: Update Your Code

The backend has been updated to use Supabase. Just update `.env` and you're good!

## Vercel Deployment with Supabase

Add these environment variables to Vercel:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=sk-your-key
JWT_SECRET=your-secret
```

## Features Supabase Gives You

### 1. **Built-in Authentication**
- Email/password auth ready to use
- Social login (Google, GitHub, etc.)
- Magic links, TOTP, MFA

### 2. **Real-time Database**
- Listen to changes in real-time
- Great for live chat features

### 3. **Row-Level Security (RLS)**
- Control who sees what data
- Built-in security policies

### 4. **File Storage**
- Store documents, avatars, etc.
- Simple S3-like API

### 5. **Vector Search**
- pgvector extension included
- Great for AI embeddings

## Common Tasks

### View Your Data
1. Go to Supabase Dashboard
2. Click "Table Editor"
3. See all your users, conversations, messages

### Run SQL Queries
1. Go to "SQL Editor"
2. Write custom queries
3. See results instantly

### Reset Database
```sql
-- Drop all tables
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS conversations;
DROP TABLE IF EXISTS users;
```

## Upgrade to Paid (Optional)

When you outgrow free tier:
- Go to Settings → Billing
- Click "Upgrade"
- Pay $25/month for Pro
- Get 50GB storage, 500M requests

## Troubleshooting

### "Connection refused"
- Check SUPABASE_URL is correct
- Verify API keys are not expired
- Test in Supabase SQL Editor first

### "Relations don't exist"
- Run the SQL setup script again
- Make sure it completed without errors

### "Permission denied"
- Check RLS policies (Settings → Authentication → Policies)
- Make sure service key is being used for admin operations

## Next Steps

1. ✅ Create Supabase project
2. ✅ Copy API keys to `.env`
3. ✅ Run SQL setup script
4. ✅ Run `npm run dev`
5. ✅ Deploy to Vercel

---

**That's it!** Chalk AI is now running on Supabase! 🎉
