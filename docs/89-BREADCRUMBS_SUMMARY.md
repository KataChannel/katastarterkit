# Tổng Hợp: Breadcrumbs và Search/Sort/Filter

## 1. Breadcrumbs Component

### Component Mới
**File**: `frontend/src/components/common/PageBreadcrumb.tsx`

#### Đặc điểm:
- ✅ Sử dụng Shadcn UI chuẩn
- ✅ Mobile First + Responsive
- ✅ Giao diện tiếng Việt
- ✅ Hỗ trợ icon cho từng breadcrumb item
- ✅ Truncate text dài trên mobile (max-width)
- ✅ Hover effect với màu xanh lá

#### Cấu trúc:
```typescript
interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}
```

#### Sử dụng:
```tsx
<PageBreadcrumb items={[
  { label: 'Trang chủ', href: '/', icon: <Home className="h-4 w-4" /> },
  { label: 'Bài viết', href: '/bai-viet', icon: <BookOpen className="h-4 w-4" /> },
  { label: 'Món ngon mỗi ngày' }
]} />
```

## 2. Tích Hợp Breadcrumbs

### Các trang đã được cập nhật:

#### 2.1. Bài Viết - List (`/bai-viet/page.tsx`)
- Hiển thị: `Trang chủ > Bài viết` (khi chưa chọn category)
- Hiển thị: `Trang chủ > Bài viết > [Tên Category]` (khi chọn category)

#### 2.2. Bài Viết - Detail (`/bai-viet/[slug]/page.tsx`)
- Hiển thị: `Trang chủ > Bài viết > [Tiêu đề bài viết]`

#### 2.3. Blog Category (`/components/blog/BlogListByCategory.tsx`)
- Hiển thị: `Trang chủ > Bài viết > [Tên Category]`

#### 2.4. Sản Phẩm - List (`/san-pham/page.tsx`)
- Hiển thị: `Trang chủ > Sản phẩm` (khi chưa chọn category)
- Hiển thị: `Trang chủ > Sản phẩm > [Tên Category]` (khi chọn category)

#### 2.5. Sản Phẩm - Detail (`/san-pham/[slug]/page.tsx`)
- Hiển thị: `Trang chủ > Sản phẩm > [Tên sản phẩm]`

#### 2.6. Dynamic Pages (`/[slug]/page.tsx`)
- Hiển thị: `Trang chủ > [Tiêu đề trang]` (cho Page Builder)

## 3. Search, Sort, Filter cho Blog Category

### Component: BlogListByCategory

#### Tính năng đã thêm:

**3.1. Search (Tìm kiếm)**
- Input field với icon Search
- Placeholder: "Tìm kiếm bài viết..."
- Nút X để xóa tìm kiếm
- Auto reset về trang 1 khi tìm kiếm

**3.2. Sort (Sắp xếp)**
- Dropdown với 3 tùy chọn:
  - Mới nhất (newest)
  - Cũ nhất (oldest)
  - Xem nhiều nhất (views)
- Auto reset về trang 1 khi đổi sort

**3.3. Filter (Lọc)**
- Sidebar với danh sách categories (desktop)
- Horizontal scrollable buttons (mobile)
- Highlight category đang chọn

#### Layout:
```
Header Sticky:
  [Hiện có X Bài Viết] [Search Input] [Sort Dropdown]

Content:
  [Sidebar Categories] [Blog Grid]
```

## 4. Responsive Design

### Breakpoints:
- **Mobile** (<640px): Breadcrumb items truncate, search/sort stack vertically
- **Tablet** (640px - 1024px): Search/sort inline, no sidebar
- **Desktop** (>1024px): Full layout với sidebar

### Optimizations:
- Text truncate với max-width trên mobile
- Icon flex-shrink-0 để không bị co lại
- Gap spacing responsive (gap-1 → gap-2)
- Font size responsive (text-sm → text-base)

## 5. Clean Architecture

### Tái sử dụng:
- PageBreadcrumb component có thể dùng cho mọi trang
- Interface BreadcrumbItem rõ ràng
- Props đơn giản, dễ maintain

### Performance:
- Lazy loading icons
- Conditional rendering
- Optimize re-render với useQuery

### Code Quality:
- TypeScript strict mode
- Props validation
- Clean imports
- Consistent naming

## 6. Kiểm Tra

### ✅ Tất cả trang đã được validate:
- Không có TypeScript errors
- Breadcrumbs hiển thị đúng trên mọi trang
- Search/Sort/Filter hoạt động chính xác
- Responsive trên mobile/tablet/desktop

## 7. Tuân Thủ Rules

✅ **Rule 1-2**: Clean Architecture, component reusable  
✅ **Rule 3-5**: Performance optimized, DX/UX tốt  
✅ **Rule 8**: Dễ maintenance, expansion  
✅ **Rule 9**: Tạo file .md ngắn gọn tiếng Việt  
✅ **Rule 10**: Shadcn UI, Mobile First, Responsive  
✅ **Rule 11**: Giao diện tiếng Việt  

## 8. Sử Dụng

### Test Breadcrumbs:
1. Truy cập `/bai-viet` - Xem breadcrumb "Trang chủ > Bài viết"
2. Click vào category - Xem breadcrumb "Trang chủ > Bài viết > [Category]"
3. Click vào bài viết - Xem breadcrumb "Trang chủ > Bài viết > [Tiêu đề]"
4. Tương tự cho sản phẩm và các trang khác

### Test Search/Sort/Filter:
1. Truy cập category page (VD: `/mon-ngon-moi-ngay`)
2. Nhập từ khóa vào search box
3. Chọn sort option từ dropdown
4. Click vào category khác trong sidebar
5. Verify kết quả hiển thị đúng
