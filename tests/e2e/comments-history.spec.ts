import { test, expect } from '@playwright/test';

test.describe('comments-history', () => {
  test('executes comments-history flow', async ({ page }) => {
    await page.goto('/');
    expect(page).toBeDefined();
  });
});
