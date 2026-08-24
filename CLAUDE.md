# Chalk AI - Claude Development Guide

## Project Overview

Chalk AI is a full-stack teacher assistant application built with React, Node.js, Express, and MongoDB. It helps teachers create lesson plans, presentations, spreadsheets, checklists, and more using AI.

## Tech Stack Summary

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite
- **Backend**: Express + Node.js + MongoDB + OpenAI API
- **Architecture**: Monorepo with shared types

## Project Structure

```
packages/
├── shared/     # Shared TypeScript types and utilities
├── backend/    # Express API server
└── frontend/   # React web application
```

## Development Setup

1. **Install dependencies**: `npm install`
2. **Environment setup**: Copy `.env.example` to `.env` and fill in:
   - `MONGODB_URI` - MongoDB connection string
   - `OPENAI_API_KEY` - OpenAI API key
   - `JWT_SECRET` - Secret key for JWT tokens
3. **Start dev server**: `npm run dev` (runs both backend and frontend)
4. **Frontend**: Opens on http://localhost:3000
5. **Backend**: Runs on http://localhost:5000

## Common Tasks

### Adding Features
- **New API endpoint**: Add route in `packages/backend/src/routes/`
- **New page**: Create in `packages/frontend/src/pages/`
- **New component**: Create in `packages/frontend/src/components/`
- **Shared types**: Update `packages/shared/src/types.ts`

### Database
- Models are in `packages/backend/src/models/`
- Using Mongoose with MongoDB
- Schemas: User, Conversation

### Authentication
- JWT tokens in `packages/backend/src/middleware/auth.ts`
- Login/Register in `packages/backend/src/routes/auth.ts`
- Client-side auth context in `packages/frontend/src/context/AuthContext.ts`

### AI Integration
- OpenAI API calls in `packages/backend/src/routes/chat.ts`
- System prompt defines AI behavior
- Document generation templates in `packages/backend/src/routes/documents.ts`

## Key Files

| File | Purpose |
|------|---------|
| `packages/backend/src/index.ts` | Backend entry point |
| `packages/frontend/src/App.tsx` | Frontend root component |
| `packages/frontend/src/pages/ChatPage.tsx` | Main chat interface |
| `packages/backend/src/routes/chat.ts` | Chat API logic |
| `packages/shared/src/types.ts` | TypeScript type definitions |

## Testing & Building

- **Type check**: `npm run type-check`
- **Lint**: `npm run lint`
- **Build**: `npm run build`
- **Start production**: `npm start`

## Environment Variables

```
# Backend
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/chalk-ai
JWT_SECRET=your-secret-key
OPENAI_API_KEY=sk-your-key

# Frontend (via Vite env)
VITE_API_URL=http://localhost:5000/api
```

## Performance Considerations

- Messages are stored in MongoDB for persistence
- Chat history loads on demand
- Frontend uses React context for state management
- Tailwind CSS for optimized styling

## Common Commands

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Run production server
npm run type-check       # Check TypeScript
npm run lint             # Run linter
```

## Notes for Claude

- Monorepo uses npm workspaces
- All shared code is in `packages/shared`
- Backend requires MongoDB and OpenAI API key
- Frontend is a standard React + Vite app
- Document generation uses OpenAI's API
- All routes are protected with JWT auth except /auth

## Extending the App

### Adding New Document Types
1. Update `DocumentMeta` type in `shared/types.ts`
2. Add prompt in `backend/routes/documents.ts`
3. Add UI option in `frontend/components/DocumentMenu.tsx`

### Adding New Features
1. Design database schema if needed
2. Create backend routes
3. Add frontend components
4. Update shared types
5. Test end-to-end

## Deployment

- Build frontend: `npm run build` → creates `dist/` folder
- Backend deployed with Node.js runtime
- MongoDB connection required
- Environment variables must be set
- OpenAI API key required for AI features
