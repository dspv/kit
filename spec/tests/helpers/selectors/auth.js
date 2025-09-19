/**
 * Authentication Selectors
 * RepoKIT Standard: Centralized UI selectors with stable data-testid
 */

const AuthSelectors = {
  // Login page elements
  emailInput: '[data-testid="auth-email-input"]',
  passwordInput: '[data-testid="auth-password-input"]',
  confirmPasswordInput: '[data-testid="auth-confirm-password-input"]',
  loginButton: '[data-testid="auth-login-button"]',
  signupButton: '[data-testid="auth-signup-button"]',
  
  // Navigation links
  signupLink: '[data-testid="auth-signup-link"]',
  loginLink: '[data-testid="auth-login-link"]',
  forgotPasswordLink: '[data-testid="auth-forgot-password-link"]',
  
  // Messages and feedback
  errorMessage: '[data-testid="auth-error-message"]',
  successMessage: '[data-testid="auth-success-message"]',
  welcomeMessage: '[data-testid="auth-welcome-message"]',
  
  // User menu (when authenticated)
  userMenuButton: '[data-testid="user-menu-button"]',
  userMenuDropdown: '[data-testid="user-menu-dropdown"]',
  logoutButton: '[data-testid="user-logout-button"]',
  profileLink: '[data-testid="user-profile-link"]',
  settingsLink: '[data-testid="user-settings-link"]',
  
  // Form validation
  emailError: '[data-testid="auth-email-error"]',
  passwordError: '[data-testid="auth-password-error"]',
  confirmPasswordError: '[data-testid="auth-confirm-password-error"]',
  
  // Loading states
  loginSpinner: '[data-testid="auth-login-spinner"]',
  signupSpinner: '[data-testid="auth-signup-spinner"]',
  
  // Social auth (if implemented)
  googleAuthButton: '[data-testid="auth-google-button"]',
  githubAuthButton: '[data-testid="auth-github-button"]',
  
  // Password reset
  resetPasswordButton: '[data-testid="auth-reset-password-button"]',
  resetEmailInput: '[data-testid="auth-reset-email-input"]',
  resetSuccessMessage: '[data-testid="auth-reset-success-message"]',
  
  // Two-factor authentication
  twoFactorInput: '[data-testid="auth-2fa-input"]',
  twoFactorButton: '[data-testid="auth-2fa-button"]',
  twoFactorError: '[data-testid="auth-2fa-error"]',
  
  // Terms and privacy
  termsCheckbox: '[data-testid="auth-terms-checkbox"]',
  privacyLink: '[data-testid="auth-privacy-link"]',
  termsLink: '[data-testid="auth-terms-link"]'
};

module.exports = { AuthSelectors };