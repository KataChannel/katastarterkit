# Tối Ưu Hóa Trang Xuất Nhập Tồn - Search Button

## 📋 Tổng Quan

Cập nhật trang **Kế Toán > Xuất Nhập Tồn** để tối ưu hóa hiệu suất khi thay đổi khoảng thời gian tìm kiếm. Thay vì tự động tải lại dữ liệu mỗi khi date range thay đổi, người dùng giờ cần click button **"Tìm kiếm"** để áp dụng filter.

## ✨ Các Thay Đổi Chính

### 1. **FilterToolbar Component** (`FilterToolbar.tsx`)

#### Thêm State Management
- **Local State**: Thêm `localDateRange` để lưu date range tạm thời
- **Sync Logic**: Sử dụng `useEffect` để đồng bộ với parent state khi cần
- **Change Detection**: Kiểm tra xem date range có thay đổi chưa để highlight button

```typescript
// Local state for date range to prevent auto-reload
const [localDateRange, setLocalDateRange] = useState<DateRange>(dateRange);

// Sync local state when parent date range changes
useEffect(() => {
  setLocalDateRange(dateRange);
}, [dateRange]);
```

#### Thêm Search Button
- **Button mới**: Thêm button "Tìm kiếm" giữa date inputs và dropdown filters
- **Visual Feedback**: 
  - Variant `default` (primary) khi có thay đổi
  - Variant `outline` (secondary) khi đã cập nhật
  - Text thay đổi: "Tìm kiếm" ↔ "Đã cập nhật"
- **Icon**: Sử dụng `Search` icon từ lucide-react

```typescript
<Button 
  variant={hasDateChanged ? "default" : "outline"}
  size="default" 
  onClick={handleSearch}
  disabled={loading}
  className="w-full"
>
  <Search className="h-4 w-4 mr-2" />
  {hasDateChanged ? 'Tìm kiếm' : 'Đã cập nhật'}
</Button>
```

#### Layout Update
- **Grid Update**: Thay đổi từ `grid-cols-4` → `grid-cols-5`
- **Label Trick**: Sử dụng `opacity-0` label để căn chỉnh button với các input khác

### 2. **Page Component** (`page.tsx`)

#### Thêm onSearch Callback
- Thêm prop `onSearch` vào FilterToolbar
- Hiển thị toast notification khi user click search
- Trigger re-calculation của inventory data

```typescript
onSearch={() => {
  toast.info('Đang tải dữ liệu...');
}}
```

## 🎯 Lợi Ích

### 1. **Hiệu Suất**
- ✅ Giảm số lần fetch/calculate không cần thiết
- ✅ Người dùng kiểm soát khi nào load dữ liệu
- ✅ Tránh re-render liên tục khi điều chỉnh date

### 2. **Trải Nghiệm Người Dùng**
- ✅ Visual feedback rõ ràng (button color change)
- ✅ User control: chủ động quyết định khi nào search
- ✅ Loading state được hiển thị rõ ràng

### 3. **Tính Năng Mới**
- ✅ Có thể thử nhiều date range trước khi commit
- ✅ Toast notification khi bắt đầu load
- ✅ Button disabled khi đang loading

## 🔄 Workflow Mới

### Before (Tự động)
```
User thay đổi start date 
  ↓
  Tự động trigger onDateRangeChange
  ↓
  useMemo tính toán lại inventory
  ↓
  Re-render toàn bộ table
```

### After (Manual với Button)
```
User thay đổi start date
  ↓
  Chỉ update localDateRange (không trigger re-calc)
  ↓
  User thay đổi end date (nếu cần)
  ↓
  Chỉ update localDateRange
  ↓
  User review dates
  ↓
  User click "Tìm kiếm"
  ↓
  onDateRangeChange được gọi
  ↓
  useMemo tính toán lại
  ↓
  Re-render table với data mới
```

## 🎨 UI/UX Details

### Button States

| Trạng Thái | Variant | Text | Icon | Disabled |
|------------|---------|------|------|----------|
| Có thay đổi | `default` (blue) | "Tìm kiếm" | Search | No |
| Đã cập nhật | `outline` (gray) | "Đã cập nhật" | Search | No |
| Đang loading | `default/outline` | (current) | Search | Yes |

### Layout (md breakpoint+)

```
Row 1: [Search Input ────────────────] [Cấu Hình] [Làm Mới] [Xuất Excel]

Row 2: [Từ Ngày] [Đến Ngày] [🔍 Tìm kiếm] [Nhóm Theo] [Sắp Xếp ↕]
```

## 🧪 Testing Scenarios

### Test Case 1: Date Change Detection
1. Mở trang Xuất Nhập Tồn
2. Thay đổi "Từ Ngày"
3. ✅ Button chuyển sang "Tìm kiếm" (blue)
4. Click button
5. ✅ Toast "Đang tải dữ liệu..." xuất hiện
6. ✅ Button chuyển thành "Đã cập nhật" (gray)

### Test Case 2: Multiple Changes
1. Thay đổi start date
2. Thay đổi end date
3. ✅ Button vẫn giữ state "Tìm kiếm"
4. Click search
5. ✅ Cả hai dates được apply cùng lúc

### Test Case 3: Loading State
1. Click "Tìm kiếm" (hoặc "Làm Mới")
2. ✅ Button "Tìm kiếm" bị disable
3. Đợi data load xong
4. ✅ Button enable trở lại

### Test Case 4: No Changes
1. Không thay đổi dates
2. ✅ Button hiển thị "Đã cập nhật" (gray)
3. Click button
4. ✅ Vẫn có thể search lại (refresh)

## 📝 Code Changes Summary

### Modified Files

1. **`components/FilterToolbar.tsx`**
   - Added: `useState`, `useEffect` imports
   - Added: `onSearch` prop
   - Added: `localDateRange` state
   - Added: `handleSearch` function
   - Added: `hasDateChanged` computed value
   - Modified: Date inputs to use `localDateRange`
   - Added: Search button
   - Modified: Grid from 4 to 5 columns

2. **`page.tsx`**
   - Added: `onSearch` prop to FilterToolbar
   - Added: Toast notification in search callback

### Lines Changed
- FilterToolbar: ~30 lines added/modified
- Page: ~5 lines added

## 🚀 Future Enhancements

### Possible Improvements
1. **Keyboard Support**: Enter key để trigger search
2. **Smart Date Validation**: Warn nếu end date < start date
3. **Quick Date Ranges**: Buttons cho "Hôm nay", "Tuần này", "Tháng này"
4. **Remember Last Search**: LocalStorage để lưu last successful search
5. **Debounced Auto-search**: Option để auto-search sau N giây không thay đổi

## 📚 Related Components

- `hooks/useInventoryData.ts` - Fetch dữ liệu invoice/details
- `utils/inventory.ts` - Tính toán inventory rows
- `components/InventoryTable.tsx` - Hiển thị kết quả
- `types.ts` - Type definitions

## ✅ Completion Checklist

- [x] Thêm local state cho date range
- [x] Thêm Search button với visual feedback
- [x] Update grid layout cho button mới
- [x] Thêm change detection logic
- [x] Thêm onSearch callback
- [x] Test UI responsiveness
- [x] Verify no TypeScript errors
- [x] Document changes

## 🎉 Kết Luận

Cập nhật này cải thiện đáng kể hiệu suất và trải nghiệm người dùng cho trang Xuất Nhập Tồn bằng cách:
- Giảm tải không cần thiết
- Tăng control cho user
- Visual feedback tốt hơn
- Maintain existing functionality

---
**Updated**: 2025-10-19  
**Version**: 1.0  
**Status**: ✅ Completed
