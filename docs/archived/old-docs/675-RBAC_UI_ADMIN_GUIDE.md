# Hướng Dẫn Quản Lý RBAC qua UI Admin Panel

## Tổng Quan

Hệ thống RBAC (Role-Based Access Control) đã được tích hợp vào Admin Panel với giao diện người dùng thân thiện, giúp bạn quản lý users, roles và permissions một cách trực quan.

## Truy Cập RBAC Module

### URL Truy Cập:
```
https://your-domain.com/admin/rbac
```

### Từ Admin Dashboard:
1. Đăng nhập với tài khoản ADMIN
2. Click vào menu **"RBAC"** trên sidebar bên trái
3. Bạn sẽ thấy trang tổng quan RBAC với 4 modules chính

## Modules Chính

### 1. 📋 Quản lý Roles (`/admin/rbac/roles`)

**Chức năng:**
- Xem danh sách tất cả roles
- Tạo role mới
- Chỉnh sửa role
- Xóa role (chỉ custom roles)
- Lọc và tìm kiếm roles

**Cách sử dụng:**

#### Tạo Role Mới:
1. Click nút **"Tạo Role Mới"**
2. Nhập thông tin:
   - **Tên Role (slug)**: `content_editor` (không dấu, snake_case)
   - **Tên hiển thị**: `Editor Nội dung`
   - **Mô tả**: `Người chỉnh sửa nội dung blog và sản phẩm`
   - **Độ ưu tiên**: `100` (số càng nhỏ càng ưu tiên cao)
3. Click **"Tạo Role"**

#### Chỉnh sửa Role:
1. Tìm role cần sửa trong bảng
2. Click icon **Edit** (✏️)
3. Cập nhật thông tin
4. Click **"Cập nhật"**

#### Xóa Role:
1. Tìm role cần xóa
2. Click icon **Delete** (🗑️)
3. Xác nhận xóa

**Lưu ý:**
- Không thể xóa **System Roles** (roles do hệ thống tạo)
- Role đang được gán cho users có thể xóa nhưng cần cẩn thận

---

### 2. 👥 Gán Role cho Users (`/admin/rbac/user-roles`)

**Chức năng:**
- Xem danh sách users và roles của họ
- Gán role cho user
- Gỡ role khỏi user
- Tìm kiếm users

**Cách sử dụng:**

#### Gán Role cho User:
1. Tìm user trong danh sách
2. Click nút **"Gán Role"**
3. Chọn role từ dropdown (chỉ hiện roles chưa được gán)
4. Click **"Gán Role"**

**Ví dụ cụ thể:**

**Gán role "Quản lý Nội dung" cho chikiet88@gmail.com:**
1. Vào `/admin/rbac/user-roles`
2. Tìm user `chikiet88@gmail.com` (có thể dùng search box)
3. Click **"Gán Role"** ở hàng của user đó
4. Trong dialog:
   - Email hiện tại: `chikiet88@gmail.com`
   - Roles hiện tại: `Chưa có role` (hoặc danh sách roles hiện có)
5. Chọn role: **"Quản lý Nội dung"** (`content_manager`)
6. Click **"Gán Role"**
7. Thông báo: ✅ "Role đã được gán cho user"

#### Gỡ Role:
1. Tìm user trong danh sách
2. Trong cột **"Assigned Roles"**, click dấu **×** trên badge của role
3. Xác nhận gỡ

**Statistics:**
- Thống kê hiển thị:
  - Tổng số users
  - Số users đã có roles
  - Số users chưa có role
  - Tổng số role assignments

---

### 3. 🔑 Quản lý Permissions (Sắp ra mắt)

**Chức năng dự kiến:**
- Xem tất cả permissions trong hệ thống
- Tạo permission mới
- Chỉnh sửa permission
- Phân loại permissions theo resource

---

### 4. 🔒 Gán Permissions cho Roles (Sắp ra mắt)

**Chức năng dự kiến:**
- Gán permissions cho role
- Xem permissions của role
- Bulk assign/remove permissions

---

## Workflow Thực Tế

### Case 1: Thiết Lập Role cho User Mới

**Tình huống:** User mới `editor@example.com` vừa đăng ký, cần gán role Editor

**Các bước:**

