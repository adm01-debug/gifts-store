import { describe, it, expect } from 'vitest';
import { formatDateTime, formatDate } from '../date-utils';

describe('date-utils', () => {
  describe('formatDateTime', () => {
    it('formata data e hora corretamente em pt-BR', () => {
      const date = new Date('2025-12-27T15:30:00');
      const formatted = formatDateTime(date);
      
      expect(formatted).toContain('27/12/2025');
      expect(formatted).toContain('15:30');
    });

    it('lida com data null/undefined', () => {
      expect(() => formatDateTime(null as any)).not.toThrow();
    });
  });

  describe('formatDate', () => {
    it('formata apenas a data sem hora', () => {
      const date = new Date('2025-12-27T15:30:00');
      const formatted = formatDate(date);
      
      expect(formatted).toContain('27/12/2025');
      expect(formatted).not.toContain('15:30');
    });

    it('usa formato brasileiro', () => {
      const date = new Date('2025-01-05T00:00:00');
      const formatted = formatDate(date);
      
      expect(formatted).toBe('05/01/2025');
    });
  });
});
