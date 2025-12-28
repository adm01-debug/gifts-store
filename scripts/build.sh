#!/bin/bash
set -e

echo "🔨 Building gifts-store..."

# Clean
rm -rf dist

# Type check
echo "🔍 Type checking..."
npm run type-check

# Lint
echo "✨ Linting..."
npm run lint

# Build
echo "📦 Building..."
npm run build

# Analyze bundle
if [ -f "bundle-analyzer.config.js" ]; then
  echo "📊 Analyzing bundle..."
  npm run analyze
fi

echo "✅ Build complete!"
