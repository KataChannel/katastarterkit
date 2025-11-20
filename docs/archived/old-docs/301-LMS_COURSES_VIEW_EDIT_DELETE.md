# Tổng hợp: LMS Admin Courses - CRUD Hoàn chỉnh

**Ngày**: 3 tháng 11, 2025  
**Tác giả**: GitHub Copilot  
**Dự án**: RauSachCore - Modern Fullstack Starter Kit

---

## 📋 Tổng quan

Đã hoàn thành đầy đủ tính năng **CRUD** cho `/lms/admin/courses`:

1. **List Page** - Danh sách khóa học với actions
2. **Create Page** - Tạo khóa học mới
3. **View Page** - Xem chi tiết khóa học  
4. **Edit Page** - Chỉnh sửa khóa học

---

## 🎯 Chi tiết triển khai

### 1. List Page (`/lms/admin/courses/page.tsx`)

**Tính năng đã có**:
- ✅ Grid responsive (1→2→3 cột)
- ✅ Search & Filter (All/Published/Draft)
- ✅ Toggle publish status (DRAFT ⟷ PUBLISHED)
- ✅ Actions: Create, View, Edit, Delete

**Actions**:
```typescript
handleCreateCourse()   → /lms/admin/courses/create
handleViewCourse(id)   → /lms/admin/courses/{id}
handleEditCourse(id)   → /lms/admin/courses/{id}/edit
handleDeleteClick(id)  → AlertDialog confirmation
```

**Features**:
- Card layout với hover effect
- Badge status (click để toggle)
- Stats: Enrollments, Modules, Duration, Reviews
- Price formatting (VND)
- Instructor info
- Delete confirmation dialog
- Toast notifications

---

### 2. Create Page (`/lms/admin/courses/create/page.tsx`)

**File**: `frontend/src/app/lms/admin/courses/create/page.tsx`  
**Lines**: ~550 lines

**Form giống Edit Page nhưng**:
- ✅ Không cần load data (empty form)
- ✅ Không có skip condition
- ✅ useCreateOne thay vì useUpdateOne
- ✅ Redirect về list sau khi tạo thành công
- ✅ Validation: Bắt buộc chọn instructor

**GraphQL**:
```typescript
useCreateOne('Course', {
  data: { all fields }
})
```

**Features**:
- Auto-generate slug từ title
- Dynamic arrays management
- SEO character counters
- Instructor required validation
- Categories & Instructors dropdown

---

### 3. View Page (`/lms/admin/courses/[id]/page.tsx`)

**File**: `frontend/src/app/lms/admin/courses/[id]/page.tsx`  
**Lines**: ~650 lines

**Layout**: 2-column responsive (Left: Content | Right: Stats)

#### Left Column - Main Content:
- ✅ **Basic Info**
  - Title, Slug, Status badge
  - Thumbnail image (Next.js Image)
  - Description (whitespace preserved)

- ✅ **Learning Content**
  - What You Will Learn (✓ checklist)
  - Requirements (bullet list)
  - Target Audience (bullet list)

- ✅ **SEO Info**
  - Meta Title
  - Meta Description
  - Tags (badges with icons)

#### Right Column - Stats & Info:
- ✅ **Stats Grid (2x2)**
  - Enrollments (blue)
  - Modules (green)
  - Avg Rating (yellow)
  - View Count (purple)

- ✅ **Course Details**
  - Price (VND formatting)
  - Level badge (Beginner/Intermediate/Advanced/Expert)
  - Duration (minutes)
  - Language
  - Discussions count

- ✅ **Related Info**
  - Instructor (name, email)
  - Category (badge)
  - Timestamps (Created/Updated/Published)
  - Trailer video URL

**Actions**:
- Back button
- Toggle Publish/Draft
- Edit button
- Delete button (with confirmation)

**GraphQL Query**:
```typescript
useFindUnique('Course', {
  include: {
    instructor,
    category,
    _count: { modules, enrollments, reviews, discussions }
  }
})
```

---

### 4. Edit Page (`/lms/admin/courses/[id]/edit/page.tsx`)

**File**: `frontend/src/app/lms/admin/courses/[id]/edit/page.tsx`  
**Lines**: ~750 lines

**Form Sections**:

#### 1. Thông tin cơ bản
- Title (auto-generate slug)
- Slug (editable)
- Description (Textarea)
- Thumbnail URL
- Trailer URL
- Price, Duration, Level, Status
- Language, Category

**Features**:
- Auto slug generation từ Vietnamese title
- Normalize Unicode: "Khóa học" → "khoa-hoc"
- Grid responsive 1→2→4 columns
- Select components cho Level/Status/Language/Category

#### 2. Nội dung học tập
- **What You Will Learn**
  - Input + Add button
  - List với remove buttons
  - Enter key to add

- **Requirements**
  - Same UI pattern
  - Array management

- **Target Audience**
  - Same UI pattern
  - Array management

**Features**:
- Dynamic array CRUD
- Keyboard shortcuts (Enter to add)
- Remove individual items
- Visual feedback (bg-gray-50)

#### 3. SEO & Marketing
- Meta Title (max 60 chars with counter)
- Meta Description (max 160 chars with counter)
- Tags (pills with remove)

