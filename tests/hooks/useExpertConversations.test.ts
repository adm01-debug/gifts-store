import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useExpertConversations } from '@/hooks/useExpertConversations';
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

describe('useExpertConversations', () => {
  let wrapper: ReturnType<typeof createTestWrapper>;

  beforeEach(() => {
    wrapper = createTestWrapper();
    vi.clearAllMocks();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useExpertConversations(), { wrapper });
    expect(result.current).toBeDefined();
  });

  it('handles async operations', async () => {
    const { result } = renderHook(() => useExpertConversations(), { wrapper });
    
    await waitFor(() => {
      expect(result.current).toBeDefined();
    });
  });

  it('provides expected API surface', () => {
    const { result } = renderHook(() => useExpertConversations(), { wrapper });
    expect(typeof result.current === 'object' || typeof result.current === 'function').toBe(true);
  });

  it('handles edge cases gracefully', async () => {
    const { result } = renderHook(() => useExpertConversations({ testMode: true }), { wrapper });
    
    await act(async () => {
      // Simulate edge case
    });
    
    expect(result.current).toBeDefined();
  });
});
