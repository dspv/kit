# Product Specification + AI Instructions

> **For AI Agents**: This file contains business context AND development instructions

## 🎯 Product Overview

**Project**: [Project Name]  
**Problem**: [What problem we solve in 1 sentence]  
**Solution**: [How we solve it in 1 sentence]  
**Value**: [What value we provide in 1 sentence]  

### Target Users
- **Primary**: [User type] - [Their main need]
- **Secondary**: [User type] - [Their main need]

### Success Metrics
| Metric | Target | Current |
|--------|--------|---------|
| [Business KPI] | [Target] | [Value] |
| [Technical KPI] | [Target] | [Value] |
| [User KPI] | [Target] | [Value] |

## 🏗️ Technical Architecture

### System Overview
```
Frontend (React/TS) ←→ API (Go/Node) ←→ Database (PostgreSQL)
                              ↓
                         Cache (Redis)
```

### Technology Stack
- **Frontend**: TypeScript + React/Next.js + Tailwind CSS
- **Backend**: Go (Gin/Fiber) or Node.js (Express/Fastify)
- **Database**: PostgreSQL + Redis (cache/sessions)
- **Infrastructure**: Docker + Kubernetes + Nginx
- **Development**: Hot reload, automated testing, CI/CD

### Core Features
1. **[Feature 1]**: [Description] - [Priority: High/Medium/Low]
2. **[Feature 2]**: [Description] - [Priority: High/Medium/Low]
3. **[Feature 3]**: [Description] - [Priority: High/Medium/Low]

## 🤖 AI Development Instructions

### Architecture Decisions
- **Monorepo structure**: All code in single repository
- **API-first**: Backend provides REST API, frontend consumes
- **Database-first**: Design schema before implementing features
- **Test-driven**: Write tests alongside implementation
- **Docker-native**: Everything runs in containers

### Code Standards
```typescript
// ✅ Good: Clear, typed, documented
interface User {
  id: string;
  email: string;
  createdAt: Date;
}

async function createUser(data: CreateUserRequest): Promise<User> {
  // Validate input
  if (!data.email) throw new Error('Email required');
  
  // Create user
  const user = await db.users.create(data);
  
  // Return result
  return user;
}
```

```go
// ✅ Good: Clear, error handling, structured
type User struct {
    ID        string    `json:"id" db:"id"`
    Email     string    `json:"email" db:"email"`
    CreatedAt time.Time `json:"created_at" db:"created_at"`
}

func CreateUser(ctx context.Context, data CreateUserRequest) (*User, error) {
    // Validate input
    if data.Email == "" {
        return nil, errors.New("email required")
    }
    
    // Create user
    user := &User{
        ID:        uuid.New().String(),
        Email:     data.Email,
        CreatedAt: time.Now(),
    }
    
    if err := db.Create(ctx, user); err != nil {
        return nil, fmt.Errorf("failed to create user: %w", err)
    }
    
    return user, nil
}
```

### API Design Principles
- **RESTful endpoints**: GET/POST/PUT/DELETE with clear paths
- **Consistent responses**: Always return `{success, data, error}` format
- **Proper status codes**: 200/201/400/401/404/500
- **Input validation**: Validate all inputs, sanitize outputs
- **Error handling**: Clear error messages, no sensitive data

### Database Guidelines
- **Migrations**: All schema changes through versioned migrations
- **Indexes**: Add indexes for frequently queried fields
- **Constraints**: Use database constraints for data integrity
- **Transactions**: Wrap related operations in transactions
- **Naming**: Use snake_case for tables/columns, singular table names

### Security Requirements
- **Authentication**: JWT tokens with refresh mechanism
- **Authorization**: Role-based access control
- **Input validation**: Validate and sanitize all inputs
- **SQL injection**: Use parameterized queries only
- **XSS protection**: Sanitize all outputs
- **HTTPS only**: All communication over TLS

### Performance Guidelines
- **Caching**: Cache frequently accessed data in Redis
- **Pagination**: Paginate large result sets
- **Lazy loading**: Load data on demand
- **Connection pooling**: Use database connection pools
- **Monitoring**: Add metrics and logging for performance tracking

## 🎯 Development Workflow for AI

### Task Implementation Process
1. **Read task** from spec/roadmap.md
2. **Understand requirements** from acceptance criteria
3. **Design solution** considering architecture above
4. **Implement incrementally** with frequent commits
5. **Test functionality** manually and with automated tests
6. **Update progress** in spec/roadmap.md and README.md

### File Organization
```
apps/api/
├── cmd/main.go              # Application entry point
├── internal/
│   ├── handlers/            # HTTP handlers
│   ├── models/              # Data models
│   ├── services/            # Business logic
│   └── db/                  # Database layer
├── migrations/              # Database migrations
└── tests/                   # Test files

apps/ui/
├── src/
│   ├── components/          # React components
│   ├── pages/               # Page components
│   ├── hooks/               # Custom hooks
│   ├── services/            # API clients
│   └── utils/               # Utility functions
└── public/                  # Static assets
```

### Commit Guidelines
```
feat: implement user authentication

- add JWT token generation and validation
- create login/register endpoints
- implement password hashing with bcrypt
- add middleware for protected routes
- write unit tests for auth service

Stage: dev | Progress: 15% → 25%
```

### Testing Strategy
- **Unit tests**: Test individual functions and components
- **Integration tests**: Test API endpoints with database
- **E2E tests**: Test critical user flows
- **Manual testing**: Verify functionality works as expected

### Error Handling Patterns
```typescript
// Frontend error handling
try {
  const user = await api.createUser(userData);
  showSuccess('User created successfully');
} catch (error) {
  showError(error.message || 'Failed to create user');
  console.error('Create user error:', error);
}
```

```go
// Backend error handling
func (h *Handler) CreateUser(c *gin.Context) {
    var req CreateUserRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": "Invalid request format"})
        return
    }
    
    user, err := h.userService.Create(c.Request.Context(), req)
    if err != nil {
        log.Error("Failed to create user", "error", err)
        c.JSON(500, gin.H{"error": "Internal server error"})
        return
    }
    
    c.JSON(201, gin.H{"success": true, "data": user})
}
```

## 🚨 Critical Rules for AI Agents

### Must Follow
- ✅ **English only**: All code, comments, commits, documentation
- ✅ **Working code**: Every commit must be functional
- ✅ **Progress updates**: Update roadmap and README after each task
- ✅ **Error handling**: Handle all error cases explicitly
- ✅ **Input validation**: Validate all user inputs
- ✅ **Security first**: Follow security guidelines above

### Never Do
- ❌ **Commit broken code**: Always test before committing
- ❌ **Skip error handling**: Every operation can fail
- ❌ **Hardcode secrets**: Use environment variables
- ❌ **Ignore validation**: Validate all inputs
- ❌ **Mix languages**: English only everywhere

### When Stuck
1. **Re-read** this file and spec/roadmap.md
2. **Check** existing code patterns in the project
3. **Look up** documentation for technologies used
4. **Ask** specific questions about requirements
5. **Break down** large tasks into smaller steps

---

**Last Updated**: [Date] | **Stage**: [dev/prod] | **AI Instructions**: Embedded
