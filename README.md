# Kit AI-First v2.0 - Minimal Development Template

🚀 **Status**: Template Ready (100%)  
📅 **Timeline**: Ready for Use  
🎯 **Focus**: AI-First Development Structure  

> **Single Entry Point** for both humans and AI agents

## 🤖 For AI Agents - Start Here

### Critical Instructions
1. **Always read files in order**: README.md → spec/product.md → spec/roadmap.md
2. **Update progress daily**: Modify progress bars in README.md after each task
3. **Follow stage rules**: Check current stage in spec/roadmap.md
4. **English only**: All code, comments, commits, documentation
5. **Small iterations**: Commit working code frequently with clear descriptions

### Quick Start Commands
```bash
make setup    # Initialize project
make dev      # Start development
make check    # Validate everything
```

### Current Project Status
**Stage**: `dev` (fast iterations) | `prod` (strict rules)  
**Progress**: ░░░░░░░░░░ 0%  
**Active Tasks**: See spec/roadmap.md  

## 📦 What's Inside

### Core Files (5 total)
- **README.md** (this file) - Project status and entry point
- **Makefile** - Development automation
- **doctor.sh** - Structure validation and health checks
- **spec/product.md** - What we build + business context
- **spec/roadmap.md** - Development plan + AI task queue

### Project Structure Template
```
project/
├── README.md              # Status and entry point
├── Makefile               # Automation
├── doctor.sh              # Validation
├── spec/
│   ├── product.md         # Business requirements
│   └── roadmap.md         # Development plan
├── apps/                  # Applications
│   ├── api/               # Backend service
│   ├── ui/                # Frontend application
│   └── worker/            # Background jobs
├── libs/                  # Shared code
└── infra/                 # Infrastructure configs
```

## 🚀 Quick Start

### 1. Copy Template
```bash
cp -r kit/ my-project/
cd my-project/
rm -rf .git/
git init
```

### 2. Configure Project
```bash
# Run validation
./doctor.sh

# Replace placeholders
sed -i 's/\[Project Name\]/My Project/g' *.md spec/*.md
sed -i 's/\[Description\]/AI-powered app/g' *.md spec/*.md
```

### 3. Start Development
```bash
# Setup project structure
make setup

# Start development
make dev

# Validate progress
make check
```

## 🎯 Development Stages

### Stage: `dev` (Default)
- ✅ Direct commits to main
- ✅ Fast iterations
- ✅ Basic validation only
- 🎯 **Goal**: Get working prototype quickly

### Stage: `prod` (When ready)
- ✅ Pull requests required
- ✅ Code review mandatory
- ✅ Full testing pipeline
- 🎯 **Goal**: Production-ready quality

**Switch stages**: Update `stage: dev/prod` in spec/roadmap.md

## 🤖 AI Agent Guidelines

### Task Selection
1. Read spec/roadmap.md for current tasks
2. Pick highest priority available task
3. Update task status: `todo` → `doing` → `done`
4. Update README.md progress after completion

### Commit Format
```
feat: brief description

- what was implemented
- what was tested
- what's next

Stage: dev | Progress: 25% → 30%
```

### Quality Standards
- **English only**: Code, comments, docs, commits
- **Working code**: Always commit functional increments
- **Clear progress**: Update status bars after each task
- **Small changes**: 1-3 files per commit maximum

## 📊 Progress Tracking

### Overall Progress
**Project**: [Project Name]  
**Completion**: ░░░░░░░░░░ 0%  
**Timeline**: Week 0/[X]  
**Focus**: [Current work area]  

### Feature Status
| Feature | Progress | Status | Owner |
|---------|----------|--------|-------|
| [Feature 1] | ░░░░░░░░░░ 0% | todo | AI |
| [Feature 2] | ░░░░░░░░░░ 0% | todo | AI |

**Update this section daily**

## 🔧 Available Commands

```bash
make help         # Show all commands
make setup        # Initialize project structure
make dev          # Start development environment
make test         # Run all tests
make lint         # Check code quality
make build        # Build all applications
make deploy       # Deploy to staging/production
make clean        # Clean generated files
make check        # Full project validation
```

## 📝 File Update Rules

### Daily Updates Required
- **Progress bars**: Update ░░░▓▓▓░░░░ after each completed task
- **Feature status**: Change todo → doing → done
- **Timeline**: Update current week/phase
- **Focus**: Update current work area

### Weekly Updates Required
- **Overall completion**: Recalculate total progress
- **Blockers**: Add/remove current blockers
- **Next week**: Plan upcoming tasks

## 🚨 Critical Rules for AI

### Must Do
- ✅ Read spec/ files before starting work
- ✅ Update progress after each task
- ✅ Commit working code only
- ✅ Use English everywhere
- ✅ Follow stage rules (dev/prod)

### Never Do
- ❌ Commit broken code
- ❌ Use non-English text
- ❌ Skip progress updates
- ❌ Work without reading specs
- ❌ Make large changes without commits

## 🔗 Next Steps

1. **Read**: spec/product.md (business context)
2. **Plan**: spec/roadmap.md (development tasks)
3. **Start**: Pick first task from roadmap
4. **Update**: Progress bars after each completion

---

**Kit Version**: 2.0 | **Type**: AI-First | **Files**: 5 | **Complexity**: Minimal
