# 🚀 Vercel Deployment Guide for Chalk AI

This guide will help you deploy Chalk AI to Vercel with serverless backend functions.

## 📋 Prerequisites

- GitHub account with the Chalk AI repository
- Vercel account (free tier available)
- MongoDB Atlas account (free tier: M0)
- OpenAI API key

## 🔧 Step 1: Prepare Dependencies

### MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 tier - free)
4. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/chalk-ai?retryWrites=true&w=majority`
5. Whitelist your IP (or 0.0.0.0 for development)

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com)
2. Create an API key
3. Make sure you have credits or billing set up

## 📝 Step 2: Configure Environment Variables

### Local Development (.env file)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chalk-ai
OPENAI_API_KEY=sk-your-key
JWT_SECRET=your-super-secret-key-change-this-in-production
NODE_ENV=development
VITE_API_URL=http://localhost:3000/api
```

### For Testing (Local)
1. Copy `.env.example` to `.env`
2. Fill in your actual values
3. Run: `npm run dev`

## 🚀 Step 3: Deploy to Vercel

### Option A: Connect GitHub Repository (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Setup for Vercel deployment"
   git push origin claude/chalk-ai-teacher-assistant-cwoktl
   ```

2. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
   - Click "Add New..." → "Project"
   - Import the GitHub repository
   - Select the `claude/chalk-ai-teacher-assistant-cwoktl` branch

3. **Configure Project Settings**
   - Framework: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `packages/frontend/dist`
   - Install Command: `npm install`

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   MONGODB_URI = your-mongodb-connection-string
   OPENAI_API_KEY = sk-your-openai-key
   JWT_SECRET = your-super-secret-jwt-key
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel deploy

# Production deployment
vercel deploy --prod
```

## 🔌 API Endpoints After Deployment

After deploying to Vercel, your API endpoints will be:

```
https://your-project.vercel.app/api/auth/register
https://your-project.vercel.app/api/auth/login
https://your-project.vercel.app/api/chat/message
https://your-project.vercel.app/api/documents/generate
```

## 🧪 Testing After Deployment

### 1. Register a New Account
```bash
curl -X POST https://your-project.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@example.com",
    "name": "John Doe",
    "password": "securepassword",
    "subject": "Math",
    "gradeLevel": "10th Grade"
  }'
```

### 2. Login
```bash
curl -X POST https://your-project.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@example.com",
    "password": "securepassword"
  }'
```

### 3. Send a Chat Message
```bash
curl -X POST https://your-project.vercel.app/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "message": "Create a lesson plan for teaching fractions"
  }'
```

## 📊 Monitoring & Logs

1. **View Logs**
   - Go to Vercel Dashboard
   - Click on your project
   - Go to "Logs" tab
   - Select "Function Logs" to see serverless function logs

2. **Monitor Performance**
   - Analytics tab shows request counts, response times
   - Function metrics show duration and invocation counts

## 🛡️ Production Best Practices

### Security
- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Enable MongoDB IP whitelist (specific IPs)
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Add rate limiting for API endpoints

### Performance
- [ ] Enable MongoDB connection pooling
- [ ] Set appropriate function timeout (30s default)
- [ ] Monitor cold start times
- [ ] Enable edge caching if needed

### Scaling
- [ ] Monitor MongoDB connection limits (M0 tier: 500)
- [ ] Set up alerts for API errors
- [ ] Plan for upgrading MongoDB tier if needed
- [ ] Consider API rate limiting

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Fix chat feature"
git push origin claude/chalk-ai-teacher-assistant-cwoktl

# Vercel will automatically:
# 1. Detect the changes
# 2. Run build
# 3. Deploy to production
```

## ❌ Troubleshooting

### "Cannot find module" errors
- Verify all dependencies are listed in `package.json`
- Check that imports use correct paths
- Restart build

### MongoDB Connection Errors
- Verify connection string is correct
- Check IP whitelist in MongoDB Atlas
- Ensure cluster is running
- Test locally first

### OpenAI API Errors
- Verify API key is correct
- Check account has credits
- Verify API is enabled
- Check API usage limits

### Serverless Function Timeout
- Default is 30 seconds
- Increase timeout in `vercel.json`
- Optimize database queries
- Use efficient prompts for OpenAI

## 📈 Upgrading Components

### Upgrade MongoDB Tier
1. Go to MongoDB Atlas
2. Click cluster name
3. Go to "Cluster Settings"
4. Click "Change Tier"
5. Select new tier
6. Connection string remains the same

### Increase Function Timeout
Edit `vercel.json`:
```json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 60
    }
  }
}
```

## 🎯 Next Steps

After successful deployment:

1. **Custom Domain** (Optional)
   - Go to Vercel Project Settings
   - Add custom domain
   - Update DNS records

2. **CI/CD Pipeline** (Optional)
   - Set up automated testing
   - Add pre-deployment checks
   - Configure staging environment

3. **Monitoring** (Recommended)
   - Set up error tracking (Sentry, etc.)
   - Configure uptime monitoring
   - Set up email alerts

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Docs**: https://docs.mongodb.com
- **OpenAI Docs**: https://platform.openai.com/docs
- **GitHub Issues**: Create an issue in your repository

---

Happy deploying! 🎉
