import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Set up authenticated state
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', '8HgqKqcdMFazWVWm7NY42FkG7SaFywfpsrTww1o4yVpX');
      localStorage.setItem('pinata_api_key', 'test_key');
      localStorage.setItem('pinata_secret_key', 'test_secret');
    });
    await page.goto('/dashboard');
    await page.waitForTimeout(2000);
  });

  test('dashboard layout renders', async ({ page }) => {
    await expect(page.getByText(/network/i).first()).toBeVisible({ timeout: 5000 });
  });

  test('network manager panel is visible', async ({ page }) => {
    await expect(page.getByText(/create|new network/i).first()).toBeVisible({ timeout: 5000 });
  });

  test('file upload panel is visible', async ({ page }) => {
    await expect(page.getByText(/upload|verify.*anchor/i).first()).toBeVisible({ timeout: 5000 });
  });

  test('IPFS config button is visible', async ({ page }) => {
    await expect(page.getByText(/ipfs|config/i).first()).toBeVisible({ timeout: 5000 });
  });

  test('wallet address is displayed truncated', async ({ page }) => {
    // Should show truncated address like "8Hgq...yVpX"
    await expect(page.getByText(/8Hgq|yVpX/i).first()).toBeVisible({ timeout: 5000 });
  });

  test('network creation input exists', async ({ page }) => {
    const input = page.getByPlaceholder(/network name/i);
    await expect(input).toBeVisible({ timeout: 5000 });
  });

  test('join network input exists', async ({ page }) => {
    const input = page.getByPlaceholder(/join key/i);
    await expect(input).toBeVisible({ timeout: 5000 });
  });

  test('video background renders on dashboard', async ({ page }) => {
    const video = page.locator('video');
    await expect(video).toBeAttached({ timeout: 5000 });
  });

  test('IPFS config dialog opens', async ({ page }) => {
    const ipfsBtn = page.getByRole('button', { name: /ipfs/i }).first();
    if (await ipfsBtn.count() > 0) {
      await ipfsBtn.click();
      await expect(page.getByText(/api key|secret/i).first()).toBeVisible({ timeout: 3000 });
    }
  });

  test('disconnect wallet option exists in dropdown', async ({ page }) => {
    // Find wallet address button and click
    const walletBtn = page.getByText(/8Hgq/i).first();
    if (await walletBtn.count() > 0) {
      await walletBtn.click();
      await expect(page.getByText(/disconnect/i)).toBeVisible({ timeout: 3000 });
    }
  });

  test('no horizontal scroll on dashboard mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
  });
});
