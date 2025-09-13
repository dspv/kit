# Tester Brief - Summary for Testers

> **🎯 Auto-generated summary** | Updated: 2025-09-13 23:50:27

## 🧪 TL;DR for Tester

**Project**: [Project Name]  
**Stage**: [incubate/beta/release]  
**Тест-стратегия**: Unit → Integration → E2E  
**Текущий фокус**: [Текущая область тестирования]

## 📋 Что тестируем

### Критичные функции
1. **Авторизация** - login/logout/register
2. **[Main Feature 1]** - [описание]
3. **[Main Feature 2]** - [описание]
4. **API endpoints** - все CRUD операции

### Текущие задачи
- [ ] [Тест-задача 1] - [статус]
- [ ] [Тест-задача 2] - [статус]
- [ ] [Тест-задача 3] - [статус]

## 🎯 Тест-пирамида

```
      E2E (Few)
    ─────────────
   Integration (Some)
  ─────────────────────
 Unit Tests (Many)
```

### Unit Tests (80%)
- **Backend**: Бизнес-логика, утилиты
- **Frontend**: Компоненты, хуки, утилиты
- **Target**: >80% покрытие

### Integration Tests (15%)
- **API endpoints**: Все CRUD операции
- **Database**: Queries, migrations
- **External APIs**: Mocked интеграции

### E2E Tests (5%)
- **Critical paths**: Регистрация → Login → Основной flow
- **Browser testing**: Chrome, Firefox, Safari
- **Mobile**: Responsive design

## 🔧 Инструменты

### Backend Testing
```bash
# Unit tests
cd apps/api
go test ./... -v -cover

# Integration tests
go test ./tests/integration/... -v

# Test coverage
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

### Frontend Testing
```bash
# Unit tests
cd apps/ui
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

### API Testing
```bash
# Postman collection
newman run postman_collection.json

# Manual testing
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## 📊 Test Cases

### Authentication Flow
```
1. Register new user
   ✅ Valid data → Success
   ❌ Invalid email → Error
   ❌ Weak password → Error
   ❌ Duplicate email → Error

2. Login
   ✅ Valid credentials → JWT token
   ❌ Wrong password → Error
   ❌ Non-existent user → Error

3. Protected endpoints
   ✅ Valid token → Access granted
   ❌ No token → 401 Unauthorized
   ❌ Expired token → 401 Unauthorized
```

### [Main Feature] Testing
```
1. Create [Resource]
   ✅ Valid data → Created
   ❌ Missing required fields → Validation error
   ❌ Invalid format → Format error

2. Read [Resource]
   ✅ Existing resource → Data returned
   ❌ Non-existent → 404 Not Found
   ❌ No permission → 403 Forbidden

3. Update [Resource]
   ✅ Valid changes → Updated
   ❌ Invalid data → Validation error
   ❌ Not owner → 403 Forbidden

4. Delete [Resource]
   ✅ Own resource → Deleted
   ❌ Not owner → 403 Forbidden
   ❌ Non-existent → 404 Not Found
```

## 🚨 Критичные сценарии

### Security Testing
- [ ] SQL Injection attempts
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] Input validation
- [ ] Authentication bypass

### Performance Testing
- [ ] Load testing (1000 concurrent users)
- [ ] Stress testing (до отказа)
- [ ] Response time (<200ms)
- [ ] Memory leaks
- [ ] Database performance

### Edge Cases
- [ ] Empty/null inputs
- [ ] Very long strings
- [ ] Special characters
- [ ] Concurrent operations
- [ ] Network failures
- [ ] Database unavailable

## 📈 Метрики качества

### Coverage Targets
| Component | Target | Current |
|-----------|--------|---------|
| Backend Unit | >80% | TBD |
| Frontend Unit | >70% | TBD |
| Integration | >60% | TBD |
| E2E Critical | 100% | TBD |

### Bug Tracking
| Severity | Count | Status |
|----------|-------|--------|
| Critical | 0 | ✅ |
| High | TBD | 🔄 |
| Medium | TBD | 🔄 |
| Low | TBD | 📋 |

## 🔄 Test Automation

### CI Pipeline
```yaml
1. Lint → Code quality
2. Unit Tests → Fast feedback
3. Build → Integration ready
4. Integration Tests → API testing
5. E2E Tests → User scenarios
6. Deploy → Staging/Production
```

### Test Data Management
```bash
# Test database setup
make test-db-setup

# Seed test data
make test-data-seed

# Cleanup
make test-db-cleanup
```

## 🐛 Bug Reporting

### Bug Report Template
```markdown
## Bug Description
[Краткое описание]

## Steps to Reproduce
1. [Шаг 1]
2. [Шаг 2]
3. [Шаг 3]

## Expected Result
[Что должно было произойти]

## Actual Result
[Что произошло на самом деле]

## Environment
- Browser: [версия]
- OS: [система]
- API Version: [версия]

## Refs
spec/api.md#Endpoint; spec/arch.md#Component
```

## 🔗 Полезные ссылки

- **API документация**: spec/api.md
- **Архитектура**: spec/arch.md
- **Test environment**: [URL]
- **Bug tracker**: [URL]

## 📞 Контакты

- **QA Lead**: [контакт]
- **Developers**: [контакт]
- **DevOps**: [контакт]

---

**Источники**: spec/api.md, spec/arch.md, spec/policy.md  
**Refs**: spec/arch.md#Testing; spec/policy.md#Quality
