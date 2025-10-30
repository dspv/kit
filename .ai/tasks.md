# Task Queue

> Autonomous development tasks with goals and success metrics

**Project Stage**: [dev/prod]  
**Current Sprint**: Week [X] of [Y]  
**Last Updated**: [Date]  

## How to Use This File

### For AI Agents

1. **Read** .ai/context.md first to understand project goals
2. **Pick** highest priority task with status `todo` and all dependencies met
3. **Update** status to `doing` when starting
4. **Work** autonomously - you have freedom to choose implementation approach
5. **Validate** against success metrics when done
6. **Update** status to `done` and document in DOCS.md
7. **Move** to next task

### Task Format

Each task has:
- **Goal**: What to achieve (outcome, not process)
- **Success Metrics**: How to know it's done right
- **Context**: Why this matters, constraints
- **Freedom**: What decisions you can make
- **Status**: todo/doing/done/blocked

### Status Values
- `todo` - Ready to start (all dependencies met)
- `doing` - Currently in progress
- `done` - Completed and validated
- `blocked` - Cannot proceed (document blocker)

---

## Priority 1: Foundation

### TASK-001: Project Initialization
**Status**: `todo`  
**Effort**: 1-2 hours  
**Dependencies**: None (start here)  

**Goal**: 
Establish working development environment where all services start and communicate.

**Success Metrics**:
- [ ] `make dev` starts all required services without errors
- [ ] API responds at http://localhost:8080/health with 200 OK
- [ ] Frontend loads at http://localhost:3000
- [ ] Database connection verified
- [ ] All environment variables documented in .env.example

**Context**:
This is the foundation everything else builds on. Need consistent environment for all developers and CI/CD.

**Freedom**:
- Choose specific database version (PostgreSQL 14+)
- Decide on docker-compose service names
- Structure directory layout in apps/
- Choose development vs production config strategy

**Reference**: Check GUIDE.md#tech-stack-defaults for recommended choices

---

### TASK-002: Database Foundation
**Status**: `todo`  
**Effort**: 2-3 hours  
**Dependencies**: TASK-001 completed  

**Goal**:
Establish robust database schema with migration system for safe schema evolution.

**Success Metrics**:
- [ ] Migration system works (up and down migrations)
- [ ] Users table created with required fields
- [ ] Connection pooling configured appropriately
- [ ] Seed data available for development
- [ ] Can create/read/update users through database client
- [ ] Proper indexes on frequently queried columns

**Context**:
Database is foundation for all features. Migrations critical for safe production deployments.

**Freedom**:
- Choose migration tool (golang-migrate, flyway, etc)
- Decide on user table fields beyond basics (email, password_hash)
- Structure seed data format
- Set connection pool parameters based on expected load

**Constraints**:
- Must use migrations (no manual ALTER statements)
- Must have rollback capability (down migrations)
- Passwords must never be stored in plain text

---

### TASK-003: Authentication System
**Status**: `todo`  
**Effort**: 3-4 hours  
**Dependencies**: TASK-002 completed  

**Goal**:
Users can securely register, login, and access protected resources.

**Success Metrics**:
- [ ] Registration endpoint validates input and creates user
- [ ] Login endpoint returns access token
- [ ] Protected endpoints reject requests without valid token
- [ ] Token validation is stateless and fast (< 10ms)
- [ ] Password hashing uses strong algorithm (bcrypt cost >= 12)
- [ ] Rate limiting prevents brute force (max 5 attempts/minute)
- [ ] Auth errors don't reveal whether user exists

**Context**:
Security-critical feature. Must be rock-solid before building other features.

**Freedom**:
- Choose JWT vs session strategy (JWT recommended for API)
- Decide token expiration times (access vs refresh)
- Design token refresh mechanism
- Choose error message wording
- Decide whether to use refresh tokens

**Constraints**:
- Must use HTTPS in production
- Must rate limit login attempts
- Must hash passwords (never plain text)
- Must validate all inputs

**Reference**: GUIDE.md#authentication-pattern for recommended approach

---

## Priority 2: Core Features

### TASK-004: [Core Entity] CRUD Operations
**Status**: `todo`  
**Effort**: 2-3 hours  
**Dependencies**: TASK-003 completed  

**Goal**:
Users can create, view, update, and delete [core business entity].

**Success Metrics**:
- [ ] All CRUD endpoints implemented and tested
- [ ] Input validation prevents invalid data
- [ ] Authorization ensures users only access their own data
- [ ] List endpoint includes pagination (default 20 items/page)
- [ ] Error messages are clear and actionable
- [ ] Response times < 200ms for single item operations

**Context**:
This is the main feature users need. Quality here directly impacts user experience.

**Freedom**:
- Design API endpoint structure (RESTful recommended)
- Choose pagination strategy (offset vs cursor)
- Decide on response format
- Structure validation error messages
- Choose between soft delete vs hard delete

