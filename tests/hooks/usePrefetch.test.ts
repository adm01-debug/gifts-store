import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePrefetch } from '@/hooks/usePrefetch';

describe('usePrefetch', () => {
  it('should prefetch data on mount', async () => {
    const prefetchFn = vi.fn().mockResolvedValue({ data: 'test' });
    const { result } = renderHook(() => usePrefetch(prefetchFn));
    
    expect(prefetchFn).toHaveBeenCalled();
    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  it('should cache prefetched data', async () => {
    const prefetchFn = vi.fn().mockResolvedValue({ data: 'cached' });
    const { result } = renderHook(() => usePrefetch(prefetchFn, { cacheKey: 'test-key' }));
    
    await vi.waitFor(() => expect(result.current.data).toEqual({ data: 'cached' }));
    expect(prefetchFn).toHaveBeenCalledTimes(1);
  });
});
