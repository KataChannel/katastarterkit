# Excel Export - Quick Reference

## 📋 JSON Structure

```json
{
  "nbmst": "5900428904",
  "khmshdon": "1",
  "khhdon": "1",
  "shdon": "6874",
  "cqt": "",
  "tgtcthue": null,
  "tgtthue": 604444,
  "tgtttbso": 8160000,
  "thlap": "2025-10-01T17:00:00.000Z",
  "ttcktmai": "",
  "tthai": "",
  "tttbao": "",
  "ttxly": "",
  "dgia": null,
  "dvtinh": null,
  "ltsuat": null,
  "sluong": null,
  "ten": null,
  "thtcthue": null,
  "thtien": null,
  "tlckhau": null,
  "tsuat": null,
  "tthue": null,
  "tgia": null
}
```

## 📊 Excel Columns (25 total)

### Invoice Fields (14 columns)
1. STT
2. MST Người bán
3. Ký hiệu mẫu
4. Ký hiệu HĐ
5. Số HĐ
6. CQT
7. Tổng tiền chưa thuế
8. Tổng tiền thuế
9. Tổng thanh toán
10. Thời điểm lập
11. TT CKTM
12. Trạng thái
13. TT Báo
14. TT Xử lý

### Detail Fields (11 columns)
15. Tên hàng hóa/DV
16. Đơn vị tính
17. Số lượng
18. Đơn giá
19. Thành tiền trước thuế
20. Thành tiền
21. Tỷ lệ CK (%)
22. Loại thuế suất
23. Thuế suất (%)
24. Tiền thuế
25. Thành giá

## 🔄 Flatmap Logic

### Invoice with 2 details → 2 rows
```typescript
Input:
{
  nbmst: "123",
  shdon: "001",
  details: [
    { ten: "A", dgia: 100 },
    { ten: "B", dgia: 200 }
  ]
}

Output (2 rows):
Row 1: { nbmst: "123", shdon: "001", ten: "A", dgia: 100 }
Row 2: { nbmst: "123", shdon: "001", ten: "B", dgia: 200 }
```

### Invoice without details → 1 row
```typescript
Input:
{
  nbmst: "123",
  shdon: "001",
  details: []
}

Output (1 row):
{ nbmst: "123", shdon: "001", ten: null, dgia: null, ... }
```

## 💻 Usage

### 1. Click Button
```tsx
<button onClick={handleFrontendExportExcel}>
  Xuất với Xem trước
</button>
```

### 2. Data Preparation
```typescript
const exportData = invoices.flatMap(invoice => {
  if (invoice.details?.length > 0) {
    return invoice.details.map(detail => ({
      // Invoice fields (repeated)
      nbmst: invoice.nbmst,
      khmshdon: invoice.khmshdon,
      shdon: invoice.shdon,
      tgtthue: invoice.tgtthue,
      // Detail fields
      ten: detail.ten,
      dgia: detail.dgia,
      sluong: detail.sluong,
      tthue: detail.tthue
    }));
  }
  return [{ ...invoice, ten: null, dgia: null }];
});
```

### 3. Preview
```tsx
<ExcelPreviewDialog
  open={true}
  invoices={exportData}
  fromDate="2025-10-01"
  toDate="2025-10-31"
/>
```

### 4. Export
User clicks "Xuất Excel" → .xlsx file downloads

## 📝 Field Mappings

| Invoice Field | JSON Key | Type |
|---------------|----------|------|
| MST Người bán | nbmst | string |
| Ký hiệu mẫu | khmshdon | string |
| Ký hiệu HĐ | khhdon | string |
| Số HĐ | shdon | string |
| CQT | cqt | string |
| Tổng tiền chưa thuế | tgtcthue | number |
| Tổng tiền thuế | tgtthue | number |
| Tổng thanh toán | tgtttbso | number |
| Thời điểm lập | thlap | date |
| TT CKTM | ttcktmai | string |
| Trạng thái | tthai | string |
| TT Báo | tttbao | string |
| TT Xử lý | ttxly | string |

| Detail Field | JSON Key | Type |
|--------------|----------|------|
| Tên hàng hóa/DV | ten | string |
| Đơn vị tính | dvtinh | string |
| Số lượng | sluong | number |
| Đơn giá | dgia | number |
| Thành tiền trước thuế | thtcthue | number |
| Thành tiền | thtien | number |
| Tỷ lệ CK | tlckhau | number |
| Loại thuế suất | ltsuat | string |
| Thuế suất | tsuat | string |
| Tiền thuế | tthue | number |
| Thành giá | tgia | number |

## ⚡ Quick Tips

### Check Data Before Export
```typescript
console.log('Total rows:', exportData.length);
console.log('Sample row:', exportData[0]);
```

### Format Numbers
```typescript
// Automatically formatted in Excel
formatCurrency(604444) → "604,444"
```

### Format Dates
```typescript
// ISO to DD/MM/YYYY
"2025-10-01T17:00:00.000Z" → "01/10/2025"
```

### Status Formatting
```typescript
"1" → "Hợp lệ"
"0" → "Đã hủy"
```

## 🐛 Troubleshooting

### Issue: No data in preview
**Check:** exportData state is set correctly
```typescript
console.log('exportData:', exportData);
```

### Issue: Wrong columns in Excel
**Check:** InvoiceExportData interface matches JSON
```typescript
// Must have all fields from JSON structure
```

### Issue: Null values show as empty
**Expected:** Null numbers → blank cells in Excel

### Issue: Details not flatmapped
**Check:** invoice.details is array
```typescript
if (Array.isArray(invoice.details) && invoice.details.length > 0) {
  // FlatMap
}
```

## 📚 Files

- **Service:** `frontend/src/services/frontendExcelExport.ts`
- **Component:** `frontend/src/components/ExcelPreviewDialog.tsx`
- **Page:** `frontend/src/app/ketoan/listhoadon/page.tsx`

## ✅ Checklist

- [x] InvoiceExportData interface updated
- [x] getHeaders() returns 25 columns
- [x] invoiceToRow() maps all fields
- [x] Column widths configured
- [x] Page flatmaps details correctly
- [x] exportData state added
- [x] ExcelPreviewDialog receives correct data
- [ ] User tested export (pending)

---

**Status:** ✅ Ready to use  
**Version:** 2.0 (Flatmap by details)
