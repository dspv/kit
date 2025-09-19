/**
 * Playwright Configuration - RepoKIT Standards
 * Optimized for smoke tests (< 3 min) and comprehensive E2E coverage
 */

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // Test directory structure
  testDir: '.',
  testMatch: [
    'smoke/**/*.test.js',
    'e2e/**/*.test.js',
    'api/**/*.test.js'
  ],

  // Global timeout settings
  timeout: 30 * 1000, // 30 seconds per test
  expect: {
    timeout: 5 * 1000, // 5 seconds for assertions
  },

  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'reports/html' }],
    ['json', { outputFile: 'reports/results.json' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
    process.env.CI ? ['github'] : ['list']
  ],

  // Global test configuration
  use: {
    // Base URL for tests
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // Browser settings
    headless: process.env.CI ? true : false,
    viewport: { width: 1280, height: 720 },

    // Test artifacts
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    // Network and timing
    actionTimeout: 10 * 1000, // 10 seconds for actions
    navigationTimeout: 15 * 1000, // 15 seconds for navigation
  },

  // Test projects for different browsers and test types
  projects: [
    // Smoke tests - fast, critical functionality
    {
      name: 'smoke-chromium',
      testMatch: 'smoke/**/*.test.js',
      use: { 
        ...devices['Desktop Chrome'],
        // Faster settings for smoke tests
        video: 'off',
        screenshot: 'only-on-failure',
      },
      timeout: 15 * 1000, // 15 seconds max per smoke test
    },

    // API tests - backend contract testing
    {
      name: 'api-tests',
      testMatch: 'api/**/*.test.js',
      use: {
        // API tests don't need browser context
        baseURL: process.env.API_BASE_URL || 'http://localhost:3001/api',
      },
      timeout: 10 * 1000, // 10 seconds max per API test
    },

    // E2E tests - comprehensive user journeys
    {
      name: 'e2e-chromium',
      testMatch: 'e2e/**/*.test.js',
      use: { 
        ...devices['Desktop Chrome'],
        // Full artifacts for E2E tests
        video: 'on-first-retry',
        screenshot: 'only-on-failure',
        trace: 'on-first-retry',
      },
      timeout: 60 * 1000, // 60 seconds max per E2E test
    },

    // Cross-browser E2E (only for main branch)
    {
      name: 'e2e-firefox',
      testMatch: 'e2e/**/*.test.js',
      use: { ...devices['Desktop Firefox'] },
      timeout: 60 * 1000,
    },

    {
      name: 'e2e-webkit',
      testMatch: 'e2e/**/*.test.js',
      use: { ...devices['Desktop Safari'] },
      timeout: 60 * 1000,
    },

    // Mobile testing (selected E2E tests)
    {
      name: 'e2e-mobile-chrome',
      testMatch: 'e2e/**/mobile.test.js',
      use: { ...devices['Pixel 5'] },
      timeout: 60 * 1000,
    },

    {
      name: 'e2e-mobile-safari',
      testMatch: 'e2e/**/mobile.test.js',
      use: { ...devices['iPhone 12'] },
      timeout: 60 * 1000,
    },
  ],

  // Local development server
  webServer: process.env.CI ? undefined : [
    {
      command: 'cd ../../apps/api && go run cmd/main.go',
      port: 3001,
      reuseExistingServer: !process.env.CI,
      timeout: 30 * 1000,
      env: {
        NODE_ENV: 'test',
        DATABASE_URL: 'postgres://postgres:postgres@localhost:5432/test_db?sslmode=disable',
        JWT_SECRET: 'test-jwt-secret-for-local-dev',
      }
    },
    {
      command: 'cd ../../apps/ui && npm run dev',
      port: 3000,
      reuseExistingServer: !process.env.CI,
      timeout: 30 * 1000,
    }
  ],

  // Global setup and teardown
  globalSetup: require.resolve('./helpers/global-setup.js'),
  globalTeardown: require.resolve('./helpers/global-teardown.js'),
});