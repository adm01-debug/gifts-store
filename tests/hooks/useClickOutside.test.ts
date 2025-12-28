import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useRef } from 'react';

describe('useClickOutside', () => {
  it('should call handler on outside click', () => {
    const handler = vi.fn();
    const ref = { current: document.createElement('div') };
    
    renderHook(() => useClickOutside(ref, handler));
    
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(handler).toHaveBeenCalled();
  });
});
