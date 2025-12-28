import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('should complete checkout', async ({ page }) => {
    await page.goto('/cart');
    await page.fill('[name="payment_method"]', 'credit_card');
    await page.click('[data-testid="confirm-order"]');
    await expect(page.locator('text=Pedido confirmado')).toBeVisible();
  });
});
