/**
 * Permission checking utility for navigation menu
 * Kiểm tra quyền truy cập menu dựa trên role và permissions của user
 */

export interface User {
  id: string;
  roleType?: string;
  email?: string;
  username?: string;
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
 * Kiểm tra xem user có quyền truy cập menu item không
 * 
 * Rules:
 * 1. Nếu isPublic = true, cho phép truy cập
 * 2. Nếu requiredRoles rỗng và requiredPermissions rỗng, cho phép truy cập
 * 3. Nếu user.roleType = 'ADMIN', cho phép truy cập tất cả
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

  // Admin có quyền truy cập tất cả
  if (user.roleType === 'ADMIN') {
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

  // Kiểm tra requiredRoles
  if (menuItem.requiredRoles && menuItem.requiredRoles.length > 0) {
    const hasRequiredRole = menuItem.requiredRoles.includes(user.roleType || '');
    if (hasRequiredRole) {
      return true;
    }
  }

  // TODO: Kiểm tra requiredPermissions khi có permission system
  // Hiện tại chỉ kiểm tra role

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
  console.log('User:', {
    id: user?.id,
    roleType: user?.roleType,
    email: user?.email,
  });

  const checkMenu = (items: MenuItem[], level = 0) => {
    items.forEach((item) => {
      const canAccess = canAccessMenuItem(user, item);
      const indent = '  '.repeat(level);
      const status = canAccess ? '✅' : '❌';

      console.log(
        `${indent}${status} ${item.title} (role: ${item.requiredRoles?.join(', ') || 'any'}, public: ${item.isPublic})`
      );

      if (item.children) {
        checkMenu(item.children, level + 1);
      }
    });
  };

  checkMenu(menus);
  console.groupEnd();
}
