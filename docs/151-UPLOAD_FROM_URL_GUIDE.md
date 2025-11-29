# Hướng dẫn: Upload Tài liệu Nguồn từ URL

## 📋 Tổng quan

Hệ thống LMS hiện hỗ trợ **tải file từ URL** và upload vào MinIO storage để lưu trữ tài liệu nguồn.

### ✨ Tính năng mới

- ✅ Tải file từ URL (HTTP/HTTPS)
- ✅ **Tích hợp Google Workspace**: Tự động convert Google Drive, Sheets, Docs, Slides sang export URL
- ✅ **Tích hợp Dropbox & OneDrive**: Tự động convert sang direct download
- ✅ Hỗ trợ nhiều định dạng: PDF, DOC, DOCX, XLS, XLSX, TXT, MD, PPT, Images, Videos, Audio
- ✅ Tự động decode HTML entities trong URL
- ✅ Tự động xác định MIME type
- ✅ Tự động xử lý video (nếu có FFmpeg)
- ✅ Upload lên MinIO storage
- ✅ Giới hạn 100MB per file
- ✅ UI thân thiện với 2 tab: Upload File / Tải từ URL

---

## 🎯 Cách sử dụng

### 1. Trên giao diện Web (Giảng viên)

1. Truy cập `/lms/instructor/source-documents/new`
2. Điền thông tin tài liệu (Tiêu đề, Mô tả, Loại...)
3. Trong phần **Nội dung**, chọn tab **"Tải từ URL"**
4. Nhập URL của file (ví dụ: `https://example.com/document.pdf`)
5. Click **"Tải file từ URL"**
6. Hệ thống sẽ:
   - Tải file từ URL về server
   - Validate định dạng và kích thước
   - Upload lên MinIO storage
   - Tự động điền URL vào form

### 2. REST API Endpoint

**POST** `/api/lms/source-documents/upload-from-url`

**Request Body:**
```json
{
  "url": "https://example.com/document.pdf",
  "documentId": "optional-document-id"  // Tùy chọn
}
```

**Response:**
```json
{
  "success": true,
  "url": "http://localhost:9000/source-documents/...",
  "fileName": "document.pdf",
  "fileSize": 123456,
  "mimeType": "application/pdf",
  "documentId": "doc-id-or-temp-id",
  "duration": 120,  // Chỉ có nếu là video
  "metadata": {}    // Metadata video (nếu có)
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:13001/api/lms/source-documents/upload-from-url \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"}'
```

### 3. GraphQL Mutation

```graphql
mutation UploadFromUrl($url: String!, $documentId: ID) {
  uploadFromUrl(url: $url, documentId: $documentId) {
    id
    url
    filename
    mimetype
    size
    bucket
  }
}
```

**Variables:**
```json
{
  "url": "https://example.com/document.pdf",
  "documentId": "optional-doc-id"
}
```

---

## 📦 Định dạng file được hỗ trợ

### Documents
- ✅ PDF (`.pdf`)
- ✅ Microsoft Word (`.doc`, `.docx`)
- ✅ Microsoft Excel (`.xls`, `.xlsx`)
- ✅ Microsoft PowerPoint (`.ppt`, `.pptx`)
- ✅ Text (`.txt`)
- ✅ Markdown (`.md`)
- ✅ HTML (`.html`)
- ✅ CSV (`.csv`)

### Images
- ✅ JPEG (`.jpg`, `.jpeg`)
- ✅ PNG (`.png`)
- ✅ GIF (`.gif`)
- ✅ WebP (`.webp`)
- ✅ SVG (`.svg`)

### Videos
- ✅ MP4 (`.mp4`)
- ✅ MPEG (`.mpeg`)
- ✅ QuickTime (`.mov`)
- ✅ WebM (`.webm`)
- ✅ AVI (`.avi`)

### Audio
- ✅ MP3 (`.mp3`)
- ✅ WAV (`.wav`)
- ✅ OGG (`.ogg`)

### Archives
- ✅ ZIP (`.zip`)
- ✅ RAR (`.rar`)
- ✅ 7Z (`.7z`)

