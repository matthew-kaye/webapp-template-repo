import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('shows Hello World hero copy', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /hello world/i })).toBeVisible();
  });
});
