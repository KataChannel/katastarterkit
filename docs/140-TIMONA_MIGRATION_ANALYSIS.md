# 📊 PHÂN TÍCH CHUYỂN ĐỔI TIMONA - WORDPRESS → SHOPRAUSACH

**Ngày phân tích:** 02/12/2025  
**Trạng thái:** ✅ **CÓ THỂ CHUYỂN ĐỔI**

---

## 🎯 TÓM TẮT

### Kết luận: **CÓ THỂ chuyển đổi thành công**

Dự án `timonachuyendoi` (Next.js standalone với SQLite) **hoàn toàn có thể** tích hợp vào hệ thống `shoprausach` với domain `app.timona.edu.vn` theo cấu trúc đã định nghĩa.

---

## 📁 SO SÁNH CẤU TRÚC

### 1. Nguồn: `timonachuyendoi` (Next.js Standalone)

| Thành phần | Công nghệ | Trạng thái |
|------------|-----------|------------|
| Framework | Next.js 16 (App Router) | ✅ |
| Database | SQLite (local) | ⚠️ Cần migrate sang PostgreSQL |
| ORM | Prisma | ✅ Tương thích |
| Auth | NextAuth | ⚠️ Cần tích hợp với JWT backend |
| UI | Radix UI + Tailwind | ✅ Tương thích shadcn |
| Editor | TipTap | ✅ Có sẵn trong dự án |

### 2. Đích: `shoprausach` (Monorepo)

| Thành phần | Công nghệ | Domain Timona |
|------------|-----------|---------------|
| Frontend | Next.js 15 | `app.timona.edu.vn:15000` |
| Backend | NestJS + GraphQL | `appapi.timona.edu.vn:15001` |
| Database | PostgreSQL | `116.118.49.243:12003/timonacore` |
| Redis | Redis | `116.118.49.243:12004` |
| Storage | MinIO | `storage.timona.edu.vn` |

---

## 📊 DỮ LIỆU CẦN MIGRATE

### Từ WordPress SQL (`tazaspac_wp_timona.sql`)

| Bảng WordPress | Số lượng | Map sang Schema |
|----------------|----------|-----------------|
| `gt_posts` (posts) | ~534 | `BlogPost` |
| `gt_posts` (pages) | ~59 | `Page` (Page Builder) |
| `gt_terms` (categories) | ~7 | `BlogCategory` |
| `gt_terms` (tags) | ~38 | `BlogTag` |
| `gt_users` | ~3 | `User` |
| `gt_kata_chatbot_branches` | 6 | Tạo model `Branch` mới |
| `gt_kata_form_submissions` | ~12+ | `ContactFormSubmission` |
| `gt_postmeta` | ~6140 | SEO fields trong BlogPost |

### Từ SQLite (`dev.db`)

| Model SQLite | Map sang PostgreSQL |
|--------------|---------------------|
| `nx_users` | `users` |
| `nx_posts` | `BlogPost` |
| `nx_pages` | `Page` |
| `nx_categories` | `BlogCategory` |
| `nx_tags` | `BlogTag` |
| `nx_media` | `File` |
| `nx_comments` | `BlogComment` |
| `nx_branches` | Tạo `Branch` model |
| `nx_courses` | Tạo `Course` model |
| `nx_course_categories` | `CourseCategory` |
| `nx_course_registrations` | `CourseRegistration` |
| `nx_settings` | `WebsiteSetting` |

---

## 🏗️ KẾ HOẠCH CHUYỂN ĐỔI

### Phase 1: Database Schema (1-2 ngày)

#### 1.1 Thêm Models cho Timona vào schema.prisma

