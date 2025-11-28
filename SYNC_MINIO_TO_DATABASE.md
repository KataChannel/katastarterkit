# 🔄 Đồng Bộ MinIO Files vào Database - File Manager

## 📋 Tổng Quan

Script `sync-minio-to-db.ts` được tạo để đồng bộ các file từ MinIO bucket vào database, cho phép chúng hiển thị trong `/admin/filemanager`.

## 🎯 Vấn Đề

Sau khi upload hình ảnh lên MinIO bằng script `upload-temp-images-to-minio.ts`, các file này chỉ tồn tại trên MinIO storage nhưng chưa được lưu vào database. Do đó:

- ❌ Không hiển thị trong `/admin/filemanager`  
- ❌ Không thể quản lý qua giao diện admin
- ❌ Không thể search hoặc filter
- ❌ Không có metadata (tags, description, etc.)

## ✅ Giải Pháp

Script đồng bộ sẽ:

1. **Quét bucket MinIO** - List tất cả files trong `products/` prefix
2. **Tạo folder trong database** - Tạo folder "Products" để tổ chức
3. **Sync vào database** - Tạo records trong bảng `File` cho mỗi file
4. **Skip duplicates** - Bỏ qua files đã tồn tại trong DB

## 🚀 Cách Sử Dụng

### Chạy Script

```bash
cd backend
bun run sync-minio-to-db.ts
```

### Kết Quả

```
✅ Files added to database: 2,470
⏭️  Files skipped (already exist): 0
❌ Errors: 0
📦 Total files in MinIO: 2,470
📦 Total files in database: 2,470
```

## 📊 Thông Tin Database

### Bảng: File

Mỗi file được lưu với các thông tin:

```typescript
{
  id: "uuid",
  filename: "image-1.jpg",
  originalName: "image-1.jpg",
  mimeType: "image/jpeg",
  size: 123456,
  fileType: "IMAGE",
  url: "https://storage.rausachtrangia.com/rausach-uploads/products/rau-sach-cu-gung_909/image-1.jpg",
  bucket: "rausach-uploads",
  path: "products/rau-sach-cu-gung_909/image-1.jpg",
  userId: "user-id",
  folderId: "products-folder-id",
  createdAt: "2025-11-28T...",
  updatedAt: "2025-11-28T..."
}
```

### File Types Supported

- **IMAGE**: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`, `.bmp`, `.ico`
- **VIDEO**: Video files
- **AUDIO**: Audio files
- **DOCUMENT**: PDFs, documents, text files
- **OTHER**: All other file types

## 📁 Cấu Trúc Folder

```
/admin/filemanager
└── Products/                    # Folder được tạo tự động
    ├── products/               # Từ MinIO
    │   ├── rau-sach-cu-gung_909/
    │   │   ├── image-1.jpg
    │   │   ├── image-2.png
    │   │   └── ...
    │   ├── rau-sach-ca-chua_884/
    │   │   └── ...
    │   └── ...
```

## 🔧 Cấu Hình

### MinIO Settings

```typescript
const MINIO_ENDPOINT = '116.118.49.243';      // Internal IP
const MINIO_PORT = 12007;
const MINIO_ACCESS_KEY = 'minio-admin';
const MINIO_SECRET_KEY = 'minio-secret-2025';
const MINIO_BUCKET = 'rausach-uploads';
const MINIO_PUBLIC_URL = 'https://storage.rausachtrangia.com';
```

### Prefix to Scan

Mặc định script quét prefix `products/` để sync các hình ảnh sản phẩm:

```typescript
const minioObjects = await listMinioObjects('products/');
```

Có thể thay đổi prefix để sync folders khác.

## 🎨 Tính Năng

### 1. ✅ Auto-create Folder
- Tự động tạo folder "Products" nếu chưa tồn tại
- Gán owner là admin user

### 2. ✅ Duplicate Detection
- Kiểm tra URL để tránh trùng lặp
- Skip files đã tồn tại trong database

### 3. ✅ Metadata Detection
- Tự động detect MIME type từ extension
- Phân loại file type (IMAGE, VIDEO, etc.)
- Lưu size, path, bucket info

### 4. ✅ Batch Processing
- Process từng file một
- Log progress mỗi 100 files
- Error handling cho từng file

## 📈 Kết Quả (Lần Chạy: 28/11/2025)

```
🔄 Starting sync MinIO files to database...

✅ Using user: rausachtrangia@gmail.com
✅ Created "Products" folder
📂 Found 2,470 files in MinIO
   Found 0 files in database

📥 Syncing files...
   ✅ Added 100, 200, 300... files

