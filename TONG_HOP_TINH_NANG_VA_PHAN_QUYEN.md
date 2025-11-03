# 📊 TỔNG HỢP TÍNH NĂNG VÀ HỆ THỐNG PHÂN QUYỀN - RAUSACHCORE

## 📌 Thông Tin Dự Án

| Thông Tin | Chi Tiết |
|-----------|----------|
| **Tên Dự Án** | RauSachCore - Modern Fullstack Starter Kit |
| **Repository** | KataChannel/katastarterkit |
| **Branch Hiện Tại** | shoprausachv16_dev5_quanlyduan |
| **Tech Stack** | Next.js 15 + NestJS 11 + PostgreSQL + GraphQL |
| **Ngày Cập Nhật** | 03/11/2025 |

---

## 🎯 I. HỆ THỐNG PHÂN QUYỀN (RBAC)

### 1. CÁC VAI TRÒ HỆ THỐNG

| STT | Vai Trò | Tên Hiển Thị | Priority | Mô Tả | Số Quyền |
|-----|---------|--------------|----------|-------|----------|
| 1 | `super_admin` | Super Administrator | 1000 | Toàn quyền quản trị hệ thống | 39+ |
| 2 | `admin` | Administrator | 900 | Quản trị người dùng và nội dung | 30+ |
| 3 | `manager` | Manager | 800 | Quản lý dự án và nhóm | 22+ |
| 4 | `team_lead` | Team Lead | 700 | Lãnh đạo nhóm với quản lý task | 17+ |
| 5 | `user` | Regular User | 600 | Người dùng tiêu chuẩn | 12+ |
| 6 | `viewer` | Viewer | 500 | Chỉ xem nội dung | 8+ |
| 7 | `guest` | Guest | 100 | Truy cập giới hạn | 1+ |

---

### 2. HỆ THỐNG QUYỀN HẠN (PERMISSIONS)

#### A. User Management (Quản Lý Người Dùng)

| Permission | Resource | Action | Category | Super Admin | Admin | Manager | Team Lead | User | Viewer | Guest |
|------------|----------|--------|----------|-------------|-------|---------|-----------|------|--------|-------|
| `users:create` | user | create | user_management | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `users:read` | user | read | user_management | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `users:update` | user | update | user_management | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `users:delete` | user | delete | user_management | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

#### B. Role Management (Quản Lý Vai Trò)

| Permission | Resource | Action | Category | Super Admin | Admin | Manager | Team Lead | User | Viewer | Guest |
|------------|----------|--------|----------|-------------|-------|---------|-----------|------|--------|-------|
| `roles:create` | role | create | role_management | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `roles:read` | role | read | role_management | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `roles:update` | role | update | role_management | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `roles:delete` | role | delete | role_management | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

#### C. Permission Management (Quản Lý Quyền)

| Permission | Resource | Action | Category | Super Admin | Admin | Manager | Team Lead | User | Viewer | Guest |
|------------|----------|--------|----------|-------------|-------|---------|-----------|------|--------|-------|
| `permissions:create` | permission | create | permission_management | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `permissions:read` | permission | read | permission_management | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `permissions:update` | permission | update | permission_management | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `permissions:delete` | permission | delete | permission_management | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

#### D. Task Management (Quản Lý Công Việc)

| Permission | Resource | Action | Category | Super Admin | Admin | Manager | Team Lead | User | Viewer | Guest |
|------------|----------|--------|----------|-------------|-------|---------|-----------|------|--------|-------|
| `tasks:create` | task | create | task_management | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `tasks:read` | task | read | task_management | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| `tasks:update` | task | update | task_management | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `tasks:delete` | task | delete | task_management | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `tasks:assign` | task | assign | task_management | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

#### E. Project Management (Quản Lý Dự Án)

| Permission | Resource | Action | Category | Super Admin | Admin | Manager | Team Lead | User | Viewer | Guest |
|------------|----------|--------|----------|-------------|-------|---------|-----------|------|--------|-------|
| `projects:create` | project | create | project_management | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `projects:read` | project | read | project_management | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| `projects:update` | project | update | project_management | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `projects:delete` | project | delete | project_management | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `projects:manage` | project | manage | project_management | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

#### F. Content Management (Quản Lý Nội Dung)

| Permission | Resource | Action | Category | Super Admin | Admin | Manager | Team Lead | User | Viewer | Guest |
|------------|----------|--------|----------|-------------|-------|---------|-----------|------|--------|-------|
| `content:create` | content | create | content_management | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `content:read` | content | read | content_management | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `content:update` | content | update | content_management | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `content:delete` | content | delete | content_management | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `content:publish` | content | publish | content_management | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

#### G. Security Management (Quản Lý Bảo Mật)

| Permission | Resource | Action | Category | Super Admin | Admin | Manager | Team Lead | User | Viewer | Guest |
|------------|----------|--------|----------|-------------|-------|---------|-----------|------|--------|-------|
| `security:audit` | security | audit | security_management | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `security:monitor` | security | monitor | security_management | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `security:manage` | security | manage | security_management | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

#### H. System Administration (Quản Trị Hệ Thống)

| Permission | Resource | Action | Scope | Category | Super Admin | Admin | Manager | Team Lead | User | Viewer | Guest |
|------------|----------|--------|-------|----------|-------------|-------|---------|-----------|------|--------|-------|
| `system:admin` | system | admin | global | system_admin | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `system:config` | system | config | global | system_admin | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `system:backup` | system | backup | global | system_admin | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

#### I. Analytics (Phân Tích)

| Permission | Resource | Action | Category | Super Admin | Admin | Manager | Team Lead | User | Viewer | Guest |
|------------|----------|--------|----------|-------------|-------|---------|-----------|------|--------|-------|
| `analytics:read` | analytics | read | analytics | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `analytics:export` | analytics | export | analytics | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

### 3. TÀI KHOẢN ADMIN MẶC ĐỊNH