### Code
- ✅ JSON (`.json`)
- ✅ JavaScript (`.js`)
- ✅ CSS (`.css`)

---

## 🔧 Backend Implementation

### Service: `SourceDocumentService.downloadFromUrl()`

```typescript
async downloadFromUrl(url: string): Promise<{
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  size: number;
}> {
  // 1. Validate URL (chỉ HTTP/HTTPS)
  // 2. Download với axios (timeout 60s, max 100MB)
  // 3. Lấy filename từ Content-Disposition hoặc URL path
  // 4. Xác định MIME type từ header hoặc extension
  // 5. Return buffer + metadata
}
```

**Features:**
- ✅ URL validation
- ✅ User-Agent header để tránh bị chặn
- ✅ Timeout 60s
- ✅ Max size 100MB
- ✅ Tự động xác định filename từ URL hoặc Content-Disposition
- ✅ Tự động map MIME type → extension
- ✅ Error handling chi tiết

### Controller: `SourceDocumentUploadController.uploadFromUrl()`

```typescript
@Post('upload-from-url')
async uploadFromUrl(
  @Body() body: { url: string; documentId?: string }
) {
  // 1. Download file từ URL
  // 2. Validate file type & size
  // 3. Process video (nếu cần)
  // 4. Upload to MinIO
  // 5. Update document (nếu có documentId)
  // 6. Return result
}
```

### Resolver: `SourceDocumentResolver.uploadFromUrl()`

GraphQL mutation wrapper cho service method.

---

## 🧪 Testing

### 1. Manual Test với cURL

```bash
# Test PDF
curl -X POST http://localhost:13001/api/lms/source-documents/upload-from-url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"}'

# Test Text
curl -X POST http://localhost:13001/api/lms/source-documents/upload-from-url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore"}'

# Test Markdown
curl -X POST http://localhost:13001/api/lms/source-documents/upload-from-url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://raw.githubusercontent.com/microsoft/vscode/main/README.md"}'
```

### 2. Automated Test Script

```bash
cd /chikiet/kataoffical/shoprausach/backend
bun run test-download-from-url.ts
```

Script sẽ test các URL mẫu với nhiều định dạng khác nhau.

---

## 🚨 Error Handling

### Các lỗi thường gặp:

1. **"Chỉ hỗ trợ HTTP/HTTPS URL"**
   - URL phải bắt đầu bằng `http://` hoặc `https://`

2. **"Không thể kết nối đến URL"**
   - Server không thể truy cập URL (DNS không tồn tại)

3. **"Timeout khi tải file"**
   - File quá lớn hoặc server phản hồi chậm (> 60s)

4. **"HTTP 404/403/500"**
   - URL không tồn tại hoặc bị chặn truy cập

5. **"Kích thước file vượt quá 100MB"**
   - File lớn hơn giới hạn cho phép

6. **"Loại file không được hỗ trợ"**
   - MIME type không nằm trong danh sách allowed types

---

## 🎨 Frontend UI

### Component: `SourceDocumentFileUpload`

**Tabs:**
- **Upload File**: Kéo thả hoặc chọn file từ máy tính
- **Tải từ URL**: Nhập URL và tải file về

**Props:**
```typescript
interface SourceDocumentFileUploadProps {
  documentType: 'FILE' | 'AUDIO' | 'IMAGE';
  onUploadComplete: (result: FileUploadResult) => void;
  onUploadError?: (error: Error) => void;
  maxSize?: number; // MB
  accept?: string;  // File types
}
```

**Usage:**
```tsx
<SourceDocumentFileUpload
  documentType="FILE"
  onUploadComplete={(result) => {
    handleChange('url', result.url);
    handleChange('fileName', result.filename);
  }}
  maxSize={100}
/>
```

---

## 📊 Database Schema

Khi upload từ URL, các field sau được cập nhật:

```prisma
model SourceDocument {
  url         String?   // MinIO URL
  fileName    String?   // Tên file gốc
  fileSize    BigInt?   // Kích thước (bytes)
  mimeType    String?   // MIME type
  duration    Int?      // Duration (video/audio)
  metadata    Json?     // Video metadata
}
```

---

## 🔐 Security

