import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSalesGoals } from '@/hooks/useSalesGoals';

describe('useSalesGoals', () => {
  it('should calculate goal progress', () => {
    const { result } = renderHook(() => useSalesGoals({ target: 10000 }));

    act(() => {
      result.current.addSale(5000);
    });

    expect(result.current.progress).toBe(50);
    expect(result.current.remaining).toBe(5000);
  });

  it('should mark as achieved when goal is met', () => {
    const { result } = renderHook(() => useSalesGoals({ target: 10000 }));

    act(() => {
      result.current.addSale(10000);
    });

    expect(result.current.achieved).toBe(true);
  });
});
