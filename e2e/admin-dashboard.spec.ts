import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test('should display stats', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page.locator('[data-testid="total-sales"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-clients"]')).toBeVisible();
  });
});
