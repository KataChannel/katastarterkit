# 🔧 Bug Fix: Missing Brandname in Database Sync

## 🎯 Vấn đề

Khi đồng bộ hóa đơn từ API bên ngoài vào database qua endpoint `/api/invoices/sync`, field **`brandname`** không được lưu vào database mặc dù có trong dữ liệu từ API.

### Triệu chứng
```typescript
// Data from External API
{
  id: "123",
  nbmst: "0123456789",
  brandname: "VINAMILK",  // ✅ Có trong API response
  ...
}

// After sync to database
{
  idServer: "123",
  nbmst: "0123456789",
  brandname: null,  // ❌ Bị mất khi lưu vào DB
  ...
}
```

---

## 🔍 Root Cause

Trong file `/backend/src/controllers/invoice.controller.ts`, endpoint `POST /api/invoices/sync` convert dữ liệu từ API sang `CreateInvoiceInput` format, nhưng **THIẾU mapping cho field `brandname`**.

### Code bị lỗi
```typescript
// invoice.controller.ts - syncInvoices method
const convertedInvoices: CreateInvoiceInput[] = invoiceData.map(invoice => ({
  idServer: invoice.id,
  nbmst: invoice.nbmst,
  khmshdon: invoice.khmshdon,
  // ... 80+ other fields ...
  shddauky: invoice.shddauky,
  shdkmdauky: invoice.shdkmdauky,
  nmsdt: invoice.nmsdt,
  // ❌ MISSING: brandname: invoice.brandname
  // Add other fields as needed from the external API
}));
```

---

## ✅ Giải pháp

Thêm mapping cho field `brandname` trong quá trình convert invoice data.

### File Changed
**`/backend/src/controllers/invoice.controller.ts`**

### Code sau khi fix
```typescript
// invoice.controller.ts - syncInvoices method
const convertedInvoices: CreateInvoiceInput[] = invoiceData.map(invoice => ({
  idServer: invoice.id,
  nbmst: invoice.nbmst,
  khmshdon: invoice.khmshdon,
  // ... 80+ other fields ...
  shddauky: invoice.shddauky,
  shdkmdauky: invoice.shdkmdauky,
  nmsdt: invoice.nmsdt,
  brandname: invoice.brandname,  // ✅ FIXED: Map brandname from API
  // Add other fields as needed from the external API
}));
```

---

## 🔄 Brandname Injection Flow

Hệ thống có **2 nguồn brandname**:

### 1. From API Data (Priority 1)
```typescript
// Controller maps brandname from external API
brandname: invoice.brandname  // e.g., "VINAMILK"
```

### 2. From Environment Config (Priority 2 - Fallback)
```typescript
// Service injects brandname from .env if not provided
if (config.brandname) {
  input.invoices = input.invoices.map(invoice => ({
    ...invoice,
    brandname: invoice.brandname || config.brandname  // Fallback to config
  }));
}
```

### Priority Logic
```
1. Use invoice.brandname from API (if exists)
2. Else use INVOICE_BRANDNAME from .env (if configured)
3. Else null
```

---

## 📊 Before vs After

### BEFORE (Bug)
```typescript
// Controller conversion
{
  idServer: "HD001",
  nbmst: "0123456789",
  shdon: "001",
  // ... other fields ...
  // ❌ brandname: NOT MAPPED
}
↓
// Service injection (config.brandname = "DEFAULT_BRAND")
{
  idServer: "HD001",
  brandname: "DEFAULT_BRAND"  // ⚠️ Uses fallback even if API had data
}
↓
// Database
ext_listhoadon {
  id_server: "HD001",
  brandname: "DEFAULT_BRAND"  // ❌ Wrong! Should be from API
}
```

### AFTER (Fixed)
```typescript
// Controller conversion
{
  idServer: "HD001",
  nbmst: "0123456789",
  shdon: "001",
  // ... other fields ...
  brandname: "VINAMILK"  // ✅ Mapped from API
}
↓
// Service injection (config.brandname = "DEFAULT_BRAND")
{
  idServer: "HD001",
  brandname: "VINAMILK"  // ✅ Keeps API value (priority 1)
}
↓
// Database
ext_listhoadon {
  id_server: "HD001",
  brandname: "VINAMILK"  // ✅ Correct! From API data
}
```

---

## 🧪 Testing

### Test Case 1: Brandname in API Data
```bash
# Request
POST /api/invoices/sync
{
  "invoiceData": [{
    "id": "HD001",
    "nbmst": "0123456789",
    "brandname": "VINAMILK",
    ...
  }],
  "bearerToken": "xxx"
}

# Expected Database Result
ext_listhoadon {
  id_server: "HD001",
  brandname: "VINAMILK"  # ✅ From API
}
```

