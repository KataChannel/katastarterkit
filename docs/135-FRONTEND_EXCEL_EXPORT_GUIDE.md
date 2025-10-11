# Frontend Excel Export với Xem Trước - Hướng Dẫn

## 📋 Tổng Quan

Tính năng xuất Excel mới cho phép xem trước dữ liệu trước khi xuất, xử lý hoàn toàn trên frontend không cần gọi backend.

### ✨ Tính Năng Chính

1. **Xem trước dữ liệu** - Hiển thị 10 dòng đầu trước khi xuất
2. **Thống kê tổng quan** - Tổng hóa đơn, tổng tiền, hợp lệ, đã hủy
3. **Validate dữ liệu** - Kiểm tra lỗi và cảnh báo trước khi xuất
4. **Xử lý frontend** - 100% client-side, không phụ thuộc backend
5. **Tùy chỉnh khoảng thời gian** - Tên file tự động theo fromDate - toDate

---

## 🗂️ Cấu Trúc File

### 1. Service Layer
**File**: `/frontend/src/services/frontendExcelExport.ts` (376 dòng)

```typescript
// Interfaces
interface InvoiceExportData {
  nbmst?: string;      // MST Người bán
  khmshdon?: string;   // Ký hiệu mẫu
  shdon?: string;      // Số HĐ
  // ... 17 fields khác
}

interface ExcelPreviewData {
  headers: string[];
  rows: any[][];
  totalRows: number;
  previewRows: number;
  fileName: string;
}

// Main Methods
class FrontendExcelExportService {
  // Tạo preview (10 rows mặc định)
  static generatePreview(invoices: InvoiceExportData[], maxRows = 10): ExcelPreviewData
  
  // Xuất Excel
  static exportToExcel(invoices: InvoiceExportData[], fileName?: string): void
  
  // Xuất với tên file có date range
  static exportWithDateRange(invoices: InvoiceExportData[], from: string, to: string): void
  
  // Lọc theo khoảng thời gian
  static filterByDateRange(invoices: InvoiceExportData[], from: string, to: string): InvoiceExportData[]
  
  // Thống kê
  static getStatistics(invoices: InvoiceExportData[]): Statistics
  
  // Validate
  static validateData(invoices: InvoiceExportData[]): ValidationResult
}
```

### 2. Component Layer
**File**: `/frontend/src/components/ExcelPreviewDialog.tsx` (216 dòng)

```typescript
interface ExcelPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoices: InvoiceExportData[];
  fromDate?: string;
  toDate?: string;
}

export function ExcelPreviewDialog({ ... }) {
  // Features:
  // - Statistics cards (4 metrics)
  // - Validation messages (errors & warnings)
  // - Preview table (first 10 rows)
  // - Export button with loading state
}
```

### 3. Page Integration
**File**: `/frontend/src/app/ketoan/listhoadon/page.tsx`

Đã thêm:
- Import `FrontendExcelExportService` và `ExcelPreviewDialog`
- State `showExcelPreview` để control dialog
- Handler `handleFrontendExportExcel()` để mở preview
- Nút "Xuất với Xem trước" trên toolbar
- Dialog component ở cuối JSX

---

## 🎯 Cách Sử Dụng

### Bước 1: Tìm kiếm dữ liệu
1. Chọn tháng/năm hoặc nhập khoảng thời gian
2. Nhấn "Tìm trong Database" hoặc "Đồng bộ từ API"
3. Dữ liệu sẽ hiển thị trong bảng

### Bước 2: Mở xem trước
1. Nhấn nút **"Xuất với Xem trước"** (màu emerald-green)
2. Dialog mở ra hiển thị:
   - **Thống kê**: Tổng HĐ, Tổng tiền, Hợp lệ, Đã hủy
   - **Cảnh báo**: Nếu có dữ liệu thiếu hoặc không hợp lệ
   - **Preview table**: 10 dòng đầu tiên (21 cột)
   - **Khoảng thời gian**: fromDate - toDate

### Bước 3: Xuất Excel
1. Kiểm tra preview
2. Nhấn nút **"Xuất Excel (X hóa đơn)"**
3. File Excel sẽ tự động download:
   - Tên file: `hoa-don-YYYY-MM-DD_YYYY-MM-DD.xlsx`
   - Hoặc: `hoa-don-YYYY-MM-DD.xlsx` (nếu không có date range)

---

## 📊 Cấu Trúc Excel File

