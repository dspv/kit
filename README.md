# Kit - AI-First Development Framework

**Status**: Ready for Use  
**Version**: 3.0  
**Type**: Universal starter + development guide  

> Efficient project structure and development principles for AI-assisted development

## Quick Start

### For New Projects
```bash
# 1. Copy kit to your project
cp -r kit/ my-project/
cd my-project/

# 2. Initialize
rm -rf .git/ && git init
./doctor.sh

# 3. Configure your project
# Edit .ai/context.md with your product details
# Edit .ai/tasks.md with initial tasks

# 4. Start developing
make dev
```

### For Existing Projects
```bash
# Copy only the guides and validation
cp kit/GUIDE.md ./
cp kit/DOCS.md ./
cp kit/doctor.sh ./
cp kit/Makefile ./
mkdir -p .ai/
cp kit/.ai/context.md ./.ai/
cp kit/.ai/tasks.md ./.ai/

# Run validation
./doctor.sh
```

## What's Inside

### Core Files
```
kit/
├── README.md          # This file - entry point
├── GUIDE.md           # Development principles and standards
├── DOCS.md            # Living documentation template
├── Makefile           # Automation commands
├── doctor.sh          # Project validation
└── .ai/
    ├── context.md     # Project context (what, why, for whom)
    ├── tasks.md       # Task queue for AI agents
    └── notes/         # Temporary working notes
```

### Project Structure (Created on Setup)
```
your-project/
├── apps/
│   ├── api/           # Backend (Go by default)
│   ├── ui/            # Frontend (TypeScript + React)
│   └── worker/        # Background jobs
├── libs/              # Shared libraries
└── infra/             # Infrastructure as code
```

## Documentation Flow

### For Humans
1. **README.md** - Start here, quick links, project status
2. **GUIDE.md** - Read once, reference always (principles, standards)
3. **DOCS.md** - Check for implementation details, grows with project
4. **.ai/context.md** - Business context and goals

### For AI Agents
1. **README.md** - Entry point, understand project structure
2. **GUIDE.md** - Read completely before starting development
3. **.ai/context.md** - Understand what we're building and why
4. **.ai/tasks.md** - Pick task, implement, update status
5. **DOCS.md** - Document completed features here
6. **.ai/notes/** - Use for temporary working notes during tasks

## Commands

```bash
make help         # Show all available commands
make setup        # Initialize project structure
make dev          # Start development environment
make check        # Run validation (doctor + lint + tests)
make build        # Build all applications
make deploy       # Deploy to production
```

## Key Principles

### 1. English Only in Technical Content
- All code, comments, commits, PRs must be in English
- Pre-commit hook enforces this
- Read GUIDE.md for details

### 2. Consolidated Documentation
- Use DOCS.md for permanent documentation
- Use .ai/notes/ for temporary working notes
- Don't create scattered .md files
- Read GUIDE.md#documentation-management

### 3. Autonomous AI Development
- Tasks have goals and success metrics, not step-by-step instructions
- AI has freedom to choose implementation approach
- Focus on outcomes, not process
- Read .ai/tasks.md for task format

### 4. Context Management
- Keep context lean (read GUIDE.md#context-management)
- Use .ai/notes/ for working notes during tasks
- Transfer important decisions to DOCS.md after completion
- Clean .ai/notes/ regularly

## Default Tech Stack

**Backend/Workers**: Go (unless specified otherwise)  
**Frontend**: TypeScript + React/Next.js  
**Database**: PostgreSQL  
**Cache**: Redis  
**Infrastructure**: Docker + Kubernetes  

Override defaults in .ai/context.md if needed.

## Validation

Run health check anytime:
```bash
./doctor.sh
```

Checks:
- Required files present
- English-only content (blocks non-English in technical files)
- Proper commit message format
- No hardcoded secrets
- Project structure valid

## Current Project Status

**Stage**: `template`  
**Progress**: Ready for use  
**Next**: Copy to your project and configure .ai/context.md  

---

**Quick Links**:
- [Development Guide](GUIDE.md) - Principles and standards
- [Documentation](DOCS.md) - Implementation details
- [Project Context](.ai/context.md) - What we're building
- [Task Queue](.ai/tasks.md) - Development tasks

**Kit Version**: 3.0 | **Focus**: AI-First | **Complexity**: Minimal
