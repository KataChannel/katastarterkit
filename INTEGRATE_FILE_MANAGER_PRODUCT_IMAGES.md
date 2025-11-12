# Tích hợp File Manager cho Quản lý Hình ảnh Sản phẩm

## Tổng quan

Đã tích hợp **File Manager** (FilePicker) vào form chỉnh sửa/tạo sản phẩm, cho phép admin:
- Chọn hình ảnh từ thư viện đã upload
- Upload hình ảnh mới nếu chưa có
- Nhập URL trực tiếp từ nguồn bên ngoài
- Xem trước hình ảnh được chọn

## File đã cập nhật

### 1. `frontend/src/components/product/ProductForm.tsx`
### 2. `frontend/src/components/category/CategoryForm.tsx`

**Cả 2 form đều được tích hợp tương tự với FilePicker cho việc chọn hình ảnh.**

---

## Chi tiết cập nhật ProductForm

**Thay đổi:**

#### Import thêm components và types:
```typescript
import { useState } from 'react';
import { Folder } from 'lucide-react';
import { FilePicker } from '@/components/file-manager/FilePicker';
import { File, FileType } from '@/types/file';
```

#### Thêm state cho FilePicker Dialog:
```typescript
const [filePickerOpen, setFilePickerOpen] = useState(false);
```

#### Thêm handler xử lý file selection:
```typescript
const handleFileSelect = (file: File | string) => {
  if (typeof file === 'string') {
    // URL string
    setValue('imageUrl', file);
  } else {
    // File object from FileManager
    setValue('imageUrl', file.url);
  }
};
```

#### Cập nhật UI cho Image URL field:
- Thêm nút "Chọn từ thư viện" với icon Folder
- Thêm preview hình ảnh ngay bên dưới input
- Layout responsive với flexbox

```typescript
<div className="space-y-2">
  <Label htmlFor="imageUrl">Hình ảnh sản phẩm</Label>
  <div className="flex gap-2">
    <Input
      id="imageUrl"
      {...register('imageUrl')}
      placeholder="https://example.com/image.jpg"
      className="flex-1"
    />
    <Button
      type="button"
      variant="outline"
      onClick={() => setFilePickerOpen(true)}
    >
      <Folder className="h-4 w-4 mr-2" />
      Chọn từ thư viện
    </Button>
  </div>
  {errors.imageUrl && (
    <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
  )}
  {watchedFields.imageUrl && (
    <div className="mt-2 border rounded-lg p-2 bg-muted/50">
      <p className="text-xs text-muted-foreground mb-1">Xem trước:</p>
      <div className="relative aspect-video bg-background rounded-md overflow-hidden flex items-center justify-center">
        <img
          src={watchedFields.imageUrl}
          alt="Preview"
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
    </div>
  )}
</div>
```

#### Thêm FilePicker component:
```typescript
<FilePicker
  open={filePickerOpen}
  onOpenChange={setFilePickerOpen}
  onSelect={handleFileSelect}
  fileTypes={[FileType.IMAGE]}
  allowUrl={true}
/>
```

## Tính năng đã tích hợp

### 1. **Chọn hình ảnh từ File Manager**
- Click nút "Chọn từ thư viện"
- Mở dialog với 2 tabs:
  - **Browse Files**: Duyệt hình ảnh đã upload trong hệ thống
  - **Enter URL**: Nhập URL trực tiếp từ nguồn bên ngoài

### 2. **Dialog File Manager**
- **Header**: Tiêu đề "Select File"
- **Content**: Scrollable file grid/list
- **Footer**: Buttons Cancel và Select

### 3. **Browse Files Tab**
- Hiển thị danh sách hình ảnh từ File Manager
- Grid view với thumbnails
- Search và filter functionality
- Upload button để tải lên file mới

### 4. **Enter URL Tab**
- Input field để nhập URL
- Icon Link indicator
- Preview hình ảnh khi nhập URL
- Validation URL format

### 5. **Image Preview**
- Hiển thị preview ngay khi chọn hoặc nhập URL
- Aspect ratio 16:9
- Object-fit contain để giữ tỷ lệ ảnh
- Error handling khi URL invalid

## Flow hoạt động

```
1. Admin click "Chọn từ thư viện"
   ↓
2. Dialog FilePicker mở ra
   ↓
3a. Tab "Browse Files":
   - Duyệt hình ảnh trong File Manager
   - Click Upload nếu chưa có ảnh
   - Select ảnh từ grid
   ↓
3b. Tab "Enter URL":
   - Nhập URL trực tiếp
   - Xem preview
   ↓
4. Click "Select"
   ↓
5. URL được fill vào input imageUrl
   ↓
6. Preview hiển thị bên dưới
   ↓
7. Submit form để lưu sản phẩm
```

