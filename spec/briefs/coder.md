# Coder Brief - Summary for Developers

> **🎯 Auto-generated summary** | Updated: 2025-09-13 23:50:27

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

## 🔧 Быстрый старт

```bash
# Клонирование
git clone [repo-url]
cd [project-name]

# Разработка
make dev
# или
docker compose up --build

# Тесты
make test
make lint
```

## 📝 Правила кодинга

### Коммиты
```
feat: краткое описание

- что сделано
- какие тесты добавлены
- какие риски
```

### PR Requirements
- ✅ Lint прошёл
- ✅ Тесты прошли  
- ✅ README обновлён
- ✅ Refs добавлены: `spec/arch.md#Components; spec/policy.md#Rules`

### Code Style
- **Go**: Standard lib, explicit errors, structured logs
- **TypeScript**: Strict mode, functional components
- **API**: RESTful, `/api/v1/` prefix
- **DB**: Migrations в `/apps/api/migrations/`

## 🧪 Тестирование

### Локально
```bash
# Backend
cd apps/api
go test ./...

# Frontend
cd apps/ui
npm test

# Integration
make test-integration
```

### CI Pipeline
1. Lint → Build → Unit Tests → Integration Tests → Deploy

## 🔐 Безопасность

### Критично
- ❌ Никогда не коммитить секреты
- ✅ Валидировать все входные данные
- ✅ JWT для авторизации
- ✅ HTTPS только
- ✅ Rate limiting

### Логирование
```go
log.Info("action completed", 
    "user_id", userID,
    "action", "create_resource",
    // НЕ логировать PII!
)
```

## 📊 Производительность

### Targets
- Response time: <200ms
- Throughput: 1000 RPS
- Uptime: 99.9%

### Оптимизация
- Redis кэширование
- DB индексы на частые запросы
- Connection pooling

## 🚨 Частые проблемы

### Database
```go
// ✅ Правильно
tx := db.Begin()
defer tx.Rollback()
// ... operations ...
tx.Commit()

// ❌ Неправильно
db.Create(&model) // без транзакции
```

### API Errors
```go
// ✅ Правильно
if err != nil {
    return c.Status(400).JSON(ErrorResponse{
        Success: false,
        Error: ErrorDetail{
            Code: "VALIDATION_FAILED",
            Message: "Invalid input data",
        },
    })
}
```

## 🔗 Быстрые ссылки

- **Полная архитектура**: spec/arch.md
- **API документация**: spec/api.md
- **Правила**: spec/policy.md
- **Roadmap**: spec/roadmap.md

## 📞 Контакты

- **Tech Lead**: [контакт]
- **DevOps**: [контакт]
- **QA**: [контакт]

---

**Источники**: spec/arch.md, spec/api.md, spec/policy.md  
**Refs**: spec/arch.md#Development; spec/policy.md#Coding
