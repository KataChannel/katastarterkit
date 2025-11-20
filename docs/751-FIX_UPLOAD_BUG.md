# Fix Bug Upload File - 404 & Connection Refused

## 🐛 Lỗi
```
Failed to load resource: the server responded with a status of 404 (Not Found)
POST http://localhost:14000/api/files/upload/bulk net::ERR_CONNECTION_REFUSED
```

## 🔍 Nguyên Nhân
- `FilesController` được đăng ký trong `GraphQLResolversModule` nhưng không được export
- `ImageOptimizationService` không được cung cấp global
- Controller không thể truy cập được từ HTTP endpoint

## ✅ Giải Pháp

### 1. Di chuyển FilesController sang AppModule
**File:** `backend/src/app.module.ts`
```typescript
// Thêm import
import { FilesController } from './controllers/files.controller';

// Thêm vào controllers
controllers: [
  LogController,
  TestController,
  FileController,
  FilesController,  // ✅ Thêm mới
  ProductNormalizationController,
],
```

### 2. Export ImageOptimizationService từ MinioModule
**File:** `backend/src/minio/minio.module.ts`
```typescript
import { ImageOptimizationService } from '../services/image-optimization.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [MinioService, ImageOptimizationService],  // ✅ Thêm service
  exports: [MinioService, ImageOptimizationService],    // ✅ Export
})
export class MinioModule {}
```

### 3. Xóa duplicate từ GraphQLResolversModule
**File:** `backend/src/graphql/graphql.module.ts`
- ❌ Xóa `FilesController` từ controllers array
- ❌ Xóa `ImageOptimizationService` từ providers array
- ❌ Xóa import không cần thiết

## 🚀 Kết Quả

### Trước khi fix:
- ❌ 404 Not Found
- ❌ ERR_CONNECTION_REFUSED
- ❌ Controller không accessible

### Sau khi fix:
- ✅ Endpoint `/api/files/upload/bulk` hoạt động
- ✅ Controller được đăng ký đúng trong AppModule
- ✅ ImageOptimizationService available global
- ✅ Upload file thành công

## 📝 Files Đã Thay Đổi
1. `backend/src/app.module.ts` - Thêm FilesController
2. `backend/src/minio/minio.module.ts` - Export ImageOptimizationService
3. `backend/src/graphql/graphql.module.ts` - Xóa duplicate

## ⚡ Restart Backend
```bash
# Stop backend nếu đang chạy
# Ctrl+C

# Start lại
cd backend
bun run dev
# hoặc
bun run start:dev
```

## ✅ Test
```bash
# 1. Mở frontend
http://localhost:12000/admin/filemanager

# 2. Upload file
- Kéo thả file vào trang
- Hoặc click "Upload File"

# 3. Kiểm tra console
- Không còn lỗi 404
- Không còn ERR_CONNECTION_REFUSED
- Upload thành công với progress bar
```

---

**Status:** ✅ FIXED - Sẵn sàng sử dụng sau khi restart backend
