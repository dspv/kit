/**
 * Smoke Tests - CSV Upload Functionality
 * RepoKIT Standard: CSV upload (custom source) → rows appear
 * Runtime: < 30 seconds
 */

const { test, expect } = require('@playwright/test');
const { ApiClient } = require('../helpers/api-client');
const { UploadSelectors } = require('../helpers/selectors/upload');
const { generateTestUser, generateCSVData } = require('../helpers/fixtures');
const path = require('path');
const fs = require('fs');

test.describe('CSV Upload Smoke Tests', () => {
  let apiClient;
  let testUser;
  let testCSVPath;

  test.beforeEach(async ({ page }) => {
    apiClient = new ApiClient(page);
    testUser = generateTestUser();
    
    // Create user and login
    await apiClient.createUser(testUser);
    await apiClient.login(testUser);
    
    // Generate test CSV file
    const csvData = generateCSVData([
      { name: 'Test Company 1', email: 'contact1@test.com', stage: 'prospect' },
      { name: 'Test Company 2', email: 'contact2@test.com', stage: 'qualified' },
      { name: 'Test Company 3', email: 'contact3@test.com', stage: 'proposal' }
    ]);
    
    testCSVPath = path.join(__dirname, '../data/test-upload.csv');
    fs.writeFileSync(testCSVPath, csvData);
  });

  test.afterEach(async () => {
    // Clean up test CSV file
    if (fs.existsSync(testCSVPath)) {
      fs.unlinkSync(testCSVPath);
    }
  });

  test('CSV upload page loads correctly', async ({ page }) => {
    await page.goto('/upload');
    
    // Verify upload interface is present
    await expect(page.locator(UploadSelectors.fileInput)).toBeVisible();
    await expect(page.locator(UploadSelectors.uploadButton)).toBeVisible();
    await expect(page.locator(UploadSelectors.sourceSelector)).toBeVisible();
  });

  test('CSV file upload with custom source creates rows', async ({ page }) => {
    await page.goto('/upload');
    
    // Select custom source
    await page.click(UploadSelectors.sourceSelector);
    await page.click(UploadSelectors.sourceOption('custom'));
    
    // Upload CSV file
    await page.setInputFiles(UploadSelectors.fileInput, testCSVPath);
    
    // Verify file is selected
    await expect(page.locator(UploadSelectors.fileName)).toContainText('test-upload.csv');
    
    // Click upload
    await page.click(UploadSelectors.uploadButton);
    
    // Wait for upload to complete
    await expect(page.locator(UploadSelectors.successMessage)).toBeVisible();
    await expect(page.locator(UploadSelectors.successMessage)).toContainText('3 companies uploaded');
    
    // Verify rows appear in companies list
    await page.goto('/companies');
    
    // Check that uploaded companies are visible
    await expect(page.locator('[data-testid="company-Test Company 1"]')).toBeVisible();
    await expect(page.locator('[data-testid="company-Test Company 2"]')).toBeVisible();
    await expect(page.locator('[data-testid="company-Test Company 3"]')).toBeVisible();
  });

  test('CSV upload shows preview before processing', async ({ page }) => {
    await page.goto('/upload');
    
    // Select custom source
    await page.click(UploadSelectors.sourceSelector);
    await page.click(UploadSelectors.sourceOption('custom'));
    
    // Upload CSV file
    await page.setInputFiles(UploadSelectors.fileInput, testCSVPath);
    
    // Verify preview is shown
    await expect(page.locator(UploadSelectors.previewTable)).toBeVisible();
    
    // Verify preview contains expected data
    await expect(page.locator(UploadSelectors.previewTable)).toContainText('Test Company 1');
    await expect(page.locator(UploadSelectors.previewTable)).toContainText('contact1@test.com');
    await expect(page.locator(UploadSelectors.previewTable)).toContainText('prospect');
    
    // Verify row count is shown
    await expect(page.locator(UploadSelectors.rowCount)).toContainText('3 rows');
  });

  test('CSV upload validates file format', async ({ page }) => {
    // Create invalid CSV file
    const invalidCSVPath = path.join(__dirname, '../data/invalid.csv');
    fs.writeFileSync(invalidCSVPath, 'invalid,csv,content\nwithout,proper,headers');
    
    await page.goto('/upload');
    
    try {
      // Select custom source
      await page.click(UploadSelectors.sourceSelector);
      await page.click(UploadSelectors.sourceOption('custom'));
      
      // Upload invalid CSV file
      await page.setInputFiles(UploadSelectors.fileInput, invalidCSVPath);
      
      // Click upload
      await page.click(UploadSelectors.uploadButton);
      
      // Verify error message is shown
      await expect(page.locator(UploadSelectors.errorMessage)).toBeVisible();
      await expect(page.locator(UploadSelectors.errorMessage)).toContainText('Invalid CSV format');
      
    } finally {
      // Clean up invalid CSV file
      if (fs.existsSync(invalidCSVPath)) {
        fs.unlinkSync(invalidCSVPath);
      }
    }
  });

  test('CSV upload handles duplicate companies', async ({ page }) => {
    // First upload
    await page.goto('/upload');
    await page.click(UploadSelectors.sourceSelector);
    await page.click(UploadSelectors.sourceOption('custom'));
    await page.setInputFiles(UploadSelectors.fileInput, testCSVPath);
    await page.click(UploadSelectors.uploadButton);
    
    // Wait for first upload to complete
    await expect(page.locator(UploadSelectors.successMessage)).toBeVisible();
    
    // Upload same file again
    await page.goto('/upload');
    await page.click(UploadSelectors.sourceSelector);
    await page.click(UploadSelectors.sourceOption('custom'));
    await page.setInputFiles(UploadSelectors.fileInput, testCSVPath);
    await page.click(UploadSelectors.uploadButton);
    
    // Verify duplicate handling message
    await expect(page.locator(UploadSelectors.warningMessage)).toBeVisible();
    await expect(page.locator(UploadSelectors.warningMessage)).toContainText('duplicates found');
  });

  test('CSV upload progress indicator works', async ({ page }) => {
    await page.goto('/upload');
    
    // Select custom source
    await page.click(UploadSelectors.sourceSelector);
    await page.click(UploadSelectors.sourceOption('custom'));
    
    // Upload CSV file
    await page.setInputFiles(UploadSelectors.fileInput, testCSVPath);
    
    // Click upload
    await page.click(UploadSelectors.uploadButton);
    
    // Verify progress indicator appears
    await expect(page.locator(UploadSelectors.progressBar)).toBeVisible();
    
    // Wait for upload to complete
    await expect(page.locator(UploadSelectors.successMessage)).toBeVisible();
    
    // Verify progress indicator disappears
    await expect(page.locator(UploadSelectors.progressBar)).not.toBeVisible();
  });
});