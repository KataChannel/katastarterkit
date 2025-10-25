# 🎓 rausachcore LMS - Learning Management System Development Plan

## 📋 Tổng quan dự án

Tài liệu này mô tả chi tiết kế hoạch phát triển hệ thống LMS (Learning Management System) cho rausachcore, phục vụ cả nội bộ công ty và khách hàng bên ngoài.

### Mục tiêu
- ✅ Xây dựng nền tảng đào tạo nội bộ cho nhân viên
- ✅ Cung cấp khóa học trực tuyến cho khách hàng
- ✅ Quản lý và theo dõi tiến độ học tập
- ✅ Tạo doanh thu từ khóa học trả phí

### Tech Stack hiện có
**Backend:**
- NestJS + GraphQL + Apollo Server
- Prisma ORM + PostgreSQL
- Redis (cache & pub/sub)
- Elasticsearch (search)
- JWT Authentication
- MinIO (object storage)

**Frontend:**
- Next.js 15 + React 19
- TailwindCSS v4
- Apollo Client (GraphQL)
- Radix UI components

---

## 🚀 MVP 1: Core LMS Foundation (1-2 tuần)

### Mục tiêu
Xây dựng nền tảng cơ bản cho việc quản lý khóa học, bài học và người dùng

### Features chính

#### 1. Course Management
- ✅ Tạo/sửa/xóa khóa học
- ✅ Upload thumbnail, video giới thiệu
- ✅ Phân loại khóa học (categories, tags)
- ✅ Cấu hình giá (free/paid)
- ✅ Draft/Publish workflow
- ✅ SEO metadata

#### 2. Lesson/Module Structure
- ✅ Tổ chức bài học theo modules
- ✅ Drag-and-drop sắp xếp thứ tự
- ✅ Lesson types:
  - Video lessons
  - Text/Article lessons
  - Quiz
  - Assignment
  - Live session scheduling
- ✅ Rich text editor cho nội dung
- ✅ File attachments

#### 3. User Roles & Permissions
- **Student** (Học viên)
  - Internal: Nhân viên công ty
  - External: Khách hàng bên ngoài
- **Instructor** (Giảng viên)
  - Tạo và quản lý khóa học
  - Chấm bài, feedback
- **Admin** (Quản trị viên)
  - Quản lý toàn bộ hệ thống
  - Analytics & Reports

#### 4. Basic Enrollment
- ✅ Đăng ký khóa học
- ✅ Xem danh sách khóa học đã đăng ký
- ✅ Enrollment status tracking

### Database Schema

