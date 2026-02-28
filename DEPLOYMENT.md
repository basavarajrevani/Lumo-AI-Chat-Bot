# 🚀 Deployment Guide for Lumo.AI

This guide covers various deployment options for Lumo.AI.

## 📋 Prerequisites

- Node.js 18+
- Google Gemini API key
- Git repository access

## 🌐 Deployment Options

### 1. Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

#### Steps:
1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Import your repository
   - Configure environment variables

3. **Environment Variables**
   Add these in Vercel dashboard:
   ```
   GOOGLE_GEMINI_API_KEY=your_api_key_here
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

4. **Deploy**
   - Vercel will automatically deploy
   - Get your live URL

### 2. Netlify

#### Steps:
1. **Build Command**: `npm run build`
2. **Publish Directory**: `.next`
3. **Environment Variables**:
   ```
   GOOGLE_GEMINI_API_KEY=your_api_key_here
   NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
   ```

### 3. Railway

#### Steps:
1. **Connect GitHub repository**
2. **Set environment variables**
3. **Deploy automatically**

### 4. Docker Deployment

#### Dockerfile:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Build and Run:
```bash
docker build -t lumo-ai .
docker run -p 3000:3000 -e GOOGLE_GEMINI_API_KEY=your_key lumo-ai
```

## 🔧 Environment Configuration

### Required Variables:
- `GEMINI_API_KEY`: Your Gemini API key from OpenRouter
- `NEXT_PUBLIC_APP_URL`: Your app's URL

### Optional Variables:
- `NODE_ENV`: production/development
- `PORT`: Server port (default: 3000)

## 🔒 Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **Environment Variables**: Use platform-specific env var management
3. **HTTPS**: Ensure your deployment uses HTTPS
4. **CORS**: Configure CORS if needed for API routes

## 📊 Performance Optimization

1. **Build Optimization**:
   ```bash
   npm run build
   npm run start
   ```

2. **Static Generation**: Pages are statically generated where possible

3. **Image Optimization**: Next.js automatically optimizes images

## 🔍 Monitoring

1. **Error Tracking**: Consider adding Sentry or similar
2. **Analytics**: Add Google Analytics or similar
3. **Performance**: Monitor Core Web Vitals

## 🚨 Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check Node.js version (18+)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **API Issues**:
   - Verify Gemini API key is correct
   - Check API rate limits
   - Ensure environment variables are set

3. **Deployment Issues**:
   - Check build logs
   - Verify environment variables
   - Check platform-specific requirements

## 📞 Support

If you encounter issues:
- Check the deployment platform's documentation
- Review error logs
- Contact: basavarajrevani@gmail.com

---

**Happy Deploying! 🚀**
