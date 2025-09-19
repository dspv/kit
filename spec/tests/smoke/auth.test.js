/**
 * Smoke Tests - Authentication Flow
 * RepoKIT Standard: Critical auth functionality must work
 * Runtime: < 30 seconds
 */

const { test, expect } = require('@playwright/test');
const { ApiClient } = require('../helpers/api-client');
const { AuthSelectors } = require('../helpers/selectors/auth');
const { generateTestUser } = require('../helpers/fixtures/users');

test.describe('Authentication Smoke Tests', () => {
  let apiClient;
  let testUser;

  test.beforeEach(async ({ page }) => {
    apiClient = new ApiClient(page);
    testUser = generateTestUser();
  });

  test('user can sign up successfully', async ({ page }) => {
    await page.goto('/signup');
    
    // Fill signup form
    await page.fill(AuthSelectors.emailInput, testUser.email);
    await page.fill(AuthSelectors.passwordInput, testUser.password);
    await page.fill(AuthSelectors.confirmPasswordInput, testUser.password);
    
    // Submit form
    await page.click(AuthSelectors.signupButton);
    
    // Verify successful signup
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator(AuthSelectors.welcomeMessage)).toBeVisible();
  });

  test('user can sign in with valid credentials', async ({ page }) => {
    // Create user via API first
    await apiClient.createUser(testUser);
    
    await page.goto('/login');
    
    // Fill login form
    await page.fill(AuthSelectors.emailInput, testUser.email);
    await page.fill(AuthSelectors.passwordInput, testUser.password);
    
    // Submit form
    await page.click(AuthSelectors.loginButton);
    
    // Verify successful login
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator(AuthSelectors.userMenuButton)).toBeVisible();
  });

  test('user cannot sign in with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill with invalid credentials
    await page.fill(AuthSelectors.emailInput, 'invalid@example.com');
    await page.fill(AuthSelectors.passwordInput, 'wrongpassword');
    
    // Submit form
    await page.click(AuthSelectors.loginButton);
    
    // Verify error message
    await expect(page.locator(AuthSelectors.errorMessage)).toBeVisible();
    await expect(page.locator(AuthSelectors.errorMessage)).toContainText('Invalid credentials');
    
    // Should remain on login page
    await expect(page).toHaveURL('/login');
  });

  test('user can logout successfully', async ({ page }) => {
    // Login first
    await apiClient.createUser(testUser);
    await page.goto('/login');
    await page.fill(AuthSelectors.emailInput, testUser.email);
    await page.fill(AuthSelectors.passwordInput, testUser.password);
    await page.click(AuthSelectors.loginButton);
    
    // Wait for dashboard to load
    await expect(page).toHaveURL('/dashboard');
    
    // Logout
    await page.click(AuthSelectors.userMenuButton);
    await page.click(AuthSelectors.logoutButton);
    
    // Verify logout
    await expect(page).toHaveURL('/login');
    await expect(page.locator(AuthSelectors.loginButton)).toBeVisible();
  });

  test('protected routes redirect to login when not authenticated', async ({ page }) => {
    // Try to access protected route directly
    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL('/login');
    await expect(page.locator(AuthSelectors.loginButton)).toBeVisible();
  });
});