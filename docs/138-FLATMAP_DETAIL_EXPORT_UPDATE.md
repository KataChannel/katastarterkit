# ✅ CẬP NHẬT - Xuất Excel FlatMap theo Chi Tiết Mặt Hàng

## 📋 Tổng Quan

Đã cập nhật code `handleFrontendExportExcel` để **flatMap theo details** - mỗi dòng trong Excel là 1 mặt hàng của hóa đơn thay vì 1 hóa đơn.

---

## 🔄 Thay Đổi Chính

### ❌ TRƯỚC (Invoice-based Export)
```
Mỗi hóa đơn = 1 dòng trong Excel
50 hóa đơn → 50 dòng

Dòng 1: HĐ AA/001 | Công ty A | 50tr | ... (21 cột thông tin HĐ)
Dòng 2: HĐ AA/002 | Công ty B | 25tr | ...
```

### ✅ SAU (Detail-based FlatMap Export)
```
Mỗi mặt hàng = 1 dòng trong Excel
50 hóa đơn × 3 mặt hàng/HĐ = 150 dòng

Dòng 1: HĐ AA/001 | Công ty A | 50tr | ... | 1 | Laptop Dell | Cái | 2 | 25tr | 50tr | 10% | 5tr
Dòng 2: HĐ AA/001 | Công ty A | 50tr | ... | 2 | Chuột      | Cái | 5 | 2tr  | 10tr | 10% | 1tr
Dòng 3: HĐ AA/001 | Công ty A | 50tr | ... | 3 | Bàn phím   | Cái | 3 | 3tr  | 9tr  | 10% | 900k
Dòng 4: HĐ AA/002 | Công ty B | 25tr | ... | 1 | Màn hình   | Cái | 1 | 15tr | 15tr | 10% | 1.5tr
```

**Lợi ích**:
- ✅ Thấy chi tiết từng mặt hàng trong 1 file duy nhất
- ✅ Dễ phân tích, lọc, pivot theo sản phẩm
- ✅ Phù hợp với yêu cầu kế toán chi tiết

---

## 📝 Files Modified

### 1. `/frontend/src/app/ketoan/listhoadon/page.tsx`

**Thay đổi chính**:

```typescript
// ❌ OLD: Sync function, simple mapping
const handleFrontendExportExcel = () => {
  const exportData: InvoiceExportData[] = invoices.map(inv => ({
    nbmst: inv.nbmst,
    shdon: inv.shdon,
    // ... only invoice fields (21 columns)
  }));
  setShowExcelPreview(true);
};

// ✅ NEW: Async function, flatMap by details
const handleFrontendExportExcel = async () => {
  toast.loading('🔄 Đang chuẩn bị dữ liệu chi tiết...', { id: 'export-prep' });
  
  const exportData: InvoiceExportData[] = [];
  
  // Fetch details for each invoice
  for (const inv of invoices) {
    let details: any[] = [];
    
    if (inv.id) {
      try {
        const response = await fetch(`/api/invoices/${inv.id}`);
        if (response.ok) {
          const fullInvoice = await response.json();
          details = fullInvoice.details || [];
        }
      } catch (err) {
        console.warn(`⚠️ Could not fetch details for invoice ${inv.shdon}:`, err);
      }
    }
    
    const baseInvoiceData = {
      nbmst: inv.nbmst,
      shdon: inv.shdon,
      // ... all invoice fields (21 columns)
    };
    
    // FlatMap: Create one row per detail item
    if (details && details.length > 0) {
      details.forEach((detail, idx) => {
        exportData.push({
          ...baseInvoiceData,
          // Add detail fields
          stt: detail.stt || (idx + 1),
          ten: detail.ten || '',
          dvtinh: detail.dvtinh || '',
          sluong: detail.sluong || 0,
          dgia: detail.dgia || 0,
          thtien: detail.thtien || 0,
          tsuat: detail.tsuat || 0,
          tthue: detail.tthue || 0,
        });
      });
    } else {
      // If no details, add one row with just invoice data
      exportData.push(baseInvoiceData);
    }
  }
  
  toast.success(`✅ Đã chuẩn bị ${exportData.length} dòng dữ liệu`, { id: 'export-prep' });
  setShowExcelPreview(true);
};
```

**Key Changes**:
1. ✅ Changed to `async` function
2. ✅ Fetch details via API: `GET /api/invoices/:id`
3. ✅ FlatMap logic: Each detail → separate row
4. ✅ If no details → 1 row with invoice info only
5. ✅ Toast notifications for progress

---

