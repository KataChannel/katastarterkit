#!/bin/bash

# ============================================================================
# Workspace Cleanup - Giữ lại chỉ files cần thiết
# ============================================================================

set -e

echo "🧹 Cleaning up workspace..."
echo "============================"

# Tạo backup trước khi xóa
BACKUP_DIR="./archive-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📦 Creating backup in: $BACKUP_DIR"

# ==== FILES GIỮ LẠI ====
KEEP_FILES=(
    # Core deployment
    "docker-compose.hybrid.yml"
    ".env.rausach"
    ".env.tazagroup"
    
    # Optimized scripts
    "cleanup-server.sh"
    "menu.sh"
    
    # Documentation
    "README.md"
    "LICENSE"
    "VERSION"
    
    # Essential configs
    ".dockerignore"
    ".gitignore"
    "package.json"
    "Makefile"
)

# ==== XÓA CÁC FILES KHÔNG CẦN THIẾT ====

echo ""
echo "🗑️  Moving old files to backup..."

# Backup và xóa các shell scripts cũ (trừ những files giữ lại)
for file in *.sh; do
    if [[ ! " ${KEEP_FILES[@]} " =~ " ${file} " ]]; then
        if [ -f "$file" ]; then
            echo "  → Archiving: $file"
            mv "$file" "$BACKUP_DIR/"
        fi
    fi
done

# Backup các markdown docs không cần thiết
MD_KEEP=("README.md" "LICENSE")
for file in *.md; do
    if [[ ! " ${MD_KEEP[@]} " =~ " ${file} " ]]; then
        if [ -f "$file" ]; then
            echo "  → Archiving: $file"
            mv "$file" "$BACKUP_DIR/"
        fi
    fi
done

# Backup các docker-compose cũ
for file in docker-compose*.yml; do
    if [[ "$file" != "docker-compose.hybrid.yml" ]]; then
        if [ -f "$file" ]; then
            echo "  → Archiving: $file"
            mv "$file" "$BACKUP_DIR/"
        fi
    fi
done

# Backup text files
for file in *.txt *.TXT; do
    if [ -f "$file" ]; then
        echo "  → Archiving: $file"
        mv "$file" "$BACKUP_DIR/" 2>/dev/null || true
    fi
done

# Backup các log files
if [ -d "logs" ]; then
    echo "  → Archiving logs directory"
    mv logs "$BACKUP_DIR/" 2>/dev/null || true
fi

echo ""
echo "✅ Cleanup completed!"
echo ""
echo "📋 Remaining files:"
ls -lh *.sh *.md *.yml 2>/dev/null | awk '{print "  " $9 " (" $5 ")"}'

echo ""
echo "💾 Backup location: $BACKUP_DIR"
echo "   (Delete this folder after verification if not needed)"
