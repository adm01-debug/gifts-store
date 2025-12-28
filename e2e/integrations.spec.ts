import { test, expect } from '@playwright/test';

test.describe('Integrations', () => {
  test('should sync with Bitrix24', async ({ page }) => {
    await page.goto('/settings/integrations');
    await page.click('[data-testid="sync-bitrix"]');
    await expect(page.locator('text=Sincronizado')).toBeVisible();
  });
});
