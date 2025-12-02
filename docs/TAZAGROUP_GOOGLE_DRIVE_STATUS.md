# ✅ Cấu hình Google Drive cho TazaGroup

**Ngày cập nhật:** 2 tháng 12, 2025  
**Domain:** tazagroup  
**Trạng thái:** Đang cấu hình

## 📋 Thông tin Service Account

```json
{
  "project_id": "tazagroup-480011",
  "client_email": "app-taza-group-drive-tazagroup@tazagroup-480011.iam.gserviceaccount.com",
  "client_id": "113868889399641704005"
}
```

## ✅ Đã hoàn thành

- [x] Tạo Service Account trên Google Cloud
- [x] Enable Google Drive API
- [x] Tạo key JSON cho service account
- [x] Cập nhật `GOOGLE_DRIVE_CREDENTIALS_JSON` vào `backend/.env`

## ⚠️ Cần thực hiện tiếp

### Bước 1: Share Folder Google Drive

**QUAN TRỌNG:** Cần share folder công ty với service account để có thể upload file.

1. **Copy email service account:**
   ```
   app-taza-group-drive-tazagroup@tazagroup-480011.iam.gserviceaccount.com
   ```

2. **Mở folder Google Drive công ty:**
   - URL: https://drive.google.com/drive/folders/1JR8q5xZ8vCWJgDEXMdEjwYinte4IXPE4
   - Hoặc folder bạn muốn sử dụng cho TazaGroup

3. **Share folder:**
   - Click phải vào folder → **"Share"**
   - Paste email service account vào ô "Add people and groups"
   - Chọn quyền: **"Editor"** (quan trọng!)
   - **BỎ TICK** ô "Notify people"
   - Click **"Share"**

### Bước 2: Restart Backend

Sau khi share folder, restart backend để áp dụng cấu hình:

```bash
# Dừng backend hiện tại (Ctrl+C trong terminal đang chạy)
# Hoặc kill process:
pkill -f "bun.*dev"

# Khởi động lại
cd /chikiet/kataoffical/shoprausach
bun run dev:tazagroup

# Hoặc chỉ backend:
bun run dev:tazagroup:backend
```

### Bước 3: Kiểm tra kết nối

1. **Xem log backend:**
   - Tìm dòng: `✅ Google Drive API initialized successfully`
   - Nếu thấy: `⚠️ GOOGLE_DRIVE_CREDENTIALS_JSON not set` → Cần restart lại

2. **Test trên UI:**
   - Vào: http://localhost:13000/lms/admin/source-documents/new
   - Trong phần "Upload tài liệu":
     - Nút **"Google Drive"** không còn icon ⚠️
     - Có thể click chọn Google Drive
   - Thử upload 1 file test

3. **Kiểm tra file trên Drive:**
   - Mở folder đã share
   - File sẽ nằm trong sub-folder tương ứng (Images, Videos, Documents...)

## 🔍 Troubleshooting

### Vẫn hiển thị "Chưa cấu hình"?

**Kiểm tra:**
```bash
# 1. Xem biến env
cd /chikiet/kataoffical/shoprausach/backend
cat .env | grep GOOGLE_DRIVE_CREDENTIALS_JSON | head -c 100

# 2. Đảm bảo đã restart backend
ps aux | grep "bun.*dev" | grep -v grep
```

**Giải pháp:**
- Restart backend (quan trọng!)
- Xem log backend để tìm lỗi

### Lỗi "Permission denied" khi upload?

**Nguyên nhân:** Chưa share folder hoặc quyền không đủ

**Giải pháp:**
1. Kiểm tra đã share folder với email: `app-taza-group-drive-tazagroup@tazagroup-480011.iam.gserviceaccount.com`
2. Đảm bảo quyền là **"Editor"**, không phải "Viewer"
3. Đợi vài phút để Google đồng bộ quyền

### Lỗi "Không thể kết nối Google Drive"?

**Kiểm tra:**
```bash
# Test API endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:13001/api/lms/source-documents/google-drive/status
```

**Response mong đợi:**
```json
{
  "connected": true,
  "message": "Kết nối Google Drive thành công"
}
```

## 📊 Cấu trúc Folder

Khi upload thành công, file sẽ được tự động phân loại:

