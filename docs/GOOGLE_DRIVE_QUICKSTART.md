# 🚀 Quick Start: Cấu hình Google Drive

> **TL;DR:** Hướng dẫn nhanh để fix bug "Google Drive (Chưa cấu hình)"

## ⚡ Tóm tắt 30 giây

1. Tạo Service Account trên Google Cloud
2. Download file JSON credentials
3. Paste vào `backend/.env` → `GOOGLE_DRIVE_CREDENTIALS_JSON=`
4. Restart backend
5. ✅ Done!

## 📋 Checklist nhanh

### Phần 1: Google Cloud (5 phút)
- [ ] Tạo project mới trên [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Enable **Google Drive API**
- [ ] Tạo **Service Account**
- [ ] Tạo **Key JSON** và download về

### Phần 2: Share Folder (1 phút)
- [ ] Copy email service account (trong file JSON)
- [ ] Vào [Folder công ty](https://drive.google.com/drive/folders/1JR8q5xZ8vCWJgDEXMdEjwYinte4IXPE4)
- [ ] Share với email service account (quyền **Editor**)

### Phần 3: Backend (2 phút)
- [ ] Mở file `backend/.env`
- [ ] Copy nội dung JSON (toàn bộ, 1 dòng)
- [ ] Paste vào `GOOGLE_DRIVE_CREDENTIALS_JSON=`
- [ ] Restart backend: `bun run dev:backend`

### Phần 4: Kiểm tra (1 phút)
- [ ] Vào: http://localhost:13000/lms/admin/source-documents/new
- [ ] Nút "Google Drive" không còn ⚠️
- [ ] Upload thử 1 file test

## 🎯 One-liner

Nếu bạn đã có file JSON:

```bash
# 1. Copy JSON vào clipboard
# 2. Chạy lệnh này (thay YOUR_JSON bằng nội dung JSON)
echo 'GOOGLE_DRIVE_CREDENTIALS_JSON=YOUR_JSON_HERE' >> backend/.env

# 3. Restart
cd backend && bun run dev:backend
```

## 📖 Tài liệu đầy đủ

Chi tiết từng bước: [`docs/GOOGLE_DRIVE_SETUP_GUIDE.md`](./GOOGLE_DRIVE_SETUP_GUIDE.md)

## ❓ Troubleshooting 1-liner

### Vẫn hiển thị "Chưa cấu hình"?
```bash
# Kiểm tra biến env đã có chưa
cat backend/.env | grep GOOGLE_DRIVE_CREDENTIALS_JSON

# Kiểm tra backend log
# Tìm: "✅ Google Drive API initialized successfully"
```

### Upload bị lỗi "Permission denied"?
- Đảm bảo đã share folder với email service account
- Quyền phải là **Editor**, không phải Viewer

### File upload thành công nhưng không thấy?
- File nằm trong sub-folder (Images, Videos, Documents...)
- Vào folder chính và tìm trong sub-folder tương ứng

## 🔧 Service Account Email mẫu

```
lms-gdrive-uploader@tazagroup-lms-123456.iam.gserviceaccount.com
```

Tìm trong file JSON, field: `"client_email"`

## ✅ Kết quả mong đợi

**Trước:**
```
[Google Drive] (Chưa cấu hình) ⚠️
```

**Sau:**
```
[Google Drive] ✓
```

## 📞 Need Help?

Xem tài liệu đầy đủ:
- 📘 Setup Guide: `docs/GOOGLE_DRIVE_SETUP_GUIDE.md`
- 🔧 Technical Docs: `docs/GOOGLE_DRIVE_UPLOAD_FEATURE.md`
- 🐛 Bug Fix Summary: `docs/FIX_GOOGLE_DRIVE_BUG_SUMMARY.md`
