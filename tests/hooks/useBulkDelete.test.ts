import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBulkDelete } from '@/hooks/useBulkDelete';

describe('useBulkDelete', () => {
  it('should delete items in bulk', async () => {
    const deleteFn = vi.fn().mockResolvedValue({ success: true });
    const { result } = renderHook(() => useBulkDelete(deleteFn));

    await act(async () => {
      await result.current.deleteMany(['id-1', 'id-2']);
    });

    expect(deleteFn).toHaveBeenCalledTimes(2);
    expect(result.current.isDeleting).toBe(false);
  });

  it('should handle delete errors', async () => {
    const deleteFn = vi.fn().mockRejectedValue(new Error('Delete failed'));
    const { result } = renderHook(() => useBulkDelete(deleteFn));

    await act(async () => {
      await result.current.deleteMany(['id-1']);
    });

    expect(result.current.errors).toHaveLength(1);
  });
});
