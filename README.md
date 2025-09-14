# Spec-Kit v1.0 - Simplified Project Template

🚀 Status: Template Ready (100%)
📅 Timeline: Ready for Use  
🎯 Focus: Clean Project Structure

> **👥 For humans**: Start here | **🤖 For AI**: Use ROBOT.md

## 🎯 What is Spec-Kit?

A **streamlined project structure template** that provides:
- Clear documentation organization
- Automated validation tools
- AI-friendly project navigation
- Essential files only (no bloat)

## 📦 Core Files

### **Essential Structure**
- **`README.md`** - Project overview (this file)
- **`ROBOT.md`** - AI entry point and instructions
- **`doctor.sh`** - Automated project validation
- **`Makefile`** - Common automation commands

### **Specification Files**
- **`spec/00-tldr.md`** - Quick project overview
- **`spec/policy.md`** - Rules and development policies  
- **`spec/arch.md`** - Technical architecture
- **`spec/roadmap.md`** - Requirements and development plan
- **`spec/api.md`** - API documentation (when needed)

## 🚀 Quick Start

### 1. Copy and Setup
```bash
# Copy kit to your project
cp -r spec-kit/ my-project/
cd my-project/

# Validate structure
./doctor.sh

# Initialize git (if needed)
git init
```

### 2. Customize for Your Project
```bash
# Replace placeholders
sed -i 's/\[Project Name\]/My Project/g' *.md spec/*.md
sed -i 's/\[Brief Description\]/Your description/g' *.md spec/*.md

# Or edit files manually:
# [Project Name] → Your actual project name
# [Brief Description] → Your project description
# [X] → Real numbers and dates
```

### 3. Start Development
```bash
# Run validation checks
make check

# Create your project structure
mkdir -p src/ tests/ docs/

# Begin development following spec/roadmap.md
```

## 📊 Simplified Structure

```
project/
├── README.md              # Project overview (humans)
├── ROBOT.md              # AI entry point
├── doctor.sh             # Validation script
├── Makefile              # Automation commands
└── spec/
    ├── 00-tldr.md        # Quick overview
    ├── policy.md         # Rules and policies
    ├── arch.md           # Technical architecture
    ├── roadmap.md        # Requirements & roadmap
    └── api.md            # API documentation
```

## 🎯 Key Features

### **Refs Contract**
Work results must include references:
```
Refs: spec/arch.md#Components; spec/policy.md#Rules
```

### **Development Stages**
- **incubate**: Direct pushes, unit tests required
- **beta**: PR + 1 approval, full testing
- **release**: PR + 2 approvals, complete validation

### **Automated Validation**
```bash
./doctor.sh              # Full health check
./doctor.sh --pre-commit # Quick pre-commit check
make check               # Run all validations
```

## ✅ Usage

1. **Copy kit to new project**
2. **Run `./doctor.sh`** for structure validation
3. **Customize spec/ files** for your project
4. **Replace README.md** with your project details
5. **Follow development methodology**

## 🔧 Benefits

### For Developers
- Clear project structure and rules
- Automated validation and checks
- Consistent documentation format

### For AI Agents  
- Structured entry point via ROBOT.md
- Mandatory reading order for context
- Clear references system for traceability

### For Teams
- Unified documentation approach
- Stage-based development process
- Built-in quality gates

---

**Version**: Simplified v1.0 | **Focus**: Essential files only
