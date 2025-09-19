/**
 * Drafts Selectors
 * RepoKIT Standard: Centralized UI selectors for draft preview and management
 */

const DraftSelectors = {
  // Draft preview main container
  previewContainer: '[data-testid="draft-preview-container"]',
  subjectPreview: '[data-testid="draft-subject-preview"]',
  contentPreview: '[data-testid="draft-content-preview"]',
  
  // Draft editing
  editContentButton: '[data-testid="draft-edit-content-button"]',
  editSubjectButton: '[data-testid="draft-edit-subject-button"]',
  contentEditor: '[data-testid="draft-content-editor"]',
  subjectEditor: '[data-testid="draft-subject-editor"]',
  
  // Actions
  saveButton: '[data-testid="draft-save-button"]',
  sendButton: '[data-testid="draft-send-button"]',
  cancelButton: '[data-testid="draft-cancel-button"]',
  deleteButton: '[data-testid="draft-delete-button"]',
  duplicateButton: '[data-testid="draft-duplicate-button"]',
  
  // Variables panel
  variablesPanel: '[data-testid="draft-variables-panel"]',
  variablesList: '[data-testid="draft-variables-list"]',
  variableItem: '[data-testid^="variable-item-"]',
  variableKey: '[data-testid="variable-key"]',
  variableValue: '[data-testid="variable-value"]',
  
  // Variable warnings
  missingVariablesWarning: '[data-testid="missing-variables-warning"]',
  undefinedVariablesList: '[data-testid="undefined-variables-list"]',
  variableErrorMessage: '[data-testid="variable-error-message"]',
  
  // Send confirmation
  sendConfirmDialog: '[data-testid="draft-send-confirm-dialog"]',
  confirmSendButton: '[data-testid="confirm-send-button"]',
  cancelSendButton: '[data-testid="cancel-send-button"]',
  sendToEmail: '[data-testid="send-to-email"]',
  sendToName: '[data-testid="send-to-name"]',
  
  // Status indicators
  draftStatus: '[data-testid="draft-status"]',
  lastSaved: '[data-testid="draft-last-saved"]',
  lastModified: '[data-testid="draft-last-modified"]',
  
  // Messages
  saveSuccessMessage: '[data-testid="draft-save-success"]',
  saveErrorMessage: '[data-testid="draft-save-error"]',
  sendSuccessMessage: '[data-testid="draft-send-success"]',
  sendErrorMessage: '[data-testid="draft-send-error"]',
  
  // Draft list (if on list page)
  draftsList: '[data-testid="drafts-list"]',
  draftItem: '[data-testid^="draft-item-"]',
  draftTitle: '[data-testid="draft-title"]',
  draftCompany: '[data-testid="draft-company"]',
  draftUpdated: '[data-testid="draft-updated"]',
  
  // Template selection
  templateSelector: '[data-testid="draft-template-selector"]',
  templateOption: (templateName) => `[data-testid="template-option-${templateName}"]`,
  customTemplateOption: '[data-testid="template-option-custom"]',
  
  // Rich text editor (if applicable)
  richTextEditor: '[data-testid="draft-rich-text-editor"]',
  boldButton: '[data-testid="editor-bold-button"]',
  italicButton: '[data-testid="editor-italic-button"]',
  linkButton: '[data-testid="editor-link-button"]',
  listButton: '[data-testid="editor-list-button"]',
  
  // Attachments
  attachmentsSection: '[data-testid="draft-attachments"]',
  addAttachmentButton: '[data-testid="add-attachment-button"]',
  attachmentItem: '[data-testid^="attachment-item-"]',
  removeAttachmentButton: '[data-testid="remove-attachment-button"]',
  
  // Scheduling
  scheduleSection: '[data-testid="draft-schedule-section"]',
  scheduleCheckbox: '[data-testid="schedule-draft-checkbox"]',
  scheduleDateInput: '[data-testid="schedule-date-input"]',
  scheduleTimeInput: '[data-testid="schedule-time-input"]',
  
  // Tracking and analytics
  trackingSection: '[data-testid="draft-tracking-section"]',
  trackOpensCheckbox: '[data-testid="track-opens-checkbox"]',
  trackClicksCheckbox: '[data-testid="track-clicks-checkbox"]',
  
  // Responsive design elements
  mobileActionButtons: '[data-testid="mobile-action-buttons"]',
  tabletSidebar: '[data-testid="tablet-sidebar"]',
  desktopToolbar: '[data-testid="desktop-toolbar"]',
  
  // Loading states
  previewLoading: '[data-testid="draft-preview-loading"]',
  saveLoading: '[data-testid="draft-save-loading"]',
  sendLoading: '[data-testid="draft-send-loading"]',
  
  // Error states
  previewError: '[data-testid="draft-preview-error"]',
  loadError: '[data-testid="draft-load-error"]',
  
  // Auto-save indicator
  autoSaveIndicator: '[data-testid="draft-auto-save-indicator"]',
  autoSaveStatus: '[data-testid="auto-save-status"]',
  
  // Version history
  versionHistory: '[data-testid="draft-version-history"]',
  versionItem: '[data-testid^="version-item-"]',
  restoreVersionButton: '[data-testid="restore-version-button"]'
};

module.exports = { DraftSelectors };