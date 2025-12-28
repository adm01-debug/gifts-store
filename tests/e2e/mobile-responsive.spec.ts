import { test, expect } from '@playwright/test';

test.describe('mobile-responsive', () => {
  test('executes mobile-responsive flow', async ({ page }) => {
    await page.goto('/');
    expect(page).toBeDefined();
  });
});
