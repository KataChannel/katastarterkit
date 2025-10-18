# 🔧 Invoice Import API Configuration - GraphQL Project

## 🎯 Vấn Đề Đã Giải Quyết

### Lỗi 404 Khi Download Template
```
Request URL: http://localhost:13000/api/invoice-import/template
Status Code: 404 Not Found
```

### Nguyên Nhân
1. **Sai Port**: Frontend gọi port 13000 thay vì 14000
2. **Token Key Sai**: Dùng `token` thay vì `accessToken` (không đồng bộ với Apollo Client)
3. **Hardcoded URLs**: Không sử dụng env variable đúng cách
4. **Không đồng bộ**: REST API không sync với GraphQL endpoint configuration

## ✅ Giải Pháp Hoàn Chỉnh

### 1. API Configuration Helper
**File mới**: `/frontend/src/lib/api-config.ts`

Tạo helper module để:
- ✅ Lấy base URL từ GraphQL endpoint
- ✅ Đồng bộ authentication token với Apollo Client
- ✅ Cung cấp `apiFetch()` wrapper cho REST API calls
- ✅ Tái sử dụng được ở mọi nơi trong project

```typescript
import { apiFetch } from '@/lib/api-config';

// Tự động sử dụng đúng base URL và token
const response = await apiFetch('/api/invoice-import/template', {
  method: 'GET',
});
```

### 2. Refactor InvoiceImportModal
**File updated**: `/frontend/src/components/InvoiceImportModal.tsx`

