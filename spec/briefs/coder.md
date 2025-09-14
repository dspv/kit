# Coder Brief - Summary for Developers

> **🎯 Auto-generated summary** | Updated: 2025-09-14 07:26:02

## 🚀 TL;DR for Coder

**Project**: [Project Name]  
**Stage**: [incubate/beta/release]  
**Tech Stack**: Go + React + PostgreSQL + Redis  
**Current Focus**: [Current Task]

## 🏗️ Architecture (Brief)

```
Frontend (React/TS) ←→ API (Go) ←→ DB (PostgreSQL)
                              ↓
                         Cache (Redis)
```

### Key Components
- **API**: `/apps/api/` - Go (Gin/Fiber + GORM)
- **Frontend**: `/apps/ui/` - React + TypeScript + Tailwind
- **Database**: PostgreSQL + Redis cache
- **Deployment**: Docker + Kubernetes

## 📋 Current Tasks

### In Progress
- [ ] [Task 1] - [status] - [deadline]
- [ ] [Task 2] - [status] - [deadline]

### Next
- [ ] [Task 3] - [priority]
- [ ] [Task 4] - [priority]

## 🔧 Quick Start

```bash
# Clone
git clone [repo-url]
cd [project-name]

# Development
make dev
# or
docker compose up --build

# Tests
make test
make lint
```

## 📝 Coding Rules

### Commits
```
feat: brief description

- what was done
- what tests added
- what risks

Refs: spec/arch.md#Components; spec/policy.md#Rules
```

### PR Requirements
- ✅ Lint passed
- ✅ Tests passed  
- ✅ README updated
- ✅ Refs added: `spec/arch.md#Components; spec/policy.md#Rules`

### Database
- **Migrations**: Use `/apps/api/migrations/`
- **DB**: Migrations in `/apps/api/migrations/`

## 🧪 Testing

### Local
```bash
# Unit tests
make test-unit

# Integration tests  
make test-integration

# E2E tests
make test-e2e

# All tests
make test
```

### CI/CD
```bash
# Lint check
make lint

# Security scan
make security-scan

# Build check
make build
```

## 🔐 Security

### Critical
- ❌ Never commit secrets
- ✅ Validate all input data
- ✅ JWT for authorization
- ✅ HTTPS only

### Logging
```go
// ✅ Correct
log.Info("User action", "user_id", userID, "action", "login")

// ❌ Wrong - Don't log PII!
log.Info("User login", "email", user.Email)
```

## 📊 Performance

### Monitoring
- Response time < 200ms
- Memory usage < 512MB
- CPU usage < 70%

### Optimization
- Redis caching
- DB indexes on frequent queries
- Connection pooling

## 🚨 Common Issues

### Database
```go
// ✅ Correct
tx := db.Begin()
defer tx.Rollback()
// ... operations
tx.Commit()

// ❌ Wrong
db.Create(&model) // without transaction
```

### API
```go
// ✅ Correct
if err := validate.Struct(req); err != nil {
    return c.Status(400).JSON(fiber.Map{"error": err.Error()})
}
```

## 🔗 Quick Links

- **Full Architecture**: spec/arch.md
- **API Documentation**: spec/api.md
- **Project Rules**: spec/policy.md

## 📞 Contacts

- **Tech Lead**: [contact]
- **DevOps**: [contact]
- **QA**: [contact]

---

**Sources**: spec/arch.md, spec/api.md, spec/policy.md