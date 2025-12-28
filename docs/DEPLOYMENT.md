# Deployment Guide

## Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 7+

## Steps

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
```

3. Run migrations:
```bash
npx supabase db push
```

4. Build:
```bash
npm run build
```

5. Deploy:
```bash
npm run deploy
```

## Production Checklist
- [ ] Environment variables configured
- [ ] Database migrated
- [ ] SSL certificates installed
- [ ] CDN configured
- [ ] Monitoring enabled