| Thông Tin | Giá Trị |
|-----------|---------|
| **Email** | katachanneloffical@gmail.com |
| **Phone** | 0977272967 |
| **Họ Tên** | Phạm Chí Kiệt |
| **Username** | admin_kataofficial |
| **Vai Trò** | super_admin |
| **Mật Khẩu Mặc Định** | Admin@123456 |
| **Quyền Hạn** | Toàn quyền (39+ permissions) |
| **Trạng Thái** | Active & Verified |

⚠️ **LƯU Ý BẢO MẬT**: Phải đổi mật khẩu ngay sau lần đăng nhập đầu tiên!

---

### 4. VAI TRÒ MẶC ĐỊNH CHO USER MỚI

Khi user đăng ký mới qua `registerUser` mutation, hệ thống **tự động gán role `user` (Regular User)** với các quyền sau:

| Quyền | Mô Tả |
|-------|-------|
| `tasks:create` | Tạo task mới |
| `tasks:read` | Xem tasks |
| `tasks:update` | Cập nhật tasks |
| `projects:read` | Xem projects |
| `content:create` | Tạo nội dung |
| `content:read` | Xem nội dung |
| `content:update` | Cập nhật nội dung |

💡 **Lưu ý**: Admin có thể thay đổi role của user sau khi đăng ký bằng mutation `assignRoleToUser`.

---

## 🎯 II. CÁC MODULE CHỨC NĂNG

### 1. AUTHENTICATION & AUTHORIZATION (Xác Thực & Phân Quyền)

| STT | Tính Năng | Endpoint/Resolver | Mô Tả | Quyền Yêu Cầu |
|-----|-----------|-------------------|-------|----------------|
| 1 | Đăng ký người dùng | `registerUser` (Mutation) | Đăng ký tài khoản mới, tự động gán role `user` | Public |
| 2 | Đăng nhập email/password | `loginUser` (Mutation) | Đăng nhập cơ bản | Public |
| 3 | Đăng nhập Google OAuth | `loginWithGoogle` (Mutation) | Đăng nhập qua Google | Public |
| 4 | Đăng nhập Facebook OAuth | `loginWithFacebook` (Mutation) | Đăng nhập qua Facebook | Public |
| 5 | Đăng nhập SĐT + OTP | `loginWithPhone` (Mutation) | Đăng nhập qua điện thoại | Public |
| 6 | Xác thực OTP | `requestPhoneVerification` (Mutation) | Gửi mã OTP | Public |
| 7 | Quên mật khẩu | `requestForgotPassword` (Mutation) | Yêu cầu reset password | Public |
| 8 | Xác nhận token reset | `verifyResetToken` (Mutation) | Verify reset token | Public |
| 9 | Reset mật khẩu | `resetPasswordWithToken` (Mutation) | Đặt lại mật khẩu | Public |
| 10 | Đổi mật khẩu | `changePassword` (Mutation) | Thay đổi mật khẩu | Authenticated |
| 11 | Đặt mật khẩu | `setPassword` (Mutation) | Set password cho OAuth users | Authenticated |
| 12 | JWT Refresh | Auto via NextAuth | Làm mới access token | Authenticated |
| 13 | Multi-Factor Authentication (MFA) | `/security/mfa/*` (REST) | Xác thực 2 lớp | Authenticated |
| 14 | TOTP Setup | `/security/mfa/totp/setup` | Thiết lập Google Authenticator | Authenticated |
| 15 | SMS OTP | `/security/mfa/sms/*` | Xác thực qua SMS | Authenticated |
| 16 | Backup Codes | `/security/mfa/backup-codes/*` | Mã dự phòng MFA | Authenticated |

---

### 2. USER MANAGEMENT (Quản Lý Người Dùng)

| STT | Tính Năng | Endpoint/Resolver | Mô Tả | Quyền Yêu Cầu |
|-----|-----------|-------------------|-------|----------------|
| 1 | Lấy thông tin user theo ID | `getUserById` (Query) | Get user by ID | `users:read` |
| 2 | Lấy thông tin user hiện tại | `getMe` (Query) | Get current user info | Authenticated |
| 3 | Danh sách users | `getUsers` (Query) | List all users | `users:read` |
| 4 | Tìm kiếm users | `searchUsers` (Query) | Search users with filters | `users:read` |
| 5 | Thống kê users | `getUserStats` (Query) | User statistics | `users:read` |
| 6 | Cập nhật profile | `updateProfile` (Mutation) | Update own profile | Authenticated |
| 7 | Cập nhật user | `updateUser` (Mutation) | Update user (admin) | `users:update` |
| 8 | Admin tạo user | `adminCreateUser` (Mutation) | Admin create user | `users:create` |
| 9 | Admin update user | `adminUpdateUser` (Mutation) | Admin update user | `users:update` |
| 10 | Admin reset password | `adminResetPassword` (Mutation) | Admin reset user password | `users:update` |
| 11 | Xóa user | `deleteUser` (Mutation) | Delete user | `users:delete` |
| 12 | Bulk user actions | `bulkUserAction` (Mutation) | Bulk operations | `users:update` |
| 13 | Kiểm tra password | `hasPassword` (Query) | Check if user has password | Authenticated |

---

### 3. RBAC MANAGEMENT (Quản Lý Phân Quyền)

#### A. Role Management

| STT | Tính Năng | Endpoint/Resolver | Mô Tả | Quyền Yêu Cầu |
|-----|-----------|-------------------|-------|----------------|
| 1 | Tạo role | `createRole` (Mutation) | Tạo vai trò mới | `roles:create` |
| 2 | Danh sách roles | `getAllRoles` (Query) | List tất cả roles | `roles:read` |
| 3 | Role hierarchy | `getRoleHierarchy` (Query) | Cây phân cấp roles | `roles:read` |
| 4 | Chi tiết role | `getRoleById` (Query) | Get role by ID | `roles:read` |
| 5 | Cập nhật role | `updateRole` (Mutation) | Update role | `roles:update` |
| 6 | Xóa role | `deleteRole` (Mutation) | Delete role | `roles:delete` |
| 7 | Gán role cho user | `assignRoleToUser` (Mutation) | Assign role to user | `roles:update` |
| 8 | Gỡ role khỏi user | `removeRoleFromUser` (Mutation) | Remove role from user | `roles:update` |