```prisma
// ============================================
// LMS ENUMS
// ============================================

enum CourseLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  EXPERT
}

enum CourseStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum LessonType {
  VIDEO
  TEXT
  QUIZ
  ASSIGNMENT
  LIVE_SESSION
}

enum EnrollmentStatus {
  ACTIVE
  COMPLETED
  DROPPED
  EXPIRED
}

enum OrderStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

// ============================================
// COURSE MODELS
// ============================================

model Course {
  id          String        @id @default(uuid())
  title       String
  slug        String        @unique
  description String?       @db.Text
  thumbnail   String?
  trailer     String?       // Video giới thiệu
  price       Decimal       @default(0) @db.Decimal(10, 2)
  level       CourseLevel   @default(BEGINNER)
  status      CourseStatus  @default(DRAFT)
  duration    Int?          // Tổng phút
  
  // SEO & Metadata
  metaTitle       String?
  metaDescription String?
  tags            String[]
  categoryId      String?
  category        CourseCategory? @relation(fields: [categoryId], references: [id])
  
  // Stats
  enrollmentCount Int @default(0)
  rating          Decimal @default(0) @db.Decimal(3, 2)
  reviewCount     Int @default(0)
  
  // Relations
  instructorId String
  instructor   User         @relation("CourseInstructor", fields: [instructorId], references: [id])
  modules      CourseModule[]
  enrollments  Enrollment[]
  reviews      CourseReview[]
  
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  publishedAt DateTime?
  
  @@index([slug])
  @@index([instructorId])
  @@index([categoryId])
  @@index([status])
}

model CourseCategory {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  description String?  @db.Text
  icon        String?
  parentId    String?
  
  parent      CourseCategory?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    CourseCategory[] @relation("CategoryHierarchy")
  courses     Course[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([slug])
  @@index([parentId])
}

model CourseModule {
  id          String   @id @default(uuid())
  courseId    String
  title       String
  description String?  @db.Text
  order       Int
  
  course      Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  lessons     Lesson[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([courseId])
  @@index([courseId, order])
}

model Lesson {
  id          String      @id @default(uuid())
  moduleId    String
  title       String
  content     String?     @db.Text
  type        LessonType  @default(VIDEO)
  videoUrl    String?
  duration    Int?        // Phút
  order       Int
  isFree      Boolean     @default(false) // Preview lesson
  
  // Quiz/Assignment specific
  quizData    Json?
  attachments String[]
  
  module      CourseModule @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  progress    LessonProgress[]
  discussions Discussion[]
  notes       LessonNote[]
  
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  @@index([moduleId])
  @@index([moduleId, order])
}

// ============================================
// ENROLLMENT & PROGRESS
// ============================================

model Enrollment {
  id              String           @id @default(uuid())
  userId          String
  courseId        String
  status          EnrollmentStatus @default(ACTIVE)
  progress        Int              @default(0) // 0-100%
  enrolledAt      DateTime         @default(now())
  completedAt     DateTime?
  expiresAt       DateTime?        // For time-limited courses
  lastAccessedAt  DateTime?
  
  user            User             @relation("UserEnrollments", fields: [userId], references: [id])
  course          Course           @relation(fields: [courseId], references: [id])
  lessonProgress  LessonProgress[]
  certificates    Certificate[]
  
  @@unique([userId, courseId])
  @@index([userId])
  @@index([courseId])
  @@index([status])
}

model LessonProgress {
  id              String     @id @default(uuid())
  enrollmentId    String
  lessonId        String
  completed       Boolean    @default(false)
  watchedDuration Int        @default(0) // Seconds
  lastWatchedAt   DateTime?
  
  // Quiz/Assignment results
  score           Int?       // 0-100
  attempts        Int        @default(0)
  
  enrollment      Enrollment @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)
  lesson          Lesson     @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
  
  @@unique([enrollmentId, lessonId])
  @@index([enrollmentId])
  @@index([lessonId])
}

model LessonNote {
  id          String   @id @default(uuid())
  lessonId    String
  userId      String
  content     String   @db.Text
  timestamp   Int?     // Video timestamp in seconds
  
  lesson      Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  user        User     @relation("UserNotes", fields: [userId], references: [id])
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([lessonId, userId])
  @@index([userId])
}

// ============================================
// REVIEWS & RATINGS
// ============================================

model CourseReview {
  id        String   @id @default(uuid())
  courseId  String
  userId    String
  rating    Int      // 1-5
  comment   String?  @db.Text
  
  course    Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  user      User     @relation("UserReviews", fields: [userId], references: [id])
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([courseId, userId])
  @@index([courseId])
  @@index([userId])
}

// ============================================
// CERTIFICATES
// ============================================

model Certificate {
  id              String     @id @default(uuid())
  enrollmentId    String
  userId          String
  courseId        String
  certificateUrl  String
  certificateCode String     @unique
  issuedAt        DateTime   @default(now())
  
  enrollment      Enrollment @relation(fields: [enrollmentId], references: [id])
  
  @@index([userId])
  @@index([enrollmentId])
  @@index([certificateCode])
}

// ============================================
// DISCUSSIONS & Q&A
// ============================================

model Discussion {
  id          String   @id @default(uuid())
  lessonId    String
  userId      String
  parentId    String?  // For replies
  content     String   @db.Text
  votes       Int      @default(0)
  isInstructorAnswer Boolean @default(false)
  isSolution  Boolean  @default(false)
  
  lesson      Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  user        User     @relation("UserDiscussions", fields: [userId], references: [id])
  parent      Discussion? @relation("DiscussionReplies", fields: [parentId], references: [id])
  replies     Discussion[] @relation("DiscussionReplies")
  votes_detail DiscussionVote[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([lessonId])
  @@index([userId])
  @@index([parentId])
}

model DiscussionVote {
  id           String     @id @default(uuid())
  discussionId String
  userId       String
  voteType     Int        // 1 for upvote, -1 for downvote
  
  discussion   Discussion @relation(fields: [discussionId], references: [id], onDelete: Cascade)
  user         User       @relation("UserVotes", fields: [userId], references: [id])
  
  createdAt    DateTime   @default(now())
  
  @@unique([discussionId, userId])
  @@index([discussionId])
  @@index([userId])
}
```

### Backend Module Structure

