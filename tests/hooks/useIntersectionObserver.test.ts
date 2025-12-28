import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

describe('useIntersectionObserver', () => {
  it('should observe element intersection', () => {
    const mockObserver = vi.fn();
    global.IntersectionObserver = class {
      constructor(callback) { this.callback = callback; }
      observe() { mockObserver(); }
      disconnect() {}
    } as any;
    
    const ref = { current: document.createElement('div') };
    renderHook(() => useIntersectionObserver(ref));
    
    expect(mockObserver).toHaveBeenCalled();
  });
});
