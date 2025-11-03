# TỔNG HỢP PHÂN QUYỀN GIẢNG VIÊN TỪ USER HỆ THỐNG

## 📋 Tổng quan
Cập nhật tính năng quản lý giảng viên `/lms/admin/instructors` để **phân quyền từ User có sẵn** trong hệ thống thay vì tạo user mới. Cho phép Admin chọn User và nâng cấp/thu hồi quyền giảng viên.

## 🎯 Thay đổi chính

### Trước đây (❌ Đã xóa)
- Tạo user mới với form đầy đủ (username, email, password...)
- Tự động gán roleType = 'GIANGVIEN'
- 3 Dialog: Create, Edit, Delete

### Bây giờ (✅ Mới)
- **Phân quyền**: Chọn User từ danh sách và chuyển thành GIANGVIEN
- **Thu hồi quyền**: Chuyển GIANGVIEN về USER
- **Kích hoạt/Vô hiệu hóa**: Toggle trực tiếp trên card
- 2 Dialog: Assign (Phân quyền), Revoke (Thu hồi)

## 🔧 Tính năng đã triển khai

### 1. Danh sách giảng viên
- ✅ Hiển thị tất cả User có roleType = 'GIANGVIEN'
- ✅ Thông tin hiển thị:
  - Tên đầy đủ hoặc username
  - Badge vai trò với màu sắc theo roleType
  - Email và số điện thoại
  - Số khóa học đang dạy
  - Toggle kích hoạt/vô hiệu hóa (Switch)
- ✅ Header hiển thị: "{X} giảng viên | {Y} user có thể phân quyền"

### 2. Phân quyền giảng viên (Assign)
- ✅ Button "Phân quyền giảng viên"
- ✅ Dialog với danh sách User (roleType ≠ 'GIANGVIEN')
- ✅ Tìm kiếm User: username, email, firstName, lastName
- ✅ Hiển thị User với:
  - Tên đầy đủ và username
  - Badge vai trò hiện tại (ADMIN/USER/GUEST)
  - Email và số điện thoại
  - Chọn 1 user (radio-like với highlight)
- ✅ Validation: Phải chọn user trước khi phân quyền
- ✅ GraphQL: updateUser với roleType = 'GIANGVIEN'
- ✅ Auto refetch cả 2 danh sách (instructors + availableUsers)

### 3. Thu hồi quyền giảng viên (Revoke)
- ✅ Button "Thu hồi" trên mỗi card giảng viên
- ✅ AlertDialog xác nhận:
  - Thông báo sẽ chuyển về roleType = 'USER'
  - Cảnh báo nếu đang dạy khóa học
  - Hiển thị số lượng khóa học liên quan
- ✅ GraphQL: updateUser với roleType = 'USER'
- ✅ Toast notification và refetch

### 4. Kích hoạt/Vô hiệu hóa
- ✅ Switch toggle trực tiếp trên card
- ✅ Update isActive ngay lập tức
- ✅ Toast thông báo trạng thái
- ✅ GraphQL: updateUser với isActive

### 5. UI/UX Features
- ✅ Mobile First + Responsive
- ✅ Search bar cho cả 2 danh sách
- ✅ ScrollArea trong Dialog phân quyền
- ✅ Badge màu sắc theo vai trò:
  - ADMIN: Đỏ
  - GIANGVIEN: Xanh dương
  - USER: Xanh lá
  - GUEST: Xám
- ✅ Loading states
- ✅ Empty states
- ✅ Icon rõ ràng: UserCog, Shield, CheckCircle

## 🔄 GraphQL Operations

### Query danh sách giảng viên
```typescript
useFindMany('User', {
  where: { roleType: 'GIANGVIEN' },
  include: {
    coursesInstructed: true,
    _count: { select: { coursesInstructed: true } }
  }
})
```

### Query danh sách User có thể phân quyền
```typescript
useFindMany('User', {
  where: {
    roleType: { not: 'GIANGVIEN' }
  }
})
```

### Phân quyền giảng viên
```typescript
useUpdateOne('User')({
  where: { id: userId },
  data: { roleType: 'GIANGVIEN' }
})
```

### Thu hồi quyền
```typescript
useUpdateOne('User')({
  where: { id: userId },
  data: { roleType: 'USER' }
})
```

### Cập nhật trạng thái
```typescript
useUpdateOne('User')({
  where: { id: userId },
  data: { isActive: boolean }
})
```

## 📁 File đã cập nhật

### `/lms/admin/instructors/page.tsx` (603 dòng)
**Thay đổi chính**:
- ❌ Xóa: `useCreateOne`, `useDeleteOne`, formData state
- ✅ Thêm: Query availableUsers, userSearchTerm state
- ✅ Thêm: handleAssignInstructor, handleRevokeInstructor, handleUpdateStatus
- ✅ Thay Dialog Create/Edit/Delete → Assign/Revoke
- ✅ Thêm: getRoleBadgeColor, Switch toggle