```
backend/src/modules/lms/
├── courses/
│   ├── courses.module.ts
│   ├── courses.service.ts
│   ├── courses.resolver.ts
│   ├── dto/
│   │   ├── create-course.input.ts
│   │   ├── update-course.input.ts
│   │   └── course-filters.input.ts
│   └── entities/
│       └── course.entity.ts
├── modules/
│   ├── course-modules.module.ts
│   ├── course-modules.service.ts
│   └── course-modules.resolver.ts
├── lessons/
│   ├── lessons.module.ts
│   ├── lessons.service.ts
│   └── lessons.resolver.ts
├── enrollments/
│   ├── enrollments.module.ts
│   ├── enrollments.service.ts
│   └── enrollments.resolver.ts
├── categories/
│   ├── categories.module.ts
│   ├── categories.service.ts
│   └── categories.resolver.ts
└── lms.module.ts
```

### Frontend Structure

```
frontend/src/app/(lms)/
├── courses/
│   ├── page.tsx                    # Course catalog
│   ├── [slug]/
│   │   ├── page.tsx                # Course detail page
│   │   └── learn/
│   │       └── page.tsx            # Learning interface
│   └── create/
│       └── page.tsx                # Create course (instructor)
├── my-learning/
│   └── page.tsx                    # Student dashboard
├── teach/
│   ├── page.tsx                    # Instructor dashboard
│   └── courses/
│       ├── page.tsx                # My courses
│       └── [id]/
│           ├── page.tsx            # Edit course
│           └── curriculum/
│               └── page.tsx        # Edit curriculum
└── admin/
    └── lms/
        ├── page.tsx                # LMS overview
        ├── courses/
        ├── users/
        └── analytics/

frontend/src/components/lms/
├── CourseCard.tsx
├── CourseList.tsx
├── CourseFilters.tsx
├── CourseHeader.tsx
├── ModuleList.tsx
├── LessonList.tsx
├── EnrollButton.tsx
├── ProgressBar.tsx
├── RatingStars.tsx
└── InstructorCard.tsx
```

### GraphQL Schema (MVP 1)

```graphql
# ============================================
# COURSE TYPES
# ============================================

type Course {
  id: ID!
  title: String!
  slug: String!
  description: String
  thumbnail: String
  trailer: String
  price: Float!
  level: CourseLevel!
  status: CourseStatus!
  duration: Int
  tags: [String!]!
  
  # Relations
  instructor: User!
  category: CourseCategory
  modules: [CourseModule!]!
  enrollments: [Enrollment!]!
  reviews: [CourseReview!]!
  
  # Stats
  enrollmentCount: Int!
  rating: Float!
  reviewCount: Int!
  
  # Timestamps
  createdAt: DateTime!
  updatedAt: DateTime!
  publishedAt: DateTime
}

type CourseCategory {
  id: ID!
  name: String!
  slug: String!
  description: String
  icon: String
  parent: CourseCategory
  children: [CourseCategory!]!
  courses: [Course!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type CourseModule {
  id: ID!
  title: String!
  description: String
  order: Int!
  course: Course!
  lessons: [Lesson!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Lesson {
  id: ID!
  title: String!
  content: String
  type: LessonType!
  videoUrl: String
  duration: Int
  order: Int!
  isFree: Boolean!
  attachments: [String!]!
  module: CourseModule!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Enrollment {
  id: ID!
  user: User!
  course: Course!
  status: EnrollmentStatus!
  progress: Int!
  enrolledAt: DateTime!
  completedAt: DateTime
  expiresAt: DateTime
  lastAccessedAt: DateTime
}

type LessonProgress {
  id: ID!
  enrollment: Enrollment!
  lesson: Lesson!
  completed: Boolean!
  watchedDuration: Int!
  score: Int
  attempts: Int!
  lastWatchedAt: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
}

type CourseReview {
  id: ID!
  course: Course!
  user: User!
  rating: Int!
  comment: String
  createdAt: DateTime!
  updatedAt: DateTime!
}

# ============================================
# ENUMS
# ============================================

enum CourseLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  EXPERT
}

enum CourseStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum LessonType {
  VIDEO
  TEXT
  QUIZ
  ASSIGNMENT
  LIVE_SESSION
}

enum EnrollmentStatus {
  ACTIVE
  COMPLETED
  DROPPED
  EXPIRED
}

# ============================================
# INPUTS
# ============================================

input CreateCourseInput {
  title: String!
  description: String
  thumbnail: String
  trailer: String
  price: Float!
  level: CourseLevel!
  categoryId: ID
  tags: [String!]
}

input UpdateCourseInput {
  title: String
  description: String
  thumbnail: String
  trailer: String
  price: Float
  level: CourseLevel
  status: CourseStatus
  categoryId: ID
  tags: [String!]
}

input CreateModuleInput {
  courseId: ID!
  title: String!
  description: String
  order: Int!
}

input CreateLessonInput {
  moduleId: ID!
  title: String!
  content: String
  type: LessonType!
  videoUrl: String
  duration: Int
  order: Int!
  isFree: Boolean
  attachments: [String!]
}

input CourseFiltersInput {
  categoryId: ID
  level: CourseLevel
  priceMin: Float
  priceMax: Float
  tags: [String!]
  search: String
}

# ============================================
# QUERIES
# ============================================

type Query {
  # Courses
  courses(filters: CourseFiltersInput, skip: Int, take: Int): [Course!]!
  course(id: ID, slug: String): Course
  myCourses: [Course!]!
  
  # Categories
  courseCategories: [CourseCategory!]!
  courseCategory(id: ID, slug: String): CourseCategory
  
  # Enrollments
  myEnrollments(status: EnrollmentStatus): [Enrollment!]!
  enrollment(id: ID, courseId: ID): Enrollment
  
  # Progress
  myProgress(courseId: ID!): [LessonProgress!]!
  lessonProgress(enrollmentId: ID!, lessonId: ID!): LessonProgress
}

# ============================================
# MUTATIONS
# ============================================

type Mutation {
  # Course Management
  createCourse(input: CreateCourseInput!): Course!
  updateCourse(id: ID!, input: UpdateCourseInput!): Course!
  deleteCourse(id: ID!): Boolean!
  publishCourse(id: ID!): Course!
  
  # Module Management
  createModule(input: CreateModuleInput!): CourseModule!
  updateModule(id: ID!, title: String, description: String, order: Int): CourseModule!
  deleteModule(id: ID!): Boolean!
  reorderModules(courseId: ID!, moduleIds: [ID!]!): [CourseModule!]!
  
  # Lesson Management
  createLesson(input: CreateLessonInput!): Lesson!
  updateLesson(id: ID!, input: CreateLessonInput!): Lesson!
  deleteLesson(id: ID!): Boolean!
  reorderLessons(moduleId: ID!, lessonIds: [ID!]!): [Lesson!]!
  
  # Enrollment
  enrollCourse(courseId: ID!): Enrollment!
  unenrollCourse(enrollmentId: ID!): Boolean!
  
  # Progress Tracking
  updateLessonProgress(
    enrollmentId: ID!
    lessonId: ID!
    completed: Boolean
    watchedDuration: Int
  ): LessonProgress!
  
  # Reviews
  createReview(courseId: ID!, rating: Int!, comment: String): CourseReview!
  updateReview(id: ID!, rating: Int, comment: String): CourseReview!
  deleteReview(id: ID!): Boolean!
}
```

