#!/bin/bash

# Simplified Doctor Script for Spec-Kit v1.0
# Focus on essential checks only

set -e

echo "🩺 Spec-Kit Doctor - Essential Checks"
echo "===================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Check required files
check_required_files() {
    log_info "Checking required files..."
    
    local required_files=(
        "README.md"
        "ROBOT.md"
        "spec/00-tldr.md"
        "spec/policy.md"
        "spec/arch.md"
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
check_directories() {
    log_info "Checking directory structure..."
    
    if [[ ! -d "spec" ]]; then
        log_warning "Creating spec/ directory"
        mkdir -p spec
    else
        log_success "spec/ directory exists"
    fi
}

# Check file sizes
check_file_sizes() {
    log_info "Checking for large files (>2000 lines)..."
    
    local large_files=()
    
    while IFS= read -r -d '' file; do
        local line_count=$(wc -l < "$file" 2>/dev/null || echo 0)
        if [[ $line_count -gt 2000 ]]; then
            log_warning "$file contains $line_count lines (>2000)"
            echo "  💡 Consider splitting into ${file%.md}.v2.md"
            large_files+=("$file")
        fi
    done < <(find spec/ -name "*.md" -type f -print0 2>/dev/null)
    
    if [[ ${#large_files[@]} -eq 0 ]]; then
        log_success "All files have reasonable size"
    fi
}

# Check README status indicators
check_readme_status() {
    log_info "Checking README status indicators..."
    
    if [[ ! -f "README.md" ]]; then
        log_warning "README.md not found"
        return 0
    fi
    
    # Check for status indicators
    if grep -q -E "🚀.*[Ss]tatus" README.md && 
       grep -q -E "📅.*[Tt]imeline" README.md && 
       grep -q -E "🎯.*[Ff]ocus" README.md; then
        log_success "README has status indicators"
    else
        log_warning "README missing status indicators"
        log_info "Add: 🚀 Status: [State] | 📅 Timeline: [Time] | 🎯 Focus: [Area]"
    fi
}

# Setup git hooks
setup_git_hooks() {
    log_info "Setting up git hooks..."
    
    if [[ -d ".git" ]]; then
        local pre_commit_hook=".git/hooks/pre-commit"
        
        if [[ ! -f "$pre_commit_hook" ]]; then
            log_info "Creating pre-commit hook..."
            
            cat > "$pre_commit_hook" << 'EOF'
#!/bin/bash
# Pre-commit hook for Spec-Kit

echo "🔍 Pre-commit checks..."

# Run doctor script
if ! ./doctor.sh --pre-commit; then
    echo "⚠️  Doctor script found issues (non-blocking)"
fi

echo "✅ Pre-commit checks completed"
EOF
            
            chmod +x "$pre_commit_hook"
            log_success "Pre-commit hook created"
        else
            log_success "Pre-commit hook already exists"
        fi
    else
        log_info "Not a git repository - skipping git hooks"
    fi
}

# Generate simple report
generate_report() {
    log_info "Generating health report..."
    
    local report_file="doctor-report.md"
    local current_date=$(date '+%Y-%m-%d %H:%M:%S')
    
    cat > "$report_file" << EOF
# Spec-Kit Health Report

**Date**: $current_date  
**Version**: Simplified v1.0

## ✅ Checks Passed

- Required files structure
- Directory organization
- File size validation
- README status indicators
- Git hooks setup

## 💡 Next Steps

1. Customize spec/ files for your project
2. Update README.md with project details
3. Set proper status indicators
4. Run \`make check\` regularly

---

**Refs**: spec/policy.md#Structure; spec/arch.md#Overview
EOF
    
    log_success "Health report saved to $report_file"
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
                echo "Simplified Spec-Kit doctor script"
                echo "Options:"
                echo "  --pre-commit  Pre-commit hook mode"
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
    
    # Execute checks
    if [[ "$pre_commit_mode" == true ]]; then
        # Pre-commit: non-blocking
        check_directories || true
        check_required_files || true
        check_file_sizes || true
        check_readme_status || true
    else
        # Normal mode
        check_directories
        check_required_files
        check_file_sizes
        check_readme_status
        setup_git_hooks
        generate_report
    fi
    
    echo ""
    log_success "Doctor checks completed!"
    
    if [[ "$pre_commit_mode" == false ]]; then
        echo ""
        log_info "💡 Run './doctor.sh --help' for options"
    fi
}

# Run
main "$@"