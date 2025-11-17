# Fix lỗi routes không hoạt động cho Instructor

## Vấn đề
Các routes sau không hoạt động (404):
- ❌ `/lms/instructor/courses/create-with-ai`
- ❌ `/lms/instructor/courses/create-from-documents`
- ❌ `/lms/instructor/source-documents/new`

## Nguyên nhân
Thiếu các file `page.tsx` tương ứng trong thư mục instructor. Chỉ có admin mới có đầy đủ các trang này.

## Giải pháp

### 1. Tạo trang Create with AI (✅ Hoàn thành)
**File**: `/frontend/src/app/lms/instructor/courses/create-with-ai/page.tsx`

**Nguồn**: Copy từ `/lms/admin/courses/create-with-ai/page.tsx`

**Thay đổi**:
```typescript
// Sửa đường dẫn redirect sau khi tạo thành công
router.push(`/lms/instructor/courses/${course.id}/edit`);
// Trước: router.push(`/lms/admin/courses/${course.id}/edit`);
```

**Tính năng**:
- 🤖 Tạo khóa học bằng AI prompt
- 📝 Gợi ý prompt mẫu
- 📋 Templates chi tiết
- 🎨 Gradient UI (purple → blue)
- 📱 Mobile First responsive

### 2. Tạo trang Create from Documents (✅ Hoàn thành)
**File**: `/frontend/src/app/lms/instructor/courses/create-from-documents/page.tsx`

**Nguồn**: Copy từ `/lms/admin/courses/create-from-documents/page.tsx`

**Thay đổi**:
```typescript
// Sửa redirect sau khi generate
router.push(`/lms/instructor/courses/${data.generateCourseFromDocuments.id}/edit`);
// Trước: router.push(`/lms/admin/courses/${data.generateCourseFromDocuments.id}`);
```

**Quy trình 2 bước**:

**Bước 1: Phân tích AI**
- Chọn tài liệu nguồn (SourceDocumentSelector)
- Nhập thông tin bổ sung (tùy chọn)
- AI phân tích và đề xuất:
  - Tiêu đề khóa học
  - Mô tả
  - Cấp độ (Beginner/Intermediate/Advanced)
  - Learning objectives
  - Target audience
  - Requirements
  - Cấu trúc modules

**Bước 2: Chỉnh sửa & Tạo**
- Review kết quả phân tích
- Chỉnh sửa thông tin
- Generate khóa học hoàn chỉnh

### 3. Tạo trang Add Source Document (✅ Hoàn thành)
**File**: `/frontend/src/app/lms/instructor/source-documents/new/page.tsx`

**Nguồn**: Copy từ `/lms/admin/source-documents/new/page.tsx`

**Thay đổi**:
```typescript
// Sửa redirect sau khi tạo
router.push(`/lms/instructor/source-documents`);
// Trước: router.push(`/lms/admin/source-documents/${data.createSourceDocument.id}`);
```

**Tính năng**:
- 📤 Upload file (PDF, DOCX, TXT, MD)
- 📂 Chọn category
- 📝 Metadata: Title, Description, Author
- 🏷️ Tags
- 🔐 Access level
- 📱 Responsive form layout

## Cấu trúc thư mục sau khi fix

```
frontend/src/app/lms/instructor/
├── layout.tsx                    # Layout với sidebar
├── page.tsx                       # Dashboard
├── courses/
│   ├── page.tsx                  # Danh sách khóa học
│   ├── create/
│   │   └── page.tsx              # Tạo thủ công (đã có)
│   ├── create-with-ai/
│   │   └── page.tsx              # ✅ Tạo với AI (MỚI)
│   ├── create-from-documents/
│   │   └── page.tsx              # ✅ Tạo từ tài liệu (MỚI)
│   └── [id]/
│       ├── edit/
│       ├── manage/
│       ├── lessons/
│       └── quizzes/
├── source-documents/
│   ├── page.tsx                  # Danh sách tài liệu
│   └── new/
│       └── page.tsx              # ✅ Thêm tài liệu mới (MỚI)
├── students/
│   └── page.tsx
├── quizzes/
│   └── page.tsx
├── reports/
│   └── page.tsx
├── settings/
│   └── page.tsx
├── discussions/
│   └── page.tsx
└── certificates/
    └── page.tsx
```

## GraphQL Mutations sử dụng

### 1. Create with AI
```graphql
mutation GenerateCourseFromPrompt($prompt: String!, $categoryId: String) {
  generateCourseFromPrompt(prompt: $prompt, categoryId: $categoryId) {
    id
    title
    slug
    description
    status
    modules {
      id
      title
      lessons {
        id
        title
        quizzes {
          id
          title
        }
      }
    }
  }
}
```

### 2. Create from Documents (2 mutations)

**Mutation 1: Analyze**
```graphql
query AnalyzeDocumentsForCourse($input: AnalyzeDocumentsForCourseInput!) {
  analyzeDocumentsForCourse(input: $input) {
    suggestedTitle
    suggestedDescription
    recommendedLevel
    aggregatedKeywords
    mainTopics
    learningObjectives
    whatYouWillLearn
    requirements
    targetAudience
    suggestedStructure {
      moduleCount
      modules {
        title
        description
        topics
      }
    }
    estimatedDuration
    sourceDocumentIds
    analysisSummary
  }
}
```

**Mutation 2: Generate**
```graphql
mutation GenerateCourseFromDocuments($input: GenerateCourseFromDocumentsInput!) {
  generateCourseFromDocuments(input: $input) {
    id
    title
    slug
    description
    status
    modules {
      id
      title
      lessons {
        id
        title
      }
    }
  }
}
```

