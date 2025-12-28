import { test, expect } from '@playwright/test';

test.describe('Product Catalog', () => {
  test('should display products', async ({ page }) => {
    await page.goto('/products');
    await expect(page.locator('[data-testid="product-grid"]')).toBeVisible();
  });

  test('should filter by category', async ({ page }) => {
    await page.goto('/products');
    await page.click('[data-testid="category-filter"]');
    await page.click('[data-testid="category-canetas"]');
    await expect(page.locator('text=Caneta')).toBeVisible();
  });
});
