# InvoiceTableAdvanced - Quick Reference

## 🚀 Quick Start

```typescript
import InvoiceTableAdvanced from '@/components/InvoiceTableAdvanced';

<InvoiceTableAdvanced
  invoices={invoiceData}
  loading={isLoading}
  onRowClick={(invoice) => showDetail(invoice)}
  height={700}
/>
```

## 📋 Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `invoices` | `InvoiceData[]` | ✅ Yes | - | Mảng dữ liệu hóa đơn |
| `loading` | `boolean` | ❌ No | `false` | Trạng thái loading |
| `onRowClick` | `(invoice) => void` | ❌ No | - | Callback khi click row |
| `height` | `number` | ❌ No | `600` | Chiều cao table (px) |

## 🎯 Features

### ✅ Enabled Features
- ✅ **Sorting** - Click header để sort (shift+click cho multi-sort)
- ✅ **Filtering** - Filter từng cột + global search
- ✅ **Column Resizing** - Kéo border để resize
- ✅ **Column Pinning** - Pin cột trái/phải
- ✅ **Column Hiding** - Ẩn/hiện cột
- ✅ **Export CSV** - Xuất dữ liệu
- ✅ **Virtual Scrolling** - Performance tốt
- ✅ **Row Selection** - Click để select

### ❌ Disabled Features (theo yêu cầu)
- ❌ **Inline Editing** - Không cho phép edit
- ❌ **Dialog Editing** - Không có form edit
- ❌ **Row Deletion** - Không cho phép xóa
- ❌ **Row Creation** - Không có nút thêm mới

## 📊 20 Columns Display

| # | Field | Header | Sortable | Filterable | Pinned | Type |
|---|-------|--------|----------|------------|--------|------|
| 1 | `nbmst` | MST Người bán | ✅ | ✅ | Left | text |
| 2 | `khmshdon` | Ký hiệu mẫu | ✅ | ✅ | Left | text |
| 3 | `khhdon` | Ký hiệu HĐ | ❌ | ✅ | - | text |
| 4 | `shdon` | Số HĐ | ✅ | ✅ | - | text |
| 5 | `cqt` | CQT | ❌ | ✅ | - | text |
| 6 | `nbdchi` | Địa chỉ NB | ❌ | ✅ | - | text |
| 7 | `nbten` | Tên NB | ❌ | ✅ | - | text |
| 8 | `nmdchi` | Địa chỉ NM | ❌ | ✅ | - | text |
| 9 | `nmmst` | MST NM | ❌ | ✅ | - | text |
| 10 | `nmten` | Tên NM | ❌ | ✅ | - | text |
| 11 | `nmtnmua` | Tên NM mua | ❌ | ✅ | - | text |
| 12 | `tgtcthue` | Tiền chưa thuế | ✅ | ✅ | - | number |
| 13 | `tgtthue` | Tiền thuế | ✅ | ✅ | - | number |
| 14 | `tgtttbso` | **Tổng TT (số)** | ✅ | ✅ | **Right** | number |
| 15 | `tgtttbchu` | Tổng TT (chữ) | ❌ | ❌ | - | text |
| 16 | `thlap` | Thời điểm lập | ✅ | ✅ | - | text |
| 17 | `ttcktmai` | CKTM | ❌ | ❌ | - | text |
| 18 | `tthai` | Trạng thái | ❌ | ✅ | - | badge |
| 19 | `tttbao` | TT Báo | ❌ | ❌ | - | text |
| 20 | `ttxly` | TT Xử lý | ❌ | ❌ | - | text |

## 🎨 Visual Features

### Status Colors
```typescript
tthai === '1' or 'active'    → 🟢 Hợp lệ (green)
tthai === '0' or 'cancelled' → 🔴 Đã hủy (red)
other                        → 🟡 N/A (yellow)
```

### Currency Formatting
```typescript
tgtcthue: 1234567  → 1.234.567 ₫
tgtthue:  123456   → 123.456 ₫
tgtttbso: 1358023  → 1.358.023 ₫ (bold blue)
```

### Text Truncation
- Địa chỉ (nbdchi, nmdchi): Max 200px + tooltip
- Tên (nbten, nmten, nmtnmua): Max 200px + tooltip
- Other text: Full display

## 🔧 Toolbar Actions

| Icon | Action | Shortcut | Description |
|------|--------|----------|-------------|
| 🔍 | Global Search | - | Tìm kiếm toàn bộ bảng |
| 📥 | Export CSV | - | Xuất dữ liệu ra file CSV |
| ⚙️ | Column Settings | - | Ẩn/hiện cột |
| 🔄 | Reset | - | Reset về mặc định |
| 👁️ | Toggle Columns | - | Show/hide quick toggle |

## ⌨️ Keyboard Shortcuts (AdvancedTable)