📊 SYNC SUMMARY
================
✅ Files added: 2,470
⏭️  Skipped: 0
❌ Errors: 0
📦 Total in MinIO: 2,470
📦 Total in DB: 2,470
```

## 🌐 Truy Cập File Manager

Sau khi sync, truy cập:

```
https://shop.rausachtrangia.com/admin/filemanager
```

Hoặc local:

```
http://localhost:12000/admin/filemanager
```

### Các Tính Năng File Manager

1. **Browse Files** - Xem danh sách files dạng grid/list
2. **Search** - Tìm kiếm theo tên
3. **Filter** - Lọc theo type (Images, Videos, etc.)
4. **Preview** - Xem preview hình ảnh
5. **Download** - Tải file về
6. **Delete** - Xóa files
7. **Folder Management** - Quản lý folders
8. **Upload** - Upload files mới

## 🔄 Re-sync

Nếu cần sync lại hoặc sync thêm files mới:

```bash
cd backend
bun run sync-minio-to-db.ts
```

Script sẽ:
- ✅ Skip files đã tồn tại (bằng URL)
- ✅ Chỉ thêm files mới
- ✅ Không tạo duplicates

## 📝 Use Cases

### 1. Sau khi upload products images

```bash
# Bước 1: Upload images lên MinIO
bun run upload-temp-images-to-minio.ts

# Bước 2: Sync vào database
bun run sync-minio-to-db.ts
```

### 2. Sync bulk uploads

Nếu đã upload nhiều files trực tiếp lên MinIO (không qua app), chạy sync để đưa vào database:

```bash
bun run sync-minio-to-db.ts
```

### 3. Recovery

Nếu database bị mất nhưng MinIO còn, có thể restore bằng cách chạy sync:

```bash
bun run sync-minio-to-db.ts
```

## 🛠️ Customization

### Sync Prefix Khác

Để sync folder khác, sửa trong code:

```typescript
// Thay vì 'products/'
const minioObjects = await listMinioObjects('documents/');
```

### Thay Đổi Folder Name

```typescript
// Thay vì 'Products'
let productsFolder = await prisma.fileFolder.findFirst({
  where: {
    name: 'My Custom Folder',
    userId: adminUser.id,
  }
});
```

### Lọc File Types

Thêm filter trong loop:

```typescript
for (const obj of minioObjects) {
  // Chỉ sync images
  const mimeType = getMimeType(filename);
  if (!mimeType.startsWith('image/')) continue;
  
  // ... rest of code
}
```

## ⚠️ Lưu Ý

1. **Performance**: Sync 2,470 files mất ~30 giây
2. **Memory**: Script load tất cả files list vào memory
3. **User Owner**: Files được gán cho first admin user found
4. **Duplicates**: Dựa vào URL để detect duplicates

## 🐛 Troubleshooting

### Error: "No users found"

**Nguyên nhân**: Database không có user nào

**Giải pháp**: Tạo user trước:
```bash
# Sử dụng seed hoặc tạo user qua UI
```

### Error: MinIO connection failed

**Nguyên nhân**: MinIO không chạy hoặc cấu hình sai

**Giải pháp**:
```bash
# Check MinIO
docker ps | grep minio

# Check connection
curl http://116.118.49.243:12007
```

### Files không hiển thị trong File Manager

**Nguyên nhân**: Frontend cache hoặc GraphQL cache

**Giải pháp**:
```bash
# Hard refresh browser: Ctrl+Shift+R
# Hoặc clear browser cache
```

## 📁 Files Liên Quan

```
backend/
├── sync-minio-to-db.ts              # Script sync chính (MỚI)
├── upload-temp-images-to-minio.ts   # Upload images
└── temp-images/
    └── ...
```

## ✅ Kết Luận

Script đã hoàn thành:

1. ✅ Sync 2,470 hình ảnh từ MinIO vào database
2. ✅ Tạo folder "Products" để tổ chức
3. ✅ Files hiện có thể truy cập qua `/admin/filemanager`
4. ✅ Có thể quản lý, search, filter files qua UI

### Workflow Hoàn Chỉnh

```bash
# 1. Crawl images từ old site (optional)
bun run migrate-images-from-old-site.ts

# 2. Upload lên MinIO
bun run upload-temp-images-to-minio.ts

# 3. Sync vào database (MỚI)
bun run sync-minio-to-db.ts

# 4. Truy cập File Manager
# → https://shop.rausachtrangia.com/admin/filemanager
```

---

**Created**: 28/11/2025  
**Author**: GitHub Copilot  
**Status**: ✅ Completed  
**Script**: `backend/sync-minio-to-db.ts`  
**Files Synced**: 2,470 images