#### B. Permission Management

| STT | Tính Năng | Endpoint/Resolver | Mô Tả | Quyền Yêu Cầu |
|-----|-----------|-------------------|-------|----------------|
| 1 | Tạo permission | `createPermission` (Mutation) | Tạo quyền mới | `permissions:create` |
| 2 | Danh sách permissions | `getAllPermissions` (Query) | List tất cả permissions | `permissions:read` |
| 3 | Chi tiết permission | `getPermissionById` (Query) | Get permission by ID | `permissions:read` |
| 4 | Cập nhật permission | `updatePermission` (Mutation) | Update permission | `permissions:update` |
| 5 | Xóa permission | `deletePermission` (Mutation) | Delete permission | `permissions:delete` |
| 6 | Gán permissions cho role | `assignPermissionsToRole` (Mutation) | Assign permissions to role | `roles:update` |
| 7 | Gỡ permissions khỏi role | `removePermissionsFromRole` (Mutation) | Remove permissions from role | `roles:update` |
| 8 | Gán permission trực tiếp cho user | `grantPermissionToUser` (Mutation) | Grant direct permission | `permissions:update` |
| 9 | Gỡ permission khỏi user | `revokePermissionFromUser` (Mutation) | Revoke direct permission | `permissions:update` |
| 10 | Kiểm tra quyền | `checkUserPermission` (Query) | Check if user has permission | Public |
| 11 | User role info | `getUserRoleInfo` (Query) | Get user's roles & permissions | `roles:read` |

#### C. REST API Endpoints (RBAC Controller)

| STT | Endpoint | Method | Mô Tả | Quyền Yêu Cầu |
|-----|----------|--------|-------|----------------|
| 1 | `/api/security/rbac/roles` | POST | Tạo role | `roles:create` |
| 2 | `/api/security/rbac/roles` | GET | List roles | `roles:read` |
| 3 | `/api/security/rbac/roles/hierarchy` | GET | Role hierarchy | `roles:read` |
| 4 | `/api/security/rbac/roles/:roleId` | GET | Get role | `roles:read` |
| 5 | `/api/security/rbac/roles/:roleId` | PUT | Update role | `roles:update` |
| 6 | `/api/security/rbac/roles/:roleId` | DELETE | Delete role | `roles:delete` |
| 7 | `/api/security/rbac/permissions` | POST | Tạo permission | `permissions:create` |
| 8 | `/api/security/rbac/permissions` | GET | List permissions | `permissions:read` |
| 9 | `/api/security/rbac/permissions/:id` | PUT | Update permission | `permissions:update` |
| 10 | `/api/security/rbac/permissions/:id` | DELETE | Delete permission | `permissions:delete` |
| 11 | `/api/security/rbac/users/:userId/roles` | POST | Assign role | `roles:update` |
| 12 | `/api/security/rbac/users/:userId/roles/:roleId` | DELETE | Remove role | `roles:update` |
| 13 | `/api/security/rbac/check-permission` | POST | Check permission | Public |

---

### 4. TASK MANAGEMENT (Quản Lý Công Việc)

| STT | Tính Năng | Endpoint/Resolver | Mô Tả | Quyền Yêu Cầu |
|-----|-----------|-------------------|-------|----------------|
| 1 | Danh sách tasks | `getTasks` (Query) | List all tasks | `tasks:read` |
| 2 | Tasks phân trang | `getTasksPaginated` (Query) | Paginated tasks | `tasks:read` |
| 3 | Chi tiết task | `getTaskById` (Query) | Get task by ID | `tasks:read` |
| 4 | Get task | `getTask` (Query) | Get single task | `tasks:read` |
| 5 | Tasks được chia sẻ | `getSharedTasks` (Query) | Get shared tasks | `tasks:read` |
| 6 | My tasks | `getMyTasks` (Query) | Get current user's tasks | Authenticated |
| 7 | Tạo task | `createTask` (Mutation) | Create new task | `tasks:create` |
| 8 | Cập nhật task | `updateTask` (Mutation) | Update task | `tasks:update` |
| 9 | Xóa task | `deleteTask` (Mutation) | Delete task | `tasks:delete` |
| 10 | Chia sẻ task | `shareTask` (Mutation) | Share task with users | `tasks:assign` |
| 11 | Tạo subtask | `createSubtask` (Mutation) | Create subtask | `tasks:create` |
| 12 | Assign task | `assignTask` (Mutation) | Assign task to user | `tasks:assign` |
| 13 | Update status | `updateTaskStatus` (Mutation) | Update task status | `tasks:update` |
| 14 | Set priority | `setTaskPriority` (Mutation) | Set task priority | `tasks:update` |
| 15 | Thêm comment | `createTaskComment` (Mutation) | Add comment to task | `tasks:read` |
| 16 | Upload media | `uploadTaskMedia` (Mutation) | Upload file to task | `tasks:update` |
| 17 | Xóa media | `deleteTaskMedia` (Mutation) | Delete task media | `tasks:update` |

---

### 5. PROJECT MANAGEMENT (Quản Lý Dự Án)

| STT | Tính Năng | Mô Tả | Quyền Yêu Cầu |
|-----|-----------|-------|----------------|
| 1 | Tạo dự án | Create new project | `projects:create` |
| 2 | Danh sách dự án | List all projects | `projects:read` |
| 3 | Chi tiết dự án | Get project details | `projects:read` |
| 4 | Cập nhật dự án | Update project | `projects:update` |
| 5 | Xóa dự án | Delete project | `projects:delete` |
| 6 | Quản lý thành viên | Manage project members | `projects:manage` |
| 7 | Gán tasks cho dự án | Assign tasks to project | `projects:manage` |
| 8 | Thống kê dự án | Project statistics | `projects:read` |

