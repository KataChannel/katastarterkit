# Fix: Google URLs Upload Support

## 🐛 Bug Report

**Error:** `getaddrinfo ENOTFOUND &`

**Root Cause:**
1. URL từ Google bị HTML-encoded (`&#x2F;` thay vì `/`)
2. Ký tự `&` trong URL gây lỗi DNS parsing
3. Google Sheets/Docs/Drive URLs không trả về file trực tiếp, cần convert sang export URL

**Original URL:**
```
https:&#x2F;&#x2F;docs.google.com&#x2F;spreadsheets&#x2F;d&#x2F;1X31iwnqXRQjgHOn_glxXs6y7X_3p8LeMEOYvlfaUp-8&#x2F;edit?gid=0#gid=0
```

---

## ✅ Solution Implemented

### 1. HTML Entity Decoding

Tự động decode HTML entities trong URL:
- `&#x2F;` → `/`
- `&#x3A;` → `:`
- `&amp;` → `&`
- `&lt;` → `<`
- `&gt;` → `>`
- `&quot;` → `"`
- `&#39;` → `'`

### 2. Google URLs Auto-Conversion

#### Google Sheets
**Input:**
```
https://docs.google.com/spreadsheets/d/SHEET_ID/edit?gid=0#gid=0
```

**Converted to:**
```
https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=xlsx&gid=0
```

#### Google Docs
**Input:**
```
https://docs.google.com/document/d/DOC_ID/edit
```

**Converted to:**
```
https://docs.google.com/document/d/DOC_ID/export?format=docx
```

#### Google Slides
**Input:**
```
https://docs.google.com/presentation/d/SLIDE_ID/edit
```

**Converted to:**
```
https://docs.google.com/presentation/d/SLIDE_ID/export?format=pptx
```

#### Google Drive
**Input:**
```
https://drive.google.com/file/d/FILE_ID/view
https://drive.google.com/open?id=FILE_ID
```

**Converted to:**
```
https://drive.google.com/uc?export=download&id=FILE_ID
```

### 3. Other Cloud Storage

#### Dropbox
```
https://www.dropbox.com/s/ABC/file.pdf?dl=0
→ https://www.dropbox.com/s/ABC/file.pdf?dl=1
```

#### OneDrive
```
https://1drv.ms/w/s!ABCDEFG
→ https://1drv.ms/w/s!ABCDEFG?download=1
```

---

## 🔧 Code Changes

### File: `backend/src/lms/source-document/source-document.service.ts`

#### 1. Added HTML Entity Decoding
```typescript
// Decode HTML entities (&#x2F; -> /, &amp; -> &, etc.)
let cleanUrl = url
  .replace(/&#x2F;/g, '/')
  .replace(/&#x3A;/g, ':')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'");
```

#### 2. Added Google URL Conversion Method
```typescript
private convertGoogleUrlToDirectDownload(url: string): string {
  // Handle Google Sheets
  if (url.includes('docs.google.com/spreadsheets/d/')) {
    const sheetId = extractId(url);
    const gid = extractGid(url) || '0';
    return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=xlsx&gid=${gid}`;
  }
  
  // Handle Google Docs
  // Handle Google Slides
  // Handle Google Drive
  // Handle Dropbox
  // Handle OneDrive
}
```

#### 3. Enhanced Filename Generation
```typescript
// Generate filename based on source if still generic
if (fileName === 'downloaded-file' || fileName === 'export') {
  if (cleanUrl.includes('docs.google.com/spreadsheets')) {
    fileName = 'google-sheet';
  } else if (cleanUrl.includes('docs.google.com/document')) {
    fileName = 'google-doc';
  } // ... etc
}
```

#### 4. Added Google MIME Types
```typescript
// Google export formats
'application/vnd.google-apps.spreadsheet': '.xlsx',
'application/vnd.google-apps.document': '.docx',
'application/vnd.google-apps.presentation': '.pptx',
```

---

## 🧪 Testing

### Manual Test với Google Sheets

```bash
curl -X POST http://localhost:13001/api/lms/source-documents/upload-from-url \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.google.com/spreadsheets/d/1X31iwnqXRQjgHOn_glxXs6y7X_3p8LeMEOYvlfaUp-8/edit?gid=0#gid=0"
  }'
