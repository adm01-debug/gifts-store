import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNotifications } from '@/hooks/useNotifications';

describe('useNotifications', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with empty notifications', () => {
    const { result } = renderHook(() => useNotifications());
    expect(result.current.notifications).toEqual([]);
  });

  it('should add notification', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification({
        type: 'success',
        message: 'Test notification',
      });
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0]).toMatchObject({
      type: 'success',
      message: 'Test notification',
    });
    expect(result.current.notifications[0].id).toBeDefined();
  });

  it('should remove notification', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification({
        type: 'info',
        message: 'Test',
      });
    });

    const id = result.current.notifications[0].id;

    act(() => {
      result.current.removeNotification(id);
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it('should auto-remove notification after timeout', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification({
        type: 'success',
        message: 'Auto remove',
        duration: 3000,
      });
    });

    expect(result.current.notifications).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it('should support different notification types', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification({ type: 'success', message: 'Success' });
      result.current.addNotification({ type: 'error', message: 'Error' });
      result.current.addNotification({ type: 'warning', message: 'Warning' });
      result.current.addNotification({ type: 'info', message: 'Info' });
    });

    expect(result.current.notifications).toHaveLength(4);
    expect(result.current.notifications.map(n => n.type)).toEqual([
      'success',
      'error',
      'warning',
      'info',
    ]);
  });

  it('should handle multiple notifications with different durations', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification({ type: 'info', message: 'Short', duration: 1000 });
      result.current.addNotification({ type: 'success', message: 'Long', duration: 5000 });
    });

    expect(result.current.notifications).toHaveLength(2);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].message).toBe('Long');

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(result.current.notifications).toHaveLength(0);
  });
});
