# 📦 Trang Quản Lý Sản Phẩm Kế Toán

**Location:** `/app/ketoan/sanpham`  
**Date:** October 15, 2025  
**Status:** ✅ COMPLETE

---

## 🎯 Mô Tả

Trang quản lý sản phẩm từ hóa đơn với tính năng **Product Normalization** sử dụng **Fuzzy Matching với pg_trgm**.

### Tính Năng Chính

1. **Hiển thị danh sách sản phẩm** từ model `ext_sanphamhoadon`
2. **Chuẩn hóa tên sản phẩm** (Product Normalization) với fuzzy matching
3. **Tìm kiếm** sản phẩm theo tên, tên chuẩn hóa, mã sản phẩm
4. **Thống kê** tổng sản phẩm, đã chuẩn hóa, chưa chuẩn hóa
5. **Phân trang** dữ liệu

---

## 📊 Dữ Liệu Hiển Thị

### Bảng Sản Phẩm

| Column | Field | Type | Description |
|--------|-------|------|-------------|
| Mã SP | `ma` | String | Mã sản phẩm |
| Tên sản phẩm | `ten` | String | Tên gốc từ hóa đơn |
| Tên chuẩn hóa | `ten2` | String | Tên đã được chuẩn hóa |
| ĐVT | `dvt` | String | Đơn vị tính |
| Đơn giá | `dgia` | Decimal | Đơn giá sản phẩm |
| Trạng thái | - | Badge | Đã/Chưa chuẩn hóa |

### Thống Kê

- **Tổng sản phẩm**: Tổng số sản phẩm trong database
- **Đã chuẩn hóa**: Số sản phẩm có `ten2` != null
- **Chưa chuẩn hóa**: Số sản phẩm có `ten2` = null

---

## 🔧 Tính Năng Product Normalization

### Cách Hoạt Động

1. **Fuzzy Matching với pg_trgm**
   - Sử dụng PostgreSQL extension `pg_trgm`
   - So sánh độ tương đồng giữa các tên sản phẩm
   - Tự động nhóm các sản phẩm tương tự

2. **Chuẩn Hóa Tên**
   - Tìm tên đại diện (canonical name) cho mỗi nhóm
   - Cập nhật field `ten2` với tên chuẩn hóa
   - Giữ nguyên tên gốc trong `ten`

### Modes

#### 1. Xem Trước (Dry Run)
- Chạy script với flag `--dry-run`
- Hiển thị kết quả mà không cập nhật database
- Dùng để kiểm tra trước khi áp dụng

#### 2. Cập Nhật Thực Tế
- Chạy script và cập nhật database
- Cập nhật field `ten2` cho các sản phẩm
- Không thể hoàn tác

### Tùy Chọn

- **Số lượng sản phẩm**:
  - 10 sản phẩm (test nhỏ)
  - 100 sản phẩm (test trung bình)
  - 1000 sản phẩm (test lớn)
  - Tất cả (toàn bộ database)

---

## 🚀 Sử Dụng

### Từ Frontend

1. Truy cập: `http://localhost:3000/ketoan/sanpham`
2. Click button **"Chuẩn hóa tên sản phẩm"**
3. Chọn chế độ và số lượng
4. Click **"Xem trước"** hoặc **"Chạy ngay"**

### API Endpoint

**Frontend API:**
```typescript
POST /api/ketoan/normalize-products
Body: {
  dryRun: boolean,
  limit: number
}
```

**Backend API:**
```typescript
POST /api/ketoan/normalize-products
Body: {
  dryRun?: boolean,
  limit?: number,
  threshold?: number,
  force?: boolean
}
```

### CLI Script (Direct)

```bash
# Từ backend directory
cd backend

# Preview 10 products
node scripts/updateten2.js --dry-run --limit=10

# Update 100 products
node scripts/updateten2.js --limit=100

# Update all products
node scripts/updateten2.js

# Force re-normalize all
node scripts/updateten2.js --force

# Custom threshold (stricter matching)
node scripts/updateten2.js --threshold=0.7
```

### Interactive Menu

```bash
cd backend/scripts
./update-ten2.sh
```

Menu options:
1. Dry Run - Preview (10 products)
2. Dry Run - Preview (100 products)
3. Update - Small test (10 products)
4. Update - Medium test (100 products)
5. Update - Large test (1000 products)
6. Update - ALL products
7. Force Update - Re-normalize ALL
8. Custom - Enter your own options
9. Check current status
10. View README

---

## 📁 Files Structure

### Frontend Files

```
frontend/src/
├── app/
│   ├── ketoan/
│   │   └── sanpham/
│   │       └── page.tsx                 # Main page
│   └── api/
│       └── ketoan/
│           └── normalize-products/
│               └── route.ts              # API proxy
└── hooks/
    └── useDynamicQuery.ts               # Dynamic query hook
```

### Backend Files

```
backend/
├── src/
│   ├── api/
│   │   └── product-normalization.controller.ts  # API controller
│   ├── app.module.ts                            # Module registration
│   └── prisma/
│       └── schema.prisma                        # Database schema
└── scripts/
    ├── updateten2.js                            # Normalization script
    ├── update-ten2.sh                           # Interactive menu
    └── test-fuzzy-matching.js                   # Testing script
```

---

## 🗄️ Database Schema

```prisma
model ext_sanphamhoadon {
  id             String   @id @default(uuid())
  iddetailhoadon String?  // FK to ext_detailhoadon
  ten            String?  // Tên gốc
  ten2           String?  // Tên chuẩn hóa ⭐
  ma             String?  // Mã sản phẩm
  dvt            String?  // Đơn vị tính
  dgia           Decimal? // Đơn giá
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  @@index([iddetailhoadon])
  @@index([ma])
}
```

