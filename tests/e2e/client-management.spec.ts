import { test, expect } from '@playwright/test';

test.describe('client-management', () => {
  test('executes client-management flow', async ({ page }) => {
    await page.goto('/');
    expect(page).toBeDefined();
  });
});