1. **Kiểm tra user tồn tại:**
   - Vào `/admin/users` hoặc `/admin/rbac/user-roles`
   - Tìm `editor@example.com`

2. **Gán role phù hợp:**
   - Click **"Gán Role"** cho user đó
   - Chọn role: **"Editor Blog"** (`blog_editor`)
   - Xác nhận

3. **Xác minh:**
   - Kiểm tra cột "Assigned Roles" đã hiện badge
   - User có thể đăng nhập và sử dụng quyền mới

### Case 2: Nâng Quyền User

**Tình huống:** Editor muốn nâng lên Manager

**Các bước:**

1. **Kiểm tra roles hiện tại:**
   - Vào `/admin/rbac/user-roles`
   - Tìm user, xem cột "Assigned Roles"

2. **Gán thêm role mới:**
   - Click **"Gán Role"**
   - Chọn: **"Quản lý Blog"** (`blog_manager`)
   - User sẽ có cả 2 roles (Editor + Manager)

3. **Gỡ role cũ (nếu cần):**
   - Click dấu **×** trên badge "Editor Blog"
   - User chỉ còn role Manager

### Case 3: Tạo Role Mới cho Nhóm User

**Tình huống:** Cần tạo role "Marketing Manager"

**Các bước:**

1. **Tạo role:**
   - Vào `/admin/rbac/roles`
   - Click **"Tạo Role Mới"**
   - Nhập:
     ```
     Tên Role: marketing_manager
     Tên hiển thị: Marketing Manager
     Mô tả: Quản lý nội dung marketing và chiến dịch
     Độ ưu tiên: 80
     ```
   - Tạo role

2. **Gán permissions (khi có UI):**
   - Vào `/admin/rbac/role-permissions`
   - Chọn role `marketing_manager`
   - Gán các permissions:
     - `blog:create:own`
     - `blog:update:own`
     - `product:read:all`
     - `campaign:manage:all`

3. **Gán cho users:**
   - Vào `/admin/rbac/user-roles`
   - Gán role cho từng marketing user

---

## So Sánh: Script vs UI

### Script (Backend CLI):
```bash
# Xem roles của user
npm run user:roles -- chikiet88@gmail.com

# Gán role
npm run assign:role -- chikiet88@gmail.com content_manager

# Xem tất cả users
npm run user:roles -- --all
```

**Ưu điểm:**
- Nhanh cho bulk operations
- Tự động hóa được
- Không cần UI

**Nhược điểm:**
- Cần access vào server
- Cần biết command line
- Không trực quan

### UI (Admin Panel):
**URL:** `/admin/rbac`

**Ưu điểm:**
- ✅ Trực quan, dễ sử dụng
- ✅ Không cần kỹ thuật
- ✅ Real-time feedback
- ✅ Thống kê và filter
- ✅ Xác nhận trước khi xóa
- ✅ Search và sort
- ✅ Mobile friendly

**Nhược điểm:**
- Cần đăng nhập admin
- Chậm hơn khi xử lý hàng loạt

---

## Features Chi Tiết

### Advanced Table với Filter
Tất cả bảng đều sử dụng **Advanced Table** component với:

✅ **Column Filters (Google Sheets style):**
- Hover vào column header → filter icon xuất hiện
- Click → mở popover với checkboxes
- Chọn giá trị → Apply filter
- Badge hiển thị số filters active

✅ **Sorting:**
- Click column header để sort
- Multi-column sorting

✅ **Search:**
- Global search box
- Tìm kiếm real-time

✅ **Column Management:**
- Pin columns
- Hide/Show columns
- Resize columns

### Real-time Statistics

**Roles Page:**
- Tổng số roles
- System roles vs Custom roles
- Active roles count

**User Roles Page:**
- Tổng users
- Users có roles
- Users chưa có role
- Tổng role assignments

### Notifications

Mọi thao tác đều có toast notification:
- ✅ Success: Màu xanh
- ❌ Error: Màu đỏ
- ⚠️ Warning: Màu vàng

---

## Permissions Cần Thiết

Để truy cập RBAC module, user cần:

### System Role:
```typescript
user.roleType === 'ADMIN'
```

### Hoặc Permissions (khi implement):
```typescript
permissions: [
  'rbac:read:all',
  'rbac:manage:all',
  'user:read:all',
  'user:update:all'
]
```

---

## Troubleshooting

