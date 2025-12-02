# Fix Bug: Google Drive (Chưa cấu hình)

**Ngày:** 2 tháng 12, 2025  
**Trạng thái:** ✅ Đã fix  
**Mức độ:** Trung bình

## Vấn đề

Trong trang tạo tài liệu nguồn mới (`/lms/admin/source-documents/new`), nút **"Google Drive"** hiển thị trạng thái **(Chưa cấu hình)** và không thể sử dụng.

### Triệu chứng
- ❌ Nút "Google Drive" bị disabled
- ❌ Hiển thị text "(Chưa cấu hình)"
- ❌ Không thể chọn Google Drive làm nơi lưu trữ file

### Nguyên nhân gốc
Biến môi trường `GOOGLE_DRIVE_CREDENTIALS_JSON` chưa được cấu hình trong file `backend/.env`.

## Giải pháp

### 1. Cấu hình Backend (.env)

**File:** `backend/.env`

**Thêm mới:**
```env
# Google Drive Upload (LMS Source Documents)
# Để sử dụng tính năng upload lên Google Drive, cần:
# 1. Tạo Service Account trên Google Cloud Console
# 2. Enable Google Drive API
# 3. Tạo key JSON cho service account
# 4. Share folder Google Drive với email service account
# 5. Paste toàn bộ nội dung JSON vào biến này (trên 1 dòng)
# Xem hướng dẫn chi tiết: docs/GOOGLE_DRIVE_SETUP_GUIDE.md
GOOGLE_DRIVE_CREDENTIALS_JSON=
```

### 2. Tài liệu hướng dẫn

**File mới:** `docs/GOOGLE_DRIVE_SETUP_GUIDE.md`

Tạo hướng dẫn chi tiết bằng tiếng Việt với các bước:
- ✅ Tạo Google Cloud Project
- ✅ Enable Google Drive API
- ✅ Tạo Service Account
- ✅ Tạo Key JSON
- ✅ Share folder với service account
- ✅ Cấu hình backend
- ✅ Troubleshooting

### 3. Cải thiện Frontend UI

**File:** `frontend/src/app/lms/admin/source-documents/new/page.tsx`

**Cải tiến:**
- ✅ Hiển thị thông báo chi tiết khi Google Drive chưa cấu hình
- ✅ Liệt kê các bước cần làm
- ✅ Thêm link tới tài liệu hướng dẫn
- ✅ Thêm tooltip cho nút Google Drive
- ✅ Đổi icon từ text "(Chưa cấu hình)" sang icon ⚠️

## Các thay đổi

### backend/.env
```diff
+ # Google Drive Upload (LMS Source Documents)
+ # Để sử dụng tính năng upload lên Google Drive, cần:
+ # 1. Tạo Service Account trên Google Cloud Console
+ # 2. Enable Google Drive API
+ # 3. Tạo key JSON cho service account
+ # 4. Share folder Google Drive với email service account
+ # 5. Paste toàn bộ nội dung JSON vào biến này (trên 1 dòng)
+ # Xem hướng dẫn chi tiết: docs/GOOGLE_DRIVE_SETUP_GUIDE.md
+ GOOGLE_DRIVE_CREDENTIALS_JSON=
```

### docs/GOOGLE_DRIVE_SETUP_GUIDE.md
- ✅ File mới: Hướng dẫn đầy đủ bằng tiếng Việt
- 8 bước cấu hình chi tiết
- Troubleshooting cho các lỗi thường gặp
- Best practices về bảo mật

### frontend/src/app/lms/admin/source-documents/new/page.tsx

**Thay đổi 1: Thông báo chi tiết**
```tsx
// Trước
<div className="flex items-center gap-2 text-amber-600 ...">
  <AlertCircle />
  <span>{gdriveStatus.message}</span>
</div>

// Sau
<div className="space-y-2 p-4 bg-amber-50 ...">
  <div className="flex items-start gap-2 ...">
    <AlertCircle className="w-5 h-5" />
    <div>
      <p className="font-semibold">Google Drive chưa được cấu hình</p>
      <p className="text-xs">{gdriveStatus.message}</p>
    </div>
  </div>
  <div className="pl-7 space-y-1 text-xs ...">
    <p>📋 Để sử dụng Google Drive, cần:</p>
    <ol className="list-decimal ...">
      <li>Tạo Service Account trên Google Cloud Console</li>
      <li>Enable Google Drive API</li>
      <li>Tạo key JSON và cấu hình trong backend/.env</li>
      <li>Share folder với email service account</li>
    </ol>
    <p>📖 Xem hướng dẫn chi tiết: <code>docs/GOOGLE_DRIVE_SETUP_GUIDE.md</code></p>
  </div>
</div>
```