1. **URL Validation**: Chỉ chấp nhận HTTP/HTTPS
2. **File Type Validation**: Chỉ cho phép MIME types trong whitelist
3. **Size Limit**: Max 100MB
4. **Timeout**: 60s để tránh DOS
5. **User-Agent**: Thêm custom UA để tránh bị chặn
6. **JWT Auth**: Yêu cầu authentication cho REST API và GraphQL

---

## 🚀 Performance

- **Timeout**: 60s per request
- **Max concurrent downloads**: Không giới hạn (nhưng nên rate limit ở load balancer)
- **Memory usage**: Download trực tiếp vào Buffer (không lưu temp file)
- **Progress tracking**: Frontend simulate progress (90% khi đang tải, 100% khi xong)

---

## 📝 Notes

1. **Video Processing**: Nếu FFmpeg có sẵn, video sẽ được tự động optimize
2. **Filename Handling**: Tự động decode UTF-8 (hỗ trợ tiếng Việt)
3. **Extension Mapping**: Tự động thêm extension nếu thiếu dựa trên MIME type
4. **MinIO Bucket**: File được lưu vào bucket `source-documents`

---

## 🎓 Use Cases

### 1. Import tài liệu từ Google Drive

**Cách 1: Dùng link view trực tiếp** (Hệ thống tự convert)
```
https://drive.google.com/file/d/FILE_ID/view
```

**Cách 2: Dùng link open** (Hệ thống tự convert)
```
https://drive.google.com/open?id=FILE_ID
```

**Cách 3: Dùng link download trực tiếp**
```
https://drive.google.com/uc?export=download&id=FILE_ID
```

### 2. Import từ Google Sheets

**Cách 1: Dùng link edit trực tiếp** (Hệ thống tự convert sang export XLSX)
```
https://docs.google.com/spreadsheets/d/SHEET_ID/edit?gid=0#gid=0
```

**Cách 2: Dùng link export trực tiếp**
```
https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=xlsx&gid=0
```

Hỗ trợ export formats: `xlsx`, `csv`, `pdf`, `ods`, `tsv`

### 3. Import từ Google Docs

**Cách 1: Dùng link edit trực tiếp** (Hệ thống tự convert sang export DOCX)
```
https://docs.google.com/document/d/DOC_ID/edit
```

**Cách 2: Dùng link export trực tiếp**
```
https://docs.google.com/document/d/DOC_ID/export?format=docx
```

Hỗ trợ export formats: `docx`, `pdf`, `odt`, `rtf`, `txt`, `html`, `epub`

### 4. Import từ Google Slides

**Cách 1: Dùng link edit trực tiếp** (Hệ thống tự convert sang export PPTX)
```
https://docs.google.com/presentation/d/SLIDE_ID/edit
```

**Cách 2: Dùng link export trực tiếp**
```
https://docs.google.com/presentation/d/SLIDE_ID/export?format=pptx
```

Hỗ trợ export formats: `pptx`, `pdf`, `odp`, `txt`

### 5. Import từ Dropbox

**Link preview** (Hệ thống tự convert sang dl=1)
```
https://www.dropbox.com/s/ABC123/file.pdf?dl=0
```

**Link download trực tiếp**
```
https://www.dropbox.com/s/ABC123/file.pdf?dl=1
```

### 6. Import từ OneDrive

**Link share** (Hệ thống tự thêm download=1)
```
https://1drv.ms/w/s!ABCDEFG
```

### 7. Import từ GitHub

**Raw file**
```
https://raw.githubusercontent.com/user/repo/main/file.md
```

### 8. Import từ website khác
```
https://example.com/documents/guide.pdf
```

---

## 📞 Support

Nếu gặp lỗi hoặc cần hỗ trợ, vui lòng kiểm tra:

1. ✅ Backend server đang chạy (port 13001)
2. ✅ MinIO server đang chạy (port 9000)
3. ✅ URL có thể truy cập từ server
4. ✅ File không quá 100MB
5. ✅ Định dạng file được hỗ trợ

---

**Created:** 2025-11-29  
**Version:** 1.0  
**Author:** ShopRauSach LMS Team
