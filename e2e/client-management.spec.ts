import { test, expect } from '@playwright/test';

test.describe('Client Management', () => {
  test('should create new client', async ({ page }) => {
    await page.goto('/clients');
    await page.click('[data-testid="new-client-button"]');
    await page.fill('[name="name"]', 'Empresa XYZ');
    await page.fill('[name="email"]', 'xyz@example.com');
    await page.click('[data-testid="save-client"]');
    await expect(page.locator('text=Cliente criado')).toBeVisible();
  });

  test('should search clients', async ({ page }) => {
    await page.goto('/clients');
    await page.fill('[data-testid="search-input"]', 'XYZ');
    await expect(page.locator('text=XYZ')).toBeVisible();
  });
});
