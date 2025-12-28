import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import * as Sentry from '@sentry/react';

vi.mock('@sentry/react', () => ({
  captureException: vi.fn(),
}));

describe('useErrorHandler', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with no error', () => {
    const { result } = renderHook(() => useErrorHandler());
    
    expect(result.current.error).toBeNull();
    expect(result.current.hasError).toBe(false);
  });

  it('should handle error and send to Sentry', () => {
    const { result } = renderHook(() => useErrorHandler());
    const testError = new Error('Test error');

    act(() => {
      result.current.handleError(testError);
    });

    expect(result.current.error).toBe(testError);
    expect(result.current.hasError).toBe(true);
    expect(Sentry.captureException).toHaveBeenCalledWith(testError);
  });

  it('should clear error', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError(new Error('Test'));
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.hasError).toBe(false);
  });

  it('should handle error with context', () => {
    const { result } = renderHook(() => useErrorHandler());
    const context = { userId: '123', action: 'submit' };

    act(() => {
      result.current.handleError(new Error('Test'), context);
    });

    expect(Sentry.captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        contexts: { custom: context },
      })
    );
  });

  it('should handle multiple errors', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError(new Error('Error 1'));
    });
    expect(result.current.error?.message).toBe('Error 1');

    act(() => {
      result.current.handleError(new Error('Error 2'));
    });
    expect(result.current.error?.message).toBe('Error 2');
    expect(Sentry.captureException).toHaveBeenCalledTimes(2);
  });
});
