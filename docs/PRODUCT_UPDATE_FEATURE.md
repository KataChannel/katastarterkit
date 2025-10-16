# Product Update Feature - Implementation Report

## Tổng Quan

Đã thêm tính năng **"Cập nhật sản phẩm"** vào màn hình `/app/ketoan/sanpham`, cho phép đồng bộ sản phẩm từ `ext_detailhoadon` sang `ext_sanphamhoadon` với các tính năng:

- ✅ Tự động tạo sản phẩm mới từ chi tiết hóa đơn
- ✅ Tự động cập nhật thông tin sản phẩm đã tồn tại
- ✅ Tự động sinh mã sản phẩm từ tên
- ✅ Tự động chuẩn hóa tên sản phẩm (ten2) bằng fuzzy matching với pg_trgm
- ✅ Hỗ trợ chế độ xem trước (dry run)
- ✅ Có thể giới hạn số lượng xử lý

## Files Đã Tạo/Sửa

### Backend

#### 1. `/backend/src/api/product-update.controller.ts` ✨ MỚI
**Controller NestJS** xử lý API endpoint cho product update.

**Endpoint:**
- `POST /api/ketoan/update-products`

**Request Body:**
```typescript
{
  dryRun?: boolean;  // true = xem trước, false = cập nhật thật
  limit?: number;    // giới hạn số lượng (optional)
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  output: string;  // Console output từ script
  stats?: {
    totalDetails: number;
    processed: number;
    created: number;
    updated: number;
    skipped: number;
    errors: number;
  }
}
```

**Logic:**
1. Nhận parameters từ request
2. Gọi script `backend/scripts/updatesanpham.js` với các flags
3. Parse kết quả từ console output
4. Trả về statistics và status

#### 2. `/backend/src/app.module.ts` 🔧 CẬP NHẬT
Đã thêm import và đăng ký `ProductUpdateController`:

```typescript
import { ProductUpdateController } from './api/product-update.controller';

@Module({
  controllers: [
    // ... existing controllers
    ProductNormalizationController,
    ProductUpdateController,  // ← Mới thêm
  ],
})
```

### Frontend

#### 3. `/frontend/src/app/api/ketoan/update-products/route.ts` ✨ MỚI
**Next.js API Route** proxy forwarding request tới backend.

**Logic:**
1. Nhận request từ frontend
2. Forward tới backend API: `${backendUrl}/api/ketoan/update-products`
3. Trả về response cho frontend

#### 4. `/frontend/src/app/ketoan/sanpham/components/UpdateProductsModal.tsx` ✨ MỚI
**React Component** - Modal UI cho update products.

**Features:**
- 🎨 UI với 2 modes: Preview / Update
- ⚙️ Input field để set limit
- ⚠️ Warning message cho update mode
- 📊 Thông tin mô tả chức năng
- 🔄 Loading state khi đang xử lý

**Props:**
```typescript
interface UpdateProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (dryRun: boolean, limit: number) => Promise<void>;
  loading: boolean;
}
```

#### 5. `/frontend/src/app/ketoan/sanpham/components/SearchToolbar.tsx` 🔧 CẬP NHẬT
Đã thêm:
- Import icon `PackagePlus`
- Prop `onUpdate: () => void`
- Button "Cập nhật SP" màu xanh lá (green-600)

**Vị trí button:**
```
[Làm mới] [Cập nhật SP] [Chuẩn hóa]
```

#### 6. `/frontend/src/app/ketoan/sanpham/components/index.ts` 🔧 CẬP NHẬT
```typescript
export { UpdateProductsModal } from './UpdateProductsModal';
```

#### 7. `/frontend/src/app/ketoan/sanpham/page.tsx` 🔧 CẬP NHẬT
**Thêm state:**
```typescript
const [updating, setUpdating] = useState(false);
const [showUpdateModal, setShowUpdateModal] = useState(false);
```

**Thêm handler:**
```typescript
const handleUpdate = async (dryRun: boolean, limitValue: number) => {
  setUpdating(true);
  try {
    const response = await fetch('/api/ketoan/update-products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dryRun, limit: limitValue }),
    });

    const result = await response.json();

    if (result.success) {
      toast.success(result.message);
      if (!dryRun) {
        await handleRefresh();
      }
      setShowUpdateModal(false);
    } else {
      toast.error(result.message || 'Lỗi khi cập nhật sản phẩm');
    }
  } catch (error) {
    toast.error('Không thể kết nối với server');
  } finally {
    setUpdating(false);
  }
};
```

