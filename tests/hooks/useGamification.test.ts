import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGamification } from '@/hooks/useGamification';

describe('useGamification', () => {
  it('should award points for actions', () => {
    const { result } = renderHook(() => useGamification());

    act(() => {
      result.current.addPoints(100);
    });

    expect(result.current.totalPoints).toBe(100);
  });

  it('should level up after threshold', () => {
    const { result } = renderHook(() => useGamification());

    act(() => {
      result.current.addPoints(1000);
    });

    expect(result.current.level).toBeGreaterThan(1);
  });
});