**Before ❌:**
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:14000';
const token = localStorage.getItem('token'); // SAI KEY!
const response = await fetch(`${API_URL}/api/invoice-import/template`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

**After ✅:**
```typescript
import { apiFetch } from '@/lib/api-config';

const response = await apiFetch('/api/invoice-import/template', {
  method: 'GET',
});
// Tự động: base URL từ GRAPHQL_ENDPOINT, token từ 'accessToken'
```

### 3. Đồng Bộ Configuration

#### Apollo Client (`apollo-client.ts`)
```typescript
// GraphQL endpoint
uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:14000/graphql'

// Token key
const token = localStorage.getItem('accessToken'); ✅
```

#### API Helper (`api-config.ts`)
```typescript
// Base URL từ GraphQL endpoint
const graphqlEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:14000/graphql';
const baseUrl = graphqlEndpoint.replace('/graphql', ''); // http://localhost:14000

// Token key giống Apollo
const token = localStorage.getItem('accessToken'); ✅
```

## 📁 Files Changed

### Created (1 file)
1. ✅ `/frontend/src/lib/api-config.ts` - API configuration helper

### Modified (1 file)
1. ✅ `/frontend/src/components/InvoiceImportModal.tsx` - Sử dụng api-config helper

## 🔑 Key Features của api-config.ts

### 1. getApiBaseUrl()
Lấy base URL từ GraphQL endpoint:
```typescript
const baseUrl = getApiBaseUrl(); 
// → http://localhost:14000
```

### 2. getAuthToken()
Lấy token đúng key:
```typescript
const token = getAuthToken();
// → localStorage.getItem('accessToken')
```

### 3. getAuthHeaders()
Tạo headers cho authentication:
```typescript
const headers = getAuthHeaders();
// → { 'Authorization': 'Bearer xxx' } hoặc {}
```

### 4. apiFetch()
Wrapper cho fetch với auth tự động:
```typescript
const response = await apiFetch('/api/endpoint', {
  method: 'POST',
  body: formData,
});
```

## 🚀 Usage trong Project

### Import và Sử Dụng
```typescript
import { apiFetch, getApiBaseUrl, getAuthHeaders } from '@/lib/api-config';

// Option 1: Dùng apiFetch (khuyến nghị)
const response = await apiFetch('/api/invoice-import/template');

// Option 2: Manual fetch với helper
const baseUrl = getApiBaseUrl();
const headers = getAuthHeaders();
const response = await fetch(`${baseUrl}/api/endpoint`, { headers });
```

### Trong Components
```typescript
import { apiFetch } from '@/lib/api-config';

const MyComponent = () => {
  const handleDownload = async () => {
    try {
      const response = await apiFetch('/api/download', {
        method: 'GET',
      });
      const blob = await response.blob();
      // ... handle download
    } catch (error) {
      console.error('Download failed:', error);
    }
  };
};
```

### Upload Files
```typescript
const formData = new FormData();
formData.append('file', file);

const response = await apiFetch('/api/upload', {
  method: 'POST',
  body: formData,
  // Không cần set Content-Type, browser tự động handle
});
```

## 🎨 Configuration trong Project

### Environment Variables

#### Development (`.env.local`)
```bash
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:14000/graphql
```

#### Production (`.env.production`)
```bash
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.yourdomain.com/graphql
```

### Backend Configuration

Backend đang chạy trên port **14000**:
```bash
# backend/.env.local
PORT=14000
```

REST Controller:
```typescript
@Controller('api/invoice-import')
export class InvoiceImportController {
  @Get('template') // → http://localhost:14000/api/invoice-import/template
  @Post('upload')  // → http://localhost:14000/api/invoice-import/upload
  @Post('preview') // → http://localhost:14000/api/invoice-import/preview
}
```

## 🧪 Testing

### Test API Helper
```typescript
// Test trong browser console
import { getApiBaseUrl, getAuthToken, apiFetch } from '@/lib/api-config';

console.log('Base URL:', getApiBaseUrl());
// → http://localhost:14000

console.log('Token:', getAuthToken());
// → eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Test fetch
apiFetch('/api/invoice-import/template')
  .then(r => console.log('Success:', r.status))
  .catch(e => console.error('Error:', e));
```

### Test Download Template
```bash
# Manual test với curl
TOKEN=$(cat <<< your-token-here)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:14000/api/invoice-import/template \
  -o test.xlsx

# Kiểm tra file
file test.xlsx
# → test.xlsx: Microsoft Excel 2007+
```

### Test từ Frontend
1. Open DevTools (F12)
2. Go to Network tab
3. Click "Import Excel" → "Tải file mẫu"
4. Check request:
   ```
   Request URL: http://localhost:14000/api/invoice-import/template ✅
   Status: 200 OK ✅
   Response: binary (Excel file) ✅
   ```

## 📊 Benefits

### Trước Khi Refactor ❌
```typescript
// Trong mỗi component phải lặp lại:
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:14000';
const token = localStorage.getItem('token'); // WRONG KEY!
const response = await fetch(`${API_URL}/api/endpoint`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

**Vấn đề:**
- 🔴 Code duplication
- 🔴 Token key không đồng bộ
- 🔴 Khó maintain
- 🔴 Dễ sai khi thêm endpoints mới

### Sau Khi Refactor ✅
```typescript
// Chỉ 1 dòng:
const response = await apiFetch('/api/endpoint');
```

**Lợi ích:**
- ✅ DRY (Don't Repeat Yourself)
- ✅ Token đồng bộ với Apollo
- ✅ Dễ maintain
- ✅ Type-safe (TypeScript)
- ✅ Có thể mock dễ dàng cho testing

## 🔐 Security Notes

### Token Storage
Token được lưu trong `localStorage` với key `accessToken`:
```typescript
// Login
localStorage.setItem('accessToken', token);

// Auto-used by:
// - Apollo Client (GraphQL)
// - api-config (REST API)
```

### CORS Configuration
Backend đã config CORS cho frontend:
```typescript
// backend/src/main.ts
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
```

## 🎯 Best Practices

### 1. Luôn Dùng apiFetch
```typescript
// ✅ Good
import { apiFetch } from '@/lib/api-config';
const response = await apiFetch('/api/endpoint');

// ❌ Bad
const response = await fetch('http://localhost:14000/api/endpoint');
```

### 2. Không Hardcode URLs
```typescript
// ✅ Good
const baseUrl = getApiBaseUrl();

// ❌ Bad
const baseUrl = 'http://localhost:14000';
```

### 3. Error Handling
```typescript
try {
  const response = await apiFetch('/api/endpoint');
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  const data = await response.json();
} catch (error) {
  console.error('API call failed:', error);
  toast.error('Có lỗi xảy ra');
}
```

## 📝 Migration Guide

### Migrate Existing Code

**Before:**
```typescript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:14000/api/endpoint', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

**After:**
```typescript
import { apiFetch } from '@/lib/api-config';
const response = await apiFetch('/api/endpoint');
```

### Add New REST Endpoints

1. Tạo endpoint ở backend:
```typescript
@Controller('api/my-feature')
export class MyFeatureController {
  @Get('data')
  getData() { ... }
}
```

2. Call từ frontend:
```typescript
import { apiFetch } from '@/lib/api-config';

const response = await apiFetch('/api/my-feature/data');
const data = await response.json();
```

## 🎉 Summary

### What Changed
1. ✅ Created `api-config.ts` helper
2. ✅ Refactored `InvoiceImportModal.tsx`
3. ✅ Fixed port mismatch (13000 → 14000)
4. ✅ Fixed token key (`token` → `accessToken`)
5. ✅ Synchronized with Apollo Client config

### Result
- ✅ Download template works
- ✅ Upload works
- ✅ Preview works
- ✅ All APIs use correct base URL
- ✅ Token authentication consistent
- ✅ Code is DRY and maintainable

### Next Steps
- 🔄 Migrate other REST API calls to use `apiFetch`
- 📝 Add unit tests for api-config
- 🔒 Consider adding request interceptors
- 📊 Add request/response logging in dev mode

---

**Status:** ✅ FIXED & ENHANCED  
**Date:** 18/10/2025  
**Files Created:** 1  
**Files Modified:** 1  
**Code Quality:** Production Ready
