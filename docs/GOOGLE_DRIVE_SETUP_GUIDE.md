# Hướng dẫn cấu hình Google Drive Upload

## Tổng quan

Hệ thống hỗ trợ upload tài liệu nguồn lên **Google Drive công ty** thay vì MinIO server. Để sử dụng tính năng này, bạn cần cấu hình Service Account của Google Cloud.

**Folder Google Drive công ty:** https://drive.google.com/drive/folders/1kSEvP8QlhhZoOjtemtLuKA_LkuWr2OTG

## Bước 1: Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Đăng nhập bằng tài khoản Google công ty
3. Click vào dropdown "Select a project" ở góc trên bên trái
4. Click nút **"NEW PROJECT"**
5. Nhập thông tin:
   - **Project name:** `TazaGroup LMS` (hoặc tên tùy ý)
   - **Organization:** Chọn organization công ty (nếu có)
   - **Location:** Để mặc định hoặc chọn organization
6. Click **"CREATE"**
7. Đợi vài giây để project được tạo

## Bước 2: Enable Google Drive API

1. Trong Google Cloud Console, đảm bảo đang ở project vừa tạo
2. Vào menu ☰ → **"APIs & Services"** → **"Library"**
3. Tìm kiếm **"Google Drive API"**
4. Click vào **"Google Drive API"**
5. Click nút **"ENABLE"**
6. Đợi API được kích hoạt (thường < 30 giây)

## Bước 3: Tạo Service Account

1. Vào menu ☰ → **"IAM & Admin"** → **"Service Accounts"**
2. Click **"+ CREATE SERVICE ACCOUNT"** ở trên cùng
3. Nhập thông tin:
   - **Service account name:** `lms-gdrive-uploader`
   - **Service account ID:** (tự động tạo từ name)
   - **Description:** `Service account for LMS to upload documents to Google Drive`
4. Click **"CREATE AND CONTINUE"**
5. **Grant this service account access to project:**
   - Bỏ qua bước này (không cần gán role)
   - Click **"CONTINUE"**
6. **Grant users access to this service account:**
   - Bỏ qua bước này
   - Click **"DONE"**

## Bước 4: Tạo Key JSON cho Service Account

1. Trong danh sách Service Accounts, click vào service account vừa tạo
2. Chuyển sang tab **"KEYS"**
3. Click **"ADD KEY"** → **"Create new key"**
4. Chọn **Key type: JSON**
5. Click **"CREATE"**
6. File JSON sẽ tự động download về máy
7. **LƯU Ý:** File này chứa private key, cần bảo mật tuyệt đối

## Bước 5: Share Folder Google Drive với Service Account

1. Mở file JSON vừa download, tìm field `"client_email"`
   - Email có dạng: `lms-gdrive-uploader@project-id.iam.gserviceaccount.com`
2. Copy email này
3. Mở folder Google Drive công ty: https://drive.google.com/drive/folders/1kSEvP8QlhhZoOjtemtLuKA_LkuWr2OTG
4. Click phải vào folder → **"Share"** (hoặc click biểu tượng 👤+)
5. Paste email service account vào ô "Add people and groups"
6. Chọn quyền: **"Editor"** (để có thể upload và tạo sub-folder)
7. **BỎ TICK** ô "Notify people" (service account không cần email thông báo)
8. Click **"Share"** hoặc **"Send"**

## Bước 6: Cấu hình Backend

1. Mở file JSON đã download ở Bước 4
2. Copy **TOÀN BỘ** nội dung file (từ { đến })
3. Mở file `backend/.env`
4. Tìm dòng `GOOGLE_DRIVE_CREDENTIALS_JSON=`
5. Paste nội dung JSON vào sau dấu `=` (trên **1 dòng duy nhất**)

**Ví dụ:**
```env
GOOGLE_DRIVE_CREDENTIALS_JSON={"type":"service_account","project_id":"tazagroup-lms-123456","private_key_id":"abc123...","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIB...==\n-----END PRIVATE KEY-----\n","client_email":"lms-gdrive-uploader@tazagroup-lms-123456.iam.gserviceaccount.com",...}
```

**LƯU Ý QUAN TRỌNG:**
- Phải paste trên **1 dòng duy nhất**, không xuống dòng
- Phải copy **TOÀN BỘ** file JSON (kể cả dấu {} ngoài cùng)
- Không thêm dấu nháy đơn `'` hay nháy kép `"` bao quanh
- Private key trong JSON đã có `\n`, giữ nguyên

## Bước 7: Restart Backend

```bash
# Nếu đang chạy dev server
cd backend
bun run dev:backend

# Hoặc restart Docker container
docker-compose restart backend
```

## Bước 8: Kiểm tra kết nối

1. Mở trình duyệt, vào trang tạo tài liệu nguồn mới
   - URL: `http://localhost:13000/lms/admin/source-documents/new`