```prisma
// =====================================================
// TIMONA ACADEMY - COURSE MANAGEMENT
// =====================================================

model Branch {
  id            String   @id @default(uuid())
  name          String
  address       String?
  phone         String?
  email         String?
  facebookUrl   String?
  facebookPageId String?
  zaloUrl       String?
  zaloOaId      String?
  hotline       String?
  workingHours  String?
  description   String?  @db.Text
  isActive      Boolean  @default(true)
  displayOrder  Int      @default(0)
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relations
  courseRegistrations CourseRegistration[]
  
  @@index([isActive])
  @@index([displayOrder])
  @@map("branches")
}

model CourseCategory {
  id           String   @id @default(uuid())
  name         String
  slug         String   @unique
  description  String?  @db.Text
  displayOrder Int      @default(0)
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  courses      Course[]
  
  @@index([slug])
  @@map("course_categories")
}

model Course {
  id            String   @id @default(uuid())
  title         String
  slug          String   @unique
  description   String?  @db.Text
  content       String?  @db.Text
  featuredImage String?
  duration      String?
  price         Decimal? @db.Decimal(12, 0)
  discountPrice Decimal? @db.Decimal(12, 0)
  schedule      String?
  benefits      Json?    // Array of benefits
  curriculum    Json?    // Course outline
  isActive      Boolean  @default(true)
  isFeatured    Boolean  @default(false)
  displayOrder  Int      @default(0)
  
  // SEO
  metaTitle       String?
  metaDescription String?
  focusKeyword    String?
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relations
  categoryId    String?
  category      CourseCategory? @relation(fields: [categoryId], references: [id])
  registrations CourseRegistration[]
  
  @@index([slug])
  @@index([isActive])
  @@index([isFeatured])
  @@index([categoryId])
  @@map("courses")
}

enum RegistrationStatus {
  NEW
  CONTACTED
  CONFIRMED
  CANCELLED
  COMPLETED
}

model CourseRegistration {
  id        String   @id @default(uuid())
  fullName  String
  phone     String
  email     String?
  note      String?  @db.Text
  source    String?  // facebook, zalo, website, etc.
  status    RegistrationStatus @default(NEW)
  ipAddress String?
  userAgent String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  courseId  String
  course    Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  branchId  String?
  branch    Branch?  @relation(fields: [branchId], references: [id])
  
  @@index([courseId])
  @@index([branchId])
  @@index([status])
  @@index([createdAt])
  @@map("course_registrations")
}
```

### Phase 2: Backend API (2-3 ngày)

#### 2.1 Modules cần tạo

```
backend/src/
├── modules/
│   ├── branch/
│   │   ├── branch.module.ts
│   │   ├── branch.service.ts
│   │   ├── branch.resolver.ts
│   │   └── dto/
│   ├── course/
│   │   ├── course.module.ts
│   │   ├── course.service.ts
│   │   ├── course.resolver.ts
│   │   └── dto/
│   └── course-registration/
│       ├── course-registration.module.ts
│       ├── course-registration.service.ts
│       ├── course-registration.resolver.ts
│       └── dto/
```

#### 2.2 GraphQL Schema

```graphql
type Branch {
  id: ID!
  name: String!
  address: String
  phone: String
  email: String
  facebookUrl: String
  zaloUrl: String
  hotline: String
  workingHours: String
  description: String
  isActive: Boolean!
  displayOrder: Int!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Course {
  id: ID!
  title: String!
  slug: String!
  description: String
  content: String
  featuredImage: String
  duration: String
  price: Float
  discountPrice: Float
  schedule: String
  benefits: JSON
  curriculum: JSON
  isActive: Boolean!
  isFeatured: Boolean!
  displayOrder: Int!
  category: CourseCategory
  registrations: [CourseRegistration!]!
  metaTitle: String
  metaDescription: String
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Query {
  branches(isActive: Boolean): [Branch!]!
  branch(id: ID!): Branch
  
  courses(categorySlug: String, isActive: Boolean, isFeatured: Boolean): [Course!]!
  course(id: ID, slug: String): Course
  courseCategories: [CourseCategory!]!
  
  courseRegistrations(courseId: ID, branchId: ID, status: RegistrationStatus): [CourseRegistration!]!
}

type Mutation {
  # Admin
  createBranch(input: CreateBranchInput!): Branch!
  updateBranch(id: ID!, input: UpdateBranchInput!): Branch!
  deleteBranch(id: ID!): Boolean!
  
  createCourse(input: CreateCourseInput!): Course!
  updateCourse(id: ID!, input: UpdateCourseInput!): Course!
  deleteCourse(id: ID!): Boolean!
  
  # Public
  registerCourse(input: CourseRegistrationInput!): CourseRegistration!
  
  # Admin
  updateRegistrationStatus(id: ID!, status: RegistrationStatus!): CourseRegistration!
}
```

