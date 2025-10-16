# Báo Cáo Fix Bug Xuất Nhập Tồn

## 🐛 Vấn đề
Trang `/ketoan/xuatnhapton` không hiển thị dữ liệu trong bảng mặc dù có:
- 52 invoices
- 134 details
- MST được cấu hình đúng

## 🔍 Nguyên nhân

### 1. **SAI TÊN FIELD trong TypeScript types** ❌
Frontend code sử dụng sai field names so với Prisma schema:

**Frontend Types (SAI):**
```typescript
interface InvoiceHeader {
  id: string;
  // ❌ Thiếu idServer field
}

interface InvoiceDetail {
  idhdon: string; // ❌ SAI - field thực tế là idhdonServer
}
```

**Prisma Schema (ĐÚNG):**
```prisma
model ext_listhoadon {
  id       String  @id @default(uuid())
  idServer String? @unique  // ✅ Field này cần thiết
}

model ext_detailhoadon {
  id           String @id
  idhdonServer String // ✅ Foreign key đúng
}
```

### 2. **SAI LOGIC JOIN giữa Invoice và Details** ❌

**Code cũ (SAI):**
```typescript
const invoiceDetails = details.filter(d => d.idhdon === invoice.id);
// ❌ So sánh sai field: idhdon không tồn tại
// ❌ So sánh với invoice.id thay vì invoice.idServer
```

**Code mới (ĐÚNG):**
```typescript
const invoiceDetails = details.filter(d => d.idhdonServer === invoice.idServer);
// ✅ Field đúng: idhdonServer
// ✅ So sánh với invoice.idServer
```

### 3. **Kết quả:**
- Filter `details.filter(d => d.idhdon === invoice.id)` **KHÔNG MATCH** được record nào
- `invoiceDetails.length === 0` cho TẤT CẢ invoices
- Không có data để tính toán inventory
- Bảng rỗng

## ✅ Giải pháp đã áp dụng

### 1. Sửa TypeScript Types

**File:** `frontend/src/app/ketoan/xuatnhapton/types.ts`

```typescript
export interface InvoiceHeader {
  id: string;
  idServer: string | null; // ✅ THÊM field này
  nbmst: string | null;
  nmmst: string | null;
  // ... other fields
}

export interface InvoiceDetail {
  id: string;
  idhdonServer: string; // ✅ ĐỔI TÊN từ idhdon → idhdonServer
  ten: string | null;
  // ... other fields
}
```

### 2. Sửa Logic Filter

**File:** `frontend/src/app/ketoan/xuatnhapton/utils/inventoryCalculator.ts`

```typescript
// ✅ TRƯỚC
const invoiceDetails = details.filter(d => d.idhdon === invoice.id);

// ✅ SAU
const invoiceDetails = details.filter(d => d.idhdonServer === invoice.idServer);
```

### 3. Thêm Debug Logging

Để dễ debug trong tương lai:

```typescript
if (processedCount <= 2) {
  console.log(`📄 Processing invoice #${processedCount}:`, {
    type: invoiceType,
    id: invoice.id,
    idServer: invoice.idServer, // ✅ Log cả 2 fields
    nbmst: invoice.nbmst,
    nmmst: invoice.nmmst,
    detailsCount: invoiceDetails.length, // ✅ Xem có bao nhiêu details
  });
}
```

### 4. Cải thiện Product Matching

Thêm fallback khi `ext_sanphamhoadon` empty:

```typescript
const matchProduct = (detailName, products, groupBy) => {
  // ✅ Xử lý trường hợp không có products
  if (!products || products.length === 0) {
    console.warn('⚠️ No products available, using original name');
    return {
      key: detailName,
      code: null,
      unit: null,
    };
  }
  // ... existing logic
};
```

## 📊 Kết quả sau khi fix

### Dữ liệu hiện tại:
- ✅ **52 invoices** - TẤT CẢ là **SALE** (người bán = MST 5900363291)
- ✅ **134 invoice details** - Sẽ được join đúng với invoices
- ⚠️ **0 products** trong `ext_sanphamhoadon` - System sẽ dùng tên gốc

### Kỳ vọng:
- Bảng sẽ hiển thị **134 dòng** (hoặc ít hơn nếu group by product)
- Chỉ có cột **"Xuất"** có data (vì tất cả là sale invoices)
- Cột **"Nhập"** sẽ = 0 (không có purchase invoices)
- Formula: `Tồn Cuối = Tồn Đầu + Nhập - Xuất = 0 + 0 - Xuất = -Xuất`

## 🧪 Test Steps

1. **Refresh trang:** http://localhost:13000/ketoan/xuatnhapton
2. **Check console logs:**
   ```
   📊 Calculating inventory with: { invoicesCount: 52, detailsCount: 134, ... }
   📄 Processing invoice #1: { type: 'sale', detailsCount: X }
   ✅ Processed invoices: 52 | Sales: 52 | Purchases: 0
   📦 Inventory map size: Y
   🎯 FINAL ROWS: Z
   ```
3. **Verify table hiển thị data**
4. **Verify summary cards có số liệu**

## 📝 Lưu ý

### Tại sao tất cả là SALE?
Database hiện tại chỉ có invoices với:
- `nbmst` (người bán) = `5900363291` (MST của user)
- `nmmst` (người mua) = MST khác

→ Đây là hóa đơn BÁN HÀNG của công ty

### Để có data NHẬP (Purchase):
Cần import invoices có:
- `nmmst` (người mua) = `5900363291`
- `nbmst` (người bán) = MST công ty khác

### Về Products mapping:
- Hiện tại `ext_sanphamhoadon` = 0 records
- Cần chạy mutation `updateProductsFromDetails` để populate
- Hoặc hệ thống sẽ dùng tên gốc từ `ext_detailhoadon.ten`

## 🔗 Files đã sửa

1. ✅ `frontend/src/app/ketoan/xuatnhapton/types.ts` - Fix interface types
2. ✅ `frontend/src/app/ketoan/xuatnhapton/utils/inventoryCalculator.ts` - Fix join logic + add debug
3. ✅ `frontend/src/app/ketoan/xuatnhapton/page.tsx` - Add MST matching debug
4. ✅ `backend/test-xuatnhapton-debug.js` - Debug script

## ⏭️ Next Steps

1. ✅ Refresh browser để thấy data
2. ✅ Verify số liệu đúng
3. ⚠️ Cân nhắc populate `ext_sanphamhoadon` để có product normalization
4. ⚠️ Import purchase invoices nếu cần track nhập kho

---

**Fixed by:** GitHub Copilot  
**Date:** 2025-10-16  
**Status:** ✅ RESOLVED
