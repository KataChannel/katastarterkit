# Cập Nhật Menu Link Selector - Đổi Select thành Combobox

## Tổng Quan
Cập nhật component `DynamicMenuLinkSelector` theo rule #11: "Tất cả Select đổi thành Combobox"

## Thay Đổi

### File: `/frontend/src/components/menu/DynamicMenuLinkSelector.tsx`

**Import:**
- ❌ Xóa: `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`, `Search`
- ✅ Thêm: `Combobox` từ `@/components/ui/combobox`

**Components Đã Cập Nhật:**

1. **ProductListConditions** - Sắp xếp sản phẩm
   - Đổi từ Select → Combobox với tìm kiếm
   - Options: Mới Nhất, Bán Chạy, Xem Nhiều, Giá Tăng/Giảm Dần

2. **ProductSelector** - Chọn sản phẩm chi tiết
   - ❌ Xóa: Input tìm kiếm riêng + Select
   - ✅ Dùng: Combobox với tìm kiếm tích hợp
   - Loading state hiển thị Loader2 trong border
   - Fix: Dùng `product.name` thay vì `product.name || product.nameEn`

3. **BlogListConditions** - Sắp xếp bài viết
   - Đổi từ Select → Combobox
   - Options: Mới Nhất, Cũ Nhất, Xem Nhiều, Nổi Bật

4. **BlogSelector** - Chọn bài viết chi tiết
   - ❌ Xóa: Input tìm kiếm riêng + Select
   - ✅ Dùng: Combobox với tìm kiếm tích hợp

5. **CategorySelector** - Danh mục sản phẩm
   - Đổi từ Select → Combobox
   - Loading state với Loader2

6. **BlogCategorySelector** - Danh mục bài viết
   - Đổi từ Select → Combobox
   - Loading state với Loader2

### File: `/frontend/src/graphql/menu.queries.ts`

**Fix GraphQL Query:**
- ❌ Lỗi: `products(search: $search, limit: $limit)` - Unknown arguments
- ✅ Fix: `products(input: { filters: { search: $search }, limit: $limit })`
- ❌ Lỗi: Query field `nameEn` không tồn tại
- ✅ Fix: Xóa field `nameEn`, chỉ dùng `name`

## Cải Tiến UX

### Trước:
- Tìm kiếm và chọn là 2 bước riêng biệt
- Phải gõ → Enter → Chọn từ dropdown
- GraphQL error khi query products

### Sau:
- Tìm kiếm và chọn hợp nhất trong 1 Combobox
- Gõ và chọn ngay lập tức
- Mobile-friendly với touch support
- Keyboard navigation tốt hơn
- GraphQL query hoạt động đúng theo backend schema

## Bug Đã Fix

### GraphQL Execution Errors:
```
Unknown argument "search" on field "Query.products"
Unknown argument "limit" on field "Query.products"
Cannot query field "nameEn" on type "ProductType"
```

**Nguyên nhân:**
- Backend schema dùng `input: GetProductsInput` với nested `filters.search`
- ProductType không có field `nameEn`, chỉ có `name`

**Giải pháp:**
- Cập nhật query dùng đúng structure: `input: { filters: { search }, limit }`
- Xóa field `nameEn` khỏi query
- Cập nhật component dùng `product.name` thay vì fallback `nameEn`

## Tuân Thủ Rules

✅ Rule #1: Code Principal Engineer  
✅ Rule #10: Frontend chuẩn Shadcn UI Mobile First  
✅ Rule #11: Tất cả Select đổi thành Combobox  
✅ Rule #11: Giao diện tiếng việt  
✅ Rule #7: Bỏ qua testing  
✅ Rule #9: Chỉ tạo 1 file .md tổng hợp ngắn gọn

## Kết Quả
- ✅ 6 components cập nhật thành công
- ✅ GraphQL query fix đúng backend schema
- ✅ Không có lỗi TypeScript
- ✅ Không có lỗi GraphQL execution
- ✅ UX tốt hơn với Combobox có tìm kiếm tích hợp
- ✅ Loading states với Loader2 animation
- ✅ Placeholder và empty message tiếng Việt
