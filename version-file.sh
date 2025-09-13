#!/bin/bash

# Automatic file versioning script
# Usage: ./version-file.sh spec/roadmap.md

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check arguments
if [[ $# -ne 1 ]]; then
    log_error "Usage: $0 <file.md>"
    echo "Examples:"
    echo "  $0 spec/roadmap.md"
    echo "  $0 spec/api.md"
    exit 1
fi

FILE=$1

# Check file existence
if [[ ! -f "$FILE" ]]; then
    log_error "File not found: $FILE"
    exit 1
fi

# Check extension
if [[ ! "$FILE" =~ \.md$ ]]; then
    log_error "File must have .md extension"
    exit 1
fi

log_info "Versioning file: $FILE"

# Determine paths
BASE_NAME=$(basename "$FILE" .md)
DIR_NAME=$(dirname "$FILE")
CURRENT_VERSION=$(echo "$BASE_NAME" | grep -o 'v[0-9]\+$' || echo "")

# Determine new version
if [[ -z "$CURRENT_VERSION" ]]; then
    # File without version → v2
    NEW_VERSION="v2"
    NEW_BASE_NAME="$BASE_NAME.$NEW_VERSION"
else
    # File with version → next version
    CURRENT_NUM=$(echo "$CURRENT_VERSION" | sed 's/v//')
    NEW_NUM=$((CURRENT_NUM + 1))
    NEW_VERSION="v$NEW_NUM"
    NEW_BASE_NAME=$(echo "$BASE_NAME" | sed "s/$CURRENT_VERSION\$/$NEW_VERSION/")
fi

NEW_FILE="$DIR_NAME/$NEW_BASE_NAME.md"

log_info "New version: $NEW_FILE"

# Check that new version doesn't exist
if [[ -f "$NEW_FILE" ]]; then
    log_error "Version already exists: $NEW_FILE"
    exit 1
fi

# Get file statistics
LINE_COUNT=$(wc -l < "$FILE")
FILE_SIZE=$(du -h "$FILE" | cut -f1)

log_info "File statistics:"
echo "  📏 Lines: $LINE_COUNT"
echo "  💾 Size: $FILE_SIZE"

# Create new version
log_info "Creating new version..."
cp "$FILE" "$NEW_FILE"
log_success "Created file: $NEW_FILE"

# Create banner for old file
ARCHIVE_DATE=$(date '+%Y-%m-%d')
BANNER="# $(head -n1 "$FILE" | sed 's/^# //')

> **📦 Archived**: This version is archived. See [$NEW_BASE_NAME.md]($NEW_BASE_NAME.md) for current version.

**Archive Date**: $ARCHIVE_DATE  
**Reason**: File versioning ($(if [[ $LINE_COUNT -gt 2000 ]]; then echo "size: $LINE_COUNT lines"; else echo "milestone completed"; fi))

---

"

# Add banner to beginning of old file
TEMP_FILE=$(mktemp)
echo -e "$BANNER" > "$TEMP_FILE"
cat "$FILE" >> "$TEMP_FILE"
mv "$TEMP_FILE" "$FILE"

log_success "Added archive banner to: $FILE"

# Update refs in new file (if any)
if grep -q "Refs:" "$NEW_FILE"; then
    log_info "Updating refs in new file..."
    
    # Replace self-references
    OLD_SELF_REF=$(basename "$FILE")
    NEW_SELF_REF=$(basename "$NEW_FILE")
    
    sed -i.bak "s/$OLD_SELF_REF/$NEW_SELF_REF/g" "$NEW_FILE"
    rm "$NEW_FILE.bak" 2>/dev/null || true
    
    log_success "Refs updated in new file"
fi

# Find files that reference the old file
log_info "Searching for files with references to old file..."

REFERRING_FILES=()
while IFS= read -r -d '' file; do
    if grep -q "$FILE" "$file" 2>/dev/null; then
        REFERRING_FILES+=("$file")
    fi
done < <(find . -name "*.md" -not -path "./$FILE" -not -path "./$NEW_FILE" -print0)

if [[ ${#REFERRING_FILES[@]} -gt 0 ]]; then
    log_warning "Found files with references to old file:"
    for ref_file in "${REFERRING_FILES[@]}"; do
        echo "  📄 $ref_file"
        grep -n "$FILE" "$ref_file" | head -3 | while read line; do
            echo "    $line"
        done
    done
    
    echo ""
    log_warning "Recommended to update references:"
    echo "  sed -i 's|$FILE|$NEW_FILE|g' <file>"
    echo ""
    echo "Or run bulk update:"
    echo "  find . -name '*.md' -exec sed -i 's|$FILE|$NEW_FILE|g' {} +"
else
    log_success "No references to old file found"
fi

# Statistics
echo ""
log_success "Versioning completed!"
echo ""
echo "📊 Result:"
echo "  📦 Archive file: $FILE"
echo "  🆕 New version: $NEW_FILE"
echo "  📏 Lines: $LINE_COUNT"
echo "  📅 Archive date: $ARCHIVE_DATE"

if [[ ${#REFERRING_FILES[@]} -gt 0 ]]; then
    echo "  🔗 Files with references: ${#REFERRING_FILES[@]}"
fi

echo ""
log_info "Next steps:"
echo "1. Check new file: $NEW_FILE"
echo "2. Update references in other files (if needed)"
echo "3. Commit changes with refs contract"
echo ""
echo "Example commit:"
echo "git add $FILE $NEW_FILE"
echo "git commit -m \"docs: version $BASE_NAME to $NEW_VERSION"
echo ""
echo "- archived $FILE due to $(if [[ $LINE_COUNT -gt 2000 ]]; then echo "size ($LINE_COUNT lines)"; else echo "milestone completion"; fi)"
echo "- created $NEW_FILE as current version"
echo "- updated archive banner and refs"
echo ""
echo "Refs: spec/policy.md#Versioning; spec/versioning-guide.md#Process\""