### 3. Create Source Document
```graphql
mutation CreateSourceDocument($input: CreateSourceDocumentInput!) {
  createSourceDocument(input: $input) {
    id
    title
    content
    fileUrl
    category {
      id
      name
    }
  }
}
```

## Design Principles (theo rulepromt.txt)

✅ **Mobile First + Responsive**:
- Grid responsive: `grid-cols-1 lg:grid-cols-3`
- Text responsive: `text-2xl sm:text-3xl`
- Padding responsive: `p-4 sm:p-6 lg:p-8`
- Button responsive: `w-full sm:w-auto`

✅ **shadcn UI Components**:
- Card, CardHeader, CardTitle, CardDescription, CardContent
- Button (variants: default, outline, ghost)
- Input, Textarea, Label
- Select, SelectTrigger, SelectValue, SelectContent, SelectItem
- Tabs, TabsList, TabsTrigger, TabsContent
- Badge
- useToast hook

✅ **Clean Architecture**:
- Tách biệt logic (mutations, queries)
- Component reusable (SourceDocumentSelector)
- Error handling rõ ràng
- Loading states đầy đủ

✅ **Tiếng Việt**: 100% UI tiếng Việt

✅ **DRY**: Copy từ admin, chỉ sửa routes cần thiết

## UX Enhancements

### Create with AI
- 🎨 Gradient background (purple → blue)
- 💡 Sample prompts có thể click
- 📋 Templates chi tiết với tags
- ⏱️ Loading indicator với thời gian ước tính
- 💬 Tips section với best practices

### Create from Documents
- 📊 Progress steps (2 bước rõ ràng)
- 🤖 AI analysis summary hiển thị trực quan
- 🏷️ Tags cho keywords/topics
- 📝 Pre-fill form với AI suggestions
- ↩️ Back button để quay lại bước 1

### Add Source Document
- 📤 File upload với validation
- 🎯 Autocomplete cho category
- 🏷️ Tag input
- 📱 Form layout responsive
- ✅ Success toast với redirect

## Test Routes

Instructor có thể truy cập:
- ✅ http://localhost:13000/lms/instructor/courses/create-with-ai
- ✅ http://localhost:13000/lms/instructor/courses/create-from-documents
- ✅ http://localhost:13000/lms/instructor/source-documents/new

Menu items đã có trong layout:
```typescript
{
  title: 'Khóa học của tôi',
  icon: BookOpen,
  href: '/lms/instructor/courses',
  children: [
    { title: 'Danh sách', href: '/lms/instructor/courses' },
    { title: 'Tạo mới', href: '/lms/instructor/courses/create' },
    { title: 'Từ tài liệu', href: '/lms/instructor/courses/create-from-documents' }, // ✅
    { title: 'Tạo với AI', href: '/lms/instructor/courses/create-with-ai' }, // ✅
  ],
},
{
  title: 'Tài liệu nguồn',
  icon: FileText,
  href: '/lms/instructor/source-documents',
  children: [
    { title: 'Danh sách', href: '/lms/instructor/source-documents' },
    { title: 'Thêm mới', href: '/lms/instructor/source-documents/new' }, // ✅
  ],
}
```

## Files Created/Modified

### Created (3 files mới):
1. ✨ `/frontend/src/app/lms/instructor/courses/create-with-ai/page.tsx`
2. ✨ `/frontend/src/app/lms/instructor/courses/create-from-documents/page.tsx`
3. ✨ `/frontend/src/app/lms/instructor/source-documents/new/page.tsx`

### Modified (0 files):
- Không cần sửa file nào khác

**Tổng**: 3 files mới = 3 pages hoạt động 🎉

## Kết quả

### ❌ Trước
```
404 Error - Page not found
- /lms/instructor/courses/create-with-ai
- /lms/instructor/courses/create-from-documents
- /lms/instructor/source-documents/new
```

### ✅ Sau
```
✅ /lms/instructor/courses/create-with-ai
   → Gradient UI với AI prompt generator
   → Sample prompts + templates
   → Loading indicator 30-60s

✅ /lms/instructor/courses/create-from-documents
   → 2-step wizard (Analyze → Generate)
   → AI analysis summary
   → Pre-filled form with suggestions

✅ /lms/instructor/source-documents/new
   → File upload form
   → Category + tags selection
   → Redirect to list after success
```

## Notes

1. **Ownership Protection**: Backend đã kiểm tra `instructorId === userId` trong service layer, instructor chỉ quản lý khóa học của mình

2. **No Admin Check**: Routes này không cần check ADMIN vì backend đã bỏ `@Roles(ADMIN)` khỏi các mutations (đã fix trong session trước)

3. **Consistent UX**: Giữ nguyên UI/UX từ admin để instructor quen thuộc

4. **Auto-reload**: Next.js dev server tự động detect files mới, không cần restart

5. **Future Enhancement**: Có thể thêm instructor-specific features:
   - Course templates riêng cho instructor
   - Default settings khác với admin
   - Analytics dashboard riêng

## Dependencies

Các dependencies đã có sẵn, không cần cài thêm:
- `@apollo/client` - GraphQL
- `lucide-react` - Icons
- `@/components/ui/*` - shadcn components
- `@/hooks/use-toast` - Toast notifications
- `@/hooks/useDynamicGraphQL` - Dynamic queries
- `@/graphql/lms/courses.graphql` - Course mutations
- `@/components/lms/SourceDocumentSelector` - Document selector

**Sẵn sàng test ngay!** 🚀
