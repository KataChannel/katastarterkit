# RBAC Frontend Integration Guide

Hướng dẫn tích hợp hệ thống RBAC vào React/Next.js frontend.

## 🎯 Components và Hooks

### 1. `usePermission` Hook

Hook chính để kiểm tra permissions của user hiện tại.

```typescript
import { usePermission } from '@/hooks/usePermission';

function MyComponent() {
  const { 
    permissions,
    loading,
    error,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
  } = usePermission();

  // Check single permission
  if (hasPermission('blog', 'create', 'own')) {
    // User có quyền tạo blog
  }

  // Check nhiều permissions (OR logic)
  if (hasAnyPermission([
    { resource: 'blog', action: 'create' },
    { resource: 'blog', action: 'update', scope: 'all' }
  ])) {
    // User có ít nhất 1 trong các quyền trên
  }

  // Check tất cả permissions (AND logic)
  if (hasAllPermissions([
    { resource: 'product', action: 'update' },
    { resource: 'product', action: 'delete' }
  ])) {
    // User có tất cả các quyền trên
  }

  // Shorthand methods
  if (canCreate('blog')) {
    // User có quyền tạo blog
  }
}
```

### 2. `useRole` Hook

Hook để kiểm tra roles của user.

```typescript
import { useRole } from '@/hooks/usePermission';

function MyComponent() {
  const {
    roles,
    loading,
    error,
    hasRole,
    hasAnyRole,
    hasAllRoles,
  } = useRole();

  if (hasRole('blog_manager')) {
    // User có role blog_manager
  }

  if (hasAnyRole(['blog_manager', 'content_manager'])) {
    // User có ít nhất 1 trong các roles
  }
}
```

### 3. `PermissionGuard` Component

Wrapper component để ẩn/hiện UI dựa trên permissions.

```typescript
import { PermissionGuard } from '@/components/common/PermissionGuard';

function BlogPage() {
  return (
    <>
      {/* Chỉ hiện button nếu có quyền */}
      <PermissionGuard resource="blog" action="create" scope="own">
        <CreateBlogButton />
      </PermissionGuard>

      {/* Với fallback component */}
      <PermissionGuard 
        resource="admin" 
        action="access"
        fallback={<AccessDeniedMessage />}
      >
        <AdminPanel />
      </PermissionGuard>
    </>
  );
}
```

### 4. `RequireAnyPermission` Component

Hiện UI nếu có BẤT KỲ permission nào (OR logic).

```typescript
import { RequireAnyPermission } from '@/components/common/PermissionGuard';

<RequireAnyPermission 
  checks={[
    { resource: 'blog', action: 'create' },
    { resource: 'blog', action: 'update', scope: 'all' }
  ]}
>
  <BlogEditorTools />
</RequireAnyPermission>
```

### 5. `RequireAllPermissions` Component

Hiện UI nếu có TẤT CẢ permissions (AND logic).

```typescript
import { RequireAllPermissions } from '@/components/common/PermissionGuard';

<RequireAllPermissions 
  checks={[
    { resource: 'product', action: 'update' },
    { resource: 'product', action: 'delete' }
  ]}
  fallback={<p>Bạn cần thêm quyền để sử dụng tính năng này</p>}
>
  <DangerZone />
</RequireAllPermissions>
```

## 🎨 Usage Patterns

### Pattern 1: Conditional Rendering

```typescript
function BlogList() {
  const { canCreate, canUpdate, canDelete } = usePermission();

  return (
    <div>
      {canCreate('blog') && <Button>Tạo bài viết</Button>}
      
      {posts.map(post => (
        <PostCard 
          key={post.id}
          post={post}
          showEdit={canUpdate('blog', 'all') || (canUpdate('blog', 'own') && post.authorId === currentUserId)}
          showDelete={canDelete('blog', 'all') || (canDelete('blog', 'own') && post.authorId === currentUserId)}
        />
      ))}
    </div>
  );
}
```

### Pattern 2: Navigation Guard

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermission } from '@/hooks/usePermission';

