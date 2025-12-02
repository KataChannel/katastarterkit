# Tiến độ Migration Timona Academy

## Trạng thái: ✅ Phase 2 Backend Modules - HOÀN THÀNH

### Đã hoàn thành

#### Phase 1: Database Schema ✅
- Đã thêm 8 model Academy vào `backend/prisma/schema.prisma`:
  - `Branch` - Chi nhánh/cơ sở
  - `AcademyCourseCategory` - Danh mục khóa học
  - `AcademyCourse` - Khóa học
  - `AcademyCourseRegistration` - Đăng ký khóa học
  - `AcademyInstructor` - Giảng viên
  - `AcademyTestimonial` - Đánh giá học viên
  - `AcademyFAQ` - Câu hỏi thường gặp
  - `AcademyStudentWork` - Tác phẩm học viên
  - `AcademyMediaCoverage` - Báo chí đưa tin

#### Phase 2: Backend Modules ✅
Đã tạo đầy đủ các NestJS module trong `/backend/src/modules/academy/`:

| Module | Model | DTO | Service | Resolver | Module.ts |
|--------|-------|-----|---------|----------|-----------|
| branch | ✅ | ✅ | ✅ | ✅ | ✅ |
| course | ✅ | ✅ | ✅ | ✅ | ✅ |
| course-category | ✅ | ✅ | ✅ | ✅ | ✅ |
| registration | ✅ | ✅ | ✅ | ✅ | ✅ |
| instructor | ✅ | ✅ | ✅ | ✅ | ✅ |
| testimonial | ✅ | ✅ | ✅ | ✅ | ✅ |
| faq | ✅ | ✅ | ✅ | ✅ | ✅ |

**Tính năng GraphQL API:**

**Queries (Public):**
- `getAcademyCourses`, `getAcademyCourse`, `getAcademyCourseBySlug`, `getFeaturedAcademyCourses`
- `getAcademyCourseCategories`, `getActiveAcademyCourseCategories`
- `getBranches`, `getBranch`, `getBranchBySlug`, `getActiveBranches`
- `getAcademyInstructors`, `getAcademyInstructor`, `getFeaturedAcademyInstructors`
- `getAcademyTestimonials`, `getFeaturedAcademyTestimonials`
- `getAcademyFAQs`, `getAcademyFAQsByCategory`, `getAcademyFAQCategories`
- `createAcademyRegistration` (Public - cho phép đăng ký)

**Mutations (Admin Protected):**
- CRUD đầy đủ cho tất cả entities
- Toggle active/featured
- Update display order
- Update status (registrations)

### Các bước tiếp theo

#### Phase 3: Frontend Components 🔄
- [ ] Copy components từ `timonachuyendoi/components/`
- [ ] Tạo pages cho Timona domain
- [ ] Tích hợp GraphQL queries/mutations
- [ ] Responsive design

#### Phase 4: Data Migration
- [ ] Script migrate dữ liệu từ SQLite sang PostgreSQL
- [ ] Import từ WordPress backup
- [ ] Migrate hình ảnh lên MinIO

#### Phase 5: Testing & Deployment
- [ ] Test GraphQL API
- [ ] Test frontend
- [ ] Deploy với Docker

### Cấu trúc thư mục Academy Module
```
backend/src/modules/academy/
├── academy.module.ts       # Main module
├── index.ts               # Exports
├── branch/
│   ├── models/branch.model.ts
│   ├── dto/branch.dto.ts
│   ├── branch.service.ts
│   ├── branch.resolver.ts
│   └── branch.module.ts
├── course/
│   ├── models/course.model.ts
│   ├── dto/course.dto.ts
│   ├── course.service.ts
│   ├── course.resolver.ts
│   └── course.module.ts
├── course-category/
│   ├── models/course-category.model.ts
│   ├── dto/course-category.dto.ts
│   ├── course-category.service.ts
│   ├── course-category.resolver.ts
│   └── course-category.module.ts
├── registration/
│   ├── models/registration.model.ts
│   ├── dto/registration.dto.ts
│   ├── registration.service.ts
│   ├── registration.resolver.ts
│   └── registration.module.ts
├── instructor/
│   ├── models/instructor.model.ts
│   ├── dto/instructor.dto.ts
│   ├── instructor.service.ts
│   ├── instructor.resolver.ts
│   └── instructor.module.ts
├── testimonial/
│   ├── models/testimonial.model.ts
│   ├── dto/testimonial.dto.ts
│   ├── testimonial.service.ts
│   ├── testimonial.resolver.ts
│   └── testimonial.module.ts
└── faq/
    ├── models/faq.model.ts
    ├── dto/faq.dto.ts
    ├── faq.service.ts
    ├── faq.resolver.ts
    └── faq.module.ts
```

### Lệnh để chạy
```bash
# Generate Prisma Client
cd backend && bunx prisma generate

# Migrate database
cd backend && bunx prisma migrate dev --name add_academy_models

# Start backend
cd backend && bun run dev
```

### Notes
- AcademyModule đã được đăng ký trong `app.module.ts`
- Tất cả resolvers sử dụng `JwtAuthGuard` và `RolesGuard` cho admin mutations
- Public queries cho phép truy cập không cần authentication
- Registration mutation là public để khách hàng có thể đăng ký

---
Cập nhật: $(date)
