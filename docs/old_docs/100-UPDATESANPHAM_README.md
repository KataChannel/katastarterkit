# Update SanPhamHoaDon Script

## 📋 Overview

Script tự động tạo mới hoặc cập nhật bảng `ext_sanphamhoadon` từ dữ liệu `ext_detailhoadon`.

**Nguồn dữ liệu:** `ext_detailhoadon` (Chi tiết hóa đơn)  
**Đích:** `ext_sanphamhoadon` (Danh mục sản phẩm)

---

## 🎯 Chức Năng

### Sync Data
- Đọc từng record trong `ext_detailhoadon`
- Tạo hoặc cập nhật sản phẩm tương ứng trong `ext_sanphamhoadon`
- Match theo `iddetailhoadon` (1-1 relationship)

### Dữ Liệu Được Sync

| Field Source (DetailHoaDon) | Field Target (SanPhamHoaDon) | Xử Lý |
|----------------------------|------------------------------|-------|
| `id` | `iddetailhoadon` | Foreign key |
| `ten` | `ten` | Tên sản phẩm (required) |
| `dvtinh` | `dvt` | Đơn vị tính |
| `dgia` | `dgia` | Đơn giá |
| Auto-generated | `ma` | Mã sản phẩm (từ tên) |

### Auto-Generate Mã Sản Phẩm

```javascript
Input:  "Laptop Dell Inspiron 15"
Output: "LDI15"

Input:  "Bàn phím cơ Keychron K2"
Output: "BPCKK"

Input:  "SAMSUNG"
Output: "SAMSUNG"
```

**Logic:**
1. Remove Vietnamese accents
2. Take first letter of each word
3. Max 10 characters
4. Uppercase

---

## 🚀 Usage

### Basic Usage
```bash
# Run from project root
node backend/scripts/updatesanpham.js
```

### Dry Run (Preview)
```bash
# See what would be changed without making changes
node backend/scripts/updatesanpham.js --dry-run
```

### With Limit
```bash
# Process only first 100 records
node backend/scripts/updatesanpham.js --limit=100

# Dry run with limit
node backend/scripts/updatesanpham.js --dry-run --limit=50
```

---

## 📊 Output Example

### Normal Run
```
🚀 Starting SanPhamHoaDon sync process...

📊 Found 1,247 detail records

✅ [1/1247] Created: Laptop Dell Inspiron 15
✅ [2/1247] Created: Bàn phím cơ Keychron K2
🔄 [3/1247] Updated: Mouse Logitech MX Master 3
⏭️  [4/1247] No changes: Samsung Galaxy S21
⏩ [5/1247] Skipped: Missing product name (ten)

📈 Progress: 500/1247 (40.1%)

============================================================
📊 SYNC STATISTICS
============================================================
Total details in database: 1,247
Processed:                 1,247
Created:                   856
Updated:                   378
Skipped:                   13
Errors:                    0
============================================================

✅ SYNC COMPLETED - 856 created, 378 updated

⏱️  Total time: 12.34s
```

### Dry Run
```
🚀 Starting SanPhamHoaDon sync process...

🔍 DRY RUN MODE - No changes will be made

📊 Found 1,247 detail records

✅ [1/1247] Created: Laptop Dell Inspiron 15
✅ [2/1247] Created: Bàn phím cơ Keychron K2
🔄 [3/1247] Updated: Mouse Logitech MX Master 3

============================================================
📊 SYNC STATISTICS
============================================================
Total details in database: 1,247
Processed:                 1,247
Created:                   856
Updated:                   378
Skipped:                   13
Errors:                    0
============================================================

🔍 DRY RUN COMPLETED - No changes were made

⏱️  Total time: 8.21s
```

---

## 🔍 Logic Flow

```
1. Count total ext_detailhoadon records
   ↓
2. Fetch in batches (100 records per batch)
   ↓
3. For each detail:
   ├─ Validate: Check if 'ten' (name) exists
   ├─ Check: Does sanphamhoadon already exist?
   │  ├─ YES → UPDATE existing record
   │  └─ NO  → CREATE new record
   ↓
4. Track statistics
   ↓
5. Print summary report
```

---

## ⚙️ Configuration

### Batch Size
```javascript
const BATCH_SIZE = 100; // Process 100 records at a time
```

### Validation Rules

**Required Fields:**
- `detail.id` - Must exist
- `detail.ten` - Must not be empty

**Skipped Records:**
- Missing ID
- Missing or empty product name

---

## 🎯 Use Cases

### 1. Initial Sync
```bash
# First time sync - populate sanphamhoadon from all details
node backend/scripts/updatesanpham.js
```

