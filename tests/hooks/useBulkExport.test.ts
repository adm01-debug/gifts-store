import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBulkExport } from '@/hooks/useBulkExport';

describe('useBulkExport', () => {
  it('should export to CSV', async () => {
    const { result } = renderHook(() => useBulkExport());
    const data = [{ id: 1, name: 'Test' }];

    await act(async () => {
      await result.current.exportToCSV(data);
    });

    expect(result.current.isExporting).toBe(false);
  });

  it('should export to Excel', async () => {
    const { result } = renderHook(() => useBulkExport());
    const data = [{ id: 1, name: 'Test' }];

    await act(async () => {
      await result.current.exportToExcel(data);
    });

    expect(result.current.isExporting).toBe(false);
  });
});
