import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePrevious } from '@/hooks/usePrevious';

describe('usePrevious', () => {
  it('should store previous value', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 'initial' }
    });
    
    expect(result.current).toBeUndefined();
    
    rerender({ value: 'updated' });
    expect(result.current).toBe('initial');
  });
});
