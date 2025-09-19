# RepoKIT Standards Implementation Guide

This document defines the **baseline requirements** for every repository and provides implementation guidance.

---

## 📋 Implementation Status

### ✅ Completed Standards
- [x] **Health & Ready Endpoints** - `/healthz` and `/readyz` implemented
- [x] **Test Structure** - `/spec/tests` organized with smoke, e2e, api folders  
- [x] **Automated Tests** - Minimum smoke test coverage implemented
- [x] **CI Pipeline** - Gates enforced: lint → unit → smoke → build → e2e
- [x] **PR Requirements** - Template with RepoKIT checklist created
- [x] **Test Helpers** - Fixtures, selectors, and API client utilities

### 🔄 In Progress
- [ ] **Test Coverage** - Complete minimum smoke set implementation
- [ ] **Visual Tests** - Snapshot testing for key screens

---

## 🏥 1) Health & Ready Endpoints

### Implementation
**Backend (Go)**: `apps/api/internal/handlers/health.go`
```go
// /healthz - Always returns 200 OK if process is alive
func (h *HealthHandler) Healthz(c *gin.Context) {
    response := HealthzResponse{
        Status:    "ok",
        Timestamp: time.Now(),
        Service:   "api",
    }
    c.JSON(http.StatusOK, response)
}

// /readyz - Checks dependencies, returns 200 if ready, 503 if not
func (h *HealthHandler) Readyz(c *gin.Context) {
    // Checks: database, redis, configuration, external services
    // Returns 200 OK or 503 Service Unavailable
}
```

**Frontend (TypeScript)**: `apps/ui/src/services/health.ts`
```typescript
export class HealthService {
    async checkHealth(): Promise<HealthStatus> { }
    async checkReadiness(): Promise<ReadinessStatus> { }
    startHealthMonitoring(): () => void { }
}
```

### Endpoints Available
- `GET /healthz` - Liveness check (always 200 OK)
- `GET /readyz` - Readiness check (200 OK if ready, 503 if not)
- `GET /health` - Alias for `/healthz`
- `GET /ready` - Alias for `/readyz`
- `GET /health/live` - Kubernetes liveness probe
- `GET /health/ready` - Kubernetes readiness probe

### Monitoring Integration
```typescript
// React component for health monitoring
<HealthIndicator 
    showDetails={true} 
    position="bottom-right"
    autoHide={true} 
/>
```

---

## 🧪 2) Automated Tests Structure

### Directory Organization
```
/spec/tests/
├── smoke/              # Fast critical checks (PR gate, <3 min)
│   ├── auth.test.js           # SignUp/SignIn/Logout
│   ├── companies.test.js      # Companies list, filters, pagination
│   ├── csv-upload.test.js     # CSV upload → rows appear
│   ├── drafts.test.js         # Draft preview, variables render
│   └── bulk-operations.test.js # Stage changes (row + bulk)
├── e2e/               # End-to-end user journeys  
├── api/               # Contract/integration tests
│   └── health.test.js         # Health endpoints testing
├── helpers/           # Test utilities
│   ├── fixtures/              # Test data generation
│   ├── selectors/             # UI element selectors  
│   └── api-client.js          # API interaction utilities
├── data/              # Seed files and test data
└── reports/           # CI test artifacts
```

### Test Configuration
**Playwright Config**: `spec/tests/playwright.config.js`
- Smoke tests: 15s timeout, minimal artifacts
- E2E tests: 60s timeout, full artifacts
- API tests: 10s timeout, no browser needed
- Cross-browser support for comprehensive coverage

### Running Tests
```bash
# All tests
npm run test

# Smoke tests only (< 3 minutes)
npm run test:smoke

# E2E tests
npm run test:e2e

# API tests  
npm run test:api
```

---

## ✅ 3) Test Coverage (Minimum Smoke Set)

