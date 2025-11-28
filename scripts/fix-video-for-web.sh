#!/bin/bash

# Script để re-encode video cho web streaming
# Fix vấn đề "mất hình" khi phát video MP4

VIDEO_URL="$1"
OUTPUT_FILE="$2"

if [ -z "$VIDEO_URL" ] || [ -z "$OUTPUT_FILE" ]; then
    echo "Usage: $0 <video-url> <output-file>"
    echo "Example: $0 https://storage.tazagroup.vn/source-documents/video.mp4 output.mp4"
    exit 1
fi

echo "📥 Downloading video..."
curl -L "$VIDEO_URL" -o temp_video.mp4

if [ $? -ne 0 ]; then
    echo "❌ Failed to download video"
    exit 1
fi

echo "🔧 Re-encoding video for web streaming..."
echo "   - Moving moov atom to beginning"
echo "   - Re-encoding to H.264 + AAC"
echo "   - Optimizing for progressive download"

# Kiểm tra ffmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg not found. Installing..."
    echo "Run: sudo apt install ffmpeg"
    exit 1
fi

# Re-encode video với cấu hình tối ưu cho web
ffmpeg -i temp_video.mp4 \
    -c:v libx264 \
    -preset medium \
    -crf 23 \
    -movflags +faststart \
    -c:a aac \
    -b:a 128k \
    -pix_fmt yuv420p \
    -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" \
    "$OUTPUT_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Video re-encoded successfully: $OUTPUT_FILE"
    echo ""
    echo "📊 File info:"
    ls -lh "$OUTPUT_FILE"
    
    # Clean up
    rm -f temp_video.mp4
    
    echo ""
    echo "💡 Tip: Upload file này lên MinIO để thay thế file cũ"
else
    echo "❌ Failed to re-encode video"
    rm -f temp_video.mp4
    exit 1
fi
