# Cập Nhật Product Carousel Settings

## 📅 Ngày: 5 tháng 11, 2025

## 🎯 Mục Tiêu
Cập nhật Product Carousel Settings Dialog để:
1. Cho phép tùy chọn bảng dữ liệu nguồn (Data Source Table)
2. Cung cấp GraphQL query mẫu khi chọn Custom Query

## ✅ Thay Đổi

### 1. Types Definition
**File:** `/frontend/src/types/page-builder.ts`

**Thêm field mới:**
```typescript
export interface ProductCarouselBlockContent {
  // ... existing fields
  dataSourceTable?: string; // 🆕 Bảng dữ liệu nguồn
}
```

### 2. Settings Dialog
**File:** `/frontend/src/components/page-builder/blocks/ProductCarouselSettingsDialog.tsx`

#### a) Data Source Table Selection
- **Vị trí:** Filter Tab (trước Product Filter Type)
- **Chức năng:** Dropdown cho phép chọn bảng nguồn
- **Options:**
  - `ext_sanphamhoadon` (Sản phẩm) - Mặc định
  - `ext_listhoadon` (Danh sách hóa đơn)
  - `ext_detailhoadon` (Chi tiết hóa đơn)
  - `Product` (Sản phẩm E-commerce)
  - `Post` (Bài viết)
  - `custom` (Tùy chỉnh)

#### b) Custom GraphQL Query với Sample
- **Khi chọn:** Filter Type = "Custom GraphQL Query"
- **Hiển thị:**
  - Textarea để nhập GraphQL query (10 rows)
  - Button "📝 Load Sample Query"
  
**Sample Query được cung cấp:**
```graphql
query GetProducts($limit: Int) {
  ext_sanphamhoadon(
    limit: $limit
    orderBy: { createdAt: desc }
    where: {
      ten: { contains: "" }
      dgia: { gt: 0 }
    }
  ) {
    id
    ten
    ten2
    ma
    dvt
    dgia
    createdAt
  }
}
```

#### c) UI Improvements
- Textarea có background trắng (`bg-white`)
- Tăng rows từ 6 lên 10 cho Custom Query
- Thêm font-mono cho textarea (better code readability)
- Info box hiển thị Data Source Table động

## 🎨 UI/UX Enhancements

### Data Source Info
```
✅ Data Source: Products are loaded from table `{selectedTable}`
💡 Tip: Chọn "Custom GraphQL Query" để tùy chỉnh hoàn toàn query lấy dữ liệu
```

### Sample Query Button
- Variant: outline
- Size: sm
- Full width
- Icon: 📝
- Label: "Load Sample Query"

## 📐 Cấu Trúc Tab Filter (Cập Nhật)

```
Filter Tab
├── Data Source Table (Select) 🆕
│   └── Options: 6 bảng + custom
├── Product Filter Type (Select)
│   ├── All Products
│   ├── Featured Products
│   ├── Best Sellers
│   ├── By Category
│   └── Custom GraphQL Query
├── Category Input (conditional)
│   └── Show when filterType === 'category'
├── Custom Query Textarea (conditional) 🆕
│   ├── Textarea 10 rows
│   └── Sample Query Button
└── Filter Info Box (Dynamic) 🆕
```

## 🚀 Sử Dụng

### Bước 1: Chọn Data Source Table
```
1. Mở Product Carousel Settings
2. Vào tab "Filter"
3. Chọn bảng từ dropdown "Data Source Table"
```

### Bước 2: Sử dụng Custom Query
```
1. Chọn Filter Type = "Custom GraphQL Query"
2. Click "📝 Load Sample Query" để load query mẫu
3. Chỉnh sửa query theo nhu cầu
4. Save settings
```

## 📝 Rules Applied (từ rulepromt.txt)

✅ **Rule 1:** Code Like Senior - Clean, maintainable code  
✅ **Rule 2:** Dynamic GraphQL - Sử dụng dynamic queries  
✅ **Rule 3:** Bỏ qua testing - Không tạo test files  
✅ **Rule 4:** Không git - Không commit  
✅ **Rule 5:** 1 file .md - Document này  
✅ **Rule 6:** Shadcn UI + Mobile First + Responsive  
✅ **Rule 7:** Giao diện tiếng Việt  
✅ **Rule 8:** Dialog layout với scrollable content  

## 🔧 Technical Details

### Field Mapping
```typescript
dataSourceTable: string = 'ext_sanphamhoadon' // default
customQuery: string = '' // GraphQL query string
```

### State Management
```typescript
const [localSettings, setLocalSettings] = useState<ProductCarouselBlockContent>(settings);

const updateSettings = (updates: Partial<ProductCarouselBlockContent>) => {
  setLocalSettings(prev => ({ ...prev, ...updates }));
};
```

## ✨ Highlights

1. **Linh hoạt:** Có thể chọn bất kỳ bảng nào
2. **Sample Query:** Giúp người dùng hiểu cấu trúc GraphQL query
3. **Dynamic Info:** Info box cập nhật theo bảng được chọn
4. **User-friendly:** Button load sample giúp bắt đầu nhanh
5. **Professional:** UI/UX theo chuẩn Shadcn với color scheme rõ ràng

## 🎯 Kết Quả

- ✅ Data Source có thể tùy chọn bảng
- ✅ Product Filter Type có Custom GraphQL Query
- ✅ Query mẫu được cung cấp khi click button
- ✅ TypeScript types được cập nhật đầy đủ
- ✅ Không có compile errors
- ✅ Tuân thủ 100% rules từ rulepromt.txt

---

**Hoàn thành:** Cập nhật Product Carousel Settings thành công! 🎉
