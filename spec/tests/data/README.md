# Test Data Directory

This directory contains static test data files and seed data for tests.

## Structure

```
/data/
├── users.json          # Sample user data
├── companies.json      # Sample company data  
├── drafts.json         # Sample draft templates
├── test-upload.csv     # Sample CSV for upload tests
└── README.md          # This file
```

## Usage

Test data files are used by:
- Smoke tests for consistent test scenarios
- E2E tests for comprehensive user journeys  
- API tests for contract validation
- Fixtures generation in helpers/fixtures/

## Data Guidelines

- Use realistic but anonymized data
- Include edge cases and boundary conditions
- Maintain data relationships (foreign keys)
- Update when data model changes
- Keep file sizes manageable for CI performance

## RepoKIT Compliance

Test data supports RepoKIT requirements:
- Consistent test scenarios across environments
- Reliable smoke test execution (< 3 min)
- Comprehensive E2E coverage
- API contract validation