export default function AdminBlogPage() {
  const router = useRouter();
  const { hasPermission, loading } = usePermission();

  useEffect(() => {
    if (!loading && !hasPermission('blog', 'read', 'all')) {
      router.push('/access-denied');
    }
  }, [loading, hasPermission, router]);

  if (loading) {
    return <Loading />;
  }

  if (!hasPermission('blog', 'read', 'all')) {
    return null;
  }

  return <BlogManagementPage />;
}
```

### Pattern 3: Form Actions

```typescript
function BlogForm({ blog, isNew }: Props) {
  const { canCreate, canUpdate, canDelete, hasPermission } = usePermission();
  
  const canSave = isNew 
    ? canCreate('blog', 'own')
    : canUpdate('blog', 'all') || (canUpdate('blog', 'own') && blog.isOwner);

  const canPublish = hasPermission('blog', 'publish', 'all') || 
                     (hasPermission('blog', 'publish', 'own') && blog.isOwner);

  const canRemove = canDelete('blog', 'all') || 
                    (canDelete('blog', 'own') && blog.isOwner);

  return (
    <form>
      {/* Form fields */}
      
      <div className="actions">
        {canSave && <Button type="submit">Lưu</Button>}
        {canPublish && <Button onClick={onPublish}>Xuất bản</Button>}
        {canRemove && <Button onClick={onDelete} variant="danger">Xóa</Button>}
      </div>
    </form>
  );
}
```

### Pattern 4: Menu Items

```typescript
function AdminMenu() {
  const { hasPermission } = usePermission();

  const menuItems = [
    {
      title: 'Blog',
      href: '/admin/blog',
      show: hasPermission('blog', 'read', 'all'),
    },
    {
      title: 'Sản phẩm',
      href: '/admin/products',
      show: hasPermission('product', 'read', 'all'),
    },
    {
      title: 'Đơn hàng',
      href: '/admin/orders',
      show: hasPermission('order', 'read', 'all'),
    },
    {
      title: 'Page Builder',
      href: '/admin/pages',
      show: hasPermission('page', 'read', 'all'),
    },
  ].filter(item => item.show);

  return (
    <nav>
      {menuItems.map(item => (
        <Link key={item.href} href={item.href}>
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
```

### Pattern 5: Table Actions

```typescript
function ProductTable({ products }: Props) {
  const { canUpdate, canDelete, hasPermission } = usePermission();
  const canManagePricing = hasPermission('product', 'manage_pricing', 'all');
  const canManageInventory = hasPermission('product', 'manage_inventory', 'all');

  return (
    <Table>
      {products.map(product => (
        <TableRow key={product.id}>
          <TableCell>{product.name}</TableCell>
          <TableCell>{product.price}</TableCell>
          <TableCell>
            <DropdownMenu>
              {canUpdate('product') && (
                <DropdownMenuItem onClick={() => onEdit(product)}>
                  Chỉnh sửa
                </DropdownMenuItem>
              )}
              {canManagePricing && (
                <DropdownMenuItem onClick={() => onUpdatePrice(product)}>
                  Cập nhật giá
                </DropdownMenuItem>
              )}
              {canManageInventory && (
                <DropdownMenuItem onClick={() => onUpdateStock(product)}>
                  Cập nhật tồn kho
                </DropdownMenuItem>
              )}
              {canDelete('product') && (
                <DropdownMenuItem onClick={() => onDelete(product)} variant="danger">
                  Xóa
                </DropdownMenuItem>
              )}
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );
}
```

## 🔐 Best Practices

### 1. Always Check Loading State

```typescript
const { hasPermission, loading } = usePermission();

if (loading) {
  return <Skeleton />; // Hoặc loading indicator
}

// Sau đó mới check permission
```

### 2. Server-Side Protection

**QUAN TRỌNG**: Frontend checks chỉ để UX, PHẢI có backend validation!

```typescript
// Frontend (UX only)
if (!canDelete('blog')) {
  return <div>Bạn không có quyền xóa</div>;
}

// Backend API PHẢI check lại
@Delete(':id')
@RequirePermissions({ resource: 'blog', action: 'delete', scope: 'all' })
async deleteBlog(@Param('id') id: string) {
  // ...
}
```

### 3. Scope Handling

```typescript
// Own scope: Chỉ resource của mình
const canEditOwnBlog = hasPermission('blog', 'update', 'own');

// All scope: Tất cả resources
const canEditAllBlogs = hasPermission('blog', 'update', 'all');

// Kết hợp
const canEdit = canEditAllBlogs || (canEditOwnBlog && blog.authorId === currentUserId);
```

### 4. Permission Caching

Permissions được cache bởi Apollo Client, có thể refetch khi cần:

```typescript
const { refetch } = usePermission();

// Sau khi assign role mới
await assignRole(userId, roleId);
await refetch(); // Refresh permissions
```

## 📦 GraphQL Queries

### Get Current User Permissions

```graphql
query GetMyPermissions {
  myPermissions {
    id
    name
    displayName
    resource
    action
    scope
    category
  }
}
```

### Get Current User Roles

```graphql
query GetMyRoles {
  myRoles {
    id
    role {
      id
      name
      displayName
    }
    assignedAt
    expiresAt
  }
}
```

## 🎯 Common Scenarios

### Blog Management

```typescript
// Blog Editor
<PermissionGuard resource="blog" action="create" scope="own">
  <CreateBlogButton />
</PermissionGuard>

// Blog Manager  
<PermissionGuard resource="blog" action="update" scope="all">
  <EditAnyBlogButton />
</PermissionGuard>
```

### Product Management

```typescript
<RequireAllPermissions 
  checks={[
    { resource: 'product', action: 'update' },
    { resource: 'product', action: 'manage_pricing' }
  ]}
>
  <UpdateProductPriceForm />
</RequireAllPermissions>
```

### Order Management

```typescript
<RequireAnyPermission 
  checks={[
    { resource: 'order', action: 'manage_status' },
    { resource: 'order', action: 'manage_payment' }
  ]}
>
  <OrderActions />
</RequireAnyPermission>
```

### Page Builder

```typescript
<PermissionGuard resource="page" action="create">
  <PageBuilderEditor />
</PermissionGuard>
```

## 🚨 Error Handling

```typescript
function ProtectedPage() {
  const { hasPermission, loading, error } = usePermission();

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (loading) {
    return <Loading />;
  }

  if (!hasPermission('admin', 'access')) {
    return <AccessDenied />;
  }

  return <AdminPanel />;
}
```

## 📱 Mobile Considerations

Permissions work the same on mobile, just adapt UI:

```typescript
function MobileMenu() {
  const { hasPermission } = usePermission();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const items = [
    { icon: <BlogIcon />, label: 'Blog', show: hasPermission('blog', 'read') },
    { icon: <ProductIcon />, label: 'Sản phẩm', show: hasPermission('product', 'read') },
    // ...
  ].filter(item => item.show);

  return isMobile ? <BottomNav items={items} /> : <SideNav items={items} />;
}
```

## 🔄 Refresh Permissions

Sau khi admin gán role mới, user có thể refresh permissions:

```typescript
function UserSettings() {
  const { refetch } = usePermission();

  const handleRefreshPermissions = async () => {
    await refetch();
    toast.success('Đã cập nhật quyền hạn');
  };

  return (
    <Button onClick={handleRefreshPermissions}>
      Làm mới quyền hạn
    </Button>
  );
}
```

## 🎓 Summary

1. **Use Hooks**: `usePermission()` và `useRole()` cho logic
2. **Use Guards**: `<PermissionGuard>` cho UI wrapping
3. **Check Loading**: Luôn handle loading state
4. **Backend Validation**: Frontend checks chỉ là UX, backend PHẢI validate
5. **Cache Management**: Apollo Client tự động cache, dùng refetch khi cần

Happy coding! 🚀
