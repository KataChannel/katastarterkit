# Migration từ Website Cũ

## Tổng quan

Script này chuyển dữ liệu từ website cũ (JSON exports) sang cấu trúc Prisma mới:

- **danhmuc.json** → `Category` model (21 danh mục)
- **sanpham.json** → `Product` model (780 sản phẩm)

## Cấu trúc dữ liệu

### Old Data (JSON)
```
backend/database-export/2025-11-05T08-24-56-131Z/
├── danhmuc.json     (21 categories)
└── sanpham.json     (780 products)
```

### New Schema (Prisma)
```prisma
Category {
  - id, name, slug
  - description, image, icon
  - parentId (hierarchy support)
  - SEO fields
  - Display: displayOrder, isActive, isFeatured
}

Product {
  - id, name, slug
  - description, shortDesc
  - productCode (MaSP)
  - price, originalPrice, costPrice, vat
  - stock, stockInWare
  - unit (enum: KG, G, BUNDLE, PIECE, BAG, BOX)
  - categoryId
  - thumbnail
  - variants[] (ProductVariant)
  - images[] (ProductImage)
  - SEO fields
  - Display: isFeatured, isNewArrival, isBestSeller
}
```

## Cách chạy Migration

### 1. Kiểm tra dữ liệu nguồn

```bash
cd backend
ls -la database-export/2025-11-05T08-24-56-131Z/
```

Đảm bảo có 2 files:
- `danhmuc.json`
- `sanpham.json`

### 2. Chạy Migration

```bash
# Di chuyển vào thư mục backend
cd backend

# Chạy migration script
bun run migrate-old-data.ts
```

### 3. Xác minh kết quả

```bash
# Kiểm tra dữ liệu đã import
bun run verify-migration.ts
```

## Các tính năng Migration

### Categories (Danh mục)

✅ **Import:**
- Tên danh mục (Title → name)
- Slug (tự động generate nếu thiếu)
- Mô tả (Mota → description)
- Hình ảnh (extract từ JSON Image field)
- Thứ tự hiển thị (Ordering → displayOrder)
- Trạng thái (Status → isActive)

✅ **Bảo toàn:**
- ID gốc (để giữ liên kết với products)
- Timestamps (CreateAt, UpdateAt)

⏭️ **Skip:**
- Danh mục đã tồn tại (check by slug)
- Danh mục không phải sản phẩm (Type != "sanpham")

### Products (Sản phẩm)

✅ **Import:**
- Thông tin cơ bản: name, slug, description
- Mã sản phẩm: SKU, MaSP → productCode
- Giá: giagoc → price, originalPrice
- Tồn kho: Soluong → stock, SoluongTT → stockInWare
- Đơn vị: dvt → unit (map to enum)
- Danh mục: idDM → categoryId
- Hình ảnh chính: Image → thumbnail
- Hình ảnh phụ: ListImage → ProductImage[]
- Biến thể: Bienthe → ProductVariant[]

✅ **Features:**
- isFeatured: Noibat === 1
- isNewArrival: Moi === 1
- isBestSeller: Banchay > 0

✅ **Stats:**
- viewCount: View
- displayOrder: Ordering

### Product Variants (Biến thể)

Từ field `Bienthe` (JSON array):
```json
[{
  "MaSP": "I100633-1",
  "gia": 50000,
  "dvt": "Kg",
  "GiaCoSo": 45000,
  "khoiluong": 1
}]
```

Import thành:
```prisma
ProductVariant {
  name: "1Kg"
  sku: "I100633-1"
  price: 50000000 (VND)
  attributes: {
    weight: 1,
    unit: "Kg",
    basePrice: 45000
  }
}
```

### Product Images (Hình ảnh)

Từ field `ListImage` (JSON array):
```json
[{
  "src": "https://images.rausachtrangia.com/...",
  "alt": "...",
  "order": 0
}]
```

Import thành:
```prisma
ProductImage {
  url: "https://..."
  isPrimary: true (first image)
  order: 0
}
```

## Xử lý đặc biệt

### 1. Category Mapping

Nếu sản phẩm không có `idDM`:
1. Tìm category theo `Type` field
2. Nếu không tìm thấy → tạo category mặc định "Sản phẩm khác"

### 2. Price Conversion

Giá trong JSON thường tính theo nghìn (VD: 50 = 50,000 VND)

```typescript
price: oldPrice * 1000
```

### 3. Unit Mapping

```typescript
const unitMap = {
  'Kg': ProductUnit.KG,
  'Gam': ProductUnit.G,
  'Cái': ProductUnit.PIECE,
  'Hộp': ProductUnit.BOX,
  'Túi': ProductUnit.BAG,
  'Bó': ProductUnit.BUNDLE,
}
```

### 4. Image Extraction

Field `Image` có thể có nhiều format:
```json
// Format 1: Hinhchinh
{
  "Hinhchinh": {
    "src": "https://...",
    "name": "..."
  }
}

// Format 2: Main
{
  "Main": "https://..."
}

// Format 3: Direct
{
  "src": "https://..."
}
```

Script tự động detect và extract.

### 5. Error Handling

- **Skip existing**: Sản phẩm/danh mục đã tồn tại (by slug)
- **Log errors**: Ghi lại lỗi nhưng tiếp tục migration
- **Summary report**: Báo cáo cuối: created/skipped/errors

## Kết quả mong đợi

Sau khi chạy migration thành công:

```
📊 Category Migration Summary:
   ✅ Created: 15-21
   ⏭️  Skipped: 0-6
   ❌ Errors: 0

📊 Product Migration Summary:
   ✅ Created: 600-780
   ⏭️  Skipped: 0-180
   ❌ Errors: 0
```

## Rollback

Nếu cần rollback (xóa dữ liệu đã import):

```bash
# Xóa products và categories
bun run prisma studio

# Hoặc SQL:
DELETE FROM product_variants;
DELETE FROM product_images;
DELETE FROM products;
DELETE FROM categories WHERE slug != 'your-manual-categories';
```

## Troubleshooting

### Lỗi: "Data files not found"
```bash
# Kiểm tra đường dẫn
ls -la backend/database-export/2025-11-05T08-24-56-131Z/
```

### Lỗi: "Unique constraint failed"
- Có slug trùng → Migration skip tự động
- Nếu muốn update: xóa record cũ trước

### Lỗi: "Foreign key constraint"
- Category không tồn tại → Script tự tạo default category

### Sản phẩm không có hình
- Check JSON format trong `Image` field
- Có thể URL hình đã hết hạn/bị xóa

## Next Steps

Sau migration:

1. ✅ Verify data: `bun run verify-migration.ts`
2. 🔍 Review trong Prisma Studio: `bun run prisma studio`
3. 📸 Upload hình ảnh mới nếu cần
4. 🏷️ Kiểm tra và điều chỉnh categories
5. 💰 Review pricing (nếu conversion rate sai)
6. 🔗 Test frontend hiển thị sản phẩm

## Notes

- Migration **preserve original IDs** để giữ relationships
- Timestamps được giữ nguyên từ data cũ
- Status mapping: `Status === 1` → `isActive: true`
- Default category được tạo tự động nếu cần
