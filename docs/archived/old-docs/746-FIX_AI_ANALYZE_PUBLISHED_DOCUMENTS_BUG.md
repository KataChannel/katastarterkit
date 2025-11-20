# Fix Bug: AI Analyze Requires Published Documents

## Vấn đề
Khi sử dụng tính năng "Phân tích AI" để tạo khóa học từ tài liệu nguồn, hệ thống báo lỗi:
```
GraphQL Error: No valid published documents found
```

## Nguyên nhân
Backend yêu cầu tài liệu nguồn phải có trạng thái `status: 'PUBLISHED'` trước khi AI có thể phân tích. Tài liệu ở trạng thái DRAFT không được phép phân tích.

### Code backend (ai-course-generator.service.ts):
```typescript
const documents = await this.prisma.sourceDocument.findMany({
  where: {
    id: { in: documentIds },
    status: 'PUBLISHED', // ⚠️ Chỉ chấp nhận PUBLISHED
  },
});

if (documents.length === 0) {
  throw new BadRequestException('No valid published documents found');
}
```

## Giải pháp đã triển khai

### 1. ✅ Enhanced Error Handling

#### File: `/frontend/src/app/lms/admin/courses/create-ai-analyze/page.tsx`

**Trước:**
```typescript
onError: (error) => {
  toast({
    type: 'error',
    title: 'Lỗi',
    description: error.message,
  });
}
```

**Sau:**
```typescript
onError: (error) => {
  const errorMessage = error.message;
  
  // Handle specific error cases
  if (errorMessage.includes('No valid published documents found')) {
    toast({
      type: 'error',
      title: 'Tài liệu chưa được xuất bản',
      description: 'Vui lòng xuất bản (publish) tài liệu nguồn trước khi sử dụng AI phân tích.',
    });
  } else if (errorMessage.includes('documentIds')) {
    toast({
      type: 'error',
      title: 'Thiếu tài liệu',
      description: 'Vui lòng chọn ít nhất 1 tài liệu nguồn.',
    });
  } else {
    toast({
      type: 'error',
      title: 'Lỗi phân tích AI',
      description: errorMessage || 'Không thể phân tích tài liệu. Vui lòng thử lại.',
    });
  }
  
  // Return to step 1 on error
  setCurrentStep(1);
}
```

### 2. ✅ Warning Alert Component

Thêm cảnh báo rõ ràng cho người dùng ngay từ đầu:

```tsx
<Alert className="border-amber-200 bg-amber-50">
  <AlertCircle className="h-5 w-5 text-amber-600" />
  <AlertDescription className="text-amber-900 ml-2">
    <p className="font-semibold mb-1">📌 Lưu ý quan trọng</p>
    <p className="text-sm">
      Tài liệu nguồn phải được <strong>xuất bản (PUBLISHED)</strong> trước khi sử dụng AI phân tích. 
      Nếu gặp lỗi, vui lòng kiểm tra trạng thái tài liệu tại trang quản lý tài liệu nguồn.
    </p>
  </AlertDescription>
</Alert>
```

### 3. ✅ Updated Imports

Thêm các icon và component cần thiết:

```typescript
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
```

## Files đã cập nhật

### 1. `/frontend/src/app/lms/admin/courses/create-ai-analyze/page.tsx`
- ✅ Enhanced error handling với specific error messages
- ✅ Thêm Alert warning về yêu cầu PUBLISHED status
- ✅ Return to step 1 khi có lỗi
- ✅ Import AlertCircle icon và Alert component

### 2. `/frontend/src/app/lms/admin/courses/create-from-documents/page.tsx`
- ✅ Enhanced error handling tương tự
- ✅ Thêm Alert warning ở step 1
- ✅ Import AlertCircle icon và Alert component

## User Experience Improvements

### Trước khi fix:
1. User chọn documents (có thể là DRAFT)
2. Click "Phân tích AI"
3. Nhận lỗi: "No valid published documents found"
4. ❌ Không rõ nguyên nhân, không biết phải làm gì

