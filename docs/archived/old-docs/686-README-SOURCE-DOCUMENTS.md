# Source Documents Seeding

## Tổng quan

Script này tạo dữ liệu mẫu cho hệ thống Source Documents (Tài liệu nguồn) trong LMS.

## Các loại tài liệu được tạo

### 1. 📄 FILE (PDF, DOC, XLS, etc.)
- **Clean Code - Robert C. Martin**: Sách về viết code sạch
- **UI/UX Design Principles**: PDF về nguyên tắc thiết kế

### 2. 🎥 VIDEO (MP4, YouTube, Vimeo, etc.)
- **React Hooks Tutorial**: Khóa học React Hooks đầy đủ
- **Lean Startup Methodology**: Video về phương pháp Lean Startup

### 3. 📝 TEXT (Markdown, plain text)
- **REST API Best Practices**: Bài viết về best practices thiết kế API

### 4. 🎵 AUDIO (MP3, podcast, etc.)
- **The Changelog - Episode 500**: Podcast về tương lai của JavaScript

### 5. 🔗 LINK (External URL)
- **MDN Web Docs**: Tài liệu tham khảo JavaScript chính thức

### 6. 🖼️ IMAGE (PNG, JPG, diagrams)
- **HTTP Request/Response Lifecycle Diagram**: Sơ đồ chu trình HTTP

## Danh mục được tạo

1. **Lập trình** (Programming) - Icon: Code, Color: #3B82F6
2. **Thiết kế** (Design) - Icon: Palette, Color: #EC4899
3. **Kinh doanh** (Business) - Icon: Briefcase, Color: #10B981
4. **Marketing** - Icon: TrendingUp, Color: #F59E0B

## Cách sử dụng

### Chạy seed từ root project:
```bash
cd /chikiet/kataoffical/shoprausach
npm run seed:source-documents
```

### Hoặc chạy từ backend folder:
```bash
cd backend
npm run seed:source-documents
```

### Hoặc chạy trực tiếp:
```bash
npx ts-node backend/prisma/seeds/seed-source-documents.ts
```

## Tính năng

✅ Tạo 4 categories với icon và màu sắc
✅ Tạo 8 source documents (mỗi loại 1-2 mẫu)
✅ AI analysis data được pre-filled (summary, keywords, topics)
✅ Metadata đầy đủ cho mỗi loại tài liệu
✅ Published status để có thể hiển thị ngay

## Dữ liệu được tạo

### Metadata theo loại:

**FILE**:
- fileName, fileSize, mimeType
- author, year, pages, language

**VIDEO**:
- duration, thumbnailUrl
- platform, instructor, quality, subtitles

**TEXT**:
- content (Markdown formatted)
- format, version, lastUpdated

**AUDIO**:
- duration, mimeType
- show, episode, hosts, guests

**LINK**:
- url, thumbnailUrl
- source, type, language

**IMAGE**:
- dimensions, format
- creator, license

### AI Analysis Fields:

Tất cả documents đều có:
- `aiSummary`: Tóm tắt nội dung
- `aiKeywords`: Từ khóa chính
- `aiTopics`: Chủ đề liên quan
- `isAiAnalyzed`: true
- `aiAnalyzedAt`: Timestamp

## Yêu cầu

- Admin user phải tồn tại trong database
- Prisma schema đã được migrate
- Database connection hoạt động

## Troubleshooting

### Lỗi "No admin user found"
Tạo admin user trước:
```bash
npm run seed:rbac
```

### Lỗi "Table does not exist"
Chạy migration:
```bash
npm run db:migrate
# hoặc
npx prisma db push
```

### Lỗi duplicate
Script sẽ tự động xử lý bằng cách tạo mới nếu upsert thất bại.

## Kết quả

Sau khi chạy thành công, bạn sẽ có:
- ✅ 4 categories
- ✅ 8 source documents (covering all types)
- ✅ Dữ liệu AI analysis đầy đủ
- ✅ Sẵn sàng để test và phát triển

## Tích hợp với LMS

Các tài liệu này có thể:
1. Link vào các khóa học qua `CourseSourceDocument`
2. Được quản lý trong `/lms/admin/source-documents`
3. Được giảng viên sử dụng trong `/lms/instructor/source-documents`
4. Được phân tích bởi AI (future enhancement)

## Next Steps

1. Tạo UI để hiển thị source documents
2. Implement search và filter
3. Tích hợp AI analysis thực sự
4. Upload files thật vào MinIO/S3
5. Link documents vào courses

---

Created: 2025-11-13
Author: LMS Team
