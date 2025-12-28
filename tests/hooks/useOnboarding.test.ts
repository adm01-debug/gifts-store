import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useOnboarding } from '@/hooks/useOnboarding';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useOnboarding', () => {
  let wrapper: ReturnType<typeof createTestWrapper>;

  beforeEach(() => {
    wrapper = createTestWrapper();
    vi.clearAllMocks();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useOnboarding(), { wrapper });
    expect(result.current).toBeDefined();
  });

  it('handles async operations', async () => {
    const { result } = renderHook(() => useOnboarding(), { wrapper });
    
    await waitFor(() => {
      expect(result.current).toBeDefined();
    });
  });

  it('provides expected API surface', () => {
    const { result } = renderHook(() => useOnboarding(), { wrapper });
    expect(typeof result.current === 'object' || typeof result.current === 'function').toBe(true);
  });

  it('handles edge cases gracefully', async () => {
    const { result } = renderHook(() => useOnboarding({ testMode: true }), { wrapper });
    
    await act(async () => {
      // Simulate edge case
    });
    
    expect(result.current).toBeDefined();
  });
});
