import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

describe('useMediaQuery', () => {
  it('should detect mobile screen', () => {
    Object.defineProperty(window, 'matchMedia', {
      value: () => ({ matches: true, media: '(max-width: 768px)' })
    });
    
    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));
    expect(result.current).toBe(true);
  });
});
