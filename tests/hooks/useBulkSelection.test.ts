import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBulkSelection } from '@/hooks/useBulkSelection';

describe('useBulkSelection', () => {
  it('should select items', () => {
    const { result } = renderHook(() => useBulkSelection());

    act(() => {
      result.current.select('item-1');
      result.current.select('item-2');
    });

    expect(result.current.selected).toEqual(['item-1', 'item-2']);
  });

  it('should select all items', () => {
    const items = ['item-1', 'item-2', 'item-3'];
    const { result } = renderHook(() => useBulkSelection());

    act(() => {
      result.current.selectAll(items);
    });

    expect(result.current.selected).toEqual(items);
  });

  it('should clear selection', () => {
    const { result } = renderHook(() => useBulkSelection());

    act(() => {
      result.current.select('item-1');
      result.current.clearSelection();
    });

    expect(result.current.selected).toEqual([]);
  });
});