**Components sử dụng**:
- Dialog: AssignDialogOpen (chọn User để phân quyền)
- AlertDialog: RevokeDialogOpen (xác nhận thu hồi)
- Switch: Toggle isActive
- ScrollArea: Danh sách User scrollable
- Badge: Màu sắc theo roleType
- Icons: UserCog, Shield, CheckCircle, XCircle, AlertCircle

## 🎨 UI Components mới

### Dialog phân quyền
```tsx
<Dialog open={assignDialogOpen}>
  <DialogHeader>
    <UserCog icon />
    Phân quyền giảng viên
  </DialogHeader>
  
  <SearchBar /> {/* Tìm user */}
  
  <ScrollArea> {/* Danh sách user */}
    {users.map(user => (
      <UserCard 
        selected={selectedUserId === user.id}
        onClick={() => setSelectedUserId(user.id)}
      />
    ))}
  </ScrollArea>
  
  <DialogFooter>
    <Button>Phân quyền</Button>
  </DialogFooter>
</Dialog>
```

### Badge theo vai trò
```typescript
const getRoleBadgeColor = (roleType: string) => {
  switch (roleType) {
    case 'ADMIN': return 'bg-red-100 text-red-800';
    case 'GIANGVIEN': return 'bg-blue-100 text-blue-800';
    case 'USER': return 'bg-green-100 text-green-800';
    case 'GUEST': return 'bg-gray-100 text-gray-800';
  }
}
```

## 🔒 Logic phân quyền

### Flow phân quyền
1. Admin click "Phân quyền giảng viên"
2. Dialog mở với danh sách User (không phải GIANGVIEN)
3. Search và chọn 1 user
4. Click "Phân quyền" → Update roleType = 'GIANGVIEN'
5. Toast thành công → Refetch cả 2 danh sách
6. User biến mất khỏi "availableUsers", xuất hiện trong "instructors"

### Flow thu hồi
1. Admin click "Thu hồi" trên card giảng viên
2. AlertDialog hiển thị cảnh báo:
   - Sẽ chuyển về USER
   - Số khóa học đang dạy (nếu có)
3. Xác nhận → Update roleType = 'USER'
4. Toast thành công → Refetch
5. User biến mất khỏi "instructors", xuất hiện trong "availableUsers"

### Bảo vệ dữ liệu
- ❌ Không xóa user (tránh mất dữ liệu liên quan)
- ✅ Chỉ thay đổi roleType
- ✅ Cảnh báo nếu đang dạy khóa học
- ✅ Switch isActive để vô hiệu hóa tạm thời

## 📱 Responsive Design

### Mobile (< 640px)
- Button text: "Phân quyền" thay vì "Phân quyền giảng viên"
- Dialog full width
- User card stack vertically
- Badge và icon rút gọn

### Tablet/Desktop (≥ 640px)
- Full button text
- Dialog max-width: 3xl
- User card 2-3 cột
- Spacing rộng hơn

## 🔄 State Management

```typescript
// UI States
const [assignDialogOpen, setAssignDialogOpen] = useState(false);
const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
const [selectedUser, setSelectedUser] = useState<User | null>(null);
const [selectedUserId, setSelectedUserId] = useState<string>('');

// Search
const [userSearchTerm, setUserSearchTerm] = useState('');

// Data
const { data: instructors } = useFindMany('User', { 
  where: { roleType: 'GIANGVIEN' } 
});

const { data: availableUsers } = useFindMany('User', { 
  where: { roleType: { not: 'GIANGVIEN' } } 
});
```

## ✨ User Experience

### Assign Flow (Phân quyền)
1. Click "Phân quyền giảng viên" → Dialog mở
2. Thấy danh sách {Y} user có thể phân quyền
3. Search nếu cần
4. Click chọn 1 user → Highlight xanh + CheckCircle
5. Click "Phân quyền" → Loading → Toast thành công
6. Dialog đóng, user mới xuất hiện trong danh sách giảng viên

### Revoke Flow (Thu hồi)
1. Click "Thu hồi" trên card → AlertDialog
2. Đọc cảnh báo:
   - "Sẽ chuyển về USER"
   - "Đang dạy X khóa học" (nếu có)
3. Xác nhận "Thu hồi quyền" → Loading
4. Toast thành công → User biến mất khỏi danh sách

### Toggle Active
1. Bật/tắt Switch trực tiếp
2. Update ngay lập tức
3. Toast: "Đã kích hoạt/vô hiệu hóa tài khoản"

## 🎯 Tuân thủ rulepromt.txt

