# Upload Tài Liệu Nguồn lên MinIO

## Tổng quan

Đã bổ sung tính năng upload tài liệu nguồn (source documents) lên MinIO storage cho trang `/lms/admin/source-documents/new`.

## Thay đổi

### Backend

**File mới:** `backend/src/lms/source-document/source-document-upload.controller.ts`

REST API endpoints:
- `POST /api/lms/source-documents/upload` - Upload file mới (chưa có document ID)
- `POST /api/lms/source-documents/:documentId/upload` - Upload file cho document đã tồn tại
- `POST /api/lms/source-documents/upload-multiple` - Upload nhiều file
- `POST /api/lms/source-documents/:documentId/thumbnail` - Upload thumbnail

Tính năng:
- Giới hạn file size: 100MB
- Hỗ trợ nhiều loại file: images, PDFs, documents, videos, audio, archives
- Validate file type và size
- Tự động lưu lên MinIO bucket `source-documents`

### Frontend

**File cập nhật:** `frontend/src/app/lms/admin/source-documents/new/page.tsx`

Cải tiến:
- Đổi tất cả `Select` thành `Combobox` (theo rule)
- Giao diện Mobile First + Responsive
- Upload Drag & Drop với `react-dropzone`
- Progress bar khi upload
- Hiển thị thông tin file đã upload (tên, size, type)
- Tự động điền URL, fileName sau khi upload
- Tự động detect loại tài liệu từ MIME type
- Tự động điền tiêu đề từ tên file
- Sử dụng `toast` từ `sonner` thay vì `useToast`

## Cách sử dụng

1. Vào trang `/lms/admin/source-documents/new`
2. Kéo thả file hoặc click "Chọn file" để upload
3. Hệ thống tự động:
   - Upload file lên MinIO
   - Điền URL vào form
   - Detect loại tài liệu
   - Điền tên file và tiêu đề
4. Hoàn thiện các thông tin khác và nhấn "Tạo tài liệu"

## API Response

```json
{
  "success": true,
  "url": "https://minio.example.com/source-documents/temp_xxx/filename.pdf",
  "fileName": "document.pdf",
  "fileSize": 1234567,
  "mimeType": "application/pdf",
  "tempId": "temp_xxx_xxx"
}
```
