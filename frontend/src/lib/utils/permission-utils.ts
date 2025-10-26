/**
 * Permission checking utility for navigation menu
 * Kiểm tra quyền truy cập menu dựa trên role và permissions của user
 */

export interface Permission {
  id: string;
  name: string;
  displayName: string;
  resource?: string;
  action?: string;
}

export interface Role {
  id: string;
  name: string;
  displayName: string;
  permissions?: Permission[];
}

export interface User {
  id: string;
  roleType?: string;
  email?: string;
  username?: string;
  roles?: Role[];
  permissions?: Permission[];
}

export interface MenuItem {
  id: string;
  title: string;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  isPublic?: boolean;
  route?: string | null;
  url?: string | null;
  externalUrl?: string | null;
  children?: MenuItem[];
}

/**
 * Get user's role names from their role assignments
 */
export function getUserRoleNames(user: User | null | undefined): string[] {
  if (!user) return [];
  
  const roleNames: string[] = [];
  
  // Add roleType (legacy)
  if (user.roleType) {
    roleNames.push(user.roleType);
    // Map ADMIN roleType to role names
    if (user.roleType === 'ADMIN') {
      roleNames.push('admin', 'super_admin');
    }
  }
  
  // Add assigned roles from database
  if (user.roles && Array.isArray(user.roles)) {
    user.roles.forEach(role => {
      if (role.name && !roleNames.includes(role.name)) {
        roleNames.push(role.name);
      }
    });
  }
  
  return roleNames;
}

/**
 * Get user's permission names from their direct permissions and roles
 */
export function getUserPermissionNames(user: User | null | undefined): string[] {
  if (!user) return [];
  
  const permissionNames: Set<string> = new Set();
  
  // Add direct user permissions
  if (user.permissions && Array.isArray(user.permissions)) {
    user.permissions.forEach(perm => {
      if (perm.name) {
        permissionNames.add(perm.name);
      }
    });
  }
  
  // Add permissions from roles
  if (user.roles && Array.isArray(user.roles)) {
    user.roles.forEach(role => {
      if (role.permissions && Array.isArray(role.permissions)) {
        role.permissions.forEach(perm => {
          if (perm.name) {
            permissionNames.add(perm.name);
          }
        });
      }
    });
  }
  
  return Array.from(permissionNames);
}

/**
 * Kiểm tra xem user có quyền truy cập menu item không
 * 
 * Rules:
 * 1. Nếu isPublic = true, cho phép truy cập
 * 2. Nếu requiredRoles rỗng và requiredPermissions rỗng, cho phép truy cập
 * 3. Nếu user.roleType = 'ADMIN' hoặc 'super_admin', cho phép truy cập tất cả
 * 4. Nếu có requiredRoles, user phải có ít nhất một role
 * 5. Nếu có requiredPermissions, user phải có ít nhất một permission
 */
export function canAccessMenuItem(
  user: User | null | undefined,
  menuItem: MenuItem
): boolean {
  // Nếu chưa đăng nhập
  if (!user) {
    return menuItem.isPublic === true;
  }

  // Super admin hoặc admin có quyền truy cập tất cả
  if (user.roleType === 'ADMIN' || user.roleType === 'super_admin') {
    return true;
  }

  // Nếu public, cho phép truy cập
  if (menuItem.isPublic === true) {
    return true;
  }

  // Nếu không có yêu cầu quyền, cho phép truy cập
  if (
    (!menuItem.requiredRoles || menuItem.requiredRoles.length === 0) &&
    (!menuItem.requiredPermissions || menuItem.requiredPermissions.length === 0)
  ) {
    return true;
  }

  // Get user's roles and permissions from database
  const userRoles = getUserRoleNames(user);
  const userPermissions = getUserPermissionNames(user);

  // Kiểm tra requiredRoles
  if (menuItem.requiredRoles && menuItem.requiredRoles.length > 0) {
    const hasRequiredRole = menuItem.requiredRoles.some(requiredRole => 
      userRoles.includes(requiredRole)
    );
    if (hasRequiredRole) {
      return true;
    }
  }

  // Kiểm tra requiredPermissions
  if (menuItem.requiredPermissions && menuItem.requiredPermissions.length > 0) {
    const hasRequiredPermission = menuItem.requiredPermissions.some(requiredPerm => 
      userPermissions.includes(requiredPerm)
    );
    if (hasRequiredPermission) {
      return true;
    }
  }

  return false;
}

/**
 * Lọc menu items dựa trên quyền của user
 * Recursive function để filter menu và submenu
 */
export function filterMenuByPermissions(
  menus: MenuItem[] | undefined | null,
  user: User | null | undefined
): MenuItem[] {
  if (!menus || !Array.isArray(menus)) {
    return [];
  }

  return menus
    .filter((item) => canAccessMenuItem(user, item))
    .map((item) => ({
      ...item,
      // Recursively filter children
      children: item.children
        ? filterMenuByPermissions(item.children, user)
        : undefined,
    }))
    .filter((item) => {
      // Nếu không có children sau filter, nhưng menu item đó không có URL
      // thì không hiển thị (ví dụ: menu group chỉ dùng để chứa submenu)
      if (
        item.children &&
        item.children.length === 0 &&
        !item.route &&
        !item.url &&
        !item.externalUrl
      ) {
        return false;
      }
      return true;
    });
}

/**
 * Debug function - in ra menu structure và quyền
 */
export function debugMenuPermissions(
  menus: MenuItem[] | undefined | null,
  user: User | null | undefined
): void {
  if (!menus) return;

  console.group('🔐 Menu Permissions Debug');
  
  // Show user info
  const userRoles = getUserRoleNames(user);
  const userPermissions = getUserPermissionNames(user);
  
  console.log('User:', {
    id: user?.id,
    email: user?.email,
    roleType: user?.roleType,
  });
  console.log('User Roles from DB:', user?.roles?.map(r => r.name));
  console.log('User Permissions from DB:', user?.permissions?.map(p => p.name));
  console.log('Computed Roles:', userRoles);
  console.log('Computed Permissions:', userPermissions);

  const checkMenu = (items: MenuItem[], level = 0) => {
    items.forEach((item) => {
      const canAccess = canAccessMenuItem(user, item);
      const indent = '  '.repeat(level);
      const status = canAccess ? '✅' : '❌';

      const requiredStr = [];
      if (item.requiredRoles?.length) requiredStr.push(`roles: [${item.requiredRoles.join(', ')}]`);
      if (item.requiredPermissions?.length) requiredStr.push(`perms: [${item.requiredPermissions.join(', ')}]`);
      
      console.log(
        `${indent}${status} ${item.title} (${requiredStr.join(', ') || 'public'})`
      );

      if (item.children) {
        checkMenu(item.children, level + 1);
      }
    });
  };

  checkMenu(menus);
  console.groupEnd();
}
