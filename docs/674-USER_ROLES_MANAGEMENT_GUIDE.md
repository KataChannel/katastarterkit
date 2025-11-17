# Quản Lý User Roles - Hướng Dẫn Sử Dụng

## Tổng Quan

Các script này giúp bạn quản lý roles và permissions cho users trong hệ thống RBAC.

## Scripts Có Sẵn

### 1. Xem Thông Tin Roles của User

#### Xem một user cụ thể:
```bash
npm run user:roles -- <email>
```

**Ví dụ:**
```bash
npm run user:roles -- chikiet88@gmail.com
```

**Kết quả hiển thị:**
- Thông tin user (ID, email, username, tên, trạng thái)
- Danh sách roles đã được gán
- Permissions của từng role
- Direct permissions (nếu có)
- Tổng kết số lượng roles và permissions

#### Xem tất cả users:
```bash
npm run user:roles -- --all
```

**Kết quả hiển thị:**
- Danh sách tất cả users trong hệ thống
- Roles được gán cho mỗi user
- Trạng thái active/inactive

---

### 2. Gán Role cho User (Tổng Quát)

```bash
npm run assign:role -- <email> <role-name>
```

**Ví dụ:**
```bash
# Gán role Quản lý Nội dung
npm run assign:role -- chikiet88@gmail.com content_manager

# Gán role Quản lý Sản phẩm
npm run assign:role -- user@example.com product_manager

# Gán role Quản lý Blog
npm run assign:role -- editor@example.com blog_manager
```

**Script sẽ:**
1. Kiểm tra user có tồn tại không
2. Kiểm tra role có tồn tại không
3. Kiểm tra user đã có role này chưa
4. Gán role nếu chưa có
5. Hiển thị kết quả và permissions được gán

**Nếu không truyền đủ tham số:**
```bash
npm run assign:role
```
→ Script sẽ hiển thị danh sách tất cả roles có sẵn

---

### 3. Gán Role "Quản lý Nội dung" (Shortcut)

```bash
npm run assign:content-manager
```

**Chức năng:**
- Tự động gán role `content_manager` cho user `chikiet88@gmail.com`
- Script chuyên dụng, không cần truyền tham số

**Use case:**
- Gán nhanh role content manager cho user mặc định
- Dùng cho testing hoặc setup ban đầu

---

## Các Roles Có Sẵn

| Role Name | Display Name | Mô Tả | Số Permissions |
|-----------|--------------|-------|----------------|
| `content_manager` | Quản lý Nội dung | Quản lý tất cả nội dung (blog, sản phẩm, trang) | 35 |
| `blog_manager` | Quản lý Blog | Quản lý bài viết và danh mục blog | ~15 |
| `blog_editor` | Editor Blog | Tạo và chỉnh sửa bài viết của mình | ~8 |
| `product_manager` | Quản lý Sản phẩm | Quản lý sản phẩm và danh mục | ~15 |
| `order_manager` | Quản lý Đơn hàng | Xử lý và quản lý đơn hàng | ~10 |
| `page_builder_manager` | Quản lý Trang | Tạo và quản lý các trang website | ~10 |
| `ecommerce_manager` | Quản lý E-commerce | Quản lý sản phẩm và đơn hàng | ~20 |

**Lưu ý:** Dùng `role name` (cột 1) khi chạy script, không dùng display name.

---

## Workflow Thực Tế

### Case 1: Gán Role Cho User Mới

```bash
# Bước 1: Kiểm tra thông tin user
npm run user:roles -- newuser@example.com

# Bước 2: Xem danh sách roles có sẵn
npm run assign:role

# Bước 3: Gán role phù hợp
npm run assign:role -- newuser@example.com blog_editor

# Bước 4: Xác nhận lại
npm run user:roles -- newuser@example.com
```

### Case 2: Nâng Quyền User

```bash
# User hiện tại là blog_editor, muốn nâng lên blog_manager

# Bước 1: Kiểm tra role hiện tại
npm run user:roles -- editor@example.com

# Bước 2: Gán thêm role mới
npm run assign:role -- editor@example.com blog_manager

# Bước 3: Xác nhận (user sẽ có cả 2 roles)
npm run user:roles -- editor@example.com
```

### Case 3: Kiểm Tra Tất Cả Users

```bash
# Xem overview tất cả users và roles của họ
npm run user:roles -- --all
```

---

## Permissions Chi Tiết

### Content Manager (35 permissions)

**Blog Permissions (9):**
- blog:create:own, blog:create:all
- blog:read:own, blog:read:all
- blog:update:own, blog:update:all
- blog:delete:own, blog:delete:all
- blog:publish:own, blog:publish:all

