import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyPress } from '@/hooks/useKeyPress';

describe('useKeyPress', () => {
  it('should detect key press', () => {
    const { result } = renderHook(() => useKeyPress('Enter'));
    
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(result.current).toBe(true);
  });
});
