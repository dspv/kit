#!/bin/bash

# Doctor Script for Kit AI-First v3.0
# Validation for AI development and code quality standards

set -e

echo "Doctor Script - Kit AI-First v3.0"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Counters
WARNINGS=0
ERRORS=0

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[OK]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARN]${NC} $1"; ((WARNINGS++)); }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; ((ERRORS++)); }

# Check required files
check_required_files() {
    log_info "Checking required files..."
    
    local required=(
        "README.md"
        "GUIDE.md"
        "DOCS.md"
        "Makefile"
        ".ai/context.md"
        ".ai/tasks.md"
    )
    
    for file in "${required[@]}"; do
        if [[ -f "$file" ]]; then
            log_success "$file exists"
        else
            log_error "$file missing"
        fi
    done
}

# Check directory structure
check_directory_structure() {
    log_info "Checking directory structure..."
    
    local required_dirs=(
        ".ai"
        ".ai/notes"
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

# Check for English-only content (STRICT - blocks non-English)
check_english_only() {
    log_info "Checking English-only requirement..."
    
    local violations=()
    
    # Check markdown files for Cyrillic (excluding box-drawing chars)
    while IFS= read -r -d '' file; do
        # Use perl with explicit Unicode range U+0400-U+04FF (Cyrillic block)
        # This avoids false positives from box-drawing characters
        if perl -ne 'exit 1 if /[\x{0400}-\x{04FF}]/' "$file" 2>/dev/null; then
            : # No Cyrillic found
        else
            violations+=("$file")
            log_error "Non-English (Cyrillic) text in: $file"
        fi
    done < <(find . -name "*.md" -type f \
        -not -path "./.git/*" \
        -not -path "./node_modules/*" \
        -not -path "./vendor/*" \
        -print0 2>/dev/null)
    
    # Check code files for Cyrillic in comments/strings
    local code_exts=("*.go" "*.js" "*.ts" "*.jsx" "*.tsx" "*.py" "*.java" "*.c" "*.cpp" "*.h" "*.rs" "*.swift" "*.kt")
    
    for ext in "${code_exts[@]}"; do
        while IFS= read -r -d '' file; do
            # Use explicit Unicode range to avoid false positives
            if perl -ne 'exit 1 if /[\x{0400}-\x{04FF}]/' "$file" 2>/dev/null; then
                : # No Cyrillic found
            else
                violations+=("$file")
                log_error "Non-English (Cyrillic) in code: $file"
            fi
        done < <(find . -name "$ext" -type f \
            -not -path "./.git/*" \
            -not -path "./node_modules/*" \
            -not -path "./vendor/*" \
            -not -path "./dist/*" \
            -not -path "./build/*" \
            -print0 2>/dev/null)
    done
    
    if [[ ${#violations[@]} -eq 0 ]]; then
        log_success "All technical content is in English"
    else
        log_error "Found ${#violations[@]} files with non-English content"
        log_error "CRITICAL: All technical content MUST be in English"
        log_error "This includes: code, comments, commits, PRs, docs"
    fi
}

# Check for emoji in technical files (WARNING only)
check_emoji_usage() {
    log_info "Checking emoji usage in technical files..."
    
    local emoji_files=()
    
    # Check code files for common emoji
    local code_exts=("*.go" "*.js" "*.ts" "*.jsx" "*.tsx" "*.py" "*.java" "*.sh")
    
    for ext in "${code_exts[@]}"; do
        while IFS= read -r -d '' file; do
            # Simple check for common emoji ranges (not comprehensive but catches most)
            if grep -P '[\x{1F600}-\x{1F64F}]|[\x{1F300}-\x{1F5FF}]|[\x{1F680}-\x{1F6FF}]|[\x{2600}-\x{26FF}]|[\x{2700}-\x{27BF}]' "$file" 2>/dev/null; then
                emoji_files+=("$file")
            fi
        done < <(find . -name "$ext" -type f \
            -not -path "./.git/*" \
            -not -path "./node_modules/*" \
            -not -path "./vendor/*" \
            -print0 2>/dev/null)
    done
    
    # Check recent commit messages for emoji
    if [[ -d .git ]]; then
        local emoji_commits=$(git log -10 --oneline 2>/dev/null | grep -P '[\x{1F600}-\x{1F64F}]|[\x{1F300}-\x{1F5FF}]|[\x{1F680}-\x{1F6FF}]|[\x{2600}-\x{26FF}]|[\x{2700}-\x{27BF}]' || true)
        
        if [[ -n "$emoji_commits" ]]; then
            log_warning "Emoji found in recent commits (not recommended)"
            log_info "Use clear text instead of emoji in technical content"
        fi
    fi
    
    if [[ ${#emoji_files[@]} -eq 0 ]]; then
        log_success "No emoji in technical files"
    else
        log_warning "Found emoji in ${#emoji_files[@]} technical files"
        log_info "Recommendation: Use Heroicons for UI, clear text for technical content"
    fi
}

# Check commit message format
check_commit_format() {
    if [[ ! -d .git ]]; then
        log_info "Not a git repository, skipping commit checks"
        return
    fi
    
    log_info "Checking commit message format..."
    
    local bad_commits=()
    local commit_count=0
    
    while IFS= read -r commit; do
        ((commit_count++))
        local hash=$(echo "$commit" | awk '{print $1}')
        local message=$(echo "$commit" | cut -d' ' -f2-)
        
        # Check for proper format: "type: description"
        if ! echo "$message" | grep -qE '^(feat|fix|docs|refactor|test|chore|style|perf):'; then
            bad_commits+=("$hash: $message")
        fi
    done < <(git log -5 --oneline 2>/dev/null || true)
    
    if [[ $commit_count -eq 0 ]]; then
        log_info "No commits yet"
        return
    fi
    
    if [[ ${#bad_commits[@]} -eq 0 ]]; then
        log_success "Commit messages follow format"
    else
        log_warning "Found ${#bad_commits[@]} commits not following format:"
        for commit in "${bad_commits[@]}"; do
            echo "  $commit"
        done
        log_info "Use format: <type>: <description>"
        log_info "Types: feat, fix, docs, refactor, test, chore, style, perf"
    fi
}

# Check for hardcoded secrets
check_secrets() {
    log_info "Checking for hardcoded secrets..."
    
    local secret_patterns=(
        "password\s*=\s*['\"][^'\"]{8,}['\"]"
        "api[_-]?key\s*=\s*['\"][^'\"]{8,}['\"]"
        "secret\s*=\s*['\"][^'\"]{8,}['\"]"
        "token\s*=\s*['\"][^'\"]{8,}['\"]"
    )
    
    local violations=()
    
    for pattern in "${secret_patterns[@]}"; do
        while IFS= read -r -d '' file; do
            if grep -iE "$pattern" "$file" 2>/dev/null | grep -v "example" | grep -v "TODO" | grep -v "FIXME" | grep -v "placeholder" > /dev/null; then
                violations+=("$file")
            fi
        done < <(find . -type f \
            \( -name "*.go" -o -name "*.js" -o -name "*.ts" -o -name "*.tsx" -o -name "*.jsx" -o -name "*.py" -o -name "*.env" \) \
            -not -path "./.git/*" \
            -not -path "./node_modules/*" \
            -not -path "./vendor/*" \
            -not -name "*.example*" \
            -not -name ".env.example" \
            -print0 2>/dev/null)
    done
    
    if [[ ${#violations[@]} -eq 0 ]]; then
        log_success "No obvious hardcoded secrets detected"
    else
        log_warning "Possible hardcoded secrets in:"
        printf '%s\n' "${violations[@]}" | sort -u
        log_info "Use environment variables for sensitive data"
    fi
}

# Check README status indicators
check_readme_status() {
    log_info "Checking README status indicators..."
    
    if [[ ! -f "README.md" ]]; then
        log_error "README.md not found"
        return
    fi
    
    local has_status=false
    local has_version=false
    
    if grep -q "Status:" README.md; then
        has_status=true
        log_success "README has status indicator"
    else
        log_warning "README missing status indicator"
    fi
    
    if grep -q "Version:" README.md; then
        has_version=true
        log_success "README has version indicator"
    else
        log_warning "README missing version indicator"
    fi
}

# Setup git hooks
setup_git_hooks() {
    if [[ ! -d .git ]]; then
        return
    fi
    
    log_info "Setting up git hooks..."
    
    # Pre-commit hook
    cat > ".git/hooks/pre-commit" << 'HOOK_EOF'
#!/bin/bash
# Pre-commit hook - Kit AI-First v3.0

echo "[Pre-commit] Running validation checks..."

# Get staged files
staged_files=$(git diff --cached --name-only --diff-filter=ACM)

# Check for Cyrillic (non-English) content - BLOCKS commit
non_english_found=false
for file in $staged_files; do
    if [[ -f "$file" ]] && [[ "$file" =~ \.(md|go|js|ts|jsx|tsx|py|java|sh)$ ]]; then
        if grep -q '[а-яёА-ЯЁ]' "$file" 2>/dev/null; then
            echo "[ERROR] Non-English (Cyrillic) text found in: $file"
            non_english_found=true
        fi
    fi
done

if [ "$non_english_found" = true ]; then
    echo "[BLOCK] Commit blocked: All technical content must be in English"
    echo "[INFO] This includes: code, comments, documentation"
    echo "[INFO] Edit the files above to use English only"
    exit 1
fi

# Check for emoji in technical files - WARNING only
emoji_found=false
for file in $staged_files; do
    if [[ -f "$file" ]] && [[ "$file" =~ \.(go|js|ts|jsx|tsx|py|java|sh)$ ]]; then
        if grep -P '[\x{1F600}-\x{1F64F}]|[\x{1F300}-\x{1F5FF}]|[\x{1F680}-\x{1F6FF}]' "$file" 2>/dev/null; then
            echo "[WARN] Emoji found in: $file (not recommended)"
            emoji_found=true
        fi
    fi
done

if [ "$emoji_found" = true ]; then
    echo "[INFO] Consider using Heroicons for UI or clear text instead"
fi

# Check commit message format (from stdin via git)
commit_msg=$(cat "$1" 2>/dev/null || echo "")

if [[ -n "$commit_msg" ]]; then
    # Check first line for proper format
    first_line=$(echo "$commit_msg" | head -n1)
    
    if ! echo "$first_line" | grep -qE '^(feat|fix|docs|refactor|test|chore|style|perf):'; then
        echo "[WARN] Commit message should follow format: <type>: <description>"
        echo "[INFO] Types: feat, fix, docs, refactor, test, chore, style, perf"
    fi
    
    # Check for Cyrillic in commit message
    if echo "$commit_msg" | grep -q '[а-яёА-ЯЁ]'; then
        echo "[ERROR] Non-English text in commit message"
        echo "[BLOCK] Commit message must be in English"
        exit 1
    fi
fi

echo "[Pre-commit] All checks passed"
HOOK_EOF
    
    chmod +x ".git/hooks/pre-commit"
    log_success "Git hooks installed (pre-commit)"
}

# Generate health report
generate_report() {
    log_info "Generating health report..."
    
    local report_file="doctor-report.md"
    
    cat > "$report_file" << EOF
# Doctor Health Report

**Date**: $(date '+%Y-%m-%d %H:%M:%S')  
**Kit Version**: 3.0  

## Summary

- **Warnings**: $WARNINGS
- **Errors**: $ERRORS
- **Status**: $([ $ERRORS -eq 0 ] && echo "PASS" || echo "FAIL")

## Checks Performed

- [x] Required files present
- [x] Directory structure valid
- [x] English-only content (CRITICAL)
- [x] Emoji usage check (recommendation)
- [x] Commit message format
- [x] Hardcoded secrets scan
- [x] README status indicators

## Critical Issues

$([ $ERRORS -eq 0 ] && echo "No critical issues found" || echo "Found $ERRORS critical issues - see above")

## Recommendations

$([ $WARNINGS -gt 0 ] && echo "- Review $WARNINGS warnings above for code quality improvements" || echo "- All checks passed")

## Next Steps

1. Fix any errors (blocks development)
2. Review warnings (quality improvements)
3. Run 'make validate' for full validation
4. Start development with 'make dev'

---

**Kit AI-First v3.0**  
**Language**: English Only  
**Emoji**: Recommended to avoid in technical content
EOF
    
    log_success "Report saved to $report_file"
}

# Main execution
main() {
    local setup_hooks=false
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --setup-hooks)
                setup_hooks=true
                shift
                ;;
            --help|-h)
                echo "Usage: $0 [--setup-hooks] [--help]"
                echo ""
                echo "Options:"
                echo "  --setup-hooks   Install git pre-commit hooks"
                echo "  --help, -h      Show this help"
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
    echo ""
    check_english_only
    echo ""
    check_emoji_usage
    echo ""
    check_commit_format
    echo ""
    check_secrets
    echo ""
    check_readme_status
    echo ""
    
    if [[ "$setup_hooks" == true ]] || [[ ! -f .git/hooks/pre-commit ]]; then
        setup_git_hooks
        echo ""
    fi
    
    generate_report
    
    echo ""
    echo "=================================="
    echo "Warnings: $WARNINGS | Errors: $ERRORS"
    echo ""
    
    if [[ $ERRORS -gt 0 ]]; then
        echo -e "${RED}[FAIL]${NC} Fix errors before proceeding"
        echo ""
        echo "Common fixes:"
        echo "  - Translate non-English text to English"
        echo "  - Move secrets to environment variables"
        echo "  - Add missing required files"
        exit 1
    elif [[ $WARNINGS -gt 0 ]]; then
        echo -e "${YELLOW}[PASS with warnings]${NC} Consider addressing warnings"
        echo ""
        echo "Warnings are recommendations for code quality"
    else
        echo -e "${GREEN}[PASS]${NC} All checks successful"
    fi
    
    echo ""
    log_info "Run 'make help' to see available commands"
    log_info "Run 'make validate' for full validation with linting"
}

# Execute
main "$@"