### 2. `/frontend/src/services/frontendExcelExport.ts`

**Interface Update**:

```typescript
// ❌ OLD: Only invoice fields
export interface InvoiceExportData {
  nbmst?: string;
  shdon?: string;
  // ... 21 invoice fields
}

// ✅ NEW: Invoice + Detail fields
export interface InvoiceExportData {
  // Invoice header fields (21 fields)
  nbmst?: string;
  khmshdon?: string;
  shdon?: string;
  // ... all invoice fields
  
  // Detail item fields (8 new fields)
  stt?: number;        // STT mặt hàng
  ten?: string;        // Tên hàng hóa
  dvtinh?: string;     // Đơn vị tính
  sluong?: number;     // Số lượng
  dgia?: number;       // Đơn giá
  thtien?: number;     // Thành tiền
  tsuat?: number;      // Thuế suất
  tthue?: number;      // Tiền thuế
}
```

**Headers Update**:

```typescript
// ❌ OLD: 21 columns (invoice only)
private static getHeaders(): string[] {
  return [
    'STT', 'MST Người bán', 'Ký hiệu mẫu', 'Số HĐ',
    // ... 17 more invoice columns
  ];
}

// ✅ NEW: 29 columns (invoice + details)
private static getHeaders(): string[] {
  return [
    'STT', 'MST Người bán', 'Ký hiệu mẫu', 'Số HĐ',
    // ... 17 invoice columns
    
    // Detail columns (8 new)
    'STT MH', 'Tên hàng hóa', 'Đơn vị tính', 'Số lượng',
    'Đơn giá', 'Thành tiền', 'Thuế suất (%)', 'Tiền thuế MH'
  ];
}
```

**Row Mapping Update**:

```typescript
// ❌ OLD: 21 cells per row
private static invoiceToRow(invoice: InvoiceExportData, index: number): any[] {
  return [
    index + 1,
    invoice.nbmst || '',
    invoice.shdon || '',
    // ... 18 more invoice fields
  ];
}

// ✅ NEW: 29 cells per row (invoice + detail)
private static invoiceToRow(invoice: InvoiceExportData, index: number): any[] {
  return [
    index + 1,
    invoice.nbmst || '',
    invoice.shdon || '',
    // ... 18 invoice fields
    
    // Detail fields (8 new)
    invoice.stt || '',
    invoice.ten || '',
    invoice.dvtinh || '',
    invoice.sluong || '',
    this.formatCurrency(invoice.dgia),
    this.formatCurrency(invoice.thtien),
    invoice.tsuat || '',
    this.formatCurrency(invoice.tthue)
  ];
}
```

---

## 🎯 User Flow

### Step-by-Step Experience

```
1. User click "Xuất với Xem trước" (50 HĐ)
   ↓
2. Toast: "🔄 Đang chuẩn bị dữ liệu chi tiết..."
   ↓
3. Background: Fetch details cho từng HĐ
   - For each invoice (50 requests)
   - GET /api/invoices/1 → { details: [{...}, {...}, {...}] }
   - GET /api/invoices/2 → { details: [{...}, {...}] }
   - ... (50 parallel/sequential requests)
   ↓
4. FlatMap: Create rows
   - HĐ 1 có 3 details → 3 rows
   - HĐ 2 có 2 details → 2 rows
   - HĐ 3 không có details → 1 row (invoice only)
   - ... Total: 150+ rows
   ↓
5. Toast: "✅ Đã chuẩn bị 150 dòng dữ liệu"
   ↓
6. Preview Dialog mở
   ┌──────────────────────────────────────────────────────┐
   │ Xem trước Hóa đơn                            [X]    │
   ├──────────────────────────────────────────────────────┤
   │ 📊 150 dòng (từ 50 hóa đơn)                         │
   │ 💰 Tổng tiền: 5,200,000,000đ                        │
   ├──────────────────────────────────────────────────────┤
   │ [Table with 29 columns]                              │
   │ ┌────┬─────────┬──────┬─────┬─────┬─────┬──────┬──┐│
   │ │STT │MST NB   │Số HĐ │... │STT MH│Tên  │ĐVT  │SL││
   │ ├────┼─────────┼──────┼─────┼─────┼─────┼──────┼──┤│
   │ │1   │0123...  │AA/001│... │1    │Laptop│Cái  │2 ││
   │ │2   │0123...  │AA/001│... │2    │Chuột │Cái  │5 ││
   │ │3   │0123...  │AA/001│... │3    │Bàn phím│Cái│3││
   │ │4   │0456...  │AA/002│... │1    │Màn hình│Cái│1││
   │ │... (Showing 10 rows, 150 total)                  ││
   │ └────┴─────────┴──────┴─────┴─────┴─────┴──────┴──┘│
   ├──────────────────────────────────────────────────────┤
   │              [Hủy]  [Xuất Excel (150 dòng)]         │
   └──────────────────────────────────────────────────────┘
   ↓
7. User click "Xuất Excel"
   ↓
8. File downloads
   - File: hoa-don-2024-10-10.xlsx
   - Sheet: "Danh sách hóa đơn"
   - Rows: 151 (1 header + 150 data)
   - Columns: 29 (21 invoice + 8 detail)
   ↓
9. Toast success: "Xuất thành công!"
```