### Index for Fuzzy Matching

```sql
-- GIN index for trigram matching
CREATE INDEX ext_sanphamhoadon_ten_trgm_idx 
ON ext_sanphamhoadon 
USING GIN (ten gin_trgm_ops);

-- B-tree index for ten2 (normalized names)
CREATE INDEX ext_sanphamhoadon_ten2_idx 
ON ext_sanphamhoadon(ten2);
```

---

## 🔍 Example Queries

### Get Products with Normalization Status

```sql
-- All products
SELECT 
  ma,
  ten,
  ten2,
  dvt,
  dgia,
  CASE 
    WHEN ten2 IS NOT NULL THEN 'Đã chuẩn hóa'
    ELSE 'Chưa chuẩn hóa'
  END as status
FROM ext_sanphamhoadon
ORDER BY updatedAt DESC
LIMIT 50;
```

### Find Similar Products

```sql
-- Products similar to 'Laptop Dell'
SELECT 
  ten,
  ten2,
  similarity(ten, 'Laptop Dell') as score
FROM ext_sanphamhoadon
WHERE similarity(ten, 'Laptop Dell') > 0.3
ORDER BY score DESC
LIMIT 20;
```

### Group by Normalized Name

```sql
-- Count products by normalized name
SELECT 
  ten2,
  COUNT(*) as product_count,
  ARRAY_AGG(DISTINCT ten) as variations
FROM ext_sanphamhoadon
WHERE ten2 IS NOT NULL
GROUP BY ten2
ORDER BY product_count DESC
LIMIT 20;
```

### Statistics

```sql
-- Overall stats
SELECT 
  COUNT(*) as total,
  COUNT(ten2) as normalized,
  COUNT(*) - COUNT(ten2) as pending,
  ROUND(COUNT(ten2)::numeric / COUNT(*)::numeric * 100, 2) as normalized_percent
FROM ext_sanphamhoadon
WHERE ten IS NOT NULL;
```

---

## 🎨 UI Components

### Stats Cards
- Total products (blue)
- Normalized (green)
- Pending (orange)

### Table
- Sortable columns
- Status badges
- Formatted prices (VND)
- Responsive design

### Modal
- Mode selection (Preview/Update)
- Limit selector
- Info box with fuzzy matching explanation
- Action buttons

---

## 🧪 Testing

### Test Flow

1. **Prepare Test Data**
   ```bash
   # Ensure products exist
   cd backend
   node scripts/updatesanpham.js
   ```

2. **Test Normalization**
   ```bash
   # Preview mode
   node scripts/updateten2.js --dry-run --limit=10
   ```

3. **Verify Results**
   - Check frontend UI
   - Verify database
   - Check logs

### Expected Behavior

**Before Normalization:**
- `ten`: "Laptop Dell Inspiron 15"
- `ten2`: null

**After Normalization:**
- `ten`: "Laptop Dell Inspiron 15" (unchanged)
- `ten2`: "Laptop Dell Inspiron" (normalized)

---

## 📊 Performance

### Optimization

- **Indexes**: GIN index on `ten` for fast similarity search
- **Batch Processing**: Process in chunks (default 100)
- **Caching**: Cache similarity calculations
- **Pagination**: Load 50 products per page

### Estimated Time

| Products | Time |
|----------|------|
| 10 | ~1s |
| 100 | ~5s |
| 1,000 | ~30s |
| 10,000 | ~5min |

---

## 🐛 Troubleshooting

### Issue: Script không chạy

**Solution:**
```bash
# Kiểm tra pg_trgm extension
psql -U postgres -d katacore -c "SELECT * FROM pg_extension WHERE extname = 'pg_trgm';"

# Tạo extension nếu chưa có
psql -U postgres -d katacore -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;"
```

### Issue: Không hiển thị dữ liệu

**Solution:**
```bash
# Sync products from invoices
cd backend
node scripts/updatesanpham.js
```

### Issue: API timeout

**Solution:**
- Giảm limit (dùng 100 thay vì all)
- Tăng timeout trong fetch
- Chạy script trực tiếp từ CLI

---

## 📚 Related Documentation

- [Product Fuzzy Matching Complete](/docs/148-PRODUCT_FUZZY_MATCHING_COMPLETE.md)
- [Product Normalization Guide](/docs/147-PRODUCT_NORMALIZATION_GUIDE.md)
- [SanPham Sync Complete](/docs/146-SANPHAM_SYNC_COMPLETE.md)
- [Update SanPham README](/backend/scripts/UPDATESANPHAM_README.md)
- [Update Ten2 Script](/backend/scripts/update-ten2.sh)

---

## 🎯 Next Steps

### Enhancements

1. **Real-time Updates**
   - WebSocket for live progress
   - Server-Sent Events for status

2. **Advanced Filters**
   - Filter by normalization status
   - Filter by unit (DVT)
   - Price range filter

3. **Bulk Operations**
   - Batch approve normalizations
   - Manual override for specific products
   - Export/Import normalized names

4. **Analytics**
   - Chart showing normalization progress
   - Most common products
   - Price distribution by normalized name

---

## ✅ Checklist

- [x] Frontend page created
- [x] API endpoints implemented
- [x] Backend controller added
- [x] Module registration
- [x] UI components
- [x] Error handling
- [x] Loading states
- [x] Documentation

---

**Status:** 🟢 Production Ready  
**Last Updated:** October 15, 2025  
**Version:** 1.0.0