| Key | Action |
|-----|--------|
| Click header | Single column sort |
| Shift + Click header | Multi-column sort |
| Click header 3x | Clear sort |
| Double-click border | Auto-size column |
| Drag border | Resize column |

## 🎯 Usage Examples

### Basic Usage
```typescript
<InvoiceTableAdvanced
  invoices={invoices}
  loading={loading}
/>
```

### With Row Click Handler
```typescript
const handleRowClick = (invoice: InvoiceData) => {
  setSelectedInvoice(invoice);
  setShowModal(true);
};

<InvoiceTableAdvanced
  invoices={invoices}
  onRowClick={handleRowClick}
/>
```

### Custom Height
```typescript
<InvoiceTableAdvanced
  invoices={invoices}
  height={800}  // 800px height
/>
```

### Full Example with Modal
```typescript
const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
const [showModal, setShowModal] = useState(false);

const handleRowClick = (invoice: InvoiceData) => {
  setSelectedInvoice(invoice);
  setShowModal(true);
};

return (
  <>
    <InvoiceTableAdvanced
      invoices={invoices}
      loading={loading}
      onRowClick={handleRowClick}
      height={700}
    />
    
    <InvoiceDetailModal
      invoice={selectedInvoice}
      isOpen={showModal}
      onClose={() => {
        setShowModal(false);
        setSelectedInvoice(null);
      }}
    />
  </>
);
```

## 📈 Performance Tips

### Optimal Data Size
- ✅ Good: < 1,000 rows - Smooth performance
- ⚠️ Okay: 1,000 - 5,000 rows - Still good with virtual scroll
- 🔴 Large: > 5,000 rows - Consider server-side pagination

### Best Practices
1. **Use memo for data**: Wrap invoice data with `useMemo`
2. **Debounce searches**: Already built-in
3. **Virtual scrolling**: Already enabled
4. **Set explicit height**: For better virtual scroll performance

### Memory Optimization
```typescript
// ✅ Good - Memoized data
const tableData = useMemo(() => invoices, [invoices]);

// ❌ Bad - New array every render
const tableData = [...invoices];
```

## 🐛 Troubleshooting

### Table không hiển thị
- ✅ Check: `invoices` array có dữ liệu?
- ✅ Check: `height` prop được set?
- ✅ Check: Component được import đúng?

### Sort không hoạt động
- ✅ Check: Column có `sortable: true`?
- ✅ Check: Click đúng vào header?

### Filter không hoạt động
- ✅ Check: Column có `filterable: true`?
- ✅ Check: Toolbar visible (`showToolbar: true`)?

### Export CSV lỗi
- ✅ Check: Có dữ liệu trong bảng?
- ✅ Check: Browser cho phép download?

### Click row không mở modal
- ✅ Check: `onRowClick` prop được truyền?
- ✅ Check: Handler function đúng?
- ✅ Check: Modal component render?

## 🔄 Migration from Old InvoiceTable

### Before (Old)
```typescript
<InvoiceTable
  invoices={invoices}
  loading={loading}
  onSort={handleSort}
  sortField={sortField}
  sortDirection={sortDirection}
  pagination={pagination}
  onPageChange={handlePageChange}
  onPageSizeChange={handlePageSizeChange}
  filter={filter}
  onFilterChange={handleFilterChange}
  showAdvancedFilter={true}
  onRowClick={handleInvoiceSelect}
/>
```

### After (New)
```typescript
<InvoiceTableAdvanced
  invoices={invoices}
  loading={loading}
  onRowClick={handleInvoiceSelect}
  height={700}
/>
```

### What Changed?
- ❌ Removed: 7 props (sort, pagination, filter props)
- ✅ Added: 1 prop (height)
- 🎉 Result: From 11 props → 4 props
- 📦 Benefit: Simpler API, same functionality

## 📚 Related Components

- **InvoiceDetailModal** - Modal chi tiết hóa đơn
- **ConfigModal** - Cấu hình hệ thống
- **SyncProgressDisplay** - Hiển thị tiến trình sync
- **AdvancedTable** - Base table component

## 🔗 Dependencies

```json
{
  "react": "^18.0.0",
  "date-fns": "^2.30.0",
  "@/components/ui/advanced-table": "internal",
  "@/types/invoice": "internal"
}
```

## 📝 Notes

1. **No pagination**: Sử dụng virtual scrolling thay vì pagination
2. **Auto-managed state**: Sort, filter, column state tự quản lý
3. **Type-safe**: Full TypeScript support
4. **Responsive**: Auto-responsive với horizontal scroll
5. **Accessible**: Keyboard navigation support

---

**Quick Tip:** Press `Ctrl/Cmd + F` trong table toolbar để focus vào global search! 🔍
