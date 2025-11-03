# QUẢN LÝ DANH MỤC KHÓA HỌC LMS

## 📁 FILE MỚI TẠO
- `/frontend/src/app/lms/admin/categories/page.tsx` (425 dòng)

## ✅ TÍNH NĂNG ĐÃ HOÀN THÀNH

### 1. **Hiển thị danh sách danh mục**
- Grid responsive: 1 → 2 → 3 → 4 columns (Mobile → Desktop)
- Card hiển thị: Icon Folder, Tên, Slug, Mô tả, Số khóa học
- Loading, Error, Empty states với icon
- Sắp xếp theo tên A-Z

### 2. **Tìm kiếm danh mục**
- Search real-time theo tên và mô tả
- Icon Search trong input box

### 3. **Tạo danh mục mới**
- Dialog form với Header, Content scrollable, Footer
- Fields: Tên (*), Slug (auto), Mô tả
- Auto-generate slug từ tên (hỗ trợ tiếng Việt)
- Validation: Tên bắt buộc
- Toast notification khi thành công/lỗi

### 4. **Sửa danh mục**
- Click button "Sửa" mở dialog pre-filled
- Cập nhật tên, slug, mô tả
- Toast notification

### 5. **Xóa danh mục**
- Confirmation dialog với warning
- **Prevent delete**: Không cho xóa nếu có khóa học
- Button delete disabled khi có courses
- Toast notification

## 🎨 UI/UX THEO RULEPROMT

### ✅ Mobile First + Responsive
```css
Grid: 
- Mobile: 1 column
- SM: 2 columns  
- LG: 3 columns
- XL: 4 columns

Header:
- Mobile: flex-col, full-width button
- Desktop: flex-row, auto-width button

Text:
- Mobile: text-2xl
- Desktop: text-3xl
```

### ✅ Dialog Layout
```
┌─────────────────────────┐
│ Header (Title + Desc)   │
├─────────────────────────┤
│                         │
│ Content (Scrollable)    │
│ - Form fields           │
│ - Validation            │
│                         │
├─────────────────────────┤
│ Footer (Buttons)        │
└─────────────────────────┘
```

### ✅ Shadcn UI Components
- Dialog (Create/Edit form)
- AlertDialog (Delete confirmation)
- Card (Category cards)
- Button (Primary, Outline, with icons)
- Input (Search, text fields)
- Textarea (Description)
- Label (Form labels)
- Badge (Coming soon for active/inactive)

### ✅ Tiếng Việt
- Tất cả labels, messages, placeholders bằng tiếng Việt
- Toast messages tiếng Việt
- Error/Success messages tiếng Việt

## 🔧 DYNAMIC GRAPHQL

### Query - Fetch Categories
```typescript
useFindMany('Category', {
  select: {
    id: true,
    name: true,
    slug: true,
    description: true,
  },
  include: {
    _count: {
      select: { courses: true }
    }
  },
  orderBy: { name: 'asc' }
})
```

### Mutation - Create
```typescript
createCategory({
  data: {
    name: string,
    slug: string,
    description: string | null
  }
})
```

### Mutation - Update
```typescript
updateCategory({
  where: { id: string },
  data: {
    name: string,
    slug: string,
    description: string | null
  }
})
```

### Mutation - Delete
```typescript
deleteCategory({
  where: { id: string }
})
```

## 🎯 BUSINESS LOGIC

### Auto-generate Slug
```typescript
const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // Remove accents
    .replace(/đ/g, 'd')                // Đ → d
    .replace(/[^a-z0-9\s-]/g, '')      // Keep a-z, 0-9, space, dash
    .replace(/\s+/g, '-')              // Space → dash
    .replace(/-+/g, '-')               // Multiple dash → single
    .trim();
};
```

### Prevent Delete with Courses
- Button delete disabled khi `_count.courses > 0`
- Dialog message warning khi có courses
- Submit button disabled khi có courses

## 📊 STATE MANAGEMENT

```typescript
- searchQuery: string
- dialogOpen: boolean (Create/Edit)
- deleteDialogOpen: boolean
- editMode: boolean
- categoryToDelete: Category | null
- formData: { id, name, slug, description }
```

## 🔄 USER FLOWS

### Tạo danh mục
```
Click "Tạo danh mục mới" 
  → Dialog opens (empty form)
  → Nhập tên → slug auto-generate
  → Nhập mô tả (optional)
  → Click "Tạo mới"
  → GraphQL mutation
  → Toast success
  → Dialog closes
  → List refetch
```

### Sửa danh mục
```
Click "Sửa" button
  → Dialog opens (pre-filled)
  → Update fields
  → Click "Cập nhật"
  → GraphQL mutation
  → Toast success
  → Dialog closes
  → List refetch
```

### Xóa danh mục
```
Click "Trash" button
  → Check courses count
  → If has courses: Button disabled
  → If no courses: Confirmation dialog
  → Click "Xóa danh mục"
  → GraphQL mutation
  → Toast success
  → Dialog closes
  → List refetch
```

## 🎨 ICONS

- `Folder`: Category icon (blue)
- `FolderOpen`: Empty state
- `BookOpen`: Courses count
- `Plus`: Create button
- `Edit`: Edit button
- `Trash2`: Delete button
- `Search`: Search input
- `AlertCircle`: Error state

## 📱 RESPONSIVE BREAKPOINTS

```typescript
Mobile:   < 640px  (sm)
Tablet:   640px+   (sm)
Desktop:  1024px+  (lg)
Large:    1280px+  (xl)
```

## ⚡ PERFORMANCE

- Auto refetch sau mỗi mutation
- Loading states trên buttons
- Disabled states khi đang submit
- Client-side filtering (real-time search)

## 🔒 VALIDATION

- Tên danh mục: Required
- Slug: Auto-generate, read-only
- Mô tả: Optional
- Delete: Prevent nếu có courses

## ✨ HIGHLIGHTS

1. **Code như Senior**: Clean, typed, reusable
2. **Dynamic GraphQL**: Sử dụng hooks universal
3. **Mobile First**: Responsive từ 375px
4. **Dialog chuẩn**: Header + Scrollable Content + Footer
5. **Tiếng Việt**: 100% UI/Messages
6. **Business Logic**: Prevent delete, auto slug
7. **UX tốt**: Loading, Error, Empty states

---

**Status**: ✅ HOÀN THÀNH
**Date**: 03/11/2024