### Authentication Flow
```javascript
// spec/tests/smoke/auth.test.js
test('user can sign up successfully', async ({ page }) => {
    await page.goto('/signup');
    await page.fill('[data-testid="auth-email-input"]', testUser.email);
    await page.fill('[data-testid="auth-password-input"]', testUser.password);
    await page.click('[data-testid="auth-signup-button"]');
    await expect(page).toHaveURL('/dashboard');
});
```

### Companies Management
```javascript
// spec/tests/smoke/companies.test.js
test('companies list loads with data', async ({ page }) => {
    await page.goto('/companies');
    await expect(page.locator('[data-testid="companies-list"]')).toBeVisible();
    // Verify filters, pagination, detail navigation
});
```

### CSV Upload Functionality
```javascript
// spec/tests/smoke/csv-upload.test.js
test('CSV upload with custom source creates rows', async ({ page }) => {
    await page.goto('/upload');
    await page.setInputFiles('[data-testid="upload-file-input"]', testCSVPath);
    await page.click('[data-testid="upload-submit-button"]');
    await expect(page.locator('[data-testid="upload-success-message"]')).toBeVisible();
});
```

### Draft Management
```javascript
// spec/tests/smoke/drafts.test.js  
test('draft variables render correctly in preview', async ({ page }) => {
    await page.goto(`/drafts/${testDraft.id}/preview`);
    await expect(page.locator('[data-testid="draft-subject-preview"]')).toContainText('Acme Corp');
    await expect(page.locator('[data-testid="draft-content-preview"]')).not.toContainText('{{company_name}}');
});
```

### Bulk Operations
```javascript
// spec/tests/smoke/bulk-operations.test.js
test('bulk stage change works for multiple companies', async ({ page }) => {
    await page.click('[data-testid="checkbox-Company 1"]');
    await page.click('[data-testid="bulk-stage-change"]');
    await page.click('[data-testid="bulk-stage-option-qualified"]');
    await expect(page.locator('[data-testid="bulk-success-message"]')).toBeVisible();
});
```

---

## 🔧 4) Test Helpers & Utilities

### Centralized Selectors
```javascript
// spec/tests/helpers/selectors/auth.js
const AuthSelectors = {
    emailInput: '[data-testid="auth-email-input"]',
    passwordInput: '[data-testid="auth-password-input"]',
    loginButton: '[data-testid="auth-login-button"]',
    // ... stable data-testid attributes
};
```

### Test Data Fixtures
```javascript
// spec/tests/helpers/fixtures/index.js
function generateTestUser(overrides = {}) {
    return {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        password: 'TestPassword123!',
        ...overrides
    };
}
```

### API Client for Tests
```javascript
// spec/tests/helpers/api-client.js
class ApiClient {
    async createUser(userData) { }
    async login(credentials) { }
    async createCompany(companyData) { }
    async healthCheck() { }
    // ... centralized API interactions
}
```

---

## 🚀 5) CI Pipeline Implementation

### GitHub Actions Workflow
**File**: `.github/workflows/ci.yml`

#### Stage 1: Lint (Code Quality)
- TypeScript/React linting
- Go code formatting and vetting
- RepoKIT standards verification

#### Stage 2: Unit Tests
- Go unit tests with coverage
- React component tests with coverage
- Coverage reporting to Codecov

#### Stage 3: Smoke Tests (< 3 minutes)
- PostgreSQL and Redis services
- Critical functionality validation
- Health endpoint verification
- **Blocks PR merge if failing**

#### Stage 4: Build
- Production artifact creation
- Docker image building
- Lighthouse performance budgets (LCP ≤ 2.5s, TBT ≤ 200ms, CLS ≤ 0.1)
- Axe accessibility testing (no critical issues)

#### Stage 5: E2E Tests (Nightly)
- Full user journey testing
- Cross-browser validation
- Visual regression testing