---

### 6. CONTENT MANAGEMENT (Quản Lý Nội Dung)

#### A. Post Management (Quản Lý Bài Viết)

| STT | Tính Năng | Endpoint/Resolver | Mô Tả | Quyền Yêu Cầu |
|-----|-----------|-------------------|-------|----------------|
| 1 | Danh sách posts | `getPosts` (Query) | Paginated posts | `content:read` |
| 2 | Chi tiết post by ID | `getPostById` (Query) | Get post by ID | `content:read` |
| 3 | Chi tiết post by slug | `getPostBySlug` (Query) | Get post by slug | Public |
| 4 | My posts | `getMyPosts` (Query) | Get current user's posts | Authenticated |
| 5 | Tạo post | `createPost` (Mutation) | Create new post | `content:create` |
| 6 | Cập nhật post | `updatePost` (Mutation) | Update post | `content:update` |
| 7 | Xóa post | `deletePost` (Mutation) | Delete post | `content:delete` |
| 8 | Publish post | `publishPost` (Mutation) | Publish post | `content:publish` |

#### B. Category Management (Quản Lý Danh Mục)

| STT | Tính Năng | Endpoint/Resolver | Mô Tả | Quyền Yêu Cầu |
|-----|-----------|-------------------|-------|----------------|
| 1 | Danh sách categories | `getCategories` (Query) | List categories | Public |
| 2 | Category tree | `getCategoryTree` (Query) | Hierarchical categories | Public |
| 3 | Chi tiết category | `getCategoryById` (Query) | Get category | Public |
| 4 | Tạo category | `createCategory` (Mutation) | Create category | `content:create` |
| 5 | Cập nhật category | `updateCategory` (Mutation) | Update category | `content:update` |
| 6 | Xóa category | `deleteCategory` (Mutation) | Delete category | `content:delete` |

#### C. Page Builder (Xây Dựng Trang)

| STT | Tính Năng | Mô Tả | Quyền Yêu Cầu |
|-----|-----------|-------|----------------|
| 1 | Dynamic page builder | Visual page editor với blocks | `content:create` |
| 2 | Block library | 30+ loại blocks (Text, Image, Video, etc.) | `content:create` |
| 3 | Nested blocks | Container blocks với children | `content:create` |
| 4 | Undo/Redo | History system (50 states) | `content:create` |
| 5 | Keyboard shortcuts | Ctrl+Z, Ctrl+Y, Ctrl+S | `content:create` |
| 6 | Template management | Save & reuse page templates | `content:create` |
| 7 | Responsive preview | Mobile/Tablet/Desktop preview | `content:create` |
| 8 | SEO settings | Meta tags, OG tags | `content:create` |

---

### 7. E-COMMERCE (Thương Mại Điện Tử)

#### A. Product Management (Quản Lý Sản Phẩm)

| STT | Tính Năng | Endpoint/Resolver | Mô Tả | Quyền Yêu Cầu |
|-----|-----------|-------------------|-------|----------------|
| 1 | Danh sách sản phẩm | `getProducts` (Query) | List products | Public |
| 2 | Chi tiết sản phẩm | `getProductById` (Query) | Get product | Public |
| 3 | Tìm kiếm sản phẩm | `searchProducts` (Query) | Search products | Public |
| 4 | Tạo sản phẩm | `createProduct` (Mutation) | Create product | `content:create` |
| 5 | Cập nhật sản phẩm | `updateProduct` (Mutation) | Update product | `content:update` |
| 6 | Xóa sản phẩm | `deleteProduct` (Mutation) | Delete product | `content:delete` |
| 7 | Product variants | Manage product variations | `content:update` |
| 8 | Product images | Manage product images | `content:update` |
| 9 | Inventory management | Stock tracking | `content:manage` |
| 10 | Import/Export Excel | `/api/product-import-export/*` | Bulk import/export | `content:create` |

#### B. Order Management (Quản Lý Đơn Hàng)

| STT | Tính Năng | Endpoint/Resolver | Mô Tả | Quyền Yêu Cầu |
|-----|-----------|-------------------|-------|----------------|
| 1 | Danh sách đơn hàng | `getOrders` (Query) | List orders | `content:read` |
| 2 | Chi tiết đơn hàng | `getOrderById` (Query) | Get order | `content:read` |
| 3 | Tạo đơn hàng | `createOrder` (Mutation) | Create order | Authenticated |
| 4 | Cập nhật đơn hàng | `updateOrder` (Mutation) | Update order | `content:update` |
| 5 | Hủy đơn hàng | `cancelOrder` (Mutation) | Cancel order | `content:update` |
| 6 | Order status tracking | Track order status | Public |
| 7 | Payment integration | Payment processing | Authenticated |

#### C. Cart Management (Quản Lý Giỏ Hàng)

| STT | Tính Năng | Endpoint/Resolver | Mô Tả | Quyền Yêu Cầu |
|-----|-----------|-------------------|-------|----------------|
| 1 | Get cart | `getCart` (Query) | Get user cart | Authenticated |
| 2 | Add to cart | `addToCart` (Mutation) | Add item to cart | Authenticated |
| 3 | Update cart item | `updateCartItem` (Mutation) | Update quantity | Authenticated |
| 4 | Remove from cart | `removeFromCart` (Mutation) | Remove item | Authenticated |
| 5 | Clear cart | `clearCart` (Mutation) | Clear all items | Authenticated |

#### D. Invoice Management (Quản Lý Hóa Đơn)

