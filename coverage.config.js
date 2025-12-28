export default {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src/**/*.stories.{ts,tsx}',
    '!src/vite-env.d.ts',
    '!src/main.tsx'
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/components/': {
      branches: 70,
      functions: 75,
      lines: 75,
      statements: 75
    },
    './src/lib/': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    },
    './src/services/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  coverageReporters: ['html', 'lcov', 'text', 'text-summary', 'json', 'clover'],
  coverageDirectory: './coverage'
};
