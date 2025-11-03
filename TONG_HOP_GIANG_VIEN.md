# TỔNG HỢP TÍNH NĂNG QUẢN LÝ GIẢNG VIÊN - LMS ADMIN

## 📋 Mục tiêu
Cập nhật trang quản lý giảng viên `/lms/admin/instructors` với đầy đủ các tính năng CRUD (Thêm, Xem, Sửa, Xóa) giảng viên.

## 🎯 Các tính năng đã triển khai

### 1. Danh sách giảng viên
- ✅ Hiển thị danh sách tất cả giảng viên (User với roleType = 'GIANGVIEN')
- ✅ Thông tin hiển thị:
  - Tên đầy đủ (firstName + lastName) hoặc username
  - Username với badge "GIẢNG VIÊN"
  - Email và số điện thoại
  - Số lượng khóa học đang dạy
  - Trạng thái hoạt động (Active/Inactive)
- ✅ Tìm kiếm theo: username, email, firstName, lastName
- ✅ Layout responsive: Grid 1-3 cột tùy kích thước màn hình
- ✅ Badge trạng thái với icon CheckCircle/XCircle

### 2. Thêm giảng viên mới
- ✅ Dialog form với layout chuẩn (Header/Content scrollable/Footer)
- ✅ Các trường thông tin:
  - **Bắt buộc**: username, email, password
  - **Tùy chọn**: phone, firstName, lastName
  - **Toggle**: isActive (mặc định: true)
- ✅ Validation:
  - Kiểm tra các trường bắt buộc
  - Hiển thị thông báo lỗi nếu thiếu thông tin
- ✅ GraphQL: useCreateOne('User') với roleType cố định là 'GIANGVIEN'
- ✅ Toast notification khi thành công/thất bại
- ✅ Auto refetch danh sách sau khi tạo thành công
- ✅ Reset form và đóng dialog sau khi lưu

### 3. Chỉnh sửa giảng viên
- ✅ Dialog form tương tự Create
- ✅ Pre-fill dữ liệu hiện tại của giảng viên
- ✅ Trường password không bắt buộc (chỉ điền nếu muốn đổi)
- ✅ Cập nhật thông tin: username, email, phone, firstName, lastName, isActive
- ✅ GraphQL: useUpdateOne('User')
- ✅ Toast notification và refetch sau khi cập nhật
- ✅ Không cho phép thay đổi roleType (bảo mật)

### 4. Xóa giảng viên
- ✅ AlertDialog xác nhận trước khi xóa
- ✅ Hiển thị cảnh báo nếu giảng viên đang dạy khóa học
- ✅ Hiển thị số lượng khóa học liên quan
- ✅ GraphQL: useDeleteOne('User')
- ✅ Toast notification và refetch sau khi xóa
- ✅ Xử lý lỗi nếu không thể xóa (có ràng buộc dữ liệu)

### 5. UI/UX Enhancements
- ✅ Mobile First + Responsive design
- ✅ Stats cards với số lượng giảng viên
- ✅ Search bar với icon
- ✅ Loading states với Skeleton
- ✅ Error state với icon AlertCircle
- ✅ Empty state với gợi ý "Thêm giảng viên đầu tiên"
- ✅ Button actions với icons rõ ràng
- ✅ Dialog với max-height và scrollable content
- ✅ Disabled state cho buttons khi loading

## 🔧 Công nghệ sử dụng

### Frontend
- **Framework**: Next.js 15.5.0 (App Router)
- **UI Library**: Shadcn UI + Tailwind CSS
- **GraphQL Client**: Apollo Client
- **State Management**: React hooks
- **Icons**: Lucide React

### Dynamic GraphQL Hooks
```typescript
// Lấy danh sách giảng viên
useFindMany('User', {
  where: { roleType: 'GIANGVIEN' },
  include: {
    coursesInstructed: true,
    _count: { select: { coursesInstructed: true } }
  }
})

// Tạo giảng viên mới
useCreateOne('User')

// Cập nhật giảng viên
useUpdateOne('User')

// Xóa giảng viên
useDeleteOne('User')
```

### Database Schema
```prisma
model User {
  id                String         @id @default(uuid())
  email             String?        @unique
  username          String         @unique
  password          String?
  phone             String?        @unique
  firstName         String?
  lastName          String?
  avatar            String?
  roleType          UserRoleType   @default(USER)
  isActive          Boolean        @default(true)
  isVerified        Boolean        @default(false)
  coursesInstructed Course[]       @relation("CourseInstructor")
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
}

enum UserRoleType {
  ADMIN
  GIANGVIEN
  USER
  GUEST
}
```

## 📁 File đã cập nhật

### `/lms/admin/instructors/page.tsx` (535 dòng)
- Component chính quản lý giảng viên
- Đầy đủ tính năng CRUD
- 3 Dialog components:
  - Create Dialog: Form thêm giảng viên
  - Edit Dialog: Form sửa giảng viên
  - Delete AlertDialog: Xác nhận xóa

## 🎨 UI Components sử dụng

