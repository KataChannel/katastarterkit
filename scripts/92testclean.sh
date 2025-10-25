#!/bin/bash

# Script to organize test/verify files by moving them to tests/ directory with numbering
# Targets files with patterns: *test*, *verify* with extensions .js, .sh
# Usage: ./testclean.sh [--dry-run]

set -e  # Exit on any error

DRY_RUN=false
if [[ "$1" == "--dry-run" ]]; then
    DRY_RUN=true
    echo "🔍 DRY RUN MODE - No changes will be made"
fi

echo "🧪 Starting test/verify files cleanup and organization..."

# Tạo thư mục tests nếu chưa tồn tại
if [ "$DRY_RUN" = false ]; then
    mkdir -p tests
fi

# Lấy số thứ tự cao nhất hiện có trong thư mục tests
max_number=0
if ls tests/*.{js,sh} 1> /dev/null 2>&1; then
    for file in tests/*.{js,sh}; do
        if [ -f "$file" ]; then
            # Trích xuất số từ tên file (format: số-tên.extension)
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

# Tìm tất cả file test/verify ở root level với extension .js và .sh
shopt -s nullglob  # Prevent glob expansion if no matches
test_files=()

# Collect files with test/verify patterns and specific extensions
for pattern in "*test*.js" "*test*.sh" "*verify*.js" "*verify*.sh"; do
    for file in $pattern; do
        if [ -f "$file" ]; then
            test_files+=("$file")
        fi
    done
done

# Remove duplicates
declare -A seen
unique_test_files=()
for file in "${test_files[@]}"; do
    if [ -z "${seen[$file]}" ]; then
        seen[$file]=1
        unique_test_files+=("$file")
    fi
done

shopt -u nullglob

if [ ${#unique_test_files[@]} -eq 0 ]; then
    echo "🧪 No test/verify files (*test*.js, *test*.sh, *verify*.js, *verify*.sh) found in root directory"
    exit 0
fi

echo "🔍 Found ${#unique_test_files[@]} test/verify files to organize"

# Sắp xếp file theo thời gian sửa đổi (mtime)
declare -A file_times
for file in "${unique_test_files[@]}"; do
    # Skip if already in tests/
    if [ ! -f "$file" ]; then
        continue
    fi
    
    # Get modification time
    file_times["$file"]=$(stat -c %Y "$file" 2>/dev/null || echo "0")
done

# Sort files by filename (simpler and more predictable)
sorted_files=()
for file in "${!file_times[@]}"; do
    sorted_files+=("$file")
done

# Sort by filename
IFS=$'\n' sorted_files=($(sort <<<"${sorted_files[*]}"))
unset IFS

# Process each file
for file in "${sorted_files[@]}"; do
    if [ ! -f "$file" ]; then
        continue
    fi
    
    filename=$(basename "$file")
    
    # Skip cleanup scripts themselves
    if [[ "$filename" == "testclean.sh" || "$filename" == "docsclean.sh" || "$filename" == "92testclean.sh" || "$filename" == "4docsclean.sh" ]]; then
        echo "⏭️  Skipping cleanup script: $filename"
        continue
    fi
    
    # Get file extension
    extension=""
    if [[ "$filename" == *.* ]]; then
        extension=".${filename##*.}"
    fi
    
    # Kiểm tra xem file đã có số thứ tự chưa
    if [[ ! "$filename" =~ ^[0-9]+-.*\.(js|sh)$ ]]; then
        # Thêm số thứ tự vào tên file
        new_filename="${next_number}-${filename}"
        
        # Check if target already exists
        if [ -f "tests/$new_filename" ]; then
            echo "⚠️  Target exists: tests/$new_filename - skipping"
            continue
        fi
        
        if [ "$DRY_RUN" = false ]; then
            mv "$file" "tests/$new_filename"
            echo "✓ Moved: $filename → tests/$new_filename"
        else
            echo "  [DRY RUN] Would move: $filename → tests/$new_filename"
        fi
        next_number=$((next_number + 1))
        moved_count=$((moved_count + 1))
    else
        # File đã có số thứ tự, chỉ cần di chuyển nếu chưa trong tests/
        if [ -f "tests/$filename" ]; then
            echo "⚠️  Already exists: tests/$filename - removing duplicate"
            if [ "$DRY_RUN" = false ]; then
                rm "$file"
            else
                echo "  [DRY RUN] Would remove duplicate: $filename"
            fi
        else
            if [ "$DRY_RUN" = false ]; then
                mv "$file" "tests/$filename"
                echo "✓ Moved: $filename → tests/$filename"
            else
                echo "  [DRY RUN] Would move: $filename → tests/$filename"
            fi
            moved_count=$((moved_count + 1))
        fi
    fi
done

echo ""
if [ "$DRY_RUN" = true ]; then
    echo "✅ DRY RUN Complete! Would move $moved_count files"
else
    echo "✅ Done! Moved $moved_count test/verify files to tests/"
fi

if [ "$DRY_RUN" = false ]; then
    total=$(ls -1 tests/*.{js,sh} 2>/dev/null | wc -l)
    echo "📊 Total files in tests/: $total"
    
    # List final state
    if ls tests/*.{js,sh} 1> /dev/null 2>&1; then
        echo ""
        echo "📁 Current tests/ contents:"
        ls -1 tests/*.{js,sh} | head -10
        if [ $(ls -1 tests/*.{js,sh} | wc -l) -gt 10 ]; then
            echo "   ... and $(($(ls -1 tests/*.{js,sh} | wc -l) - 10)) more files"
        fi
    fi
fi
