# Kit AI-First v2.0 - RepoKIT Standards Compliant

🚀 **Status**: RepoKIT Standards Implemented (100%)  
📅 **Timeline**: Production Ready  
🎯 **Focus**: AI-First Development with Enterprise Standards  

> **Single Entry Point** for both humans and AI agents with **RepoKIT compliance**

## 🤖 For AI Agents - Start Here

### Critical Instructions
1. **Always read files in order**: README.md → spec/product.md → spec/roadmap.md
2. **Update progress daily**: Modify progress bars in README.md after each task
3. **Follow stage rules**: Check current stage in spec/roadmap.md
4. **English only**: All code, comments, commits, documentation
5. **Small iterations**: Commit working code frequently with clear descriptions

### Quick Start Commands
```bash
make setup    # Initialize project
make dev      # Start development
make check    # Validate everything
```

### Current Project Status
**Stage**: `prod` (RepoKIT standards enforced)  
**Progress**: ████████████ 100% (RepoKIT Implementation Complete)  
**Standards**: Health endpoints, automated tests, CI gates, PR templates  
**Active Tasks**: See spec/roadmap.md  

## 📦 What's Inside

### Core Files (5 total)
- **README.md** (this file) - Project status and entry point
- **Makefile** - Development automation
- **doctor.sh** - Structure validation and health checks
- **spec/product.md** - What we build + business context
- **spec/roadmap.md** - Development plan + AI task queue

### Project Structure (RepoKIT Compliant)
```
project/
├── README.md              # Status and entry point
├── Makefile               # Automation
├── doctor.sh              # Validation
├── spec/
│   ├── product.md         # Business requirements
│   ├── roadmap.md         # Development plan
│   ├── repokit-standards.md # RepoKIT implementation guide
│   └── tests/             # Test suite (RepoKIT standard)
│       ├── smoke/         # Critical checks (< 3 min)
│       ├── e2e/           # User journeys
│       ├── api/           # Contract tests
│       └── helpers/       # Test utilities
├── apps/                  # Applications
│   ├── api/               # Backend with /healthz & /readyz
│   ├── ui/                # Frontend with health monitoring
│   └── worker/            # Background jobs
├── .github/               # CI/CD & templates
│   ├── workflows/ci.yml   # RepoKIT CI pipeline
│   └── pull_request_template.md # Standards checklist
├── libs/                  # Shared code
└── infra/                 # Infrastructure configs
```

## 🚀 Quick Start

### 1. Copy Template
```bash
cp -r kit/ my-project/
cd my-project/
rm -rf .git/
git init
```

### 2. Configure Project
```bash
# Run validation
./doctor.sh

# Replace placeholders
sed -i 's/\[Project Name\]/My Project/g' *.md spec/*.md
sed -i 's/\[Description\]/AI-powered app/g' *.md spec/*.md
```

### 3. Start Development
```bash
# Setup project structure
make setup

# Start development
make dev

# Validate progress
make check
```

## 🎯 RepoKIT Standards Implemented

### ✅ Health & Ready Endpoints
- `/healthz` - Liveness check (always 200 OK)
- `/readyz` - Readiness check (dependencies validated)
- Available on all services with comprehensive monitoring

### ✅ Automated Test Suite
- **Smoke tests** (< 3 min): Authentication, companies, CSV upload, drafts
- **E2E tests**: Complete user journeys and workflows  
- **API tests**: Contract validation and health endpoints
- **Test helpers**: Fixtures, selectors, API client utilities

### ✅ CI Pipeline Gates
- **lint** → **unit** → **smoke** → **build** → **e2e**
- Lighthouse budgets: LCP ≤ 2.5s, TBT ≤ 200ms, CLS ≤ 0.1
- Axe accessibility: No critical issues allowed
- Smoke tests block PR merge if failing

### ✅ PR Requirements
- Comprehensive checklist with RepoKIT standards
- Documentation and test updates mandatory
- Health endpoint validation required
- All CI checks must pass for merge

## 🤖 AI Agent Guidelines

