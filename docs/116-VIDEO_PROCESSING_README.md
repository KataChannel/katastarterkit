# Video Processing Service - Tự động tối ưu hóa video khi upload

## Tổng quan

Service tự động xử lý video khi upload để tối ưu cho web streaming:
- ✅ Re-encode sang H.264 + AAC (codec tương thích nhất)
- ✅ Move moov atom lên đầu file (faststart)
- ✅ Fix pixel format (yuv420p)
- ✅ Trích xuất metadata (duration, dimensions)
- ✅ Tự động hoặc skip nếu video đã tối ưu

## Cài đặt FFmpeg

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install ffmpeg
```

### macOS
```bash
brew install ffmpeg
```

### Docker
Thêm vào Dockerfile:
```dockerfile
RUN apt-get update && apt-get install -y ffmpeg
```

## API Endpoints

### 1. Upload File Mới

**Endpoint:** `POST /api/lms/source-documents/upload`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (form-data):**
- `file`: File upload (max 100MB)

**Response:**
```json
{
  "success": true,
  "url": "https://storage.tazagroup.vn/source-documents/temp_xxx.mp4",
  "fileName": "video.mp4",
  "fileSize": 15234567,
  "mimeType": "video/mp4",
  "tempId": "temp_1234567890_abc",
  "duration": 120,
  "metadata": {
    "width": 1920,
    "height": 1080,
    "processed": true
  }
}
```

### 2. Upload File Cho Document Có Sẵn

**Endpoint:** `POST /api/lms/source-documents/:documentId/upload`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (form-data):**
- `file`: File upload (max 100MB)

**Response:**
```json
{
  "success": true,
  "url": "https://storage.tazagroup.vn/source-documents/doc-id.mp4",
  "fileName": "video.mp4",
  "fileSize": 15234567,
  "mimeType": "video/mp4",
  "documentId": "953fcfe3-c66f-4993-9f10-2a5d0bd1a7f6",
  "duration": 120,
  "metadata": {
    "width": 1920,
    "height": 1080,
    "processed": true
  }
}
```

## Workflow

```
1. User upload video
   ↓
2. Backend nhận file
   ↓
3. Check: Là video file?
   ├─ No  → Upload trực tiếp
   └─ Yes → Continue
       ↓
4. VideoProcessingService.processVideo()
   ├─ Check FFmpeg available?
   │  ├─ No  → Upload original, mark needsProcessing=true
   │  └─ Yes → Continue
   │      ↓
   ├─ Probe video metadata
   │  ↓
   ├─ Check: Cần re-encode?
   │  ├─ No  → Đã tối ưu, skip processing
   │  └─ Yes → Re-encode
   │      ↓
   │      • ffmpeg -i input.mp4 -c:v libx264 -movflags +faststart ...
   │      • Extract duration, dimensions
   │      ↓
   └─ Return processed video buffer
       ↓
5. Upload to MinIO (video đã tối ưu)
   ↓
6. Update database với duration & metadata
   ↓
7. Return response với thông tin video
```

## Code Examples

### Frontend - Upload Video

```typescript
async function uploadVideo(file: File, documentId?: string) {
  const formData = new FormData();
  formData.append('file', file);

  const url = documentId
    ? `/api/lms/source-documents/${documentId}/upload`
    : '/api/lms/source-documents/upload';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await response.json();
  
  if (result.metadata?.processed) {
    console.log('✅ Video được tối ưu tự động');
    console.log('Duration:', result.duration, 'seconds');
  } else if (result.metadata?.needsProcessing) {
    console.warn('⚠️ Video cần xử lý thủ công (FFmpeg không có)');
  }
  
  return result;
}
```

### Backend - Service Integration

Service tự động được inject vào controller:

```typescript
@Controller('api/lms/source-documents')
export class SourceDocumentUploadController {
  constructor(
    private videoProcessingService: VideoProcessingService,
  ) {}