| STT | Endpoint | Method | Mô Tả | Quyền Yêu Cầu |
|-----|----------|--------|-------|----------------|
| 1 | `/ketoan/listhoadon/export-excel` | GET | Export invoices to Excel | `analytics:export` |
| 2 | `/ketoan/listhoadon/preview` | GET | Preview invoice data | `content:read` |
| 3 | `/api/invoice-import/*` | POST | Import invoices | `content:create` |

---

### 8. MENU SYSTEM (Hệ Thống Menu)

#### A. Menu Types

| Loại Menu | Mô Tả | Người Dùng |
|-----------|-------|------------|
| **SIDEBAR** | Admin sidebar menu | Super Admin only |
| **HEADER** | Public header menu | Tất cả người dùng |
| **FOOTER** | Footer menu | Tất cả người dùng |

#### B. Sidebar Menus (Admin - Chỉ Super Admin)

| STT | Menu | Route | Icon | Permissions | Children |
|-----|------|-------|------|-------------|----------|
| 1 | Dashboard | `/admin` | LayoutDashboard | super_admin | - |
| 2 | Users | `/admin/users` | Users | `users:read` | - |
| 3 | Roles & Permissions | `/admin/roles` | Shield | `roles:read`, `permissions:read` | - |
| 4 | Content | - | FileText | `content:read` | Posts, Categories, Tags |
| 5 | Projects | `/admin/projects` | Briefcase | `projects:read` | - |
| 6 | Tasks | `/admin/tasks` | CheckSquare | `tasks:read` | - |
| 7 | Menus | `/admin/menu` | Menu | `content:manage` | - |
| 8 | Analytics | `/admin/analytics` | BarChart | `analytics:read` | - |
| 9 | Settings | - | Settings | super_admin | General, Security |
| 10 | Audit Logs | `/admin/audit-logs` | FileSearch | `security:audit` | - |

#### C. Header Menus (Public)

| STT | Menu | Route | Public |
|-----|------|-------|--------|
| 1 | Home | `/` | ✅ |
| 2 | About | `/about` | ✅ |
| 3 | Services | `/services` | ✅ |
| 4 | Contact | `/contact` | ✅ |

---

### 9. FILE MANAGEMENT (Quản Lý File)

| STT | Endpoint | Method | Mô Tả | Quyền Yêu Cầu |
|-----|----------|--------|-------|----------------|
| 1 | `/api/files/upload` | POST | Upload single file | Authenticated |
| 2 | `/api/files/upload/bulk` | POST | Upload multiple files | Authenticated |
| 3 | `/api/files/:id` | GET | Get file info | Authenticated |
| 4 | `/api/files` | GET | List files | Authenticated |
| 5 | `/api/files/:id` | PUT | Update file metadata | Authenticated |
| 6 | `/api/files/:id` | DELETE | Delete file | Authenticated |
| 7 | `/api/files/stats/overview` | GET | File statistics | `analytics:read` |
| 8 | `/api/project/upload` | POST | Project file upload | `projects:update` |

**Storage**: MinIO (S3-compatible object storage)

---

### 10. SECURITY & COMPLIANCE (Bảo Mật & Tuân Thủ)

#### A. Security Features

| STT | Tính Năng | Endpoint | Mô Tả | Quyền Yêu Cầu |
|-----|-----------|----------|-------|----------------|
| 1 | Security Dashboard | `/security/dashboard` | Overview security | `security:monitor` |
| 2 | Audit Logs | `/admin/audit-logs` | System audit trail | `security:audit` |
| 3 | MFA Management | `/security/mfa/*` | Multi-factor auth | Authenticated |
| 4 | Session Management | Auto via JWT | Token-based sessions | Authenticated |
| 5 | Rate Limiting | Middleware | API rate limiting | All |
| 6 | CORS Protection | Config | Cross-origin protection | All |
| 7 | Helmet Security | Middleware | HTTP headers security | All |

#### B. Compliance & Reports

| STT | Endpoint | Method | Mô Tả | Quyền Yêu Cầu |
|-----|----------|--------|-------|----------------|
| 1 | `/api/security/compliance/reports/gdpr` | POST | GDPR compliance report | `security:audit` |
| 2 | `/api/security/compliance/reports/soc2` | POST | SOC2 compliance report | `security:audit` |
| 3 | `/api/security/compliance/dashboard` | GET | Compliance dashboard | `security:monitor` |
| 4 | `/api/security/compliance/audit-logs` | GET | Audit logs | `security:audit` |
| 5 | `/api/security/compliance/security-events` | GET | Security events | `security:monitor` |
| 6 | `/api/security/compliance/anomalies/:userId` | GET | User anomalies | `security:monitor` |

#### C. Security Dashboard

| STT | Endpoint | Method | Mô Tả | Quyền Yêu Cầu |
|-----|----------|--------|-------|----------------|
| 1 | `/security/dashboard/summary` | GET | Security summary | `security:monitor` |
| 2 | `/security/dashboard/assessment` | GET | Risk assessment | `security:monitor` |
| 3 | `/security/dashboard/compliance-report` | GET | Compliance status | `security:audit` |
| 4 | `/security/dashboard/alerts` | GET | Security alerts | `security:monitor` |
| 5 | `/security/dashboard/recommendations` | GET | Security recommendations | `security:monitor` |

---

### 11. MONITORING & ANALYTICS (Giám Sát & Phân Tích)

#### A. System Monitoring

| STT | Endpoint | Method | Mô Tả | Quyền Yêu Cầu |
|-----|----------|--------|-------|----------------|
| 1 | `/monitoring/metrics/realtime` | GET | Real-time metrics | `security:monitor` |
| 2 | `/monitoring/dashboard` | GET | Monitoring dashboard | `security:monitor` |
| 3 | `/monitoring/performance/stats` | GET | Performance stats | `analytics:read` |
| 4 | `/monitoring/performance/queries` | GET | Query performance | `security:monitor` |
| 5 | `/monitoring/metrics/historical` | GET | Historical metrics | `analytics:read` |
| 6 | `/monitoring/metrics/prometheus` | GET | Prometheus metrics | `security:monitor` |
| 7 | `/monitoring/alerts/rules` | GET | Alert rules | `security:monitor` |
| 8 | `/monitoring/health` | GET | Health check | Public |

