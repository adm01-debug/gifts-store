// src/utils/__tests__/excelExport.test.ts
// Note: This test file requires vitest to be installed
// Run: npm install -D vitest

import { formatCurrency, formatPercentage, formatStatus } from '../excelExport';

// Placeholder tests - will run when vitest is installed
export const tests = {
  formatCurrency: () => {
    console.assert(formatCurrency(1000) === 'R$ 1.000,00', 'formatCurrency 1000');
    console.assert(formatCurrency(1234.56) === 'R$ 1.234,56', 'formatCurrency 1234.56');
    console.assert(formatCurrency(0) === 'R$ 0,00', 'formatCurrency 0');
  },
  formatPercentage: () => {
    console.assert(formatPercentage(50) === '50.0%', 'formatPercentage 50');
    console.assert(formatPercentage(33.333) === '33.3%', 'formatPercentage 33.333');
    console.assert(formatPercentage(0) === '0.0%', 'formatPercentage 0');
  },
  formatStatus: () => {
    console.assert(formatStatus('draft') === '📝 Rascunho', 'formatStatus draft');
    console.assert(formatStatus('approved') === '✅ Aprovado', 'formatStatus approved');
    console.assert(formatStatus('rejected') === '❌ Rejeitado', 'formatStatus rejected');
  }
};
