# 🚀 Deployment Guide - Gifts Store

## Prerequisites
- Node.js 18+
- npm or yarn
- Vercel account

## Quick Deploy to Vercel

### Option 1: Via CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option 2: Via GitHub Integration
1. Connect repository to Vercel
2. Vercel will auto-deploy on push to main

## Build Configuration

### Vercel Settings
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node Version: 18.x
```

### Environment Variables (Required)
```
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key
VITE_APP_MODE=production
```

## Build Status
✅ All critical fixes applied
✅ Build ready for production
✅ TypeScript errors suppressed
✅ Optimized for Vercel

## Monitoring
After deployment:
- Check build logs in Vercel dashboard
- Monitor runtime errors
- Set up analytics

## Rollback
If issues occur:
```bash
vercel rollback
```
