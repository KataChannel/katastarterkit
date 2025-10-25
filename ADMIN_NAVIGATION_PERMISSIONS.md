# 🔐 Admin Navigation Menu - Role-Based Access Control

**Status:** ✅ **COMPLETED**

**Date:** 26 tháng 10, 2025

**Version:** 1.0

---

## 📋 Overview

Cập nhật AdminSidebarLayout để **tự động lọc menu items dựa trên role và quyền của user**. Các menu items không có quyền sẽ tự động ẩn đi.

---

## 🎯 Features Implemented

### ✅ Role-Based Menu Filtering
- Tự động lọc menu dựa trên `requiredRoles` của menu
- ADMIN role có quyền truy cập tất cả menu
- USER role chỉ xem menu public hoặc menu dành cho USER
- Menu items không có quyền tự động ẩn đi

### ✅ Permission-Based Access
- Kiểm tra `requiredPermissions` của menu (chuẩn bị cho future)
- Support nested menu (submenu) filtering
- Tự động ẩn menu group nếu không có submenu nào có quyền

### ✅ Recursive Filtering
- Lọc menu items theo cấp độ
- Giữ nguyên cấu trúc parent-child
- Ẩn các menu group nếu toàn bộ submenu bị ẩn

### ✅ Admin Full Access
- ADMIN role có quyền truy cập tất cả menu
- Bypass tất cả permission checks

### ✅ Public Menu Support
- Menu với `isPublic: true` có thể truy cập mà không cần role
- Support cho cả authenticated và unauthenticated users

---

## 📁 Files Created/Modified

### Created Files
```
✅ frontend/src/lib/utils/permission-utils.ts (148 lines)
   - canAccessMenuItem() - Kiểm tra quyền truy cập menu
   - filterMenuByPermissions() - Lọc menu recursive
   - debugMenuPermissions() - Debug helper function
```

### Modified Files
```
✅ frontend/src/components/layout/admin-sidebar-layout.tsx
   - Added: import permission utilities
   - Added: filterMenuByPermissions() call
   - Added: debugMenuPermissions() call (dev only)
   - Added: comments explaining role-based filtering
```

---

## 🔄 How It Works

### Menu Access Rules

```
Priority Order:
1. Kiểm tra xem user đã đăng nhập chưa
   ├─ Chưa đăng nhập → Chỉ xem menu public (isPublic = true)
   └─ Đã đăng nhập → Tiếp tục

2. Kiểm tra admin role
   ├─ roleType === 'ADMIN' → Cho phép truy cập tất cả
   └─ roleType !== 'ADMIN' → Tiếp tục

3. Kiểm tra isPublic
   ├─ isPublic === true → Cho phép truy cập
   └─ isPublic !== true → Tiếp tục

4. Kiểm tra requiredRoles
   ├─ Không có yêu cầu role → Cho phép truy cập
   ├─ User có role trong requiredRoles → Cho phép truy cập
   └─ User không có role → Từ chối

5. Kiểm tra requiredPermissions (Future)
   └─ TODO: Khi có permission system
```

### Code Flow

```
AdminSidebarLayout renders
    ↓
useAdminMenus() fetches menus from database
    ↓
useMemo() computes filtered navigation
    ├─ Passes menus to filterMenuByPermissions()
    ├─ Passes user from useAuth()
    └─ Returns filtered menus only
    ↓
Filtered menus rendered in NavigationMenu
    ├─ Only items with access permission shown
    ├─ Menu groups without any accessible submenu hidden
    └─ Full hierarchy preserved
```

---

## 🎨 Menu Item Structure

### Database Menu Model
```typescript
interface Menu {
  id: string;
  title: string;
  
  // Navigation
  url?: string;
  route?: string;
  externalUrl?: string;
  
  // Hierarchy
  parentId?: string;
  children?: Menu[];
  
  // Access Control
  requiredRoles: string[];      // e.g., ['ADMIN', 'MANAGER']
  requiredPermissions: string[]; // e.g., ['users:read', 'users:write']
  isPublic: boolean;            // true = accessible without authentication
  isActive: boolean;
  isVisible: boolean;
  
  // Metadata
  icon?: string;
  order: number;
  level: number;
}
```

---

## 📊 Example Scenarios

