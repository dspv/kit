/**
 * Smoke Tests - Bulk Operations (Stage Changes)
 * RepoKIT Standard: Stage change (row + bulk)
 * Runtime: < 30 seconds
 */

const { test, expect } = require('@playwright/test');
const { ApiClient } = require('../helpers/api-client');
const { CompanySelectors } = require('../helpers/selectors/companies');
const { BulkSelectors } = require('../helpers/selectors/bulk');
const { generateTestUser, generateTestCompany } = require('../helpers/fixtures');

test.describe('Bulk Operations Smoke Tests', () => {
  let apiClient;
  let testUser;
  let testCompanies;

  test.beforeEach(async ({ page }) => {
    apiClient = new ApiClient(page);
    testUser = generateTestUser();
    
    // Create user and login
    await apiClient.createUser(testUser);
    await apiClient.login(testUser);
    
    // Create test companies
    testCompanies = [
      generateTestCompany({ name: 'Bulk Company 1', stage: 'prospect' }),
      generateTestCompany({ name: 'Bulk Company 2', stage: 'prospect' }),
      generateTestCompany({ name: 'Bulk Company 3', stage: 'prospect' }),
      generateTestCompany({ name: 'Bulk Company 4', stage: 'qualified' }),
      generateTestCompany({ name: 'Bulk Company 5', stage: 'qualified' })
    ];
    
    for (const company of testCompanies) {
      await apiClient.createCompany(company);
    }
  });

  test('bulk selection interface appears when multiple rows selected', async ({ page }) => {
    await page.goto('/companies');
    
    // Select multiple companies
    await page.click(`[data-testid="checkbox-Bulk Company 1"]`);
    await page.click(`[data-testid="checkbox-Bulk Company 2"]`);
    await page.click(`[data-testid="checkbox-Bulk Company 3"]`);
    
    // Verify bulk action bar appears
    await expect(page.locator(BulkSelectors.bulkActionBar)).toBeVisible();
    await expect(page.locator(BulkSelectors.selectedCount)).toContainText('3 selected');
    
    // Verify bulk actions are available
    await expect(page.locator(BulkSelectors.bulkStageChange)).toBeVisible();
    await expect(page.locator(BulkSelectors.bulkDelete)).toBeVisible();
  });

  test('bulk stage change works for multiple companies', async ({ page }) => {
    await page.goto('/companies');
    
    // Select companies in prospect stage
    await page.click(`[data-testid="checkbox-Bulk Company 1"]`);
    await page.click(`[data-testid="checkbox-Bulk Company 2"]`);
    await page.click(`[data-testid="checkbox-Bulk Company 3"]`);
    
    // Perform bulk stage change
    await page.click(BulkSelectors.bulkStageChange);
    await page.click(BulkSelectors.stageOption('qualified'));
    
    // Confirm the action
    await expect(page.locator(BulkSelectors.confirmDialog)).toBeVisible();
    await expect(page.locator(BulkSelectors.confirmDialog)).toContainText('Change stage for 3 companies?');
    await page.click(BulkSelectors.confirmButton);
    
    // Verify success message
    await expect(page.locator(BulkSelectors.successMessage)).toBeVisible();
    await expect(page.locator(BulkSelectors.successMessage)).toContainText('3 companies updated');
    
    // Verify companies now show qualified stage
    await expect(page.locator(`[data-testid="company-stage-Bulk Company 1"]`)).toContainText('qualified');
    await expect(page.locator(`[data-testid="company-stage-Bulk Company 2"]`)).toContainText('qualified');
    await expect(page.locator(`[data-testid="company-stage-Bulk Company 3"]`)).toContainText('qualified');
  });

  test('select all functionality works', async ({ page }) => {
    await page.goto('/companies');
    
    // Click select all checkbox
    await page.click(BulkSelectors.selectAllCheckbox);
    
    // Verify all visible companies are selected
    for (const company of testCompanies) {
      await expect(page.locator(`[data-testid="checkbox-${company.name}"]`)).toBeChecked();
    }
    
    // Verify bulk action bar shows correct count
    await expect(page.locator(BulkSelectors.selectedCount)).toContainText('5 selected');
  });

  test('deselect all functionality works', async ({ page }) => {
    await page.goto('/companies');
    
    // Select all first
    await page.click(BulkSelectors.selectAllCheckbox);
    await expect(page.locator(BulkSelectors.selectedCount)).toContainText('5 selected');
    
    // Deselect all
    await page.click(BulkSelectors.selectAllCheckbox);
    
    // Verify no companies are selected
    for (const company of testCompanies) {
      await expect(page.locator(`[data-testid="checkbox-${company.name}"]`)).not.toBeChecked();
    }
    
    // Verify bulk action bar is hidden
    await expect(page.locator(BulkSelectors.bulkActionBar)).not.toBeVisible();
  });

  test('bulk operations work across filtered results', async ({ page }) => {
    await page.goto('/companies');
    
    // Apply filter to show only prospect companies
    await page.click(CompanySelectors.stageFilter);
    await page.click(CompanySelectors.stageFilterOption('prospect'));
    
    // Verify filtered results
    await expect(page.locator(`[data-testid="company-Bulk Company 1"]`)).toBeVisible();
    await expect(page.locator(`[data-testid="company-Bulk Company 4"]`)).not.toBeVisible();
    
    // Select all filtered results
    await page.click(BulkSelectors.selectAllCheckbox);
    
    // Verify only filtered companies are selected (3 prospect companies)
    await expect(page.locator(BulkSelectors.selectedCount)).toContainText('3 selected');
    
    // Perform bulk stage change
    await page.click(BulkSelectors.bulkStageChange);
    await page.click(BulkSelectors.stageOption('qualified'));
    await page.click(BulkSelectors.confirmButton);
    
    // Verify success
    await expect(page.locator(BulkSelectors.successMessage)).toContainText('3 companies updated');
  });

  test('bulk delete with confirmation works', async ({ page }) => {
    await page.goto('/companies');
    
    // Select companies to delete
    await page.click(`[data-testid="checkbox-Bulk Company 1"]`);
    await page.click(`[data-testid="checkbox-Bulk Company 2"]`);
    
    // Click bulk delete
    await page.click(BulkSelectors.bulkDelete);
    
    // Verify confirmation dialog
    await expect(page.locator(BulkSelectors.deleteConfirmDialog)).toBeVisible();
    await expect(page.locator(BulkSelectors.deleteConfirmDialog)).toContainText('Delete 2 companies?');
    await expect(page.locator(BulkSelectors.deleteConfirmDialog)).toContainText('This action cannot be undone');
    
    // Confirm deletion
    await page.click(BulkSelectors.confirmDeleteButton);
    
    // Verify success message
    await expect(page.locator(BulkSelectors.successMessage)).toContainText('2 companies deleted');
    
    // Verify companies are no longer visible
    await expect(page.locator(`[data-testid="company-Bulk Company 1"]`)).not.toBeVisible();
    await expect(page.locator(`[data-testid="company-Bulk Company 2"]`)).not.toBeVisible();
    
    // Verify other companies are still there
    await expect(page.locator(`[data-testid="company-Bulk Company 3"]`)).toBeVisible();
  });

  test('bulk operations can be cancelled', async ({ page }) => {
    await page.goto('/companies');
    
    // Select companies
    await page.click(`[data-testid="checkbox-Bulk Company 1"]`);
    await page.click(`[data-testid="checkbox-Bulk Company 2"]`);
    
    // Start bulk stage change but cancel
    await page.click(BulkSelectors.bulkStageChange);
    await page.click(BulkSelectors.stageOption('qualified'));
    await page.click(BulkSelectors.cancelButton);
    
    // Verify no changes were made
    await expect(page.locator(`[data-testid="company-stage-Bulk Company 1"]`)).toContainText('prospect');
    await expect(page.locator(`[data-testid="company-stage-Bulk Company 2"]`)).toContainText('prospect');
    
    // Verify no success message
    await expect(page.locator(BulkSelectors.successMessage)).not.toBeVisible();
  });
});