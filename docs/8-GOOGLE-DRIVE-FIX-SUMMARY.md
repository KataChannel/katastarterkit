# 🎯 SUMMARY: Google Drive Permission Fix

## ❌ Vấn Đề
```json
{
  "connected": false,
  "message": "Không thể kết nối Google Drive: File not found: 1kSEvP8QlhhZoOjtemtLuKA_LkuWr2OTG."
}
```

## ✅ Giải Pháp

### Service Account cần được share quyền truy cập folder:

**📧 Email Service Account:**
```
app-taza-group-drive-tazagroup@tazagroup-480011.iam.gserviceaccount.com
```

**🌐 Folder Google Drive:**
```
https://drive.google.com/drive/folders/1kSEvP8QlhhZoOjtemtLuKA_LkuWr2OTG
```

**🔐 Quyền cần thiết:** Editor / Người chỉnh sửa

---

## 📝 Các File Đã Tạo

### 1. **FIX-GOOGLE-DRIVE-PERMISSION.md**
   - Hướng dẫn chi tiết từng bước
   - Troubleshooting guide
   - Thông tin kỹ thuật

### 2. **show-google-drive-fix.sh**
   - Script hiển thị instructions nhanh
   - Chạy: `./show-google-drive-fix.sh`

### 3. **test-google-drive-permission.sh**
   - Script test tổng hợp
   - Chạy: `./test-google-drive-permission.sh`

### 4. **backend/test-google-drive-direct.js**
   - Test script Node.js (đã cập nhật với dotenv)
   - Chạy: `cd backend && node test-google-drive-direct.js`

### 5. **fix-google-drive-permission.md**
   - Backup documentation

---

## 🚀 Quick Start

### Xem hướng dẫn:
```bash
./show-google-drive-fix.sh
```

### Test sau khi share:
```bash
cd backend
node test-google-drive-direct.js
```

### Hoặc:
```bash
./test-google-drive-permission.sh
```

---

## 📊 Trạng Thái Hiện Tại

- ✅ Service Account credentials: **Configured**
- ✅ Google Drive API: **Initialized**
- ❌ Folder access: **NO PERMISSION (404)**
- ⏳ Waiting for: **User to share folder**

---

## 🔄 Next Steps

1. **Bạn:** Share folder với Service Account (3 bước trong hướng dẫn)
2. **Đợi:** 1-2 phút để Google sync
3. **Test:** Chạy `node backend/test-google-drive-direct.js`
4. **Verify:** Check frontend status tại `/lms/admin/source-documents/new`

---

## ✅ Kết Quả Mong Đợi

Test script sẽ trả về:
```
✅ SUCCESS! Folder accessible:
   ID: 1kSEvP8QlhhZoOjtemtLuKA_LkuWr2OTG
   Name: [Folder name]
   Type: application/vnd.google-apps.folder

✅ Google Drive connection is working!
```

API status sẽ trả về:
```json
{
  "connected": true,
  "message": "Kết nối Google Drive thành công"
}
```

Frontend sẽ hiển thị:
```
✅ Google Drive (Đã kết nối)
```

---

## 🛠️ Technical Details

- **Service:** GoogleDriveService
- **File:** `backend/src/services/google-drive.service.ts`
- **Folder ID:** `1kSEvP8QlhhZoOjtemtLuKA_LkuWr2OTG`
- **Error Code:** 404 (Not Found / No Permission)
- **Required Scope:** `https://www.googleapis.com/auth/drive.file`

---

**Note:** Service Account không có inbox nên không cần xác nhận email sau khi share!