### Task Selection
1. Read spec/roadmap.md for current tasks
2. Pick highest priority available task
3. Update task status: `todo` → `doing` → `done`
4. Update README.md progress after completion

### Commit Format
```
feat: brief description

- what was implemented
- what was tested
- what's next

Stage: dev | Progress: 25% → 30%
```

### Quality Standards
- **English only**: Code, comments, docs, commits
- **Working code**: Always commit functional increments
- **Clear progress**: Update status bars after each task
- **Small changes**: 1-3 files per commit maximum

## 📊 Progress Tracking

### Overall Progress
**Project**: RepoKIT Standards Implementation  
**Completion**: ████████████ 100%  
**Timeline**: Complete - Production Ready  
**Focus**: Enterprise-grade development standards  

### RepoKIT Implementation Status
| Standard | Progress | Status | Implementation |
|----------|----------|--------|----------------|
| Health Endpoints | ████████████ 100% | ✅ Complete | `/healthz` & `/readyz` |
| Test Structure | ████████████ 100% | ✅ Complete | Smoke, E2E, API tests |
| CI Pipeline | ████████████ 100% | ✅ Complete | 5-stage gates |
| PR Templates | ████████████ 100% | ✅ Complete | Standards checklist |
| Documentation | ████████████ 100% | ✅ Complete | Implementation guide |

**Update this section daily**

## 🔧 Available Commands

```bash
make help         # Show all commands
make setup        # Initialize project structure
make dev          # Start development environment
make test         # Run all tests (includes smoke, e2e, api)
make lint         # Check code quality
make build        # Build all applications
make deploy       # Deploy to staging/production
make clean        # Clean generated files
make check        # Full project validation + RepoKIT compliance
make doctor       # Health check and standards validation
```

### RepoKIT Test Commands
```bash
cd spec/tests

# Run smoke tests (< 3 min, PR gate)
npm run test:smoke

# Run E2E tests (comprehensive)
npm run test:e2e

# Run API tests (contract validation)
npm run test:api

# Run all tests with reporting
npm run test
```

## 📝 File Update Rules

### Daily Updates Required
- **Progress bars**: Update ░░░▓▓▓░░░░ after each completed task
- **Feature status**: Change todo → doing → done
- **Timeline**: Update current week/phase
- **Focus**: Update current work area

### Weekly Updates Required
- **Overall completion**: Recalculate total progress
- **Blockers**: Add/remove current blockers
- **Next week**: Plan upcoming tasks

## 🚨 Critical Rules for AI

### Must Do
- ✅ Read spec/ files before starting work
- ✅ Update progress after each task
- ✅ Commit working code only
- ✅ Use English everywhere
- ✅ Follow stage rules (dev/prod)

### Never Do
- ❌ Commit broken code
- ❌ Use non-English text
- ❌ Skip progress updates
- ❌ Work without reading specs
- ❌ Make large changes without commits

## 🔗 Next Steps

### For Development Teams
1. **Review**: spec/repokit-standards.md (implementation guide)
2. **Understand**: Health endpoints and test structure
3. **Follow**: PR template checklist for all changes
4. **Monitor**: CI pipeline and health indicators

### For New Projects
1. **Copy**: This RepoKIT-compliant template
2. **Customize**: Business logic in spec/product.md
3. **Implement**: Following established patterns
4. **Maintain**: Standards compliance throughout development

### For AI Agents
1. **Read**: spec/product.md → spec/roadmap.md → spec/repokit-standards.md
2. **Follow**: RepoKIT principles in all implementations
3. **Test**: Add smoke tests for critical functionality
4. **Document**: Update guides with implementation details

---

**Kit Version**: 2.0 | **Type**: AI-First + RepoKIT | **Standards**: Enterprise | **Status**: Production Ready  

## ⚡ RepoKIT Principles Applied

- ✅ **Healthz always alive** - Health endpoints maintain reliability
- ✅ **Readyz reflects real dependencies** - Accurate dependency checks  
- ✅ **Tests always current** - Test suite evolves with code
- ✅ **Docs and tests evolve together** - Documentation stays synchronized
- ✅ **If it ships — it ships with tests and docs** - Complete deliverables only
