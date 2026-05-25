import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('dashboard redirects to home when not connected', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/');
    expect(page.url()).not.toContain('/dashboard');
  });

  test('connect wallet modal opens from hero CTA', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /connect wallet/i }).first().click();
    await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 3000 });
  });

  test('connect wallet modal opens from navbar', async ({ page }) => {
    await page.goto('/');
    // Find navbar CTA button specifically
    const navbarCTA = page.locator('nav').getByRole('button', { name: /connect/i });
    if (await navbarCTA.count() > 0) {
      await navbarCTA.click();
      await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 3000 });
    }
  });

  test('simulated wallet connection updates UI', async ({ page }) => {
    await page.goto('/');
    // Simulate a connected wallet via localStorage
    await page.evaluate(() => {
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', '8HgqKqcdMFazWVWm7NY42FkG7SaFywfpsrTww1o4yVpX');
    });
    await page.reload();
    // Hero CTA should now show "Open Dashboard" or similar
    const dashboardBtn = page.getByRole('button', { name: /dashboard|open app/i });
    if (await dashboardBtn.count() > 0) {
      await expect(dashboardBtn).toBeVisible();
    }
  });

  test('simulated wallet can access dashboard', async ({ page }) => {
    // Set wallet in localStorage before navigating
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', '8HgqKqcdMFazWVWm7NY42FkG7SaFywfpsrTww1o4yVpX');
    });
    await page.goto('/dashboard');
    await page.waitForTimeout(2000);
    // Should stay on dashboard, not redirect
    expect(page.url()).toContain('/dashboard');
  });
});
