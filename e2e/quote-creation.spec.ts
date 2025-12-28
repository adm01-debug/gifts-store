import { test, expect } from '@playwright/test';

test.describe('Quote Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="login-button"]');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should create new quote', async ({ page }) => {
    await page.click('[data-testid="nav-quotes"]');
    await page.click('[data-testid="create-quote-button"]');
    await page.fill('[name="client"]', 'Cliente Teste LTDA');
    await page.fill('[name="contact"]', 'João Silva');
    await page.fill('[name="email"]', 'joao@teste.com');
    await page.click('[data-testid="submit-quote"]');
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/quotes/new');
    await page.click('[data-testid="submit-quote"]');
    await expect(page.locator('text=Cliente é obrigatório')).toBeVisible();
  });
});