### Test Case 2: No Brandname in API, Has Config
```bash
# .env
INVOICE_BRANDNAME=DEFAULT_BRAND

# Request
POST /api/invoices/sync
{
  "invoiceData": [{
    "id": "HD001",
    "nbmst": "0123456789",
    // No brandname field
    ...
  }]
}

# Expected Database Result
ext_listhoadon {
  id_server: "HD001",
  brandname: "DEFAULT_BRAND"  # ✅ From config fallback
}
```

### Test Case 3: No Brandname Anywhere
```bash
# .env
# INVOICE_BRANDNAME not set

# Request
POST /api/invoices/sync
{
  "invoiceData": [{
    "id": "HD001",
    "nbmst": "0123456789",
    // No brandname field
    ...
  }]
}

# Expected Database Result
ext_listhoadon {
  id_server: "HD001",
  brandname: null  # ✅ NULL (no source)
}
```

---

## 🔍 Verification Query

Kiểm tra brandname trong database:

```sql
-- Check all invoices with brandname
SELECT 
  id_server,
  nbmst,
  shdon,
  brandname,
  created_at
FROM ext_listhoadon
WHERE brandname IS NOT NULL
ORDER BY created_at DESC
LIMIT 20;

-- Count by brandname
SELECT 
  brandname,
  COUNT(*) as invoice_count
FROM ext_listhoadon
GROUP BY brandname
ORDER BY invoice_count DESC;

-- Check specific invoice
SELECT 
  id_server,
  nbmst,
  shdon,
  brandname
FROM ext_listhoadon
WHERE id_server = 'HD001';
```

---

## 📁 Files Modified

```
✅ backend/src/controllers/invoice.controller.ts
   - Added brandname mapping in syncInvoices endpoint
   - Line ~282: brandname: invoice.brandname
```

**Related Files** (No changes needed):
- `backend/src/services/invoice.service.ts` - Already has brandname injection logic
- `backend/src/services/backend-config.service.ts` - Already has brandname config
- `backend/src/graphql/inputs/invoice.input.ts` - Already has brandname field
- `backend/prisma/schema.prisma` - Already has brandname column

---

## ✅ Checklist

- [x] Added brandname mapping in controller
- [x] Tested with API data containing brandname
- [x] Tested fallback to environment config
- [x] Verified database insertion
- [x] No TypeScript errors
- [x] Documentation created

---

## 🎯 Impact

### Before Fix
- ❌ Brandname from API ignored
- ⚠️ Always uses config fallback (if set)
- ⚠️ NULL brandname if no config
- 📊 Data loss: ~100% of API brandname values

### After Fix
- ✅ Brandname from API preserved
- ✅ Config fallback works correctly
- ✅ Proper priority: API → Config → NULL
- 📊 Data accuracy: 100% retention

---

## 🚀 Deployment

### Backend
```bash
cd backend
bun install  # If needed
# No build needed for runtime fix
bun dev      # Restart backend
```

### Verification
```bash
# 1. Sync some invoices
curl -X POST http://localhost:14000/api/invoices/sync \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "invoiceData": [{
      "id": "TEST001",
      "nbmst": "0123456789",
      "brandname": "TEST_BRAND",
      "shdon": "001",
      "khmshdon": "1C22TSS",
      ...
    }]
  }'

# 2. Check database
psql -d your_database -c "SELECT id_server, brandname FROM ext_listhoadon WHERE id_server = 'TEST001';"

# Expected: brandname = 'TEST_BRAND'
```

---

## 📝 Notes

### Why This Bug Occurred
1. Controller has 80+ fields to map from API
2. `brandname` was added later to schema
3. Controller mapping wasn't updated
4. Service fallback masked the issue (used config value)

### Prevention
1. ✅ Use TypeScript strict mode for better type checking
2. ✅ Add unit tests for controller data mapping
3. ✅ Document all required/optional fields
4. ✅ Review schema changes against controller mappings

---

## 🔗 Related Documentation

- [INVOICE_SYNC_429_FIXES.md](./INVOICE_SYNC_429_FIXES.md) - Rate limiting fixes
- [COMPLETE_SYNC_PROGRESS_SUMMARY.md](./COMPLETE_SYNC_PROGRESS_SUMMARY.md) - Sync progress display
- [Backend Config Service](./backend/src/services/backend-config.service.ts) - Brandname configuration

---

**Version**: 1.0.1  
**Date**: 3 tháng 10, 2025  
**Status**: ✅ Fixed & Verified  
**Severity**: Medium (Data loss but had fallback)  
**Impact**: All sync operations via REST API

🎉 **Bug fixed! Brandname now properly saved to database!** 🎉
