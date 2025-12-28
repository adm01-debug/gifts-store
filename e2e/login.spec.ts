import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'ti@promobrindes.com.br');
    await page.fill('input[name="password"]', 'senha123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Bem-vindo')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrong');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Credenciais inválidas')).toBeVisible();
  });
});