### Phase 3: Frontend Components (3-5 ngày)

#### 3.1 Components từ timonachuyendoi cần chuyển

| Component | Mô tả | Priority |
|-----------|-------|----------|
| `HeroSlider` | Banner carousel | High |
| `CoursesSection` | Danh sách khóa học | High |
| `CommitmentsSection` | Cam kết | Medium |
| `InstructorsSection` | Giảng viên | Medium |
| `VideosSection` | Video testimonials | Medium |
| `StudentWorksSection` | Gallery | Medium |
| `MediaSection` | Truyền thông | Low |
| `NewsSection` | Tin tức (đã có BlogPost) | Low |
| `FAQSection` | FAQ | Medium |
| `ContactSection` | Form liên hệ | High |

#### 3.2 Admin Pages cần tạo

```
frontend/src/app/admin/
├── branches/
│   ├── page.tsx           # List branches
│   ├── [id]/
│   │   └── page.tsx       # Edit branch
│   └── new/
│       └── page.tsx       # Create branch
├── courses/
│   ├── page.tsx           # List courses
│   ├── [id]/
│   │   └── page.tsx       # Edit course
│   └── new/
│       └── page.tsx       # Create course
├── course-categories/
│   └── page.tsx           # Manage categories
└── registrations/
    └── page.tsx           # Manage registrations
```

### Phase 4: Data Migration Script (1-2 ngày)

```typescript
// scripts/migrate-timona-data.ts

import { PrismaClient } from '@prisma/client';
import * as sqlite3 from 'better-sqlite3';

const postgresClient = new PrismaClient();
const sqliteDb = sqlite3('/path/to/timonachuyendoi/prisma/dev.db');

async function migrateBranches() {
  const branches = sqliteDb.prepare('SELECT * FROM nx_branches').all();
  
  for (const branch of branches) {
    await postgresClient.branch.create({
      data: {
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
        email: branch.email,
        facebookUrl: branch.facebookUrl,
        zaloUrl: branch.zaloUrl,
        hotline: branch.hotline,
        workingHours: branch.workingHours,
        description: branch.description,
        isActive: Boolean(branch.isActive),
        displayOrder: branch.displayOrder || 0,
      }
    });
  }
  console.log(`✅ Migrated ${branches.length} branches`);
}

async function migrateCourses() {
  // Migrate course categories first
  const categories = sqliteDb.prepare('SELECT * FROM nx_course_categories').all();
  const categoryMap = new Map();
  
  for (const cat of categories) {
    const created = await postgresClient.courseCategory.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        displayOrder: cat.displayOrder || 0,
      }
    });
    categoryMap.set(cat.id, created.id);
  }
  
  // Then migrate courses
  const courses = sqliteDb.prepare('SELECT * FROM nx_courses').all();
  
  for (const course of courses) {
    await postgresClient.course.create({
      data: {
        title: course.title,
        slug: course.slug,
        description: course.description,
        content: course.content,
        featuredImage: course.featuredImage,
        duration: course.duration,
        price: course.price,
        discountPrice: course.discountPrice,
        schedule: course.schedule,
        benefits: course.benefits ? JSON.parse(course.benefits) : null,
        curriculum: course.curriculum ? JSON.parse(course.curriculum) : null,
        isActive: Boolean(course.isActive),
        isFeatured: Boolean(course.isFeatured),
        displayOrder: course.displayOrder || 0,
        categoryId: course.categoryId ? categoryMap.get(course.categoryId) : null,
        metaTitle: course.metaTitle,
        metaDescription: course.metaDescription,
      }
    });
  }
  console.log(`✅ Migrated ${courses.length} courses`);
}

async function migrateBlogPosts() {
  // Migrate posts from SQLite to BlogPost
  const posts = sqliteDb.prepare(`
    SELECT * FROM nx_posts 
    WHERE status = 'PUBLISHED'
  `).all();
  
  for (const post of posts) {
    await postgresClient.blogPost.create({
      data: {
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage,
        status: 'PUBLISHED',
        publishedAt: post.publishedAt ? new Date(post.publishedAt) : new Date(),
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        focusKeyword: post.focusKeyword,
        seoScore: post.seoScore || 0,
        views: post.views || 0,
        authorId: 'admin-user-id', // Map to admin user
      }
    });
  }
  console.log(`✅ Migrated ${posts.length} blog posts`);
}

async function main() {
  console.log('🚀 Starting Timona data migration...\n');
  
  await migrateBranches();
  await migrateCourses();
  await migrateBlogPosts();
  // Add more migration functions...
  
  console.log('\n✅ Migration completed!');
}

main()
  .catch(console.error)
  .finally(() => postgresClient.$disconnect());
```

