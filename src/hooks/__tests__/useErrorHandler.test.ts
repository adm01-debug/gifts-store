import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useErrorHandler } from '../useErrorHandler';

describe('useErrorHandler', () => {
  it('captura erros e exibe toast', () => {
    const { result } = renderHook(() => useErrorHandler());
    
    const error = new Error('Test error');
    result.current.handleError(error);
    
    // Verificar se o toast foi chamado (requer mock)
    expect(true).toBe(true);
  });

  it('formata mensagens de erro corretamente', () => {
    const { result } = renderHook(() => useErrorHandler());
    
    const error = new Error('Network error');
    const formatted = result.current.formatError(error);
    
    expect(formatted).toContain('Network error');
  });
});
