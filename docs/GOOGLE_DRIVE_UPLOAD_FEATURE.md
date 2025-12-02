# Tính năng Upload lên Google Drive

## Tổng quan

Đã thêm tính năng upload tài liệu nguồn (source documents) lên Google Drive công ty song song với MinIO server.

**Folder Google Drive công ty:** https://drive.google.com/drive/folders/1kSEvP8QlhhZoOjtemtLuKA_LkuWr2OTG

## Các file được thêm/sửa

### Backend

| File | Mô tả |
|------|-------|
| `backend/src/services/google-drive.service.ts` | **MỚI** - Service xử lý upload lên Google Drive |
| `backend/src/lms/source-document/source-document-upload.controller.ts` | Thêm 3 endpoint Google Drive |
| `backend/src/lms/source-document/source-document.module.ts` | Inject GoogleDriveService |

### Frontend

| File | Mô tả |
|------|-------|
| `frontend/src/app/lms/admin/source-documents/new/page.tsx` | Thêm UI chọn storage type (MinIO/Google Drive) |

## API Endpoints mới

### 1. Kiểm tra trạng thái Google Drive
```
GET /api/lms/source-documents/google-drive/status
```
**Response:**
```json
{
  "connected": true,
  "message": "Kết nối Google Drive thành công"
}
```

### 2. Upload file trực tiếp lên Google Drive
```
POST /api/lms/source-documents/upload-to-google-drive
Content-Type: multipart/form-data
Body: file (File)
```
**Response:**
```json
{
  "success": true,
  "storage": "google-drive",
  "url": "https://drive.google.com/file/d/.../view",
  "downloadUrl": "https://drive.google.com/uc?export=download&id=...",
  "fileName": "document.pdf",
  "fileSize": 1024000,
  "mimeType": "application/pdf",
  "googleDriveId": "abc123",
  "tempId": "gdrive_abc123"
}
```

### 3. Upload từ URL lên Google Drive
```
POST /api/lms/source-documents/upload-to-google-drive-from-url
Content-Type: application/json
Body: { "url": "https://example.com/file.pdf" }
```

## Tính năng

### Google Drive Service
- ✅ Upload file buffer lên Google Drive
- ✅ Upload file từ URL (tự động tải về rồi upload)
- ✅ Tự động tạo sub-folder theo loại file (Images, Videos, Documents, etc.)
- ✅ Tự động convert Google Drive/Sheets/Docs URL sang direct download
- ✅ Hỗ trợ Dropbox, OneDrive URL
- ✅ Set quyền public cho file sau khi upload
- ✅ Trả về cả webViewLink và downloadLink

### Frontend UI
- ✅ Chọn storage type: MinIO Server hoặc Google Drive
- ✅ Upload file trực tiếp (drag & drop)
- ✅ Upload từ URL
- ✅ Hiển thị badge "Google Drive" khi file được upload lên Drive
- ✅ Màu xanh dương cho Google Drive UI
- ✅ Check và hiển thị trạng thái kết nối Google Drive
- ✅ Mobile responsive

## Cấu hình

### Environment Variables

Thêm vào file `.env` của backend:

```env
# Google Drive Service Account Credentials
GOOGLE_DRIVE_CREDENTIALS_JSON='{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...@....iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token",...}'
```

### Tạo Service Account

1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Enable **Google Drive API**
4. Tạo **Service Account** trong IAM & Admin
5. Tạo key JSON cho service account
6. Copy nội dung JSON vào `GOOGLE_DRIVE_CREDENTIALS_JSON`
7. Share folder công ty với email của service account (role: Editor)

## Giới hạn

- File tối đa: 100MB
- Loại file: Images, Videos, Documents, Audio, Archives
- Cần cấu hình Service Account để sử dụng Google Drive
