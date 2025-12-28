import { test, expect } from '@playwright/test';

test.describe('Bulk Operations', () => {
  test('should delete multiple items', async ({ page }) => {
    await page.goto('/products');
    await page.click('[data-testid="select-all"]');
    await page.click('[data-testid="bulk-delete"]');
    await expect(page.locator('text=deletados')).toBeVisible();
  });
});