### Headers (21 cột)
```
STT | MST NB | Ký hiệu mẫu | Ký hiệu HĐ | Số HĐ | CQT | 
Địa chỉ NB | Tên NB | Địa chỉ NM | MST NM | Tên NM | 
Tên người mua | Tiền chưa thuế | Tiền thuế | Tổng TT | 
Tổng TT (chữ) | Thời điểm lập | CKTM | Trạng thái | 
TT Báo | TT Xử lý
```

### Data Formatting
- **Tiền tệ**: `#,##0` (VD: 1,234,567)
- **Ngày giờ**: `dd/mm/yyyy hh:mm` (VD: 15/03/2024 14:30)
- **Số HĐ**: Text (giữ nguyên leading zeros)
- **MST**: Text (giữ nguyên format)

### Column Widths
Tự động điều chỉnh cho dễ đọc:
- STT: 5
- MST, Số HĐ: 12-15
- Tên, Địa chỉ: 25-30
- Tiền: 18
- Ngày giờ: 18
- Trạng thái: 10-12

---

## 🔧 Technical Details

### Dependencies
```json
{
  "xlsx": "^0.18.5",           // Excel generation
  "file-saver": "^2.0.5"       // File download
}
```

### Data Flow
```
InvoiceData (API/DB) 
  → Convert to InvoiceExportData
    → generatePreview() 
      → ExcelPreviewDialog 
        → User clicks "Xuất Excel"
          → exportToExcel()
            → Download .xlsx file
```

### Field Mapping (InvoiceData → InvoiceExportData)
```typescript
{
  nbmst: inv.nbmst || inv.msttcgp,      // MST Người bán
  khmshdon: inv.khmshdon,               // Ký hiệu mẫu
  shdon: inv.shdon,                     // Số HĐ
  nbdchi: inv.dchi || inv.dctcgp,       // Địa chỉ NB
  nbten: inv.nten || inv.tentcgp,       // Tên NB
  nmdchi: inv.dcxmua,                   // Địa chỉ NM
  nmmst: inv.msttmua,                   // MST NM
  nmten: inv.tenxmua,                   // Tên NM
  tgtcthue: inv.tgtcthue,               // Tiền chưa thuế
  tgtthue: inv.tgtthue,                 // Tiền thuế
  tgtttbso: inv.tgtttbso,               // Tổng TT
  tgtttbchu: inv.tgtttchu,              // Tổng TT (chữ)
  thlap: inv.tdlap,                     // Thời điểm lập
  tthai: inv.tghdon || '',              // Trạng thái
  // Fields not in InvoiceData → empty string
  khhdon: inv.khmshdon,                 // Fallback
  cqt: '',
  ttcktmai: '',
  tttbao: '',
  ttxly: ''
}
```

---

## 🎨 UI Components

### ExcelPreviewDialog Layout

```
┌─────────────────────────────────────────────────────┐
│ [FileSpreadsheet] Xem trước xuất Excel         [X]  │
├─────────────────────────────────────────────────────┤
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │
│ │Tổng HĐ │ │Tổng tiền│ │Hợp lệ │ │Đã hủy │       │
│ │  250   │ │5.2 tỷ đ │ │  245  │ │   5   │       │
│ └────────┘ └────────┘ └────────┘ └────────┘       │
│                                                     │
│ ⚠️ Cảnh báo: (if any)                               │
│   • 5 hóa đơn thiếu MST người mua                   │
│                                                     │
│ Xem trước dữ liệu [10 / 250 dòng]   File: hoa...   │
│ ┌─────────────────────────────────────────────┐   │
│ │ STT│MST NB│Ký hiệu│Số HĐ│... (21 columns) │   │
│ ├─────────────────────────────────────────────┤   │
│ │ 1  │01234 │...    │...  │                  │   │
│ │ 2  │56789 │...    │...  │                  │   │
│ │ ...                                         │   │
│ │ 10 │...   │...    │...  │                  │   │
│ └─────────────────────────────────────────────┘   │
│ ... và 240 dòng nữa                                 │
│                                                     │
│ Khoảng thời gian: Từ 2024-01-01 đến 2024-03-31    │
├─────────────────────────────────────────────────────┤
│                    [Hủy]  [Xuất Excel (250 HĐ)]    │
└─────────────────────────────────────────────────────┘
```

### Button States
- **Disabled**: Khi `invoices.length === 0`
- **Loading**: Hiển thị "Đang xuất..." khi export
- **Success**: Alert + auto-close dialog sau 500ms

---

