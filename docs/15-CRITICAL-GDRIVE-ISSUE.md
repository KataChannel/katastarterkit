# 🔴 CRITICAL: Service Account Không Thể Truy Cập Google Drive

## Vấn đề
Service Account không thể truy cập BẤT KỲ folder nào (cả folder cũ và folder mới).
Tất cả đều trả về lỗi **404 Not Found**.

## Các Folder đã test
1. `1JR8q5xZ8vCWJgDEXMdEjwYinte4IXPE4` - ❌ 404
2. `1kSEvP8QlhhZoOjtemtLuKA_LkuWr2OTG` - ❌ 404  
3. `144zsBmWFnntwGD7BY8v8yO7C5_6_sVAE` - ❌ 404

## Nguyên nhân khả năng cao

### 1. Drive API chưa được enable
Service Account project `tazagroup-480011` có thể chưa enable **Google Drive API**.

**Cách kiểm tra:**
1. Vào: https://console.cloud.google.com/apis/dashboard?project=tazagroup-480011
2. Tìm "Google Drive API" trong danh sách
3. Nếu chưa enabled → Click "Enable API"

### 2. Service Account scope không đúng
Scope hiện tại: `https://www.googleapis.com/auth/drive.file`

Scope này chỉ cho phép truy cập files **do chính service account tạo ra**.

**Cần đổi sang scope:** `https://www.googleapis.com/auth/drive`

### 3. Organization Policy
Nếu tazagroup-480011 là Google Workspace Organization, có thể có policy chặn external API access.

## Giải pháp

### Bước 1: Enable Google Drive API

```bash
# Vào Google Cloud Console
https://console.cloud.google.com/apis/library/drive.googleapis.com?project=tazagroup-480011
```

Click "**ENABLE**"

### Bước 2: Cập nhật Scope trong Code

File: `backend/src/services/google-drive.service.ts`

Đổi từ:
```typescript
scopes: ['https://www.googleapis.com/auth/drive.file'],
```

Thành:
```typescript
scopes: ['https://www.googleapis.com/auth/drive'],
```

### Bước 3: Kiểm tra Service Account Keys

Vào:
```
https://console.cloud.google.com/iam-admin/serviceaccounts?project=tazagroup-480011
```

Tìm Service Account:
```
app-taza-group-drive-tazagroup@tazagroup-480011.iam.gserviceaccount.com
```

Kiểm tra:
- Status: **Enabled** ✅
- Keys: Có ít nhất 1 key active
- Key ID trong .env phải khớp với key trong console

### Bước 4: Tạo Key Mới (nếu cần)

1. Click vào Service Account
2. Tab "Keys"
3. "Add Key" → "Create new key"
4. Chọn JSON
5. Download file JSON
6. Copy toàn bộ nội dung JSON vào `GOOGLE_DRIVE_CREDENTIALS_JSON` trong `.env`

## Test Nhanh

Sau khi làm các bước trên, chạy:

```bash
cd /chikiet/kataoffical/shoprausach/backend
node test-google-drive-direct.js
```

## Alternative: Sử dụng OAuth2 User Account

Nếu Service Account không hoạt động do organization restrictions, có thể dùng OAuth2 với user account thực.

Cần:
1. Google OAuth2 Client ID
2. User authorization flow
3. Refresh token

---

**Next Steps:**
1. Check Google Cloud Console - Enable Drive API
2. Update scope to `drive` instead of `drive.file`  
3. Test lại
4. Nếu vẫn không được → Tạo service account key mới
