# System Architecture

> **🎯 Purpose**: Technical architecture and system components

## 🏗️ Overall Architecture

### High-level Overview
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │   Backend   │    │  Database   │
│   (React)   │◄──►│    (Go)     │◄──►│(PostgreSQL) │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    CDN      │    │   Cache     │    │   Queue     │
│ (Static)    │    │  (Redis)    │    │ (Redis)     │
└─────────────┘    └─────────────┘    └─────────────┘
```

### System Components

#### Frontend Layer
- **Technology**: TypeScript + React/Next.js + Tailwind
- **Responsibility**: UI/UX, client-side logic
- **Communication**: REST API, WebSocket (optional)

#### Backend Layer  
- **Technology**: Go (Gin/Fiber) + GORM
- **Responsibility**: Business logic, API, authorization
- **Communication**: HTTP REST, gRPC (internal services)

#### Data Layer
- **Primary DB**: PostgreSQL (main data)
- **Cache**: Redis (sessions, cache)
- **Queue**: Redis (background jobs)

## 🔧 Detailed Architecture

### Monorepo Structure
```
project/
├── apps/
│   ├── api/              # Go backend
│   │   ├── cmd/          # Entry points
│   │   ├── internal/     # Business logic
│   │   ├── pkg/          # Shared packages
│   │   └── migrations/   # DB migrations
│   ├── ui/               # React frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── hooks/
│   │   └── public/
│   └── worker/           # Background jobs
├── libs/
│   ├── shared/           # Common types/utils
│   └── proto/            # gRPC definitions
└── infra/
    ├── docker/           # Dockerfiles
    ├── k8s/              # Kubernetes manifests
    └── terraform/        # Infrastructure as Code
```

### API Architecture

#### REST API Design
```
/api/v1/
├── auth/                 # Авторизация
│   ├── POST /login
│   ├── POST /register
│   └── POST /refresh
├── users/                # Пользователи
│   ├── GET /users
│   ├── GET /users/:id
│   └── PUT /users/:id
└── [resource]/           # Другие ресурсы
    ├── GET /[resource]
    ├── POST /[resource]
    ├── GET /[resource]/:id
    ├── PUT /[resource]/:id
    └── DELETE /[resource]/:id
```

#### Поток аутентификации
```
Client → POST /api/v1/auth/login → JWT Token
Client → Header: Authorization: Bearer <token>
API → Validate JWT → Process Request
```

## 🗄️ База данных

### Дизайн схемы
```sql
-- Пример основных таблиц
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE [main_entity] (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    [fields...],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Стратегия миграций
- **Инструмент**: golang-migrate
- **Расположение**: `/apps/api/migrations/`
- **Именование**: `YYYYMMDD_HHMMSS_description.up.sql`
- **Откат**: Всегда создавать `.down.sql`

## 🔐 Безопасность

### Аутентификация и авторизация
- **JWT Tokens**: Access (15min) + Refresh (7 days)
- **Password**: bcrypt hashing
- **Rate Limiting**: По IP и пользователю
- **CORS**: Настроенные origins

### Защита данных
- **Encryption**: TLS 1.3 для всех соединений
- **Secrets**: Vault/K8s secrets
- **Logging**: Без PII данных
- **Validation**: Все входные данные

## 📊 Производительность

### Стратегия кэширования
```
Request → Check Redis Cache → If Miss → Database → Cache Result
```

### Оптимизация базы данных
- **Indexes**: На часто используемые поля
- **Connection Pool**: Настроенный размер
- **Query Optimization**: EXPLAIN для медленных запросов

### Мониторинг
- **Metrics**: Prometheus + Grafana
- **Logs**: Structured JSON logs
- **Tracing**: OpenTelemetry (опционально)
- **Health Checks**: `/health` endpoints

## 🚀 Развёртывание

### Контейнеризация
```dockerfile
# Multi-stage build
FROM golang:1.21-alpine AS builder
# ... build steps ...

FROM alpine:latest
# ... runtime setup ...
```

### Развёртывание в Kubernetes
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: [app-name]
spec:
  replicas: 3
  selector:
    matchLabels:
      app: [app-name]
  template:
    spec:
      containers:
      - name: [app-name]
        image: [image]
        ports:
        - containerPort: 8080
```

## 🔄 Процесс разработки

### Локальная разработка
```bash
# Backend
cd apps/api
air  # Hot reload

# Frontend  
cd apps/ui
npm run dev

# Full stack
docker compose up --build
```

### Конвейер CI/CD
1. **Lint** → Code quality checks
2. **Test** → Unit + Integration tests
3. **Build** → Docker images
4. **Deploy** → Staging → Production

## 🧪 Стратегия тестирования

### Пирамида тестов
```
    E2E Tests (Few)
   ─────────────────
  Integration Tests (Some)
 ─────────────────────────────
Unit Tests (Many)
```

### Категории тестов
- **Unit**: Бизнес-логика, утилиты
- **Integration**: API endpoints, DB queries
- **E2E**: Критичные user flows

## 📈 Масштабируемость

### Горизонтальное масштабирование
- **Stateless Services**: Легко масштабируются
- **Load Balancer**: Nginx/K8s Ingress
- **Database**: Read replicas для чтения

### Целевые показатели производительности
| Metric | Target | Current |
|--------|--------|---------|
| Response Time | <200ms | TBD |
| Throughput | 1000 RPS | TBD |
| Uptime | 99.9% | TBD |

## 🔗 Внешние интеграции

### Необходимые API
- **[API Name]**: [Purpose and usage]
- **[API Name]**: [Purpose and usage]

### Опциональные интеграции
- **[Service]**: [Future integration]
- **[Service]**: [Future integration]

---

**Последнее обновление**: [дата] | **Ссылки**: spec/api.md#Эндпоинты; spec/policy.md#Безопасность
