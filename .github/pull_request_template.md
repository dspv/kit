# Pull Request - RepoKIT Standards Compliance

## 📋 Description
<!-- Provide a brief description of the changes in this PR -->

### Type of Change
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🔧 Configuration change
- [ ] 🧪 Test improvements
- [ ] ♻️ Code refactoring (no functional changes)
- [ ] ⚡ Performance improvements

## 🎯 Related Issues
<!-- Link to related issues using: Fixes #123, Closes #456, Related to #789 -->

## 🧪 Testing
<!-- Describe how this change has been tested -->

### Test Coverage
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated  
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## ✅ RepoKIT Standards Checklist

### 📖 Documentation Requirements
- [ ] **Documentation updated** (README, guides, changelog)
- [ ] Code comments added for complex logic
- [ ] API documentation updated (if applicable)
- [ ] Breaking changes documented

### 🧪 Testing Requirements  
- [ ] **Tests added/updated** for any changed UI, API, or logic
- [ ] **All new UI elements have stable `data-testid`** attributes
- [ ] **Seeder/fixtures updated** if data model changes
- [ ] Visual regression tests added for UI changes (if applicable)
- [ ] Test coverage maintained or improved

### 🏥 Health & Monitoring
- [ ] **`/healthz` and `/readyz` endpoints remain valid** and functional
- [ ] Health checks updated if new dependencies added
- [ ] Monitoring/logging added for new features
- [ ] Error handling implemented and tested

### 🚀 CI/CD Requirements
- [ ] **All CI checks pass** (lint, unit, smoke, axe, lighthouse)
- [ ] **Smoke tests pass** (< 3 minutes runtime)
- [ ] Build succeeds without warnings
- [ ] Security scans pass (if applicable)

### 📊 Performance & Accessibility  
- [ ] **Lighthouse budgets enforced**: LCP ≤ 2.5s, TBT ≤ 200ms, CLS ≤ 0.1
- [ ] **Axe reports no critical accessibility issues**
- [ ] Performance impact assessed (if applicable)
- [ ] Bundle size impact considered

### 🔒 Security & Quality
- [ ] No secrets or sensitive data in code
- [ ] Input validation implemented
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection implemented
- [ ] Error messages don't leak sensitive information

## 📝 Implementation Details

### Changes Made
<!-- List the main changes made in this PR -->
- 
- 
- 

### Technical Decisions
<!-- Explain any significant technical decisions or trade-offs -->

### Database Changes
<!-- If applicable, describe any database schema changes -->
- [ ] Migrations created
- [ ] Backward compatibility maintained
- [ ] Data migration strategy documented

## 🔍 Review Focus Areas
<!-- Highlight specific areas that need careful review -->
- 
- 
- 

## 📸 Screenshots/Recordings
<!-- Add screenshots or recordings for UI changes -->

### Before
<!-- Screenshots of current state -->

### After  
<!-- Screenshots of new state -->

## 🚀 Deployment Notes
<!-- Any special considerations for deployment -->

### Environment Variables
<!-- List any new environment variables needed -->
- [ ] No new environment variables required
- [ ] New environment variables documented in `.env.example`

### Infrastructure Changes
<!-- Any infrastructure or configuration changes -->
- [ ] No infrastructure changes required
- [ ] Infrastructure changes documented

### Rollback Plan
<!-- How to rollback if issues occur -->

## 📋 Post-Merge Checklist
<!-- Items to complete after merge -->
- [ ] Deploy to staging environment
- [ ] Verify health endpoints on staging
- [ ] Run smoke tests on staging
- [ ] Update production deployment docs (if needed)
- [ ] Monitor error rates and performance metrics

## 🔗 Additional Context
<!-- Any additional context, background, or links that reviewers should know about -->

---

## ⚡ RepoKIT Principles Applied
- [x] **Healthz always alive** - Health endpoints maintain reliability
- [x] **Readyz reflects real dependencies** - Readiness checks are accurate  
- [x] **Tests always current** - Test suite updated with changes
- [x] **Docs and tests evolve together** - Documentation kept in sync
- [x] **If it ships — it ships with tests and docs** - Complete deliverable

---

<!-- 
🚨 IMPORTANT: This PR will be blocked from merging if:
- Smoke tests fail
- Health endpoints return non-200 status on staging
- Critical accessibility issues found
- Lighthouse performance budgets exceeded
- RepoKIT checklist items not completed

For questions about RepoKIT standards, see: /spec/repokit-standards.md
-->

/cc @team <!-- Tag relevant team members -->