# Cập nhật tìm kiếm tiếng Việt và Pagination

## Tổng quan

Cập nhật hệ thống tìm kiếm sản phẩm để hỗ trợ:
- Tìm kiếm tiếng Việt có dấu và không dấu
- Server-side pagination (phân trang từ server)
- Server-side search (tìm kiếm từ server)

## Các thay đổi

### 1. Backend

#### a. Thêm file utility tiếng Việt
**File:** `backend/src/utils/vietnamese.util.ts`

Chức năng:
- `removeVietnameseDiacritics(str)`: Chuyển tiếng Việt có dấu sang không dấu
- `hasVietnameseDiacritics(str)`: Kiểm tra chuỗi có chứa dấu tiếng Việt
- `normalizeVietnameseSearch(str)`: Chuẩn hóa chuỗi tìm kiếm
- `createVietnameseSearchPatterns(searchTerm)`: Tạo patterns cho tìm kiếm

#### b. Cập nhật Prisma Schema
**File:** `backend/prisma/schema.prisma`

Thêm cột `nameNormalized` vào model Product để lưu tên sản phẩm đã được normalize:

```prisma
model Product {
  nameNormalized String? // Tên không dấu để hỗ trợ tìm kiếm tiếng Việt
  // ... other fields
  @@index([nameNormalized])
}
```

#### c. Cập nhật Product Service
**File:** `backend/src/services/product.service.ts`

- Import utility tiếng Việt
- Tự động tạo `nameNormalized` khi tạo sản phẩm mới
- Tự động cập nhật `nameNormalized` khi sửa tên sản phẩm
- Cập nhật `buildWhereClause()` để tìm kiếm trong cả `name` và `nameNormalized`

```typescript
// Trong buildWhereClause()
const searchConditions: Prisma.ProductWhereInput[] = [
  { name: { contains: searchTerm, mode: 'insensitive' } },
  { nameNormalized: { contains: searchNormalized, mode: 'insensitive' } },
  { description: { contains: searchTerm, mode: 'insensitive' } },
  { sku: { contains: searchTerm, mode: 'insensitive' } },
  { slug: { contains: searchNormalized, mode: 'insensitive' } },
];
```

#### d. Script cập nhật dữ liệu cũ
**File:** `backend/scripts/update-product-name-normalized.ts`

Script để cập nhật `nameNormalized` cho tất cả sản phẩm đã tồn tại.

**Cách chạy:**
```bash
cd backend
npx ts-node scripts/update-product-name-normalized.ts
```

### 2. Frontend

#### a. Thêm file utility tiếng Việt
**File:** `frontend/src/lib/vietnamese.ts`

Chức năng:
- `removeVietnameseDiacritics(str)`: Chuyển tiếng Việt có dấu sang không dấu
- `hasVietnameseDiacritics(str)`: Kiểm tra chuỗi có chứa dấu tiếng Việt
- `vietnameseSearch(text, searchTerm)`: Tìm kiếm hỗ trợ tiếng Việt
- `filterByVietnameseSearch(items, searchTerm, getSearchFields)`: Lọc mảng theo tiếng Việt

#### b. Cập nhật AdvancedTable
**File:** `frontend/src/components/ui/advanced-table/types.ts`

Thêm props mới:
- `onGlobalSearchChange`: Callback khi global search thay đổi
- `disableClientSideSearch`: Tắt tìm kiếm client-side khi dùng server-side

**File:** `frontend/src/components/ui/advanced-table/AdvancedTable.tsx`

- Thêm xử lý `onGlobalSearchChange` với debounce 300ms
- Thêm điều kiện `disableClientSideSearch` để bỏ qua client-side search

**File:** `frontend/src/components/ui/advanced-table/utils.ts`

- Cập nhật `globalSearch()` để hỗ trợ tìm kiếm tiếng Việt

#### c. Cập nhật Products Page
**File:** `frontend/src/app/admin/products/page.tsx`

Thêm:
- Import Select component và icons pagination
- `handleGlobalSearch()`: Handler cho server-side search
- `handlePageChange()`: Handler cho chuyển trang
- `handlePageSizeChange()`: Handler cho thay đổi số items/trang
- Pagination UI với các button và select

## Cách hoạt động

### Tìm kiếm tiếng Việt

1. **Server-side:** 
   - Khi người dùng nhập "rau sach" (không dấu)
   - Frontend gửi search term lên server
   - Server normalize search term và tìm trong cột `nameNormalized`
   - Sản phẩm "Rau Sạch" sẽ được tìm thấy

2. **Client-side:**
   - Khi dùng AdvancedTable với dữ liệu đã load
   - `TableUtils.globalSearch()` sẽ normalize cả search term và data
   - Tìm kiếm match cả có dấu và không dấu

### Pagination

1. Mặc định hiển thị 50 items/trang
2. Có thể chọn 20, 50, 100, hoặc 200 items/trang
3. Khi tìm kiếm, tự động reset về trang 1
4. Hiển thị: "Trang X / Y" và tổng số sản phẩm

## Ví dụ tìm kiếm

| Nhập vào | Kết quả |
|----------|---------|
| rau sach | Rau Sạch, Rau sạch organic, ... |
| Rau Sạch | Rau Sạch, Rau sạch organic, ... |
| cai thia | Cải thìa, Cải Thìa xanh, ... |
| bi do | Bí đỏ, Bí Đỏ sạch, ... |

## Lưu ý

1. Sau khi chạy migration (`prisma db push`), cần chạy script cập nhật `nameNormalized` cho dữ liệu cũ
2. Sản phẩm mới sẽ tự động có `nameNormalized`
3. Khi sửa tên sản phẩm, `nameNormalized` sẽ tự động được cập nhật
