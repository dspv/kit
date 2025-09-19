# Test Suite - RepoKIT Standards

This directory contains all automated tests following RepoKIT standards.

## Directory Structure

```
/spec/tests/
├── smoke/          # Fast critical checks (PR gate, <3 min)
├── e2e/           # End-to-end user journeys
├── api/           # Contract/integration tests
├── helpers/       # Test utilities and fixtures
│   ├── fixtures/  # Test data and seed files
│   ├── selectors/ # UI element selectors
│   └── api-client.js # API client for tests
├── data/          # Seed files and test data
└── reports/       # CI test artifacts
```

## Test Categories

### Smoke Tests (`/smoke`)
- **Purpose**: Fast critical checks that must pass before merge
- **Runtime**: < 3 minutes total
- **Scope**: Core functionality validation
- **When**: Every PR, before deployment

### End-to-End Tests (`/e2e`)
- **Purpose**: Complete user journeys and workflows
- **Runtime**: < 15 minutes total
- **Scope**: User scenarios from start to finish
- **When**: Nightly runs, pre-deployment

### API Tests (`/api`)
- **Purpose**: Contract and integration testing
- **Runtime**: < 5 minutes total
- **Scope**: API endpoints, data validation, error handling
- **When**: Every PR, continuous integration

## Test Data Management

### Fixtures (`/helpers/fixtures`)
- Consistent test data across all test types
- JSON files with sample data
- Database seeders for integration tests

### Selectors (`/helpers/selectors`)
- Centralized UI element selectors
- Stable `data-testid` attributes
- Page object patterns

## Running Tests

```bash
# All tests
npm run test

# Smoke tests only (fast)
npm run test:smoke

# E2E tests
npm run test:e2e

# API tests
npm run test:api

# With coverage
npm run test:coverage
```

## RepoKIT Requirements

✅ **Minimum Smoke Coverage**:
- SignUp / SignIn / Logout
- Companies list (load, filters, pagination)  
- Company detail page (Jobs / Contacts / Drafts / Reasoning)
- Stage change (row + bulk)
- CSV upload (custom source) → rows appear
- Draft preview (variables render, save)

✅ **Test Standards**:
- Tests always current with features
- Visual tests (snapshots) for key screens
- All new UI elements have `data-testid`
- Seeder/fixtures updated with data model changes

✅ **CI Integration**:
- Smoke tests block PR merge if failing
- All tests run in CI pipeline
- Test reports generated and archived