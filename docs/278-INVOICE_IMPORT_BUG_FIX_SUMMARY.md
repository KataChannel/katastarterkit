# ✅ Bug Fix Summary: Invoice Import API 404 Error

## 🐛 Vấn Đề
Frontend gọi API import hóa đơn bị lỗi 404:
```
Request URL: http://localhost:13000/api/invoice-import/template
Status: 404 Not Found
```

## ✅ Đã Giải Quyết

### 1. Tạo API Configuration Helper
**File mới:** `/frontend/src/lib/api-config.ts`

Helper này:
- ✅ Đồng bộ base URL với GraphQL endpoint
- ✅ Sử dụng đúng token key (`accessToken` thay vì `token`)
- ✅ Cung cấp `apiFetch()` wrapper cho REST API
- ✅ Tái sử dụng được trong toàn bộ project

```typescript
import { apiFetch } from '@/lib/api-config';

// Tự động xử lý base URL và authentication
const response = await apiFetch('/api/invoice-import/template');
```

### 2. Refactor InvoiceImportModal
**File cập nhật:** `/frontend/src/components/InvoiceImportModal.tsx`

Đã đơn giản hóa tất cả API calls:
```typescript
// Trước ❌
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:14000';
const token = localStorage.getItem('token');
fetch(`${API_URL}/api/endpoint`, { headers: {...} })

// Sau ✅
import { apiFetch } from '@/lib/api-config';
apiFetch('/api/endpoint')
```

### 3. Đồng Bộ Configuration

| Component | Base URL | Token Key | Status |
|-----------|----------|-----------|--------|
| Apollo Client | `NEXT_PUBLIC_GRAPHQL_ENDPOINT` | `accessToken` | ✅ |
| api-config | từ GraphQL endpoint | `accessToken` | ✅ |
| InvoiceImportModal | sử dụng api-config | auto | ✅ |

## 🧪 Test Ngay

### Method 1: Test trong Browser

1. **Hard refresh** trang (Ctrl+Shift+R hoặc Cmd+Shift+R)
2. Vào `/ketoan/listhoadon`
3. Click "Import Excel"
4. Click "Tải file mẫu"
5. **Kết quả**: File Excel tải về thành công ✅

### Method 2: Test với DevTools

1. Mở DevTools (F12)
2. Tab Network
3. Click "Tải file mẫu"
4. Kiểm tra request:
   ```
   URL: http://localhost:14000/api/invoice-import/template ✅
   Status: 200 OK ✅
   Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet ✅
   ```

### Method 3: Test với Script

```bash
chmod +x test-invoice-import-api.sh
./test-invoice-import-api.sh
```

## 📁 Files Changed

### Created
- ✅ `/frontend/src/lib/api-config.ts` - API helper
- ✅ `/docs/INVOICE_IMPORT_API_CONFIG_FIX.md` - Chi tiết
- ✅ `/test-invoice-import-api.sh` - Test script

### Modified
- ✅ `/frontend/src/components/InvoiceImportModal.tsx` - Dùng api-config
- ✅ `/backend/src/graphql/graphql.module.ts` - Thêm MulterModule

## 🔧 Configuration

### Environment Variables

**Backend** (`.env.local`):
```bash
PORT=14000  ✅
```

**Frontend** (`.env.local`):
```bash
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:14000/graphql  ✅
```

### Không Cần Thêm Variable Mới
API helper tự động lấy base URL từ `NEXT_PUBLIC_GRAPHQL_ENDPOINT`:
```typescript
// Tự động: http://localhost:14000/graphql → http://localhost:14000
const baseUrl = graphqlEndpoint.replace('/graphql', '');
```

## 🎯 Lợi Ích

### Code Quality
- ✅ **DRY**: Không lặp lại code
- ✅ **Type-safe**: Full TypeScript support
- ✅ **Maintainable**: 1 nơi thay đổi, áp dụng toàn bộ
- ✅ **Testable**: Dễ mock cho unit tests

### Developer Experience
- ✅ **Đơn giản**: 1 dòng thay vì 5-10 dòng
- ✅ **Nhất quán**: Cùng pattern cho tất cả REST APIs
- ✅ **An toàn**: Không sợ sai token key

### Production Ready
- ✅ **Environment-aware**: Tự động dùng đúng URL theo env
- ✅ **Error handling**: Built-in error handling
- ✅ **Security**: Token auto từ localStorage

## 🚀 Sử Dụng Tiếp

### Trong Components Khác

```typescript
import { apiFetch, getApiBaseUrl } from '@/lib/api-config';

// GET request
const data = await apiFetch('/api/endpoint').then(r => r.json());

// POST with JSON
const result = await apiFetch('/api/endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ data }),
}).then(r => r.json());

// Upload file
const formData = new FormData();
formData.append('file', file);
await apiFetch('/api/upload', {
  method: 'POST',
  body: formData,
});
```

## 📝 Checklist

- [x] Tạo api-config helper
- [x] Refactor InvoiceImportModal
- [x] Test download template
- [x] Test upload file
- [x] Test preview
- [x] Viết documentation
- [x] Tạo test script
- [x] Verify no compile errors

## 🎉 Status

**BUG FIXED** ✅

Tất cả API endpoints đều hoạt động:
- ✅ Download template: `GET /api/invoice-import/template`
- ✅ Preview file: `POST /api/invoice-import/preview`
- ✅ Upload & import: `POST /api/invoice-import/upload`

---

**Date:** 18/10/2025  
**Files Changed:** 5  
**Status:** Production Ready ✅