#### B. Analytics & Reports

| STT | Endpoint | Method | Mô Tả | Quyền Yêu Cầu |
|-----|----------|--------|-------|----------------|
| 1 | `/analytics/dashboard` | GET | Analytics dashboard | `analytics:read` |
| 2 | `/analytics/widgets/:widgetId/data` | GET | Widget data | `analytics:read` |
| 3 | `/analytics/dashboards` | GET | List dashboards | `analytics:read` |
| 4 | `/analytics/insights` | GET | Business insights | `analytics:read` |
| 5 | `/analytics/reports` | GET | Reports | `analytics:read` |
| 6 | `/analytics/metrics/summary` | GET | Metrics summary | `analytics:read` |
| 7 | `/analytics/metrics/historical` | GET | Historical data | `analytics:read` |
| 8 | `/analytics/export` | GET | Export analytics | `analytics:export` |
| 9 | `/analytics/compare` | GET | Compare periods | `analytics:read` |

---

### 12. AI & MACHINE LEARNING (AI & Học Máy)

#### A. AI Features

| STT | Endpoint | Method | Mô Tả | Quyền Yêu Cầu |
|-----|----------|--------|-------|----------------|
| 1 | `/ai/predict-priority/:userId` | POST | Predict task priority | `tasks:read` |
| 2 | `/ai/workload-analysis/:userId` | GET | Workload analysis | `analytics:read` |
| 3 | `/ai/suggestions/:userId` | GET | AI suggestions | Authenticated |
| 4 | `/ai/analyze-content/:userId` | POST | Content analysis | `content:read` |
| 5 | `/ai/generate-tasks/:userId` | POST | Auto-generate tasks | `tasks:create` |
| 6 | `/ai/insights/:userId` | GET | AI insights | `analytics:read` |

#### B. Chatbot & Training

| STT | Endpoint | Method | Mô Tả | Quyền Yêu Cầu |
|-----|----------|--------|-------|----------------|
| 1 | `/chatbot` | POST | Create chatbot | `content:create` |
| 2 | `/chatbot` | GET | List chatbots | `content:read` |
| 3 | `/chatbot/:id` | GET | Get chatbot | `content:read` |
| 4 | `/chatbot/:id/message` | POST | Send message | Public |
| 5 | `/chatbot/:id/conversations` | GET | List conversations | `content:read` |
| 6 | `/ai-training/:chatbotId` | POST | Train chatbot | `content:manage` |
| 7 | `/ai-training` | GET | List trainings | `content:read` |

#### C. Grok AI Integration

| STT | Tính Năng | Resolver | Mô Tả | Quyền Yêu Cầu |
|-----|-----------|----------|-------|----------------|
| 1 | Grok Chat | `grokChat` (Mutation) | Chat with Grok AI | Authenticated |
| 2 | Grok Analysis | `grokAnalyze` (Mutation) | Analyze content | `content:read` |
| 3 | Chat History | `getGrokHistory` (Query) | Get chat history | Authenticated |

---

### 13. SEARCH (Tìm Kiếm)

#### A. Orama Search Engine

| STT | Endpoint/Resolver | Mô Tả | Quyền Yêu Cầu |
|-----|-------------------|-------|----------------|
| 1 | `/search/tasks` | GET | Search tasks | `tasks:read` |
| 2 | `/search/tasks/advanced` | POST | Advanced task search | `tasks:read` |
| 3 | `/search/suggestions` | GET | Search suggestions | Public |
| 4 | `/search/facets` | GET | Search facets | Public |
| 5 | `/search/save` | POST | Save search | Authenticated |
| 6 | `/search/saved` | GET | List saved searches | Authenticated |
| 7 | `/search/analytics` | GET | Search analytics | `analytics:read` |
| 8 | `/search/fuzzy` | GET | Fuzzy search | Public |
| 9 | `oramaSearch` (Query) | GraphQL search | Public |
| 10 | `oramaSuggest` (Query) | Search suggestions | Public |

#### B. Elasticsearch Integration

| STT | Tính Năng | Mô Tả | Quyền Yêu Cầu |
|-----|-----------|-------|----------------|
| 1 | Full-text search | Advanced text search | Public |
| 2 | Faceted search | Category filtering | Public |
| 3 | Auto-indexing | Real-time index updates | System |
| 4 | Search analytics | Usage tracking | `analytics:read` |

---

### 14. COMMUNICATIONS (Truyền Thông)

#### A. Support Chat System

| STT | Endpoint | Method | Mô Tả | Quyền Yêu Cầu |
|-----|----------|--------|-------|----------------|
| 1 | `/webhooks/zalo` | GET/POST | Zalo webhook integration | Public |
| 2 | `/webhooks/facebook` | GET/POST | Facebook Messenger webhook | Public |

#### B. Affiliate System

| STT | Endpoint | Method | Mô Tả | Quyền Yêu Cầu |
|-----|----------|--------|-------|----------------|
| 1 | `/aff/:trackingCode` | GET | Affiliate redirect | Public |
| 2 | `/aff/pixel/:trackingCode` | GET | Tracking pixel | Public |
| 3 | `/track/click/:trackingCode` | GET | Click tracking | Public |

---

### 15. IMPORT/EXPORT (Nhập/Xuất Dữ Liệu)

