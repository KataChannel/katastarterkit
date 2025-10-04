#!/bin/bash

# Script to organize markdown files by moving them to docs/ directory with numbering
# Usage: ./docsclean.sh

set -e  # Exit on any error

echo "🧹 Starting docs cleanup and organization..."

# Tạo thư mục docs nếu chưa tồn tại
mkdir -p docs

# Lấy số thứ tự cao nhất hiện có trong thư mục docs
max_number=0
if ls docs/*.md 1> /dev/null 2>&1; then
    for file in docs/*.md; do
        if [ -f "$file" ]; then
            # Trích xuất số từ tên file (format: số-tên.md)
            filename=$(basename "$file")
            if [[ "$filename" =~ ^([0-9]+)- ]]; then
                number="${BASH_REMATCH[1]}"
                if [ "$number" -gt "$max_number" ]; then
                    max_number=$number
                fi
            fi
        fi
    done
fi

# Bắt đầu từ số tiếp theo
next_number=$((max_number + 1))
moved_count=0

echo "📁 Next available number: $next_number"

# Tìm tất cả file .md ở root level, trừ README.md
shopt -s nullglob  # Prevent glob expansion if no matches
md_files=(*.md)
shopt -u nullglob

if [ ${#md_files[@]} -eq 0 ]; then
    echo "📄 No .md files found in root directory"
    exit 0
fi

# Sắp xếp file theo thời gian sửa đổi (mtime)
declare -A file_times
for file in "${md_files[@]}"; do
    # Skip README.md (case insensitive)
    if [[ "${file,,}" == "readme.md" ]]; then
        continue
    fi
    
    # Skip if already in docs/
    if [ ! -f "$file" ]; then
        continue
    fi
    
    # Get modification time
    file_times["$file"]=$(stat -c %Y "$file" 2>/dev/null || echo "0")
done

# Sort files by modification time
sorted_files=()
while IFS= read -r -d '' file; do
    sorted_files+=("$file")
done < <(for file in "${!file_times[@]}"; do
    printf '%s\0%s\0' "${file_times[$file]}" "$file"
done | sort -z -n | cut -z -d '' -f2)

# Process each file
for file in "${sorted_files[@]}"; do
    if [ ! -f "$file" ]; then
        continue
    fi
    
    filename=$(basename "$file")
    
    # Skip README.md
    if [[ "${filename,,}" == "readme.md" ]]; then
        echo "⏭️  Skipping: $filename"
        continue
    fi
    
    # Kiểm tra xem file đã có số thứ tự chưa
    if [[ ! "$filename" =~ ^[0-9]+-.*\.md$ ]]; then
        # Thêm số thứ tự vào tên file
        new_filename="${next_number}-${filename}"
        
        # Check if target already exists
        if [ -f "docs/$new_filename" ]; then
            echo "⚠️  Target exists: docs/$new_filename - skipping"
            continue
        fi
        
        mv "$file" "docs/$new_filename"
        echo "📝 Moved: $filename → docs/$new_filename"
        next_number=$((next_number + 1))
        moved_count=$((moved_count + 1))
    else
        # File đã có số thứ tự, chỉ cần di chuyển nếu chưa trong docs/
        if [ -f "docs/$filename" ]; then
            echo "⚠️  Already exists: docs/$filename - removing duplicate"
            rm "$file"
        else
            mv "$file" "docs/$filename"
            echo "📝 Moved: $filename → docs/$filename"
            moved_count=$((moved_count + 1))
        fi
    fi
done

echo ""
echo "✅ Done! Moved $moved_count .md files to docs/"
echo "📊 Total files in docs/: $(ls -1 docs/*.md 2>/dev/null | wc -l)"

# List final state
if ls docs/*.md 1> /dev/null 2>&1; then
    echo ""
    echo "📁 Current docs/ contents:"
    ls -1 docs/*.md | head -10
    if [ $(ls -1 docs/*.md | wc -l) -gt 10 ]; then
        echo "   ... and $(($(ls -1 docs/*.md | wc -l) - 10)) more files"
    fi
fi
