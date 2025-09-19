/**
 * Companies Selectors
 * RepoKIT Standard: Centralized UI selectors with stable data-testid
 */

const CompanySelectors = {
  // Companies list page
  companiesList: '[data-testid="companies-list"]',
  companyRow: '[data-testid^="company-"]',
  companyName: '[data-testid="company-name"]',
  companyStage: '[data-testid="company-stage"]',
  companyEmail: '[data-testid="company-email"]',
  companyPhone: '[data-testid="company-phone"]',
  companyWebsite: '[data-testid="company-website"]',
  
  // Individual company elements (dynamic)
  companyById: (id) => `[data-testid="company-${id}"]`,
  companyStageById: (id) => `[data-testid="company-stage-${id}"]`,
  
  // Filters and search
  searchInput: '[data-testid="companies-search-input"]',
  searchButton: '[data-testid="companies-search-button"]',
  clearSearchButton: '[data-testid="companies-clear-search"]',
  
  stageFilter: '[data-testid="companies-stage-filter"]',
  stageFilterOption: (stage) => `[data-testid="stage-filter-${stage}"]`,
  industryFilter: '[data-testid="companies-industry-filter"]',
  sizeFilter: '[data-testid="companies-size-filter"]',
  locationFilter: '[data-testid="companies-location-filter"]',
  clearFilters: '[data-testid="companies-clear-filters"]',
  
  // Sorting
  sortByName: '[data-testid="sort-by-name"]',
  sortByStage: '[data-testid="sort-by-stage"]',
  sortByCreated: '[data-testid="sort-by-created"]',
  sortByUpdated: '[data-testid="sort-by-updated"]',
  sortDirection: '[data-testid="sort-direction"]',
  
  // Pagination
  paginationContainer: '[data-testid="companies-pagination"]',
  paginationPrevious: '[data-testid="pagination-previous"]',
  paginationNext: '[data-testid="pagination-next"]',
  paginationCurrent: '[data-testid="pagination-current"]',
  paginationTotal: '[data-testid="pagination-total"]',
  pageSize: '[data-testid="pagination-page-size"]',
  
  // Actions
  addCompanyButton: '[data-testid="add-company-button"]',
  importButton: '[data-testid="import-companies-button"]',
  exportButton: '[data-testid="export-companies-button"]',
  
  // Stage change dropdowns
  stageDropdown: (companyName) => `[data-testid="stage-dropdown-${companyName}"]`,
  stageOption: (stage) => `[data-testid="stage-option-${stage}"]`,
  
  // Company detail page
  companyDetailContainer: '[data-testid="company-detail"]',
  companyDetailName: '[data-testid="company-detail-name"]',
  companyDetailStage: '[data-testid="company-detail-stage"]',
  companyDetailEmail: '[data-testid="company-detail-email"]',
  companyDetailPhone: '[data-testid="company-detail-phone"]',
  companyDetailWebsite: '[data-testid="company-detail-website"]',
  companyDetailIndustry: '[data-testid="company-detail-industry"]',
  companyDetailSize: '[data-testid="company-detail-size"]',
  companyDetailLocation: '[data-testid="company-detail-location"]',
  companyDetailNotes: '[data-testid="company-detail-notes"]',
  
  // Company detail tabs
  jobsTab: '[data-testid="company-jobs-tab"]',
  contactsTab: '[data-testid="company-contacts-tab"]',
  draftsTab: '[data-testid="company-drafts-tab"]',
  reasoningTab: '[data-testid="company-reasoning-tab"]',
  
  // Tab content areas
  jobsContent: '[data-testid="company-jobs-content"]',
  contactsContent: '[data-testid="company-contacts-content"]',
  draftsContent: '[data-testid="company-drafts-content"]',
  reasoningContent: '[data-testid="company-reasoning-content"]',
  
  // Edit company
  editCompanyButton: '[data-testid="edit-company-button"]',
  saveCompanyButton: '[data-testid="save-company-button"]',
  cancelEditButton: '[data-testid="cancel-edit-button"]',
  deleteCompanyButton: '[data-testid="delete-company-button"]',
  
  // Company form fields
  companyNameInput: '[data-testid="company-name-input"]',
  companyEmailInput: '[data-testid="company-email-input"]',
  companyPhoneInput: '[data-testid="company-phone-input"]',
  companyWebsiteInput: '[data-testid="company-website-input"]',
  companyIndustrySelect: '[data-testid="company-industry-select"]',
  companySizeSelect: '[data-testid="company-size-select"]',
  companyLocationInput: '[data-testid="company-location-input"]',
  companyNotesTextarea: '[data-testid="company-notes-textarea"]',
  
  // Loading and error states
  companiesLoading: '[data-testid="companies-loading"]',
  companiesError: '[data-testid="companies-error"]',
  companyDetailLoading: '[data-testid="company-detail-loading"]',
  companyDetailError: '[data-testid="company-detail-error"]',
  
  // Empty states
  noCompaniesMessage: '[data-testid="no-companies-message"]',
  noSearchResults: '[data-testid="no-search-results"]',
  
  // Bulk operations
  selectAllCheckbox: '[data-testid="select-all-companies"]',
  companyCheckbox: (companyName) => `[data-testid="checkbox-${companyName}"]`,
  
  // Success/error messages
  successMessage: '[data-testid="companies-success-message"]',
  errorMessage: '[data-testid="companies-error-message"]',
  
  // View options
  listView: '[data-testid="companies-list-view"]',
  cardView: '[data-testid="companies-card-view"]',
  tableView: '[data-testid="companies-table-view"]'
};

module.exports = { CompanySelectors };