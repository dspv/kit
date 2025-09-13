# ROBOT.md - Single Entry Point for AI Agents

> **🤖 For robots**: Always start work from this file  
> **👥 For humans**: Use README.md

## 📋 Mandatory Reading Order

**CRITICAL**: Read files strictly in the specified order:

1. **ROBOT.md** (this file) - basic instructions
2. **spec/00-tldr.md** - project overview summary  
3. **spec/policy.md** - rules and constraints
4. **spec/arch.md** - system architecture
5. **spec/api.md** - API specification
6. **spec/roadmap.md** - development plan

## 🎯 Core Principles

### Single Entry Point
- **For humans** → README.md
- **For robots** → ROBOT.md (this file)

### Markdown-first Approach
- All documentation in Markdown
- Root: README.md, ROBOT.md, optionally HUMAN.md
- Details in /spec/

### Refs Contract (MANDATORY)
Any work result (PR, report, comment) MUST contain minimum 2 references:

```
Refs: spec/arch.md#Components; spec/policy.md#Rules
```

## 📁 Project Structure

```
project/
├── README.md          # For humans
├── ROBOT.md          # For robots (this file)
├── HUMAN.md          # Optional - for humans
├── spec/             # Specifications
│   ├── 00-tldr.md    # Project overview
│   ├── policy.md     # Rules and policies
│   ├── arch.md       # Architecture
│   ├── api.md        # API documentation
│   ├── roadmap.md    # Development plan
│   └── briefs/       # Auto-generated summaries
│       ├── coder.md  # For developers
│       ├── tester.md # For testers
│       └── pm.md     # For managers
├── apps/             # Applications
├── libs/             # Shared code
└── infra/            # Infrastructure
```

## 🔄 Lifecycle (Stages)

### incubate
- Direct pushes to main
- Unit tests mandatory
- Fast iterations

### beta  
- PR only
- 1 approval mandatory
- unit + lint + preview deploy

### release
- Tags v*
- 2 approvals
- unit + lint + e2e + security

## 📊 Briefs System

Auto-generated summaries in `spec/briefs/`:
- **coder.md** - for developers
- **tester.md** - for testers  
- **pm.md** - for managers

Use briefs when working with large files (>1000 lines).

## 🔧 Doctor Script

Run `./doctor.sh` before starting work:
- Checks file structure
- Generates briefs
- Suggests split for large files

## 📝 Versioning

If file >2000 lines or milestone closed:
1. Create `file.v2.md`
2. Add banner to old file:
   ```markdown
   > Archived. See file.v2.md
   ```

## ⚡ Quick Start for Robots

1. **Read mandatory files** (order above)
2. **Check project stage** in spec/roadmap.md
3. **Study current tasks** in spec/roadmap.md
4. **Follow refs contract** in all results
5. **Update progress** in corresponding files

## 🚨 Critical Rules

- ❌ **DO NOT start work without reading spec/**
- ❌ **DO NOT make PR without refs contract**
- ❌ **DO NOT ignore stage rules**
- ✅ **ALWAYS read in specified order**
- ✅ **ALWAYS use refs in results**
- ✅ **ALWAYS update progress**

## 🔗 Next Step

➡️ **Read spec/00-tldr.md**

---

**Kit Version**: 3.0 | **Spec-Kit**: v1.0 | **Stage**: template