---

## 📊 Excel Output Structure

### Column Layout (29 columns)

| # | Column Name | Source | Type | Example |
|---|-------------|--------|------|---------|
| **INVOICE COLUMNS (1-21)** |
| 1 | STT | Auto | Number | 1 |
| 2 | MST Người bán | Invoice | String | 0123456789 |
| 3 | Ký hiệu mẫu | Invoice | String | 01GTKT0/001 |
| 4 | Ký hiệu HĐ | Invoice | String | AA/24E |
| 5 | Số HĐ | Invoice | String | 00001234 |
| 6 | CQT | Invoice | String | TCT |
| 7 | Địa chỉ NB | Invoice | String | 123 Đường ABC |
| 8 | Tên NB | Invoice | String | Công ty TNHH A |
| 9 | Địa chỉ NM | Invoice | String | 456 Đường XYZ |
| 10 | MST NM | Invoice | String | 0987654321 |
| 11 | Tên NM | Invoice | String | Công ty TNHH B |
| 12 | Tên NM mua | Invoice | String | Công ty TNHH B |
| 13 | Tiền chưa thuế | Invoice | Number | 50,000,000 |
| 14 | Tiền thuế | Invoice | Number | 5,000,000 |
| 15 | Tổng thanh toán | Invoice | Number | 55,000,000 |
| 16 | Tổng TT (chữ) | Invoice | String | Năm mươi lăm triệu |
| 17 | Thời điểm lập | Invoice | Date | 15/03/2024 14:30 |
| 18 | CKTM | Invoice | String | - |
| 19 | Trạng thái | Invoice | String | Hợp lệ |
| 20 | TT Báo | Invoice | String | - |
| 21 | TT Xử lý | Invoice | String | - |
| **DETAIL COLUMNS (22-29)** |
| 22 | STT MH | Detail | Number | 1 |
| 23 | Tên hàng hóa | Detail | String | Laptop Dell XPS 13 |
| 24 | Đơn vị tính | Detail | String | Cái |
| 25 | Số lượng | Detail | Number | 2 |
| 26 | Đơn giá | Detail | Number | 25,000,000 |
| 27 | Thành tiền | Detail | Number | 50,000,000 |
| 28 | Thuế suất (%) | Detail | Number | 10 |
| 29 | Tiền thuế MH | Detail | Number | 5,000,000 |

### Example Rows

```
Row 1 (Header):
STT | MST NB | KH Mẫu | KH HĐ | Số HĐ | ... | STT MH | Tên hàng | ĐVT | SL | Đơn giá | ...

Row 2 (Invoice AA/001, Item 1):
1 | 0123456789 | 01GTKT0/001 | AA/24E | 00001 | ... | 1 | Laptop Dell | Cái | 2 | 25,000,000 | ...

Row 3 (Invoice AA/001, Item 2):
2 | 0123456789 | 01GTKT0/001 | AA/24E | 00001 | ... | 2 | Chuột Logitech | Cái | 5 | 2,000,000 | ...

Row 4 (Invoice AA/001, Item 3):
3 | 0123456789 | 01GTKT0/001 | AA/24E | 00001 | ... | 3 | Bàn phím cơ | Cái | 3 | 3,000,000 | ...

Row 5 (Invoice AA/002, Item 1):
4 | 0456789123 | 01GTKT0/001 | AA/24E | 00002 | ... | 1 | Màn hình LG | Cái | 1 | 15,000,000 | ...
```

**Note**: 
- Invoice info (columns 1-21) **REPEAT** for each detail row
- Detail info (columns 22-29) **DIFFERENT** for each row
- This allows easy filtering/grouping by product or invoice

---

## ⚠️ Important Notes

### 1. API Requirement (CRITICAL)

**Backend MUST implement**:
```
GET /api/invoices/:id
```

