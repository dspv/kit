# Kit - Spec-Kit v1.0 Template

🚀 Status: Template Ready (100%)
📅 Timeline: Ready for Use
🎯 Focus: Project Structure Template

> **🎯 Entry point for humans** | For robots → ROBOT.md

## 🚀 Spec-Kit v1.0 - New Methodology

### **Single Entry Point**
- **👥 For humans** → README.md (this file)
- **🤖 For robots** → ROBOT.md

### **Markdown-first Approach**
- All documentation in Markdown
- Root: README.md, ROBOT.md, optionally HUMAN.md
- Details in /spec/

### **Mandatory Reading Order (for robots)**
ROBOT.md → spec/00-tldr.md → spec/policy.md → spec/arch.md → spec/api.md → spec/roadmap.md

## 📦 What's Inside

### **📋 Mandatory Files**
- **`ROBOT.md`** - Single entry point for AI agents
- **`spec/00-tldr.md`** - Project overview summary
- **`spec/policy.md`** - Rules and policies
- **`spec/arch.md`** - System architecture
- **`spec/api.md`** - API specification
- **`spec/roadmap.md`** - Development plan
- **`spec/briefs/`** - Auto-generated role summaries
- **`doctor.sh`** - Structure validation script

### **🔧 Additional Files**
- **`spec/kpi.md`** - Metrics and progress
- **`spec/product.md`** - Business specification
- **`spec/requirements.md`** - Technical requirements
- **`spec/guide.md`** - Development guide

## 🚀 Quick Start

### 1. Copy Kit to New Project
```bash
# Copy entire kit to new project
cp -r kit/ my-new-project/
cd my-new-project/

# Cleanup
rm -rf .git/  # Remove kit's git history
git init      # Initialize new repo
```

### 2. Project Setup
```bash
# Run doctor script for validation
./doctor.sh

# Replace placeholders in all files
sed -i 's/\[Project Name\]/My Awesome Project/g' *.md spec/*.md
sed -i 's/\[Brief Description\]/AI-powered task management/g' *.md spec/*.md

# Or edit manually:
# [Project Name] → Your project name
# [Brief Description] → Short description
# [X] → Real numbers (weeks, budgets)
```

### 3. Create Project Structure
```bash
# Create monorepo structure
mkdir -p apps/{api,ui,worker}
mkdir -p libs/shared
mkdir -p infra/{docker,k8s}

# Initialize basic files
touch .env.example docker-compose.yml Makefile

# Setup git hooks
./doctor.sh  # Automatically creates pre-commit hook
```

## 📊 New Spec-Kit v1.0 Structure

<<<<<<< HEAD
### **spec/** - Project Specifications
- **`product.md`** - Business case, target users, value proposition
- **`requirements.md`** - Technical requirements, user stories, architecture  
- **`roadmap.md`** - Development phases, timeline, deliverables
- **`backlog.md`** - Detailed tasks for AI agents with priorities and dependencies
- **`kpi.md`** - Progress tracking with visual bars (`▓▓▓░░░░░░░ 30%`)
- **`guide.md`** - Development guidelines (from START.md)

## 🎯 Development Standards

### **GitSpecOps Methodology**
- **Repository = Truth** - Repo state reflects project reality
- **Specification-Driven** - Complete spec/ before coding
- **Visible Progress** - Always clear what's done/in-progress/blocked
- **AI-Agent Friendly** - Clear guidelines for autonomous development

### **Required Files Structure**
```
project/
├── README.md          # Project overview and current status
├── spec/
│   ├── guide.md       # Development guidelines (from START.md)
│   ├── product.md     # Business specification
│   ├── requirements.md # Technical requirements
│   ├── roadmap.md     # Development phases
│   ├── backlog.md     # Detailed tasks for AI agents
│   └── kpi.md         # Progress tracking
├── apps/              # Service implementations
├── libs/              # Shared code
└── infra/             # Infrastructure configs
=======
```
project/
├── README.md              # For humans
├── ROBOT.md              # For robots
├── HUMAN.md              # Optional - for humans
├── doctor.sh             # Validation script
├── spec/                 # Specifications
│   ├── 00-tldr.md        # Project overview (MANDATORY)
│   ├── policy.md         # Rules and policies (MANDATORY)
│   ├── arch.md           # Architecture (MANDATORY)
│   ├── api.md            # API documentation (MANDATORY)
│   ├── roadmap.md        # Development plan (MANDATORY)
│   ├── product.md        # Business specification
│   ├── requirements.md   # Technical requirements
│   ├── kpi.md           # Metrics and progress
│   ├── guide.md         # Development guide
│   └── briefs/          # Auto-generated summaries
│       ├── coder.md     # For developers
│       ├── tester.md    # For testers
│       └── pm.md        # For managers
├── apps/                # Applications
├── libs/                # Shared code
└── infra/               # Infrastructure
```

## 🎯 Key Principles

### **Refs Contract (MANDATORY)**
Any work result MUST contain minimum 2 references:
```
Refs: spec/arch.md#Components; spec/policy.md#Rules
```

### **Briefs System**
Auto-generated summaries for different roles:
- `spec/briefs/coder.md` - for developers
- `spec/briefs/tester.md` - for testers
- `spec/briefs/pm.md` - for managers

### **Lifecycle Stages**
- **incubate**: direct pushes to main, unit tests
- **beta**: PR-only, 1 approval, unit+lint+preview deploy
- **release**: tags v*, 2 approvals, unit+lint+e2e+security

### **Large File Versioning**
If file >2000 lines → create `file.v2.md` + banner in old

### **Doctor Script**
```bash
./doctor.sh              # Full check + report
./doctor.sh --pre-commit # Pre-commit hook mode
>>>>>>> 4403ee8 (feat: translate all Russian text to English)
```

## ✅ Usage

1. **Copy kit to new project**
2. **Run `./doctor.sh`** for structure validation
3. **Configure spec/ files** for your project
4. **Replace this README** with your project description
5. **Follow Spec-Kit v1.0 methodology**

## 🔄 Migration from Previous Versions

### From Kit v2.0
- `START.md` → `ROBOT.md` (updated logic)
- Add mandatory files: `spec/00-tldr.md`, `spec/policy.md`, `spec/arch.md`, `spec/api.md`
- Create `spec/briefs/` structure
- Add `doctor.sh` script

### From GitSpecOps
- Keep existing `spec/` structure
- Add new mandatory files
- Implement refs contract
- Setup briefs system

---

**Kit Version**: 3.0 | **Spec-Kit**: v1.0 | **Methodology**: Spec-Kit