✅ **Code Like Senior**: Clean, TypeScript, reusable functions  
✅ **Dynamic GraphQL**: useFindMany, useUpdateOne  
✅ **No Testing**: Không tạo file test  
✅ **No Git**: Không commit  
✅ **Markdown Summary**: File này (PHAN_QUYEN_GIANG_VIEN.md)  
✅ **Shadcn UI**: Dialog, AlertDialog, Switch, ScrollArea, Badge  
✅ **Mobile First**: Responsive với Tailwind  
✅ **Vietnamese**: Toàn bộ UI tiếng Việt  
✅ **Dialog Layout**: Header → Content (scrollable) → Footer  

## 🚀 Lợi ích của cách tiếp cận mới

### So với tạo user mới:
1. **Tái sử dụng dữ liệu**: Không tạo user trùng lặp
2. **Quản lý tập trung**: Tất cả user trong 1 bảng
3. **Linh hoạt**: Dễ dàng nâng cấp/hạ cấp vai trò
4. **Không mất dữ liệu**: Thu hồi thay vì xóa
5. **Audit trail**: Giữ lại lịch sử user

### Workflow thực tế:
1. User đăng ký → Vai trò USER
2. Admin phân quyền → Vai trò GIANGVIEN
3. Giảng viên tạo khóa học, giảng dạy
4. Nếu cần → Admin thu hồi → Về USER
5. Nếu vi phạm → Admin toggle isActive = false

## 📊 Data Flow

```
Admin chọn User
  ↓
Dialog hiển thị danh sách User (roleType ≠ GIANGVIEN)
  ↓
Chọn 1 user → selectedUserId
  ↓
Click "Phân quyền"
  ↓
updateUser({ roleType: 'GIANGVIEN' })
  ↓
Success → Toast + Refetch instructors & availableUsers
  ↓
User xuất hiện trong danh sách giảng viên
```

## 🔍 Chi tiết kỹ thuật

### Filter User có thể phân quyền
```typescript
where: {
  roleType: { not: 'GIANGVIEN' }
}
// Lấy tất cả ADMIN, USER, GUEST
```

### Dual Refetch
```typescript
// Sau khi phân quyền/thu hồi
refetch(); // Refetch instructors
refetchUsers(); // Refetch availableUsers
// Đảm bảo 2 danh sách đồng bộ
```

### Select trong Dialog
```typescript
<div
  onClick={() => setSelectedUserId(user.id)}
  className={selectedUserId === user.id 
    ? 'border-blue-500 bg-blue-50' 
    : 'border-gray-200'
  }
>
  {selectedUserId === user.id && <CheckCircle />}
</div>
```

## 📝 Ghi chú quan trọng

1. **Không xóa user**: Chỉ thay đổi roleType, tránh mất dữ liệu liên quan
2. **Cảnh báo khóa học**: Hiển thị nếu giảng viên đang dạy khóa học
3. **Validation**: Phải chọn user trước khi phân quyền
4. **Auto sync**: Refetch cả 2 danh sách để tránh hiển thị sai
5. **Toast type**: Sửa từ `variant: 'destructive'` → `type: 'error'`

## ✅ Checklist hoàn thành

- [x] Xóa tính năng tạo user mới
- [x] Query danh sách User (roleType ≠ GIANGVIEN)
- [x] Dialog phân quyền với search
- [x] Select user với highlight
- [x] Phân quyền: Update roleType → GIANGVIEN
- [x] AlertDialog thu hồi quyền
- [x] Thu hồi: Update roleType → USER
- [x] Toggle Switch kích hoạt/vô hiệu hóa
- [x] Badge màu sắc theo roleType
- [x] ScrollArea cho danh sách dài
- [x] Toast notifications (type: success/error)
- [x] Responsive design
- [x] Loading states
- [x] Error handling
- [x] Refetch cả 2 danh sách
- [x] Cảnh báo số khóa học
- [x] Validation chọn user
- [x] Vietnamese interface
- [x] Tuân thủ rulepromt.txt
- [x] Tạo file markdown tổng hợp

## 🎉 Kết luận

Tính năng quản lý giảng viên đã được **cập nhật hoàn toàn** với cách tiếp cận mới:

✅ **Phân quyền từ User hệ thống** thay vì tạo mới  
✅ **Thu hồi quyền** linh hoạt, không xóa dữ liệu  
✅ **Toggle kích hoạt** trực tiếp trên card  
✅ **2 Dialog**: Assign (Phân quyền) + Revoke (Thu hồi)  
✅ **UI/UX** tốt hơn với Search, Badge màu, ScrollArea  
✅ **Mobile First**, Responsive, Vietnamese  

Phù hợp với workflow thực tế: User đăng ký → Admin phân quyền → Giảng viên hoạt động → Thu hồi nếu cần.
