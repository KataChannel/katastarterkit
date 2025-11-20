# RBAC (Role-Based Access Control) System

Hệ thống phân quyền cho quản lý nội dung website.

## 📋 Roles đã tạo

### 1. **Blog Manager** (`blog_manager`)
- Quản lý toàn bộ blog và danh mục
- Permissions:
  - ✅ Tạo/Sửa/Xóa bài viết (tất cả)
  - ✅ Xuất bản bài viết
  - ✅ Quản lý danh mục blog
  - ✅ Quản lý file/media

### 2. **Blog Editor** (`blog_editor`)
- Tạo và chỉnh sửa bài viết của mình
- Permissions:
  - ✅ Tạo bài viết mới
  - ✅ Sửa/Xóa bài viết của mình
  - ✅ Xem tất cả bài viết
  - ✅ Xem danh mục blog
  - ✅ Upload file

### 3. **Product Manager** (`product_manager`)
- Quản lý sản phẩm và danh mục
- Permissions:
  - ✅ Tạo/Sửa/Xóa sản phẩm
  - ✅ Quản lý tồn kho
  - ✅ Quản lý giá
  - ✅ Quản lý danh mục sản phẩm
  - ✅ Quản lý file

### 4. **Order Manager** (`order_manager`)
- Xử lý đơn hàng
- Permissions:
  - ✅ Xem đơn hàng
  - ✅ Cập nhật trạng thái
  - ✅ Quản lý thanh toán
  - ✅ Hủy đơn/Hoàn tiền

### 5. **Page Builder Manager** (`page_builder_manager`)
- Quản lý trang website
- Permissions:
  - ✅ Tạo/Sửa/Xóa trang
  - ✅ Xuất bản trang
  - ✅ Quản lý template
  - ✅ Quản lý file

### 6. **Content Manager** (`content_manager`)
- Quản lý tất cả nội dung
- Permissions: Tất cả quyền của Blog + Product + Page Builder

### 7. **E-commerce Manager** (`ecommerce_manager`)
- Quản lý toàn bộ e-commerce
- Permissions: Tất cả quyền của Product + Order

## 🚀 Setup

### 1. Chạy seed để tạo roles và permissions

```bash
cd backend
npm run seed:rbac
```

Hoặc:

```bash
npx ts-node prisma/seeds/rbac-roles-permissions.seed.ts
```

### 2. Gán roles cho users

Sửa file `prisma/seeds/assign-user-roles.seed.ts`, thêm email và role cần gán:

```typescript
const ASSIGNMENTS: RoleAssignment[] = [
  { userEmail: 'user@example.com', roleName: 'blog_manager' },
  // ... thêm các assignments khác
];
```

Chạy seed:

```bash
npm run seed:assign-roles
```

Hoặc:

```bash
npx ts-node prisma/seeds/assign-user-roles.seed.ts
```

## 📝 Sử dụng trong code

### 1. Protect routes với permissions

```typescript
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RBACGuard } from '@/common/guards/rbac.guard';
import { RequirePermissions } from '@/common/decorators/rbac.decorator';

@Controller('blog')
@UseGuards(RBACGuard)
export class BlogController {
  
  @Get()
  @RequirePermissions({ resource: 'blog', action: 'read', scope: 'all' })
  async getAllPosts() {
    // Chỉ users có permission blog:read:all mới access được
  }

  @Post()
  @RequirePermissions({ resource: 'blog', action: 'create', scope: 'own' })
  async createPost() {
    // Chỉ users có permission blog:create:own mới access được
  }
}
```

### 2. Protect routes với roles

```typescript
import { RequireRole } from '@/common/decorators/rbac.decorator';

@Controller('admin/blog')
@UseGuards(RBACGuard)
export class AdminBlogController {
  
  @Get()
  @RequireRole('blog_manager', 'content_manager')
  async managePosts() {
    // Chỉ users có role blog_manager hoặc content_manager
  }
}
```

### 3. Public routes (không cần auth)

```typescript
import { Public } from '@/common/decorators/rbac.decorator';

@Controller('public')
export class PublicController {
  
  @Get()
  @Public()
  async getPublicData() {
    // Route này public, không cần authentication
  }
}
```

### 4. Check permission trong service

```typescript
import { RBACService } from '@/common/services/rbac.service';

export class BlogService {
  constructor(private rbacService: RBACService) {}

  async updatePost(userId: string, postId: string) {
    // Check permission
    const hasPermission = await this.rbacService.userHasPermission(
      userId,
      'blog',
      'update',
      'all'
    );

    if (!hasPermission) {
      throw new ForbiddenException('No permission to update this post');
    }

    // ... logic update
  }
}
```

