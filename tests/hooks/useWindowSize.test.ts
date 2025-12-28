import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useWindowSize } from '@/hooks/useWindowSize';

describe('useWindowSize', () => {
  it('should return window dimensions', () => {
    const { result } = renderHook(() => useWindowSize());
    
    expect(result.current.width).toBe(window.innerWidth);
    expect(result.current.height).toBe(window.innerHeight);
  });
});