### Sau khi fix:
1. User thấy cảnh báo ngay từ đầu: "Tài liệu phải PUBLISHED"
2. User chọn documents
3. Click "Phân tích AI"
4. Nếu lỗi: Nhận thông báo cụ thể: "Tài liệu chưa được xuất bản"
5. ✅ Hiểu nguyên nhân, biết cần publish documents trước
6. ✅ Return về step 1 để có thể chọn lại hoặc quay lại publish

## Testing Scenarios

### ✅ Scenario 1: Published Documents
- Chọn documents có status = PUBLISHED
- Click "Phân tích AI"
- ✓ Kết quả: Phân tích thành công

### ✅ Scenario 2: Draft Documents
- Chọn documents có status = DRAFT
- Click "Phân tích AI"
- ✓ Kết quả: Error message rõ ràng "Tài liệu chưa được xuất bản"
- ✓ Return về step 1

### ✅ Scenario 3: Mixed Status
- Chọn một số DRAFT, một số PUBLISHED
- Click "Phân tích AI"
- ✓ Kết quả: Chỉ phân tích những documents PUBLISHED
- ✓ Nếu không có PUBLISHED nào: Error message

### ✅ Scenario 4: No Documents
- Không chọn documents
- Click "Phân tích AI"
- ✓ Kết quả: Error "Thiếu tài liệu"

## Flow chuẩn sau khi fix

```
1. User vào trang tạo khóa học
   ↓
2. Chọn tài liệu nguồn
   ↓
3. Thấy cảnh báo: "Phải PUBLISHED"
   ↓
4a. Nếu chưa publish → Vào trang Source Documents → Publish
4b. Nếu đã publish → Tiếp tục
   ↓
5. Click "Phân tích AI"
   ↓
6. AI analyze successfully
   ↓
7. Chỉnh sửa và tạo khóa học
```

## Visual Indicators

### Warning Alert Design:
- 🎨 Border: amber-200
- 🎨 Background: amber-50
- 🎨 Icon: AlertCircle (amber-600)
- 🎨 Text: amber-900
- 📝 Font: Bold cho tiêu đề, regular cho mô tả
- 📌 Position: Đầu tiên trên step 1

## Error Toast Design

### Type 1: Published Documents Error
```
Title: "Tài liệu chưa được xuất bản"
Description: "Vui lòng xuất bản (publish) tài liệu nguồn trước khi sử dụng AI phân tích."
Type: error
```

### Type 2: Missing Documents Error
```
Title: "Thiếu tài liệu"
Description: "Vui lòng chọn ít nhất 1 tài liệu nguồn."
Type: error
```

### Type 3: Generic AI Error
```
Title: "Lỗi phân tích AI"
Description: [Error message from backend]
Type: error
```

## Kết luận

✅ **Fixed**: Bug "No valid published documents found"
✅ **Improved**: User experience với clear warnings và specific error messages
✅ **Enhanced**: Error handling với multiple error scenarios
✅ **Added**: Visual warning alert để prevent errors trước khi xảy ra
✅ **Consistent**: Áp dụng cho cả 2 pages (create-ai-analyze & create-from-documents)

## Recommendations cho tương lai

### Backend Improvement:
Có thể thêm warning field để cho biết số lượng documents filtered:
```typescript
{
  validDocuments: 2,
  invalidDocuments: 1,
  reasons: ['Document XYZ is DRAFT status']
}
```

### Frontend Enhancement:
Có thể thêm filter hiển thị chỉ PUBLISHED documents trong SourceDocumentSelector:
```tsx
<SourceDocumentSelector
  value={selectedDocuments}
  onChange={setSelectedDocuments}
  statusFilter="PUBLISHED" // Only show published
  showStatusBadge={true}   // Show status badge
/>
```

### UX Improvement:
Có thể thêm link trực tiếp đến trang quản lý documents:
```tsx
<Button 
  variant="link" 
  onClick={() => router.push('/lms/admin/source-documents')}
>
  Quản lý tài liệu nguồn
</Button>
```