### Không thấy menu RBAC
**Nguyên nhân:** User không phải ADMIN

**Giải pháp:**
```bash
# Via script
npm run assign:role -- your-email@example.com admin_role

# Hoặc update roleType trong database
UPDATE User SET roleType = 'ADMIN' WHERE email = 'your-email@example.com';
```

### Lỗi "Role not found"
**Nguyên nhân:** Role đã bị xóa hoặc chưa seed

**Giải pháp:**
```bash
# Reseed roles
npm run seed:rbac
```

### User vẫn không có permissions sau khi gán role
**Nguyên nhân:** 
- Role chưa có permissions
- Cần logout/login lại

**Giải pháp:**
1. Kiểm tra role có permissions không
2. User logout và login lại
3. Clear cache/cookies

### Dialog không mở
**Nguyên nhân:** JavaScript error

**Giải pháp:**
- F12 → Console → check errors
- Reload trang
- Clear browser cache

---

## Best Practices

### 1. Naming Convention

**Roles:**
```
Good: content_manager, blog_editor, product_admin
Bad: ContentManager, manager-blog, EDITOR123
```

**Display Names:**
```
Good: Quản lý Nội dung, Editor Blog, Admin Sản phẩm
Bad: content_manager, quản lý nội dung, ADMIN
```

### 2. Role Hierarchy

**Ưu tiên từ cao đến thấp:**
```
1-10:   Super Admin
10-50:  Admin levels
50-100: Manager levels
100+:   Staff/User levels
```

### 3. Security

- ⚠️ **Không xóa system roles**
- ⚠️ **Backup trước khi xóa roles được gán nhiều**
- ⚠️ **Review permissions trước khi gán**
- ⚠️ **Luôn test với test user trước**

### 4. Documentation

Khi tạo role mới, viết mô tả rõ ràng:
```
❌ Bad: "Quản lý content"
✅ Good: "Quản lý tất cả nội dung blog, sản phẩm và trang. 
         Có quyền tạo, sửa, xóa và publish. Không quản lý users."
```

---

## Tính Năng Sắp Tới

### Phase 2 (Coming Soon):
- [ ] Quản lý Permissions UI
- [ ] Gán Permissions cho Roles
- [ ] Bulk assign roles cho nhiều users
- [ ] Import/Export roles configuration
- [ ] Role templates
- [ ] Audit log cho RBAC actions

### Phase 3 (Future):
- [ ] Permission groups
- [ ] Conditional permissions
- [ ] Time-based role assignments
- [ ] Role request workflow
- [ ] Advanced analytics

---

## API Endpoints (GraphQL)

### Queries:
```graphql
# Get all roles
query GetRoles {
  roles {
    id
    name
    displayName
    description
    permissions {
      permission {
        name
        action
        resource
      }
    }
  }
}

# Get users with roles
query GetUsersWithRoles {
  users {
    id
    email
    userRoles {
      role {
        name
        displayName
      }
    }
  }
}
```

### Mutations:
```graphql
# Create role
mutation CreateRole($input: CreateRoleInput!) {
  createRole(input: $input) {
    id
    name
  }
}

# Assign role to user
mutation AssignRole($userId: String!, $roleId: String!) {
  assignRoleToUser(userId: $userId, roleId: $roleId) {
    id
  }
}

# Remove role from user
mutation RemoveRole($userId: String!, $roleId: String!) {
  removeRoleFromUser(userId: $userId, roleId: $roleId)
}
```

---

## Screenshots & Video

### Screenshots Locations:
```
/docs/screenshots/rbac/
├── overview.png          # Trang tổng quan RBAC
├── roles-list.png        # Danh sách roles
├── create-role.png       # Dialog tạo role
├── user-roles.png        # Gán role cho users
└── assign-role.png       # Dialog gán role
```

### Video Demos:
- Demo tạo role mới: `docs/videos/create-role-demo.mp4`
- Demo gán role cho user: `docs/videos/assign-role-demo.mp4`

---

## Liên Hệ & Hỗ Trợ

**Báo lỗi:** GitHub Issues
**Góp ý:** Pull Request
**Câu hỏi:** Discussion hoặc Email

---

**Cập nhật:** 12/11/2025  
**Phiên bản:** 1.0.0  
**Tác giả:** RBAC Team