**Blog Category (4):**
- blog_category:create:all
- blog_category:read:all
- blog_category:update:all
- blog_category:delete:all

**Product Permissions (10):**
- product:create:all
- product:read:all
- product:update:all
- product:delete:all
- product:publish:all
- product_category:create:all
- product_category:read:all
- product_category:update:all
- product_category:delete:all

**Page Permissions (7):**
- page:create:all
- page:read:all
- page:update:all
- page:delete:all
- page:publish:all
- page_template:create:all
- page_template:read:all

**Media Permissions (5):**
- media:upload:all
- media:read:all
- media:update:all
- media:delete:all

---

## Ví Dụ Thực Tế

### 1. User "chikiet88@gmail.com" - Role Content Manager

```bash
# Đã được gán role:
npm run assign:content-manager

# Hoặc dùng lệnh tổng quát:
npm run assign:role -- chikiet88@gmail.com content_manager

# Kết quả:
# ✅ User có 35 permissions
# ✅ Có thể quản lý: blog, sản phẩm, trang, media
# ✅ Có quyền: create, read, update, delete, publish
```

### 2. Gán Role cho Nhiều Users

```bash
# Editor 1
npm run assign:role -- editor1@example.com blog_editor

# Editor 2
npm run assign:role -- editor2@example.com blog_editor

# Manager
npm run assign:role -- manager@example.com blog_manager

# Kiểm tra tất cả
npm run user:roles -- --all
```

### 3. Kiểm Tra Permissions Cụ Thể

```bash
# Xem chi tiết tất cả permissions của user
npm run user:roles -- chikiet88@gmail.com

# Kết quả hiển thị:
# - 35 permissions từ role content_manager
# - Chi tiết từng permission (action:resource)
# - Scope của mỗi permission
```

---

## Troubleshooting

### Lỗi: User not found
```bash
❌ User with email "xxx@example.com" not found!
```
**Giải pháp:**
- Kiểm tra email chính xác
- Tạo user trước khi gán role
- Dùng `npm run user:roles -- --all` để xem danh sách users

### Lỗi: Role not found
```bash
❌ Role "xxx" not found!
```
**Giải pháp:**
- Dùng `npm run assign:role` để xem danh sách roles
- Dùng đúng `role name`, không dùng display name
- Ví dụ: dùng `content_manager` không phải "Quản lý Nội dung"

### User đã có Role
```bash
⚠️  User already has the "content_manager" role!
```
**Giải pháp:**
- Không cần làm gì, user đã có role rồi
- Dùng `npm run user:roles -- email` để xem tất cả roles

---

## Best Practices

### 1. **Kiểm tra trước khi gán:**
```bash
npm run user:roles -- user@example.com
```

### 2. **Gán role phù hợp:**
- Blog Editor: Chỉ viết bài của mình
- Blog Manager: Quản lý tất cả bài viết
- Content Manager: Quản lý toàn bộ nội dung

### 3. **Xác nhận sau khi gán:**
```bash
npm run user:roles -- user@example.com
```

### 4. **Review định kỳ:**
```bash
npm run user:roles -- --all
```

---

## Scripts Liên Quan Khác

### Seed RBAC System
```bash
npm run seed:rbac
```
Tạo tất cả roles và permissions ban đầu

### Assign Default Roles
```bash
npm run seed:assign-roles
```
Gán roles mặc định cho users hiện có

### Cleanup & Reseed
```bash
npm run cleanup:users-seed-perms
```
Xóa tất cả users (trừ admin), reseed permissions

---

## File Locations

- **Scripts:** `/backend/scripts/`
  - `assign-role-to-user.ts` - Script gán role tổng quát
  - `assign-content-manager-role.ts` - Script gán content manager
  - `view-user-roles.ts` - Script xem thông tin roles
  
- **Package.json:** `/backend/package.json`
  - Định nghĩa các npm scripts

- **Prisma Schema:** `/backend/prisma/schema.prisma`
  - Model: User, Role, UserRoleAssignment, Permission

---

## Tóm Tắt Lệnh Quan Trọng

```bash
# Xem roles của một user
npm run user:roles -- chikiet88@gmail.com

# Xem tất cả users
npm run user:roles -- --all

# Gán role tổng quát
npm run assign:role -- <email> <role-name>

# Gán role content manager (shortcut)
npm run assign:content-manager

# Xem danh sách roles
npm run assign:role
```

---

**Cập nhật:** 12/11/2025  
**Phiên bản:** 1.0.0  
**Người tạo:** System Scripts