### Tasks Checklist - MVP 1

#### Backend
- [ ] Update Prisma schema với LMS models
- [ ] Generate Prisma client: `bun prisma generate`
- [ ] Create migration: `bun prisma migrate dev --name add_lms_tables`
- [ ] Create LMS module structure
- [ ] Implement Course service & resolver
- [ ] Implement Module service & resolver
- [ ] Implement Lesson service & resolver
- [ ] Implement Enrollment service & resolver
- [ ] Implement Category service & resolver
- [ ] Add authorization guards (instructor/admin only)
- [ ] Write unit tests

#### Frontend
- [ ] Create LMS routes structure
- [ ] Implement Course catalog page
- [ ] Implement Course detail page
- [ ] Implement Course creation form (instructor)
- [ ] Implement Module/Lesson management UI
- [ ] Implement Enrollment button & flow
- [ ] Create reusable LMS components
- [ ] Add GraphQL queries/mutations
- [ ] Implement responsive design

#### DevOps
- [ ] Update docker-compose if needed
- [ ] Add environment variables
- [ ] Test migration on staging

---

## 🎯 MVP 2: Content Delivery & Progress Tracking (1 tuần)

### Features chính

#### 1. Advanced Video Player
- ✅ Video.js hoặc Plyr integration
- ✅ Playback speed control (0.5x - 2x)
- ✅ Quality selection
- ✅ Subtitles/Captions support
- ✅ Picture-in-Picture mode
- ✅ Keyboard shortcuts
- ✅ Auto-save progress (every 5 seconds)
- ✅ Resume from last position

#### 2. Progress Dashboard
- ✅ Student dashboard:
  - My courses grid
  - Continue learning section
  - Progress bars
  - Time spent tracking
  - Certificates earned
- ✅ Course-specific progress:
  - Module completion checklist
  - Overall progress percentage
  - Estimated time remaining
  - Next lesson recommendation

#### 3. Quiz System
- ✅ Question types:
  - Multiple choice (single/multiple answers)
  - True/False
  - Fill in the blanks
  - Short answer
