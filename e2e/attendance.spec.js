const { test, expect } = require('@playwright/test');

/**
 * E2E Tests for Attendance Flow
 */

test.describe('Attendance', () => {
  test.beforeEach(async ({ page, context }) => {
    // Grant permissions for camera and geolocation
    await context.grantPermissions(['camera', 'geolocation']);

    // Login as employee
    await page.goto('/login');
    await page.fill('input[name="email"]', 'employee1@ferocrafts.com');
    await page.fill('input[name="password"]', 'Employee@123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/', { timeout: 10000 });
  });

  test('should display check-in component', async ({ page }) => {
    await expect(page.locator('text=Attendance Check-in')).toBeVisible();
    await expect(page.locator('button:has-text("Punch In")')).toBeVisible();
  });

  test('should open camera capture on check-in', async ({ page }) => {
    // Mock camera and geolocation
    await page.addInitScript(() => {
      // Mock getUserMedia
      navigator.mediaDevices.getUserMedia = async () => {
        return new MediaStream();
      };

      // Mock geolocation
      navigator.geolocation.getCurrentPosition = (success) => {
        success({
          coords: {
            latitude: 23.0225,
            longitude: 72.5714,
          },
        });
      };
    });

    await page.click('button:has-text("Punch In")');

    // Camera modal should open
    await expect(page.locator('text=Take Selfie for Check-in')).toBeVisible({
      timeout: 5000,
    });
  });

  test('should display check-out component if checked in', async ({ page }) => {
    // This test assumes user has an active check-in
    // In a real scenario, you'd first check-in, then test check-out
    const checkOutSection = page.locator('text=Check-out');
    if (await checkOutSection.isVisible()) {
      await expect(page.locator('button:has-text("Punch Out")')).toBeVisible();
    }
  });
});

test.describe('Attendance Approval (Manager)', () => {
  test.beforeEach(async ({ page }) => {
    // Login as manager
    await page.goto('/login');
    await page.fill('input[name="email"]', 'manager@ferocrafts.com');
    await page.fill('input[name="password"]', 'Manager@123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/', { timeout: 10000 });
  });

  test('should navigate to attendance approval page', async ({ page }) => {
    // Click on Attendance in sidebar
    await page.click('a:has-text("Attendance")');

    await expect(page).toHaveURL('/attendance/approval', { timeout: 5000 });
    await expect(page.locator('h1')).toContainText('Attendance Approval');
  });

  test('should display pending attendance records', async ({ page }) => {
    await page.goto('/attendance/approval');

    // Check for pending records or empty state
    const hasPending = await page.locator('table').isVisible();
    const hasEmptyState = await page
      .locator('text=No pending attendance records')
      .isVisible();

    expect(hasPending || hasEmptyState).toBeTruthy();
  });

  test('should be able to view attendance details', async ({ page }) => {
    await page.goto('/attendance/approval');

    // If there are pending records, click View
    const viewButton = page.locator('button:has-text("View")').first();
    if (await viewButton.isVisible()) {
      await viewButton.click();

      // Modal should open
      await expect(page.locator('text=Attendance Details')).toBeVisible({
        timeout: 3000,
      });
    }
  });
});