  @Post('upload')
  async uploadFile(@UploadedFile() file: UploadedFile) {
    // Auto process video
    if (this.isVideoFile(file.mimetype)) {
      const result = await this.videoProcessingService.processVideo(
        file.buffer,
        file.originalname,
      );
      
      if (result.success) {
        // Upload processed video
        // ...
      }
    }
  }
}
```

## Metadata Response

### Khi video được xử lý thành công:
```json
{
  "metadata": {
    "width": 1920,
    "height": 1080,
    "processed": true
  }
}
```

### Khi FFmpeg không có sẵn:
```json
{
  "metadata": {
    "processed": false,
    "needsProcessing": true,
    "error": "FFmpeg not installed"
  }
}
```

### Khi video đã tối ưu sẵn:
```json
{
  "metadata": {
    "width": 1920,
    "height": 1080,
    "processed": true
  }
}
```

## Video Processing Details

### Input Requirements
- **Max size:** 100MB
- **Formats:** MP4, AVI, MOV, WEBM, MKV, ...
- **Codecs:** Bất kỳ (sẽ được chuyển sang H.264)

### Output Specifications
- **Video Codec:** H.264 (libx264)
- **Audio Codec:** AAC
- **Pixel Format:** yuv420p
- **Container:** MP4 with faststart
- **Quality:** CRF 23 (excellent quality)
- **Preset:** Medium (balance speed/quality)

### FFmpeg Command Used
```bash
ffmpeg -i input.mp4 \
  -c:v libx264 \          # H.264 video
  -preset medium \         # Encoding speed
  -crf 23 \                # Quality (18-28)
  -movflags +faststart \   # Web streaming
  -c:a aac \               # AAC audio
  -b:a 128k \              # Audio bitrate
  -pix_fmt yuv420p \       # Pixel format
  -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" \ # Even dimensions
  output.mp4
```

## Troubleshooting

### Video không được xử lý

**Nguyên nhân:** FFmpeg chưa cài đặt

**Giải pháp:**
```bash
# Check FFmpeg
ffmpeg -version

# Install nếu chưa có
sudo apt install ffmpeg

# Restart backend
npm run dev
```

### Processing quá lâu

**Nguyên nhân:** Video quá lớn hoặc preset quá chậm

**Giải pháp:** Giảm preset trong `video-processing.service.ts`:
```typescript
'-preset fast',  // Thay vì 'medium'
```

### Lỗi "maxBuffer exceeded"

**Nguyên nhân:** Video output quá lớn

**Giải pháp:** Tăng buffer limit trong service:
```typescript
maxBuffer: 100 * 1024 * 1024,  // 100MB
```

### Video vẫn không phát sau processing

**Nguyên nhân:** Browser cache

**Giải pháp:**
- Clear browser cache
- Hard reload (Ctrl+Shift+R)
- Test trên incognito mode

## Monitoring & Logs

Service log chi tiết quá trình xử lý:

```
[VideoProcessingService] Processing video: test.mp4
[VideoProcessingService]   Original: codec=h265, format=mp4
[VideoProcessingService] Running: ffmpeg -i "input.mp4" -c:v libx264...
[VideoProcessingService] ✅ Video processed successfully: test.mp4
[VideoProcessingService]   Processed: codec=h264, size=15MB
[VideoProcessingService]   Duration: 120s, Size: 1920x1080
```

## Performance

### Processing Time
- 1 minute video: ~5-15 seconds
- 10 minute video: ~30-60 seconds
- Depends on: CPU, preset, video quality

### Storage Impact
- Processed videos typically 20-30% smaller
- Better compression with same visual quality
- Faster streaming due to faststart

## Best Practices

1. **Always upload videos through API** - Đừng upload trực tiếp lên MinIO
2. **Check metadata response** - Xác nhận video đã được xử lý
3. **Handle errors gracefully** - Hiển thị warning nếu FFmpeg không có
4. **Show processing indicator** - Upload video mất thời gian hơn file thường
5. **Test on multiple browsers** - Đảm bảo tương thích

## Future Improvements

- [ ] Thumbnail extraction tự động
- [ ] Multiple quality variants (480p, 720p, 1080p)
- [ ] Progress callback cho long videos
- [ ] Async processing với queue
- [ ] Video compression presets (web, mobile, high-quality)
- [ ] HLS/DASH streaming support

## Related Files

- `backend/src/lms/source-document/video-processing.service.ts` - Core service
- `backend/src/lms/source-document/source-document-upload.controller.ts` - REST API
- `backend/src/lms/source-document/source-document.module.ts` - Module config
- `scripts/fix-video-for-web.sh` - Manual fix script
- `docs/FIX_VIDEO_LOST_IMAGE.md` - Troubleshooting guide