- ✅ Auto-grading
- ✅ Instant feedback
- ✅ Explanation for answers
- ✅ Quiz attempts tracking
- ✅ Passing score configuration
- ✅ Retry logic

#### 4. Notes & Bookmarks
- ✅ Rich text notes editor
- ✅ Video timestamp bookmarks
- ✅ Search across all notes
- ✅ Export notes (PDF, Markdown)
- ✅ Share notes with instructor

### Additional Database Models

```prisma
model VideoBookmark {
  id          String   @id @default(uuid())
  lessonId    String
  userId      String
  timestamp   Int      // Seconds
  title       String
  note        String?  @db.Text
  
  createdAt   DateTime @default(now())
  
  @@index([lessonId, userId])
  @@index([userId])
}

model QuizAttempt {
  id           String   @id @default(uuid())
  lessonId     String
  userId       String
  enrollmentId String
  answers      Json     // Store all answers
  score        Int      // 0-100
  passed       Boolean
  timeSpent    Int      // Seconds
  
  createdAt    DateTime @default(now())
  
  @@index([lessonId, userId])
  @@index([enrollmentId])
}
```

### Technical Implementation

#### Redis for Real-time Progress
```typescript
// Track video progress in Redis
SETEX user:{userId}:lesson:{lessonId}:progress {timestamp} 300

// Get current progress
GET user:{userId}:lesson:{lessonId}:progress

// Batch save to PostgreSQL every 30 seconds
```

#### WebSocket for Live Updates
```typescript
// Subscribe to course progress updates
subscription onCourseProgressUpdate($enrollmentId: ID!) {
  courseProgressUpdated(enrollmentId: $enrollmentId) {
    progress
    lastLessonCompleted {
      id
      title
    }
  }
}
```

### Tasks Checklist - MVP 2

#### Backend
- [ ] Implement video progress tracking service
- [ ] Create Quiz engine service
- [ ] Add Notes CRUD operations
- [ ] Add Bookmarks functionality
- [ ] Implement WebSocket for real-time updates
- [ ] Add Redis caching for progress
- [ ] Create progress calculation service
- [ ] Add GraphQL subscriptions

#### Frontend
- [ ] Integrate video player (Video.js/Plyr)
- [ ] Implement progress tracking UI
- [ ] Create quiz component
- [ ] Build notes editor
- [ ] Add bookmarks UI
- [ ] Create student dashboard
- [ ] Add progress visualization charts
- [ ] Implement search notes functionality

---

## 💼 MVP 3: Internal Training Features (1 tuần)

### Features chính

#### 1. Department-based Access Control
- ✅ Assign courses to departments
- ✅ Mandatory courses (compliance training)
- ✅ Due dates for completion
- ✅ Auto-enrollment for new employees
- ✅ Department-specific reporting

#### 2. Learning Paths
- ✅ Create skill-based learning paths
- ✅ Group multiple courses
- ✅ Define prerequisites
- ✅ Track path completion
- ✅ Award path certificates

#### 3. Assignments & Submissions
- ✅ Create assignments with deadlines
- ✅ File upload (documents, videos)
- ✅ Instructor grading interface
- ✅ Rubric-based grading
- ✅ Feedback & comments
- ✅ Revision requests

#### 4. Discussion Forums
- ✅ Q&A for each lesson
- ✅ Threaded replies
- ✅ Upvote/downvote system
- ✅ Mark as solution
- ✅ Instructor-verified answers
- ✅ Search discussions
- ✅ Email notifications

### Additional Database Models