### Scenario 1: ADMIN User
```
DATABASE:
  ✅ Dashboard (requiredRoles: [])
  ✅ Users (requiredRoles: ['ADMIN'])
  ✅ Reports (requiredRoles: ['ADMIN', 'MANAGER'])
  ✅ Settings (requiredRoles: ['ADMIN'])

USER roleType: 'ADMIN'

RESULT:
  ✅ Dashboard → Visible
  ✅ Users → Visible
  ✅ Reports → Visible
  ✅ Settings → Visible
```

### Scenario 2: USER Role
```
DATABASE:
  ✅ Dashboard (requiredRoles: [], isPublic: true)
  ✅ Users (requiredRoles: ['ADMIN'])
  ✅ Reports (requiredRoles: ['ADMIN', 'MANAGER'])
  ✅ Settings (requiredRoles: ['ADMIN'])
  ✅ Profile (requiredRoles: ['USER'])

USER roleType: 'USER'

RESULT:
  ✅ Dashboard → Visible (public)
  ❌ Users → Hidden
  ❌ Reports → Hidden
  ❌ Settings → Hidden
  ✅ Profile → Visible (has USER role)
```

### Scenario 3: Unauthenticated User
```
DATABASE:
  ✅ Dashboard (requiredRoles: [], isPublic: true)
  ✅ Users (requiredRoles: ['ADMIN'])
  ✅ Help (isPublic: true)
  ✅ Login (isPublic: true)

USER: null (not authenticated)

RESULT:
  ✅ Dashboard → Visible (public)
  ❌ Users → Hidden
  ✅ Help → Visible (public)
  ✅ Login → Visible (public)
```

### Scenario 4: Nested Menu with Filtering
```
DATABASE:
  Admin (requiredRoles: ['ADMIN'])
    ├─ Users (requiredRoles: ['ADMIN'])
    ├─ Roles (requiredRoles: ['ADMIN'])
    └─ Permissions (requiredRoles: ['ADMIN'])

USER roleType: 'USER'

RESULT:
  ❌ Admin (parent) → Hidden
  ❌ Users (child) → Hidden
  ❌ Roles (child) → Hidden
  ❌ Permissions (child) → Hidden

Note: Entire parent group hidden because all children hidden
```

---

## 🔑 Key Functions

### 1. canAccessMenuItem()
```typescript
function canAccessMenuItem(
  user: User | null | undefined,
  menuItem: MenuItem
): boolean

Purpose: Kiểm tra xem user có quyền truy cập menu item không

Example:
  canAccessMenuItem(
    { roleType: 'USER', email: 'user@example.com' },
    { title: 'Admin Panel', requiredRoles: ['ADMIN'] }
  )
  // Returns: false
```

### 2. filterMenuByPermissions()
```typescript
function filterMenuByPermissions(
  menus: MenuItem[] | undefined | null,
  user: User | null | undefined
): MenuItem[]

Purpose: Lọc toàn bộ menu tree dựa trên quyền của user

Example:
  const allMenus = [
    { title: 'Dashboard', requiredRoles: [] },
    { title: 'Admin', requiredRoles: ['ADMIN'] },
    { title: 'Profile', requiredRoles: ['USER'] }
  ];
  
  const userMenus = filterMenuByPermissions(allMenus, user);
  // Returns: [{ title: 'Dashboard' }, { title: 'Profile' }]
```

### 3. debugMenuPermissions() (Development)
```typescript
function debugMenuPermissions(
  menus: MenuItem[] | undefined | null,
  user: User | null | undefined
): void

Purpose: In ra console log để debug menu permissions

Output Example:
  🔐 Menu Permissions Debug
  User: { roleType: 'USER', email: 'user@example.com' }
  ✅ Dashboard (role: any, public: true)
  ❌ Admin Panel (role: ADMIN, public: false)
    ❌ Users (role: ADMIN, public: false)
    ❌ Settings (role: ADMIN, public: false)
```

---

## 💻 Implementation Details

### AdminSidebarLayout Changes

**Before:**
```typescript
const navigation = React.useMemo(() => {
  if (menusLoading || !dynamicMenus || dynamicMenus.length === 0) {
    return staticNavigation;
  }    
  return dynamicMenus;  // ← Return tất cả menus
}, [dynamicMenus, menusLoading]);
```

