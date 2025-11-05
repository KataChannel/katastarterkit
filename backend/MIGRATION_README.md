# 🚀 Migration Script - Chuyển đổi dữ liệu từ Website Cũ

## 📋 Tổng Quan

Script migration này chuyển đổi **780 sản phẩm** và **21 danh mục** từ website cũ (JSON format) sang cấu trúc Prisma hiện tại.

### Dữ liệu nguồn
```
backend/database-export/2025-11-05T08-24-56-131Z/
├── danhmuc.json (21 categories)
└── sanpham.json (780 products)
```

### Files đã tạo
✅ `migrate-old-data.ts` - Script migration chính
✅ `verify-migration.ts` - Script kiểm tra kết quả
✅ `run-migration.sh` - Bash script tự động
✅ `MIGRATION_GUIDE.md` - Hướng dẫn chi tiết
✅ `DATA_MAPPING_EXAMPLES.md` - Ví dụ mapping dữ liệu

---

## 🎯 Cách sử dụng

### Phương pháp 1: Tự động (Khuyên dùng)

```bash
cd backend
./run-migration.sh
```

Script sẽ:
1. ✅ Kiểm tra file dữ liệu
2. ✅ Hiển thị thống kê
3. ✅ Xác nhận trước khi chạy
4. ✅ Chạy migration
5. ✅ Verify kết quả

### Phương pháp 2: Thủ công

```bash
cd backend

# Bước 1: Chạy migration
bun run migrate:old-data

# Bước 2: Kiểm tra kết quả
bun run verify:migration

# Bước 3: Xem trong Prisma Studio
bun run db:studio
```

---

## 📊 Dữ liệu được chuyển đổi

### Categories (Danh mục)
- ✅ Tên, slug, mô tả
- ✅ Hình ảnh (extract từ JSON)
- ✅ Thứ tự hiển thị
- ✅ Trạng thái active/inactive
- ✅ Preserve original IDs

### Products (Sản phẩm)
- ✅ Thông tin cơ bản: tên, slug, mô tả
- ✅ Mã sản phẩm, SKU
- ✅ Giá bán, giá gốc (convert sang VND)
- ✅ Tồn kho (stock, stockInWare)
- ✅ Đơn vị tính (map to enum)
- ✅ Danh mục (auto-link)
- ✅ Hình ảnh chính + gallery
- ✅ Biến thể sản phẩm (variants)
- ✅ Features: Featured, New Arrival, Best Seller
- ✅ SEO ready
- ✅ Preserve timestamps

### Product Variants (Biến thể)
Từ field `Bienthe` JSON array:
- ✅ Mã SKU riêng
- ✅ Giá riêng cho từng variant
- ✅ Attributes: weight, unit, basePrice
- ✅ Auto-generate name từ khoiluong + dvt

### Product Images (Gallery)
Từ field `ListImage` JSON array:
- ✅ Multiple images per product
- ✅ Set primary image
- ✅ Ordering

---

## 🔧 Features Đặc Biệt

### 1. Smart Category Mapping
```typescript
// Nếu sản phẩm không có categoryId:
1. Tìm theo idDM field
2. Tìm theo Type field  
3. Tạo category mặc định "Sản phẩm khác"
```

### 2. Price Conversion
```typescript
// Giá trong JSON tính theo nghìn
oldPrice: 50  →  newPrice: 50,000 VND
```

### 3. Unit Mapping
```typescript
"Kg" → ProductUnit.KG
"Gam" → ProductUnit.G
"Cái" → ProductUnit.PIECE
"Hộp" → ProductUnit.BOX
"Túi" → ProductUnit.BAG
"Bó" → ProductUnit.BUNDLE
```

### 4. Image Extraction
Script tự động detect và extract URL từ nhiều format JSON:
```json
// Format 1: {"Hinhchinh": {"src": "..."}}
// Format 2: {"Main": "..."}
// Format 3: {"src": "..."}
```

