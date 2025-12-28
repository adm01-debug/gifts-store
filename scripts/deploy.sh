#!/bin/bash
set -e

echo "🚀 Deploying gifts-store..."

# Build
./scripts/build.sh

# Deploy to Vercel
echo "📤 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 URL: https://gifts-store.vercel.app"
