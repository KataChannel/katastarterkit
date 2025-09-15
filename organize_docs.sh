#!/bin/bash

# Script để tổng hợp các file .md vào docs với đánh số thứ tự theo thời gian

DOCS_DIR="/mnt/chikiet/kataoffical/fullstack/katacore/docs/archived"
ROOT_DIR="/mnt/chikiet/kataoffical/fullstack/katacore"

# Đảm bảo thư mục docs/archived tồn tại
mkdir -p "$DOCS_DIR"

echo "=== Tổng hợp các file .md vào docs/archived với đánh số thứ tự ==="

# Tạo danh sách các file .md với timestamp và sắp xếp theo thời gian
declare -a files_with_time=()

# Lấy tất cả file .md ở thư mục gốc (trừ README.md) với timestamp
while IFS= read -r -d '' file; do
    timestamp=$(stat --format="%Y" "$file")
    filename=$(basename "$file")
    files_with_time+=("$timestamp|$file|$filename")
done < <(find "$ROOT_DIR" -maxdepth 1 -name "*.md" -not -name "README.md" -print0)

# Sắp xếp theo timestamp
IFS=$'\n' sorted=($(sort -n <<<"${files_with_time[*]}")); unset IFS

# Counter cho số thứ tự
counter=1

echo "Tìm thấy ${#sorted[@]} file .md để di chuyển:"
echo

for entry in "${sorted[@]}"; do
    IFS='|' read -r timestamp filepath filename <<< "$entry"
    
    # Tạo tên file mới với số thứ tự
    padded_counter=$(printf "%02d" $counter)
    new_filename="${padded_counter}_${filename}"
    new_path="$DOCS_DIR/$new_filename"
    
    # Hiển thị thông tin file
    file_date=$(date -d "@$timestamp" "+%Y-%m-%d %H:%M:%S")
    echo "[$counter] $filename"
    echo "    Thời gian: $file_date"
    echo "    Từ: $filepath"
    echo "    Đến: $new_path"
    
    # Di chuyển file
    if [ -f "$filepath" ] && [ -s "$filepath" ]; then
        cp "$filepath" "$new_path"
        echo "    ✅ Đã sao chép thành công"
    else
        echo "    ⚠️  File trống hoặc không tồn tại, tạo placeholder"
        echo "# $filename" > "$new_path"
        echo "" >> "$new_path"
        echo "*(File này ban đầu trống hoặc không có nội dung)*" >> "$new_path"
    fi
    
    echo
    ((counter++))
done

# Tạo file index cho docs/archived
index_file="$DOCS_DIR/00_INDEX.md"
echo "# Index - Tài liệu dự án KataCore" > "$index_file"
echo "" >> "$index_file"
echo "Danh sách các tài liệu được sắp xếp theo thứ tự thời gian tạo:" >> "$index_file"
echo "" >> "$index_file"

counter=1
for entry in "${sorted[@]}"; do
    IFS='|' read -r timestamp filepath filename <<< "$entry"
    padded_counter=$(printf "%02d" $counter)
    file_date=$(date -d "@$timestamp" "+%Y-%m-%d")
    
    # Lấy title từ file nếu có
    title=$(head -1 "$DOCS_DIR/${padded_counter}_${filename}" 2>/dev/null | sed 's/^# *//' | sed 's/^## *//')
    if [ -z "$title" ] || [ "$title" = "$filename" ]; then
        title="${filename%.*}"
    fi
    
    echo "$counter. [$title](${padded_counter}_${filename}) - *$file_date*" >> "$index_file"
    ((counter++))
done

echo "" >> "$index_file"
echo "---" >> "$index_file"
echo "*Tự động tạo bởi script tổng hợp tài liệu - $(date)*" >> "$index_file"

echo "=== Hoàn thành ==="
echo "✅ Đã tổng hợp ${#sorted[@]} file .md vào $DOCS_DIR"
echo "📋 Tạo file index: $index_file"
echo ""
echo "Cấu trúc thư mục docs/archived:"
ls -la "$DOCS_DIR" | head -10
