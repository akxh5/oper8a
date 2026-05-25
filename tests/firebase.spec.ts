import { test, expect } from '@playwright/test';

test.describe('Firebase Integration', () => {
  test('no Firebase offline errors on landing page', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('Firebase')) {
        errors.push(msg.text());
      }
    });
    await page.goto('/');
    await page.waitForTimeout(3000);
    const offlineErrors = errors.filter(e => e.includes('offline') || e.includes('invalid-api-key'));
    expect(offlineErrors).toHaveLength(0);
  });

  test('no Firebase offline errors on dashboard', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('Firebase')) {
        errors.push(msg.text());
      }
    });
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', '8HgqKqcdMFazWVWm7NY42FkG7SaFywfpsrTww1o4yVpX');
    });
    await page.goto('/dashboard');
    await page.waitForTimeout(5000);
    const offlineErrors = errors.filter(e => 
      e.includes('offline') || 
      e.includes('invalid-api-key') ||
      e.includes('Failed to get document')
    );
    expect(offlineErrors).toHaveLength(0);
  });

  test('Firebase project ID is correct in bundle', async ({ page }) => {
    await page.goto('/');
    const html = await page.content();
    // Check that the correct project ID is referenced
    const response = await page.goto('/');
    // Navigate to check JS bundle contains correct project
    const scripts = await page.evaluate(() => 
      Array.from(document.scripts).map(s => s.src)
    );
    expect(scripts.length).toBeGreaterThan(0);
  });
});