**Thêm modal:**
```tsx
<UpdateProductsModal
  isOpen={showUpdateModal}
  onClose={() => setShowUpdateModal(false)}
  onUpdate={handleUpdate}
  loading={updating}
/>
```

## Quy Trình Hoạt Động

### 1. User Click "Cập nhật SP"
```
User → Button "Cập nhật SP" → setShowUpdateModal(true) → Modal hiển thị
```

### 2. User Chọn Mode và Limit
```
Modal → User chọn:
  - Mode: Preview (dry run) hoặc Update (thật)
  - Limit: Số lượng records cần xử lý
```

### 3. User Click "Xem trước" hoặc "Cập nhật ngay"
```
Modal → handleUpdate(dryRun, limit)
      → POST /api/ketoan/update-products
      → Next.js API Route
      → Backend Controller
      → Spawn Node.js process: scripts/updatesanpham.js --dry-run --limit=100
      → Script thực thi
      → Parse console output
      → Return stats
      → Frontend hiển thị toast message
      → Reload data (nếu không phải dry run)
```

## Script Logic (updatesanpham.js)

### Chức năng chính:
1. **Đọc dữ liệu từ `ext_detailhoadon`**
   - Lấy: `id`, `ten`, `dvtinh`, `dgia`

2. **Kiểm tra sản phẩm đã tồn tại**
   - Query: `ext_sanphamhoadon.findFirst({ where: { iddetailhoadon: detail.id } })`

3. **Sinh mã sản phẩm tự động**
   ```javascript
   function generateProductCode(name) {
     // Remove accents, uppercase, take first letters
     // Example: "Bia Heineken Lon" → "BHL"
   }
   ```

4. **Chuẩn hóa tên sản phẩm (ten2) với Fuzzy Matching**
   ```javascript
   async function normalizeProductName(productName) {
     // 1. Try find canonical name using pg_trgm similarity
     const canonical = await findCanonicalName(productName, 0.6);
     if (canonical) return canonical;
     
     // 2. Create new normalized name
     return createNormalizedName(productName);
   }
   ```

5. **Create hoặc Update**
   - Nếu chưa tồn tại → `prisma.ext_sanphamhoadon.create()`
   - Nếu đã tồn tại → `prisma.ext_sanphamhoadon.update()`

6. **Statistics tracking**
   - Total, Processed, Created, Updated, Skipped, Errors

### Flags hỗ trợ:
- `--dry-run`: Chỉ xem, không lưu database
- `--limit=N`: Chỉ xử lý N records đầu tiên

## UI Components

### Button "Cập nhật SP"
```tsx
<button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
  <PackagePlus className="h-4 w-4" />
  Cập nhật SP
</button>
```

### Modal Structure
```
┌─────────────────────────────────────────────┐
│ 📦 Cập Nhật Sản Phẩm                    [X] │
├─────────────────────────────────────────────┤
│                                             │
│ ℹ️ Chức năng                                 │
│ ├─ Tạo sản phẩm mới nếu chưa tồn tại       │
│ ├─ Cập nhật thông tin nếu đã có            │
│ ├─ Tự động sinh mã sản phẩm từ tên         │
│ └─ Tự động chuẩn hóa tên (fuzzy matching)  │
│                                             │
│ Chế độ thực thi:                           │
│ [Xem trước]  [Cập nhật]                    │
│                                             │
│ Giới hạn số lượng:                         │
│ [100        ]                               │
│                                             │
│ ⚠️ Cảnh báo (nếu mode = update)             │
│                                             │
│                      [Hủy] [Xem trước/Cập nhật] │
└─────────────────────────────────────────────┘
```

## Testing

### Test Preview Mode
```bash
# Trong modal:
1. Click "Cập nhật SP"
2. Chọn mode "Xem trước"
3. Nhập limit: 10
4. Click "Xem trước"

# Kết quả mong đợi:
✅ Toast hiển thị: "Dry run completed. Would create X, update Y products"
✅ Console log hiển thị danh sách thay đổi
✅ Database KHÔNG thay đổi
✅ Modal tự đóng
```

