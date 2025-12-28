import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToggle } from '@/hooks/useToggle';

describe('useToggle', () => {
  it('should toggle boolean value', () => {
    const { result } = renderHook(() => useToggle(false));
    
    expect(result.current[0]).toBe(false);
    
    act(() => {
      result.current[1]();
    });
    
    expect(result.current[0]).toBe(true);
  });
  
  it('should set specific value', () => {
    const { result } = renderHook(() => useToggle());
    
    act(() => {
      result.current[1](true);
    });
    
    expect(result.current[0]).toBe(true);
  });
});
