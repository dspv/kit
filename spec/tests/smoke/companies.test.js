/**
 * Smoke Tests - Companies Core Functionality
 * RepoKIT Standard: Companies list, detail, and basic operations
 * Runtime: < 45 seconds
 */

const { test, expect } = require('@playwright/test');
const { ApiClient } = require('../helpers/api-client');
const { CompanySelectors } = require('../helpers/selectors/companies');
const { generateTestUser, generateTestCompany } = require('../helpers/fixtures');

test.describe('Companies Smoke Tests', () => {
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
      generateTestCompany({ name: 'Alpha Corp', stage: 'prospect' }),
      generateTestCompany({ name: 'Beta Inc', stage: 'qualified' }),
      generateTestCompany({ name: 'Gamma LLC', stage: 'proposal' })
    ];
    
    for (const company of testCompanies) {
      await apiClient.createCompany(company);
    }
  });

  test('companies list loads with data', async ({ page }) => {
    await page.goto('/companies');
    
    // Verify page loads
    await expect(page.locator(CompanySelectors.companiesList)).toBeVisible();
    
    // Verify companies are displayed
    for (const company of testCompanies) {
      await expect(page.locator(`[data-testid="company-${company.name}"]`)).toBeVisible();
    }
    
    // Verify basic info is shown
    await expect(page.locator(CompanySelectors.companyName).first()).toBeVisible();
    await expect(page.locator(CompanySelectors.companyStage).first()).toBeVisible();
  });

  test('companies list filters work', async ({ page }) => {
    await page.goto('/companies');
    
    // Apply stage filter
    await page.click(CompanySelectors.stageFilter);
    await page.click(CompanySelectors.stageFilterOption('qualified'));
    
    // Verify filtered results
    await expect(page.locator(`[data-testid="company-Beta Inc"]`)).toBeVisible();
    await expect(page.locator(`[data-testid="company-Alpha Corp"]`)).not.toBeVisible();
    await expect(page.locator(`[data-testid="company-Gamma LLC"]`)).not.toBeVisible();
    
    // Clear filter
    await page.click(CompanySelectors.clearFilters);
    
    // Verify all companies visible again
    for (const company of testCompanies) {
      await expect(page.locator(`[data-testid="company-${company.name}"]`)).toBeVisible();
    }
  });

  test('companies list pagination works', async ({ page }) => {
    // Create enough companies to trigger pagination (assuming 10 per page)
    const additionalCompanies = [];
    for (let i = 0; i < 12; i++) {
      const company = generateTestCompany({ name: `Extra Company ${i}` });
      additionalCompanies.push(company);
      await apiClient.createCompany(company);
    }
    
    await page.goto('/companies');
    
    // Verify pagination controls are visible
    await expect(page.locator(CompanySelectors.paginationNext)).toBeVisible();
    
    // Go to next page
    await page.click(CompanySelectors.paginationNext);
    
    // Verify we're on page 2
    await expect(page.locator(CompanySelectors.paginationCurrent)).toContainText('2');
    
    // Verify different companies are shown
    await expect(page.locator(CompanySelectors.companiesList)).toBeVisible();
  });

  test('company detail page loads correctly', async ({ page }) => {
    const targetCompany = testCompanies[0];
    
    await page.goto('/companies');
    
    // Click on first company
    await page.click(`[data-testid="company-${targetCompany.name}"]`);
    
    // Verify we're on detail page
    await expect(page).toHaveURL(new RegExp(`/companies/[^/]+$`));
    
    // Verify company details are shown
    await expect(page.locator(CompanySelectors.companyDetailName)).toContainText(targetCompany.name);
    await expect(page.locator(CompanySelectors.companyDetailStage)).toContainText(targetCompany.stage);
    
    // Verify tabs are present
    await expect(page.locator(CompanySelectors.jobsTab)).toBeVisible();
    await expect(page.locator(CompanySelectors.contactsTab)).toBeVisible();
    await expect(page.locator(CompanySelectors.draftsTab)).toBeVisible();
    await expect(page.locator(CompanySelectors.reasoningTab)).toBeVisible();
  });

  test('company detail tabs navigation works', async ({ page }) => {
    const targetCompany = testCompanies[0];
    
    await page.goto('/companies');
    await page.click(`[data-testid="company-${targetCompany.name}"]`);
    
    // Test each tab
    const tabs = [
      { selector: CompanySelectors.jobsTab, content: CompanySelectors.jobsContent },
      { selector: CompanySelectors.contactsTab, content: CompanySelectors.contactsContent },
      { selector: CompanySelectors.draftsTab, content: CompanySelectors.draftsContent },
      { selector: CompanySelectors.reasoningTab, content: CompanySelectors.reasoningContent }
    ];
    
    for (const tab of tabs) {
      await page.click(tab.selector);
      await expect(page.locator(tab.content)).toBeVisible();
    }
  });

  test('stage change works for single company', async ({ page }) => {
    const targetCompany = testCompanies[0];
    
    await page.goto('/companies');
    
    // Change stage via dropdown
    await page.click(`[data-testid="stage-dropdown-${targetCompany.name}"]`);
    await page.click(CompanySelectors.stageOption('qualified'));
    
    // Verify stage updated
    await expect(page.locator(`[data-testid="company-stage-${targetCompany.name}"]`)).toContainText('qualified');
    
    // Verify via API that change persisted
    const updatedCompany = await apiClient.getCompany(targetCompany.id);
    expect(updatedCompany.stage).toBe('qualified');
  });
});