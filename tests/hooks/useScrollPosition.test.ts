import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useScrollPosition } from '@/hooks/useScrollPosition';

describe('useScrollPosition', () => {
  it('should track scroll position', () => {
    const { result } = renderHook(() => useScrollPosition());
    
    expect(result.current.x).toBe(window.scrollX);
    expect(result.current.y).toBe(window.scrollY);
  });
});
