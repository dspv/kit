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
├── auth/                 # Authentication
│   ├── POST /login
│   ├── POST /register
│   └── POST /refresh
├── users/                # Users
│   ├── GET /users
│   ├── GET /users/:id
│   └── PUT /users/:id
└── [resource]/           # Other resources
    ├── GET /[resource]
    ├── POST /[resource]
    ├── GET /[resource]/:id
    ├── PUT /[resource]/:id
    └── DELETE /[resource]/:id
```

#### Authentication Flow
```
Client → POST /api/v1/auth/login → JWT Token
Client → Header: Authorization: Bearer <token>
API → Validate JWT → Process Request
```

## 🗄️ Database

### Schema Design
```sql
-- Example core tables
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

### Migration Strategy
- **Tool**: golang-migrate
- **Location**: `/apps/api/migrations/`
- **Naming**: `YYYYMMDD_HHMMSS_description.up.sql`
- **Rollback**: Always create `.down.sql`

## 🔐 Security

### Authentication and Authorization
- **JWT Tokens**: Access (15min) + Refresh (7 days)
- **Password**: bcrypt hashing
- **Rate Limiting**: By IP and user
- **CORS**: Configured origins

### Data Protection
- **Encryption**: TLS 1.3 for all connections
- **Secrets**: Vault/K8s secrets
- **Logging**: Without PII data
- **Validation**: All input data

## 📊 Performance

### Caching Strategy
```
Request → Check Redis Cache → If Miss → Database → Cache Result
```

### Database Optimization
- **Indexes**: On frequently used fields
- **Connection Pool**: Configured size
- **Query Optimization**: EXPLAIN for slow queries

### Monitoring
- **Metrics**: Prometheus + Grafana
- **Logs**: Structured JSON logs
- **Tracing**: OpenTelemetry (optional)
- **Health Checks**: `/health` endpoints

## 🚀 Deployment

### Containerization
```dockerfile
# Multi-stage build
FROM golang:1.21-alpine AS builder
# ... build steps ...

FROM alpine:latest
# ... runtime setup ...
```

### Kubernetes Deployment
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

## 🔄 Development Process

### Local Development
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

### CI/CD Pipeline
1. **Lint** → Code quality checks
2. **Test** → Unit + Integration tests
3. **Build** → Docker images
4. **Deploy** → Staging → Production

## 🧪 Testing Strategy

### Test Pyramid
```
    E2E Tests (Few)
   ─────────────────
  Integration Tests (Some)
 ─────────────────────────────
Unit Tests (Many)
```

### Test Categories
- **Unit**: Business logic, utilities
- **Integration**: API endpoints, DB queries
- **E2E**: Critical user flows

## 📈 Scalability

### Horizontal Scaling
- **Stateless Services**: Easy to scale
- **Load Balancer**: Nginx/K8s Ingress
- **Database**: Read replicas for reads

### Performance Targets
| Metric | Target | Current |
|--------|--------|---------|
| Response Time | <200ms | TBD |
| Throughput | 1000 RPS | TBD |
| Uptime | 99.9% | TBD |

## 🔗 External Integrations

### Required APIs
- **[API Name]**: [Purpose and usage]
- **[API Name]**: [Purpose and usage]

### Optional Integrations
- **[Service]**: [Future integration]
- **[Service]**: [Future integration]

---

**Last Updated**: [date] | **Refs**: spec/api.md#Endpoints; spec/policy.md#Security
