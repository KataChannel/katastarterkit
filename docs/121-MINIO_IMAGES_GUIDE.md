# 🖼️ MinIO Images Management - Quick Reference

## 📦 Scripts Available

### 1. Upload Images to MinIO
Upload hình ảnh từ `temp-images` folder lên MinIO:
```bash
cd backend
bun run upload-temp-images-to-minio.ts
```

### 2. Sync MinIO to Database  
Đồng bộ files từ MinIO vào database để hiển thị trong File Manager:
```bash
cd backend
bun run sync-minio-to-db.ts
# Hoặc
./sync-minio.sh
```

### 3. Verify Results
Kiểm tra kết quả:
```bash
cd backend
node verify-image-upload.js
```

## 🔄 Complete Workflow

```bash
# Bước 1: Upload images lên MinIO
bun run upload-temp-images-to-minio.ts

# Bước 2: Sync vào database
bun run sync-minio-to-db.ts

# Bước 3: Verify
node verify-image-upload.js
```

## 📊 Current Status

### MinIO Storage
- **Bucket**: `rausach-uploads`
- **Images**: 2,470 files
- **Location**: `products/{product-slug}/`
- **Public URL**: `https://storage.rausachtrangia.com/rausach-uploads/`

### Database
- **Table**: `File`
- **Records**: 2,470 entries
- **Folder**: "Products"
- **Accessible via**: `/admin/filemanager`

### Products
- **With Images**: 58 products (7.5%)
- **Without Images**: 702 products (90.8%)
- **Total Products**: 773

## 🌐 Access Points

### File Manager UI
- **Local**: http://localhost:12000/admin/filemanager
- **Production**: https://shop.rausachtrangia.com/admin/filemanager

### MinIO Console
- **Port**: 12008
- **URL**: http://116.118.49.243:12008

### Sample Image URL
```
https://storage.rausachtrangia.com/rausach-uploads/products/rau-sach-cu-gung_909/image-1.jpg
```

## 📝 Files Structure

```
backend/
├── upload-temp-images-to-minio.ts    # Upload to MinIO
├── sync-minio-to-db.ts               # Sync to DB
├── sync-minio.sh                     # Helper script
├── verify-image-upload.js            # Verify results
├── check-updated-products.js         # Check products
└── temp-images/
    ├── crawled-products.json         # Metadata
    ├── upload-report.json            # Upload report
    ├── SUMMARY.txt                   # Summary
    └── [product-folders]/            # Images
```

## 📖 Documentation

- [UPLOAD_TEMP_IMAGES_TO_MINIO.md](../UPLOAD_TEMP_IMAGES_TO_MINIO.md) - Upload guide
- [SYNC_MINIO_TO_DATABASE.md](../SYNC_MINIO_TO_DATABASE.md) - Sync guide
- [temp-images/README.md](temp-images/README.md) - Quick start

## 🔧 Quick Commands

```bash
# Upload new images
bun run upload-temp-images-to-minio.ts

# Sync to database
./sync-minio.sh

# View stats
node verify-image-upload.js

# Check products with images
node check-updated-products.js

# View MinIO products
./view-minio-products.sh
```

## ⚠️ Important Notes

1. **Always sync after upload**: Files won't show in File Manager until synced
2. **No duplicates**: Sync script skips existing files automatically
3. **User ownership**: Files are owned by first admin user found
4. **Public access**: All files in `rausach-uploads` are publicly accessible

## 🆘 Troubleshooting

### Files not showing in File Manager?
```bash
# Run sync again
bun run sync-minio-to-db.ts

# Clear browser cache
# Hard refresh: Ctrl+Shift+R
```

### MinIO connection failed?
```bash
# Check MinIO is running
docker ps | grep minio

# Test connection
curl http://116.118.49.243:12007
```

### Products not updated?
```bash
# Check database
node verify-image-upload.js

# View updated products
node check-updated-products.js
```

---

**Last Updated**: 28/11/2025  
**Total Images**: 2,470  
**Status**: ✅ All systems operational