| STT | Endpoint | Method | Mô Tả | Quyền Yêu Cầu |
|-----|----------|--------|-------|----------------|
| 1 | `/api/product-import-export/template` | GET | Product template | `content:read` |
| 2 | `/api/product-import-export/import` | POST | Import products | `content:create` |
| 3 | `/api/product-import-export/export` | GET | Export products | `analytics:export` |
| 4 | `/api/category-import-export/template` | GET | Category template | `content:read` |
| 5 | `/api/category-import-export/import` | POST | Import categories | `content:create` |
| 6 | `/api/category-import-export/export` | GET | Export categories | `analytics:export` |
| 7 | `/api/invoice-import/template` | GET | Invoice template | `content:read` |
| 8 | `/api/invoice-import/upload` | POST | Upload invoices | `content:create` |
| 9 | `/api/invoice-import/preview` | POST | Preview import | `content:read` |

---

### 16. UNIVERSAL QUERY SYSTEM (Hệ Thống Query Động)

#### A. Dynamic Queries

| STT | Resolver | Type | Mô Tả | Quyền Yêu Cầu |
|-----|----------|------|-------|----------------|
| 1 | `universalQuery` | Query | Dynamic query any table | Authenticated |
| 2 | `universalCreate` | Mutation | Dynamic create record | Authenticated |
| 3 | `universalUpdate` | Mutation | Dynamic update record | Authenticated |
| 4 | `universalDelete` | Mutation | Dynamic delete record | Authenticated |
| 5 | `universalAggregate` | Query | Aggregate operations | Authenticated |
| 6 | `universalCount` | Query | Count records | Authenticated |
| 7 | `universalGroupBy` | Query | Group by operations | Authenticated |
| 8 | `universalBulkCreate` | Mutation | Bulk create | Authenticated |
| 9 | `universalBulkUpdate` | Mutation | Bulk update | Authenticated |
| 10 | `universalBulkDelete` | Mutation | Bulk delete | Authenticated |
| 11 | `universalUpsert` | Mutation | Upsert operation | Authenticated |
| 12 | `getTables` | Query | List all tables | `system:admin` |

#### B. Unified Dynamic Queries

| STT | Resolver | Type | Mô Tả | Quyền Yêu Cầu |
|-----|----------|------|-------|----------------|
| 1 | `queryAll` | Query | Query all records | Authenticated |
| 2 | `queryOne` | Query | Query single record | Authenticated |
| 3 | `queryById` | Query | Query by ID | Authenticated |
| 4 | `countRecords` | Query | Count records | Authenticated |
| 5 | `aggregateData` | Query | Aggregate operations | Authenticated |
| 6 | `searchRecords` | Query | Search with filters | Authenticated |

---

### 17. WEBSITE SETTINGS (Cài Đặt Website)

| STT | Resolver | Type | Mô Tả | Quyền Yêu Cầu |
|-----|----------|------|-------|----------------|
| 1 | `websiteSettings` | Query | List all settings | `content:read` |
| 2 | `publicWebsiteSettings` | Query | Public settings | Public |
| 3 | `websiteSetting` | Query | Get single setting | `content:read` |
| 4 | `websiteSettingsByCategory` | Query | Settings by category | `content:read` |
| 5 | `headerSettings` | Query | Header settings | Public |
| 6 | `footerSettings` | Query | Footer settings | Public |
| 7 | `updateWebsiteSetting` | Mutation | Update setting | `content:update` |
| 8 | `createWebsiteSetting` | Mutation | Create setting | `content:create` |
| 9 | `deleteWebsiteSetting` | Mutation | Delete setting | `content:delete` |

---

## 📊 III. THỐNG KÊ TỔNG QUAN

### 1. Số Lượng Tính Năng

| Module | Số Lượng Features | GraphQL Resolvers | REST Endpoints |
|--------|-------------------|-------------------|----------------|
| Authentication | 16 | 14 | 7 |
| User Management | 13 | 13 | 0 |
| RBAC | 24 | 17 | 13 |
| Task Management | 17 | 17 | 0 |
| Project Management | 8 | 8 | 1 |
| Content - Posts | 8 | 8 | 0 |
| Content - Categories | 6 | 6 | 3 |
| Page Builder | 8 | 8 | 0 |
| E-commerce - Products | 10 | 8 | 2 |
| E-commerce - Orders | 7 | 7 | 0 |
| E-commerce - Cart | 5 | 5 | 0 |
| E-commerce - Invoices | 3 | 0 | 3 |
| Menu System | 13 | 6 | 0 |
| File Management | 8 | 2 | 8 |
| Security & Compliance | 13 | 0 | 13 |
| Monitoring | 8 | 0 | 8 |
| Analytics | 9 | 2 | 9 |
| AI & ML | 12 | 3 | 9 |
| Search | 14 | 2 | 9 |
| Communications | 3 | 2 | 3 |
| Import/Export | 9 | 0 | 9 |
| Universal Queries | 18 | 18 | 0 |
| Website Settings | 9 | 9 | 0 |
| **TỔNG CỘNG** | **240+** | **154+** | **97+** |

### 2. Phân Bố Quyền Theo Vai Trò

| Vai Trò | Số Quyền | % Toàn Quyền | Modules Có Quyền |
|---------|----------|--------------|------------------|
| Super Admin | 39 | 100% | Tất cả 9 modules |
| Admin | 30 | 77% | 8/9 modules |
| Manager | 22 | 56% | 6/9 modules |
| Team Lead | 17 | 44% | 5/9 modules |
| User | 12 | 31% | 4/9 modules |
| Viewer | 8 | 21% | 3/9 modules |
| Guest | 1 | 3% | 1/9 modules |

### 3. API Endpoints Theo Loại

| Loại Endpoint | Số Lượng | % |
|---------------|----------|---|
| GraphQL Queries | 85+ | 35% |
| GraphQL Mutations | 69+ | 28% |
| REST GET | 52+ | 21% |
| REST POST | 28+ | 11% |
| REST PUT/PATCH | 8+ | 3% |
| REST DELETE | 9+ | 4% |
| **TỔNG** | **251+** | **100%** |

---

## 🔐 IV. BẢO MẬT & COMPLIANCE

### 1. Security Layers

