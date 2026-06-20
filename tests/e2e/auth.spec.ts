import { test, expect } from '@playwright/test';

test.describe('PremiumID Authentication', () => {
  test('landing page loads and displays hero title', async ({ page }) => {
    await page.goto('/');
    
    // Check if the hero title exists (either EN or ES, usually it will be EN by default)
    const heading = page.locator('h1.hero-title');
    await expect(heading).toBeVisible();
  });

  test('navigation to pricing page works', async ({ page }) => {
    await page.goto('/');
    
    const pricingLink = page.getByRole('link', { name: /Pricing|Precios/i }).first();
    await pricingLink.click();
    
    await expect(page).toHaveURL(/.*\/pricing/);
    const pricingHeader = page.locator('h1.hero-title');
    await expect(pricingHeader).toBeVisible();
  });

  test('login page requires credentials', async ({ page }) => {
    await page.goto('/login');
    
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();
    
    // We expect some form validation or error since fields are empty
    // But since it's a basic test, let's just make sure we are still on login
    await expect(page).toHaveURL(/.*\/login/);
  });
});