```prisma
model Department {
  id          String   @id @default(uuid())
  name        String
  code        String   @unique
  description String?
  managerId   String?
  
  users       User[]   @relation("DepartmentUsers")
  mandatoryCourses DepartmentCourse[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([code])
}

model DepartmentCourse {
  id           String     @id @default(uuid())
  departmentId String
  courseId     String
  isMandatory  Boolean    @default(false)
  dueDate      DateTime?
  
  department   Department @relation(fields: [departmentId], references: [id])
  
  createdAt    DateTime   @default(now())
  
  @@unique([departmentId, courseId])
  @@index([departmentId])
  @@index([courseId])
}

model LearningPath {
  id          String   @id @default(uuid())
  title       String
  slug        String   @unique
  description String?  @db.Text
  thumbnail   String?
  duration    Int?     // Total minutes
  
  courses     LearningPathCourse[]
  enrollments LearningPathEnrollment[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([slug])
}

model LearningPathCourse {
  id              String       @id @default(uuid())
  learningPathId  String
  courseId        String
  order           Int
  prerequisiteId  String?      // ID of course that must be completed first
  
  learningPath    LearningPath @relation(fields: [learningPathId], references: [id], onDelete: Cascade)
  prerequisite    LearningPathCourse? @relation("CoursePrerequisite", fields: [prerequisiteId], references: [id])
  dependents      LearningPathCourse[] @relation("CoursePrerequisite")
  
  @@unique([learningPathId, courseId])
  @@index([learningPathId])
}

model LearningPathEnrollment {
  id             String       @id @default(uuid())
  userId         String
  learningPathId String
  progress       Int          @default(0) // 0-100%
  enrolledAt     DateTime     @default(now())
  completedAt    DateTime?
  
  learningPath   LearningPath @relation(fields: [learningPathId], references: [id])
  
  @@unique([userId, learningPathId])
  @@index([userId])
  @@index([learningPathId])
}

model Assignment {
  id          String   @id @default(uuid())
  lessonId    String
  title       String
  description String   @db.Text
  maxScore    Int      @default(100)
  dueDate     DateTime?
  allowLateSubmission Boolean @default(false)
  
  submissions AssignmentSubmission[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([lessonId])
}

model AssignmentSubmission {
  id           String   @id @default(uuid())
  assignmentId String
  userId       String
  enrollmentId String
  content      String   @db.Text
  attachments  String[] // URLs to files
  score        Int?
  feedback     String?  @db.Text
  status       SubmissionStatus @default(PENDING)
  
  assignment   Assignment @relation(fields: [assignmentId], references: [id], onDelete: Cascade)
  
  submittedAt  DateTime @default(now())
  gradedAt     DateTime?
  
  @@index([assignmentId])
  @@index([userId])
  @@index([enrollmentId])
}

enum SubmissionStatus {
  PENDING
  GRADED
  NEEDS_REVISION
  LATE
}
```

### Tasks Checklist - MVP 3

#### Backend
- [ ] Implement Department management
- [ ] Create Learning Paths service
- [ ] Add Assignment & Submission logic
- [ ] Implement Discussion forum service
- [ ] Add vote tracking for discussions
- [ ] Create compliance tracking service
- [ ] Add email notifications
- [ ] Implement prerequisite checking

#### Frontend
- [ ] Create Department admin UI
- [ ] Build Learning Paths UI
- [ ] Implement Assignment submission interface
- [ ] Create grading interface for instructors
- [ ] Build Discussion forum component
- [ ] Add compliance dashboard
- [ ] Implement notification center

---

## 💰 MVP 4: Customer LMS & Monetization (1-2 tuần)

### Features chính

#### 1. Payment Integration
- ✅ VNPay integration
- ✅ Momo wallet
- ✅ International cards (Stripe)
- ✅ Shopping cart
- ✅ Coupon/Discount codes
- ✅ Bulk purchase for enterprises
- ✅ Invoice generation
- ✅ Refund processing

#### 2. Customer Portal
- ✅ Public course catalog
- ✅ Advanced search & filters
- ✅ Course comparison
- ✅ Preview lessons
- ✅ Instructor profiles
- ✅ Course reviews & ratings
- ✅ Wishlist
- ✅ Order history

#### 3. Certificate System
- ✅ Auto-generate PDF certificates
- ✅ Custom certificate templates
- ✅ Digital signatures
- ✅ Verification page (QR code)
- ✅ Share to LinkedIn
- ✅ Download as PDF

#### 4. Analytics Dashboard
- ✅ Revenue reports
- ✅ Sales funnel analytics
- ✅ Popular courses
- ✅ Student engagement metrics
- ✅ Completion rates
- ✅ Instructor performance
- ✅ Customer lifetime value
- ✅ Churn analysis

### Additional Database Models