**Response Format**:
```json
{
  "id": "uuid-1234",
  "shdon": "AA/001",
  "nbten": "Công ty A",
  "tgtttbso": 55000000,
  "details": [
    {
      "stt": 1,
      "ten": "Laptop Dell XPS 13",
      "dvtinh": "Cái",
      "sluong": 2,
      "dgia": 25000000,
      "thtien": 50000000,
      "tsuat": 10,
      "tthue": 5000000
    },
    {
      "stt": 2,
      "ten": "Chuột Logitech MX",
      "dvtinh": "Cái",
      "sluong": 5,
      "dgia": 2000000,
      "thtien": 10000000,
      "tsuat": 10,
      "tthue": 1000000
    }
  ]
}
```

### 2. Performance Considerations

**Current Implementation**:
```typescript
for (const inv of invoices) {
  const response = await fetch(`/api/invoices/${inv.id}`);
  // Sequential fetching
}
```

**Performance**:
- ⚠️ 50 invoices = 50 sequential API calls
- ⏱️ Estimated time: 50 × 100ms = 5 seconds
- 🚀 **Optimization needed for 100+ invoices**

**Recommended Optimizations**:

1. **Parallel Fetching** (Quick Win):
   ```typescript
   const exportData = await Promise.all(
     invoices.map(async (inv) => {
       const response = await fetch(`/api/invoices/${inv.id}`);
       // Parallel fetching
     })
   );
   ```
   - 50 invoices × 100ms = 1 second (5× faster)

2. **Bulk API Endpoint** (Best Practice):
   ```typescript
   POST /api/invoices/bulk-details
   Body: { invoiceIds: ["id1", "id2", ...] }
   
   Response: {
     "id1": { details: [...] },
     "id2": { details: [...] }
   }
   ```
   - 1 API call instead of 50
   - Server-side optimization possible

### 3. Preview vs Export

**Preview**:
- Shows first **10 rows** only
- Fast, responsive UI
- User can verify data structure

**Export**:
- Exports **ALL rows** (150+)
- Includes all invoices and all details
- Full Excel file with 29 columns

**Message to User**:
```
"Xem trước 10 dòng. File xuất sẽ có 150 dòng từ 50 hóa đơn."
```

### 4. Edge Cases

**Case 1: Invoice without details**
```typescript
if (details && details.length > 0) {
  // Create rows for each detail
} else {
  // Create 1 row with invoice info only
  exportData.push(baseInvoiceData);
}
```

**Result**: 
- Invoice columns: Filled
- Detail columns: Empty

**Case 2: API fetch fails**
```typescript
try {
  const response = await fetch(`/api/invoices/${inv.id}`);
  if (response.ok) {
    details = fullInvoice.details || [];
  }
} catch (err) {
  console.warn(`⚠️ Could not fetch details for invoice ${inv.shdon}`);
  // Continue with empty details
}
```

**Result**:
- Warning logged
- Export continues with invoice-only row

**Case 3: Large dataset (1000+ invoices)**
- ⚠️ Browser may freeze during processing
- **Recommendation**: Add pagination or batch export
- Show progress bar for fetching

---

## 🧪 Testing Guide

### Test Case 1: Basic FlatMap

**Setup**: 3 HĐ, mỗi HĐ có 2-3 mặt hàng

**Steps**:
1. Load 3 HĐ
2. Click "Xuất với Xem trước"
3. Wait for fetch
4. Check preview

**Expected**:
- ✅ Toast: "Đang chuẩn bị dữ liệu chi tiết..."
- ✅ 3 API calls: `/api/invoices/1`, `/api/invoices/2`, `/api/invoices/3`
- ✅ Toast: "✅ Đã chuẩn bị 7 dòng dữ liệu" (HĐ1: 3 items, HĐ2: 2 items, HĐ3: 2 items)
- ✅ Preview shows 7 rows
- ✅ Each row has 29 columns
- ✅ Detail columns populated correctly

### Test Case 2: Invoice without Details

**Setup**: 2 HĐ có chi tiết, 1 HĐ không có

**Steps**:
1. Load 3 HĐ
2. Mock API: HĐ 3 trả về `details: []`
3. Export

**Expected**:
- ✅ HĐ 1: 3 rows (3 items)
- ✅ HĐ 2: 2 rows (2 items)
- ✅ HĐ 3: 1 row (no items, invoice info only)
- ✅ Total: 6 rows
- ✅ Row 6 has empty detail columns

### Test Case 3: API Failure

**Setup**: Mock API to fail for HĐ 2

**Steps**:
1. Load 3 HĐ
2. Mock: HĐ 2 API returns 404
3. Export

