#!/bin/bash
set -e

echo "🧪 Running tests..."

# Unit tests
echo "🔬 Running unit tests..."
npm test -- --coverage

# E2E tests
if command -v playwright &> /dev/null; then
  echo "🎭 Running E2E tests..."
  npm run test:e2e
fi

echo "✅ All tests passed!"
