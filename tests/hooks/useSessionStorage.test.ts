import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSessionStorage } from '@/hooks/useSessionStorage';

describe('useSessionStorage', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should store value in sessionStorage', () => {
    const { result } = renderHook(() => useSessionStorage('testKey', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(sessionStorage.getItem('testKey')).toBe(JSON.stringify('updated'));
  });

  it('should load value from sessionStorage', () => {
    sessionStorage.setItem('testKey', JSON.stringify('stored'));
    const { result } = renderHook(() => useSessionStorage('testKey', 'initial'));

    expect(result.current[0]).toBe('stored');
  });
});
