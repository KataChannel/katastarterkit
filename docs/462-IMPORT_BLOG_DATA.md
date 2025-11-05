# Import Dữ Liệu Blog Từ Database Cũ

## Tóm tắt

Đã phân tích và import thành công dữ liệu blog từ database export (2025-11-05) vào schema Prisma hiện tại.

## Dữ liệu nguồn

**Thư mục**: `backend/database-export/2025-11-05T08-24-56-131Z/`

**Files đã xử lý**:
1. `danhmucbaiviet.json` - 6 danh mục blog
2. `baiviet.json` - 74 bài viết blog

## Mapping Schema

### Old Schema → New Schema

**Danh mục bài viết** (`danhmucbaiviet`) → `BlogCategory`:
- `id` → `id` (giữ nguyên UUID)
- `Title` → `name`
- `Slug` → `slug`
- `Mota` → `description`
- `Image` → `thumbnail` (parse JSON, extract Main)
- `Ordering` → `order`
- `Status` → `isActive` (0/1 → boolean)
- `pid` → `parentId` (hỗ trợ danh mục con)

**Bài viết** (`baiviet`) → `BlogPost`:
- `id` → `id` (giữ nguyên UUID)
- `Title` → `title`
- `Slug` → `slug`
- `Mota` → `excerpt`
- `Noidung` → `content` (cleaned HTML)
- `Image` → `featuredImage` (parse JSON)
- `idDM` → `categoryId` (map từ category cũ)
- `Status` → `status` (PUBLISHED/DRAFT)
- `Noibat` → `isFeatured`
- `Ordering` → `displayOrder`
- `MetaTags` → `metaTitle`, `metaDescription`
- `Motangan` → `metaKeywords`
- Auto-generate: `readingTime` (tính từ nội dung)

## Xử lý dữ liệu

### 1. Clean HTML Content
```typescript
- Remove <head> tags và meta
- Remove <script> tags
- Normalize whitespace
- Giữ nguyên cấu trúc HTML trong body
```

### 2. Parse Image JSON
```typescript
Input: {"Main":"image.jpg","Thumb":"image_250x180.jpg"}
Output: "http://rausachtrangia.com/quanly/fileman/Uploads/Images/image.jpg"
```

### 3. Extract Keywords
```typescript
- From MetaTags.keywords
- From Motangan (short tags)
- Deduplicate và limit 20 keywords
```

### 4. Calculate Reading Time
```typescript
- Remove HTML tags
- Count words
- Average: 200 words/minute
- Round up to minutes
```

### 5. Default Author
```typescript
- Tìm user với email "admin@rausachtrangia.com" hoặc roleType "ADMIN"
- Nếu không có, tạo user mới:
  - email: admin@rausachtrangia.com
  - username: admin_rausach
  - roleType: ADMIN
```

## Kết quả import

### Blog Categories (6)
1. **Tin Tức** (`tin-tuc`)
2. **Món Ngon Mỗi Ngày** (`mon-ngon-moi-ngay`)
3. **Chính Sách Quy Định** (`chinh-sach-quy-dinh`)
4. **Khuyến Mãi** (`khuyen-mai`)
5. **[Empty Title]** (1 category không có title)
6. **Giới Thiệu** (giới thiệu)

### Blog Posts (74)
- Created: 74 posts
- Updated: 0
- Skipped: 0
- Total: 74

**Ví dụ bài viết đã import**:
- "BẮP NẤU CỦ SEN"
- "Thành lập HTX Nông Nghiệp Công Nghệ Cao Trần Gia Farm"
- "Giao rau tận nhà - Giá tại vườn"
- "Chanh giúp phân biệt rau muống sạch hay bẩn"
- "10 cây gia vị, thực phẩm quen thuộc giúp nâng cao sức khỏe"

## Cấu trúc database sau import

```
blog_categories (6 categories)
└── blog_posts (74 posts)
    ├── authorId → users
    ├── categoryId → blog_categories
    └── Features:
        - SEO metadata (title, description, keywords)
        - Reading time
        - Featured status
        - Visibility control
        - Comment support
        - View count tracking
```

## Script import

**File**: `backend/import-blog-data.ts`

**Chạy**:
```bash
cd backend && bun run import-blog-data.ts
```

**Features**:
- ✅ Auto-create categories với hierarchy support
- ✅ Map old category IDs to new IDs
- ✅ Create/update posts với full metadata
- ✅ Auto-generate reading time
- ✅ Clean HTML content
- ✅ Extract và deduplicate keywords
- ✅ Set proper status (PUBLISHED/DRAFT)
- ✅ Handle images from old system
- ✅ Create default author if needed
- ✅ Error handling per item
- ✅ Detailed progress logging
- ✅ Summary statistics

## Lưu ý

⚠️ **Images**: 
- URL images vẫn trỏ về server cũ: `http://rausachtrangia.com/quanly/fileman/Uploads/Images/`
- Cần migrate images nếu muốn self-host

⚠️ **HTML Content**:
- Giữ nguyên HTML structure từ database cũ
- Có thể cần sanitize/update nếu muốn modern format

⚠️ **Author**:
- Tất cả posts đều dùng 1 author (admin)
- Có thể update sau nếu cần phân quyền tác giả

## Tổng kết

**Status**: ✅ Hoàn thành  
**Categories**: 6/6 imported  
**Posts**: 74/74 imported  
**Errors**: 0  
**Data Quality**: Good (có SEO, images, hierarchy)  

---
*Ngày import: 5/11/2025*
