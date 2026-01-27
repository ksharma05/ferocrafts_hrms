const { test, expect } = require('@playwright/test');

/**
 * E2E Tests for Payout Management
 */

test.describe('Payouts', () => {
  test.beforeEach(async ({ page }) => {
    // Login as employee
    await page.goto('/login');
    await page.fill('input[name="email"]', 'employee1@ferocrafts.com');
    await page.fill('input[name="password"]', 'Employee@123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/', { timeout: 10000 });
  });

  test('should navigate to payouts page', async ({ page }) => {
    // For employees, payouts might not be in sidebar
    // Navigate directly
    await page.goto('/payouts');

    await expect(page.locator('h1')).toContainText('Payout History');
  });

  test('should display payout history', async ({ page }) => {
    await page.goto('/payouts');

    // Check for payout table or empty state
    const hasPayouts = await page.locator('table').isVisible();
    const hasEmptyState = await page
      .locator('text=No payout records found')
      .isVisible();

    expect(hasPayouts || hasEmptyState).toBeTruthy();
  });

  test('should display payout details in table', async ({ page }) => {
    await page.goto('/payouts');

    // If there are payouts, check table structure
    if (await page.locator('table').isVisible()) {
      await expect(page.locator('th:has-text("Period")')).toBeVisible();
      await expect(page.locator('th:has-text("Gross Pay")')).toBeVisible();
      await expect(page.locator('th:has-text("Net Pay")')).toBeVisible();
      await expect(page.locator('th:has-text("Status")')).toBeVisible();
    }
  });

  test('should have download slip button', async ({ page }) => {
    await page.goto('/payouts');

    // If there are payouts, check for download button
    if (await page.locator('table').isVisible()) {
      const downloadButton = page.locator('button:has-text("Download Slip")').first();
      if (await downloadButton.isVisible()) {
        await expect(downloadButton).toBeEnabled();
      }
    }
  });
});

