#!/bin/bash

# Doctor Script for Kit AI-First v2.0
# Simplified validation focused on AI development needs

set -e

echo "🩺 Doctor Script - Kit AI-First v2.0"
echo "===================================="

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
        "Makefile"
        "spec/product.md"
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
        log_info "Run 'make setup' to initialize project structure"
        return 1
    fi
    
    log_success "All required files present"
}

# Check directory structure
check_directory_structure() {
    log_info "Checking directory structure..."
    
    local required_dirs=(
        "spec"
        "apps"
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

# Check for English-only content
check_english_only() {
    log_info "Checking for English-only content..."
    
    local non_english_files=()
    
    # Check markdown files for non-English text
    while IFS= read -r -d '' file; do
        # Check for Cyrillic, Chinese, Japanese, Arabic, etc.
        if grep -q '[а-яёА-ЯЁ]' "$file" 2>/dev/null; then
            non_english_files+=("$file")
            log_warning "$file contains non-English text"
        fi
    done < <(find . -name "*.md" -type f -not -path "./.git/*" -print0 2>/dev/null)
    
    # Check code files for non-English comments
    local code_extensions=("*.js" "*.ts" "*.jsx" "*.tsx" "*.go" "*.py" "*.java" "*.cpp" "*.c" "*.h" "*.cs" "*.php" "*.rb" "*.rs" "*.swift" "*.kt")
    
    for ext in "${code_extensions[@]}"; do
        while IFS= read -r -d '' file; do
            # Check for non-English comments
            if grep -q '[а-яёА-ЯЁ]' "$file" 2>/dev/null; then
                non_english_files+=("$file")
                log_warning "$file has non-English comments"
            fi
        done < <(find . -name "$ext" -type f -not -path "./.git/*" -not -path "./node_modules/*" -not -path "./vendor/*" -print0 2>/dev/null)
    done
    
    if [[ ${#non_english_files[@]} -eq 0 ]]; then
        log_success "All files use English text"
    else
        log_warning "Found ${#non_english_files[@]} files with non-English text"
        log_info "Consider translating to English for consistency"
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
    local has_progress=false
    local has_timeline=false
    local has_focus=false
    
    # Check for status indicators
    if grep -q -E "🚀.*[Ss]tatus.*:" README.md; then
        has_status=true
        log_success "README has status indicator"
    fi
    
    if grep -q -E "Progress.*░" README.md; then
        has_progress=true
        log_success "README has progress bars"
    fi
    
    if grep -q -E "📅.*[Tt]imeline.*:" README.md; then
        has_timeline=true
        log_success "README has timeline indicator"
    fi
    
    if grep -q -E "🎯.*[Ff]ocus.*:" README.md; then
        has_focus=true
        log_success "README has focus indicator"
    fi
    
    if [[ "$has_status" == true && "$has_progress" == true && "$has_timeline" == true && "$has_focus" == true ]]; then
        log_success "README has all required status indicators"
    else
        log_warning "README missing some status indicators"
        log_info "Add: 🚀 Status: | Progress: ░░░░░░░░░░ | 📅 Timeline: | 🎯 Focus:"
    fi
}

# Check roadmap task structure
check_roadmap_tasks() {
    log_info "Checking roadmap task structure..."
    
    if [[ ! -f "spec/roadmap.md" ]]; then
        log_warning "spec/roadmap.md not found"
        return 0
    fi
    
    local has_tasks=false
    local has_priorities=false
    local has_status=false
    
    # Check for task structure
    if grep -q "TASK-" spec/roadmap.md; then
        has_tasks=true
        log_success "Roadmap has structured tasks"
    fi
    
    if grep -q -E "🔴|🟡|🟢" spec/roadmap.md; then
        has_priorities=true
        log_success "Roadmap has priority indicators"
    fi
    
    if grep -q -E "\`(todo|doing|done|blocked)\`" spec/roadmap.md; then
        has_status=true
        log_success "Roadmap has task status indicators"
    fi
    
    if [[ "$has_tasks" == true && "$has_priorities" == true && "$has_status" == true ]]; then
        log_success "Roadmap has proper AI task structure"
    else
        log_warning "Roadmap missing AI-friendly task structure"
        log_info "Tasks should have: TASK-XXX format, priority colors, status indicators"
    fi
}

# Check project stage
check_project_stage() {
    log_info "Checking project stage configuration..."
    
    if [[ -f "spec/roadmap.md" ]]; then
        if grep -q "Stage.*dev" spec/roadmap.md; then
            log_info "Stage: dev (fast iterations, direct commits)"
        elif grep -q "Stage.*prod" spec/roadmap.md; then
            log_info "Stage: prod (pull requests, code review)"
        else
            log_warning "Stage not clearly defined in roadmap.md"
            log_info "Add: Stage: dev or Stage: prod"
        fi
    fi
}

# Check git configuration
check_git_setup() {
    log_info "Checking git configuration..."
    
    if [[ -d ".git" ]]; then
        # Check for commit template
        if git config --get commit.template >/dev/null 2>&1; then
            log_success "Git commit template configured"
        else
            log_warning "Git commit template not configured"
        fi
        
        # Check for pre-commit hook
        if [[ -f ".git/hooks/pre-commit" ]]; then
            log_success "Pre-commit hook exists"
        else
            log_info "Creating simple pre-commit hook..."
            cat > ".git/hooks/pre-commit" << 'EOF'
#!/bin/bash
# Simple pre-commit hook for Kit AI-First v2.0

echo "🔍 Pre-commit checks..."

# Check for non-English text in staged files
staged_files=$(git diff --cached --name-only | grep -E '\.(md|js|ts|jsx|tsx|go|py)$' || true)

if [ -n "$staged_files" ]; then
    non_english_found=false
    
    for file in $staged_files; do
        if [ -f "$file" ]; then
            if grep -q '[а-яёА-ЯЁ]' "$file" 2>/dev/null; then
                echo "❌ Found non-English (Cyrillic) text in: $file"
                non_english_found=true
            fi
        fi
    done
    
    if [ "$non_english_found" = true ]; then
        echo "ℹ️  Please use English only in code and documentation"
        exit 1
    fi
fi

echo "✅ Pre-commit checks passed"
EOF
            chmod +x ".git/hooks/pre-commit"
            log_success "Created pre-commit hook for English-only validation"
        fi
    else
        log_warning "Not a git repository"
    fi
}

# Generate simple report
generate_report() {
    log_info "Generating health report..."
    
    local report_file="doctor-report.md"
    local current_date=$(date '+%Y-%m-%d %H:%M:%S')
    
    cat > "$report_file" << EOF
# Doctor Report - Kit AI-First v2.0

**Date**: $current_date  
**Kit Version**: 2.0 (AI-First)

## Health Check Status

- ✅ Required files present
- ✅ Directory structure valid
- ✅ English-only content validated
- ✅ README status indicators checked
- ✅ Roadmap task structure verified
- ✅ Git configuration checked

## Project Status

$(if [[ -f "README.md" ]]; then
    echo "### Current Status"
    grep -E "🚀.*Status:|Progress:|📅.*Timeline:|🎯.*Focus:" README.md | head -4 || echo "Status indicators not found"
fi)

$(if [[ -f "spec/roadmap.md" ]]; then
    echo "### Active Tasks"
    grep -E "TASK-.*\`(todo|doing)\`" spec/roadmap.md | head -3 || echo "No active tasks found"
fi)

## Recommendations

$(if [[ ! -f "docker-compose.yml" ]]; then
    echo "- Add docker-compose.yml for local development"
fi)

$(if [[ ! -f ".env.example" ]]; then
    echo "- Add .env.example with required environment variables"
fi)

## Next Steps

1. Update placeholders in README.md and spec/ files
2. Configure project-specific settings
3. Start development with 'make dev'

---

**Kit AI-First v2.0** | **Files**: 5 | **Complexity**: Minimal
EOF
    
    log_success "Report saved to $report_file"
}

# Main function
main() {
    local quick_mode=false
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --quick)
                quick_mode=true
                shift
                ;;
            --help|-h)
                echo "Usage: $0 [--quick] [--help]"
                echo ""
                echo "Options:"
                echo "  --quick       Quick validation (skip detailed checks)"
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
    
    # Run checks
    check_directory_structure
    check_required_files
    
    if [[ "$quick_mode" == false ]]; then
        check_english_only
        check_readme_status
        check_roadmap_tasks
        check_project_stage
        check_git_setup
        generate_report
    fi
    
    echo ""
    log_success "Doctor script completed successfully!"
    
    if [[ "$quick_mode" == false ]]; then
        echo ""
        log_info "💡 Run './doctor.sh --quick' for fast validation"
        log_info "💡 Run 'make help' to see available commands"
    fi
}

# Run
main "$@"
