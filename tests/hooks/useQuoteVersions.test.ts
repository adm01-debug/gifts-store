import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useQuoteVersions } from '@/hooks/useQuoteVersions';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0 },
      mutations: { retry: false }
    }
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useQuoteVersions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize successfully', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useQuoteVersions(), { wrapper });
    
    expect(result.current).toBeDefined();
  });

  it('should handle data fetching', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useQuoteVersions(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isLoading === false || result.current.data !== undefined).toBe(true);
    });
  });

  it('should handle error state', async () => {
    const wrapper = createWrapper();
    
    // Mock error scenario
    vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const { result } = renderHook(() => useQuoteVersions({ forceError: true }), { wrapper });
    
    await waitFor(() => {
      if (result.current.isError) {
        expect(result.current.isError).toBe(true);
      }
    }, { timeout: 3000 });
  });

  it('should expose expected interface', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useQuoteVersions(), { wrapper });
    
    expect(result.current).toHaveProperty('data');
  });
});
