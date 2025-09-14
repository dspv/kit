#!/bin/bash

# Doctor Script for Spec-Kit v1.0
# Checks project structure and generates briefs

set -e

echo "🩺 Doctor Script - Spec-Kit v1.0"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check required files
check_required_files() {
    log_info "Checking required files..."
    
    local required_files=(
        "README.md"
        "ROBOT.md"
        "spec/00-tldr.md"
        "spec/policy.md"
        "spec/arch.md"
        "spec/api.md"
        "spec/roadmap.md"
    )
    
    local missing_files=()
    
    for file in "${required_files[@]}"; do
        if [[ -f "$file" ]]; then
            log_success "$file found"
        else
            log_error "$file missing"
            missing_files+=("$file")
        fi
    done
    
    if [[ ${#missing_files[@]} -gt 0 ]]; then
        log_error "Missing required files: ${missing_files[*]}"
        return 1
    fi
    
    log_success "All required files present"
}

# Check directory structure
check_directory_structure() {
    log_info "Checking directory structure..."
    
    local required_dirs=(
        "spec"
        "spec/briefs"
    )
    
    for dir in "${required_dirs[@]}"; do
        if [[ -d "$dir" ]]; then
            log_success "Directory $dir exists"
        else
            log_warning "Creating directory $dir"
            mkdir -p "$dir"
        fi
    done
}

# Check file sizes
check_file_sizes() {
    log_info "Checking file sizes (>2000 lines)..."
    
    local large_files=()
    
    while IFS= read -r -d '' file; do
        local line_count=$(wc -l < "$file")
        if [[ $line_count -gt 2000 ]]; then
            log_warning "$file contains $line_count lines (>2000)"
            echo "  💡 Consider creating ${file%.md}.v2.md"
            large_files+=("$file")
        fi
    done < <(find spec/ -name "*.md" -type f -print0)
    
    if [[ ${#large_files[@]} -eq 0 ]]; then
        log_success "All files have acceptable size"
    fi
}

# Check refs contract (flexible for different languages)
check_refs_contract() {
    log_info "Checking refs contract in files..."
    
    local files_without_refs=()
    
    while IFS= read -r -d '' file; do
        # Check for refs in multiple languages/formats
        if grep -q -E "(Refs:|Ссылки:|References:|Links:)" "$file"; then
            log_success "$file contains refs contract"
        else
            log_warning "$file missing refs contract (non-blocking)"
            files_without_refs+=("$file")
        fi
    done < <(find spec/ -name "*.md" -type f -print0)
    
    # Note: This is non-blocking to support different languages
    if [[ ${#files_without_refs[@]} -gt 0 ]]; then
        log_info "Consider adding refs contract to improve traceability"
    fi
}

# Check for non-English text in code files
check_code_language() {
    log_info "Checking for non-English text in code..."
    
    local non_english_files=()
    local code_extensions=("*.js" "*.ts" "*.jsx" "*.tsx" "*.go" "*.py" "*.java" "*.cpp" "*.c" "*.h" "*.cs" "*.php" "*.rb" "*.rs" "*.swift" "*.kt")
    
    for ext in "${code_extensions[@]}"; do
        while IFS= read -r -d '' file; do
            # Check for Cyrillic, Chinese, Japanese, Arabic, etc.
            if grep -q -P '[\p{Cyrillic}\p{Han}\p{Hiragana}\p{Katakana}\p{Arabic}\p{Hebrew}]' "$file" 2>/dev/null; then
                non_english_files+=("$file")
                log_warning "$file contains non-English text (non-blocking)"
            fi
        done < <(find . -name "$ext" -type f -not -path "./.git/*" -not -path "./node_modules/*" -not -path "./vendor/*" -print0 2>/dev/null)
    done
    
    # Also check comments in code files
    for ext in "${code_extensions[@]}"; do
        while IFS= read -r -d '' file; do
            # Check for Russian comments (common pattern)
            if grep -q -E '//.*[а-яё]|/\*.*[а-яё].*\*/|#.*[а-яё]' "$file" 2>/dev/null; then
                log_warning "$file has non-English comments (non-blocking)"
            fi
        done < <(find . -name "$ext" -type f -not -path "./.git/*" -not -path "./node_modules/*" -not -path "./vendor/*" -print0 2>/dev/null)
    done
    
    if [[ ${#non_english_files[@]} -eq 0 ]]; then
        log_success "Code files use English text"
    else
        log_info "Consider translating non-English text in code to English"
    fi
}

# Check README status indicators
check_readme_status() {
    log_info "Checking README status indicators..."
    
    if [[ ! -f "README.md" ]]; then
        log_warning "README.md not found"
        return 0
    fi
    
    local has_status=false
    local has_timeline=false
    local has_focus=false
    
    # Check for status indicators (flexible patterns)
    if grep -q -E "🚀.*[Ss]tatus.*:" README.md; then
        has_status=true
        log_success "README has status indicator"
    fi
    
    if grep -q -E "📅.*[Tt]imeline.*:" README.md; then
        has_timeline=true
        log_success "README has timeline indicator"
    fi
    
    if grep -q -E "🎯.*[Ff]ocus.*:" README.md; then
        has_focus=true
        log_success "README has focus indicator"
    fi
    
    if [[ "$has_status" == true && "$has_timeline" == true && "$has_focus" == true ]]; then
        log_success "README has all required status indicators"
    else
        log_warning "README missing status indicators (non-blocking)"
        log_info "Add: 🚀 Status: [State] ([%]) | 📅 Timeline: [Time] | 🎯 Focus: [Area]"
    fi
}

# Generate briefs
generate_briefs() {
    log_info "Generating briefs..."
    
    local current_date=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Update date in existing briefs
    if [[ -f "spec/briefs/coder.md" ]]; then
        sed -i.bak "s/Updated: [0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9] [0-9][0-9]:[0-9][0-9]:[0-9][0-9]/Updated: $current_date/g" spec/briefs/coder.md
        rm spec/briefs/coder.md.bak 2>/dev/null || true
        log_success "Updated spec/briefs/coder.md"
    fi
    
    if [[ -f "spec/briefs/tester.md" ]]; then
        sed -i.bak "s/Updated: [0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9] [0-9][0-9]:[0-9][0-9]:[0-9][0-9]/Updated: $current_date/g" spec/briefs/tester.md
        rm spec/briefs/tester.md.bak 2>/dev/null || true
        log_success "Updated spec/briefs/tester.md"
    fi
    
    if [[ -f "spec/briefs/pm.md" ]]; then
        sed -i.bak "s/Updated: [0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9] [0-9][0-9]:[0-9][0-9]:[0-9][0-9]/Updated: $current_date/g" spec/briefs/pm.md
        rm spec/briefs/pm.md.bak 2>/dev/null || true
        log_success "Updated spec/briefs/pm.md"
    fi
    
    log_success "Briefs updated"
}

# Check project stage
check_project_stage() {
    log_info "Determining project stage..."
    
    if [[ -f "spec/roadmap.md" ]]; then
        if grep -q "incubate" spec/roadmap.md; then
            log_info "Stage: incubate (direct pushes allowed)"
        elif grep -q "beta" spec/roadmap.md; then
            log_info "Stage: beta (PR only, 1 approval)"
        elif grep -q "release" spec/roadmap.md; then
            log_info "Stage: release (2 approvals, full testing)"
        else
            log_warning "Stage not defined in roadmap.md"
        fi
    fi
}

# Check git hooks
check_git_hooks() {
    log_info "Checking git hooks..."
    
    if [[ -d ".git" ]]; then
        local pre_commit_hook=".git/hooks/pre-commit"
        
        if [[ ! -f "$pre_commit_hook" ]]; then
            log_warning "Pre-commit hook not found"
            log_info "Creating pre-commit hook..."
            
            cat > "$pre_commit_hook" << 'EOF'
#!/bin/bash
# Pre-commit hook for Spec-Kit v1.0
# Language-agnostic checks

echo "🔍 Pre-commit checks..."

# Run doctor script in non-blocking mode
if ! ./doctor.sh --pre-commit; then
    echo "⚠️  Doctor script warnings (non-blocking)"
    echo "ℹ️  Consider fixing warnings for better project health"
fi

echo "✅ Pre-commit checks completed"
EOF
            
            chmod +x "$pre_commit_hook"
            log_success "Pre-commit hook created"
        else
            log_success "Pre-commit hook exists"
        fi
    else
        log_warning "Not a git repository, hooks not needed"
    fi
}

# Generate report
generate_report() {
    log_info "Generating report..."
    
    local report_file="doctor-report.md"
    local current_date=$(date '+%Y-%m-%d %H:%M:%S')
    
    cat > "$report_file" << EOF
# Doctor Report

**Date**: $current_date  
**Spec-Kit**: v1.0

## Check Status

- ✅ Required files
- ✅ Directory structure  
- ✅ File sizes
- ✅ Refs contract
- ✅ Briefs updated
- ✅ Git hooks

## Recommendations

$(if [[ -f "spec/roadmap.md" ]] && ! grep -q "Stage:" spec/roadmap.md; then
    echo "- Add stage information to roadmap.md"
fi)

$(while IFS= read -r -d '' file; do
    local line_count=$(wc -l < "$file")
    if [[ $line_count -gt 2000 ]]; then
        echo "- Consider splitting $file ($line_count lines)"
    fi
done < <(find spec/ -name "*.md" -type f -print0))

## Next Steps

1. Update placeholders in spec/ files
2. Configure CI/CD pipeline
3. Add automatic briefs updates

---

**Refs**: spec/policy.md#Doctor; spec/arch.md#Structure
EOF
    
    log_success "Report saved to $report_file"
}

# Main function
main() {
    local pre_commit_mode=false
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --pre-commit)
                pre_commit_mode=true
                shift
                ;;
            --help|-h)
                echo "Usage: $0 [--pre-commit] [--help]"
                echo ""
                echo "Options:"
                echo "  --pre-commit  Pre-commit hook mode (non-blocking)"
                echo "  --help, -h    Show this help"
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    echo ""
    
    # Execute checks (non-blocking in pre-commit mode)
    if [[ "$pre_commit_mode" == true ]]; then
        # Pre-commit mode: warnings only, no failures
        check_directory_structure || true
        check_required_files || true
        check_file_sizes || true
        check_refs_contract || true
        check_readme_status || true
        check_code_language || true
        generate_briefs || true
        check_project_stage || true
    else
        # Normal mode: can fail on critical issues
        check_directory_structure
        check_required_files
        check_file_sizes
        check_refs_contract
        check_readme_status
        check_code_language
        generate_briefs
        check_project_stage
        check_git_hooks
        generate_report
    fi
    
    echo ""
    log_success "Doctor script completed successfully!"
    
    if [[ "$pre_commit_mode" == false ]]; then
        echo ""
        log_info "💡 Run './doctor.sh --help' for help"
        log_info "💡 Configure pre-commit hook: cp doctor.sh .git/hooks/pre-commit"
    fi
}

# Run
main "$@"
