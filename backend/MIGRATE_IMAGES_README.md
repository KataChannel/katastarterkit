# Migration Hình Ảnh Sản Phẩm từ Website Cũ

## Tổng Quan

Script này giúp migrate hình ảnh sản phẩm từ website cũ (https://rausachtrangia.com) sang hệ thống mới với MinIO storage.

## Quy Trình Migration

```
Old Website → Crawl Data → Download Images → Upload to MinIO → Update Database → Verify
```

### Bước 1: Crawl Dữ Liệu
- Truy cập trang danh sách sản phẩm
- Thu thập links của từng sản phẩm
- Trích xuất tên, slug, và URLs hình ảnh
- Lưu dữ liệu vào `temp-images/crawled-products.json`

### Bước 2: Download Hình Ảnh
- Tải từng hình ảnh về local
- Lưu theo cấu trúc: `temp-images/{product-slug}/image-{n}.{ext}`
- Hỗ trợ các định dạng: JPG, PNG, WebP, GIF

### Bước 3: Upload lên MinIO
- Upload vào bucket: `rausach-uploads`
- Cấu trúc: `products/{product-slug}/image-{n}.{ext}`
- URL mới: `https://storage.rausachtrangia.com/rausach-uploads/products/...`
- Lưu mapping: `temp-images/image-url-mapping.json`

### Bước 4: Cập Nhật Database
- Tìm sản phẩm trong DB theo slug/name (fuzzy match)
- Cập nhật `featuredImage` (hình đầu tiên)
- Cập nhật `images` array (tất cả hình)
- Lưu kết quả: `temp-images/mapping-results.json`

### Bước 5: Verify
- Đếm số sản phẩm có/không có hình
- Hiển thị sample sản phẩm đã migrate
- Báo cáo kết quả chi tiết

## Cài Đặt Dependencies

```bash
cd backend

# Install required packages
bun add axios cheerio minio @prisma/client
bun add -D @types/node
```

## Cấu Hình

### 1. MinIO Configuration

Đảm bảo MinIO đang chạy và có thông tin kết nối đúng:

```typescript
// Trong file migrate-images-from-old-site.ts
const MINIO_ENDPOINT = '127.0.0.1';      // Hoặc IP server
const MINIO_PORT = 12007;
const MINIO_ACCESS_KEY = 'minio-admin';
const MINIO_SECRET_KEY = 'minio-secret-2025';
const MINIO_BUCKET = 'rausach-uploads';
```

### 2. Database Connection

Đảm bảo có file `.env` với DATABASE_URL:

```bash
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:12003/rausachcore"
```

### 3. Website Selectors

**QUAN TRỌNG**: Cần điều chỉnh CSS selectors trong script theo cấu trúc HTML thực tế của website:

```typescript
// Tìm product links
$('a[href*="/san-pham/"]')  // Điều chỉnh selector này

// Tìm product images
$product('img[class*="product"]')  // Điều chỉnh selector này
$product('.product-gallery img, .gallery img')  // Điều chỉnh selector này
```

## Cách Chạy

### Option 1: Chạy Full Migration (Khuyên Dùng cho lần đầu - TEST)

```bash
cd backend

# Chạy script với 10 sản phẩm đầu tiên để test
bun run migrate-images-from-old-site.ts
```

### Option 2: Chạy từng bước riêng lẻ

Bạn có thể import và chạy từng function:

```typescript
import { 
  crawlProductImages, 
  downloadImages, 
  uploadToMinio, 
  mapImagesToProducts,
  verifyMigration 
} from './migrate-images-from-old-site';

// Chỉ crawl
const products = await crawlProductImages();

// Hoặc chỉ verify
await verifyMigration();
```

### Option 3: Điều chỉnh số lượng sản phẩm

Mở file và tìm dòng này để điều chỉnh:

```typescript
for (const productUrl of productLinks.slice(0, 10)) { // <-- Thay đổi số 10
```

## Output Files

Script tạo các file kết quả trong thư mục `temp-images/`:

```
temp-images/
├── crawled-products.json      # Dữ liệu sản phẩm từ website cũ
├── image-url-mapping.json     # Map URL cũ → URL mới
├── mapping-results.json       # Kết quả update database
└── {product-slug}/            # Hình ảnh đã download
    ├── image-1.jpg
    ├── image-2.jpg
    └── ...
```

## Ví Dụ Output

### crawled-products.json
```json
[
  {
    "productName": "Rau sạch cải thảo",
    "productSlug": "rau-sach-cai-thao",
    "oldImageUrls": [
      "https://rausachtrangia.com/images/products/cai-thao-1.jpg",
      "https://rausachtrangia.com/images/products/cai-thao-2.jpg"
    ],
    "productUrl": "https://rausachtrangia.com/san-pham/rau-sach-cai-thao"
  }
]
```

### image-url-mapping.json
```json
{
  "https://rausachtrangia.com/images/products/cai-thao-1.jpg": 
    "https://storage.rausachtrangia.com/rausach-uploads/products/rau-sach-cai-thao/image-1.jpg"
}
```

### mapping-results.json
```json
[
  {
    "productName": "Rau sạch cải thảo",
    "dbProductId": 123,
    "dbProductName": "Cải Thảo Organic",
    "status": "success",
    "imageCount": 2
  }
]
```

## Xử Lý Lỗi

### 1. Lỗi Crawl (403, 404)

**Nguyên nhân**: Website block bot hoặc URL không đúng

**Giải pháp**:
```typescript
// Thêm delay và retry
await new Promise(resolve => setTimeout(resolve, 2000));

// Thử user agent khác
headers: {
  'User-Agent': 'Mozilla/5.0 ...',
  'Referer': 'https://rausachtrangia.com'
}
```

### 2. Lỗi Download Timeout

**Nguyên nhân**: Hình ảnh quá lớn hoặc mạng chậm

**Giải pháp**:
```typescript
// Tăng timeout
axios.get(imageUrl, {
  timeout: 60000, // 60 giây
})
```

### 3. Lỗi Upload MinIO

**Nguyên nhân**: Bucket không tồn tại hoặc permission sai

**Giải pháp**:
```bash
# Kiểm tra MinIO
docker ps | grep minio

# Test kết nối
curl http://127.0.0.1:12007/minio/health/live
```

### 4. Lỗi Không Tìm Thấy Sản Phẩm trong DB

**Nguyên nhân**: Slug/name không khớp

**Giải pháp**:
- Xem file `mapping-results.json` để biết sản phẩm nào không match
- Tạo mapping thủ công hoặc cập nhật slug trong DB
- Chạy lại bước 4 với mapping đã sửa

## Kiểm Tra Kết Quả

### 1. Kiểm tra MinIO
```bash
# SSH vào server
ssh root@116.118.49.243

# List files trong bucket
docker exec -it minio mc ls local/rausach-uploads/products/
```

### 2. Kiểm tra Database
```sql
-- Đếm sản phẩm có hình
SELECT COUNT(*) FROM "Product" WHERE "featuredImage" IS NOT NULL;

-- Xem sample
SELECT id, name, "featuredImage", array_length(images, 1) as image_count 
FROM "Product" 
WHERE "featuredImage" LIKE '%storage.rausachtrangia.com%'
LIMIT 10;
```

### 3. Kiểm tra trên Website
- Truy cập https://shop.rausachtrangia.com
- Vào trang sản phẩm
- Verify hình ảnh hiển thị đúng

## Advanced: Chạy Migration trên Server

### Option 1: SSH và chạy trực tiếp
```bash
ssh root@116.118.49.243

cd /opt/shoprausach/backend
bun run migrate-images-from-old-site.ts
```

### Option 2: Chạy trong Docker container
```bash
# Copy script vào container
docker cp migrate-images-from-old-site.ts shopbackend:/app/

# Exec vào container
docker exec -it shopbackend bash

# Chạy script
cd /app
bun run migrate-images-from-old-site.ts
```

## Lưu Ý Quan Trọng

### ⚠️ Trước Khi Chạy Production

1. **Backup Database**:
   ```bash
   cd backend
   bun run backup-database.sh
   ```

2. **Test với ít sản phẩm trước** (đã set mặc định = 10)

3. **Kiểm tra MinIO storage space**:
   ```bash
   df -h /mnt/minio-data  # Hoặc path storage của bạn
   ```

4. **Verify selectors**: Inspect HTML của website để đảm bảo selectors đúng

### 🎯 Best Practices

- Chạy vào giờ thấp điểm để không ảnh hưởng website
- Monitor network usage và server load
- Giữ lại thư mục `temp-images` để có thể retry
- Review `mapping-results.json` trước khi xóa temp files

### 🔄 Re-run Strategy

Nếu cần chạy lại:

1. **Chỉ upload lại**: Comment out crawl và download steps
2. **Chỉ map lại**: Dùng existing `crawled-products.json` và `image-url-mapping.json`
3. **Full clean run**: Xóa `temp-images/` và chạy lại từ đầu

## Troubleshooting Checklist

- [ ] MinIO đang chạy và accessible
- [ ] Database connection OK
- [ ] Bucket `rausach-uploads` tồn tại
- [ ] Network có thể access website cũ
- [ ] Có đủ disk space cho temp downloads
- [ ] CSS selectors đúng với cấu trúc HTML website
- [ ] Prisma schema có fields `featuredImage` và `images`

## Support

Nếu gặp vấn đề:

1. Check console output để xem bước nào lỗi
2. Review các file JSON trong `temp-images/`
3. Test từng function riêng lẻ
4. Verify website structure chưa thay đổi

---

**Created**: 2025-11-28  
**Script**: `backend/migrate-images-from-old-site.ts`  
**Source**: https://rausachtrangia.com  
**Destination**: https://storage.rausachtrangia.com/rausach-uploads