**Constraints**:
- Must validate all inputs at API boundary
- Must include authorization checks
- Must handle edge cases (not found, already exists, etc)

---

### TASK-005: Frontend Authentication Flow
**Status**: `todo`  
**Effort**: 3-4 hours  
**Dependencies**: TASK-003 completed  

**Goal**:
Users can register, login, and stay authenticated across sessions.

**Success Metrics**:
- [ ] Registration form with validation feedback
- [ ] Login form with error handling
- [ ] Auth state persists across page refreshes
- [ ] Protected routes redirect to login
- [ ] Logout clears auth state
- [ ] Token refresh happens automatically before expiration
- [ ] Loading states provide feedback during auth operations

**Context**:
First impression for users. Must be smooth and intuitive.

**Freedom**:
- Choose state management approach (Context, Redux, Zustand, etc)
- Design form validation UX
- Choose where to store tokens (memory, localStorage, httpOnly cookies)
- Design loading/error states

**Constraints**:
- Must validate inputs client-side for UX
- Must handle all error cases gracefully
- Must not expose sensitive errors to user

---

## Priority 3: Polish and Deploy

### TASK-006: [Core Entity] Frontend UI
**Status**: `todo`  
**Effort**: 4-5 hours  
**Dependencies**: TASK-004, TASK-005 completed  

**Goal**:
Users can easily manage [core entity] with intuitive, responsive interface.

**Success Metrics**:
- [ ] List view shows all user's entities with key information
- [ ] Create/edit forms validate input in real-time
- [ ] Delete has confirmation to prevent accidents
- [ ] Search/filter works as expected
- [ ] Mobile responsive (works on 360px width)
- [ ] Loading states provide feedback
- [ ] Errors are clear and help user fix issues

**Context**:
This is where users spend most time. Quality directly impacts satisfaction.

**Freedom**:
- Design component structure
- Choose UI patterns (modals vs pages for create/edit)
- Design mobile vs desktop layouts
- Choose search/filter implementation

**Constraints**:
- Must use Tailwind CSS (per tech stack)
- Must be responsive
- Must handle loading and error states

---

## Task Status Overview

| Task | Priority | Status | Dependencies | Estimated |
|------|----------|--------|--------------|-----------|
| TASK-001: Project Init | P1 | `todo` | None | 1-2h |
| TASK-002: Database | P1 | `todo` | TASK-001 | 2-3h |
| TASK-003: Auth System | P1 | `todo` | TASK-002 | 3-4h |
| TASK-004: Entity CRUD | P2 | `todo` | TASK-003 | 2-3h |
| TASK-005: Frontend Auth | P2 | `todo` | TASK-003 | 3-4h |
| TASK-006: Entity UI | P3 | `todo` | TASK-004,005 | 4-5h |

**Total Estimated**: 15-21 hours to MVP

---

## Completed Tasks

### TASK-XXX: [Task Name]
**Completed**: [Date]  
**Duration**: [Actual hours]  
**Key Decisions**:
- [Important decision made]
- [Another decision]

**Lessons Learned**:
- [What went well]
- [What could be improved]

**Documentation**: Updated DOCS.md#[section]

---

## Blocked Tasks

[When a task is blocked, move it here with explanation]

### TASK-XXX: [Task Name]
**Status**: `blocked`  
**Blocker**: [Clear description of what's blocking progress]  
**Attempted**: [What you tried to resolve it]  
**Need**: [What's needed to unblock - decision, clarification, external dependency]

---

## Notes for AI Agents

### Before Starting Any Task

1. Read GUIDE.md to understand principles
2. Check .ai/context.md for project-specific context
3. Review DOCS.md for existing implementation details
4. Verify all dependencies are marked `done`

### While Working on Task

- Create work log in .ai/notes/ if task > 2 hours
- Commit frequently (every 30-60 min of work)
- Update task status to `doing` when you start
- Test against success metrics as you go

### After Completing Task

- Verify all success metrics are met
- Update DOCS.md with implementation details
- Clean up .ai/notes/ temporary files
- Update task status to `done`
- Commit with clear message referencing task

### Quality Checklist

Before marking any task `done`:
- [ ] All success metrics validated
- [ ] Error handling implemented
- [ ] Input validation added
- [ ] Tests written (if applicable)
- [ ] Documentation updated in DOCS.md
- [ ] Code in English only
- [ ] No emoji in technical content

### If You Get Stuck

1. Re-read task success metrics
2. Check GUIDE.md for relevant patterns
3. Review existing code for similar examples
4. Check DOCS.md for related implementation details
5. If still stuck, mark as `blocked` and explain

---

**Remember**: Focus on outcomes (success metrics), not process. You have freedom to choose implementation approach as long as metrics are met.
