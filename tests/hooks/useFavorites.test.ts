import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFavorites } from '@/hooks/useFavorites';

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty favorites', () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites).toEqual([]);
  });

  it('should add item to favorites', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.addFavorite('item-1');
    });

    expect(result.current.favorites).toContain('item-1');
    expect(result.current.isFavorite('item-1')).toBe(true);
  });

  it('should remove item from favorites', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.addFavorite('item-1');
      result.current.removeFavorite('item-1');
    });

    expect(result.current.favorites).not.toContain('item-1');
    expect(result.current.isFavorite('item-1')).toBe(false);
  });

  it('should toggle favorite', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite('item-1');
    });
    expect(result.current.isFavorite('item-1')).toBe(true);

    act(() => {
      result.current.toggleFavorite('item-1');
    });
    expect(result.current.isFavorite('item-1')).toBe(false);
  });

  it('should persist favorites in localStorage', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.addFavorite('item-1');
      result.current.addFavorite('item-2');
    });

    const stored = JSON.parse(localStorage.getItem('favorites') || '[]');
    expect(stored).toEqual(['item-1', 'item-2']);
  });

  it('should load favorites from localStorage', () => {
    localStorage.setItem('favorites', JSON.stringify(['item-1', 'item-2']));

    const { result } = renderHook(() => useFavorites());

    expect(result.current.favorites).toEqual(['item-1', 'item-2']);
  });

  it('should clear all favorites', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.addFavorite('item-1');
      result.current.addFavorite('item-2');
      result.current.clearFavorites();
    });

    expect(result.current.favorites).toEqual([]);
  });

  it('should not add duplicate favorites', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.addFavorite('item-1');
      result.current.addFavorite('item-1');
    });

    expect(result.current.favorites).toEqual(['item-1']);
  });
});
