# Development Roadmap + AI Task Queue

> **For AI Agents**: This is your task queue. Pick tasks by priority, update status, track progress.

## 🎯 Project Status

**Stage**: `dev` (fast iterations) | `prod` (strict rules)  
**Progress**: ░░░░░░░░░░ 0%  
**Timeline**: Week 0/[X] to MVP  
**Focus**: [Current development area]  

### Stage Rules
- **`dev`**: Direct commits, fast iterations, basic validation
- **`prod`**: Pull requests, code review, full testing pipeline

**Current Stage**: `dev` ← Change this when ready for production

## 🤖 AI Task Queue - Start Here

### 🔴 Priority 1: Critical Path (Do First)
These tasks must be completed in order:

#### TASK-001: Project Setup ⏳ `todo`
```
Effort: 1-2 hours
Dependencies: None (START HERE)
```
**What to do**: Initialize project structure and basic configuration
**Acceptance Criteria**:
- [ ] Create apps/api/ directory with basic Go/Node.js setup
- [ ] Create apps/ui/ directory with React/Next.js setup  
- [ ] Add docker-compose.yml for local development
- [ ] Add .env.example with required environment variables
- [ ] Create basic Dockerfile for each service
- [ ] Verify `make dev` starts all services

**Files to create**: `apps/api/main.go`, `apps/ui/package.json`, `docker-compose.yml`, `.env.example`
**When done**: Update status to `done`, start TASK-002

#### TASK-002: Database Setup ⏳ `todo`
```
Effort: 2-3 hours  
Dependencies: TASK-001 completed
```
**What to do**: Setup database schema and migrations
**Acceptance Criteria**:
- [ ] Create PostgreSQL database schema
- [ ] Add migration system (golang-migrate or similar)
- [ ] Create initial tables: users, [main_entities]
- [ ] Add database connection in backend
- [ ] Test database connectivity
- [ ] Add seed data for development

**Files to create**: `migrations/001_initial.up.sql`, `internal/db/connection.go`
**When done**: Update status to `done`, start TASK-003

#### TASK-003: Authentication System ⏳ `todo`
```
Effort: 3-4 hours
Dependencies: TASK-002 completed  
```
**What to do**: Implement user authentication with JWT
**Acceptance Criteria**:
- [ ] Create user registration endpoint
- [ ] Create user login endpoint  
- [ ] Implement JWT token generation and validation
- [ ] Add password hashing (bcrypt)
- [ ] Create authentication middleware
- [ ] Test all auth endpoints

**Files to create**: `internal/handlers/auth.go`, `internal/middleware/auth.go`
**When done**: Update status to `done`, start TASK-004

### 🟡 Priority 2: Core Features (Do Next)

#### TASK-004: Main Entity CRUD ⏳ `todo`
```
Effort: 2-3 hours
Dependencies: TASK-003 completed
```
**What to do**: Implement main business entity operations
**Acceptance Criteria**:
- [ ] Create [entity] model and database table
- [ ] Implement Create, Read, Update, Delete endpoints
- [ ] Add input validation and error handling
- [ ] Add pagination for list endpoints
- [ ] Test all CRUD operations
- [ ] Add authorization (user can only access own data)

**Files to create**: `internal/models/entity.go`, `internal/handlers/entity.go`
**When done**: Update status to `done`, start TASK-005

#### TASK-005: Frontend Authentication ⏳ `todo`
```
Effort: 3-4 hours
Dependencies: TASK-003 completed
```
**What to do**: Build login/register UI and auth state management
**Acceptance Criteria**:
- [ ] Create login page with form validation
- [ ] Create register page with form validation
- [ ] Implement auth state management (Context/Redux)
- [ ] Add protected route wrapper
- [ ] Handle token storage and refresh
- [ ] Add logout functionality

**Files to create**: `src/pages/Login.tsx`, `src/contexts/AuthContext.tsx`
**When done**: Update status to `done`, start TASK-006

### 🟢 Priority 3: Polish Features (Do Last)

#### TASK-006: Main Entity UI ⏳ `todo`
```
Effort: 4-5 hours
Dependencies: TASK-004, TASK-005 completed
```
**What to do**: Build UI for main entity management
**Acceptance Criteria**:
- [ ] Create entity list page with pagination
- [ ] Create entity create/edit form
- [ ] Add delete confirmation dialog
- [ ] Implement search and filtering
- [ ] Add loading states and error handling
- [ ] Make responsive design

