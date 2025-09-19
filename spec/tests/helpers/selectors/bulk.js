/**
 * Bulk Operations Selectors
 * RepoKIT Standard: Centralized UI selectors for bulk operations
 */

const BulkSelectors = {
  // Bulk selection
  selectAllCheckbox: '[data-testid="bulk-select-all"]',
  selectNoneButton: '[data-testid="bulk-select-none"]',
  selectPageButton: '[data-testid="bulk-select-page"]',
  selectFilteredButton: '[data-testid="bulk-select-filtered"]',
  
  // Bulk action bar
  bulkActionBar: '[data-testid="bulk-action-bar"]',
  selectedCount: '[data-testid="bulk-selected-count"]',
  bulkActionsDropdown: '[data-testid="bulk-actions-dropdown"]',
  
  // Stage operations
  bulkStageChange: '[data-testid="bulk-stage-change"]',
  stageOption: (stage) => `[data-testid="bulk-stage-option-${stage}"]`,
  stageChangeButton: '[data-testid="bulk-stage-change-button"]',
  
  // Delete operations
  bulkDelete: '[data-testid="bulk-delete-button"]',
  deleteConfirmDialog: '[data-testid="bulk-delete-confirm-dialog"]',
  confirmDeleteButton: '[data-testid="confirm-bulk-delete"]',
  cancelDeleteButton: '[data-testid="cancel-bulk-delete"]',
  
  // Export operations
  bulkExport: '[data-testid="bulk-export-button"]',
  exportFormatSelect: '[data-testid="bulk-export-format"]',
  exportCsvOption: '[data-testid="export-format-csv"]',
  exportExcelOption: '[data-testid="export-format-excel"]',
  exportPdfOption: '[data-testid="export-format-pdf"]',
  
  // Assignment operations
  bulkAssign: '[data-testid="bulk-assign-button"]',
  assigneeSelect: '[data-testid="bulk-assignee-select"]',
  assigneeOption: (userId) => `[data-testid="assignee-option-${userId}"]`,
  
  // Tag operations
  bulkAddTags: '[data-testid="bulk-add-tags-button"]',
  bulkRemoveTags: '[data-testid="bulk-remove-tags-button"]',
  tagSelect: '[data-testid="bulk-tag-select"]',
  tagOption: (tagName) => `[data-testid="tag-option-${tagName}"]`,
  
  // Confirmation dialogs
  confirmDialog: '[data-testid="bulk-confirm-dialog"]',
  confirmButton: '[data-testid="bulk-confirm-button"]',
  cancelButton: '[data-testid="bulk-cancel-button"]',
  confirmMessage: '[data-testid="bulk-confirm-message"]',
  
  // Progress indicators
  bulkProgressBar: '[data-testid="bulk-progress-bar"]',
  bulkProgressText: '[data-testid="bulk-progress-text"]',
  bulkProgressPercentage: '[data-testid="bulk-progress-percentage"]',
  
  // Results and feedback
  successMessage: '[data-testid="bulk-success-message"]',
  errorMessage: '[data-testid="bulk-error-message"]',
  warningMessage: '[data-testid="bulk-warning-message"]',
  partialSuccessMessage: '[data-testid="bulk-partial-success-message"]',
  
  // Undo functionality
  undoButton: '[data-testid="bulk-undo-button"]',
  undoMessage: '[data-testid="bulk-undo-message"]',
  undoTimer: '[data-testid="bulk-undo-timer"]',
  
  // Batch processing
  batchSizeSelect: '[data-testid="bulk-batch-size"]',
  batchProgressList: '[data-testid="bulk-batch-progress-list"]',
  batchItem: '[data-testid^="bulk-batch-item-"]',
  batchStatus: '[data-testid="bulk-batch-status"]',
  
  // Filter-specific bulk actions
  bulkActionForFiltered: '[data-testid="bulk-action-filtered"]',
  filteredCount: '[data-testid="bulk-filtered-count"]',
  applyToAllPages: '[data-testid="bulk-apply-all-pages"]',
  
  // Custom actions (extensible)
  customAction: (actionName) => `[data-testid="bulk-custom-${actionName}"]`,
  customActionDialog: '[data-testid="bulk-custom-action-dialog"]',
  customActionForm: '[data-testid="bulk-custom-action-form"]',
  
  // Loading states
  bulkActionLoading: '[data-testid="bulk-action-loading"]',
  selectionLoading: '[data-testid="bulk-selection-loading"]',
  
  // Error handling
  bulkActionError: '[data-testid="bulk-action-error"]',
  retryBulkAction: '[data-testid="retry-bulk-action"]',
  
  // Mobile responsive
  mobileBulkMenu: '[data-testid="mobile-bulk-menu"]',
  mobileBulkToggle: '[data-testid="mobile-bulk-toggle"]',
  
  // Keyboard shortcuts info
  keyboardShortcuts: '[data-testid="bulk-keyboard-shortcuts"]',
  shortcutHint: '[data-testid="bulk-shortcut-hint"]'
};

module.exports = { BulkSelectors };