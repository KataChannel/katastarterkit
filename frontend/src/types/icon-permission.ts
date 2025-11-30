/**
 * Icon Permission Types
 * Hệ thống phân quyền hiển thị icon theo Role
 */

// Các loại icon có thể phân quyền
export type IconType = 
  | 'notifications'      // Icon thông báo
  | 'apps'               // Icon ứng dụng
  | 'chat'               // Icon chat hỗ trợ
  | 'user'               // Icon user menu
  | 'search'             // Icon tìm kiếm
  | 'settings'           // Icon cài đặt
  | 'cart'               // Icon giỏ hàng
  | 'quickActions';      // Quick actions trong dropdown

// Vị trí hiển thị icon
export type IconPosition = 'external' | 'dropdown' | 'both' | 'none';

// Cấu hình cho từng icon
export interface IconConfig {
  id: IconType;
  name: string;
  description: string;
  defaultPosition: IconPosition;
  defaultEnabled: boolean;
}

// Cấu hình permission cho từng icon theo role
export interface IconPermissionItem {
  iconType: IconType;
  position: IconPosition;    // 'external', 'dropdown', 'both', 'none'
  enabled: boolean;
}

// Cấu hình đầy đủ cho một role
export interface RoleIconPermission {
  roleId: string;
  roleName: string;
  roleDisplayName?: string;
  icons: IconPermissionItem[];
  inheritFromParent?: boolean;  // Kế thừa từ role cha
  updatedAt?: Date;
  updatedBy?: string;
}

// Cấu hình global cho toàn hệ thống
export interface IconPermissionConfig {
  roles: RoleIconPermission[];
  defaults: IconPermissionItem[];  // Cấu hình mặc định cho role không được định nghĩa
  guestConfig: IconPermissionItem[];  // Cấu hình cho khách
}

// Danh sách icon có thể cấu hình
export const CONFIGURABLE_ICONS: IconConfig[] = [
  {
    id: 'notifications',
    name: 'Thông báo',
    description: 'Icon chuông thông báo',
    defaultPosition: 'dropdown',
    defaultEnabled: true,
  },
  {
    id: 'apps',
    name: 'Ứng dụng',
    description: 'Menu chuyển đổi ứng dụng',
    defaultPosition: 'dropdown',
    defaultEnabled: true,
  },
  {
    id: 'chat',
    name: 'Hỗ trợ Chat',
    description: 'Widget chat hỗ trợ trực tuyến',
    defaultPosition: 'dropdown',
    defaultEnabled: true,
  },
  {
    id: 'quickActions',
    name: 'Quick Actions',
    description: 'Thanh hành động nhanh trong dropdown',
    defaultPosition: 'dropdown',
    defaultEnabled: true,
  },
  {
    id: 'user',
    name: 'User Menu',
    description: 'Menu người dùng',
    defaultPosition: 'external',
    defaultEnabled: true,
  },
  {
    id: 'search',
    name: 'Tìm kiếm',
    description: 'Ô tìm kiếm',
    defaultPosition: 'external',
    defaultEnabled: false,
  },
  {
    id: 'cart',
    name: 'Giỏ hàng',
    description: 'Icon giỏ hàng',
    defaultPosition: 'external',
    defaultEnabled: false,
  },
];

// Cấu hình mặc định
export const DEFAULT_ICON_PERMISSIONS: IconPermissionItem[] = [
  { iconType: 'notifications', position: 'dropdown', enabled: true },
  { iconType: 'apps', position: 'dropdown', enabled: true },
  { iconType: 'chat', position: 'dropdown', enabled: true },
  { iconType: 'quickActions', position: 'dropdown', enabled: true },
  { iconType: 'user', position: 'external', enabled: true },
  { iconType: 'search', position: 'none', enabled: false },
  { iconType: 'cart', position: 'none', enabled: false },
];

