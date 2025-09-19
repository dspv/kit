/**
 * Smoke Tests - Draft Preview and Management
 * RepoKIT Standard: Draft preview (variables render, save)
 * Runtime: < 30 seconds
 */

const { test, expect } = require('@playwright/test');
const { ApiClient } = require('../helpers/api-client');
const { DraftSelectors } = require('../helpers/selectors/drafts');
const { generateTestUser, generateTestDraft, generateTestCompany } = require('../helpers/fixtures');

test.describe('Draft Preview Smoke Tests', () => {
  let apiClient;
  let testUser;
  let testCompany;
  let testDraft;

  test.beforeEach(async ({ page }) => {
    apiClient = new ApiClient(page);
    testUser = generateTestUser();
    
    // Create user and login
    await apiClient.createUser(testUser);
    await apiClient.login(testUser);
    
    // Create test company
    testCompany = generateTestCompany({ 
      name: 'Acme Corp',
      contactName: 'John Doe',
      position: 'CTO'
    });
    await apiClient.createCompany(testCompany);
    
    // Create test draft with variables
    testDraft = generateTestDraft({
      companyId: testCompany.id,
      subject: 'Partnership Opportunity with {{company_name}}',
      content: `Hi {{contact_name}},

I hope this email finds you well. I'm reaching out regarding a potential partnership opportunity between our companies.

As the {{position}} at {{company_name}}, I believe you'd be interested in our new solution that could help {{company_name}} achieve its goals.

Best regards,
{{sender_name}}`
    });
    await apiClient.createDraft(testDraft);
  });

  test('draft preview page loads correctly', async ({ page }) => {
    await page.goto(`/drafts/${testDraft.id}/preview`);
    
    // Verify preview interface is present
    await expect(page.locator(DraftSelectors.previewContainer)).toBeVisible();
    await expect(page.locator(DraftSelectors.subjectPreview)).toBeVisible();
    await expect(page.locator(DraftSelectors.contentPreview)).toBeVisible();
    await expect(page.locator(DraftSelectors.saveButton)).toBeVisible();
  });

  test('draft variables render correctly in preview', async ({ page }) => {
    await page.goto(`/drafts/${testDraft.id}/preview`);
    
    // Verify variables are replaced in subject
    await expect(page.locator(DraftSelectors.subjectPreview)).toContainText('Partnership Opportunity with Acme Corp');
    await expect(page.locator(DraftSelectors.subjectPreview)).not.toContainText('{{company_name}}');
    
    // Verify variables are replaced in content
    await expect(page.locator(DraftSelectors.contentPreview)).toContainText('Hi John Doe,');
    await expect(page.locator(DraftSelectors.contentPreview)).toContainText('As the CTO at Acme Corp');
    await expect(page.locator(DraftSelectors.contentPreview)).not.toContainText('{{contact_name}}');
    await expect(page.locator(DraftSelectors.contentPreview)).not.toContainText('{{position}}');
    await expect(page.locator(DraftSelectors.contentPreview)).not.toContainText('{{company_name}}');
  });

  test('draft can be saved from preview', async ({ page }) => {
    await page.goto(`/drafts/${testDraft.id}/preview`);
    
    // Make a small edit to the content
    await page.click(DraftSelectors.editContentButton);
    await page.fill(DraftSelectors.contentEditor, testDraft.content + '\n\nP.S. Looking forward to hearing from you!');
    
    // Save the draft
    await page.click(DraftSelectors.saveButton);
    
    // Verify save success
    await expect(page.locator(DraftSelectors.saveSuccessMessage)).toBeVisible();
    await expect(page.locator(DraftSelectors.saveSuccessMessage)).toContainText('Draft saved successfully');
    
    // Verify the change persisted
    await page.reload();
    await expect(page.locator(DraftSelectors.contentPreview)).toContainText('P.S. Looking forward to hearing from you!');
  });

  test('draft preview shows variable substitution panel', async ({ page }) => {
    await page.goto(`/drafts/${testDraft.id}/preview`);
    
    // Click on variables panel
    await page.click(DraftSelectors.variablesPanel);
    
    // Verify variable values are shown
    await expect(page.locator(DraftSelectors.variablesList)).toBeVisible();
    await expect(page.locator(DraftSelectors.variablesList)).toContainText('company_name: Acme Corp');
    await expect(page.locator(DraftSelectors.variablesList)).toContainText('contact_name: John Doe');
    await expect(page.locator(DraftSelectors.variablesList)).toContainText('position: CTO');
  });

  test('draft preview handles missing variables gracefully', async ({ page }) => {
    // Create draft with undefined variable
    const draftWithMissingVar = generateTestDraft({
      companyId: testCompany.id,
      subject: 'Hello {{undefined_variable}}',
      content: 'Content with {{missing_var}} variable'
    });
    await apiClient.createDraft(draftWithMissingVar);
    
    await page.goto(`/drafts/${draftWithMissingVar.id}/preview`);
    
    // Verify missing variables are handled
    await expect(page.locator(DraftSelectors.subjectPreview)).toContainText('Hello [undefined_variable]');
    await expect(page.locator(DraftSelectors.contentPreview)).toContainText('Content with [missing_var] variable');
    
    // Verify warning about missing variables
    await expect(page.locator(DraftSelectors.missingVariablesWarning)).toBeVisible();
    await expect(page.locator(DraftSelectors.missingVariablesWarning)).toContainText('2 variables could not be resolved');
  });

  test('draft can be sent from preview', async ({ page }) => {
    await page.goto(`/drafts/${testDraft.id}/preview`);
    
    // Click send button
    await page.click(DraftSelectors.sendButton);
    
    // Verify send confirmation dialog
    await expect(page.locator(DraftSelectors.sendConfirmDialog)).toBeVisible();
    await expect(page.locator(DraftSelectors.sendConfirmDialog)).toContainText('Send email to John Doe at Acme Corp?');
    
    // Confirm send
    await page.click(DraftSelectors.confirmSendButton);
    
    // Verify send success
    await expect(page.locator(DraftSelectors.sendSuccessMessage)).toBeVisible();
    await expect(page.locator(DraftSelectors.sendSuccessMessage)).toContainText('Email sent successfully');
    
    // Verify draft status updated
    await expect(page.locator(DraftSelectors.draftStatus)).toContainText('Sent');
  });

  test('draft preview responsive design works', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`/drafts/${testDraft.id}/preview`);
    
    // Verify mobile layout
    await expect(page.locator(DraftSelectors.previewContainer)).toBeVisible();
    await expect(page.locator(DraftSelectors.mobileActionButtons)).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    
    // Verify tablet layout
    await expect(page.locator(DraftSelectors.previewContainer)).toBeVisible();
    await expect(page.locator(DraftSelectors.tabletSidebar)).toBeVisible();
  });
});