# Changelog - Kit v3.0

## Version 3.0 - Complete Redesign (2025-10-30)

### Major Changes

#### 1. New Documentation Structure
**Before (v2.0)**:
```
spec/product.md    - Product specification
spec/roadmap.md    - Task queue
```

**After (v3.0)**:
```
GUIDE.md           - Development principles (static, reusable)
DOCS.md            - Living documentation (grows with project)
.ai/context.md     - Business context
.ai/tasks.md       - Task queue with success metrics
.ai/notes/         - Temporary working notes
```

**Why**: Follows Anthropic's context engineering principles - consolidated documentation, clear separation of concerns, prevents .md file sprawl.

#### 2. Heuristic-Based Task Definitions
**Before**: Step-by-step acceptance criteria
```markdown
- [ ] Create registration endpoint
- [ ] Validate email format
- [ ] Hash password with bcrypt
```

**After**: Goals with success metrics, implementation freedom
```markdown
Goal: Users can securely register and login
Success Metrics:
- Auth endpoint response time < 200ms
- Rate limiting prevents brute force
- Password hashing uses bcrypt cost >= 12
Freedom: Choose JWT vs session strategy, token expiration policy
```

**Why**: Gives AI autonomy while ensuring quality outcomes.

#### 3. English-Only Enforcement
**New**: Strict pre-commit hooks block non-English content
- Checks code, comments, commits, PRs
- Uses Perl Unicode detection (accurate, no false positives from box-drawing chars)
- Blocks commits with Cyrillic or other non-English text

**Why**: Better AI model performance, global collaboration standard, professional quality.

#### 4. Context Management Strategy
**New sections in GUIDE.md**:
- Progressive exploration (JIT pattern)
- Work log template for long tasks
- Documentation consolidation workflow
- When to use .ai/notes/ vs DOCS.md

**Why**: Prevents context pollution, improves AI efficiency, based on Anthropic research.

#### 5. No Emoji Policy (Recommendation)
**Enforcement**: Warning only (not blocking)
- Checks technical files for emoji
- Recommends Heroicons for UI
- Suggests ASCII symbols for scripts

**Why**: Professionalism, searchability, consistent rendering across tools.

### New Files

1. **GUIDE.md** (Main Development Guide)
   - Core principles and heuristics
   - Code quality standards
   - Security patterns
   - Testing strategy
   - Language requirements
   - ~350 lines

2. **DOCS.md** (Living Documentation Template)
   - Architecture decisions
   - API documentation
   - Database schema
   - Deployment procedures
   - Troubleshooting
   - Grows with project

3. **.ai/context.md** (Business Context)
   - Product overview
   - Target users
   - Success metrics
   - Tech stack decisions
   - Replaces old spec/product.md

4. **.ai/tasks.md** (Autonomous Task Queue)
   - Tasks with goals not steps
   - Success metrics not checklists
   - Implementation freedom
   - Replaces old spec/roadmap.md

### Updated Files

1. **README.md**
   - Clearer entry point
   - Quick start for new and existing projects
   - Documentation flow explained
   - Links to all resources

2. **Makefile**
   - Removed all emoji
   - Added check-english command
   - Added check-secrets command
   - Better output formatting

3. **doctor.sh**
   - Perl-based Cyrillic detection (accurate)
   - Emoji usage warnings
   - Commit format checks
   - Hardcoded secrets detection
   - Pre-commit hook installation
   - English-only enforcement

### Tech Stack Defaults

**Formalized in GUIDE.md**:
- Backend: Go (unless specified otherwise)
- Frontend: TypeScript + React/Next.js
- Database: PostgreSQL
- Cache: Redis
- Infrastructure: Docker Compose (dev) + Kubernetes (prod)

**Override mechanism**: Document in .ai/context.md

### Documentation Philosophy

**Key principles**:
1. **Consolidate, don't scatter** - One DOCS.md instead of many .md files
2. **Temporary vs Permanent** - .ai/notes/ for working, DOCS.md for permanent
3. **Progressive disclosure** - README -> GUIDE -> DOCS -> context -> tasks
4. **Clean after completion** - Move important info to DOCS.md, delete temp notes

### Validation Improvements

**doctor.sh now checks**:
- Required files present
- English-only content (BLOCKS non-English)
- Emoji usage (warns)
- Commit message format
- Hardcoded secrets
- README status indicators
- Directory structure

**Pre-commit hook**:
- Blocks commits with Cyrillic
- Warns about emoji in technical files
- Validates commit message format

### Breaking Changes from v2.0

1. **File structure changed**:
   - `spec/product.md` -> `.ai/context.md`
   - `spec/roadmap.md` -> `.ai/tasks.md`
   - Added `GUIDE.md` and `DOCS.md`

2. **Task format changed**:
   - From detailed checklists to goals + success metrics
   - More autonomy for AI agents

3. **English-only now enforced**:
   - Pre-commit hook blocks non-English
   - doctor.sh fails on non-English content

### Migration from v2.0

```bash
# Copy new files
cp kit-v3/GUIDE.md ./
cp kit-v3/DOCS.md ./
mkdir -p .ai/notes/

# Migrate content
# spec/product.md -> .ai/context.md (rewrite with new template)
# spec/roadmap.md -> .ai/tasks.md (convert to goals/metrics)

# Update existing
cp kit-v3/README.md ./README.md
cp kit-v3/Makefile ./Makefile
cp kit-v3/doctor.sh ./doctor.sh
chmod +x doctor.sh

# Run validation
./doctor.sh
```

### Philosophy Changes

**v2.0 Philosophy**: Detailed instructions, progress bars, prescriptive tasks
**v3.0 Philosophy**: Heuristics, autonomy, outcomes over process

**Based on**: Anthropic's "Effective Context Engineering for AI Agents" research

### Key Improvements

1. **Scales better**: Works for 1-week MVP and 1-year projects
2. **Less maintenance**: Principles don't change, implementations do
3. **Better AI performance**: Context management, heuristic thinking
4. **Higher quality**: English-only, no emoji, consolidated docs
5. **More flexibility**: AI can choose implementation approach

### Statistics

- **Files**: 7 core files (was 5 in v2.0)
- **Lines of documentation**: ~1000 (was ~500 in v2.0)
- **Depth**: Higher (more principles, less prescription)
- **Flexibility**: Much higher (goals vs checklists)

---

## Version 2.0 (Previous)

- 5 core files
- spec/ directory structure
- Progress bars and percentages
- Detailed task checklists
- Emoji throughout
- Mixed language tolerance

---

**Upgrade Recommendation**: All new projects should use v3.0. Existing v2.0 projects can upgrade incrementally by adopting new documentation structure.