**Expected**:
- ✅ Console warning: "⚠️ Could not fetch details for invoice AA/002"
- ✅ HĐ 1: 3 rows (normal)
- ✅ HĐ 2: 1 row (invoice only, no details)
- ✅ HĐ 3: 2 rows (normal)
- ✅ Total: 6 rows
- ✅ Export continues despite error

### Test Case 4: Excel Export

**Steps**:
1. Load 5 HĐ (total 12 details)
2. Click "Xuất với Xem trước"
3. Click "Xuất Excel"

**Expected**:
- ✅ File downloads: `hoa-don-2024-10-10.xlsx`
- ✅ Sheet: "Danh sách hóa đơn"
- ✅ Rows: 13 (1 header + 12 data)
- ✅ Columns: 29
- ✅ Column headers correct (Vietnamese)
- ✅ Data formatted: Currency with commas, dates localized
- ✅ Detail columns populated for each item

### Test Case 5: Large Dataset

**Setup**: 50 HĐ, avg 3 items/HĐ = 150 rows

**Steps**:
1. Load 50 HĐ
2. Click "Xuất với Xem trước"
3. Monitor performance

**Expected**:
- ✅ Toast shows progress
- ✅ Fetching takes 3-5 seconds (sequential)
- ✅ Toast: "✅ Đã chuẩn bị 150 dòng"
- ✅ Preview shows 10 rows (first 10)
- ✅ Preview message: "Xem trước 10 dòng. File xuất sẽ có 150 dòng."
- ✅ Export creates file with all 150 rows

---

## 🆚 Comparison: Old vs New

| Feature | Old (Invoice-based) | New (FlatMap Detail-based) |
|---------|---------------------|----------------------------|
| **Data Unit** | 1 row = 1 invoice | 1 row = 1 detail item |
| **Row Count** | 50 invoices → 50 rows | 50 invoices × 3 items → 150 rows |
| **Columns** | 21 (invoice only) | 29 (invoice + detail) |
| **API Calls** | 0 (uses cached data) | 50 (fetch details) |
| **Processing** | Sync, instant | Async, 3-5 seconds |
| **Use Case** | Invoice summary | Detailed item analysis |
| **Excel Size** | Small (50 rows) | Large (150+ rows) |
| **Filtering** | By invoice | By invoice OR product |
| **Pivot Table** | Limited | Rich (by product, category) |
| **Accounting** | Invoice-level | Item-level (better) |

---

## ✅ Completion Summary

### Files Modified (2)
- ✅ `/frontend/src/app/ketoan/listhoadon/page.tsx` (async handler + flatMap)
- ✅ `/frontend/src/services/frontendExcelExport.ts` (interface + columns)

### Features Implemented
- ✅ Async fetch invoice details from API
- ✅ FlatMap logic: Each detail → separate row
- ✅ Extended interface with 8 detail fields
- ✅ Updated Excel headers (29 columns)
- ✅ Updated row mapping with detail data
- ✅ Toast notifications for progress
- ✅ Error handling for API failures
- ✅ Support for invoices without details

### Excel Output
- ✅ 29 columns (21 invoice + 8 detail)
- ✅ Rows = Total detail items across all invoices
- ✅ Each row: Invoice info + Item info
- ✅ Ready for item-level analysis

---

## 🎉 Kết Luận

✅ **Feature Complete**

**Đã triển khai**:
- ✅ FlatMap export theo chi tiết mặt hàng
- ✅ Mỗi dòng = 1 mặt hàng (thay vì 1 hóa đơn)
- ✅ 29 cột (thông tin HĐ + thông tin MH)
- ✅ Fetch API async để lấy chi tiết
- ✅ Xử lý edge cases (no details, API fail)

**Trải nghiệm người dùng**:
1. Click "Xuất với Xem trước"
2. **CHỜ** hệ thống fetch chi tiết (toast hiển thị)
3. **XEM** preview với 10 dòng đầu (mỗi dòng = 1 mặt hàng)
4. **KIỂM TRA** cấu trúc 29 cột
5. Click "Xuất Excel"
6. **NHẬN** file với tất cả dòng chi tiết

**Status**: ✅ Ready for testing (Requires Backend API `/api/invoices/:id`)

**Next Steps**:
1. Implement backend API endpoint
2. Test with real data
3. Optimize with parallel/bulk fetching if needed
4. Add progress bar for large datasets

---

**Tác giả**: AI Assistant  
**Ngày**: October 10, 2025  
**Version**: 4.0.0 (FlatMap by Details)
