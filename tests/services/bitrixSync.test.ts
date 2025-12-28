import { describe, it, expect, vi } from 'vitest';
import { bitrixSync } from '@/utils/bitrixSync';

describe('bitrixSync Service', () => {
  it('initializes correctly', () => {
    expect(bitrixSync).toBeDefined();
  });

  it('handles operations', async () => {
    const result = await bitrixSync({ test: true });
    expect(result).toBeDefined();
  });

  it('handles errors gracefully', async () => {
    await expect(bitrixSync({ forceError: true })).rejects.toThrow();
  });
});
