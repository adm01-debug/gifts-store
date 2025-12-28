import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useInterval } from '@/hooks/useInterval';

describe('useInterval', () => {
  it('should call callback at interval', () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    
    renderHook(() => useInterval(callback, 1000));
    
    vi.advanceTimersByTime(3000);
    expect(callback).toHaveBeenCalledTimes(3);
    
    vi.restoreAllMocks();
  });
});