// Cấu hình cho guest
export const GUEST_ICON_PERMISSIONS: IconPermissionItem[] = [
  { iconType: 'notifications', position: 'none', enabled: false },
  { iconType: 'apps', position: 'none', enabled: false },
  { iconType: 'chat', position: 'dropdown', enabled: true },
  { iconType: 'quickActions', position: 'none', enabled: false },
  { iconType: 'user', position: 'external', enabled: true },
  { iconType: 'search', position: 'none', enabled: false },
  { iconType: 'cart', position: 'external', enabled: true },
];

// Preset cấu hình theo role phổ biến
export const ROLE_ICON_PRESETS: Record<string, IconPermissionItem[]> = {
  ADMIN: [
    { iconType: 'notifications', position: 'external', enabled: true },
    { iconType: 'apps', position: 'external', enabled: true },
    { iconType: 'chat', position: 'external', enabled: true },
    { iconType: 'quickActions', position: 'dropdown', enabled: true },
    { iconType: 'user', position: 'external', enabled: true },
  ],
  giangvien: [
    { iconType: 'notifications', position: 'external', enabled: true },
    { iconType: 'apps', position: 'dropdown', enabled: true },
    { iconType: 'chat', position: 'dropdown', enabled: true },
    { iconType: 'quickActions', position: 'dropdown', enabled: true },
    { iconType: 'user', position: 'external', enabled: true },
  ],
  USER: [
    { iconType: 'notifications', position: 'dropdown', enabled: true },
    { iconType: 'apps', position: 'dropdown', enabled: true },
    { iconType: 'chat', position: 'dropdown', enabled: true },
    { iconType: 'quickActions', position: 'dropdown', enabled: true },
    { iconType: 'user', position: 'external', enabled: true },
  ],
  content_manager: [
    { iconType: 'notifications', position: 'external', enabled: true },
    { iconType: 'apps', position: 'dropdown', enabled: true },
    { iconType: 'chat', position: 'dropdown', enabled: true },
    { iconType: 'quickActions', position: 'dropdown', enabled: true },
    { iconType: 'user', position: 'external', enabled: true },
  ],
};

// Helper function: Lấy cấu hình icon cho một role
export function getIconPermissionsForRole(
  roleName: string,
  config?: IconPermissionConfig
): IconPermissionItem[] {
  // Nếu có config custom
  if (config) {
    const roleConfig = config.roles.find(
      r => r.roleName.toLowerCase() === roleName.toLowerCase()
    );
    if (roleConfig) {
      return roleConfig.icons;
    }
    // Fallback to defaults in config
    return config.defaults;
  }
  
  // Sử dụng preset nếu có
  const preset = ROLE_ICON_PRESETS[roleName] || ROLE_ICON_PRESETS[roleName.toUpperCase()];
  if (preset) {
    return preset;
  }
  
  // Default
  return DEFAULT_ICON_PERMISSIONS;
}

// Helper function: Kiểm tra một icon có được phép hiển thị không
export function isIconAllowed(
  iconType: IconType,
  position: 'external' | 'dropdown',
  permissions: IconPermissionItem[]
): boolean {
  const iconPerm = permissions.find(p => p.iconType === iconType);
  if (!iconPerm || !iconPerm.enabled) return false;
  
  return iconPerm.position === position || iconPerm.position === 'both';
}

// Helper function: Merge nhiều role permissions (cho user có nhiều role)
export function mergeIconPermissions(
  rolePermissions: IconPermissionItem[][]
): IconPermissionItem[] {
  const merged: Map<IconType, IconPermissionItem> = new Map();
  
  // Default tất cả icons
  DEFAULT_ICON_PERMISSIONS.forEach(perm => {
    merged.set(perm.iconType, { ...perm });
  });
  
  // Override theo thứ tự role (role sau override role trước)
  rolePermissions.forEach(permissions => {
    permissions.forEach(perm => {
      const existing = merged.get(perm.iconType);
      if (existing) {
        // Nếu enabled và position rộng hơn thì override
        if (perm.enabled) {
          if (perm.position === 'both' || 
              (perm.position === 'external' && existing.position === 'dropdown') ||
              !existing.enabled) {
            merged.set(perm.iconType, { ...perm });
          }
        }
      } else {
        merged.set(perm.iconType, { ...perm });
      }
    });
  });
  
  return Array.from(merged.values());
}
