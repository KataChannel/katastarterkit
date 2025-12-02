# 🚨 FIX: Google Drive Folder Permission Error

## 📋 Tình trạng hiện tại

**Lỗi:** 
```json
{
  "connected": false,
  "message": "Không thể kết nối Google Drive: File not found: 1JR8q5xZ8vCWJgDEXMdEjwYinte4IXPE4."
}
```

**Nguyên nhân:** Service Account chưa có quyền truy cập folder

---

## ✅ HƯỚNG DẪN SỬA (3 BƯỚC ĐƠN GIẢN)

### 📧 Bước 1: Copy Email Service Account

```
app-taza-group-drive-tazagroup@tazagroup-480011.iam.gserviceaccount.com
```

**👆 Click để select toàn bộ → Ctrl+C để copy**

---

### 🌐 Bước 2: Mở Folder Google Drive

**Click vào link này:**

👉 **https://drive.google.com/drive/folders/1kSEvP8QlhhZoOjtemtLuKA_LkuWr2OTG**

*(Folder sẽ mở trong Google Drive của bạn)*

---

### 🔐 Bước 3: Chia Sẻ Folder

**3.1. Click vào nút "Share" / "Chia sẻ"** (icon người + dấu cộng ở góc trên bên phải)

**3.2. Paste email Service Account vào ô "Add people and groups":**
```
app-taza-group-drive-tazagroup@tazagroup-480011.iam.gserviceaccount.com
```

**3.3. Chọn quyền "Editor" / "Người chỉnh sửa"** (dropdown bên phải)

**3.4. BỎ TÍCH "Notify people"** (để không spam email)

**3.5. Click "Share" / "Chia sẻ"**

---

## ✅ Hoàn Tất!

Sau khi share xong:

### 1️⃣ Đợi 1-2 phút để Google đồng bộ

### 2️⃣ Chạy test để kiểm tra:

```bash
cd /chikiet/kataoffical/shoprausach/backend
node test-google-drive-direct.js
```

**Kết quả mong đợi:**
```
✅ SUCCESS! Folder accessible:
   ID: 1kSEvP8QlhhZoOjtemtLuKA_LkuWr2OTG
   Name: [Tên folder của bạn]
   Type: application/vnd.google-apps.folder

✅ Google Drive connection is working!
```

### 3️⃣ Restart Backend (nếu cần):

```bash
# Kill backend process
pkill -f "ts-node.*main.ts"

# Backend sẽ tự restart nếu dùng concurrently
# Hoặc chạy lại: bun run dev:tazagroup
```

### 4️⃣ Kiểm tra trên Frontend:

Mở: **http://localhost:13000/lms/admin/source-documents/new**

Status sẽ đổi từ:
```
⚠️ Google Drive (Chưa cấu hình)
```

Thành:
```
✅ Google Drive (Đã kết nối)
```

---

## 🔍 Xác Nhận Đã Share Đúng

Vào Google Drive → Folder → Click phải → "Share" → "Manage Access"

Bạn sẽ thấy trong danh sách:

```
app-taza-group-drive-tazagroup@tazagroup-480011.iam.gserviceaccount.com
Editor
```

---

## 🐛 Troubleshooting

### ❌ Nếu vẫn bị lỗi 404 sau khi share:

**1. Kiểm tra lại quyền:**
- Mở folder → Share → Xem có Service Account email trong danh sách không
- Quyền phải là **Editor** hoặc cao hơn

**2. Đợi lâu hơn:**
- Google đôi khi cần 2-5 phút để sync permissions
- Thử lại sau vài phút

**3. Remove và add lại:**
- Vào Manage Access → Xóa Service Account
- Đợi 30 giây
- Add lại với quyền Editor

**4. Kiểm tra Folder ID:**
```bash
cd /chikiet/kataoffical/shoprausach/backend
grep "COMPANY_FOLDER_ID" src/services/google-drive.service.ts
```

Phải thấy: `1kSEvP8QlhhZoOjtemtLuKA_LkuWr2OTG`

### ❌ Nếu không thể share (folder bị khóa):

**Folder có thể thuộc quyền sở hữu khác:**
- Liên hệ người sở hữu folder để share
- Hoặc tạo folder mới và cập nhật ID trong code

**Để tạo folder mới:**

1. Tạo folder trong Google Drive của bạn
2. Copy Folder ID từ URL (phần sau `/folders/`)
3. Share folder với Service Account
4. Cập nhật trong `backend/src/services/google-drive.service.ts`:
   ```typescript
   private readonly COMPANY_FOLDER_ID = 'YOUR_NEW_FOLDER_ID';
   ```

---

## 📊 Chi Tiết Kỹ Thuật

### Service Account Info:
- **Email:** app-taza-group-drive-tazagroup@tazagroup-480011.iam.gserviceaccount.com
- **Project:** tazagroup-480011
- **Scopes:** `https://www.googleapis.com/auth/drive.file`
- **Type:** Service Account (không cần password)

### Quyền cần thiết:
- **Editor** - Cho phép:
  - ✅ Tạo sub-folders (Images, Videos, PDFs, etc.)
  - ✅ Upload files
  - ✅ Set permissions cho files
  - ✅ Read/List files
  - ❌ Không thể xóa folder gốc

### Folder structure sẽ được tạo:
```
📁 Company Folder (1kSEvP8QlhhZoOjtemtLuKA_LkuWr2OTG)
├── 📁 Images/
├── 📁 Videos/
├── 📁 Audio/
├── 📁 PDFs/
├── 📁 Documents/
├── 📁 Spreadsheets/
├── 📁 Presentations/
└── 📁 Others/
```

---

## 🎯 Quick Check Script

Chạy script này bất cứ lúc nào để test:

```bash
./test-google-drive-permission.sh
```

Hoặc:

```bash
cd backend && node test-google-drive-direct.js
```

---

## 📞 Cần Hỗ Trợ?

Nếu vẫn gặp vấn đề, cung cấp:

1. **Screenshot** màn hình Share folder (cho thấy Service Account trong danh sách)
2. **Output** của test script
3. **Log backend** khi khởi động (grep "Google Drive")

---

**Lưu ý:** Service Account email trông giống email thật nhưng không có inbox, không cần xác nhận email!