## ⚙️ Configuration & Customization

### Thay đổi số dòng preview
```typescript
// In ExcelPreviewDialog.tsx
const preview = FrontendExcelExportService.generatePreview(
  invoices, 
  20  // Thay đổi từ 10 → 20 dòng
);
```

### Custom file name
```typescript
// In service
FrontendExcelExportService.exportToExcel(
  invoices,
  'custom-invoice-report.xlsx'  // Custom name
);
```

### Thêm cột mới
```typescript
// 1. Thêm field vào InvoiceExportData interface
interface InvoiceExportData {
  // ... existing fields
  newField?: string;
}

// 2. Thêm vào getHeaders()
private static getHeaders(): string[] {
  return [
    'STT',
    // ... existing headers
    'New Field',
  ];
}

// 3. Thêm vào invoiceToRow()
private static invoiceToRow(invoice: InvoiceExportData, index: number): any[] {
  return [
    index + 1,
    // ... existing fields
    invoice.newField || '',
  ];
}

// 4. Update column width
ws['!cols'] = [
  // ... existing widths
  { wch: 15 },  // New field width
];
```

---

## 🔍 Validation & Error Handling

### Validation Checks
1. **Empty data**: Không có hóa đơn → Toast error
2. **Missing MST**: Cảnh báo thiếu MST người mua
3. **Missing dates**: Cảnh báo thiếu thời điểm lập
4. **Invalid amounts**: Cảnh báo số tiền <= 0

### Error Messages
```typescript
interface ValidationResult {
  isValid: boolean;
  errors: string[];      // Block export
  warnings: string[];    // Allow export but show warning
}

// Example
{
  isValid: true,
  errors: [],
  warnings: [
    '5 hóa đơn thiếu MST người mua',
    '3 hóa đơn thiếu thời điểm lập'
  ]
}
```

---

## 📈 Statistics Calculation

```typescript
interface Statistics {
  totalInvoices: number;      // Tổng số HĐ
  totalAmount: number;        // Tổng tiền (tgtttbso)
  totalTaxAmount: number;     // Tổng thuế (tgtthue)
  totalBeforeTax: number;     // Tổng trước thuế (tgtcthue)
  validInvoices: number;      // HĐ hợp lệ (có MST + số tiền)
  cancelledInvoices: number;  // HĐ đã hủy (tthai contains 'hủy')
  averageAmount: number;      // Trung bình tiền/HĐ
}
```

---

## 🆚 So Sánh Backend vs Frontend Export

| Feature | Backend Export | Frontend Export |
|---------|---------------|-----------------|
| **Xử lý dữ liệu** | Server-side | Client-side |
| **Dependencies** | Backend API | xlsx + file-saver |
| **Preview** | ❌ Không có | ✅ Có (10 rows) |
| **Statistics** | ❌ Không có | ✅ Có (4 metrics) |
| **Validation** | ❌ Không có | ✅ Có (errors + warnings) |
| **Performance** | Tốt với data lớn | Tốt với < 10,000 rows |
| **Network** | Cần kết nối server | Chỉ cần data đã load |
| **Offline** | ❌ Không thể | ✅ Có thể (nếu data có sẵn) |
| **Date range** | ✅ Query theo date | ✅ Filter trên client |
| **Use case** | Export số lượng lớn | Export data hiện tại với preview |

---

## 🧪 Testing Guide

### Test Case 1: Export với dữ liệu hợp lệ
1. Tìm kiếm → có 100 hóa đơn
2. Click "Xuất với Xem trước"
3. **Expected**: 
   - Preview hiển thị 10 rows
   - Statistics: 100 HĐ, tổng tiền đúng
   - Không có errors/warnings
4. Click "Xuất Excel"
5. **Expected**: File download thành công

### Test Case 2: Export với dữ liệu thiếu
1. Tìm kiếm → có 50 HĐ (một số thiếu MST)
2. Click "Xuất với Xem trước"
3. **Expected**:
   - Preview hiển thị 10 rows
   - Warning: "X hóa đơn thiếu MST người mua"
4. Click "Xuất Excel"
5. **Expected**: Vẫn export được, file có empty cells

### Test Case 3: Export với không có dữ liệu
1. Tìm kiếm → 0 hóa đơn
2. Click "Xuất với Xem trước"
3. **Expected**: Toast error "Không có dữ liệu để xuất"