**Files to create**: `src/pages/EntityList.tsx`, `src/components/EntityForm.tsx`
**When done**: Update status to `done`, MVP complete!

## 📊 Progress Tracking

### Task Status Overview
| Task | Priority | Status | Progress | Estimated Hours |
|------|----------|--------|----------|-----------------|
| TASK-001: Project Setup | 🔴 P1 | `todo` | ░░░░░░░░░░ 0% | 1-2h |
| TASK-002: Database Setup | 🔴 P1 | `todo` | ░░░░░░░░░░ 0% | 2-3h |
| TASK-003: Authentication | 🔴 P1 | `todo` | ░░░░░░░░░░ 0% | 3-4h |
| TASK-004: Entity CRUD | 🟡 P2 | `todo` | ░░░░░░░░░░ 0% | 2-3h |
| TASK-005: Frontend Auth | 🟡 P2 | `todo` | ░░░░░░░░░░ 0% | 3-4h |
| TASK-006: Entity UI | 🟢 P3 | `todo` | ░░░░░░░░░░ 0% | 4-5h |

**Total Estimated**: 15-21 hours | **Completed**: 0 hours | **Remaining**: 15-21 hours

### Weekly Milestones
- **Week 1**: Complete TASK-001, TASK-002, TASK-003 (MVP Backend)
- **Week 2**: Complete TASK-004, TASK-005 (MVP Frontend)  
- **Week 3**: Complete TASK-006, testing, deployment (MVP Complete)

## 🤖 AI Agent Instructions

### Task Selection Rules
1. **Always start with Priority 1** (🔴) tasks in order
2. **Check dependencies** - only start if prerequisites are `done`
3. **Update status** when starting: `todo` → `doing` → `done`
4. **One task at a time** - complete before starting next
5. **Update progress bars** after each completion

### Status Values
- `todo` - Ready to start
- `doing` - Currently working on this
- `done` - Completed and tested
- `blocked` - Cannot proceed (explain why)

### Progress Calculation
- Each task completion = progress increase
- TASK-001 (15%) → TASK-002 (30%) → TASK-003 (50%) → TASK-004 (65%) → TASK-005 (80%) → TASK-006 (100%)

### When Starting a Task
1. **Change status** to `doing`
2. **Update README.md** with current focus
3. **Read acceptance criteria** carefully
4. **Plan implementation** approach
5. **Start coding** with frequent commits

### When Completing a Task
1. **Test functionality** thoroughly
2. **Update status** to `done`
3. **Update progress bar** to new percentage
4. **Update README.md** overall progress
5. **Commit changes** with clear message

### Commit Message Format
```
feat: implement user authentication (TASK-003)

- add JWT token generation and validation
- create login/register endpoints  
- implement password hashing with bcrypt
- add authentication middleware
- write unit tests for auth service

Progress: 30% → 50% | Next: TASK-004
```

## 🚨 Blockers and Issues

### Current Blockers
*None - ready to start development*

### Resolved Issues
*Track resolved blockers here*

## 📈 Success Metrics

### MVP Definition
- [ ] Users can register and login
- [ ] Users can create, read, update, delete main entities
- [ ] All data is properly validated and secured
- [ ] Application runs reliably in Docker
- [ ] Basic error handling and user feedback

### Technical Quality Gates
- [ ] All endpoints return proper HTTP status codes
- [ ] All inputs are validated and sanitized
- [ ] All errors are handled gracefully
- [ ] Database operations use transactions where needed
- [ ] Frontend has loading states and error messages

### Performance Targets
- API response time < 200ms
- Page load time < 3 seconds
- Database queries optimized with indexes
- Frontend bundle size < 1MB

## 🔄 Post-MVP Roadmap

### Phase 2: Enhanced Features (Week 4-6)
- Advanced search and filtering
- File upload and management
- Email notifications
- User profile management
- Admin dashboard

### Phase 3: Scale and Polish (Week 7-8)
- Performance optimization
- Advanced security features
- Mobile responsiveness
- Comprehensive testing
- Production deployment

---

**Last Updated**: [Date] | **Stage**: dev | **Next Task**: TASK-001 | **AI Ready**: ✅