```
📁 Folder TazaGroup
├── 📁 Images (jpg, png, gif, webp...)
├── 📁 Videos (mp4, avi, mov...)
├── 📁 Audio (mp3, wav, ogg...)
├── 📁 PDFs (pdf files)
├── 📁 Documents (doc, docx, txt, md...)
├── 📁 Spreadsheets (xls, xlsx, csv...)
├── 📁 Presentations (ppt, pptx...)
└── 📁 Others (các file khác)
```

## 📖 Tài liệu tham khảo

- 📘 Setup Guide: `docs/GOOGLE_DRIVE_SETUP_GUIDE.md`
- 🚀 Quick Start: `docs/GOOGLE_DRIVE_QUICKSTART.md`
- 🔧 Technical: `docs/GOOGLE_DRIVE_UPLOAD_FEATURE.md`

## ✅ Checklist hoàn tất

- [x] Service Account đã tạo
- [x] Credentials đã cập nhật vào .env
- [x] **Share folder với service account**
- [x] Restart backend
- [x] Backend đã load credentials thành công: `✅ Google Drive API initialized successfully`
- [ ] **Test upload file trên frontend** ⬅️ BẠN Ở ĐÂY
- [ ] Verify file trên Google Drive

---

## 🎯 Trạng thái hiện tại

**Backend:** ✅ Đã cấu hình xong và chạy thành công  
**Google Drive API:** ✅ Initialized successfully  
**Service Account:** ✅ app-taza-group-drive-tazagroup@tazagroup-480011.iam.gserviceaccount.com  
**Folder Permission:** ✅ Đã share với quyền Editor

## ⚠️ Nếu frontend vẫn hiển thị lỗi

### Kiểm tra nhanh:

1. **Đảm bảo đã đăng nhập:**
   - Vào http://localhost:13000
   - Login với tài khoản admin
   - accessToken phải có trong localStorage

2. **Refresh trang:**
   - Mở http://localhost:13000/lms/admin/source-documents/new
   - Hard refresh: `Ctrl+Shift+R` (hoặc `Cmd+Shift+R` trên Mac)
   - Clear cache nếu cần

3. **Kiểm tra DevTools:**
   - Mở DevTools (F12)
   - Tab Console: Xem có lỗi JavaScript không
   - Tab Network: 
     - Tìm request tới `/api/lms/source-documents/google-drive/status`
     - Xem response
     - Kiểm tra có header `Authorization: Bearer ...` không

4. **Test API trực tiếp:**
   ```bash
   # Lấy token từ browser localStorage
   # Rồi test:
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:13001/api/lms/source-documents/google-drive/status
   
   # Response mong đợi:
   # {"connected":true,"message":"Kết nối Google Drive thành công"}
   ```

### Các nguyên nhân thường gặp:

#### ❌ Lỗi: "Chưa cấu hình" vẫn hiển thị
- **Nguyên nhân:** Frontend chưa được refresh sau khi backend restart
- **Giải pháp:** Hard refresh trang (Ctrl+Shift+R)

#### ❌ Lỗi: Network request failed
- **Nguyên nhân:** Backend chưa chạy hoặc port sai
- **Giải pháp:** Kiểm tra backend đang chạy ở port 13001
  ```bash
  ps aux | grep ts-node-dev
  curl http://localhost:13001/api/lms/source-documents/google-drive/status
  ```

#### ❌ Lỗi: "Authentication token is required"
- **Nguyên nhân:** Chưa đăng nhập hoặc token hết hạn
- **Giải pháp:** 
  1. Logout và login lại
  2. Kiểm tra localStorage có `accessToken` không
  3. F12 → Application → Local Storage → http://localhost:13000

#### ❌ Lỗi: "Không thể kết nối Google Drive"
- **Nguyên nhân:** Folder chưa được share hoặc credentials sai
- **Giải pháp:**
  1. Double check đã share folder với email service account
  2. Kiểm tra quyền là Editor (không phải Viewer)
  3. Xem backend log có lỗi không:
     ```bash
     tail -50 /tmp/backend.log | grep -i error
     ```

---

**Next Action:** 
1. Login vào http://localhost:13000
2. Vào trang tạo tài liệu mới
3. Kiểm tra nút Google Drive (không còn ⚠️)
4. Upload thử 1 file test
