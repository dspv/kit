# Kit - Project Starter Template

> **🎯 Purpose**: Standard structure and guidelines for new projects following GitSpecOps methodology

## 📦 What's Inside

### **📋 Core Files**
- **`START.md`** - Development guidelines (move to `spec/guide.md` after first commit)
- **`spec/`** - Complete specification templates for new projects
- **`README.md`** - This file (replace with your project description)

## 🚀 Quick Setup

### 1. Copy Kit to New Project
```bash
# Copy entire kit to your new project
cp -r kit/ my-new-project/
cd my-new-project/

# Clean up
rm -rf .git/  # Remove kit's git history
git init      # Initialize new repo
```

### 2. Customize Templates
Replace placeholders in all files:
```bash
# Quick replace (macOS/Linux)
sed -i 's/\[Project Name\]/My Awesome Project/g' *.md
sed -i 's/\[Brief Description\]/AI-powered task management/g' *.md

# Or edit manually:
# [Project Name] → Your project name
# [Brief Description] → Short description
# [X] → Actual numbers (weeks, budgets)
# [Phase Name] → Your development phases
```

### 3. Set Up Project Structure
```bash
# Replace this README with your project description
# Keep spec/ templates and customize them
# Move START.md to spec/guide.md after first commit

# Create monorepo structure
mkdir -p apps/{api,ui,worker}
mkdir -p libs/shared
mkdir -p infra/{docker,k8s}

# Initialize basic files
touch .env.example docker-compose.yml Makefile
```

## 📊 Standard Structure

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
```

## ✅ Usage

1. **Copy kit to new project**
2. **Customize spec/ templates** with your project details
3. **Replace this README** with your project description
4. **Follow GitSpecOps methodology** from spec/guide.md

---

**Kit Version**: 2.0 | **Methodology**: GitSpecOps