## 🔌 API Endpoints

### Roles & Permissions

- `GET /rbac/roles` - Lấy tất cả roles
- `GET /rbac/roles/:id` - Lấy role theo ID
- `GET /rbac/permissions` - Lấy tất cả permissions (grouped by category)

### User Roles & Permissions

- `GET /rbac/me/roles` - Lấy roles của user hiện tại
- `GET /rbac/me/permissions` - Lấy permissions của user hiện tại
- `GET /rbac/users/:userId/roles` - Lấy roles của user
- `GET /rbac/users/:userId/permissions` - Lấy permissions của user

### Role Assignment

- `POST /rbac/users/:userId/roles` - Gán role cho user
  ```json
  {
    "roleId": "role-id",
    "expiresAt": "2025-12-31T23:59:59Z" // optional
  }
  ```
- `DELETE /rbac/users/:userId/roles/:roleId` - Gỡ role khỏi user

### Role Users

- `GET /rbac/roles/:roleId/users` - Lấy danh sách users có role

### Permission Check

- `POST /rbac/check-permission` - Kiểm tra permission
  ```json
  {
    "userId": "user-id",
    "resource": "blog",
    "action": "create",
    "scope": "own"
  }
  ```

## 🏗️ Database Schema

### Role
- `name` - Tên role (unique)
- `displayName` - Tên hiển thị
- `description` - Mô tả
- `isSystemRole` - Role hệ thống (không xóa được)
- `isActive` - Trạng thái active
- `priority` - Độ ưu tiên

### Permission
- `resource` - Resource type (blog, product, order, ...)
- `action` - Action (create, read, update, delete, ...)
- `scope` - Scope (own, all, team, ...)
- `category` - Category để nhóm permissions

### UserRoleAssignment
- `userId` - User ID
- `roleId` - Role ID
- `effect` - allow/deny
- `assignedBy` - Người gán
- `expiresAt` - Thời hạn (optional)

### UserPermission
- `userId` - User ID
- `permissionId` - Permission ID
- `effect` - allow/deny
- `assignedBy` - Người gán
- `expiresAt` - Thời hạn (optional)

## 🎯 Permission Naming Convention

Format: `resource:action:scope`

Examples:
- `blog:create:own` - Tạo blog của mình
- `blog:update:all` - Sửa tất cả blog
- `product:delete:all` - Xóa tất cả sản phẩm
- `order:read:all` - Xem tất cả đơn hàng

## 🔐 Security Notes

1. **ADMIN role** bypass tất cả permission checks
2. Permissions có thể có `expiresAt` để tự động expire
3. Effect `deny` override `allow` (chưa implement)
4. Scope hierarchy: `own < team < organization < all`

## 📦 Package Scripts

Thêm vào `package.json`:

```json
{
  "scripts": {
    "seed:rbac": "ts-node prisma/seeds/rbac-roles-permissions.seed.ts",
    "seed:assign-roles": "ts-node prisma/seeds/assign-user-roles.seed.ts"
  }
}
```

## 🆕 Thêm Role/Permission mới

### 1. Thêm Permission mới

Sửa file `rbac-roles-permissions.seed.ts`:

```typescript
const PERMISSIONS = {
  // ... existing
  NEW_MODULE: [
    { resource: 'new_module', action: 'create', scope: 'all', displayName: '...', description: '...' },
    // ...
  ],
};
```

### 2. Thêm Role mới

```typescript
const ROLES = [
  // ... existing
  {
    name: 'new_role',
    displayName: 'Role mới',
    description: 'Mô tả',
    permissions: [
      ...PERMISSIONS.NEW_MODULE,
    ],
  },
];
```

### 3. Chạy lại seed

```bash
npm run seed:rbac
```

## 🎨 Frontend Integration

### Check permission trước khi render

```typescript
// React example
const { data: permissions } = useQuery(GET_MY_PERMISSIONS);

const hasPermission = permissions?.some(
  p => p.resource === 'blog' && p.action === 'create'
);

{hasPermission && <CreateButton />}
```

### Context Provider

```typescript
// PermissionContext.tsx
export const PermissionContext = createContext<Permission[]>([]);

export function usePermission(resource: string, action: string, scope?: string) {
  const permissions = useContext(PermissionContext);
  return permissions.some(
    p => p.resource === resource && 
         p.action === action && 
         (!scope || p.scope === scope)
  );
}
```

## 📞 Support

Nếu cần thêm roles hoặc permissions mới, liên hệ dev team.