| Layer | Technology | Mô Tả |
|-------|------------|-------|
| Authentication | NextAuth.js + JWT | Multi-provider auth |
| Authorization | RBAC System | Role-based access control |
| Session | Redis | Distributed session storage |
| API Security | Helmet + CORS | HTTP headers protection |
| Rate Limiting | Middleware | API rate limiting |
| Data Encryption | bcrypt + AES | Password & data encryption |
| MFA | TOTP + SMS | Multi-factor authentication |
| Audit Trail | Audit Logs | Complete activity tracking |

### 2. Compliance Standards

| Standard | Status | Endpoints |
|----------|--------|-----------|
| GDPR | ✅ Supported | `/api/security/compliance/reports/gdpr` |
| SOC2 | ✅ Supported | `/api/security/compliance/reports/soc2` |
| HIPAA | 🚧 In Progress | - |
| PCI DSS | 🚧 In Progress | - |

---

## 🚀 V. CÔNG NGHỆ SỬ DỤNG

### 1. Tech Stack Chi Tiết

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Frontend** | Next.js | 15.5.0 | React framework với App Router |
| **Frontend** | React | 19.1.1 | UI library với React Compiler |
| **Frontend** | TailwindCSS | 4.1.12 | Utility-first CSS framework |
| **Backend** | NestJS | 11.1.6 | Progressive Node.js framework |
| **Database** | PostgreSQL | 16+ | Primary relational database |
| **Cache** | Redis | 7+ | In-memory data store |
| **Storage** | MinIO | Latest | S3-compatible object storage |
| **ORM** | Prisma | 6+ | Next-gen ORM |
| **API** | GraphQL | 16+ | Query language for APIs |
| **API** | Apollo Server | 4+ | GraphQL server |
| **API** | Apollo Client | 3+ | GraphQL client |
| **Search** | Orama | Latest | Fast in-memory search |
| **Search** | Elasticsearch | 8+ | Distributed search engine |
| **Runtime** | Bun.js | 1.0+ | Fast JavaScript runtime |
| **Auth** | NextAuth.js | 5+ | Authentication for Next.js |
| **Validation** | Zod | Latest | TypeScript-first schema validation |
| **Forms** | React Hook Form | 7+ | Performant form library |
| **Icons** | Lucide React | Latest | Beautiful icon library |
| **Charts** | Recharts | 2+ | Composable charting library |
| **Container** | Docker | 20+ | Containerization |
| **AI/ML** | TensorFlow.js | Latest | Machine learning in JS |
| **Monitoring** | Prometheus | Latest | Metrics collection |
| **Monitoring** | Grafana | Latest | Metrics visualization |

### 2. Development Tools

| Tool | Purpose |
|------|---------|
| TypeScript | Type safety |
| ESLint | Code linting |
| Prettier | Code formatting |
| Husky | Git hooks |
| Jest | Unit testing |
| Cypress | E2E testing |
| Storybook | Component documentation |
| Prisma Studio | Database GUI |

---

## 📈 VI. PERFORMANCE & SCALABILITY

### 1. Caching Strategy

| Layer | Technology | Purpose |
|-------|------------|---------|
| Database Query | Prisma + Redis | Query result caching |
| GraphQL | Apollo Cache | Client-side caching |
| API Response | Redis | Response caching |
| Static Assets | Next.js | Static generation |
| CDN | CloudFlare/AWS | Global content delivery |

### 2. Database Optimization

| Optimization | Implementation |
|--------------|----------------|
| Indexes | On frequently queried columns |
| Connection Pooling | Prisma connection pool |
| Query Optimization | N+1 prevention |
| Pagination | Cursor-based pagination |
| Soft Delete | Retain data integrity |

---

## 🎯 VII. ROADMAP & FUTURE FEATURES

### Đang Phát Triển (In Progress)

- [ ] Mobile App (React Native)
- [ ] Real-time Collaboration
- [ ] Advanced Analytics Dashboard
- [ ] Multi-tenancy Support
- [ ] Workflow Automation
- [ ] Advanced AI Features
- [ ] Video Processing
- [ ] Payment Gateway Integration

### Kế Hoạch (Planned)

- [ ] Blockchain Integration
- [ ] Web3 Features
- [ ] Advanced ML Models
- [ ] IoT Integration
- [ ] Microservices Architecture
- [ ] Kubernetes Deployment
- [ ] Advanced Security Features
- [ ] Compliance Automation

---

## 📞 VIII. LIÊN HỆ & HỖ TRỢ

| Thông Tin | Chi Tiết |
|-----------|----------|
| **Admin Email** | katachanneloffical@gmail.com |
| **Admin Phone** | 0977272967 |
| **Admin Name** | Phạm Chí Kiệt |
| **Repository** | github.com/KataChannel/katastarterkit |
| **Documentation** | Xem các file .md trong project |

---

## 📝 IX. GHI CHÚ

### Lưu Ý Quan Trọng

1. **Bảo Mật**:
   - Đổi mật khẩu admin mặc định ngay lập tức
   - Enable MFA cho tất cả super_admin
   - Review audit logs thường xuyên
   - Backup database định kỳ

2. **Phân Quyền**:
   - Chỉ super_admin có quyền truy cập SIDEBAR menus
   - Tất cả users có quyền truy cập HEADER menus (public)
   - Permissions được inherit từ roles
   - Direct permissions override role permissions

3. **Performance**:
   - Sử dụng pagination cho large datasets
   - Enable Redis caching
   - Monitor query performance
   - Optimize images & assets

4. **Development**:
   - Follow TypeScript strict mode
   - Write tests for critical features
   - Document all API changes
   - Use Git flow for branching

---

**Ngày Tạo**: 03/11/2025  
**Version**: 1.0.0  
**Người Tạo**: AI Assistant  
**Mục Đích**: Tổng hợp đầy đủ tính năng và phân quyền hệ thống

---

**© 2025 RauSachCore - All Rights Reserved**
