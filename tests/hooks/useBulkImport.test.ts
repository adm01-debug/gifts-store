import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBulkImport } from '@/hooks/useBulkImport';

describe('useBulkImport', () => {
  it('should parse CSV data', async () => {
    const { result } = renderHook(() => useBulkImport());
    const csv = 'name,email\nJohn,john@example.com';

    await act(async () => {
      await result.current.parseCSV(csv);
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0]).toEqual({ name: 'John', email: 'john@example.com' });
  });

  it('should validate imported data', async () => {
    const { result } = renderHook(() => useBulkImport({ validate: true }));
    const csv = 'name,email\nJohn,invalid-email';

    await act(async () => {
      await result.current.parseCSV(csv);
    });

    expect(result.current.errors).toHaveLength(1);
  });
});
