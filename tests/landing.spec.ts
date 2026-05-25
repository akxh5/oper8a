import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('loads with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/oper8a/i);
  });

  test('navbar is visible and has correct links', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.getByText('Features')).toBeVisible();
    await expect(page.getByText('Security')).toBeVisible();
  });

  test('hero section renders with headline', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('File Integrity')).toBeVisible();
    await expect(page.getByText('On-Chain')).toBeVisible();
  });

  test('Connect Wallet button is visible and clickable', async ({ page }) => {
    await page.goto('/');
    const connectBtn = page.getByRole('button', { name: /connect wallet/i }).first();
    await expect(connectBtn).toBeVisible();
    await connectBtn.click();
    // Modal should appear
    await expect(page.getByText(/connect your wallet/i)).toBeVisible({ timeout: 3000 });
  });

  test('wallet modal shows Phantom option', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /connect wallet/i }).first().click();
    await expect(page.getByText(/phantom/i)).toBeVisible({ timeout: 3000 });
  });

  test('wallet modal closes when clicking outside', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /connect wallet/i }).first().click();
    await page.keyboard.press('Escape');
    await expect(page.getByText(/connect your wallet/i)).not.toBeVisible({ timeout: 3000 });
  });

  test('features section is visible', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 500));
    await expect(page.getByText(/verification engine/i)).toBeVisible({ timeout: 5000 });
  });

  test('stats section renders numbers', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 1000));
    await expect(page.getByText('400ms')).toBeVisible({ timeout: 5000 });
  });

  test('testimonials section renders', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await expect(page.getByText(/Sarah K/i)).toBeVisible({ timeout: 5000 });
  });

  test('footer wordmark renders', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByText(/2025.*oper8a/i)).toBeVisible({ timeout: 5000 });
  });

  test('no horizontal scroll on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
  });

  test('mobile hamburger menu works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const hamburger = page.locator('button[aria-label*="menu"], button svg').first();
    await hamburger.click();
    await expect(page.getByText('Features').filter({ visible: true })).toBeVisible({ timeout: 3000 });
  });
});
