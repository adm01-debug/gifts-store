import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';

describe('useDebouncedSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with empty search term', () => {
    const { result } = renderHook(() => useDebouncedSearch());
    
    expect(result.current.searchTerm).toBe('');
    expect(result.current.debouncedValue).toBe('');
  });

  it('should update search term immediately', () => {
    const { result } = renderHook(() => useDebouncedSearch());
    
    act(() => {
      result.current.setSearchTerm('test');
    });

    expect(result.current.searchTerm).toBe('test');
    expect(result.current.debouncedValue).toBe('');
  });

  it('should debounce the search value', async () => {
    const { result } = renderHook(() => useDebouncedSearch(500));
    
    act(() => {
      result.current.setSearchTerm('test');
    });

    expect(result.current.debouncedValue).toBe('');

    act(() => {
      vi.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current.debouncedValue).toBe('test');
    });
  });

  it('should clear search term', () => {
    const { result } = renderHook(() => useDebouncedSearch());
    
    act(() => {
      result.current.setSearchTerm('test');
      result.current.clearSearch();
    });

    expect(result.current.searchTerm).toBe('');
  });

  it('should handle rapid typing', async () => {
    const { result } = renderHook(() => useDebouncedSearch(300));
    
    act(() => {
      result.current.setSearchTerm('a');
    });
    vi.advanceTimersByTime(100);
    
    act(() => {
      result.current.setSearchTerm('ab');
    });
    vi.advanceTimersByTime(100);
    
    act(() => {
      result.current.setSearchTerm('abc');
    });
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(result.current.debouncedValue).toBe('abc');
    });
  });
});
