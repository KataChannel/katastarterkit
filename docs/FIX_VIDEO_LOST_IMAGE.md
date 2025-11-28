# Fix Video "Mất hình" khi upload lên server

## Vấn đề

Video MP4 sau khi upload lên MinIO storage bị "mất hình" (màn hình đen) khi phát trong trình duyệt.

**Ví dụ video bị lỗi:**
```
https://storage.tazagroup.vn/source-documents/record-t3_ch10_20251027101446_20251027101733.mp4
```

## Nguyên nhân

Có 3 nguyên nhân chính:

### 1. **Moov atom không ở đầu file**
- File MP4 có metadata (moov atom) ở cuối file
- Trình duyệt cần download toàn bộ file mới phát được
- Không hỗ trợ progressive download/streaming

### 2. **Codec không tương thích**
- Video sử dụng codec mà trình duyệt không hỗ trợ
- Codec tốt nhất cho web: **H.264 (video) + AAC (audio)**

### 3. **Pixel format không đúng**
- Một số video dùng pixel format không chuẩn
- Web cần: **yuv420p**

## Giải pháp

### Cách 1: Re-encode video bằng Script

Sử dụng script `fix-video-for-web.sh`:

```bash
# Cài đặt ffmpeg (nếu chưa có)
sudo apt install ffmpeg

# Re-encode video
cd /mnt/chikiet/kataoffical/shoprausach
./scripts/fix-video-for-web.sh \
  "https://storage.tazagroup.vn/source-documents/video-bi-loi.mp4" \
  "video-da-fix.mp4"
```

Script sẽ:
- ✅ Download video
- ✅ Re-encode với H.264 + AAC
- ✅ Move moov atom lên đầu (`-movflags +faststart`)
- ✅ Fix pixel format (yuv420p)
- ✅ Tạo file mới đã tối ưu

### Cách 2: Re-encode thủ công bằng FFmpeg

```bash
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -preset medium \
  -crf 23 \
  -movflags +faststart \
  -c:a aac \
  -b:a 128k \
  -pix_fmt yuv420p \
  -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" \
  output.mp4
```

**Giải thích parameters:**
- `-c:v libx264`: Codec video H.264
- `-preset medium`: Tốc độ encode trung bình
- `-crf 23`: Chất lượng (18-28, càng thấp càng tốt)
- `-movflags +faststart`: Di chuyển moov atom lên đầu
- `-c:a aac`: Codec audio AAC
- `-b:a 128k`: Bitrate audio 128kbps
- `-pix_fmt yuv420p`: Pixel format chuẩn cho web
- `-vf "scale=..."`: Đảm bảo width/height chẵn

### Cách 3: Sử dụng Online Tools

Nếu không có ffmpeg, có thể dùng:
- **HandBrake** (GUI): https://handbrake.fr/
- **CloudConvert**: https://cloudconvert.com/mp4-converter
- **FFmpeg online**: https://www.onlineconverter.com/

Preset: **Web Optimized** hoặc **Fast 1080p30**

## Upload file đã fix

Sau khi có file đã re-encode, upload lại lên MinIO:

### Option 1: Qua Web UI

1. Vào trang source document detail
2. Click **Edit**
3. Upload file mới (đã fix)
4. Save

### Option 2: Qua MinIO Console

1. Truy cập MinIO Console: http://116.118.49.243:12007
2. Login với credentials
3. Vào bucket `source-documents`
4. Upload file mới (đè lên file cũ)

### Option 3: Qua MinIO CLI (mc)

```bash
# Cài đặt mc
wget https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
sudo mv mc /usr/local/bin/

# Configure
mc alias set myminio http://116.118.49.243:12007 minio-admin minio-secret-2025

# Upload
mc cp video-da-fix.mp4 myminio/source-documents/record-t3_ch10_20251027101446_20251027101733.mp4
```

## Kiểm tra video đã fix

### Test bằng HTML (đã tạo sẵn)

Mở file: `/mnt/chikiet/kataoffical/shoprausach/test-video-player.html`

Hoặc test trực tiếp trong trình duyệt:

```html
<video controls preload="metadata">
  <source src="VIDEO_URL" type="video/mp4">
</video>
```

### Test bằng FFprobe

```bash
ffprobe video-da-fix.mp4

# Kiểm tra:
# 1. Video codec: h264
# 2. Audio codec: aac
# 3. Pixel format: yuv420p
```

## Cập nhật Frontend

Đã thêm các attributes để xử lý lỗi tốt hơn:

```tsx
<video
  controls
  preload="metadata"
  playsInline
  crossOrigin="anonymous"
  onError={(e) => {
    const video = e.target as HTMLVideoElement;
    console.error('Video error:', video.error);
    toast.error(`Lỗi phát video: ${video.error?.message}`);
  }}
>
  <source src={document.url} type="video/mp4" />
</video>
```

## Best Practices cho Upload Video

### 1. Encode trước khi upload

Luôn re-encode video trước khi upload:
```bash
./scripts/fix-video-for-web.sh input.mp4 output.mp4
```

### 2. Cấu hình Recording Software

Nếu dùng OBS Studio hoặc tools tương tự:
- **Encoder**: x264
- **Container**: MP4
- **Audio**: AAC 128kbps
- **Advanced**: Thêm flag `--movflags +faststart`

### 3. Kiểm tra file trước upload

```bash
ffprobe video.mp4 | grep -E "(codec|Stream)"
```

Cần thấy:
- `Video: h264`
- `Audio: aac`

## Troubleshooting

### Video vẫn không chạy sau khi fix?

1. **Clear browser cache**
2. **Kiểm tra CORS headers** (nginx đã config đúng)
3. **Kiểm tra file size** - Max 100MB
4. **Test trên trình duyệt khác**

### Lỗi "MEDIA_ERR_DECODE"

Video codec không được hỗ trợ. Re-encode lại với:
```bash
ffmpeg -i input.mp4 -c:v libx264 -profile:v baseline -level 3.0 output.mp4
```

### Lỗi "MEDIA_ERR_SRC_NOT_SUPPORTED"

Container hoặc codec không đúng. Đảm bảo:
- Container: `.mp4`
- Video: H.264
- Audio: AAC

## Tóm tắt

✅ **Đã fix:**
- Thêm error handling vào video player
- Thêm `playsInline` và `crossOrigin`
- Tạo script tự động fix video
- Tạo test HTML để debug

🔧 **Cần làm:**
- Re-encode video bị lỗi bằng script
- Upload lại file đã fix
- Test lại trong app

📝 **Files liên quan:**
- `frontend/src/app/lms/admin/source-documents/[id]/page.tsx`
- `frontend/src/app/lms/instructor/source-documents/[id]/page.tsx`
- `scripts/fix-video-for-web.sh`
- `test-video-player.html`