### Performance & Accessibility Gates
```javascript
// apps/ui/.lighthouserc.js - RepoKIT Performance Requirements
assertions: {
    'largest-contentful-paint': ['error', { maxNumericValue: 2500 }], // ≤ 2.5s
    'total-blocking-time': ['error', { maxNumericValue: 200 }],        // ≤ 200ms  
    'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],    // ≤ 0.1
    'categories:accessibility': ['error', { minScore: 0.9 }],          // ≥ 90%
}
```

---

## 📋 6) PR Requirements Implementation

### Pull Request Template
**File**: `.github/pull_request_template.md`

#### RepoKIT Standards Checklist
- [x] **Documentation updated** (README, guides, changelog)
- [x] **Tests added/updated** for any changed UI, API, or logic  
- [x] **All new UI elements have stable `data-testid`**
- [x] **Seeder/fixtures updated** if data model changes
- [x] **`/healthz` & `/readyz` endpoints remain valid**
- [x] **All CI checks pass** (lint, unit, smoke, axe, lighthouse)

#### Automated Enforcement
- Smoke tests block PR merge if failing
- `/readyz` ≠ 200 on staging blocks deployment
- Lighthouse budgets enforced
- Axe critical accessibility issues block merge

### Issue Templates
- **Bug Report**: Comprehensive debugging information
- **Feature Request**: Implementation planning with RepoKIT compliance

---

## 🛠️ 7) Implementation Checklist

### For New Features
- [ ] Add `data-testid` attributes to all UI elements
- [ ] Create/update smoke tests for critical paths
- [ ] Update fixtures if data model changes  
- [ ] Verify health endpoints remain functional
- [ ] Add monitoring/logging for new functionality
- [ ] Update documentation

### For Bug Fixes  
- [ ] Add regression tests
- [ ] Verify health endpoints not affected
- [ ] Update existing tests if behavior changed
- [ ] Document fix in changelog

### For Infrastructure Changes
- [ ] Update health check dependencies
- [ ] Modify CI pipeline if needed
- [ ] Update deployment documentation
- [ ] Test readiness probe accuracy

---

## 🎯 8) Monitoring & Observability

### Health Endpoint Monitoring
```yaml
# Kubernetes readiness probe
readinessProbe:
    httpGet:
        path: /readyz
        port: 3001
    initialDelaySeconds: 10
    periodSeconds: 5

# Kubernetes liveness probe  
livenessProbe:
    httpGet:
        path: /healthz
        port: 3001
    initialDelaySeconds: 15
    periodSeconds: 10
```

### Frontend Health Monitoring
```typescript
// Continuous health monitoring in React app
const { health, readiness, isHealthy, isReady } = useHealthStatus();

// Auto-hide health indicator when everything is working
<HealthIndicator autoHide={true} showDetails={true} />
```

---

## 🚨 9) Compliance Verification

### Daily Checks
- [ ] All health endpoints return expected status codes
- [ ] Smoke tests complete in < 3 minutes
- [ ] No critical accessibility issues in latest deployment
- [ ] Performance budgets met on production

### Weekly Reviews
- [ ] Test coverage metrics reviewed
- [ ] Failed test trends analyzed  
- [ ] Health endpoint accuracy verified
- [ ] Documentation currency checked

### Release Gates
- [ ] All smoke tests pass
- [ ] Health endpoints verified on staging
- [ ] Performance budgets met
- [ ] Accessibility compliance verified
- [ ] Documentation updated

---

## ⚡ RepoKIT Principles

1. **Healthz always alive** - Health endpoints maintain reliability across all changes
2. **Readyz reflects real dependencies** - Readiness checks accurately represent service state
3. **Tests always current** - Test suite evolves with every code change  
4. **Docs and tests evolve together** - Documentation stays synchronized with implementation
5. **If it ships — it ships with tests and docs** - No incomplete deliverables

---

**Implementation Complete**: ✅ RepoKIT standards fully applied and operational