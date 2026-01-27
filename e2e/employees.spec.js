const { test, expect } = require('@playwright/test');

/**
 * E2E Tests for Employee Management
 */

test.describe('Employee Management (Manager/Admin)', () => {
  test.beforeEach(async ({ page }) => {
    // Login as manager
    await page.goto('/login');
    await page.fill('input[name="email"]', 'manager@ferocrafts.com');
    await page.fill('input[name="password"]', 'Manager@123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/', { timeout: 10000 });
  });

  test('should navigate to employees page', async ({ page }) => {
    await page.click('a:has-text("Employees")');

    await expect(page).toHaveURL('/employees', { timeout: 5000 });
    await expect(page.locator('h1')).toContainText('Employees');
  });

  test('should display employee list', async ({ page }) => {
    await page.goto('/employees');

    // Check for employee table or empty state
    const hasEmployees = await page.locator('table').isVisible();
    const hasEmptyState = await page.locator('text=No employees found').isVisible();

    expect(hasEmployees || hasEmptyState).toBeTruthy();
  });

  test('should display employee details in table', async ({ page }) => {
    await page.goto('/employees');

    // If there are employees, check table structure
    if (await page.locator('table').isVisible()) {
      await expect(page.locator('th:has-text("Name")')).toBeVisible();
      await expect(page.locator('th:has-text("Phone")')).toBeVisible();
      await expect(page.locator('th:has-text("Aadhaar")')).toBeVisible();
    }
  });
});