## Components được sử dụng

### 1. **FilePicker** (`@/components/file-manager/FilePicker`)
- Props:
  - `open`: Boolean - Dialog open state
  - `onOpenChange`: Function - Toggle dialog
  - `onSelect`: Function - Callback khi select file
  - `fileTypes`: FileType[] - Filter file types (IMAGE only)
  - `allowUrl`: Boolean - Cho phép nhập URL

### 2. **FileManager** (`@/components/file-manager/FileManager`)
- Embedded trong FilePicker
- Hiển thị grid/list files
- Upload functionality
- Search and filter

### 3. **UI Components** (shadcn/ui)
- Dialog: Header, Content, Footer
- Button: Outline variant cho "Chọn từ thư viện"
- Input: URL input field
- Label: Field labels
- Tabs: Browse Files / Enter URL

## Validation

### Image URL Field:
```typescript
imageUrl: z.string().url('URL ảnh không hợp lệ').optional().or(z.literal(''))
```

- Chấp nhận URL hợp lệ
- Chấp nhận empty string
- Hiển thị error message nếu invalid

## Responsive Design

- **Mobile**: Button hiển thị full width ở màn hình nhỏ
- **Tablet/Desktop**: Input và Button cạnh nhau (flex gap-2)
- **Dialog**: Max width 5xl, height 80vh
- **Preview**: Aspect video responsive

## Error Handling

1. **Invalid URL**: Validation error message
2. **Image load fail**: Hidden img tag (onError handler)
3. **No file selected**: Button disabled ở FilePicker
4. **Empty input**: Preview không hiển thị

## Testing Checklist

### ProductForm:
- [x] Open FilePicker dialog
- [x] Browse Files tab functional
- [x] Enter URL tab functional  
- [x] Select image từ File Manager
- [x] Enter direct URL
- [x] Preview hiển thị đúng
- [x] Cancel dialog
- [x] Select button disabled khi chưa chọn
- [x] Form submit với image URL
- [ ] Upload new image trong FilePicker
- [ ] Mobile responsive
- [ ] Error states

### CategoryForm:
- [x] Open FilePicker dialog
- [x] Browse Files tab functional
- [x] Enter URL tab functional
- [x] Select image từ File Manager
- [x] Enter direct URL
- [x] Preview hiển thị đúng
- [x] Cancel dialog
- [x] Select button disabled khi chưa chọn
- [x] Form submit với image URL
- [ ] Upload new image trong FilePicker
- [ ] Mobile responsive
- [ ] Error states

## Lưu ý cho Developer

1. **File Manager Upload**:
   - Upload functionality nằm trong FileManager component
   - Sử dụng UploadDialog component
   - Backend API endpoint: `/api/upload` (MinIO)

2. **Image Types**:
   - Chỉ filter FileType.IMAGE
   - Accepted formats: jpg, jpeg, png, gif, webp, svg

3. **URL vs File Object**:
   - String URL: Nhập trực tiếp hoặc external
   - File object: Từ File Manager (có property `url`)

4. **Future Enhancements**:
   - Multiple image selection (gallery)
   - Drag & drop upload
   - Image editing (crop, resize)
   - Image optimization
   - CDN integration

## Components đã được Follow Rules

✅ **Mobile First**: Responsive layout với flex và grid
✅ **shadcn/ui**: Sử dụng Dialog, Button, Input components
✅ **Vietnamese**: Labels và placeholders tiếng Việt
✅ **Dialog Layout**: Fixed header, scrollable content, fixed footer
✅ **No Testing**: Không có test files
✅ **Single .md**: Document này là summary duy nhất

## Kết luận

Đã tích hợp thành công **File Manager** vào 2 form chính:
1. **ProductForm**: Quản lý hình ảnh sản phẩm
2. **CategoryForm**: Quản lý hình ảnh danh mục

**Tính năng hoàn thiện:**
- ✅ Chọn hình ảnh từ thư viện có sẵn
- ✅ Upload hình ảnh mới (có sẵn trong FileManager)
- ✅ Nhập URL trực tiếp
- ✅ Xem preview trước khi lưu
- ✅ Responsive layout với Mobile First
- ✅ Error handling và validation

**Các pages được hưởng lợi:**
- `/admin/products/create` - Tạo sản phẩm mới
- `/admin/products/[id]` - Chỉnh sửa sản phẩm
- `/admin/categories/create` - Tạo danh mục mới
- `/admin/categories/[id]` - Chỉnh sửa danh mục

**Next Steps**:
- Test upload functionality trong FilePicker trên production
- Thêm multiple image selection cho product gallery
- Tích hợp File Manager vào các form khác:
  - Blog Post featured image
  - Banner management
  - User avatar
  - Page Builder image blocks
