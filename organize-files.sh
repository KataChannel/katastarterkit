#!/bin/bash

# Script to organize .md and .js test files with sequential numbering by creation date
# cập nhật code chuyển tất cả .md trừ readme.md vào thư mục docs và đánh số thứ tự tăng theo ngày tạo
# tương tự cho các file test .js vào thư mục tests

cd /chikiet/kataoffical/fullstack/katacore

echo "=== Moving .md files to docs directory with sequential numbering ==="

# Get .md files sorted by creation date (excluding README.md)
counter=1
while IFS= read -r line; do
    timestamp=$(echo "$line" | cut -d' ' -f1)
    filepath=$(echo "$line" | cut -d' ' -f2-)
    filename=$(basename "$filepath")
    
    # Create new filename with sequential number
    new_filename=$(printf "%02d-%s" $counter "$filename")
    
    echo "Moving $filename -> docs/$new_filename"
    mv "$filepath" "docs/$new_filename"
    
    ((counter++))
done < <(find . -maxdepth 1 -name "*.md" ! -name "README.md" -exec stat -c "%Y %n" {} \; | sort -n)

echo ""
echo "=== Moving test .js files to tests directory with sequential numbering ==="

# Get test .js files sorted by creation date
counter=1
while IFS= read -r line; do
    timestamp=$(echo "$line" | cut -d' ' -f1)
    filepath=$(echo "$line" | cut -d' ' -f2-)
    filename=$(basename "$filepath")
    
    # Create new filename with sequential number
    new_filename=$(printf "%02d-%s" $counter "$filename")
    
    echo "Moving $filename -> tests/$new_filename"
    mv "$filepath" "tests/$new_filename"
    
    ((counter++))
done < <(find . -maxdepth 1 -name "test*.js" -exec stat -c "%Y %n" {} \; | sort -n)

echo ""
echo "=== File organization complete! ==="
echo "Check docs/ directory for numbered .md files"
echo "Check tests/ directory for numbered test .js files"