```

### Automated Test Script

```bash
cd backend
bun run test-google-urls.ts
```

---

## 📊 Supported Formats

### Google Workspace

| Service | Input URL | Export Format | MIME Type |
|---------|-----------|---------------|-----------|
| **Google Sheets** | `/spreadsheets/d/ID/edit` | XLSX | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |
| **Google Docs** | `/document/d/ID/edit` | DOCX | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |
| **Google Slides** | `/presentation/d/ID/edit` | PPTX | `application/vnd.openxmlformats-officedocument.presentationml.presentation` |
| **Google Drive** | `/file/d/ID/view` | Original | Depends on file |

### Alternative Export Formats

**Google Sheets:**
- `xlsx` (default), `csv`, `pdf`, `ods`, `tsv`, `html`

**Google Docs:**
- `docx` (default), `pdf`, `odt`, `rtf`, `txt`, `html`, `epub`

**Google Slides:**
- `pptx` (default), `pdf`, `odp`, `txt`

---

## 🎯 How It Works

1. **User inputs URL** (có thể là edit URL hoặc HTML-encoded)
2. **Decode HTML entities** (&#x2F; → /)
3. **Detect service** (Google Sheets/Docs/Slides/Drive/Dropbox/OneDrive)
4. **Convert to export URL** (edit → export?format=xlsx)
5. **Download file** với axios
6. **Extract filename & MIME type** từ response headers
7. **Upload to MinIO** storage
8. **Return result** với URL, filename, size

---

## 🚀 Usage Examples

### Frontend (Web UI)

1. Vào `/lms/instructor/source-documents/new`
2. Tab **"Tải từ URL"**
3. Nhập URL (bất kỳ format nào):
   - `https://docs.google.com/spreadsheets/d/ID/edit`
   - `https:&#x2F;&#x2F;docs.google.com&#x2F;spreadsheets&#x2F;...` (HTML-encoded)
   - `https://drive.google.com/file/d/ID/view`
4. Click **"Tải file từ URL"**
5. ✅ Done!

### Backend API

```javascript
fetch('http://localhost:13001/api/lms/source-documents/upload-from-url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://docs.google.com/spreadsheets/d/ID/edit?gid=0#gid=0'
  })
})
```

### GraphQL

```graphql
mutation {
  uploadFromUrl(url: "https://docs.google.com/spreadsheets/d/ID/edit") {
    id
    url
    filename
    mimetype
    size
  }
}
```

---

## 📝 Notes

1. **Google Files must be publicly accessible** (Anyone with link can view)
2. **Large files** (>50MB) may take longer to download
3. **HTML entities** are automatically decoded before processing
4. **URL fragments** (`#gid=0`) are properly handled
5. **GID parameter** for Google Sheets is preserved

---

## 🔐 Permissions

### Google Drive/Docs/Sheets/Slides
- File phải được share với "Anyone with the link can view"
- Hoặc file phải public

### Dropbox
- Link sharing phải được enable

### OneDrive
- File phải được share publicly

---

## ⚠️ Troubleshooting

### Error: "Không thể kết nối đến URL"
- ✅ Check URL không bị HTML-encoded sai
- ✅ Check file có public không
- ✅ Thử mở URL trên browser trước

### Error: "HTTP 403 Forbidden"
- ✅ File chưa được share publicly
- ✅ Enable "Anyone with link can view" trên Google

### Error: "HTTP 404 Not Found"
- ✅ File ID không tồn tại
- ✅ File đã bị xóa

### Error: "Timeout khi tải file"
- ✅ File quá lớn (>100MB)
- ✅ Google server phản hồi chậm
- ✅ Thử lại sau vài phút

---

## 📚 References

- [Google Drive API - Export](https://developers.google.com/drive/api/guides/ref-export-formats)
- [Google Sheets API - Export](https://developers.google.com/sheets/api/guides/concepts)
- [Dropbox Direct Download](https://help.dropbox.com/share/force-download)

---

**Fixed:** 2025-11-29  
**Version:** 1.1  
**Author:** ShopRauSach LMS Team