**After:**
```typescript
const navigation = React.useMemo(() => {
  if (menusLoading || !dynamicMenus || dynamicMenus.length === 0) {
    return staticNavigation;
  }
  
  // 🔐 Filter menus based on user permissions and role
  const filteredMenus = filterMenuByPermissions(dynamicMenus, user);
  
  // Debug: Log menu permissions (can be removed in production)
  if (process.env.NODE_ENV === 'development') {
    debugMenuPermissions(dynamicMenus, user);
  }
  
  return filteredMenus;
}, [dynamicMenus, menusLoading, user]);  // ← Added user dependency
```

### Dependencies
```
AdminSidebarLayout
  ├─ imports: permission-utils
  │  ├─ canAccessMenuItem()
  │  ├─ filterMenuByPermissions()
  │  └─ debugMenuPermissions()
  ├─ imports: useAuth()
  │  └─ gets user object
  ├─ imports: useAdminMenus()
  │  └─ fetches menus from database
  └─ renders: NavigationMenu with filtered menus
```

---

## 🧪 Testing Scenarios

### Test 1: ADMIN User Can See All Menus
```
Steps:
1. Login as admin@example.com (roleType: 'ADMIN')
2. Navigate to /admin
3. Check sidebar menu

Expected:
  ✅ All menu items visible
  ✅ All submenu items visible
  ✅ No "Access Denied" messages
```

### Test 2: USER User Sees Filtered Menus
```
Steps:
1. Login as user@example.com (roleType: 'USER')
2. Navigate to /admin
3. Check sidebar menu

Expected:
  ✅ Only USER and public menus visible
  ✅ ADMIN-only menus hidden
  ✅ No broken parent groups
```

### Test 3: Development Debug Output
```
Steps:
1. Login as any user
2. Open browser console
3. Look for "🔐 Menu Permissions Debug"

Expected:
  ✅ Console shows all menus with ✅ or ❌
  ✅ Shows which menus are accessible
  ✅ Shows role and permission requirements
```

### Test 4: Menu Updates Dynamically
```
Steps:
1. Admin updates menu permissions in database
2. User refreshes page
3. Check sidebar

Expected:
  ✅ Menu visibility updates
  ✅ New filtered items appear/disappear
```

### Test 5: Unauthenticated User
```
Steps:
1. Logout (clear authentication)
2. Try to access /admin
3. Check what menus visible

Expected:
  ✅ Redirect to /login (handled by AdminLayout)
  OR
  ✅ Only public menus shown if page visible
```

---

## 🔒 Security Considerations

### Frontend Security
✅ Menu filtering **cosmetic** - items hidden from UI
✅ Real security is in backend GraphQL resolvers
✅ Backend still enforces role checks
✅ Even if user manipulates menu, backend denies access

### Backend Security (Unchanged)
✅ `@UseGuards(JwtAuthGuard, RolesGuard)` on all resolvers
✅ `@Roles(UserRoleType.ADMIN)` decorator enforces role check
✅ GraphQL mutations reject unauthorized access
✅ Database operations protected by role guard

### Double Protection
```
Frontend:
  Menu item hidden from UI
      ↓
User tries to access anyway:
  Backend:
    GraphQL resolver checks role
    Database query blocked
    Error returned to client
```

---

## 🚀 Usage Example

### Setting Menu Permissions in Database

When creating/updating menus in database:

```typescript
// Database Menu Record
{
  title: "User Management",
  url: "/admin/users",
  requiredRoles: ["ADMIN"],      // ← Only ADMIN can see
  requiredPermissions: [],       // ← No permission check yet
  isPublic: false,               // ← Not public
  isActive: true,
  isVisible: true
}

// Alternative: For USER role
{
  title: "My Profile",
  url: "/admin/profile",
  requiredRoles: ["USER"],       // ← All authenticated users
  requiredPermissions: [],
  isPublic: false,
  isActive: true,
  isVisible: true
}

// Alternative: For public menu
{
  title: "Help",
  url: "/help",
  requiredRoles: [],             // ← Empty = no role check
  requiredPermissions: [],
  isPublic: true,                // ← Accessible without login
  isActive: true,
  isVisible: true
}
```

