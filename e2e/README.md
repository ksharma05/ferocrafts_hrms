# E2E Tests

End-to-end tests using Playwright to test critical user flows.

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Install Playwright Browsers**:
   ```bash
   npx playwright install
   ```

3. **Seed Database** (for test data):
   ```bash
   cd server
   npm run seed
   ```

## Running Tests

### Run All Tests
```bash
npm run test:e2e
```

### Run Tests in UI Mode (Interactive)
```bash
npm run test:e2e:ui
```

### Run Specific Test File
```bash
npx playwright test e2e/auth.spec.js
```

### Run Tests in Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### View Test Report
```bash
npm run test:e2e:report
```

## Test Structure

```
e2e/
├── auth.spec.js         # Authentication flow tests
├── attendance.spec.js   # Attendance check-in/out tests
├── employees.spec.js    # Employee management tests
├── payouts.spec.js      # Payout viewing tests
└── README.md           # This file
```

## Test Scenarios

### Authentication (`auth.spec.js`)
- ✅ Display login page
- ✅ Show validation errors
- ✅ Handle invalid credentials
- ✅ Login with valid credentials
- ✅ Logout functionality

### Attendance (`attendance.spec.js`)
- ✅ Display check-in component
- ✅ Open camera capture
- ✅ Display check-out component
- ✅ Navigate to approval page (manager)
- ✅ Display pending records (manager)
- ✅ View attendance details (manager)

### Employees (`employees.spec.js`)
- ✅ Navigate to employees page
- ✅ Display employee list
- ✅ Display employee details

### Payouts (`payouts.spec.js`)
- ✅ Navigate to payouts page
- ✅ Display payout history
- ✅ Display payout details
- ✅ Download slip button

## Test Data

Tests use seeded data:
- **Employee**: `employee1@ferocrafts.com` / `Employee@123`
- **Manager**: `manager@ferocrafts.com` / `Manager@123`
- **Admin**: `admin@ferocrafts.com` / `Admin@123`

## Configuration

Test configuration is in `playwright.config.js`:
- Base URL: `http://localhost:5173`
- Browsers: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- Auto-start dev servers (client & server)
- Screenshots on failure
- Trace on first retry

## Debugging

### Debug Mode
```bash
npx playwright test --debug
```

### Headed Mode (See Browser)
```bash
npx playwright test --headed
```

### Slow Motion
```bash
npx playwright test --slow-mo=1000
```

## CI/CD Integration

Tests can run in CI with:
```bash
npx playwright test --reporter=github
```

Already configured in `.github/workflows/ci.yml`.

## Best Practices

1. **Use Test Fixtures**: Setup/teardown in `beforeEach`/`afterEach`
2. **Wait for Elements**: Use `waitForSelector` or `expect().toBeVisible()`
3. **Avoid Hard Waits**: Use `waitForTimeout` sparingly
4. **Test User Flows**: Focus on critical paths
5. **Keep Tests Independent**: Each test should work standalone
6. **Use Descriptive Names**: Clear test descriptions
7. **Mock External Services**: Don't depend on external APIs

## Troubleshooting

### Tests Failing Locally

1. **Check Servers Running**:
   ```bash
   # Terminal 1
   cd server && npm run dev

   # Terminal 2
   cd client && npm run dev
   ```

2. **Check Database**:
   - Ensure MongoDB is running
   - Run seed script for test data

3. **Clear Browser Data**:
   ```bash
   npx playwright clean
   npx playwright install
   ```

### Flaky Tests

- Add explicit waits for async operations
- Increase timeout for slow operations
- Check for race conditions
- Use `page.waitForLoadState('networkidle')`

## Future Enhancements

- [ ] Add visual regression tests
- [ ] Add API contract tests
- [ ] Add performance tests
- [ ] Add accessibility tests
- [ ] Increase test coverage to 80%+

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)

