# ROBOT.md - AI Entry Point

> **🤖 For AI agents**: Start here for project understanding  
> **👥 For humans**: Use README.md instead

## 📋 Reading Order (MANDATORY)

Read files in this exact order:

1. **ROBOT.md** (this file) - basic instructions
2. **spec/00-tldr.md** - project overview  
3. **spec/policy.md** - rules and constraints
4. **spec/arch.md** - system architecture
5. **spec/roadmap.md** - requirements and development plan
6. **spec/api.md** - API specification (if applicable)

## 🎯 Core Rules

### Refs Contract
Any work result (PR, commit, report) MUST include 2+ references:

```
Refs: spec/arch.md#Components; spec/policy.md#Rules
```

### Project Stages
- **incubate**: Direct pushes, unit tests required
- **beta**: PR + 1 approval, lint + tests + preview
- **release**: PR + 2 approvals, full testing + security

## 📁 Project Structure

```
project/
├── README.md              # For humans
├── ROBOT.md              # For AI (this file)
├── doctor.sh             # Validation script
├── Makefile              # Automation commands
└── spec/
    ├── 00-tldr.md        # Quick overview
    ├── policy.md         # Rules and policies
    ├── arch.md           # Technical architecture
    ├── roadmap.md        # Requirements & roadmap
    └── api.md            # API documentation
```

## ⚡ Quick Start

1. Run `./doctor.sh` to validate structure
2. Read specs in order above
3. Check current stage in roadmap.md
4. Follow refs contract in all work
5. Update progress in relevant files

## 🚨 Critical Rules

- ❌ **DO NOT** skip reading spec/ files
- ❌ **DO NOT** make PRs without refs contract
- ❌ **DO NOT** ignore stage rules
- ✅ **ALWAYS** read files in specified order
- ✅ **ALWAYS** include refs in work results
- ✅ **ALWAYS** update progress

---

**Version**: Simplified v1.0 | **Next**: spec/00-tldr.md