---

## 📋 CHECKLIST CHUYỂN ĐỔI

### Database
- [ ] Thêm models Branch, Course, CourseCategory, CourseRegistration vào schema.prisma
- [ ] Chạy `prisma migrate dev --name add_timona_models`
- [ ] Chạy migration script để import dữ liệu từ SQLite

### Backend
- [ ] Tạo module Branch với CRUD operations
- [ ] Tạo module Course với CRUD operations  
- [ ] Tạo module CourseRegistration với public register + admin management
- [ ] Tạo module CourseCategory
- [ ] Cập nhật GraphQL schema
- [ ] Tích hợp với Menu system (MenuLinkType.COURSE)

### Frontend
- [ ] Chuyển các components từ timonachuyendoi
- [ ] Adapt UI theo shadcn standards
- [ ] Tạo admin pages cho Branch, Course, Registration
- [ ] Tạo public pages: /khoa-hoc, /khoa-hoc/[slug], /chi-nhanh
- [ ] Form đăng ký khóa học

### Env & Deployment
- [ ] Cập nhật `.env.dev.timona` và `.env.prod.timona`
- [ ] Tạo database `timonacore` trên PostgreSQL server
- [ ] Tạo bucket `timona-uploads` trên MinIO
- [ ] Cấu hình nginx cho domains
- [ ] Deploy và test

---

## ⏱️ ƯỚC TÍNH THỜI GIAN

| Phase | Công việc | Thời gian |
|-------|-----------|-----------|
| Phase 1 | Database Schema | 1-2 ngày |
| Phase 2 | Backend API | 2-3 ngày |
| Phase 3 | Frontend Components | 3-5 ngày |
| Phase 4 | Data Migration | 1-2 ngày |
| Phase 5 | Testing & Deployment | 1-2 ngày |
| **Tổng** | | **8-14 ngày** |

---

## ✅ KẾT LUẬN

### Ưu điểm của việc chuyển đổi:

1. **Tích hợp hệ thống**: Timona sử dụng chung infrastructure với rausach và tazagroup
2. **Maintenance dễ hơn**: Một codebase, nhiều domains
3. **Tái sử dụng code**: Page Builder, Blog, E-commerce, Support Chat sẵn có
4. **Hiệu suất tốt hơn**: PostgreSQL + Redis thay vì SQLite
5. **Scalable**: Container-based deployment

### Khuyến nghị:

1. **Bắt đầu với Phase 1** - Thêm models vào schema
2. **Sử dụng Page Builder** - Tạo landing pages cho khóa học thay vì hardcode
3. **Tích hợp Blog** - Sử dụng BlogPost đã có cho tin tức Timona
4. **Tích hợp Support Chat** - Zalo/Facebook chat cho tư vấn khóa học

---

**Báo cáo tạo theo Rule:** Principal Engineer, Clean Architecture, Mobile First  
**Ngày:** 02/12/2025