### 2. Preview Changes
```bash
# Check what will change before running
node backend/scripts/updatesanpham.js --dry-run
```

### 3. Incremental Update
```bash
# Update only recent records
node backend/scripts/updatesanpham.js --limit=100
```

### 4. Re-sync All
```bash
# Update all existing products with latest data
node backend/scripts/updatesanpham.js
```

---

## 📝 Database Schema

### ext_detailhoadon (Source)
```prisma
model ext_detailhoadon {
  id String @id @default(uuid())
  
  // Product info
  ten      String?  // Tên hàng hóa/dịch vụ
  dvtinh   String?  // Đơn vị tính
  dgia     Decimal? // Đơn giá
  
  // Other fields...
  sluong   Decimal? // Số lượng
  thtien   Decimal? // Thành tiền
  tsuat    Decimal? // Thuế suất
  
  ext_sanphamhoadon ext_sanphamhoadon[]
}
```

### ext_sanphamhoadon (Target)
```prisma
model ext_sanphamhoadon {
  id String @id @default(uuid())
  
  iddetailhoadon String?  // FK to ext_detailhoadon
  ten            String?  // Tên sản phẩm
  ten2           String?  // Tên sản phẩm 2
  ma             String?  // Mã sản phẩm (auto-generated)
  dvt            String?  // Đơn vị tính
  dgia           Decimal? // Đơn giá
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  detailhoadon ext_detailhoadon? @relation(...)
}
```

---

## 🐛 Error Handling

### Common Errors

**1. Missing Product Name**
```
⏩ Skipped: Missing product name (ten)
```
**Solution:** Detail record has no `ten` field - will be skipped

**2. Database Connection Error**
```
❌ Fatal error: Can't reach database server
```
**Solution:** Check database connection in `.env`

**3. Unique Constraint Error**
```
❌ Error: Unique constraint failed on iddetailhoadon
```
**Solution:** Should not happen (upsert logic), check for data corruption

---

## 📊 Performance

### Benchmarks (estimated)

| Records | Time (est.) | Memory |
|---------|-------------|--------|
| 100 | ~1s | Low |
| 1,000 | ~8-10s | Low |
| 10,000 | ~80-90s | Medium |
| 100,000 | ~15-20min | High |

**Optimization:**
- Batch processing (100 records/batch)
- Indexed foreign keys
- Selective field loading

---

## ✅ Verification

### Check Results
```sql
-- Count products created
SELECT COUNT(*) FROM ext_sanphamhoadon;

-- Check products with details
SELECT 
  sp.id,
  sp.ma,
  sp.ten,
  sp.dvt,
  sp.dgia,
  d.ten as detail_name
FROM ext_sanphamhoadon sp
LEFT JOIN ext_detailhoadon d ON sp.iddetailhoadon = d.id
LIMIT 10;

-- Find orphaned products (no detail)
SELECT * FROM ext_sanphamhoadon 
WHERE iddetailhoadon IS NULL;

-- Find details without products
SELECT d.* FROM ext_detailhoadon d
LEFT JOIN ext_sanphamhoadon sp ON sp.iddetailhoadon = d.id
WHERE sp.id IS NULL
LIMIT 10;
```

---

## 🔧 Maintenance

### Re-run Script
Safe to run multiple times:
- Existing products will be **updated**
- New products will be **created**
- No duplicates (1-1 relationship)

### Clean Up
```sql
-- Delete all products
DELETE FROM ext_sanphamhoadon;

-- Then re-run script
node backend/scripts/updatesanpham.js
```

---

## 📚 Related Files

- **Script:** `backend/scripts/updatesanpham.js`
- **Schema:** `backend/prisma/schema.prisma`
- **Models:** `ext_detailhoadon`, `ext_sanphamhoadon`

---

## 🎓 Best Practices

1. **Always dry-run first** for large datasets
   ```bash
   node backend/scripts/updatesanpham.js --dry-run
   ```

2. **Use limits for testing**
   ```bash
   node backend/scripts/updatesanpham.js --limit=10
   ```

3. **Monitor progress** for large syncs
   - Progress updates every 500 records
   - Check statistics at end

4. **Backup before full sync** (production)
   ```bash
   pg_dump database > backup.sql
   ```

---

## 📞 Support

**Issues:**
- Missing product names → Check source data quality
- Slow performance → Reduce batch size or use limit
- Memory issues → Process in smaller batches

**Logs:**
- Console output shows real-time progress
- Errors displayed with detail IDs
- Final statistics summary

---

**Status:** ✅ Ready to use  
**Version:** 1.0  
**Last Updated:** 11 tháng 10, 2025
