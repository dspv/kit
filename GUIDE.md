# Development Guide

> Core principles, standards, and heuristics for AI-assisted development

**Last Updated**: 2025-11-08
**Version**: 3.1 (Enhanced with 2025 Industry Research)  

## Table of Contents

1. [Core Principles](#core-principles)
2. [AI Agent Workflow (2025)](#ai-agent-workflow-2025)
3. [Context Management](#context-management)
4. [Documentation Management](#documentation-management)
5. [File and Directory Naming](#file-and-directory-naming)
6. [Code Quality Heuristics](#code-quality-heuristics)
7. [Security Heuristics](#security-heuristics)
8. [Testing Strategy](#testing-strategy)
9. [Language and Style](#language-and-style)
10. [Tech Stack Defaults](#tech-stack-defaults)
11. [Development Workflow](#development-workflow)
12. [Production Safety (2025)](#production-safety-2025)

---

## Core Principles

### Principle 1: Minimize Context Pollution

**Context is a finite resource**. Every token in the context window reduces the model's attention budget.

**Token Economics** (2025):
- Cached tokens: $0.30 per million tokens (cheap)
- Uncached tokens: $3.00 per million tokens (10x more expensive)
- Context window at 95%: Model performance degrades ("context rot")

**Think of tokens as money**: Would you spend $3 to read a 50,000 line file when grep can find the answer in one line for $0.001?

**Apply this by**:
- Loading only files you actively need to modify
- Using grep/search to find specific patterns before reading full files
- Checking git diff to see recent changes instead of re-reading entire files
- Keeping temporary notes in .ai/notes/ and cleaning them regularly
- Using file system as external memory (unlimited, persistent, directly operable)

**Example workflow**:
```bash
# Bad: Load everything ($$$, slow, pollutes context)
cat apps/api/internal/**/*.go

# Good: Progressive exploration ($, fast, focused)
tree apps/api/internal -L 2          # Understand structure
grep -r "authentication" apps/api/   # Find relevant files
cat apps/api/internal/handlers/auth.go  # Read specific file

# Even better: Use external memory
echo "Auth uses JWT with 1h expiration" > .ai/notes/auth-findings.md
# Later: cat .ai/notes/auth-findings.md (cheap, cached)
```

**Auto-compact strategy**: When context reaches 95%, summarize trajectory and continue. Keep high-signal information, discard verbose details.

### Principle 2: Progressive Exploration (Just-In-Time Context)

Don't pre-load all information. Let AI discover what it needs through exploration.

**Pattern**:
1. Start with high-level structure
2. Identify relevant areas
3. Dive into specific files only when needed
4. Use metadata (file names, directory structure) as navigation hints

**Why this works**:
- Mirrors human cognition (we use file systems, not memorize everything)
- Keeps context focused on current task
- Allows iterative refinement of understanding

### Principle 3: Heuristic Over Algorithm

Provide principles for decision-making, not step-by-step instructions.

**Bad** (algorithmic):
```
If table has > 1000 rows, use pagination
If table has > 10000 rows, add index
If query time > 500ms, optimize
```

**Good** (heuristic):
```
Performance Principle:
- Measure before optimizing
- Optimize bottlenecks (queries > 500ms, operations in loops)
- Add indexes for WHERE/JOIN/ORDER BY on frequently queried columns
- Consider pagination when users typically view subset of data
```

The heuristic gives AI the reasoning framework to apply to novel situations.

### Principle 4: Minimal Tool Sets

**Most common AI failure mode**: Bloated tool sets with overlapping or ambiguous functionality.

**Golden rule**: If a human engineer can't definitively say which tool to use in a given situation, an AI agent can't be expected to do better.

**Bad** (ambiguous tools):
```typescript
createUser()      // Creates user in database
addUser()         // Also creates user?
registerUser()    // Also creates user??
insertUser()      // Wait, what's the difference?
```

AI thinks: "Which one? They all create users... I'll try createUser()... or maybe registerUser() sounds more right?"

**Good** (clear, single-purpose):
```typescript
createUser()      // The only way to create a user
updateUser()      // The only way to update
deleteUser()      // The only way to delete
```

AI thinks: "Need to create user → createUser(). Done."

**Apply this by**:
- One tool per distinct operation
- Different tools should have clearly different purposes
- Tool names reveal intent (createUser vs getUserById - obviously different)
- If tools overlap, merge them or make distinction crystal clear

**Examples of good separation**:
```typescript
// Clear purposes
fetchUserById(id)           # Get one user
fetchUsersByRole(role)      # Get filtered list
createUser(data)            # Create new
updateUserEmail(id, email)  # Update specific field

// Bad: Too similar
getUser()         # Get how? By what?
retrieveUser()    # Same as getUser?
loadUser()        # Also same?
```

**For function design**: Strong type signatures help AI understand constraints and implement correctly. Tests serve as living documentation of expected behavior.

---

## AI Agent Workflow (2025)

> **Critical Update**: Based on Anthropic 2025 research and production incidents analysis

### The #1 Failure Mode: Jumping Straight to Code

**Without planning, AI agents:**
- Jump directly to implementation (40-60% more errors)
- Make wrong architectural choices
- Require extensive rework and course corrections
- Create technical debt through hasty decisions

**Solution**: Mandatory Plan-First Workflow

---

### Explore-Plan-Code-Commit Pattern

**This is the PRIMARY workflow for all AI-assisted development.**

#### 1. Explore Phase

**Goal**: Understand the problem and existing codebase

```bash
# Survey the landscape
tree apps/api -L 2
grep -r "authentication" apps/api/
git log --oneline -10

# Read relevant files (NOT all files)
cat apps/api/internal/handlers/auth.go
```

**Do NOT write any code yet.** Only gather context.

#### 2. Plan Phase

**Goal**: Document approach BEFORE coding

**Use Extended Thinking Triggers:**
- `"think"` - Standard analysis
- `"think hard"` - Deeper evaluation
- `"think harder"` - Complex architectural decisions
- `"ultrathink"` - Critical production changes

**Create plan in .ai/notes/[task-name]-plan.md:**

```markdown
# Plan: Implement JWT Authentication

## Thinking (use "think hard" for complex decisions)
[Let AI reason through options]

## Approach
1. Create JWT service in internal/services/jwt.go
2. Add middleware in internal/middleware/auth.go
3. Update user handler to issue tokens
4. Add refresh token logic with Redis

## Decisions
- RS256 (not HS256) for public/private key rotation
- Access token: 15min, Refresh: 7 days
- Store refresh tokens in Redis with TTL

## Edge Cases
- Expired tokens → 401 with refresh hint
- Concurrent token refresh → last-write-wins
- Token revocation → Redis blacklist

## Tests to Write First (TDD)
- Test JWT generation with valid claims
- Test token expiration validation
- Test refresh token rotation
- Test invalid signature rejection
```

**Validate plan before proceeding.** Ask: "Does this approach handle all edge cases?"

#### 3. Code Phase

**Goal**: Implement the documented plan

**TDD Workflow (Test-Driven AI Development):**

```markdown
1. RED: Write failing test
   - Define expected behavior
   - Test should fail (no implementation yet)

2. GREEN: Minimal code to pass test
   - Implement just enough
   - Run test until it passes

3. REFACTOR: Clean up
   - Improve code quality
   - Maintain passing tests

4. REPEAT for next feature
```

**Example TDD Session:**

```bash
# 1. RED - Write test first
cat > internal/services/jwt_test.go <<EOF
func TestGenerateToken_ValidUser_ReturnsToken(t *testing.T) {
    service := NewJWTService("secret")
    token, err := service.GenerateToken(user)

    assert.NoError(t, err)
    assert.NotEmpty(t, token)
    // Test should FAIL - no implementation yet
}
EOF

# 2. Verify test fails
go test ./internal/services -run TestGenerateToken
# FAIL (expected)

# 3. GREEN - Implement minimal code
# [Write implementation]

# 4. Run until pass
go test ./internal/services -run TestGenerateToken
# PASS

# 5. REFACTOR if needed
```

**Critical**: Tests define success. AI has binary goal, not vague requirements.

#### 4. Commit Phase

**Goal**: Validate and commit working code

**Before committing:**
- [ ] All tests pass
- [ ] No linter errors
- [ ] Security scan clean
- [ ] Plan documented in commit message
- [ ] Edge cases handled

```bash
# Validate
make test
make lint
./doctor.sh

# Commit with plan reference
git add .
git commit -m "feat: implement JWT authentication

Implements plan from .ai/notes/auth-plan.md

- JWT service with RS256 signing
- Auth middleware for protected routes
- Refresh token rotation in Redis
- Rate limiting on auth endpoints

Tests: 15 tests added, all passing
Security: No critical/high findings
"
```

---

### Extended Thinking: When and How

**Extended thinking gives AI more computation time for better decisions.**

#### Thinking Levels

| Trigger | Computation Budget | Use Case |
|---------|-------------------|----------|
| `"think"` | Standard | Normal decisions |
| `"think hard"` | 2x | Architectural choices |
| `"think harder"` | 4x | Complex tradeoffs |
| `"ultrathink"` | Maximum | Production-critical changes |

#### When to Use Extended Thinking

**Always use "think hard" or higher for:**
- Architectural decisions (microservices vs monolith)
- Database schema design
- Security implementations
- Performance optimization strategies
- Breaking changes to public APIs

**Example:**

```
User: We need to choose between PostgreSQL and MongoDB for our analytics system.
Please think hard about this decision considering:
- 100M+ records
- Complex aggregations
- Real-time dashboards
- Team expertise (stronger in SQL)
```

AI will evaluate alternatives more thoroughly before recommending.

---

### Agentic Memory for Long Tasks

**Problem**: Context windows are finite. Long tasks (6+ hours) lose context.

**Solution**: AI maintains persistent notes outside context window.

#### Setup

```bash
# Create memory directory
mkdir -p .ai/memory/

# Structure for long tasks
.ai/memory/
├── feature-name/
│   ├── progress.md      # Current state
│   ├── decisions.md     # Key decisions log
│   └── learnings.md     # What worked/didn't work
```

#### Usage Pattern

**At start of session:**

```markdown
# .ai/memory/auth-system/progress.md

## Current Status (2025-11-08 10:00)
- ✅ JWT service implemented
- ✅ Middleware created
- 🔄 Testing refresh token rotation
- ⏳ Rate limiting not started

## Next Steps
1. Complete refresh token tests
2. Implement rate limiting
3. Add security headers
```

**During work:**

```markdown
# .ai/memory/auth-system/decisions.md

## 2025-11-08: Token Storage
**Decision**: Store refresh tokens in Redis, not database
**Reason**:
- Faster lookups (< 1ms vs 10-50ms)
- Built-in TTL
- Easy blacklisting
**Tradeoff**: Need Redis in stack (acceptable for auth service)
```

**Between sessions:**

Read memory files to resume context instantly:

```bash
cat .ai/memory/auth-system/progress.md
cat .ai/memory/auth-system/decisions.md
```

**Benefits:**
- Survives context resets
- Enables 6+ hour focused work
- Clear audit trail
- Onboarding documentation

---

### Test-Driven Development (TDD) as Primary Methodology

**TDD is not optional. It's the ONLY reliable way to guide AI agents.**

#### Why TDD for AI

**AI needs binary success criteria:**
- Vague requirements → hallucinations
- Clear tests → provable correctness

**Tests provide:**
- Specification (what to build)
- Validation (did it work)
- Documentation (how to use)
- Regression prevention (stays working)

#### TDD Workflow for AI Agents

```
┌─────────────────────────────────────────┐
│ 1. RED: Write failing test             │
│    - Define expected behavior           │
│    - Test fails (no implementation)     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 2. GREEN: Minimal implementation        │
│    - Write just enough code             │
│    - Make test pass                     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 3. REFACTOR: Improve code quality       │
│    - Clean up implementation            │
│    - Tests still pass                   │
└──────────────┬──────────────────────────┘
               │
               ▼
         [Repeat for next feature]
```

#### Practical Example

**Bad (No TDD):**
```
User: Add user registration endpoint

AI: [Writes 200 lines of code]
    [Might have bugs, edge cases missed]
    [No way to verify correctness]
```

**Good (TDD):**
```
User: Add user registration endpoint. Use TDD.

AI: Writing tests first...

Test 1 - RED:
func TestRegister_ValidData_CreatesUser(t *testing.T) {
    // Test fails - no implementation
}

Implement - GREEN:
func (h *Handler) Register(c *gin.Context) {
    // Minimal code to pass test
}

Test passes ✓

Test 2 - RED:
func TestRegister_DuplicateEmail_ReturnsError(t *testing.T) {
    // Test fails - edge case not handled
}

Implement - GREEN:
// Add duplicate check
// Test passes ✓

[Continue for all edge cases...]
```

**Result**: Every feature has tests. All edge cases covered. Zero guesswork.

#### Architectural Fitness Functions

**Problem**: AI can break architecture while keeping functional tests green.

**Solution**: Tests that enforce architectural rules.

**Examples:**

```go
// Test: No circular dependencies
func TestArchitecture_NoCycles(t *testing.T) {
    modules := []string{"handlers", "services", "repository"}
    assert.NoCycles(t, modules)
}

// Test: Layering rules
func TestArchitecture_LayerDependencies(t *testing.T) {
    // Handlers can call Services
    // Services can call Repository
    // Repository CANNOT call Services or Handlers
    assert.LayerRules(t, "handlers -> services -> repository")
}

// Test: No database in handlers
func TestArchitecture_NoDatabaseInHandlers(t *testing.T) {
    handlers := scanFiles("internal/handlers/**/*.go")
    for _, file := range handlers {
        assert.NotContains(t, file, "database/sql")
        assert.NotContains(t, file, "gorm")
    }
}
```

**These tests prevent AI from:**
- Creating circular dependencies
- Violating layer separation
- Coupling handlers to database
- Breaking architectural patterns

---

### Spec-Driven Development: Preventing "Vibe Coding"

**Problem**: "Vibe coding" (coding by feel without specs) leads to misaligned implementations.

**Solution**: Separate planning from execution with formal specifications.

#### The Planner-Executor Pattern

**Two distinct modes prevent premature coding:**

**1. Planner Mode** (Specification Phase)
- AI asks clarifying questions iteratively (one at a time)
- Builds comprehensive specs without modifying code
- Creates functional specs (WHAT to build)
- Creates implementation specs (HOW to build)
- Outputs numbered task lists with checkboxes
- Gets approval before proceeding

**2. Executor Mode** (Implementation Phase)
- Follows plan precisely without second-guessing
- Adds plan.md to context for reference
- Creates atomic, reviewable commits
- Produces clean git history
- Reports progress against checklist

#### Specification Types

**Functional Spec** (What to Build):
```markdown
# Feature: User Authentication

## Purpose
Enable secure user login with email/password

## Requirements
- Users can register with email + password
- Users can login and receive session token
- Users can logout (invalidate token)
- Passwords must meet complexity requirements

## Success Criteria
- Registration takes < 3 seconds
- Login takes < 1 second
- Password requirements enforced
- No plaintext password storage

## Out of Scope
- Social login (future)
- Two-factor auth (future)
```

**Implementation Spec** (How to Build):
```markdown
# Implementation: User Authentication

## Architecture
- JWT tokens (RS256 algorithm)
- PostgreSQL for user storage
- Redis for token blacklist
- bcrypt for password hashing (cost 12)

## Components
1. /api/auth/register - Registration endpoint
2. /api/auth/login - Login endpoint
3. /api/auth/logout - Logout endpoint
4. AuthMiddleware - Token validation
5. UserService - Business logic
6. UserRepository - Database access

## Database Schema
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Error Handling
- Invalid email → 400 Bad Request
- Duplicate email → 409 Conflict
- Invalid credentials → 401 Unauthorized
- Server errors → 500 Internal Server Error
```

**Testing Spec**:
```markdown
# Test Plan: User Authentication

## Unit Tests
- Password validation (weak/strong passwords)
- JWT generation and validation
- Password hashing

## Integration Tests
- Registration flow end-to-end
- Login with valid/invalid credentials
- Logout and token invalidation
- Protected endpoint access

## Security Tests
- SQL injection attempts
- XSS in email field
- Rate limiting enforcement
- Password complexity bypass attempts
```

#### Lessons Learned Files

**Maintain `.ai/lessons-learned.md` to prevent repeated errors:**

```markdown
# Lessons Learned

## Authentication Implementation (2025-11-08)

### What Worked
- Planning specs before coding saved 4 hours of rework
- TDD caught edge cases early
- Code review found security issue before production

### What Didn't Work
- Initial approach used HS256 (symmetric) for JWT
  - **Issue**: Can't rotate secrets without invalidating all tokens
  - **Fix**: Switched to RS256 (asymmetric) for key rotation
- Stored tokens in database initially
  - **Issue**: Slow lookups (50ms per request)
  - **Fix**: Moved to Redis (< 1ms lookups)

### Future Improvements
- Add refresh token rotation
- Implement rate limiting per user (not just per IP)
- Consider passwordless authentication

### Mistakes to Avoid
- ❌ Don't use HS256 for JWT (can't rotate keys)
- ❌ Don't store session data in PostgreSQL (too slow)
- ❌ Don't hash passwords with cost < 12 (too weak)
- ❌ Don't skip rate limiting (enables brute force)

## Database Migration (2025-11-05)

### What Worked
...
```

**AI reads this file before starting similar work**, preventing repeated mistakes.

#### Spec-First Workflow

```bash
# 1. Create specification
cat > specs/feature-name.md <<EOF
# Functional Spec: [Feature Name]
[WHAT to build]

# Implementation Spec: [Feature Name]
[HOW to build]

# Testing Spec: [Feature Name]
[HOW to verify]
EOF

# 2. Iterate with AI until perfect
# AI asks questions, you refine spec
# Get approval: "Does this spec cover everything?"

# 3. Switch to Executor mode
# AI implements following spec exactly
# Creates plan.md with task checklist

# 4. Track progress
# AI checks off tasks as completed
# Commits reference spec and plan

# 5. Update lessons learned
# Document what worked/didn't work
# AI learns from experience
```

**Benefits:**
- Reduces rework by 40-60% (Google Cloud internal data)
- Prevents scope creep (spec defines boundaries)
- Enables parallel work (multiple devs from same spec)
- Creates audit trail (specs + commits linked)
- Trains AI over time (lessons learned accumulate)

---

### Context Rotation Threshold

**Update (2025 Research)**: Context rot starts earlier than previously thought.

**Old guidance**: Rotate at 95% context window
**New guidance**: Rotate at 60% context window

**Why:**
- Performance degrades at 40-60% capacity
- n² pairwise token relationships
- Attention budget depletes faster than expected

**Implementation:**

```markdown
## Context Management Rules

**Monitor context usage during session:**

- 0-60%: Normal operation
- 60-80%: Warning - plan rotation soon
- 80%+: Critical - rotate immediately

**Rotation process:**

1. Summarize current session:
   - What was accomplished
   - Key decisions made
   - Current state

2. Save to .ai/memory/[task]/session-[N].md

3. Clear context (start fresh conversation)

4. Resume with summary:
   "Continuing work on [task].
   Previous session summary: [read from memory file]
   Current focus: [next subtask]"
```

---

## Context Management

### For Short Tasks (< 2 hours)
- Keep full context of files being modified
- No special management needed

### For Medium Tasks (2-6 hours)
- After 3-4 significant tool calls, summarize findings in code comments
- Drop files that are no longer actively being modified
- Keep only current focus in context

### For Long Tasks (> 6 hours) or Multi-Session Work

**Required**: Create `.ai/notes/work-log.md`

```markdown
# Work Log: [Feature Name]

## Session: 2025-10-30 14:30
**Goal**: Implement JWT-based authentication
**Progress**: Token generation complete, working on refresh mechanism
**Active Files**:
- internal/handlers/auth.go (modified)
- internal/services/auth.go (modified)
- migrations/003_refresh_tokens.up.sql (created)

**Key Decisions**:
- Using RS256 algorithm (public/private key pair)
- Access tokens: 1 hour lifetime
- Refresh tokens: 7 days, stored in Redis
- Token rotation on each refresh for security

**Blockers**: None
**Next**: Implement token refresh endpoint and middleware

## Session: 2025-10-29 10:00
[Previous session notes]
```

**Benefits**:
- Survives context resets
- Clear audit trail of decisions
- Easy to resume after breaks
- Can be referenced in future sessions

---

## Documentation Management

### Principle: Consolidate Knowledge, Don't Scatter It

**Problem**: AI agents often create many .md files (auth-notes.md, database-design.md, api-docs.md) which become stale and chaotic.

**Solution**: Use structured locations for different types of documentation.

### Documentation Hierarchy

**GUIDE.md** (this file):
- Development principles and standards
- Heuristics and best practices
- Does NOT change from project to project
- Static template

**DOCS.md**:
- Living project documentation
- Grows as features are implemented
- Single source of truth for implementation details
- Includes: architecture, API docs, deployment, troubleshooting

**.ai/context.md**:
- Business context (what, why, for whom)
- Product goals and success metrics
- Tech stack choices specific to this project

**.claude.md** (optional):
- Repository-specific rules and conventions
- Automatically loaded into Claude Code's context on startup
- Keep concise (50-100 lines max) and human-readable

**When to create .claude.md**:
- Project has unique conventions not covered in GUIDE.md
- Specific tools/ORMs used (e.g., "Use Prisma, not raw SQL")
- Non-obvious behaviors (e.g., "API always wraps responses in {data: ...}")
- Setup requirements (e.g., "Run `npm run seed` before testing")

**Example .claude.md**:
```markdown
# Project-Specific Rules

## Database
- Use Prisma ORM for all database operations
- Never write raw SQL queries
- Migrations in prisma/migrations/

## API Responses
- Always wrap in {data: ..., error: null} format
- Use status codes: 200 (success), 400 (validation), 500 (server error)

## Testing
- Run `npm run seed` to populate test database
- All tests must pass before committing
- Mock external API calls

## Forbidden
- Never modify files in /generated folder (auto-generated)
- Don't touch legacy/ folder (deprecated, will be removed)
```

**Why this works**: Claude Code automatically pulls .claude.md into context. No need to repeat these rules in every conversation.

**.ai/tasks.md**:
- Current task queue
- Tasks with goals and success metrics
- Updated as work progresses

**.ai/notes/**:
- Temporary working notes during task implementation
- MUST be cleaned after task completion
- Not permanent documentation

**Code comments**:
- Explain "why" not "what"
- Complex algorithm explanations
- Non-obvious business logic

### Workflow Pattern

#### During Task Implementation

Create temporary note:
```bash
.ai/notes/auth-implementation.md
```

Work freely in this file:
```markdown
# Auth Implementation - Working Notes

## Current Progress
- [x] User registration endpoint
- [x] JWT token generation
- [ ] Token refresh logic

## Exploration
Tried session-based auth first, but decided on JWT because:
- Stateless scaling
- Better for mobile apps
- Industry standard

## Implementation Details
[Code snippets, trials, experiments]

## Questions
- Should refresh tokens be in DB or Redis? -> Redis for speed
```

#### After Task Completion

1. **Extract important information** to DOCS.md:
```markdown
## Authentication

### Implementation
**Completed**: 2025-10-30

**Token Strategy**:
- Access tokens: RS256, 1 hour lifetime
- Refresh tokens: 7 days, stored in Redis
- Token rotation on each refresh

**Endpoints**:
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout

**Security Measures**:
- Rate limiting: 5 attempts per minute per IP
- Password hashing: bcrypt cost 12
- Token blacklist in Redis for logout

**Code References**:
- Handler: internal/handlers/auth.go
- Service: internal/services/auth.go
- Middleware: internal/middleware/auth.go
```

2. **Delete** temporary note:
```bash
rm .ai/notes/auth-implementation.md
```

3. **Commit** with reference:
```
feat: implement JWT-based authentication system

- user registration with email/password validation
- JWT access and refresh token generation
- token validation middleware for protected routes
- rate limiting on authentication endpoints
- refresh token rotation for enhanced security

Documentation: Updated DOCS.md#authentication
```

### Decision Tree: Where to Document?

```
Need to document something?
  |
  ├─> Still working on it?
  |   └─> .ai/notes/[task-name].md
  |
  ├─> Implementation detail in code?
  |   └─> Code comments
  |
  ├─> Architectural decision?
  |   └─> DOCS.md#architecture
  |
  ├─> API endpoint?
  |   └─> DOCS.md#api-endpoints
  |
  ├─> Deployment procedure?
  |   └─> DOCS.md#deployment
  |
  └─> Troubleshooting solution?
      └─> DOCS.md#troubleshooting
```

### Quality Checks Before Marking Task Done

- [ ] Important decisions documented in DOCS.md
- [ ] API endpoints documented (if added)
- [ ] Temporary notes moved or deleted from .ai/notes/
- [ ] Commit message references documentation updates

---

## File and Directory Naming

> Consistent, predictable naming makes code navigation faster for both humans and AI

### Core Principle: One Word, One Purpose

**Files should have clear, single-purpose names using kebab-case.**

### Documentation Files

**Location**: Root directory (always visible)
**Naming**: UPPERCASE.md for framework docs, lowercase.md for project-specific

```
Root documentation (UPPERCASE):
GUIDE.md           # Development principles (this file)
DOCS.md            # Living documentation (implementation details)
README.md          # Entry point, quick start
CHANGELOG.md       # Version history
CONTRIBUTING.md    # How to contribute
LICENSE            # Legal terms
```

**Why UPPERCASE**:
- Immediately visible in file listings
- Distinguishes framework docs from code
- Standard practice (README, LICENSE, etc.)

### Project Context Files

**Location**: `.ai/` directory (AI-specific context)
**Naming**: kebab-case for all context files

```
.ai/
├── context.md          # Business context (what, why, for whom)
├── tasks.md            # Task queue for autonomous development
└── notes/              # Temporary working notes
    ├── auth-flow.md    # Example: working on authentication
    └── api-design.md   # Example: API design exploration
```

**Naming rules**:
- Use descriptive single words: `context.md`, `tasks.md`
- Multi-word: kebab-case (`product-strategy.md`)
- Temporary notes: descriptive + task-oriented (`auth-flow.md`)
- NO underscores, NO spaces, NO camelCase

**Bad examples**:
```
.ai/ProductStrategy.md      # Don't use PascalCase
.ai/product_strategy.md     # Don't use snake_case
.ai/PRODUCT_STRATEGY.md     # Don't use UPPERCASE (reserved for root)
.ai/notes/my notes.md       # Don't use spaces
```

**Good examples**:
```
.ai/context.md              # Single word
.ai/product-strategy.md     # Multi-word with kebab-case
.ai/notes/auth-redesign.md  # Descriptive, task-focused
```

### Specification Documents

**Location**: `spec/` directory (optional, for complex projects)
**Naming**: kebab-case, descriptive

```
spec/
├── api-design.md          # API endpoints specification
├── database-schema.md     # Database structure
├── product-strategy.md    # Business strategy (moved from .ai/)
└── architecture.md        # System architecture decisions
```

**When to use `spec/`**:
- Complex projects with extensive specifications
- When `.ai/` context files get too large (> 500 lines)
- Formal documentation that rarely changes

**When to keep in `.ai/`**:
- MVP or early-stage projects
- Living documents that change frequently
- AI agent working context

### Code Files

**Naming**: Always lowercase, descriptive

```
Go:
user.go, auth.go, handler.go       # Good: clear purpose
util.go, helper.go, common.go      # Bad: too generic

TypeScript/JavaScript:
user-service.ts                    # Good: multi-word kebab-case
UserService.ts                     # Also OK: PascalCase for classes
userService.ts                     # OK: camelCase if consistent
```

**Follow language conventions**:
- Go: lowercase with underscores for multi-word (user_service.go)
- TypeScript: PascalCase for classes, camelCase for utilities
- Python: snake_case (user_service.py)

### Directory Structure

**Top-level directories**: Always lowercase, single word or kebab-case

```
Good structure:
project/
├── apps/           # Applications
├── libs/           # Shared libraries
├── infra/          # Infrastructure
├── spec/           # Specifications (optional)
└── .ai/            # AI context

Bad structure:
project/
├── Apps/           # Don't capitalize
├── my_libs/        # Don't use snake_case
├── Spec Files/     # Don't use spaces
```

### Migration Path

**When refactoring existing projects**:

1. **Don't break existing conventions** without discussion
2. **New files** follow these rules
3. **Gradual migration** during major refactors
4. **Document exceptions** in project README

**Example migration commit**:
```
refactor: standardize file naming to kebab-case

- Renamed PRODUCT_STRATEGY.md -> spec/product-strategy.md
- Moved complex specs from .ai/ to spec/
- Updated references in documentation

Part of Kit naming conventions adoption.
```

---

## Code Quality Heuristics

### Principle: Explicit Over Implicit

**Good code reveals intent clearly.**

**Indicators of good code**:
- Function names reveal purpose (createUser, not handle)
- Error messages explain what and why
- Variable names are descriptive (userData, not d)
- Types are specific (User, not map[string]interface{})

**Indicators of bad code**:
- Generic names (data, item, thing, temp)
- Silent failures (errors swallowed without logging)
- Magic numbers (use constants)
- Cryptic abbreviations (usr, tmp, val)

**Example**:
```go
// Bad: implicit, unclear
func process(d map[string]interface{}) error {
    v := d["email"]
    if v == nil {
        return errors.New("error")
    }
    // ...
}

// Good: explicit, clear
func createUser(userData CreateUserRequest) error {
    if userData.Email == "" {
        return fmt.Errorf("email is required for user creation")
    }
    // ...
}
```

### Principle: Defensive at Boundaries, Trusting Internally

**Apply validation and error handling at system boundaries. Trust internal code.**

**Boundaries** (apply defensive programming):
- HTTP request handlers
- User input processing
- External API calls
- File I/O operations
- Database queries

**Internal** (trust typed parameters):
- Service layer with validated data
- Internal function calls
- Business logic with guaranteed invariants

**Example**:
```go
// Boundary: HTTP handler - defensive
func (h *Handler) CreateUser(c *gin.Context) {
    var req CreateUserRequest
    
    // Validate request format
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": "Invalid request format"})
        return
    }
    
    // Validate business rules
    if !isValidEmail(req.Email) {
        c.JSON(400, gin.H{"error": "Invalid email address"})
        return
    }
    
    if len(req.Password) < 8 {
        c.JSON(400, gin.H{"error": "Password must be at least 8 characters"})
        return
    }
    
    // Pass validated data to service
    user, err := h.service.CreateUser(c.Request.Context(), req)
    if err != nil {
        log.Error("Failed to create user", "error", err)
        c.JSON(500, gin.H{"error": "Internal server error"})
        return
    }
    
    c.JSON(201, gin.H{"user": user})
}

// Internal: Service layer - trusting
func (s *Service) CreateUser(ctx context.Context, req CreateUserRequest) (*User, error) {
    // No re-validation needed - handler already validated
    // Focus on business logic
    
    hashedPassword, err := bcrypt.GenerateFromPassword(
        []byte(req.Password), 
        bcrypt.DefaultCost,
    )
    if err != nil {
        return nil, fmt.Errorf("failed to hash password: %w", err)
    }
    
    user := &User{
        ID:           uuid.New().String(),
        Email:        req.Email,
        PasswordHash: string(hashedPassword),
        CreatedAt:    time.Now(),
    }
    
    if err := s.repo.Create(ctx, user); err != nil {
        return nil, fmt.Errorf("failed to create user: %w", err)
    }
    
    return user, nil
}
```

### Principle: Error Handling by Recoverability

Categorize errors and handle appropriately:

**Transient** (retry-able):
- Network timeouts
- Rate limit errors
- Temporary service unavailability
- Database connection issues

**Strategy**: Exponential backoff, max 3-5 retries

```go
func callExternalAPI(ctx context.Context, url string) (*Response, error) {
    var resp *Response
    var err error
    
    backoff := time.Second
    maxRetries := 3
    
    for i := 0; i < maxRetries; i++ {
        resp, err = http.Get(url)
        
        if err == nil && resp.StatusCode < 500 {
            return resp, nil // Success or permanent error
        }
        
        // Transient error, retry with backoff
        time.Sleep(backoff)
        backoff *= 2
    }
    
    return nil, fmt.Errorf("failed after %d retries: %w", maxRetries, err)
}
```

**Permanent** (fail fast):
- Validation errors
- Authentication failures
- Not found errors
- Bad request format

**Strategy**: Return clear error immediately

```go
func (s *Service) GetUser(ctx context.Context, id string) (*User, error) {
    if id == "" {
        return nil, ErrInvalidUserID // Fail fast, don't hit database
    }
    
    user, err := s.repo.FindByID(ctx, id)
    if err == sql.ErrNoRows {
        return nil, ErrUserNotFound // Permanent error, clear message
    }
    if err != nil {
        return nil, fmt.Errorf("database error: %w", err)
    }
    
    return user, nil
}
```

**Unknown** (investigate):
- Unexpected 500 errors
- Database deadlocks
- Panics/crashes

**Strategy**: Log with context, alert team, return generic error to user

```go
func (h *Handler) GetUser(c *gin.Context) {
    user, err := h.service.GetUser(c.Request.Context(), c.Param("id"))
    
    if err != nil {
        // Log full error details for investigation
        log.Error("Failed to get user",
            "error", err,
            "user_id", c.Param("id"),
            "request_id", c.GetHeader("X-Request-ID"),
        )
        
        // Return generic error to user (don't leak internals)
        c.JSON(500, gin.H{"error": "Internal server error"})
        return
    }
    
    c.JSON(200, gin.H{"user": user})
}
```

---

## Security Heuristics

### Principle: Trust Nothing External

**External sources** (never trust):
- User input (forms, query parameters, headers)
- File uploads
- External API responses
- URL parameters
- Cookies

**Internal sources** (can trust after initial validation):
- Database records (validated on insert)
- Internal service calls
- System-generated data

### Validation Strategy

**At API Boundary**:
```go
func (h *Handler) CreatePost(c *gin.Context) {
    var req CreatePostRequest
    
    // 1. Validate format
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": "Invalid JSON format"})
        return
    }
    
    // 2. Validate business rules
    if len(req.Title) < 3 || len(req.Title) > 100 {
        c.JSON(400, gin.H{"error": "Title must be 3-100 characters"})
        return
    }
    
    // 3. Sanitize inputs
    req.Title = strings.TrimSpace(req.Title)
    req.Content = sanitizeHTML(req.Content)
    
    // 4. Check authorization
    userID := c.GetString("user_id") // From auth middleware
    if userID == "" {
        c.JSON(401, gin.H{"error": "Unauthorized"})
        return
    }
    
    // Now safe to pass to service
    post, err := h.service.CreatePost(c.Request.Context(), userID, req)
    // ...
}
```

### Authentication Pattern

**Default strategy**:
- JWT for stateless authentication
- Short-lived access tokens (15-60 minutes)
- Long-lived refresh tokens (7-30 days)
- Refresh tokens stored server-side (Redis or database)
- Token rotation on each refresh

**Implementation checklist**:
- [ ] Passwords hashed with bcrypt (cost >= 12)
- [ ] JWT signed with strong algorithm (RS256 or HS256)
- [ ] Refresh tokens have unique identifiers
- [ ] Token blacklist for logout
- [ ] Rate limiting on auth endpoints (5 attempts/minute)
- [ ] HTTPS only in production
- [ ] Secure, HttpOnly cookies for tokens (if using cookies)

### SQL Injection Prevention

**Always use parameterized queries**, never string concatenation:

```go
// WRONG - vulnerable to SQL injection
query := fmt.Sprintf("SELECT * FROM users WHERE email = '%s'", email)
db.Query(query)

// CORRECT - parameterized query
query := "SELECT * FROM users WHERE email = $1"
db.Query(query, email)
```

---

## Testing Strategy

### Principle: Test What Can Break

**Write tests for**:
- Business-critical logic (authentication, payments, data integrity)
- Complex algorithms or calculations
- Code that integrates with external services
- Code that has failed in production before
- Public API endpoints

**Skip tests for**:
- Simple CRUD with no business logic
- Framework boilerplate (e.g., struct definitions)
- Code that changes daily (prototyping phase)
- Getters/setters with no logic

### Test Pyramid

```
      /\
     /E2E\      10% - Critical user flows
    /------\
   /  INT   \   20% - API + Database integration
  /----------\
 /    UNIT    \ 70% - Business logic, algorithms
/--------------\
```

**Unit Tests** (70%):
- Test individual functions
- Mock external dependencies
- Fast execution (milliseconds)
- Focus on business logic

**Integration Tests** (20%):
- Test API endpoints with real database
- Verify data persistence
- Test error handling
- Slower (seconds)

**E2E Tests** (10%):
- Test critical user journeys
- Use real services when possible
- Slowest (minutes)
- Focus on happy paths and critical failures

### Quality Gates by Risk Level

**HIGH Risk** (money, auth, data loss):
- Unit tests + Integration tests + E2E tests
- Code coverage > 80%
- Manual security review

**MEDIUM Risk** (user features):
- Unit tests + Integration tests
- Code coverage > 60%

**LOW Risk** (UI, formatting):
- Manual testing acceptable
- Optional unit tests

### Test Naming Convention

```go
// Pattern: TestFunctionName_Scenario_ExpectedBehavior

func TestCreateUser_ValidInput_ReturnsUser(t *testing.T) { }
func TestCreateUser_DuplicateEmail_ReturnsError(t *testing.T) { }
func TestCreateUser_InvalidEmail_ReturnsError(t *testing.T) { }
```

---

## Language and Style

### Critical: English Only in Technical Content

**All technical artifacts MUST be in English. Zero exceptions.**

**Applies to**:
- Source code (variables, functions, classes, types)
- Code comments and documentation
- Commit messages (title and body)
- Pull request titles and descriptions
- Error messages and log output
- Database schema (tables, columns)
- API endpoints and parameters
- Configuration files
- Test descriptions

**Exceptions** (user-facing only):
- Frontend UI text for internationalization
- Email templates for customers
- Customer support responses

**Why English Only**:
1. AI models trained primarily on English code
2. Better token efficiency (non-English uses more tokens)
3. Global collaboration standard
4. Better tool integration
5. Professional industry standard

**Enforcement**:
- Pre-commit hook blocks non-English commits
- CI pipeline fails on non-English content
- Code review includes language check

**Examples**:

```go
// WRONG - using transliteration as example
func sozdatPolzovatelya(email string) error {
    // proveryaem email (checking email)
    if !isValid(email) {
        return errors.New("neverni format") // wrong format
    }
}

// CORRECT - English only
func createUser(email string) error {
    // Validate email format before processing
    if !isValid(email) {
        return errors.New("invalid email format")
    }
}
```

### Critical: No Emoji in Technical Content

**Emoji are prohibited in all technical contexts.**

**Prohibited in**:
- Source code (including comments)
- Commit messages
- Pull requests
- Log messages
- Error messages
- CLI output
- Technical documentation

**Why No Emoji**:
- Inconsistent rendering
- Not searchable (can't grep)
- Unprofessional
- Can break terminals/tools
- Wastes tokens
- No semantic value

**Use instead**:
- Heroicons (SVG) for frontend UI
- ASCII symbols for visual separation
- Clear text descriptions

**Examples**:

```
WRONG: feat: add auth [with lock emoji]
CORRECT: feat: implement authentication system

WRONG: log.Error("DB failed [with fire emoji]")
CORRECT: log.Error("Database connection failed")
```

### Commit Message Format

```
<type>: <short description>

<detailed explanation of what and why>

- bullet point of specific change
- another specific change
- test coverage added

Technical notes:
- any important implementation details
- performance implications
- breaking changes
```

**Types**: feat, fix, docs, refactor, test, chore, perf

**Example**:
```
feat: implement JWT-based authentication system

Add complete authentication flow with JWT tokens for API security.
Addresses requirement for stateless authentication across multiple
instances in production environment.

- create user registration endpoint with email/password validation
- implement login endpoint with JWT access and refresh tokens
- add authentication middleware for protected routes
- implement password hashing using bcrypt with cost factor 12
- add refresh token mechanism with Redis storage for revocation

Technical notes:
- access tokens expire in 1 hour
- refresh tokens expire in 7 days with rotation
- using RS256 algorithm for JWT signing
- rate limiting: 5 login attempts per minute per IP

Breaking changes: none
```

### Pull Request Workflow

**Core Principle: All changes to master via Pull Requests**

**Never push directly to master**. Even small changes go through PR review.

**Why PR-based workflow**:
- Human approval required (maintain control)
- Small, reviewable changes (easier to understand)
- Clear history (what changed and why)
- Rollback is simple (revert PR)
- Prevents accidental breaking changes

**Branch naming**:
```
feature/add-auth-system
fix/doctor-script-crash
docs/improve-quickstart
refactor/simplify-validation
chore/update-dependencies
```

**PR size guidelines**:
- **Small**: < 200 lines changed (ideal)
- **Medium**: 200-500 lines (acceptable)
- **Large**: > 500 lines (break it up)

**One PR = One Thing**:
```
Good: PR adds naming conventions to GUIDE.md
Bad:  PR adds naming conventions + license + redesigns README

Split into 3 PRs:
1. Add naming conventions
2. Add AGPL license
3. Redesign README
```

**Review process**:
1. AI creates branch + commits + pushes
2. AI creates PR with clear description
3. **Human reviews and approves** (required)
4. Merge via GitHub UI
5. Delete branch

**For AI agents**: After creating PR, STOP and wait for human approval. Do not merge automatically.

### Pull Request Template

```markdown
## What

Brief description of what this PR does.

## Why

Explanation of the problem this solves or feature it adds.

## Changes

- Specific change 1
- Specific change 2
- Specific change 3

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Edge cases verified

## Checklist

- [ ] Code in English only
- [ ] No emoji in technical content
- [ ] Error handling implemented
- [ ] Input validation added
- [ ] Tests added/updated
- [ ] Documentation updated (DOCS.md)
```

---

## Tech Stack Defaults

### Backend/Workers/Data Processing

**Default: Go**

Use Go when building:
- REST APIs
- gRPC services
- Background workers
- Data collectors/processors
- ETL pipelines

**Why Go**:
- High performance
- Simple deployment (single binary)
- Strong typing
- Excellent concurrency (goroutines)
- Fast compilation

**Project structure**:
```
apps/api/
├── cmd/
│   └── main.go              # Entry point
├── internal/
│   ├── handlers/            # HTTP handlers (thin)
│   ├── services/            # Business logic
│   ├── repository/          # Data access
│   ├── models/              # Data structures
│   └── middleware/          # HTTP middleware
├── migrations/              # Database migrations
└── tests/                   # Tests
```

### Frontend

**Default: TypeScript + React/Next.js**

**Why TypeScript**:
- Mandatory for type safety
- Better IDE support
- Catches errors at compile time

**Framework choice**:
- **Next.js**: When you need SSR, SSG, or API routes
- **React (Vite)**: When building SPA

**Styling**: Tailwind CSS
- Utility-first approach
- No custom CSS unless necessary

**Icons**: Heroicons
- SVG-based, not emoji
- Consistent design system

**Project structure**:
```
apps/ui/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   │   ├── ui/             # Base UI (buttons, inputs)
│   │   └── features/       # Feature-specific
│   ├── lib/                 # Utilities
│   │   ├── api.ts          # API client
│   │   └── utils.ts
│   ├── hooks/               # Custom hooks
│   └── types/               # TypeScript types
└── public/                  # Static assets
```

### Database

**Default: PostgreSQL**

**Why PostgreSQL**:
- Robust and reliable
- Excellent performance
- Rich feature set (JSON, full-text search)
- Strong ACID guarantees

**Migrations**: Use golang-migrate or similar
- All schema changes through migrations
- Never manual ALTER statements
- Migrations in version control

### Cache/Session Storage

**Default: Redis**

**Use cases**:
- Session storage
- Rate limiting
- Caching frequently accessed data
- Pub/sub for real-time features
- Queue for background jobs

### Infrastructure

**Development**: Docker Compose
**Production**: Kubernetes

**Why this split**:
- Docker Compose: Simple, fast local development
- Kubernetes: Production-grade orchestration, zero-downtime deployments

### Override Defaults

To use different tech stack, specify in `.ai/context.md`:

```markdown
## Tech Stack Overrides

**Backend**: Node.js with Express
Reason: Team expertise, existing codebase compatibility

**Frontend**: Vue.js
Reason: Client requirement

**Database**: MongoDB
Reason: Document-based data model fits use case
```

---

## Development Workflow

### Task Implementation Process

1. **Understand Context**
   - Read .ai/tasks.md for current task
   - Review acceptance criteria and success metrics
   - Check dependencies (previous tasks completed?)
   - Read relevant sections of DOCS.md

2. **Plan Approach**
   - Identify files to modify
   - Consider edge cases
   - Think about error handling
   - Plan test strategy
   - Create work note if task > 2 hours

3. **Implement Incrementally**
   - Start with core functionality
   - Add error handling
   - Add input validation
   - Write tests alongside code
   - Commit working code frequently (every 30-60 min)

4. **Document**
   - Update DOCS.md with important decisions
   - Clean up .ai/notes/ temporary files
   - Add code comments for complex logic

5. **Validate**
   - Run tests (make test)
   - Run linter (make lint)
   - Run doctor.sh for validation
   - Manual testing

6. **Update Progress**
   - Update task status in .ai/tasks.md
   - Commit with clear message referencing docs

### When to Ask for Clarification

**Ask immediately when**:
- Requirements are ambiguous or contradictory
- Multiple valid approaches with different tradeoffs
- Security implications unclear
- Breaking changes might be needed
- Success metrics cannot be measured

**Don't ask when**:
- Standard patterns exist in codebase (check existing code first)
- Documentation already covers it (check GUIDE.md, DOCS.md)
- It's a well-known best practice
- You can make reasonable assumption and document it

### File Organization Patterns

**Follow existing patterns**:
- If codebase uses certain structure, maintain consistency
- Don't reinvent organization unless clearly better
- Document any new patterns in DOCS.md

**Default patterns** (if starting fresh):
- See Tech Stack Defaults section for structure
- Keep related code together (feature-based organization)
- Separate concerns (handlers, services, repository layers)

---

## Appendix: Common Patterns

### Error Response Format (REST API)

```go
type ErrorResponse struct {
    Error   string `json:"error"`           // User-facing message
    Code    string `json:"code,omitempty"`  // Machine-readable error code
    Details string `json:"details,omitempty"` // Additional context
}

// Usage
c.JSON(400, ErrorResponse{
    Error: "Invalid email address",
    Code: "INVALID_EMAIL",
    Details: "Email must be in format user@domain.com",
})
```

### Success Response Format (REST API)

```go
type SuccessResponse struct {
    Data interface{} `json:"data"`
    Meta *Meta       `json:"meta,omitempty"` // Pagination, etc.
}

type Meta struct {
    Total      int `json:"total"`
    Page       int `json:"page"`
    PerPage    int `json:"per_page"`
    TotalPages int `json:"total_pages"`
}
```

### Database Connection Pattern

```go
// Initialize connection pool
db, err := sql.Open("postgres", connectionString)
if err != nil {
    log.Fatal("Failed to connect to database", "error", err)
}

// Configure pool
db.SetMaxOpenConns(25)
db.SetMaxIdleConns(25)
db.SetConnMaxLifetime(5 * time.Minute)

// Verify connection
if err := db.Ping(); err != nil {
    log.Fatal("Database is not reachable", "error", err)
}
```

---

## Production Safety (2025)

> **Critical**: Based on 2025 production incidents (Replit, Google Gemini, 233 total incidents)

### The Problem: AI Catastrophes in Production

**Real incidents from 2025:**

1. **Replit AI Agent** (July 2025)
   - Deleted production databases for 1,200+ companies
   - During designated "code freeze"
   - AI violated explicit "do not proceed" instructions
   - Months of work destroyed in seconds

2. **Google Gemini CLI** (July 2025)
   - Destroyed user files through unvalidated operations
   - Move commands to non-existent directories
   - No validation of target paths

**Industry statistics:**
- 233 AI incidents in 2024 (+56.4% year-over-year)
- 30-50% of AI-generated code contains security vulnerabilities
- 40% increase in secrets exposure (hardcoded credentials, API keys)
- AI-assisted commits merged 4x faster (bypassing normal review)

### Mandatory Safety Gates

#### 1. Human Approval for Production Changes

**Rule**: AI NEVER modifies production without explicit human approval.

**Applies to:**
- Database operations (DROP, DELETE, TRUNCATE)
- Infrastructure changes (terraform apply, kubectl delete)
- Destructive file operations (rm -rf, git reset --hard)
- Deployment commands (git push production, deploy scripts)

**Implementation:**

```bash
# Bad - AI can run directly
git push origin main

# Good - Require confirmation
echo "Ready to push to production. Approve? (yes/no)"
read approval
if [ "$approval" = "yes" ]; then
    git push origin main
fi
```

**In prompts:**

```
User: Deploy the authentication changes

AI: I've prepared the deployment:
- 15 files changed
- All tests passing
- Security scan clean

READY TO DEPLOY. Waiting for your approval to run:
git push origin main

Please confirm: Type "deploy" to proceed.
```

#### 2. Validation Before Destructive Operations

**Rule**: Verify targets exist and are correct before destruction.

**Bad (Dangerous):**

```bash
# No validation
rm -rf $TARGET_DIR

# Unvalidated database operation
DROP TABLE users;

# File operations without checks
mv $SOURCE_DIR $TARGET_DIR  # What if $TARGET_DIR doesn't exist?
```

**Good (Safe):**

```bash
# Validate before delete
if [ -d "$TARGET_DIR" ]; then
    echo "About to delete: $TARGET_DIR"
    ls -la "$TARGET_DIR"
    echo "Confirm deletion? (yes/no)"
    read confirmation
    if [ "$confirmation" = "yes" ]; then
        rm -rf "$TARGET_DIR"
    fi
else
    echo "ERROR: $TARGET_DIR does not exist"
    exit 1
fi

# Validate database operations
BEGIN TRANSACTION;
SELECT COUNT(*) FROM users WHERE created_at < NOW() - INTERVAL '90 days';
-- Show count to human for confirmation
-- Only proceed if confirmed
DELETE FROM users WHERE created_at < NOW() - INTERVAL '90 days';
COMMIT;

# Validate file operations
if [ -d "$SOURCE_DIR" ] && [ ! -d "$TARGET_DIR" ]; then
    mkdir -p "$(dirname "$TARGET_DIR")"
    mv "$SOURCE_DIR" "$TARGET_DIR"
else
    echo "ERROR: Invalid source or target already exists"
    exit 1
fi
```

#### 3. Multi-Layer Security Gates

**All code must pass before merge:**

```yaml
# .github/workflows/security.yml
name: Security Gates

on: [pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      # Layer 1: SAST (Static Application Security Testing)
      - name: Run SAST
        run: |
          # Check for common vulnerabilities
          semgrep --config=auto

      # Layer 2: SCA (Software Composition Analysis)
      - name: Check Dependencies
        run: |
          # Scan for vulnerable dependencies
          npm audit --audit-level=high
          # or: go list -json -m all | nancy sleuth

      # Layer 3: Secrets Detection
      - name: Detect Secrets
        run: |
          # Find hardcoded secrets
          gitleaks detect --source . --verbose

      # Layer 4: Quality Gate
      - name: Quality Gate
        run: |
          # No critical/high findings allowed
          if grep -q "CRITICAL\|HIGH" security-report.txt; then
            echo "❌ Critical or high severity findings detected"
            exit 1
          fi
```

**Quality Gate Policy:**

```
BLOCK MERGE if:
- Any CRITICAL severity finding
- Any HIGH severity finding in new code
- Secrets detected (API keys, passwords, tokens)
- Test coverage < 70% for new code
- Linting errors present
```

#### 4. AI-Specific Code Review Checklist

**Every AI-generated PR must verify:**

**Security:**
- [ ] No hardcoded secrets (API keys, passwords, tokens)
- [ ] Input validation on all user data
- [ ] SQL queries use parameterization (no string concatenation)
- [ ] Authentication/authorization checks present
- [ ] Error messages don't leak sensitive info

**Edge Cases:**
- [ ] Null/undefined handling
- [ ] Empty array/string handling
- [ ] Boundary conditions tested (0, -1, MAX_INT)
- [ ] Concurrent access considered
- [ ] Race conditions addressed

**Architecture:**
- [ ] Follows layer separation (handlers → services → repository)
- [ ] No circular dependencies
- [ ] No business logic in handlers
- [ ] No direct database calls from handlers
- [ ] Proper error propagation

**Testing:**
- [ ] Tests written BEFORE implementation (TDD)
- [ ] All edge cases covered
- [ ] Happy path tested
- [ ] Error paths tested
- [ ] Integration tests for database/API interactions

**Production Readiness:**
- [ ] Logging added for debugging
- [ ] Metrics/telemetry included
- [ ] Graceful error handling (no panics/crashes)
- [ ] Resource cleanup (connections, file handles)
- [ ] Performance acceptable (< 200ms for API endpoints)

### Self-Healing Patterns

**Problem**: Temporary failures should recover automatically.

#### Error Recovery Strategies

**1. Retry with Exponential Backoff**

```go
func callExternalAPI(ctx context.Context, url string) (*Response, error) {
    var resp *Response
    var err error

    maxRetries := 3
    backoff := 2 * time.Second

    for attempt := 1; attempt <= maxRetries; attempt++ {
        resp, err = http.Get(url)

        // Success or permanent error
        if err == nil && resp.StatusCode < 500 {
            return resp, nil
        }

        // Last attempt failed
        if attempt == maxRetries {
            return nil, fmt.Errorf("failed after %d attempts: %w", maxRetries, err)
        }

        // Temporary error - retry with backoff
        log.Warn("API call failed, retrying...",
            "attempt", attempt,
            "backoff", backoff,
            "error", err)

        time.Sleep(backoff)
        backoff *= 2  // 2s, 4s, 8s
    }

    return nil, err
}
```

**2. Circuit Breaker Pattern**

```go
type CircuitBreaker struct {
    maxFailures int
    resetTimeout time.Duration
    failures int
    lastFailTime time.Time
    state string // "closed", "open", "half-open"
}

func (cb *CircuitBreaker) Call(fn func() error) error {
    // Circuit open - fail fast
    if cb.state == "open" {
        if time.Since(cb.lastFailTime) > cb.resetTimeout {
            cb.state = "half-open"  // Try again
        } else {
            return errors.New("circuit breaker open")
        }
    }

    // Execute function
    err := fn()

    if err != nil {
        cb.failures++
        cb.lastFailTime = time.Now()

        if cb.failures >= cb.maxFailures {
            cb.state = "open"  // Stop trying
        }
        return err
    }

    // Success - reset
    cb.failures = 0
    cb.state = "closed"
    return nil
}
```

**3. Graceful Degradation**

```go
func getUserProfile(ctx context.Context, userID string) (*Profile, error) {
    // Try primary source (database)
    profile, err := db.GetUser(ctx, userID)
    if err == nil {
        return profile, nil
    }

    // Fallback to cache
    log.Warn("Database unavailable, using cache", "error", err)
    profile, err = cache.GetUser(ctx, userID)
    if err == nil {
        return profile, nil
    }

    // Last resort: return minimal profile
    log.Error("All sources failed, returning minimal profile", "error", err)
    return &Profile{
        ID: userID,
        Name: "Unknown",
        // Minimal data to keep app working
    }, nil
}
```

### Cost Optimization

**Problem**: Token costs spiral in production (10x budget overruns common).

#### Token Cost Reduction Strategies

**1. Prompt Caching (42% savings)**

```python
# Cache static context (75% cheaper)
cached_prompt = """
System context (cached):
- Project uses TypeScript, React, PostgreSQL
- API follows REST conventions
- Tests required for all features
[... project context ...]
"""

# Variable part (uncached)
user_request = "Add user registration endpoint"

# Combined request uses cached tokens
response = claude.generate(
    cached_context=cached_prompt,  # $0.30/M tokens
    user_input=user_request         # $3.00/M tokens
)
```

**2. Model Cascading (60-87% savings)**

```python
def route_to_appropriate_model(task):
    # Simple tasks → budget model
    if is_simple(task):
        return claude_haiku.generate(task)  # $0.25/M tokens

    # Medium tasks → standard model
    if is_medium_complexity(task):
        return claude_sonnet.generate(task)  # $3/M tokens

    # Complex only → premium model
    return claude_opus.generate(task)  # $15/M tokens

# Result: 87% cost reduction
# - 70% of tasks use budget model
# - 20% use standard
# - 10% need premium
```

**3. Token Budget Monitoring**

```python
class TokenBudgetTracker:
    def __init__(self, daily_budget=1000000):
        self.daily_budget = daily_budget
        self.used_today = 0
        self.sessions = {}

    def track_usage(self, session_id, tokens_used):
        self.used_today += tokens_used
        self.sessions[session_id] = self.sessions.get(session_id, 0) + tokens_used

        if self.used_today > self.daily_budget:
            alert("Token budget exceeded!", self.used_today, self.daily_budget)

        # Warn at 80%
        if self.used_today > self.daily_budget * 0.8:
            warn("Approaching token budget limit")
```

---

**Version**: 3.1
**Last Updated**: 2025-11-08
**Maintained by**: Development team
**Questions**: Check DOCS.md or ask in team chat
