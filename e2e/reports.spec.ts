import { test, expect } from '@playwright/test';

test.describe('Reports', () => {
  test('should generate sales report', async ({ page }) => {
    await page.goto('/reports');
    await page.click('[data-testid="generate-report"]');
    await expect(page.locator('[data-testid="report-table"]')).toBeVisible();
  });
});
