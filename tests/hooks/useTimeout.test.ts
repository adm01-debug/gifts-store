import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTimeout } from '@/hooks/useTimeout';

describe('useTimeout', () => {
  it('should call callback after delay', () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    
    renderHook(() => useTimeout(callback, 1000));
    
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
    
    vi.restoreAllMocks();
  });
});