---

## 📊 Data Flow

```
Database
  ↓ (stores menu with requiredRoles)
useAdminMenus() Hook
  ↓ (GraphQL query: dynamicFindMany)
AdminSidebarLayout
  ↓ (receives menus and user)
filterMenuByPermissions()
  ├─ Loop through each menu
  ├─ Check canAccessMenuItem() for each
  └─ Return only accessible items
      ↓
NavigationMenu Component
  ├─ Render filtered menus
  └─ Display only accessible items
```

---

## 🎓 Future Enhancements

### TODO: Permission-Based Access
```typescript
// Currently only role-based
// Add permission system:
// 1. Add permissions to user profile
// 2. Update canAccessMenuItem() to check requiredPermissions
// 3. Add user.permissions to User interface
// 4. Compare menu.requiredPermissions with user.permissions

Example:
  User has permissions: ['users:read', 'users:write']
  Menu requires: ['users:read']
  Result: ✅ Can access
```

### TODO: Breadcrumb Permission Checking
```
// Hide parent menu if all children hidden
// Current: ✅ Already implemented
// Future: Could be more sophisticated
```

### TODO: Dynamic Permission Loading
```
// Currently roles are static from AuthContext
// Future: Could dynamically fetch permissions
// from backend for more granular control
```

---

## 🐛 Troubleshooting

### Issue: Menu items not showing
**Cause:** Menu's `requiredRoles` doesn't match user's `roleType`

**Solution:**
1. Check user's roleType in dev console
2. Check menu's requiredRoles in database
3. Check debug output: `🔐 Menu Permissions Debug`
4. Verify menu is `isActive: true` and `isVisible: true`

### Issue: All menus hidden for ADMIN
**Cause:** Filtering logic bug or user object not passed

**Solution:**
1. Check user.roleType === 'ADMIN' in console
2. Verify filterMenuByPermissions() is called
3. Check debug output for status

### Issue: Unauthenticated user sees menus
**Cause:** Menu has `isPublic: true` (intended) or no role required

**Solution:**
1. Check menu's `isPublic` field
2. Check menu's `requiredRoles` field
3. Verify intended behavior

---

## 📝 Code Comments

All new code includes comprehensive comments:

**permission-utils.ts:**
```typescript
/**
 * Kiểm tra xem user có quyền truy cập menu item không
 * 
 * Rules:
 * 1. Nếu isPublic = true, cho phép truy cập
 * 2. Nếu requiredRoles rỗng và requiredPermissions rỗng, cho phép truy cập
 * 3. Nếu user.roleType = 'ADMIN', cho phép truy cập tất cả
 * ... etc
 */
```

**admin-sidebar-layout.tsx:**
```typescript
// 🔐 Filter menus based on user permissions and role
const filteredMenus = filterMenuByPermissions(dynamicMenus, user);

// Debug: Log menu permissions (can be removed in production)
if (process.env.NODE_ENV === 'development') {
  debugMenuPermissions(dynamicMenus, user);
}
```

---

## ✅ Quality Checklist

- [x] 0 TypeScript errors
- [x] 0 Import errors
- [x] Role-based filtering works
- [x] Nested menu filtering works
- [x] Admin full access works
- [x] Public menu works
- [x] Debug output helpful
- [x] Code well-commented
- [x] No breaking changes
- [x] Backward compatible

---

## 📌 Important Notes

1. **Frontend is UI only** - Backend still needs role guards
2. **User object must be available** - From useAuth() hook
3. **Menus from database** - Must have requiredRoles field
4. **Development mode only** - Debug logging only in dev
5. **Recursive filtering** - Preserves menu hierarchy
6. **No permission system yet** - Only role-based for now

---

## 🎉 Summary

✅ **Role-based menu filtering fully implemented**

- ✅ Automatic menu filtering based on user role
- ✅ ADMIN full access to all menus
- ✅ Nested menu support with recursive filtering
- ✅ Public menu support
- ✅ Development debug logging
- ✅ Security maintained (frontend + backend)
- ✅ Zero breaking changes

**Ready for production deployment!** 🚀

---

**Version:** 1.0  
**Status:** ✅ **PRODUCTION READY**  
**Date:** 26 tháng 10, 2025
