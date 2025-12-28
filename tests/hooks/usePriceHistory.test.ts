import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePriceHistory } from '@/hooks/usePriceHistory';

describe('usePriceHistory', () => {
  it('should track price changes', () => {
    const { result } = renderHook(() => usePriceHistory());

    act(() => {
      result.current.addPrice({ price: 100, date: new Date() });
      result.current.addPrice({ price: 120, date: new Date() });
    });

    expect(result.current.history).toHaveLength(2);
    expect(result.current.history[1].price).toBe(120);
  });

  it('should calculate price variation', () => {
    const { result } = renderHook(() => usePriceHistory());

    act(() => {
      result.current.addPrice({ price: 100, date: new Date() });
      result.current.addPrice({ price: 120, date: new Date() });
    });

    expect(result.current.variation).toBe(20);
  });
});