2. Trong phần **"Upload tài liệu"**, kiểm tra:
   - Nút **"Google Drive"** không còn hiển thị "(Chưa cấu hình)"
   - Có thể click chọn Google Drive làm nơi lưu trữ
3. Thử upload 1 file test
4. Kiểm tra folder Google Drive xem file đã được upload chưa

## Cấu trúc Folder trên Google Drive

Hệ thống tự động tạo sub-folder theo loại file:

```
📁 Folder công ty (1kSEvP8QlhhZoOjtemtLuKA_LkuWr2OTG)
├── 📁 Images (ảnh: jpg, png, gif, webp...)
├── 📁 Videos (video: mp4, avi, mov...)
├── 📁 Audio (âm thanh: mp3, wav, ogg...)
├── 📁 PDFs (file pdf)
├── 📁 Documents (doc, docx, txt, md...)
├── 📁 Spreadsheets (xls, xlsx, csv...)
├── 📁 Presentations (ppt, pptx...)
└── 📁 Others (các file khác)
```

## Troubleshooting

### Lỗi: "Google Drive chưa được cấu hình"

**Nguyên nhân:** Biến `GOOGLE_DRIVE_CREDENTIALS_JSON` chưa được set hoặc sai format

**Giải pháp:**
1. Kiểm tra file `backend/.env` có dòng `GOOGLE_DRIVE_CREDENTIALS_JSON=` không
2. Đảm bảo JSON paste đúng format (1 dòng, đầy đủ)
3. Restart backend
4. Kiểm tra log backend, tìm dòng:
   - ✅ `✅ Google Drive API initialized successfully`
   - ❌ `⚠️ GOOGLE_DRIVE_CREDENTIALS_JSON not set`

### Lỗi: "Không thể kết nối Google Drive"

**Nguyên nhân:** Service account không có quyền truy cập folder

**Giải pháp:**
1. Kiểm tra đã share folder với service account chưa
2. Đảm bảo quyền là **"Editor"**, không phải "Viewer"
3. Kiểm tra email service account trong file JSON khớp với email đã share
4. Đợi vài phút để Google đồng bộ quyền

### Lỗi: "Invalid JSON in GOOGLE_DRIVE_CREDENTIALS_JSON"

**Nguyên nhân:** JSON bị lỗi cú pháp (thường do xuống dòng hoặc thiếu ký tự)

**Giải pháp:**
1. Mở file JSON gốc đã download
2. Dùng tool format JSON online (ví dụ: jsonlint.com) để kiểm tra
3. Copy lại toàn bộ và paste vào 1 dòng trong .env
4. Đảm bảo không có dấu `,` thừa cuối cùng trong JSON

### Lỗi: "Permission denied" khi upload

**Nguyên nhân:** Service account chưa có quyền Editor

**Giải pháp:**
1. Vào folder Google Drive
2. Click phải → Share
3. Tìm email service account
4. Thay đổi quyền từ "Viewer" → "Editor"
5. Save

### Upload thành công nhưng không thấy file trong folder

**Nguyên nhân:** File được upload vào sub-folder tự động tạo

**Giải pháp:**
1. Mở folder công ty: https://drive.google.com/drive/folders/1kSEvP8QlhhZoOjtemtLuKA_LkuWr2OTG
2. Tìm sub-folder tương ứng (Images, Videos, Documents...)
3. File sẽ nằm trong sub-folder đó

## Tính năng nâng cao

### Upload từ URL

Hệ thống hỗ trợ tải file từ URL và upload lên Google Drive:

- ✅ Google Drive links
- ✅ Google Sheets (auto export to Excel)
- ✅ Google Docs (auto export to Word)
- ✅ Google Slides (auto export to PowerPoint)
- ✅ Dropbox links
- ✅ Direct HTTP/HTTPS URLs

### Giới hạn

- File size tối đa: **100MB**
- Timeout tải URL: **60 giây**
- File types: Tất cả (images, videos, documents, audio, archives...)

## Bảo mật

### DO's ✅
- Lưu file JSON service account ở nơi an toàn
- Chỉ share với người có trách nhiệm
- Sử dụng service account riêng cho mỗi project
- Định kỳ rotate key (tạo key mới, xóa key cũ)

### DON'Ts ❌
- KHÔNG commit file JSON vào Git
- KHÔNG share công khai file JSON
- KHÔNG dùng chung service account cho nhiều mục đích
- KHÔNG để file JSON trong folder public

## Tham khảo

- [Google Cloud Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
- [Google Drive API](https://developers.google.com/drive/api/guides/about-sdk)
- [Service Account Keys](https://cloud.google.com/iam/docs/creating-managing-service-account-keys)

## Hỗ trợ

Nếu gặp vấn đề, liên hệ:
- Team Lead: [email/contact]
- DevOps Team: [email/contact]
- Tài liệu kỹ thuật: `docs/GOOGLE_DRIVE_UPLOAD_FEATURE.md`