### Shadcn Components
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`
- `Button` (variants: default, outline)
- `Input` (types: text, email, password, tel)
- `Label`
- `Badge`
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`
- `AlertDialog`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogAction`, `AlertDialogCancel`
- `Switch`
- `Skeleton`
- `useToast` hook

### Icons (Lucide React)
- `Plus`, `Search`, `Edit`, `Trash2`, `BookOpen`, `Users`, `Mail`, `Phone`
- `CheckCircle`, `XCircle`, `AlertCircle`, `Save`, `X`, `MoreVertical`

## 🔒 Bảo mật

1. **Role-based Access**:
   - Chỉ admin mới có quyền truy cập `/lms/admin/*`
   - Frontend filter theo roleType = 'GIANGVIEN'

2. **Data Validation**:
   - Required fields: username, email, password (khi tạo mới)
   - Unique constraints: email, username, phone
   - Email format validation

3. **Protected Fields**:
   - roleType không thể thay đổi sau khi tạo (cố định GIANGVIEN)
   - Password chỉ update nếu người dùng nhập giá trị mới

## ✨ User Experience

### Create Flow
1. Click "Thêm giảng viên" → Mở Dialog
2. Điền form (username*, email*, password*, phone, firstName, lastName)
3. Toggle isActive nếu cần
4. Click "Lưu" → Toast thành công → Đóng dialog → Refetch danh sách

### Edit Flow
1. Click "Sửa" trên card giảng viên → Mở Dialog với dữ liệu đã điền
2. Chỉnh sửa thông tin cần thiết
3. Password để trống nếu không đổi
4. Click "Cập nhật" → Toast thành công → Đóng dialog → Refetch

### Delete Flow
1. Click icon Trash → Mở AlertDialog
2. Hiển thị warning nếu có khóa học liên quan
3. Xác nhận "Xóa" → Toast thành công → Refetch danh sách

## 📱 Responsive Design

### Mobile (< 640px)
- Grid 1 cột
- Button text rút gọn: "Thêm mới" thay vì "Thêm giảng viên"
- Dialog full width
- Form fields stack vertically

### Tablet (640px - 1024px)
- Grid 2 cột
- Full button text
- Dialog max-width: 2xl

### Desktop (> 1024px)
- Grid 3 cột
- Spacing rộng hơn
- Dialog centered với max-width

## 🔄 State Management

```typescript
// UI States
const [createDialogOpen, setCreateDialogOpen] = useState(false);
const [editDialogOpen, setEditDialogOpen] = useState(false);
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);

// Form State
const [formData, setFormData] = useState({
  username: '',
  email: '',
  password: '',
  phone: '',
  firstName: '',
  lastName: '',
  isActive: true,
});
```

## 📊 Data Flow

```
User Input (Dialog Form)
  ↓
Validation (Required fields)
  ↓
GraphQL Mutation (Create/Update/Delete)
  ↓
Success → Toast + Refetch + Close Dialog
  ↓
Error → Toast Error Message
```

## 🎯 Tuân thủ rulepromt.txt

✅ **Code Like Senior**: Clean code, TypeScript, reusable functions
✅ **Dynamic GraphQL**: Sử dụng hooks useFindMany, useCreateOne, useUpdateOne, useDeleteOne
✅ **No Testing**: Không tạo file test
✅ **No Git**: Không commit, chỉ cập nhật code
✅ **Markdown Summary**: File này (TONG_HOP_GIANG_VIEN.md)
✅ **Shadcn UI**: Tất cả components từ Shadcn
✅ **Mobile First**: Responsive design với Tailwind breakpoints
✅ **PWA Ready**: Tối ưu cho mobile
✅ **Vietnamese**: Toàn bộ UI bằng tiếng Việt
✅ **Dialog Layout**: Header → Content (scrollable) → Footer

## 🚀 Các tính năng có thể mở rộng

### Future Enhancements (không trong scope hiện tại)
1. **View Chi tiết**: 
   - Trang `/lms/admin/instructors/[id]` xem thông tin đầy đủ
   - Tab danh sách khóa học của giảng viên
   - Tab thống kê (students, revenue, ratings)

2. **Bulk Actions**:
   - Checkbox chọn nhiều giảng viên
   - Xóa hàng loạt
   - Kích hoạt/vô hiệu hóa hàng loạt

3. **Advanced Filters**:
   - Filter theo trạng thái (Active/Inactive)
   - Filter theo số lượng khóa học
   - Sort theo tên, ngày tạo, số khóa học

4. **Export/Import**:
   - Export danh sách ra Excel/CSV
   - Import giảng viên từ file

5. **Avatar Upload**:
   - Thêm field upload ảnh đại diện
   - Preview avatar trong form

6. **Assign Courses**:
   - Dialog chọn khóa học để gán cho giảng viên
   - Multi-select với search

## 📝 Ghi chú

- File được cập nhật: `/lms/admin/instructors/page.tsx`
- Số dòng code: 535 dòng
- Không có compilation errors
- Đã test visual với các trường hợp:
  - Danh sách rỗng
  - Danh sách có dữ liệu
  - Loading state
  - Error state
  - Search functionality
- GraphQL queries đã được tối ưu với select và include

## ✅ Checklist hoàn thành

- [x] Tạo Dialog thêm giảng viên
- [x] Tạo Dialog sửa giảng viên
- [x] Tạo AlertDialog xóa giảng viên
- [x] Form validation
- [x] GraphQL mutations (Create, Update, Delete)
- [x] Toast notifications
- [x] Loading states
- [x] Error handling
- [x] Responsive design
- [x] Vietnamese interface
- [x] Mobile First approach
- [x] Follow Shadcn UI patterns
- [x] Follow rulepromt.txt guidelines
- [x] Tạo file markdown tổng hợp

## 🎉 Kết luận

Trang quản lý giảng viên đã được cập nhật đầy đủ với các tính năng CRUD:
- ✅ **Create**: Thêm giảng viên mới với Dialog form
- ✅ **Read**: Danh sách với search và stats
- ✅ **Update**: Chỉnh sửa thông tin giảng viên
- ✅ **Delete**: Xóa với xác nhận và cảnh báo

Tất cả đều tuân thủ chuẩn code senior, sử dụng Dynamic GraphQL, UI Shadcn, Mobile First, và hoàn toàn bằng tiếng Việt.
