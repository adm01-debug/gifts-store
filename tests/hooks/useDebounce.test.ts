import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDebounce } from '@/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'updated', delay: 500 });
    expect(result.current).toBe('initial');

    vi.advanceTimersByTime(500);

    await waitFor(() => {
      expect(result.current).toBe('updated');
    });
  });

  it('should cancel pending debounce on unmount', () => {
    const { result, unmount, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    rerender({ value: 'updated', delay: 500 });
    unmount();

    vi.advanceTimersByTime(500);
    expect(result.current).toBe('initial');
  });

  it('should handle multiple rapid changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'v1', delay: 300 },
      }
    );

    rerender({ value: 'v2', delay: 300 });
    vi.advanceTimersByTime(100);
    
    rerender({ value: 'v3', delay: 300 });
    vi.advanceTimersByTime(100);
    
    rerender({ value: 'v4', delay: 300 });
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(result.current).toBe('v4');
    });
  });

  it('should work with different data types', async () => {
    const { result: numberResult } = renderHook(() => useDebounce(42, 100));
    vi.advanceTimersByTime(100);
    expect(numberResult.current).toBe(42);

    const { result: boolResult } = renderHook(() => useDebounce(true, 100));
    vi.advanceTimersByTime(100);
    expect(boolResult.current).toBe(true);

    const obj = { name: 'test' };
    const { result: objResult } = renderHook(() => useDebounce(obj, 100));
    vi.advanceTimersByTime(100);
    expect(objResult.current).toEqual(obj);
  });
});
