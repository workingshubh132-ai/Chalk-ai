# 🎓 Chalk AI - Teacher Assistant

Chalk AI is a modern, practical AI-powered assistant designed to help teachers with their daily workflows. From generating lesson plans and spreadsheets to creating presentations and checklists, Chalk AI makes teaching easier and more efficient.

## ✨ Features

### Core Features
- **💬 Intelligent Chat Interface** - Natural conversations with an AI trained specifically for teacher needs
- **📊 Smart Document Generation**
  - Grade tracking spreadsheets
  - Presentation slides for classroom instruction
  - Student worksheets and assignments
  - Lesson plans with objectives and activities
  - Checklists for classroom management
- **💾 Chat History** - All conversations saved and easily accessible
- **🔐 Secure Authentication** - User accounts with JWT tokens
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile

### Teacher-Specific Features
- Subject and grade level tracking
- Quick access to previous lesson ideas
- Document templates tailored to education
- Multiple document types for different teaching needs

## 🛠 Tech Stack

### Backend
- **Node.js + Express** - REST API server
- **MongoDB + Mongoose** - Database for chat history and user data
- **OpenAI API** - GPT-4 integration for intelligent responses
- **JWT** - Secure authentication
- **TypeScript** - Type-safe backend code

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe frontend code
- **Tailwind CSS** - Beautiful, responsive styling
- **Vite** - Lightning-fast development and builds
- **Lucide Icons** - Clean, consistent iconography
- **Axios** - HTTP client for API communication

### Architecture
- **Monorepo Structure** - Shared types and utilities
- **Modular Components** - Reusable React components
- **Responsive UI** - Mobile-first design approach

## 🚀 Quick Start

### Local Development (5 minutes)

1. **Clone & Install**
   ```bash
   git clone https://github.com/workingshubh132-ai/Chalk-ai.git
   cd Chalk-ai
   npm install
   ```

2. **Setup Environment**
   ```bash
   cp .env.example .env
   ```

3. **Add Your Keys**
   - MongoDB: `mongodb://localhost:27017/chalk-ai` (local) or MongoDB Atlas
   - OpenAI: Get key from https://platform.openai.com/api-keys
   - JWT Secret: Any random string

4. **Run**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`

### ☁️ Deploy to Vercel (2 minutes)

For a live version, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for step-by-step instructions.

**Quick Deploy:**
1. Push to GitHub
2. Connect repo to Vercel at https://vercel.com
3. Add environment variables (MONGODB_URI, OPENAI_API_KEY, JWT_SECRET)
4. Deploy!

---

## 📋 Detailed Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- OpenAI API key (get it from https://platform.openai.com)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/workingshubh132-ai/Chalk-ai.git
   cd Chalk-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your configuration:
   ```
   MONGODB_URI=mongodb://localhost:27017/chalk-ai
   OPENAI_API_KEY=sk-your-api-key
   JWT_SECRET=your-secret-key
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Start MongoDB** (if using local)
   ```bash
   # Make sure MongoDB is running locally or use MongoDB Atlas
   mongod
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```
   - Backend runs on `http://localhost:5000`
   - Frontend runs on `http://localhost:3000`

## 🚀 Usage

### Creating an Account
1. Go to `http://localhost:3000`
2. Click "Sign up"
3. Enter your details (name, email, subject, grade level)
4. Create a password

### Using Chalk AI
1. **Start a Chat** - Click "New Chat" to begin a conversation
2. **Ask Questions** - Type any question about teaching, lesson planning, etc.
3. **Generate Documents** - Click the document icon to create:
   - Grade tracking spreadsheets
   - Presentation slides
   - Student worksheets
   - Lesson plans
   - Checklists
4. **View History** - All conversations are saved in the sidebar

### Example Prompts
- "Create a lesson plan for teaching fractions to 5th graders"
- "Generate a grading spreadsheet for 30 students"
- "Create presentation slides about the solar system"
- "Make a checklist for classroom setup"
- "Design a worksheet with math problems for 7th grade"

## 📁 Project Structure

```
chalk-ai/
├── packages/
│   ├── shared/              # Shared types and utilities
│   │   ├── src/
│   │   │   ├── types.ts     # TypeScript interfaces
│   │   │   └── utils.ts     # Helper functions
│   │   └── tsconfig.json
│   ├── backend/             # Express server (local dev)
│   │   ├── src/
│   │   │   ├── index.ts     # Main server entry
│   │   │   ├── db.ts        # MongoDB connection
│   │   │   ├── models/      # Database schemas
│   │   │   ├── routes/      # API endpoints
│   │   │   └── middleware/  # Auth, error handling
│   │   └── tsconfig.json
│   └── frontend/            # React app
│       ├── src/
│       │   ├── pages/       # Page components
│       │   ├── components/  # Reusable components
│       │   ├── services/    # API client
│       │   ├── context/     # React context
│       │   └── App.tsx
│       └── tsconfig.json
├── api/                    # Vercel Serverless Functions
│   ├── auth.ts            # Authentication endpoints
│   ├── chat.ts            # Chat & conversation endpoints
│   └── documents.ts       # Document generation endpoints
├── vercel.json            # Vercel deployment config
├── VERCEL_DEPLOYMENT.md   # Deployment guide
├── .env.example           # Environment template
├── package.json           # Root package config
└── README.md
```

## 🌐 Deployment Architectures

### Local Development
```
Frontend (React) → Backend Express Server
      ↓                    ↓
Localhost:3000    Localhost:5000
```

### Vercel Production
```
Frontend (Vite) → Vercel CDN → Serverless Functions
                                    ↓
                              MongoDB Atlas
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user

### Chat
- `POST /api/chat/message` - Send message to AI
- `GET /api/chat/conversations` - List all conversations
- `GET /api/chat/conversation/:id` - Get single conversation
- `DELETE /api/chat/conversation/:id` - Delete conversation

### Documents
- `POST /api/documents/generate` - Generate a document
- `GET /api/documents/types` - List available document types

## 🎯 Development Guide

### Adding New Document Types
1. Add type to `packages/shared/src/types.ts`
2. Add prompt in `packages/backend/src/routes/documents.ts`
3. Update UI in `packages/frontend/src/components/DocumentMenu.tsx`

### Customizing the AI
Edit the system prompt in `packages/backend/src/routes/chat.ts` to change AI behavior.

### Styling
The app uses Tailwind CSS. Customize colors in `packages/frontend/tailwind.config.js`.

## 🔒 Security

- Passwords are hashed with bcryptjs
- JWT tokens for authentication
- Environment variables for sensitive data
- Input validation on all endpoints
- CORS enabled for API safety

## 📈 Performance

- Monorepo structure for efficient code sharing
- TypeScript for compile-time error detection
- React lazy loading for faster initial load
- API response caching strategies
- Efficient database queries with indexing

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env`
- For Atlas, verify whitelist IP and connection string

### OpenAI API Error
- Verify `OPENAI_API_KEY` is correct
- Check account has credits
- Ensure API is enabled in OpenAI dashboard

### Frontend Not Connecting to Backend
- Check backend is running on port 5000
- Verify proxy in `vite.config.ts`
- Check browser console for CORS errors

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💡 Future Features

- Export documents to PDF/Word
- Collaboration features for team teaching
- More document types
- Customizable AI system prompts
- Analytics and usage insights
- Integration with Google Classroom
- Student activity tracking

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

Made with ❤️ for teachers. Happy teaching! 🎓
