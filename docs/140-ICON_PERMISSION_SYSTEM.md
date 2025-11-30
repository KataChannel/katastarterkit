# Phân quyền Icon Header theo Role

## Tổng quan
Hệ thống cho phép Admin quản lý và phân quyền hiển thị icon trong Header theo từng nhóm role.

## Các file đã tạo/cập nhật

### 1. Types (`/src/types/icon-permission.ts`)
- Định nghĩa các types: `IconType`, `IconPosition`, `IconPermissionItem`
- Cấu hình preset cho từng role: ADMIN, giangvien, USER
- Helper functions: `getIconPermissionsForRole()`, `isIconAllowed()`, `mergeIconPermissions()`

### 2. Hook (`/src/hooks/useIconPermissions.ts`)
- `useIconPermissions()`: Hook đầy đủ chức năng
- `useHeaderActionsPermissions()`: Hook đơn giản cho HeaderActions
- Tự động merge permissions khi user có nhiều role

### 3. Context (`/src/contexts/IconPermissionContext.tsx`)
- `IconPermissionProvider`: Provider quản lý state
- `useIconPermissionContext()`: Hook truy cập context
- Các actions: `updateRoleConfig()`, `deleteRoleConfig()`, `resetToDefaults()`, `applyPreset()`

### 4. SmartHeaderActions (`/src/components/layout/SmartHeaderActions.tsx`)
- Component wrapper tự động áp dụng permissions
- Hỗ trợ `overridePermissions` để ghi đè khi cần
- Debug mode để log config

### 5. Admin Settings (`/src/app/admin/settings/icon-permissions/page.tsx`)
- Giao diện quản lý phân quyền icon
- Chọn role → Cấu hình từng icon
- Áp dụng preset hoặc tùy chỉnh chi tiết
- Xem trước giao diện trước khi lưu

### 6. Providers (`/src/components/providers.tsx`)
- Thêm `IconPermissionProvider` vào providers tree

## Cách sử dụng

### Sử dụng SmartHeaderActions (Khuyến nghị)
```tsx
import { SmartHeaderActions } from '@/components/layout/SmartHeaderActions';

// Tự động hiển thị icon theo role
<SmartHeaderActions variant="light" />
```

### Sử dụng HeaderActions với manual config
```tsx
import { HeaderActions } from '@/components/layout/HeaderActions';

<HeaderActions
  variant="light"
  showNotifications={true}  // External icon
  showApps={false}
  showChat={false}
  showUser={true}
  userConfig={{
    showNotifications: false,
    showApps: true,          // Trong dropdown
    showChat: true,
    showQuickActions: true,
  }}
/>
```

## Cấu hình preset theo role

| Role | Notifications | Apps | Chat | QuickActions |
|------|--------------|------|------|--------------|
| ADMIN | External | External | External | Dropdown |
| giangvien | External | Dropdown | Dropdown | Dropdown |
| USER | Dropdown | Dropdown | Dropdown | Dropdown |
| GUEST | Ẩn | Ẩn | Dropdown | Ẩn |

## Truy cập trang quản lý
- URL: `/admin/settings/icon-permissions`
- Quyền: Chỉ Admin