**Thay đổi 2: Nút Google Drive**
```tsx
// Trước
<Button ...>
  <Cloud />
  Google Drive
  {!gdriveStatus?.connected && (
    <span className="text-xs">(Chưa cấu hình)</span>
  )}
</Button>

// Sau
<Button
  ...
  title={!gdriveStatus?.connected 
    ? 'Cần cấu hình GOOGLE_DRIVE_CREDENTIALS_JSON trong backend/.env' 
    : 'Upload lên Google Drive công ty'}
>
  <Cloud />
  Google Drive
  {!gdriveStatus?.connected && (
    <span className="text-xs">⚠️</span>
  )}
</Button>
```

## Cách sử dụng (cho Dev/Admin)

### Bước 1: Cấu hình Google Drive (One-time)
```bash
# Đọc hướng dẫn chi tiết
cat docs/GOOGLE_DRIVE_SETUP_GUIDE.md

# Hoặc mở trong VS Code
code docs/GOOGLE_DRIVE_SETUP_GUIDE.md
```

### Bước 2: Thêm credentials vào .env
```bash
# Edit file .env
nano backend/.env

# Thêm JSON credentials (trên 1 dòng)
GOOGLE_DRIVE_CREDENTIALS_JSON={"type":"service_account",...}
```

### Bước 3: Restart backend
```bash
# Dev mode
cd backend
bun run dev:backend

# Production
docker-compose restart backend
```

### Bước 4: Kiểm tra
1. Vào: http://localhost:13000/lms/admin/source-documents/new
2. Nút "Google Drive" không còn icon ⚠️
3. Có thể chọn Google Drive và upload file

## Test Cases

### ✅ Test 1: Google Drive chưa cấu hình
**Given:** `GOOGLE_DRIVE_CREDENTIALS_JSON` = empty  
**When:** Vào trang tạo tài liệu mới  
**Then:**
- Nút "Google Drive" hiển thị icon ⚠️
- Nút bị disabled
- Hiển thị thông báo chi tiết với hướng dẫn
- Có link tới docs

### ✅ Test 2: Google Drive đã cấu hình
**Given:** `GOOGLE_DRIVE_CREDENTIALS_JSON` = valid JSON  
**When:** Vào trang tạo tài liệu mới  
**Then:**
- Nút "Google Drive" không có icon ⚠️
- Nút có thể click
- Không hiển thị thông báo lỗi
- Upload file thành công lên Google Drive

### ✅ Test 3: Upload file lên Google Drive
**Given:** Google Drive đã cấu hình  
**When:**
1. Chọn storage type = "Google Drive"
2. Upload file test.pdf
**Then:**
- File được upload lên folder công ty
- File nằm trong sub-folder "PDFs"
- Hiển thị badge "Google Drive" màu xanh
- URL trả về là Google Drive link

## Impact Analysis

### Trước khi fix
- ❌ Không thể sử dụng Google Drive
- ❌ Không biết cách cấu hình
- ❌ Phải đọc source code để tìm hiểu

### Sau khi fix
- ✅ Có hướng dẫn chi tiết bằng tiếng Việt
- ✅ Biết chính xác các bước cần làm
- ✅ UI thân thiện với user, hiển thị thông báo rõ ràng
- ✅ Có troubleshooting cho các lỗi thường gặp

## Related Files

```
backend/
├── .env                                          # ✏️ Thêm GOOGLE_DRIVE_CREDENTIALS_JSON
└── src/
    └── services/
        └── google-drive.service.ts               # 📄 Service xử lý Google Drive

frontend/
└── src/
    └── app/
        └── lms/
            └── admin/
                └── source-documents/
                    └── new/
                        └── page.tsx              # ✏️ Cải thiện UI

docs/
├── GOOGLE_DRIVE_SETUP_GUIDE.md                   # ✅ Mới - Hướng dẫn chi tiết
├── GOOGLE_DRIVE_UPLOAD_FEATURE.md                # 📄 Technical docs (đã có)
└── FIX_GOOGLE_DRIVE_BUG_SUMMARY.md              # 📄 File này
```

## Next Steps (Optional)

### Cải tiến tương lai
1. **Auto-detect credentials:** Tự động kiểm tra .env khi backend khởi động
2. **Admin UI:** Tạo trang admin để cấu hình Google Drive qua UI
3. **Health check:** Endpoint `/health` bao gồm trạng thái Google Drive
4. **Monitoring:** Log số lượng file upload lên Google Drive vs MinIO

### Documentation
- [x] Hướng dẫn setup (Vietnamese)
- [x] Troubleshooting guide
- [ ] Video tutorial (nếu cần)
- [ ] FAQ section

## Liên hệ

Nếu gặp vấn đề khi cấu hình, liên hệ:
- **Developer:** Team Backend/DevOps
- **Documentation:** `docs/GOOGLE_DRIVE_SETUP_GUIDE.md`
- **Technical Reference:** `docs/GOOGLE_DRIVE_UPLOAD_FEATURE.md`

---

**Tóm tắt:** Đã thêm biến môi trường, tạo tài liệu hướng dẫn chi tiết, và cải thiện UI để người dùng biết cách cấu hình Google Drive khi cần sử dụng tính năng upload.
