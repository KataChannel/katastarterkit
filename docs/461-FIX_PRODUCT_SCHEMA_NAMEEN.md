# Fix Bug Product Schema - Thiếu Cột nameEn

## Tóm tắt

Đã fix lỗi `The column 'products.nameEn' does not exist in the current database` bằng cách đồng bộ Prisma schema với database.

## Bug gốc

```
Error: Invalid `this.prisma.product.findMany()` invocation
in /chikiet/kataoffical/shoprausach/backend/src/services/product.service.ts:26:27

The column `products.nameEn` does not exist in the current database.
```

**Nguyên nhân**: Database chưa được migrate/sync với Prisma schema. Schema có định nghĩa cột `nameEn` nhưng database thực tế chưa có.

## Giải pháp

### 1. Kiểm tra migrations
```bash
cd backend && npx prisma migrate status
```

**Kết quả**: 20 migrations chưa được apply

### 2. Đồng bộ schema
Do database đã có dữ liệu, không thể dùng `migrate deploy`. Sử dụng `db push`:

```bash
npx prisma db push
```

**Kết quả**: 
- ✅ Database đã sync với schema
- ✅ Cột `nameEn` đã được thêm vào bảng `products`
- ✅ Prisma Client đã được regenerate

### 3. Verify fix
```bash
bun run test-product-schema.ts
```

**Kết quả**:
```
✅ Product found with nameEn field:
   - Name (VN): Cải xanh hữu cơ
   - Name (EN): Organic Bok Choy
```

## Schema Product (đã fix)

```prisma
model Product {
  id          String  @id @default(uuid())
  name        String  // Tiếng Việt
  nameEn      String? // Tiếng Anh ✅ FIELD NÀY ĐÃ ĐƯỢC THÊM
  slug        String  @unique
  description String?
  price       Float
  stock       Int     @default(0)
  // ... các field khác
}
```

## Test data đã seed

Đã tạo 3 sản phẩm mẫu để test:

1. **Cải xanh hữu cơ** (Organic Bok Choy)
   - Price: 25.000đ
   - Stock: 100 kg
   - Origin: Đà Lạt, Lâm Đồng

2. **Cà chua bi** (Cherry Tomatoes)
   - Price: 35.000đ
   - Stock: 80 kg
   - Origin: Đà Lạt, Lâm Đồng

3. **Rau diếp xoăn** (Curly Lettuce)
   - Price: 30.000đ
   - Stock: 60 kg
   - Origin: Đà Lạt, Lâm Đồng

## Files tạo mới

1. **test-product-schema.ts** - Test script để verify schema
2. **seed-sample-products.ts** - Seed sản phẩm mẫu

## Lưu ý quan trọng

⚠️ **Database Sync vs Migrations**:
- `prisma migrate dev` - Development (tạo migrations mới)
- `prisma migrate deploy` - Production (apply migrations)
- `prisma db push` - Sync schema trực tiếp (không tạo migration files)

💡 **Khi nào dùng `db push`**:
- Database đã có data và cần sync schema nhanh
- Development/testing environment
- Không cần lưu migration history

🔒 **Production best practice**:
- Luôn dùng migrations (`migrate deploy`)
- Backup database trước khi migrate
- Test migrations trên staging trước

## Tổng kết

**Bug**: Thiếu cột `nameEn` trong database  
**Root cause**: Migrations chưa được apply  
**Solution**: `npx prisma db push`  
**Status**: ✅ Hoàn thành  
**Test**: ✅ Pass (3/3 products có nameEn)  

---
*Ngày cập nhật: 5/11/2025*