```prisma
model Order {
  id              String      @id @default(uuid())
  userId          String
  orderNumber     String      @unique
  total           Decimal     @db.Decimal(10, 2)
  subtotal        Decimal     @db.Decimal(10, 2)
  discount        Decimal     @default(0) @db.Decimal(10, 2)
  tax             Decimal     @default(0) @db.Decimal(10, 2)
  status          OrderStatus @default(PENDING)
  paymentMethod   String?
  paymentId       String?     // Payment gateway transaction ID
  couponCode      String?
  
  user            User        @relation("UserOrders", fields: [userId], references: [id])
  items           OrderItem[]
  
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  paidAt          DateTime?
  
  @@index([userId])
  @@index([orderNumber])
  @@index([status])
}

model OrderItem {
  id        String  @id @default(uuid())
  orderId   String
  courseId  String
  price     Decimal @db.Decimal(10, 2)
  discount  Decimal @default(0) @db.Decimal(10, 2)
  
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  @@index([orderId])
  @@index([courseId])
}

model Coupon {
  id          String       @id @default(uuid())
  code        String       @unique
  description String?
  discountType CouponType  @default(PERCENTAGE)
  discount    Decimal      @db.Decimal(10, 2) // Percentage or fixed amount
  maxUses     Int?
  usedCount   Int          @default(0)
  minPurchase Decimal?     @db.Decimal(10, 2)
  validFrom   DateTime
  validTo     DateTime
  isActive    Boolean      @default(true)
  
  // Restrictions
  applicableCourses String[] // Empty means all courses
  
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  
  @@index([code])
  @@index([isActive])
}

enum CouponType {
  PERCENTAGE
  FIXED_AMOUNT
}

model Wishlist {
  id        String   @id @default(uuid())
  userId    String
  courseId  String
  
  user      User     @relation("UserWishlist", fields: [userId], references: [id])
  
  createdAt DateTime @default(now())
  
  @@unique([userId, courseId])
  @@index([userId])
}

model CertificateTemplate {
  id          String   @id @default(uuid())
  name        String
  htmlContent String   @db.Text
  variables   String[] // Available variables: {studentName}, {courseName}, etc.
  isDefault   Boolean  @default(false)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Payment Flow

```typescript
// 1. Create order
mutation CreateOrder {
  createOrder(input: {
    courseIds: ["course-id-1", "course-id-2"]
    couponCode: "NEWYEAR2025"
  }) {
    id
    orderNumber
    total
    paymentUrl // Redirect URL for payment gateway
  }
}

// 2. Handle payment callback
// VNPay, Momo sẽ redirect về callback URL
// Backend verify payment signature
// Update order status
// Create enrollments
// Send confirmation email

// 3. Generate certificate on course completion
mutation GenerateCertificate {
  generateCertificate(enrollmentId: "enrollment-id") {
    id
    certificateUrl
    certificateCode
    verificationUrl
  }
}
```

### Tasks Checklist - MVP 4

#### Backend
- [ ] Implement Order management
- [ ] Integrate VNPay payment gateway
- [ ] Integrate Momo wallet
- [ ] Add Stripe for international payments
- [ ] Create Coupon system
- [ ] Implement Wishlist functionality
- [ ] Build Certificate generation service (PDF)
- [ ] Add certificate verification endpoint
- [ ] Create Analytics service
- [ ] Implement Invoice generation
- [ ] Add refund processing

#### Frontend
- [ ] Create shopping cart
- [ ] Build checkout flow
- [ ] Implement payment pages
- [ ] Create public course catalog
- [ ] Build course comparison tool
- [ ] Add wishlist UI
- [ ] Create order history page
- [ ] Implement certificate viewer
- [ ] Build analytics dashboards
- [ ] Add revenue charts

---

## 📊 Timeline & Milestones

| Week | MVP | Key Deliverables | Team Focus |
|------|-----|------------------|------------|
| 1-2 | MVP 1 | Database schema, Course CRUD, Basic enrollment | Backend + Frontend |
| 3 | MVP 2 | Video player, Progress tracking, Quiz system | Frontend heavy |
| 4 | MVP 3 | Learning paths, Assignments, Discussions | Backend heavy |
| 5-6 | MVP 4 | Payment integration, Certificates, Analytics | Full team |

**Total: 6 tuần** cho hệ thống LMS production-ready

---

## 🔒 Security Considerations

### Authentication & Authorization
- ✅ JWT-based authentication (đã có)
- ✅ Role-based access control (RBAC)
- ✅ Course ownership verification
- ✅ Enrollment verification before content access

### Content Protection
- ✅ Signed URLs cho video (MinIO presigned URLs)
- ✅ DRM for premium content (optional)
- ✅ Download prevention
- ✅ Watermarking for videos

### Payment Security
- ✅ PCI DSS compliance
- ✅ Secure payment gateway integration
- ✅ Transaction verification
- ✅ Fraud detection

---

## 🚀 Deployment Strategy

### Environment Setup
```bash
# Development
docker-compose up -d

# Staging
docker-compose -f docker-compose.yml -f docker-compose.staging.yml up -d

# Production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Database Migrations
```bash
# Create migration
bun prisma migrate dev --name add_lms_tables

# Deploy to production
bun prisma migrate deploy
```

### Environment Variables
```env
# LMS Configuration
LMS_ENABLED=true
LMS_VIDEO_STORAGE=minio
LMS_MAX_VIDEO_SIZE=500MB
LMS_CERTIFICATE_STORAGE=minio

# Payment Gateways
VNPAY_TMN_CODE=your_tmn_code
VNPAY_HASH_SECRET=your_hash_secret
MOMO_PARTNER_CODE=your_partner_code
MOMO_ACCESS_KEY=your_access_key
STRIPE_SECRET_KEY=your_stripe_key

# Certificate Generation
CERTIFICATE_SIGNING_KEY=your_signing_key
CERTIFICATE_BASE_URL=https://your-domain.com/certificates
```

