import { test, expect } from '@playwright/test';

test.describe('Product Search', () => {
  test('should search and filter products', async ({ page }) => {
    await page.goto('/products');
    
    await page.fill('input[placeholder*="Buscar"]', 'caneta');
    await expect(page.locator('text=Caneta')).toBeVisible();
    
    await page.click('button:has-text("Filtrar")');
    await page.selectOption('select[name="category"]', 'Escritório');
    
    const products = page.locator('[data-testid="product-card"]');
    await expect(products).toHaveCountGreaterThan(0);
  });
});