**Form Handling**:
```typescript
useEffect(() => {
  // Load course data to form
  setFormData(...)
  setWhatYouWillLearn(...)
  setRequirements(...)
  ...
})

handleSubmit → updateCourse → toast → redirect to view
```

**Validation**:
- Required fields: title, slug
- Max length: metaTitle (60), metaDescription (160)
- Number fields: price, duration (min 0)

---

## 🎨 Design Patterns

### Mobile First + Responsive
```
Grid: 1 → 2 → 3 columns (list)
Grid: 1 → 2 columns (edit form)
Layout: Stack → 2-column (view page)
Actions: Icon only → Icon + Text
```

### Shadcn UI Components
- Card, CardHeader, CardContent
- Button (variants: default, outline, ghost)
- Input, Textarea, Label
- Select (with categories, instructors data)
- Badge (status, level, tags)
- Separator
- AlertDialog (delete confirmation)
- Toast notifications

### Icons (Lucide React)
```
Navigation: ArrowLeft
Actions: Edit, Trash2, Eye, Save
Stats: Users, BookOpen, Star, Eye, DollarSign
Content: Target, CheckCircle, AlertCircle
Time: Clock, Calendar
Media: Video, Upload, Image
Social: MessageSquare
General: Tag, Globe, Award
```

---

## 📊 GraphQL Operations

### View Page
```graphql
useFindUnique('Course', {
  where: { id },
  select: { all fields },
  include: {
    instructor: { firstName, lastName, email },
    category: { name, slug },
    _count: { modules, enrollments, reviews, discussions }
  }
})
```

### Edit Page
```graphql
# Load data
useFindUnique('Course')
useFindMany('CourseCategory')
useFindMany('User', { where: { roleType: 'GIANGVIEN' } })

# Update
useUpdateOne('Course', {
  where: { id },
  data: { all fields + arrays }
})
```

### List Page
```graphql
useDeleteOne('Course', { where: { id } })
useUpdateOne('Course', { 
  where: { id }, 
  data: { status: 'PUBLISHED'/'DRAFT' } 
})
```

---

## ✨ Tính năng nổi bật

### 1. Auto Slug Generation
```typescript
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .normalize('NFD')           // Unicode normalization
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/đ/g, 'd')         // Vietnamese đ
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric
    .replace(/^-+|-+$/g, '');    // Trim dashes
}
```

### 2. Dynamic Arrays Management
- Add items (Enter key or button)
- Remove items individually
- Empty state handling
- Visual feedback

### 3. Toggle Publish Status
- Click badge to toggle
- Immediate feedback
- Toast notification
- Refetch data

### 4. Image Handling
- Next.js Image component
- Fallback for missing images
- Responsive sizing
- Object-fit cover

### 5. Price Formatting
```typescript
new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
}).format(price)
```

### 6. Date Formatting
```typescript
new Date(date).toLocaleDateString('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})
```

---

## 🔒 Safety Features

### Delete Confirmation
- AlertDialog with warning message
- Disable actions during delete
- Clear explanation of consequences
- Cancel option

### Form Validation
- Required field indicators (*)
- Max length counters for SEO fields
- Min value for number inputs
- URL format validation (visual only)

### Error Handling
- Loading states (spinner)
- Error states (AlertCircle)
- Empty states (helpful messages)
- Toast notifications for all actions

---

## 📱 Responsive Breakpoints

```css
Mobile (default):  1 column, stack layout
SM (640px):        2 columns for some grids
MD (768px):        2 columns for forms
LG (1024px):       2-3 columns, side-by-side layout
XL (1280px):       3 columns for course grid
```

---

## ✅ Checklist hoàn thành

- [x] List page với Create/View/Edit/Delete actions
- [x] Create page với form đầy đủ
- [x] View page với layout 2 cột responsive
- [x] Edit page với form đầy đủ
- [x] Auto slug generation (Vietnamese support)
- [x] Toggle publish status
- [x] Delete confirmation dialog
- [x] Toast notifications (success/error)
- [x] Loading & error states
- [x] Skip GraphQL query khi chưa có ID
- [x] Mobile First responsive
- [x] Shadcn UI components
- [x] Vietnamese language
- [x] Dynamic GraphQL hooks
- [x] TypeScript type safety
- [x] No compilation errors
- [x] Follow rulepromt.txt

---

## 🚀 Kết quả

4 pages hoàn chỉnh cho Courses CRUD:
- **List**: 380 lines (đã có)
- **Create**: 550 lines (mới)
- **View**: 650 lines (mới)
- **Edit**: 750 lines (mới)

Tổng cộng: **~2330 lines** production-ready code

**Routes**:
```
/lms/admin/courses           → List
/lms/admin/courses/create    → Create
/lms/admin/courses/{id}      → View
/lms/admin/courses/{id}/edit → Edit
```

Tất cả tuân thủ:
- ✅ Code Like Senior
- ✅ Dynamic GraphQL
- ✅ Mobile First + Responsive + PWA
- ✅ Shadcn UI
- ✅ Tiếng Việt
- ✅ No git, No testing

---

**Status**: ✅ HOÀN THÀNH
