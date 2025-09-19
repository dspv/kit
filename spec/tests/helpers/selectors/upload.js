/**
 * Upload Selectors
 * RepoKIT Standard: Centralized UI selectors for CSV upload functionality
 */

const UploadSelectors = {
  // Main upload interface
  uploadContainer: '[data-testid="upload-container"]',
  fileInput: '[data-testid="upload-file-input"]',
  uploadButton: '[data-testid="upload-submit-button"]',
  
  // Source selection
  sourceSelector: '[data-testid="upload-source-selector"]',
  sourceOption: (source) => `[data-testid="source-option-${source}"]`,
  customSourceOption: '[data-testid="source-option-custom"]',
  linkedinSourceOption: '[data-testid="source-option-linkedin"]',
  salesforceSourceOption: '[data-testid="source-option-salesforce"]',
  
  // File handling
  fileName: '[data-testid="upload-file-name"]',
  fileSize: '[data-testid="upload-file-size"]',
  removeFileButton: '[data-testid="remove-file-button"]',
  
  // Drag and drop
  dropZone: '[data-testid="upload-drop-zone"]',
  dropZoneActive: '[data-testid="upload-drop-zone-active"]',
  
  // Preview table
  previewTable: '[data-testid="upload-preview-table"]',
  previewTableHeader: '[data-testid="preview-table-header"]',
  previewTableBody: '[data-testid="preview-table-body"]',
  previewRow: '[data-testid^="preview-row-"]',
  
  // Column mapping
  columnMapping: '[data-testid="upload-column-mapping"]',
  columnMappingRow: '[data-testid^="column-mapping-"]',
  columnSourceSelect: (index) => `[data-testid="column-source-${index}"]`,
  columnTargetSelect: (index) => `[data-testid="column-target-${index}"]`,
  
  // Upload statistics
  rowCount: '[data-testid="upload-row-count"]',
  validRowCount: '[data-testid="upload-valid-rows"]',
  invalidRowCount: '[data-testid="upload-invalid-rows"]',
  duplicateCount: '[data-testid="upload-duplicate-count"]',
  
  // Progress indicator
  progressBar: '[data-testid="upload-progress-bar"]',
  progressPercentage: '[data-testid="upload-progress-percentage"]',
  progressStatus: '[data-testid="upload-progress-status"]',
  
  // Messages
  successMessage: '[data-testid="upload-success-message"]',
  errorMessage: '[data-testid="upload-error-message"]',
  warningMessage: '[data-testid="upload-warning-message"]',
  infoMessage: '[data-testid="upload-info-message"]',
  
  // Validation errors
  validationErrors: '[data-testid="upload-validation-errors"]',
  validationErrorRow: '[data-testid^="validation-error-"]',
  validationErrorMessage: '[data-testid="validation-error-message"]',
  
  // Options and settings
  skipDuplicates: '[data-testid="upload-skip-duplicates"]',
  updateExisting: '[data-testid="upload-update-existing"]',
  validateOnly: '[data-testid="upload-validate-only"]',
  
  // Actions
  cancelUploadButton: '[data-testid="cancel-upload-button"]',
  retryUploadButton: '[data-testid="retry-upload-button"]',
  downloadTemplateButton: '[data-testid="download-template-button"]',
  downloadErrorsButton: '[data-testid="download-errors-button"]',
  
  // Upload history
  uploadHistory: '[data-testid="upload-history"]',
  historyItem: '[data-testid^="history-item-"]',
  historyDate: '[data-testid="history-date"]',
  historyStatus: '[data-testid="history-status"]',
  historyCount: '[data-testid="history-count"]',
  historyDownloadButton: '[data-testid="history-download-button"]',
  
  // File format help
  formatHelp: '[data-testid="upload-format-help"]',
  formatExample: '[data-testid="upload-format-example"]',
  formatRequirements: '[data-testid="upload-format-requirements"]',
  
  // Batch operations
  batchSize: '[data-testid="upload-batch-size"]',
  batchProgress: '[data-testid="upload-batch-progress"]',
  batchStatus: '[data-testid="upload-batch-status"]',
  
  // Error handling
  fileTypeError: '[data-testid="upload-file-type-error"]',
  fileSizeError: '[data-testid="upload-file-size-error"]',
  networkError: '[data-testid="upload-network-error"]',
  serverError: '[data-testid="upload-server-error"]',
  
  // Loading states
  uploadLoading: '[data-testid="upload-loading"]',
  previewLoading: '[data-testid="preview-loading"]',
  validationLoading: '[data-testid="validation-loading"]',
  
  // Empty states
  noFileSelected: '[data-testid="upload-no-file-selected"]',
  emptyPreview: '[data-testid="upload-empty-preview"]',
  noHistory: '[data-testid="upload-no-history"]'
};

module.exports = { UploadSelectors };