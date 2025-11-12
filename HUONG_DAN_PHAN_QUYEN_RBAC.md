# 🔐 HƯỚNG DẪN HỆ THỐNG PHÂN QUYỀN (RBAC)

## 📋 Mục lục
1. [Tổng quan](#tổng-quan)
2. [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
3. [Cấu trúc Permission](#cấu-trúc-permission)
4. [Các Role có sẵn](#các-role-có-sẵn)
5. [Hướng dẫn Backend](#hướng-dẫn-backend)
6. [Hướng dẫn Frontend](#hướng-dẫn-frontend)
7. [Quản lý User & Role](#quản-lý-user--role)
8. [Best Practices](#best-practices)

---

## Tổng quan

Hệ thống RBAC (Role-Based Access Control) cho phép quản lý quyền truy cập chi tiết dựa trên vai trò của người dùng.

### Đặc điểm chính:
- ✅ **Hierarchical Permissions**: Phân quyền theo cấp độ (own, all)
- ✅ **Dynamic Role Assignment**: Gán role động cho user
- ✅ **Permission Inheritance**: Kế thừa permission từ role
- ✅ **Time-based Access**: Hỗ trợ expiration date
- ✅ **Effect Control**: Allow/Deny permissions
- ✅ **ADMIN Bypass**: ADMIN có quyền truy cập tất cả

---

## Kiến trúc hệ thống

### Database Schema

```prisma
// Role: Nhóm người dùng với tập permission
model Role {
  id            String   @id @default(uuid())
  name          String   @unique
  displayName   String
  description   String?
  isSystemRole  Boolean  @default(false)
  isActive      Boolean  @default(true)
  priority      Int      @default(0)
  
  permissions   RolePermission[]
  userRoles     UserRoleAssignment[]
}

// Permission: Quyền cụ thể
model Permission {
  id            String   @id @default(uuid())
  name          String   @unique
  displayName   String
  resource      String   // blog, product, order, page
  action        String   // create, read, update, delete
  scope         String?  // own, all, team
  category      String?  // blog, ecommerce, page_builder
  isSystemPerm  Boolean  @default(false)
  isActive      Boolean  @default(true)
}

// Gán Role cho User
model UserRoleAssignment {
  id          String    @id @default(uuid())
  userId      String
  roleId      String
  effect      String    @default("allow")  // allow, deny
  assignedBy  String?
  assignedAt  DateTime  @default(now())
  expiresAt   DateTime?
  
  user        User      @relation(...)
  role        Role      @relation(...)
}

// Gán Permission trực tiếp cho User (nếu cần)
model UserPermission {
  id            String      @id @default(uuid())
  userId        String
  permissionId  String
  effect        String      @default("allow")
  expiresAt     DateTime?
  
  user          User        @relation(...)
  permission    Permission  @relation(...)
}
```

---

## Cấu trúc Permission

### Format Permission
```
resource:action:scope
```

### Các thành phần:

#### 1. **Resource** (Tài nguyên)
- `blog` - Bài viết
- `blog_category` - Danh mục bài viết
- `product` - Sản phẩm
- `product_category` - Danh mục sản phẩm
- `order` - Đơn hàng
- `page` - Trang web (Page Builder)
- `template` - Template (Page Builder)
- `file` - File/Hình ảnh

#### 2. **Action** (Hành động)
- `create` - Tạo mới
- `read` - Xem/Đọc
- `update` - Chỉnh sửa
- `delete` - Xóa
- `publish` - Xuất bản
- `manage_inventory` - Quản lý tồn kho
- `manage_pricing` - Quản lý giá
- `manage_status` - Quản lý trạng thái
- `manage_payment` - Quản lý thanh toán
- `cancel` - Hủy
- `refund` - Hoàn tiền
- `upload` - Upload
- `organize` - Tổ chức/Quản lý

#### 3. **Scope** (Phạm vi)
- `own` - Chỉ áp dụng cho nội dung của chính mình
- `all` - Áp dụng cho tất cả nội dung
- `team` - Áp dụng cho team (nếu có)
- `organization` - Áp dụng cho tổ chức (nếu có)

### Ví dụ Permissions:
```typescript
// Tạo bài viết của mình
"blog:create:own"

// Xem tất cả bài viết
"blog:read:all"

// Sửa bài viết của mình
"blog:update:own"

// Xóa tất cả bài viết
"blog:delete:all"

// Quản lý tồn kho sản phẩm
"product:manage_inventory:all"

// Upload file
"file:upload:all"
```

---

## Các Role có sẵn

### 1. 📝 **Blog Manager** (`blog_manager`)
Quản lý toàn bộ blog và danh mục

**Permissions:**
- ✅ CRUD tất cả bài viết (own + all)
- ✅ CRUD danh mục blog
- ✅ Xuất bản bài viết
- ✅ Quản lý file

**Use case:** Quản lý nội dung blog, kiểm duyệt bài viết

---

### 2. ✍️ **Blog Editor** (`blog_editor`)
Biên tập viên - tạo và sửa bài viết của mình

**Permissions:**
- ✅ Tạo bài viết mới
- ✅ Sửa/Xóa bài viết của mình
- ✅ Xem tất cả bài viết (read only)
- ✅ Xem danh mục
- ✅ Upload file

**Use case:** Content creator, người viết bài

---

### 3. 🛍️ **Product Manager** (`product_manager`)
Quản lý sản phẩm và danh mục

**Permissions:**
- ✅ CRUD sản phẩm
- ✅ CRUD danh mục sản phẩm
- ✅ Quản lý tồn kho
- ✅ Quản lý giá
- ✅ Quản lý file

**Use case:** Quản lý kho, cập nhật sản phẩm

---

### 4. 📦 **Order Manager** (`order_manager`)
Quản lý đơn hàng

**Permissions:**
- ✅ Xem đơn hàng
- ✅ Cập nhật đơn hàng
- ✅ Quản lý trạng thái
- ✅ Quản lý thanh toán
- ✅ Hủy đơn hàng
- ✅ Hoàn tiền

**Use case:** Xử lý đơn hàng, customer service

---

### 5. 🎨 **Page Builder Manager** (`page_builder_manager`)
Quản lý trang web với Page Builder

**Permissions:**
- ✅ CRUD trang web
- ✅ CRUD template
- ✅ Xuất bản trang
- ✅ Quản lý file

**Use case:** Web designer, frontend developer

---

### 6. 📚 **Content Manager** (`content_manager`)
Quản lý tất cả nội dung (blog + product + page)

**Permissions:**
- ✅ Tất cả permissions của Blog Manager
- ✅ Tất cả permissions của Product Manager
- ✅ Tất cả permissions của Page Builder Manager
- ✅ Quản lý file

**Use case:** Content lead, marketing manager

---

### 7. 💼 **E-commerce Manager** (`ecommerce_manager`)
Quản lý toàn bộ e-commerce (sản phẩm + đơn hàng)

**Permissions:**
- ✅ Tất cả permissions của Product Manager
- ✅ Tất cả permissions của Order Manager
- ✅ Quản lý file

**Use case:** Store manager, operations manager

---

## Hướng dẫn Backend

### 1. Setup và Seed Database

#### Chạy seed để tạo roles & permissions:
```bash
cd backend
npm run seed:rbac
```

#### Gán role cho user:
```bash
# Sửa file backend/prisma/seeds/assign-user-roles.seed.ts
# Thêm email và role của user

npm run seed:assign-roles
```

---

### 2. Sử dụng Guard trong Controller

#### Import guard và decorators:
```typescript
import { UseGuards } from '@nestjs/common';
import { RBACGuard } from '../common/guards/rbac.guard';
import { RequirePermissions, RequireRole } from '../common/decorators/rbac.decorator';
```

#### Bảo vệ endpoint với permission:
```typescript
@Controller('blogs')
@UseGuards(RBACGuard)
export class BlogController {
  
  // Chỉ cho phép tạo bài viết (own)
  @Post()
  @RequirePermissions({ resource: 'blog', action: 'create', scope: 'own' })
  async create(@Body() data: CreateBlogDto, @Request() req) {
    return this.blogService.create(data, req.user.id);
  }
  
  // Cho phép xem tất cả bài viết
  @Get()
  @RequirePermissions({ resource: 'blog', action: 'read', scope: 'all' })
  async findAll() {
    return this.blogService.findAll();
  }
  
  // Chỉ sửa bài viết của mình
  @Put(':id')
  @RequirePermissions({ resource: 'blog', action: 'update', scope: 'own' })
  async update(@Param('id') id: string, @Body() data: UpdateBlogDto, @Request() req) {
    // Kiểm tra ownership trong service
    return this.blogService.update(id, data, req.user.id);
  }
  
  // Xóa tất cả bài viết (chỉ manager)
  @Delete(':id')
  @RequirePermissions({ resource: 'blog', action: 'delete', scope: 'all' })
  async delete(@Param('id') id: string) {
    return this.blogService.delete(id);
  }
}
```

#### Bảo vệ endpoint với role:
```typescript
@Controller('admin')
@UseGuards(RBACGuard)
export class AdminController {
  
  // Chỉ cho phép blog_manager hoặc content_manager
  @Get('dashboard')
  @RequireRole('blog_manager', 'content_manager')
  async getDashboard() {
    return this.adminService.getDashboard();
  }
}
```

#### Route public (không cần permission):
```typescript
import { Public } from '../common/decorators/rbac.decorator';

@Controller('public')
export class PublicController {
  
  @Get('posts')
  @Public()  // Không cần authentication
  async getPosts() {
    return this.postService.getPublished();
  }
}
```

---

### 3. Kiểm tra permission trong Service

```typescript
import { Injectable, ForbiddenException } from '@nestjs/common';
import { RBACService } from '../common/services/rbac.service';

@Injectable()
export class BlogService {
  constructor(private rbacService: RBACService) {}
  
  async update(blogId: string, data: UpdateBlogDto, userId: string) {
    const blog = await this.prisma.blog.findUnique({ where: { id: blogId } });
    
    // Kiểm tra nếu user có quyền update:all
    const canUpdateAll = await this.rbacService.userHasPermission(
      userId,
      'blog',
      'update',
      'all'
    );
    
    // Nếu không có quyền update:all, chỉ cho sửa bài viết của mình
    if (!canUpdateAll && blog.authorId !== userId) {
      throw new ForbiddenException('You can only update your own blogs');
    }
    
    return this.prisma.blog.update({
      where: { id: blogId },
      data,
    });
  }
}
```

---

### 4. RBAC Service API

```typescript
// Get user's all permissions
await rbacService.getUserPermissions(userId);

// Get user's roles
await rbacService.getUserRoles(userId);

// Check specific permission
await rbacService.userHasPermission(userId, 'blog', 'create', 'own');

// Assign role to user
await rbacService.assignRoleToUser(userId, roleId, assignedBy, expiresAt);

// Remove role from user
await rbacService.removeRoleFromUser(userId, roleId);

// Get all users with specific role
await rbacService.getUsersByRole(roleId);
```

---

## Hướng dẫn Frontend

### 1. Sử dụng usePermission Hook

```tsx
import { usePermission } from '@/hooks/usePermission';

function BlogList() {
  const {
    permissions,
    loading,
    hasPermission,
    canCreate,
    canUpdate,
    canDelete,
  } = usePermission();
  
  if (loading) return <Loading />;
  
  return (
    <div>
      {/* Hiển thị nút tạo nếu có quyền */}
      {canCreate('blog', 'own') && (
        <button onClick={handleCreate}>Create Blog</button>
      )}
      
      {blogs.map(blog => (
        <BlogCard key={blog.id}>
          <h3>{blog.title}</h3>
          
          {/* Hiển thị nút edit nếu có quyền */}
          {canUpdate('blog', 'own') && (
            <button onClick={() => handleEdit(blog)}>Edit</button>
          )}
          
          {/* Hiển thị nút delete nếu có quyền delete:all */}
          {hasPermission('blog', 'delete', 'all') && (
            <button onClick={() => handleDelete(blog)}>Delete</button>
          )}
        </BlogCard>
      ))}
    </div>
  );
}
```

---

### 2. Sử dụng PermissionGuard Component

```tsx
import { PermissionGuard, RequireAnyPermission } from '@/components/common/PermissionGuard';

function AdminPanel() {
  return (
    <div>
      {/* Chỉ hiển thị nếu có quyền tạo blog */}
      <PermissionGuard resource="blog" action="create" scope="own">
        <CreateBlogForm />
      </PermissionGuard>
      
      {/* Hiển thị nếu có quyền create HOẶC update:all */}
      <RequireAnyPermission
        checks={[
          { resource: 'blog', action: 'create' },
          { resource: 'blog', action: 'update', scope: 'all' }
        ]}
      >
        <BlogManagementPanel />
      </RequireAnyPermission>
      
      {/* Hiển thị fallback nếu không có quyền */}
      <PermissionGuard
        resource="admin"
        action="access"
        fallback={<AccessDenied />}
      >
        <AdminDashboard />
      </PermissionGuard>
    </div>
  );
}
```

---

### 3. Sử dụng useRole Hook

```tsx
import { useRole } from '@/hooks/usePermission';

function UserProfile() {
  const { roles, hasRole, hasAnyRole } = useRole();
  
  return (
    <div>
      <h2>Your Roles:</h2>
      <ul>
        {roles.map(ra => (
          <li key={ra.id}>{ra.role.displayName}</li>
        ))}
      </ul>
      
      {/* Kiểm tra role cụ thể */}
      {hasRole('blog_manager') && (
        <AdminBlogPanel />
      )}
      
      {/* Kiểm tra có 1 trong các role */}
      {hasAnyRole(['product_manager', 'ecommerce_manager']) && (
        <ProductManagementPanel />
      )}
    </div>
  );
}
```

---

### 4. GraphQL Queries

```typescript
import { useQuery } from '@apollo/client';
import { GET_MY_PERMISSIONS, GET_MY_ROLES } from '@/graphql/rbac.queries';

// Get permissions
const { data: permData } = useQuery(GET_MY_PERMISSIONS);
const permissions = permData?.myPermissions || [];

// Get roles
const { data: roleData } = useQuery(GET_MY_ROLES);
const roles = roleData?.myRoles || [];
```

---

## Quản lý User & Role

### 1. Admin Panel - Role Management

Truy cập: `/admin/rbac/roles`

**Chức năng:**
- Xem danh sách roles
- Tạo role mới
- Chỉnh sửa role
- Gán permissions cho role
- Xem users có role
- Filter theo status, type

---

### 2. Admin Panel - Permission Management

Truy cập: `/admin/rbac/permissions`

**Chức năng:**
- Xem danh sách permissions
- Tạo permission mới
- Chỉnh sửa permission
- Filter theo resource, action
- Tìm kiếm permissions

---

### 3. Gán Role cho User

#### Từ Admin Panel:
1. Vào Role Management
2. Click vào role cần gán
3. Click "Assign to Users"
4. Chọn users và set expiration (nếu cần)

#### Từ Backend API:
```typescript
POST /api/rbac/users/:userId/roles
{
  "roleId": "role-uuid",
  "expiresAt": "2025-12-31T23:59:59Z"  // Optional
}
```

#### Từ Seed Script:
```typescript
// backend/prisma/seeds/assign-user-roles.seed.ts
const USER_ROLE_ASSIGNMENTS = [
  {
    email: 'editor@example.com',
    roles: ['blog_editor'],
  },
  {
    email: 'manager@example.com',
    roles: ['blog_manager', 'product_manager'],
    expiresAt: new Date('2025-12-31'),
  },
];
```

---

## Best Practices

### 1. **Nguyên tắc Least Privilege**
- Chỉ cấp quyền tối thiểu cần thiết
- Sử dụng scope `own` trước, `all` sau
- Review định kỳ permissions

### 2. **Role Hierarchy**
```
ADMIN (bypass all)
  └─ Content Manager (full content)
       ├─ Blog Manager (all blog)
       │    └─ Blog Editor (own blog)
       └─ Product Manager (all product)
```

### 3. **Ownership Check**
- Luôn kiểm tra ownership trong service layer
- Không tin tưởng hoàn toàn frontend check
- Validate permission + ownership ở backend

```typescript
// ❌ BAD: Chỉ check permission
if (hasPermission('blog', 'update', 'own')) {
  await updateBlog(blogId, data);
}

// ✅ GOOD: Check permission + ownership
if (hasPermission('blog', 'update', 'own')) {
  const blog = await getBlog(blogId);
  if (blog.authorId !== userId && !hasPermission('blog', 'update', 'all')) {
    throw new ForbiddenException();
  }
  await updateBlog(blogId, data);
}
```

### 4. **Cache Permissions**
- Frontend: Apollo Client cache
- Backend: Redis cache (recommend)
- Invalidate cache khi assign/remove role

### 5. **Audit Log**
Nên log các hành động quan trọng:
- Assign/Remove role
- Create/Delete permission
- Access sensitive resources
- Permission denied attempts

### 6. **Testing**
```typescript
describe('Blog Permissions', () => {
  it('blog_editor can create own blog', async () => {
    const user = await createUserWithRole('blog_editor');
    const result = await createBlog(user);
    expect(result).toBeDefined();
  });
  
  it('blog_editor cannot delete others blog', async () => {
    const editor = await createUserWithRole('blog_editor');
    const otherBlog = await createBlogByOther();
    await expect(deleteBlog(otherBlog.id, editor)).rejects.toThrow();
  });
  
  it('blog_manager can delete any blog', async () => {
    const manager = await createUserWithRole('blog_manager');
    const anyBlog = await createBlogByOther();
    const result = await deleteBlog(anyBlog.id, manager);
    expect(result.success).toBe(true);
  });
});
```

---

## Workflow Examples

### Use Case 1: Blog Content Management

#### Scenario: Content team với 3 roles
1. **Content Lead** → `content_manager`
   - Quản lý tất cả content
   - Approve/Reject bài viết
   - Quản lý writers

2. **Writer** → `blog_editor`
   - Viết bài mới
   - Sửa bài của mình
   - Submit để review

3. **Guest Writer** → `blog_editor` với `expiresAt`
   - Quyền tạm thời (1 tháng)
   - Tự động hết hạn

---

### Use Case 2: E-commerce Operations

#### Scenario: Store management
1. **Store Manager** → `ecommerce_manager`
   - Quản lý sản phẩm
   - Xử lý đơn hàng
   - Quản lý inventory

2. **Warehouse Staff** → `product_manager`
   - Cập nhật tồn kho
   - Nhập/Xuất sản phẩm

3. **CS Staff** → `order_manager`
   - Xem đơn hàng
   - Cập nhật trạng thái
   - Xử lý hoàn tiền

---

### Use Case 3: Multi-brand Management

#### Scenario: Nhiều brands trong 1 hệ thống
```typescript
// Extend permission với brand context
"blog:create:brand_a"
"blog:create:brand_b"

// Service check
async canUserAccessBrand(userId: string, brandId: string) {
  const permissions = await getUserPermissions(userId);
  return permissions.some(p => 
    p.resource === 'blog' && 
    (p.scope === brandId || p.scope === 'all')
  );
}
```

---

## Troubleshooting

### Permission denied nhưng user đã có role?
1. Check role có `isActive: true`?
2. Check permission có `isActive: true`?
3. Check `expiresAt` có hết hạn chưa?
4. Check effect = 'allow' hay 'deny'?
5. Xem Apollo Client cache có update chưa?

### User có role nhưng không thấy menu/button?
1. Check GraphQL query `GET_MY_PERMISSIONS` có data?
2. Check `usePermission()` hook có loading xong?
3. Check PermissionGuard có đúng resource/action/scope?
4. Clear browser cache

### ADMIN vẫn bị denied?
1. Check `user.roleType === 'ADMIN'` trong database
2. Check RBACGuard có bypass logic cho ADMIN?
3. Check middleware authentication có set `req.user` đúng?

---

## Các API Endpoints

### RBAC Management APIs

```bash
# Get my permissions
GET /api/rbac/me/permissions

# Get my roles
GET /api/rbac/me/roles

# Get all roles (ADMIN only)
GET /api/rbac/roles

# Get role by ID (ADMIN only)
GET /api/rbac/roles/:id

# Create role (ADMIN only)
POST /api/rbac/roles

# Update role (ADMIN only)
PUT /api/rbac/roles/:id

# Delete role (ADMIN only)
DELETE /api/rbac/roles/:id

# Assign role to user (ADMIN only)
POST /api/rbac/users/:userId/roles
{
  "roleId": "uuid",
  "expiresAt": "2025-12-31"  // optional
}

# Remove role from user (ADMIN only)
DELETE /api/rbac/users/:userId/roles/:roleId

# Get all permissions (ADMIN only)
GET /api/rbac/permissions

# Check user permission (ADMIN only)
GET /api/rbac/users/:userId/permissions/check?resource=blog&action=create&scope=own
```

---

## Migration & Updates

### Thêm Permission mới:
```typescript
// 1. Thêm vào PERMISSIONS trong seed file
PERMISSIONS.BLOG.push({
  resource: 'blog',
  action: 'archive',
  scope: 'all',
  displayName: 'Archive bài viết',
  description: 'Lưu trữ bài viết không còn sử dụng'
});

// 2. Chạy seed lại
npm run seed:rbac

// 3. Update frontend types nếu cần
```

### Thêm Role mới:
```typescript
// 1. Thêm vào ROLES trong seed file
ROLES.push({
  name: 'blog_reviewer',
  displayName: 'Người duyệt bài',
  description: 'Review và approve bài viết',
  permissions: [
    { resource: 'blog', action: 'read', scope: 'all' },
    { resource: 'blog', action: 'publish', scope: 'all' },
  ],
});

// 2. Chạy seed lại
npm run seed:rbac
```

---

## Security Considerations

### ⚠️ Quan trọng:

1. **Frontend permission check chỉ là UX**
   - Ẩn/hiện UI elements
   - Backend PHẢI validate lại

2. **Không trust client-side data**
   - Luôn check permission ở backend
   - Validate ownership ở service layer

3. **ADMIN bypass cần cẩn thận**
   - Chỉ assign ADMIN role cho người tin tưởng
   - Log tất cả ADMIN actions

4. **Expiration dates**
   - Set expiration cho guest/temp roles
   - Có cronjob cleanup expired assignments

5. **Effect: deny > allow**
   - Nếu có deny permission → luôn từ chối
   - Implement deny logic nếu cần fine-grained control

---

## Support & Documentation

- **Backend Code**: `/backend/src/common/`
  - Guards: `guards/rbac.guard.ts`
  - Decorators: `decorators/rbac.decorator.ts`
  - Services: `services/rbac.service.ts`
  - Controllers: `controllers/rbac.controller.ts`

- **Frontend Code**: `/frontend/src/`
  - Hooks: `hooks/usePermission.ts`
  - Components: `components/common/PermissionGuard.tsx`
  - Queries: `graphql/rbac.queries.ts`

- **Seeds**: `/backend/prisma/seeds/`
  - `rbac-roles-permissions.seed.ts`
  - `assign-user-roles.seed.ts`

- **Admin UI**: `/frontend/src/components/admin/rbac/`
  - `RoleManagement.tsx`
  - `PermissionManagement.tsx`

---

## Changelog

### v1.0.0 (2025-11-12)
- ✅ Initial RBAC system
- ✅ 7 predefined roles
- ✅ 70+ permissions
- ✅ Frontend hooks & components
- ✅ Admin management UI
- ✅ Seed scripts
- ✅ Documentation

---

**🎉 Chúc bạn triển khai RBAC thành công!**

Nếu có thắc mắc hoặc cần support, vui lòng tạo issue hoặc liên hệ team.