### 5. Error Handling
- ⏭️ Skip sản phẩm đã tồn tại (by slug)
- 📝 Log lỗi nhưng tiếp tục
- 📊 Báo cáo tổng kết: created/skipped/errors

---

## 📈 Kết quả mong đợi

```bash
📁 Category Migration Summary:
   ✅ Created: 15-21
   ⏭️  Skipped: 0-6
   ❌ Errors: 0

📦 Product Migration Summary:
   ✅ Created: 600-780
   ⏭️  Skipped: 0-180
   ❌ Errors: 0

🔍 Verification:
   Total Categories: 21
   Total Products: 780
   Product Variants: ~1500
   Product Images: ~2000
```

---

## 🛡️ Safety Features

### Kiểm tra trước khi chạy
- ✅ File dữ liệu tồn tại
- ✅ Đếm số lượng records
- ✅ Xác nhận từ user

### Xử lý duplicate
- ✅ Check slug trước khi create
- ✅ Skip nếu đã tồn tại
- ✅ Log để review

### Preserve Data
- ✅ Giữ nguyên IDs từ hệ thống cũ
- ✅ Giữ nguyên timestamps
- ✅ Giữ nguyên relationships

---

## 🔍 Verification

Script `verify-migration.ts` sẽ kiểm tra:

✅ **Counts**: Categories, Products, Variants, Images
✅ **Samples**: Show 5 sample items
✅ **Statistics**: Price range, stock levels
✅ **Warnings**: Products without category
✅ **Relationships**: Category → Products count

---

## 📝 Examples

### Ví dụ 1: Category
```
Old: "RAU ĂN THÂN - LÁ" (Ordering: 3)
New: Category {
  name: "RAU ĂN THÂN - LÁ"
  slug: "rau-an-than-la"
  displayOrder: 3
  isActive: true
}
```

### Ví dụ 2: Product với Variants
```
Old: "Mắm ruốc xào" (giagoc: 50, Bienthe: 2 variants)
New: Product {
  name: "Mắm ruốc xào"
  price: 50,000 VND
  variants: [
    {name: "1Kg", price: 50,000},
    {name: "0.5Kg", price: 27,000}
  ]
}
```

Xem thêm: `DATA_MAPPING_EXAMPLES.md`

---

## 🚨 Troubleshooting

### Lỗi: "Data files not found"
```bash
ls -la backend/database-export/2025-11-05T08-24-56-131Z/
# Đảm bảo có danhmuc.json và sanpham.json
```

### Lỗi: "Unique constraint failed"
```bash
# Có slug trùng - Migration sẽ skip tự động
# Nếu muốn re-import: xóa record cũ trước
```

### Sản phẩm không có hình
```bash
# Check JSON format trong Image field
# URL có thể đã hết hạn - cần upload lại
```

---

## 📚 Đọc thêm

1. `MIGRATION_GUIDE.md` - Hướng dẫn chi tiết đầy đủ
2. `DATA_MAPPING_EXAMPLES.md` - Ví dụ mapping từng field
3. Prisma Schema: `backend/prisma/schema.prisma`

---

## ✅ Next Steps

Sau khi migration thành công:

1. **Verify trong Prisma Studio**
   ```bash
   bun run db:studio
   ```

2. **Kiểm tra GraphQL API**
   - Test queries: products, categories
   - Test filters, search

3. **Test Frontend**
   - Hiển thị danh sách sản phẩm
   - Hiển thị chi tiết sản phẩm
   - Variants switching

4. **Điều chỉnh nếu cần**
   - Upload hình ảnh mới
   - Cập nhật giá
   - Sắp xếp danh mục
   - SEO optimization

5. **Backup**
   ```bash
   bun run db:backup
   ```

---

## 🎉 Summary

✨ **Tự động chuyển đổi 780 sản phẩm + 21 danh mục**
✨ **Bảo toàn relationships và IDs**
✨ **Smart mapping với error handling**
✨ **Verification tự động**
✨ **Production ready**

Happy migrating! 🚀
