# Project Documentation

> Living documentation - updated as the project evolves

**Last Updated**: [Date]  
**Project Stage**: [Development/Staging/Production]  
**Current Version**: [Semantic version]  

## Table of Contents

- [Architecture](#architecture)
- [Authentication](#authentication)
- [Database](#database)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Architecture

### System Overview

[AI fills this section when implementing core architecture]

**High-level diagram** (describe or link):
```
Frontend (React) <-> API (Go) <-> Database (PostgreSQL)
                        |
                        v
                    Cache (Redis)
```

### Key Architectural Decisions

**Decision Log**:
- **[Date]**: [Decision made] - [Reasoning behind it]
- **[Date]**: [Another decision] - [Why this approach]

Example:
- **2025-10-30**: Chose JWT over session-based auth - Better for horizontal scaling, stateless API, supports mobile clients

### Tech Stack

**Backend**:
- Language: [Go/Node.js/etc]
- Framework: [Gin/Fiber/Express/etc]
- Version: [Specify versions]

**Frontend**:
- Language: TypeScript
- Framework: [React/Next.js/etc]
- Styling: [Tailwind CSS/etc]

**Database**:
- Primary: [PostgreSQL/etc]
- Cache: [Redis/etc]
- Version: [Specify versions]

**Infrastructure**:
- Local dev: [Docker Compose]
- Production: [Kubernetes/ECS/etc]
- Cloud provider: [AWS/GCP/Azure]

### Project Structure

```
project/
├── apps/
│   ├── api/           # Backend service
│   └── ui/            # Frontend application
├── libs/              # Shared libraries
└── infra/             # Infrastructure code
```

[Add more detailed structure as project grows]

---

## Authentication

[This section filled after implementing authentication]

### Implementation Details

**Token Strategy**:
- Access tokens: [Algorithm], [Lifetime]
- Refresh tokens: [Storage location], [Lifetime]
- Token rotation: [Enabled/Disabled]

**Endpoints**:
- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- POST /api/auth/refresh - Refresh access token
- POST /api/auth/logout - Logout and invalidate tokens

### Security Measures

- Password hashing: [bcrypt cost 12]
- Rate limiting: [5 attempts per minute per IP]
- Token blacklist: [Redis with expiration]
- HTTPS only: [Enforced in production]

### Code References

- Handler: `apps/api/internal/handlers/auth.go`
- Service: `apps/api/internal/services/auth.go`
- Middleware: `apps/api/internal/middleware/auth.go`

### Testing

- Unit tests: `apps/api/tests/auth_test.go`
- Integration tests: `apps/api/tests/integration/auth_test.go`
- Test coverage: [X%]

---

## Database

[This section grows as schema evolves]

### Schema

**Tables**:

#### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

[Add more tables as they're created]

### Indexes

- `users.email` - Unique index for login queries
- [Add more indexes as created]

### Migrations

**Location**: `apps/api/migrations/`  
**Current version**: [003]  
**Tool**: [golang-migrate/etc]

**Migration history**:
- `001_initial_schema.up.sql` - Created users table
- `002_add_refresh_tokens.up.sql` - Added refresh token storage
- [Add new migrations as they're created]

### Backup Strategy

[Fill this when implementing backups]

- Frequency: [Daily/Hourly]
- Retention: [30 days]
- Location: [S3 bucket/etc]

---

## API Endpoints

[Document endpoints as they're created]

### Authentication

#### POST /api/auth/register
Register a new user.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response** (201 Created):
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "created_at": "2025-10-30T10:00:00Z"
    },
    "access_token": "eyJhbG...",
    "refresh_token": "eyJhbG..."
  }
}
```

**Errors**:
- 400 Bad Request: Invalid email format or weak password
- 409 Conflict: Email already registered

#### POST /api/auth/login
Login existing user.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response** (200 OK):
```json
{
  "data": {
    "access_token": "eyJhbG...",
    "refresh_token": "eyJhbG..."
  }
}
```

**Errors**:
- 400 Bad Request: Missing email or password
- 401 Unauthorized: Invalid credentials
- 429 Too Many Requests: Rate limit exceeded

[Add more endpoints as they're implemented]

### Users

[Document user endpoints here]

### [Other Resources]

[Add sections for other API resources]

---

## Deployment

[Fill this section when implementing deployment]

### Production Infrastructure

**Environment**: [AWS/GCP/Azure]  
**Region**: [us-east-1/etc]  

**Services**:
- API: [Kubernetes cluster on EKS]
- Database: [RDS PostgreSQL instance]
- Cache: [ElastiCache Redis]
- Load Balancer: [ALB/NLB]

### Deployment Process

**CI/CD Pipeline**:
1. Push to `main` branch
2. GitHub Actions runs tests and builds
3. Deploy to staging automatically
4. Manual approval required for production
5. Rolling update with zero downtime

**Configuration**:
- Environment variables: Stored in [AWS Secrets Manager/etc]
- Feature flags: [LaunchDarkly/custom]

### Monitoring

**Metrics**:
- Application logs: [CloudWatch/DataDog]
- Error tracking: [Sentry]
- Performance monitoring: [New Relic/DataDog]

**Alerts**:
- Error rate > 1%: Alert on-call engineer
- Response time > 1s: Warning notification
- Service down: Page on-call immediately

### Rollback Procedure

In case of critical issues:
```bash
# Rollback to previous version
kubectl rollout undo deployment/api

# Or rollback to specific revision
kubectl rollout undo deployment/api --to-revision=2
```

---

## Troubleshooting

[Add issues and solutions as they're encountered]

### Common Issues

#### Issue: Database connection timeout

**Symptoms**: API returns 500 errors, logs show "connection timeout"

**Cause**: Connection pool exhausted

**Solution**: 
1. Check for connection leaks in code
2. Increase connection pool size in configuration:
```go
db.SetMaxOpenConns(50) // Increased from 25
```

**Date resolved**: [Date]

#### Issue: JWT validation failing after deployment

**Symptoms**: All authenticated requests return 401

**Cause**: JWT secret changed between environments

**Solution**:
1. Verify JWT_SECRET environment variable is set correctly
2. Ensure RS256 public/private key pair is properly configured
3. Check token expiration hasn't passed

**Date resolved**: [Date]

[Add more issues as they occur and are resolved]

### Performance Optimization

#### Database Query Optimization

**Issue**: Slow user listing endpoint  
**Solution**: Added index on `users.created_at` for sorting, reduced query time from 2s to 50ms

**Issue**: N+1 query problem in posts endpoint  
**Solution**: Implemented eager loading with JOIN, reduced queries from N+1 to 1

[Document optimizations as implemented]

### Health Checks

**Endpoints**:
- `/health` - Basic health check (returns 200 if service is up)
- `/health/ready` - Readiness check (checks database connectivity)
- `/health/live` - Liveness check (for Kubernetes)

**Example response**:
```json
{
  "status": "healthy",
  "database": "connected",
  "cache": "connected",
  "uptime": "3h 25m 10s"
}
```

---

## Appendix

### Environment Variables

**Required**:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secret for JWT signing (or use RS256 keys)
- `PORT` - Server port (default: 8080)

**Optional**:
- `LOG_LEVEL` - Logging level (debug/info/warn/error)
- `CORS_ORIGINS` - Allowed CORS origins
- `RATE_LIMIT_PER_MINUTE` - Rate limit threshold

### External Dependencies

**Third-party services**:
- [Stripe] - Payment processing
- [SendGrid] - Email delivery
- [AWS S3] - File storage

**API Keys**:
- Store in environment variables
- Never commit to version control
- Rotate regularly

### Useful Commands

**Development**:
```bash
make dev          # Start development environment
make test         # Run tests
make lint         # Run linters
```

**Database**:
```bash
make db-migrate   # Run migrations
make db-reset     # Reset database (dev only)
```

**Deployment**:
```bash
make build        # Build production images
make deploy       # Deploy to production
```

---

**Maintenance Notes**:
- Review this document monthly for outdated information
- Update after significant changes
- Keep troubleshooting section current with recent issues
- Archive old decisions/issues to keep document focused

**Last Major Update**: [Date]  
**Next Review**: [Date + 1 month]
