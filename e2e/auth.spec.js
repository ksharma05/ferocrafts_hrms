const { test, expect } = require('@playwright/test');

/**
 * E2E Tests for Authentication Flow
 */

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login page', async ({ page }) => {
    await expect(page).toHaveTitle(/FeroCrafts HRMS/);
    await expect(page.locator('h1')).toContainText('Login');
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.click('button[type="submit"]');
    // Wait for validation errors to appear
    await page.waitForTimeout(500);
    // Check that we're still on login page (form didn't submit)
    await expect(page).toHaveURL(/.*login/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'WrongPassword123');
    await page.click('button[type="submit"]');

    // Wait for error toast
    await expect(page.locator('.Toastify__toast--error')).toBeVisible({
      timeout: 5000,
    });
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Use seeded employee credentials
    await page.fill('input[name="email"]', 'employee1@ferocrafts.com');
    await page.fill('input[name="password"]', 'Employee@123');
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/', { timeout: 10000 });
    await expect(page.locator('h1')).toContainText('Welcome');
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.fill('input[name="email"]', 'employee1@ferocrafts.com');
    await page.fill('input[name="password"]', 'Employee@123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/', { timeout: 10000 });

    // Click user dropdown
    await page.click('button:has-text("employee1@ferocrafts.com")');

    // Click logout
    await page.click('button:has-text("Logout")');

    // Should redirect to login
    await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
  });
});

