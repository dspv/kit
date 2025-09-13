# Migration Guide

> **🎯 Goal**: Help with transition to Spec-Kit v1.0

## 🔄 Migration from Previous Versions

### From Kit v2.0 → Spec-Kit v1.0

#### What Changed
- `START.md` → `ROBOT.md` (new logic for AI agents)
- Added mandatory files: `00-tldr.md`, `policy.md`, `arch.md`, `api.md`
- New `spec/briefs/` system for auto-generating summaries
- Refs contract became mandatory
- Doctor script for automatic validation

#### Migration Steps

1. **Create new mandatory files**
```bash
# Copy templates from new kit
cp kit/spec/00-tldr.md your-project/spec/
cp kit/spec/policy.md your-project/spec/
cp kit/spec/arch.md your-project/spec/
cp kit/spec/api.md your-project/spec/

# Create ROBOT.md
cp kit/ROBOT.md your-project/
```

2. **Setup briefs system**
```bash
mkdir -p your-project/spec/briefs/
cp kit/spec/briefs/* your-project/spec/briefs/
```

3. **Add utilities**
```bash
cp kit/doctor.sh your-project/
cp kit/version-file.sh your-project/
chmod +x your-project/doctor.sh
chmod +x your-project/version-file.sh
```

4. **Update existing files**
- Add refs contract to all spec/ files
- Update README.md according to new structure
- Setup git templates

5. **Run validation**
```bash
cd your-project
./doctor.sh
```

### From GitSpecOps → Spec-Kit v1.0

#### What is Preserved
- Existing `spec/` structure
- Files `product.md`, `requirements.md`, `roadmap.md`, `kpi.md`
- GitSpecOps principles

#### What is Added
- Mandatory files: `00-tldr.md`, `policy.md`, `arch.md`, `api.md`
- `ROBOT.md` for AI agents
- Briefs system
- Refs contract
- Doctor script

#### Migration Steps

1. **Add missing files**
```bash
# Mandatory files
touch spec/00-tldr.md spec/policy.md spec/arch.md spec/api.md

# ROBOT.md
cp kit/ROBOT.md .

# Briefs system
mkdir -p spec/briefs/
cp kit/spec/briefs/* spec/briefs/
```

2. **Fill new files**
- `spec/00-tldr.md` - project overview summary
- `spec/policy.md` - rules and policies
- `spec/arch.md` - technical architecture
- `spec/api.md` - API documentation

3. **Add refs contract**
```bash
# Example of adding refs to end of file
echo "" >> spec/roadmap.md
echo "---" >> spec/roadmap.md
echo "" >> spec/roadmap.md
echo "**Refs**: spec/arch.md#Architecture; spec/policy.md#Development" >> spec/roadmap.md
```

## 🆕 New Features v1.0

### Single Entry Point
- **Humans**: README.md
- **AI agents**: ROBOT.md

### Mandatory Reading Order
ROBOT.md → 00-tldr.md → policy.md → arch.md → api.md → roadmap.md

### Briefs System
Auto-generated summaries:
- `spec/briefs/coder.md` - for developers
- `spec/briefs/tester.md` - for testers
- `spec/briefs/pm.md` - for managers

### Refs Contract
Mandatory references in each result:
```
Refs: spec/arch.md#Components; spec/policy.md#Rules
```

### Doctor Script
```bash
./doctor.sh              # Full validation
./doctor.sh --pre-commit # Pre-commit mode
```

### Versioning
```bash
./version-file.sh spec/roadmap.md  # Automatic versioning
```

## 🔧 Setup After Migration

### 1. Git Configuration
```bash
# Setup commit template
git config commit.template .gitmessage

# Setup pre-commit hook
./doctor.sh  # Automatically creates hook
```

### 2. Fill Placeholders
```bash
# Bulk replacement
find . -name "*.md" -exec sed -i 's/\[Project Name\]/Your Project/g' {} +
find . -name "*.md" -exec sed -i 's/\[Brief Description\]/Your Description/g' {} +
```

### 3. Structure Validation
```bash
./doctor.sh
# Fix all warnings
```

### 4. First Commit
```bash
git add .
git commit -m "feat: migrate to Spec-Kit v1.0

- added ROBOT.md as AI entry point
- created mandatory spec structure
- implemented briefs system
- added refs-contract to all files
- configured doctor script and git hooks

Refs: spec/policy.md#Migration; spec/arch.md#Structure"
```

## 🚨 Common Issues

### Missing Refs Contracts
```bash
# Problem: files without refs
⚠️  spec/roadmap.md missing refs contract

# Solution: add refs to end of file
echo "**Refs**: spec/arch.md#Roadmap; spec/policy.md#Planning" >> spec/roadmap.md
```

### Large Files (>2000 lines)
```bash
# Problem: file too large
⚠️  spec/roadmap.md contains 2150 lines (>2000)

# Solution: versioning
./version-file.sh spec/roadmap.md
```

### Broken Links After Versioning
```bash
# Problem: old links to versioned files
# Solution: bulk update
find . -name "*.md" -exec sed -i 's|spec/roadmap.md|spec/roadmap.v2.md|g' {} +
```

## ✅ Migration Checklist

### Mandatory Files
- [ ] `ROBOT.md` created
- [ ] `spec/00-tldr.md` created and filled
- [ ] `spec/policy.md` created and filled
- [ ] `spec/arch.md` created and filled
- [ ] `spec/api.md` created and filled

### Briefs System
- [ ] `spec/briefs/` folder created
- [ ] `spec/briefs/coder.md` created
- [ ] `spec/briefs/tester.md` created
- [ ] `spec/briefs/pm.md` created

### Utilities
- [ ] `doctor.sh` copied and executable
- [ ] `version-file.sh` copied and executable
- [ ] Pre-commit hook configured

### Refs Contract
- [ ] All spec/ files contain refs
- [ ] PR template updated
- [ ] Commit template configured

### Validation
- [ ] `./doctor.sh` passes without errors
- [ ] All placeholders replaced
- [ ] Git hooks working

## 📞 Support

For migration issues:
1. Run `./doctor.sh` for diagnostics
2. Check this migration file
3. Study examples in kit/ folder

---

**Last Updated**: 2025-09-13 | **Refs**: spec/policy.md#Migration; spec/versioning-guide.md#Process