---

## 📈 Performance Optimization

### Video Delivery
- ✅ CDN integration for video streaming
- ✅ Adaptive bitrate streaming (HLS)
- ✅ Video transcoding pipeline
- ✅ Thumbnail generation

### Database Optimization
- ✅ Proper indexing (đã có trong schema)
- ✅ Query optimization
- ✅ Connection pooling
- ✅ Read replicas for analytics

### Caching Strategy
- ✅ Redis for session & progress
- ✅ Course catalog caching
- ✅ CDN for static assets
- ✅ GraphQL query caching

---

## 🧪 Testing Strategy

### Backend Tests
```typescript
// Unit tests
describe('CourseService', () => {
  it('should create course', async () => {
    // Test logic
  });
});

// Integration tests
describe('Enrollment Flow', () => {
  it('should enroll user in course', async () => {
    // Test logic
  });
});
```

### Frontend Tests
```typescript
// Component tests with React Testing Library
describe('CourseCard', () => {
  it('should render course information', () => {
    // Test logic
  });
});

// E2E tests with Cypress
describe('Course Enrollment', () => {
  it('should allow user to enroll in free course', () => {
    // Test logic
  });
});
```

---

## 📚 Documentation

### API Documentation
- GraphQL Playground: `http://localhost:3001/graphql`
- Auto-generated schema documentation

### User Guides
- Student guide: How to enroll and learn
- Instructor guide: How to create courses
- Admin guide: System management

### Developer Docs
- API reference
- Database schema
- Architecture diagrams
- Setup instructions

---

## 🎯 Success Metrics

### Business Metrics
- Number of courses created
- Total enrollments
- Revenue from paid courses
- Course completion rate
- Customer satisfaction (NPS)

### Technical Metrics
- API response time < 200ms
- Video playback quality
- System uptime > 99.9%
- Page load time < 3s
- Mobile responsiveness

---

## 🔄 Future Enhancements (Post-MVP)

### Phase 2 (3 tháng sau MVP)
- 📱 Mobile apps (React Native)
- 🎙️ Live streaming classes
- 🤝 Peer-to-peer learning
- 🏆 Gamification (badges, leaderboards)
- 🌍 Multi-language support
- 🤖 AI-powered recommendations
- 📊 Advanced analytics & reporting

### Phase 3 (6 tháng sau MVP)
- 🎓 Accreditation & partnerships
- 🏢 Enterprise SSO integration
- 📱 Offline mobile learning
- 🎬 Interactive video (hotspots, quizzes)
- 🧠 Adaptive learning paths
- 🔗 Integration with HR systems

---

## 🆘 Support & Resources

### Technical Stack Documentation
- [NestJS Docs](https://docs.nestjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Next.js Docs](https://nextjs.org/docs)
- [Apollo GraphQL](https://www.apollographql.com/docs/)

### Payment Gateway Docs
- [VNPay Integration](https://sandbox.vnpayment.vn/apis/)
- [Momo Wallet API](https://developers.momo.vn/)
- [Stripe API](https://stripe.com/docs/api)

---

## ✅ Getting Started

### 1. Update Database Schema
```bash
cd backend
# Backup current database
bun run db:backup

# Add LMS schema to prisma/schema.prisma
# Then run migration
bun prisma migrate dev --name add_lms_tables

# Generate Prisma client
bun prisma generate
```

### 2. Create Backend Modules
```bash
# Generate NestJS modules
nest g module modules/lms
nest g module modules/lms/courses
nest g service modules/lms/courses
nest g resolver modules/lms/courses
```

### 3. Create Frontend Pages
```bash
cd frontend/src/app
mkdir -p (lms)/courses
mkdir -p (lms)/my-learning
mkdir -p (lms)/teach
```

### 4. Start Development
```bash
# Terminal 1: Backend
cd backend
bun run dev

# Terminal 2: Frontend
cd frontend
bun run dev

# Terminal 3: Database
docker-compose up postgres redis
```

---

## 📞 Contact & Support

Nếu có thắc mắc trong quá trình triển khai:
1. Tạo issue trong repo
2. Tham khảo documentation
3. Liên hệ team leader

---

**Document Version:** 1.0  
**Last Updated:** 20/10/2025  
**Author:** rausachcore Team  
**Status:** Ready for Implementation 🚀
