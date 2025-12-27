// src/utils/__tests__/excelExport.test.ts

import { describe, it, expect, vi } from 'vitest';
import { formatCurrency, formatPercentage, formatStatus } from '../excelExport';

describe('excelExport utils', () => {
  describe('formatCurrency', () => {
    it('formata valores monetários corretamente', () => {
      expect(formatCurrency(1000)).toBe('R$ 1.000,00');
      expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
      expect(formatCurrency(0)).toBe('R$ 0,00');
    });
  });

  describe('formatPercentage', () => {
    it('formata porcentagens corretamente', () => {
      expect(formatPercentage(50)).toBe('50.0%');
      expect(formatPercentage(33.333)).toBe('33.3%');
      expect(formatPercentage(0)).toBe('0.0%');
    });
  });

  describe('formatStatus', () => {
    it('retorna status formatado com emoji', () => {
      expect(formatStatus('draft')).toBe('📝 Rascunho');
      expect(formatStatus('approved')).toBe('✅ Aprovado');
      expect(formatStatus('rejected')).toBe('❌ Rejeitado');
    });

    it('retorna status original se não mapeado', () => {
      expect(formatStatus('unknown')).toBe('unknown');
    });
  });
});