### Test Case 4: Export với date range
1. Filter: 01/01/2024 - 31/03/2024
2. Tìm kiếm → có data
3. Click "Xuất với Xem trước"
4. **Expected**: 
   - Preview hiển thị "Khoảng thời gian: Từ 01/01/2024 đến 31/03/2024"
5. Click "Xuất Excel"
6. **Expected**: File name: `hoa-don-2024-01-01_2024-03-31.xlsx`

---

## 🐛 Troubleshooting

### Issue 1: Preview không hiển thị
**Symptom**: Dialog mở nhưng preview table rỗng

**Solution**:
```typescript
// Check console logs
console.log('Preview data:', preview);
console.log('Invoices:', invoices);

// Verify mapping
const exportData = invoices.map(inv => ({...}));
console.log('Export data:', exportData);
```

### Issue 2: File download lỗi
**Symptom**: Click "Xuất Excel" không download

**Solution**:
```typescript
// Check browser console for errors
// Verify file-saver imported correctly
import { saveAs } from 'file-saver';

// Check XLSX write
const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
console.log('Workbook output:', wbout);
```

### Issue 3: Định dạng tiền sai
**Symptom**: Số tiền hiển thị không đúng format

**Solution**:
```typescript
// Check formatCurrency in service
private static formatCurrency(value: number | undefined | null): string {
  if (!value && value !== 0) return '';
  return new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}
```

### Issue 4: TypeScript errors về types
**Symptom**: Compilation errors về missing properties

**Solution**:
```typescript
// Use optional chaining and fallbacks
nbmst: inv.nbmst || inv.msttcgp || '',
nmten: inv.tenxmua || '',
```

---

## 📝 Quick Reference

### Import statements
```typescript
import FrontendExcelExportService, { InvoiceExportData } from '@/services/frontendExcelExport';
import { ExcelPreviewDialog } from '@/components/ExcelPreviewDialog';
```

### Minimal usage
```typescript
// 1. Prepare data
const exportData: InvoiceExportData[] = invoices.map(inv => ({...}));

// 2. Generate preview
const preview = FrontendExcelExportService.generatePreview(exportData);

// 3. Export
FrontendExcelExportService.exportToExcel(exportData);
```

### With dialog
```typescript
const [showPreview, setShowPreview] = useState(false);

// Open preview
<button onClick={() => setShowPreview(true)}>Preview</button>

// Render dialog
<ExcelPreviewDialog
  open={showPreview}
  onOpenChange={setShowPreview}
  invoices={exportData}
  fromDate={fromDate}
  toDate={toDate}
/>
```

---

## ✅ Checklist Triển Khai

- [x] Tạo service `frontendExcelExport.ts`
- [x] Tạo component `ExcelPreviewDialog.tsx`
- [x] Tích hợp vào `listhoadon/page.tsx`
- [x] Thêm nút "Xuất với Xem trước"
- [x] Test với dữ liệu thực
- [ ] Deploy lên staging
- [ ] UAT testing
- [ ] Deploy production

---

## 🎓 Best Practices

1. **Always validate before export**
   ```typescript
   const validation = FrontendExcelExportService.validateData(invoices);
   if (!validation.isValid) {
     // Handle errors
   }
   ```

2. **Show loading state**
   ```typescript
   const [isExporting, setIsExporting] = useState(false);
   // Set true during export
   ```

3. **Handle errors gracefully**
   ```typescript
   try {
     exportToExcel(data);
   } catch (error) {
     toast.error('Lỗi xuất Excel');
     console.error(error);
   }
   ```

4. **Limit preview rows**
   - Mặc định: 10 rows
   - Max recommend: 50 rows (for performance)

5. **Check data size**
   ```typescript
   if (invoices.length > 50000) {
     // Recommend using backend export
     toast.warning('Dữ liệu quá lớn, nên dùng "Xuất từ Server"');
   }
   ```

---

## 📚 Related Documentation

- [AdvancedTable Documentation](./ADVANCED_TABLE_ALIGNMENT_FIX.md)
- [Invoice API Integration](./docs/API_INTEGRATION.md)
- [Backend Excel Export](./backend/src/services/excelExport.ts)

---

## 🤝 Support

Nếu gặp vấn đề, kiểm tra:
1. Console logs (F12 → Console)
2. Network tab (F12 → Network)
3. File `/frontend/src/services/frontendExcelExport.ts` lines 230-280
4. Component `/frontend/src/components/ExcelPreviewDialog.tsx` lines 60-120

---

**Tác giả**: AI Assistant  
**Ngày tạo**: 2024  
**Version**: 1.0.0