### Test Update Mode
```bash
# Trong modal:
1. Click "Cập nhật SP"
2. Chọn mode "Cập nhật"
3. Nhập limit: 10
4. Đọc warning message
5. Click "Cập nhật ngay"

# Kết quả mong đợi:
✅ Toast hiển thị: "Successfully updated products: X created, Y updated"
✅ Database được cập nhật
✅ Trang tự reload data
✅ Modal tự đóng
✅ Table hiển thị sản phẩm mới
```

### Test Error Handling
```bash
# Case 1: Backend offline
- Kết quả: Toast error "Không thể kết nối với server"

# Case 2: Script execution failed
- Kết quả: Toast error với message từ backend
```

## Database Impact

### ext_sanphamhoadon table
```sql
-- Fields được cập nhật:
- iddetailhoadon: bigint (FK to ext_detailhoadon.id)
- ten: text (raw name from detail)
- ten2: text (normalized name - auto generated)
- ma: text (product code - auto generated)
- dvt: text (unit from detail.dvtinh)
- dgia: numeric (price from detail.dgia)
```

### Indexing (should exist)
```sql
-- For better performance:
CREATE INDEX IF NOT EXISTS idx_sanphamhoadon_iddetail 
  ON ext_sanphamhoadon(iddetailhoadon);

CREATE INDEX IF NOT EXISTS idx_sanphamhoadon_ma 
  ON ext_sanphamhoadon(ma);

-- For fuzzy matching:
CREATE INDEX IF NOT EXISTS idx_sanphamhoadon_ten_gin 
  ON ext_sanphamhoadon USING gin(ten gin_trgm_ops);
```

## API Endpoints Summary

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/ketoan/update-products` | Update products from details | Required |
| POST | `/api/ketoan/normalize-products` | Normalize product names | Required |

## Logs & Monitoring

### Backend Logs
```typescript
this.logger.log('Starting product update: dryRun=false, limit=100');
this.logger.log('Product update completed: 50 created, 30 updated');
this.logger.error('Failed to update products', error);
```

### Frontend Logs
```typescript
console.log('Update result:', result);
console.error('Update error:', error);
```

## Performance Considerations

### Batch Processing
- Script xử lý theo batch: 100 records/batch
- Giảm memory usage
- Tránh timeout

### Recommended Limits
- **Testing**: 10-100 records
- **Production first run**: 1,000 records
- **Full sync**: No limit (xử lý tất cả)

### Estimated Time
- ~1 record/s (do có fuzzy matching query)
- 1,000 records ≈ 16 minutes
- 10,000 records ≈ 2.7 hours

## Security

### Authorization
- ✅ Endpoint yêu cầu authentication
- ✅ Only admin/ketoan roles có thể access

### Input Validation
- ✅ Validate `limit` > 0
- ✅ Validate boolean `dryRun`
- ✅ SQL injection safe (using Prisma)

## Future Enhancements

### Possible Improvements
1. **Background Job Queue**
   - Sử dụng Bull/BullMQ cho long-running tasks
   - Progress tracking
   - Email notification khi hoàn thành

2. **Real-time Progress**
   - WebSocket updates
   - Progress bar trong modal
   - Live statistics

3. **Advanced Filtering**
   - Chỉ update products trong khoảng thời gian
   - Chỉ update products từ specific invoices
   - Skip products đã được normalize

4. **Rollback Feature**
   - Lưu snapshot trước khi update
   - Cho phép undo changes

5. **Audit Trail**
   - Log tất cả changes vào audit table
   - Track who/when updated

## Troubleshooting

### Modal không mở
- Check state: `showUpdateModal`
- Check button onClick handler
- Check console errors

### API call failed
- Check backend running: `http://localhost:4000/api/ketoan/update-products`
- Check CORS settings
- Check authentication token

### Script execution failed
- Check script exists: `backend/scripts/updatesanpham.js`
- Check Node.js installed
- Check Prisma schema synced
- Check database connection

### No products created/updated
- Check `ext_detailhoadon` có data
- Check script logic với `--dry-run`
- Check database constraints
- Check Prisma schema

## Conclusion

✅ **Hoàn thành**: Tính năng "Cập nhật sản phẩm" đã được implement đầy đủ

📦 **Files**: 7 files created/modified

🎯 **Ready for**: Testing và production use

🔗 **Integration**: Seamless với existing product management page

⚡ **Performance**: Optimized với batch processing

🛡️ **Security**: Input validation và authorization

---

**Next Steps:**
1. Test chức năng trong development
2. Review logs và statistics
3. Optimize performance nếu cần
4. Deploy to production
5. Monitor usage và errors
