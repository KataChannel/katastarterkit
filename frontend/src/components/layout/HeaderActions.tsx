'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/usePermission';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Bell,
  Grid3X3,
  User,
  MessageCircle,
  Settings,
  LogOut,
  UserCircle,
  BookOpen,
  ShoppingCart,
  LayoutDashboard,
  Briefcase,
  Calculator,
  Workflow,
  GraduationCap,
  FileText,
  Shield,
  HelpCircle,
  ChevronRight,
  Users,
  Building,
  Headphones,
  Globe,
  type LucideIcon,
} from 'lucide-react';
import { NotificationBell } from '@/components/notifications/NotificationBell';

// ===================== TYPES =====================
export interface AppModule {
  id: string;
  name: string;
  description?: string;
  icon: LucideIcon | string;
  href: string;
  color?: string;
  // Permission-based access control
  roles?: string[];           // Allowed roles (empty = public)
  permissions?: {             // Required permission
    resource: string;
    action: string;
  }[];
  requireAuth?: boolean;      // Require login
  isPublic?: boolean;         // Override - always show
  isHidden?: boolean;         // Override - always hide
}

export interface UserMenuItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  href?: string;
  onClick?: () => void;
  roles?: string[];
  permissions?: {
    resource: string;
    action: string;
  }[];
  requireAuth?: boolean;
  isDivider?: boolean;
  variant?: 'default' | 'danger';
  children?: UserMenuItem[];
}

// ===================== DEFAULT CONFIGURATIONS =====================

// Default App Modules - Cấu hình theo cấu trúc thực tế của RauSach
export const DEFAULT_APP_MODULES: AppModule[] = [
  // === ADMIN MODULES ===
  {
    id: 'admin',
    name: 'Admin',
    description: 'Quản trị hệ thống',
    icon: Shield,
    href: '/admin',
    color: 'bg-red-500',
    roles: ['ADMIN'],
    requireAuth: true,
  },
  {
    id: 'admin-dashboard',
    name: 'Dashboard',
    description: 'Tổng quan hệ thống',
    icon: LayoutDashboard,
    href: '/admin/dashboard',
    color: 'bg-slate-600',
    roles: ['ADMIN'],
    requireAuth: true,
  },
  
  // === LMS MODULES ===
  {
    id: 'lms-admin',
    name: 'LMS Admin',
    description: 'Quản lý khóa học',
    icon: GraduationCap,
    href: '/lms/admin',
    color: 'bg-purple-500',
    roles: ['ADMIN', 'giangvien', 'content_manager'],
    requireAuth: true,
  },
  {
    id: 'lms-instructor',
    name: 'Giảng viên',
    description: 'Quản lý khóa học của tôi',
    icon: BookOpen,
    href: '/lms/instructor',
    color: 'bg-indigo-500',
    roles: ['ADMIN', 'giangvien'],
    requireAuth: true,
  },
  {
    id: 'lms-student',
    name: 'Học tập',
    description: 'Trang học viên',
    icon: GraduationCap,
    href: '/lms/student',
    color: 'bg-violet-500',
    requireAuth: true, // Tất cả user đăng nhập đều có thể học
  },
  
  // === BUSINESS MODULES ===
  {
    id: 'ketoan',
    name: 'Kế Toán',
    description: 'Quản lý tài chính',
    icon: Calculator,
    href: '/ketoan',
    color: 'bg-green-500',
    roles: ['ADMIN', 'accountant', 'kế_toán'],
    requireAuth: true,
  },
  {
    id: 'workflow',
    name: 'Workflow',
    description: 'Quy trình công việc',
    icon: Workflow,
    href: '/workflow',
    color: 'bg-blue-500',
    roles: ['ADMIN', 'manager', 'hr_manager'],
    requireAuth: true,
  },
  {
    id: 'callcenter',
    name: 'Call Center',
    description: 'Tổng đài hỗ trợ',
    icon: Headphones,
    href: '/admin/callcenter',
    color: 'bg-cyan-500',
    roles: ['ADMIN', 'support', 'callcenter'],
    requireAuth: true,
  },
  {
    id: 'hr',
    name: 'Nhân sự',
    description: 'Quản lý nhân sự',
    icon: Users,
    href: '/admin/hr',
    color: 'bg-amber-500',
    roles: ['ADMIN', 'hr_manager'],
    requireAuth: true,
  },
  
  // === CONTENT MODULES ===
  {
    id: 'blog',
    name: 'Blog',
    description: 'Quản lý bài viết',
    icon: FileText,
    href: '/admin/blog',
    color: 'bg-orange-500',
    roles: ['ADMIN', 'blog_manager', 'blog_editor', 'content_editor'],
    requireAuth: true,
  },
  {
    id: 'website',
    name: 'Website',
    description: 'Quản lý nội dung web',
    icon: Globe,
    href: '/admin/pagebuilder',
    color: 'bg-teal-500',
    roles: ['ADMIN', 'page_builder_manager', 'content_manager'],
    requireAuth: true,
  },
  
  // === ECOMMERCE MODULES ===
  {
    id: 'products',
    name: 'Sản phẩm',
    description: 'Quản lý sản phẩm',
    icon: ShoppingCart,
    href: '/admin/products',
    color: 'bg-pink-500',
    roles: ['ADMIN', 'product_manager', 'ecommerce_manager'],
    requireAuth: true,
  },
  {
    id: 'orders',
    name: 'Đơn hàng',
    description: 'Quản lý đơn hàng',
    icon: Briefcase,
    href: '/admin/orders',
    color: 'bg-rose-500',
    roles: ['ADMIN', 'order_manager', 'ecommerce_manager'],
    requireAuth: true,
  },
  {
    id: 'affiliate',
    name: 'Affiliate',
    description: 'Chương trình đối tác',
    icon: Building,
    href: '/admin/affiliate',
    color: 'bg-emerald-500',
    roles: ['ADMIN', 'affiliate_manager'],
    requireAuth: true,
  },
  
  // === PUBLIC MODULES ===
  {
    id: 'shop',
    name: 'Cửa hàng',
    description: 'Mua sắm trực tuyến',
    icon: ShoppingCart,
    href: '/san-pham',
    color: 'bg-pink-500',
    isPublic: true,
  },
  {
    id: 'courses',
    name: 'Khóa học',
    description: 'Danh sách khóa học',
    icon: BookOpen,
    href: '/lms/courses',
    color: 'bg-purple-400',
    isPublic: true,
  },
];

// Default User Menu Items - Menu cho người dùng đã đăng nhập
export const DEFAULT_USER_MENU_ITEMS: UserMenuItem[] = [
  {
    id: 'profile',
    label: 'Hồ sơ cá nhân',
    icon: UserCircle,
    href: '/admin/profile',
    requireAuth: true,
  },
  {
    id: 'dashboard',
    label: 'Bảng điều khiển',
    icon: LayoutDashboard,
    href: '/admin/dashboard',
    requireAuth: true,
    roles: ['ADMIN', 'content_manager', 'product_manager', 'order_manager'],
  },
  {
    id: 'my-courses',
    label: 'Khóa học của tôi',
    icon: BookOpen,
    href: '/lms/my-learning',
    requireAuth: true,
  },
  {
    id: 'my-certificates',
    label: 'Chứng chỉ của tôi',
    icon: GraduationCap,
    href: '/lms/my-certificates',
    requireAuth: true,
  },
  {
    id: 'orders',
    label: 'Đơn hàng của tôi',
    icon: Briefcase,
    href: '/don-hang',
    requireAuth: true,
  },
  { id: 'divider-1', label: '', isDivider: true },
  {
    id: 'instructor-dashboard',
    label: 'Giảng viên',
    icon: GraduationCap,
    href: '/lms/instructor',
    requireAuth: true,
    roles: ['ADMIN', 'giangvien'],
  },
  {
    id: 'admin-panel',
    label: 'Quản trị',
    icon: Shield,
    href: '/admin',
    requireAuth: true,
    roles: ['ADMIN'],
  },
  { id: 'divider-2', label: '', isDivider: true },
  {
    id: 'settings',
    label: 'Cài đặt',
    icon: Settings,
    href: '/admin/settings',
    requireAuth: true,
  },
  {
    id: 'help',
    label: 'Trợ giúp',
    icon: HelpCircle,
    href: '/help',
  },
  { id: 'divider-3', label: '', isDivider: true },
  {
    id: 'logout',
    label: 'Đăng xuất',
    icon: LogOut,
    variant: 'danger',
    requireAuth: true,
  },
];

// Guest Menu Items (not logged in)
export const DEFAULT_GUEST_MENU_ITEMS: UserMenuItem[] = [
  {
    id: 'login',
    label: 'Đăng nhập',
    icon: User,
    href: '/login',
  },
  {
    id: 'register',
    label: 'Đăng ký',
    icon: UserCircle,
    href: '/register',
  },
  { id: 'divider', label: '', isDivider: true },
  {
    id: 'courses',
    label: 'Khám phá khóa học',
    icon: BookOpen,
    href: '/lms/courses',
  },
  {
    id: 'help',
    label: 'Trợ giúp',
    icon: HelpCircle,
    href: '/help',
  },
];

// ===================== PRESET CONFIGURATIONS =====================

/**
 * Preset cho Admin Panel - Chỉ hiển thị các module quản trị
 */
export const ADMIN_APP_MODULES: AppModule[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin/dashboard',
    color: 'bg-slate-600',
    requireAuth: true,
  },
  {
    id: 'users',
    name: 'Users',
    icon: Users,
    href: '/admin/users',
    color: 'bg-blue-500',
    requireAuth: true,
  },
  {
    id: 'products',
    name: 'Sản phẩm',
    icon: ShoppingCart,
    href: '/admin/products',
    color: 'bg-pink-500',
    requireAuth: true,
  },
  {
    id: 'orders',
    name: 'Đơn hàng',
    icon: Briefcase,
    href: '/admin/orders',
    color: 'bg-rose-500',
    requireAuth: true,
  },
  {
    id: 'blog',
    name: 'Blog',
    icon: FileText,
    href: '/admin/blog',
    color: 'bg-orange-500',
    requireAuth: true,
  },
  {
    id: 'settings',
    name: 'Cài đặt',
    icon: Settings,
    href: '/admin/settings',
    color: 'bg-gray-500',
    requireAuth: true,
  },
];

/**
 * Preset cho LMS - Modules liên quan đến học tập
 */
export const LMS_APP_MODULES: AppModule[] = [
  {
    id: 'my-learning',
    name: 'Học tập',
    icon: BookOpen,
    href: '/lms/my-learning',
    color: 'bg-purple-500',
    requireAuth: true,
  },
  {
    id: 'courses',
    name: 'Khóa học',
    icon: GraduationCap,
    href: '/lms/courses',
    color: 'bg-indigo-500',
    isPublic: true,
  },
  {
    id: 'certificates',
    name: 'Chứng chỉ',
    icon: '🏆',
    href: '/lms/my-certificates',
    color: 'bg-amber-500',
    requireAuth: true,
  },
  {
    id: 'instructor',
    name: 'Giảng viên',
    icon: '👨‍🏫',
    href: '/lms/instructor',
    color: 'bg-green-500',
    roles: ['ADMIN', 'giangvien'],
    requireAuth: true,
  },
  {
    id: 'admin',
    name: 'Quản lý LMS',
    icon: Shield,
    href: '/lms/admin',
    color: 'bg-red-500',
    roles: ['ADMIN'],
    requireAuth: true,
  },
];

/**
 * Preset cho Instructor - Modules cho giảng viên
 */
export const INSTRUCTOR_APP_MODULES: AppModule[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: LayoutDashboard,
    href: '/lms/instructor',
    color: 'bg-slate-600',
    requireAuth: true,
  },
  {
    id: 'my-courses',
    name: 'Khóa học của tôi',
    icon: BookOpen,
    href: '/lms/instructor/courses',
    color: 'bg-purple-500',
    requireAuth: true,
  },
  {
    id: 'students',
    name: 'Học viên',
    icon: Users,
    href: '/lms/instructor/students',
    color: 'bg-blue-500',
    requireAuth: true,
  },
  {
    id: 'documents',
    name: 'Tài liệu',
    icon: FileText,
    href: '/lms/instructor/source-documents',
    color: 'bg-orange-500',
    requireAuth: true,
  },
  {
    id: 'analytics',
    name: 'Thống kê',
    icon: '📊',
    href: '/lms/instructor/analytics',
    color: 'bg-green-500',
    requireAuth: true,
  },
];

/**
 * Preset Menu cho Student
 */
export const STUDENT_USER_MENU: UserMenuItem[] = [
  {
    id: 'profile',
    label: 'Hồ sơ cá nhân',
    icon: UserCircle,
    href: '/admin/profile',
    requireAuth: true,
  },
  {
    id: 'my-learning',
    label: 'Đang học',
    icon: BookOpen,
    href: '/lms/my-learning',
    requireAuth: true,
  },
  {
    id: 'my-certificates',
    label: 'Chứng chỉ',
    icon: GraduationCap,
    href: '/lms/my-certificates',
    requireAuth: true,
  },
  {
    id: 'orders',
    label: 'Đơn hàng',
    icon: Briefcase,
    href: '/don-hang',
    requireAuth: true,
  },
  { id: 'divider', label: '', isDivider: true },
  {
    id: 'settings',
    label: 'Cài đặt',
    icon: Settings,
    href: '/admin/settings',
    requireAuth: true,
  },
  { id: 'divider-2', label: '', isDivider: true },
  {
    id: 'logout',
    label: 'Đăng xuất',
    icon: LogOut,
    variant: 'danger',
    requireAuth: true,
  },
];

/**
 * Preset Menu cho Instructor
 */
export const INSTRUCTOR_USER_MENU: UserMenuItem[] = [
  {
    id: 'profile',
    label: 'Hồ sơ giảng viên',
    icon: UserCircle,
    href: '/lms/instructor/profile',
    requireAuth: true,
  },
  {
    id: 'my-courses',
    label: 'Khóa học của tôi',
    icon: BookOpen,
    href: '/lms/instructor/courses',
    requireAuth: true,
  },
  {
    id: 'students',
    label: 'Học viên',
    icon: Users,
    href: '/lms/instructor/students',
    requireAuth: true,
  },
  {
    id: 'earnings',
    label: 'Thu nhập',
    icon: Calculator,
    href: '/lms/instructor/earnings',
    requireAuth: true,
  },
  { id: 'divider', label: '', isDivider: true },
  {
    id: 'settings',
    label: 'Cài đặt',
    icon: Settings,
    href: '/admin/settings',
    requireAuth: true,
  },
  { id: 'divider-2', label: '', isDivider: true },
  {
    id: 'logout',
    label: 'Đăng xuất',
    icon: LogOut,
    variant: 'danger',
    requireAuth: true,
  },
];

// ===================== PROPS INTERFACE =====================
export interface UserDropdownConfig {
  showNotifications?: boolean;  // Hiển thị nút Thông báo trong dropdown
  showApps?: boolean;           // Hiển thị nút Ứng dụng trong dropdown
  showChat?: boolean;           // Hiển thị nút Chat trong dropdown
  showQuickActions?: boolean;   // Hiển thị row Quick Actions (Thông báo, Ứng dụng, Chat)
}

interface HeaderActionsProps {
  variant?: 'light' | 'dark';
  // Icons hiển thị riêng biệt bên ngoài (trước User icon)
  showNotifications?: boolean;  // Icon Bell riêng
  showApps?: boolean;           // Icon Grid riêng
  showChat?: boolean;           // Icon Chat riêng
  showUser?: boolean;           // User avatar/dropdown
  className?: string;
  // User dropdown config - cấu hình bên trong dropdown
  userConfig?: UserDropdownConfig;
  // Dynamic configurations
  appModules?: AppModule[];
  userMenuItems?: UserMenuItem[];
  guestMenuItems?: UserMenuItem[];
  // Callbacks
  onLogout?: () => Promise<void>;
  onChatClick?: () => void;
}

// Default user dropdown config
const DEFAULT_USER_CONFIG: UserDropdownConfig = {
  showNotifications: true,
  showApps: true,
  showChat: true,
  showQuickActions: true,
};

// ===================== COMPONENT =====================
export function HeaderActions({
  variant = 'light',
  showNotifications = false,  // Mặc định ẩn icons bên ngoài
  showApps = false,
  showChat = false,
  showUser = true,
  className = '',
  userConfig = DEFAULT_USER_CONFIG,
  appModules = DEFAULT_APP_MODULES,
  userMenuItems = DEFAULT_USER_MENU_ITEMS,
  guestMenuItems = DEFAULT_GUEST_MENU_ITEMS,
  onLogout,
  onChatClick,
}: HeaderActionsProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { hasRole, hasAnyRole } = useRole();
  const router = useRouter();
  const [appsPopoverOpen, setAppsPopoverOpen] = useState(false);

  // Merge user config với defaults
  const config = { ...DEFAULT_USER_CONFIG, ...userConfig };

  const isDark = variant === 'dark';
  const textColor = isDark ? 'text-white' : 'text-gray-700';
  const hoverBg = isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100';
  const iconColor = isDark ? 'text-gray-300' : 'text-gray-500';

  // Handle logout
  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    } else {
      await logout();
      router.push('/');
    }
  };

  // Helper: Check if user has any of the specified roles
  // Supports both roleType (ADMIN, USER) and RBAC roles (giangvien, content_manager)
  const checkUserRoles = (allowedRoles: string[]): boolean => {
    if (!user) return false;
    
    // Check system roleType (ADMIN, USER, GUEST)
    const userRoleType = user.roleType || '';
    if (allowedRoles.includes(userRoleType)) {
      return true;
    }
    
    // Check RBAC roles from user.roles array
    if (user.roles && user.roles.length > 0) {
      const userRoleNames = user.roles.map((r: any) => r.name?.toLowerCase() || r.role?.name?.toLowerCase());
      const hasMatchingRole = allowedRoles.some(role => 
        userRoleNames.includes(role.toLowerCase())
      );
      if (hasMatchingRole) return true;
    }
    
    // Also check via useRole hook for additional RBAC roles
    if (hasAnyRole(allowedRoles)) {
      return true;
    }
    
    return false;
  };

  // Check if user has access to a module
  const hasModuleAccess = (module: AppModule): boolean => {
    // Hidden modules are never shown
    if (module.isHidden) return false;
    
    // Public modules are always shown
    if (module.isPublic) return true;
    
    // Check authentication requirement
    if (module.requireAuth && !isAuthenticated) return false;
    
    // If no specific roles required but auth is required, show for all authenticated users
    if (!module.roles || module.roles.length === 0) {
      return module.requireAuth ? isAuthenticated : true;
    }
    
    // Check role-based access
    return checkUserRoles(module.roles);
  };

  // Check if user has access to a menu item
  const hasMenuItemAccess = (item: UserMenuItem): boolean => {
    // Dividers are always shown
    if (item.isDivider) return true;
    
    // Check authentication requirement
    if (item.requireAuth && !isAuthenticated) return false;
    
    // If no specific roles required but auth is required, show for all authenticated users
    if (!item.roles || item.roles.length === 0) {
      return item.requireAuth ? isAuthenticated : true;
    }
    
    // Check role-based access
    return checkUserRoles(item.roles);
  };

  // Filter modules based on permissions
  const availableModules = useMemo(() => {
    return appModules.filter(hasModuleAccess);
  }, [appModules, isAuthenticated, user?.roleType]);

  // Filter user menu items based on permissions
  const filteredUserMenuItems = useMemo(() => {
    return userMenuItems.filter(hasMenuItemAccess);
  }, [userMenuItems, isAuthenticated, user?.roleType]);

  // Render icon (support both LucideIcon and string emoji)
  const renderIcon = (icon: LucideIcon | string, className?: string) => {
    if (typeof icon === 'string') {
      return <span className={className}>{icon}</span>;
    }
    const Icon = icon;
    return <Icon className={className} />;
  };

  // Handle menu item click
  const handleMenuItemClick = (item: UserMenuItem) => {
    if (item.id === 'logout') {
      handleLogout();
    } else if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  // Handle chat click
  const handleChatClick = () => {
    if (onChatClick) {
      onChatClick();
    } else {
      // Default: dispatch custom event
      window.dispatchEvent(new CustomEvent('toggleSupportChat'));
    }
  };

  return (
    <div className={`flex items-center gap-1 sm:gap-2 ${className}`}>
      {/* 1. Notifications Bell - Icon riêng bên ngoài */}
      {showNotifications && isAuthenticated && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`[&_button]:${iconColor} [&_button:hover]:${isDark ? 'text-white' : 'text-gray-900'} [&_button]:${hoverBg}`}>
                <NotificationBell />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Thông báo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* 2. More Apps - Icon riêng bên ngoài */}
      {showApps && availableModules.length > 0 && (
        <Popover>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-9 w-9 p-0 ${iconColor} ${hoverBg}`}
                  >
                    <Grid3X3 className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ứng dụng</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-gray-900">Chuyển đổi ứng dụng</h4>
              <div className="grid grid-cols-3 gap-3">
                {availableModules.map((module) => (
                  <Link
                    key={module.id}
                    href={module.href}
                    className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 transition-colors group"
                    title={module.description}
                  >
                    <div className={`w-10 h-10 rounded-xl ${module.color || 'bg-gray-500'} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                      {renderIcon(module.icon, 'w-5 h-5 text-white')}
                    </div>
                    <span className="text-xs font-medium text-gray-700 text-center line-clamp-2">
                      {module.name}
                    </span>
                  </Link>
                ))}
              </div>
              {isAuthenticated && (
                <div className="border-t pt-3">
                  <Link
                    href="/admin/settings"
                    className="flex items-center justify-between text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Cài đặt chung
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* 3. User Menu - Only Icon with Dynamic Avatar */}
      {showUser && (
        <DropdownMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-9 w-9 p-0 ${hoverBg} relative`}
                  >
                    {isAuthenticated && user ? (
                      // Avatar động khi đã đăng nhập
                      (user as any).avatar ? (
                        <img 
                          src={(user as any).avatar} 
                          alt={user.username || 'User'}
                          className="w-7 h-7 rounded-full object-cover ring-2 ring-offset-1 ring-purple-500/30"
                        />
                      ) : (
                        <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-offset-1 ring-purple-500/30">
                          <span className="text-white text-xs font-semibold">
                            {user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      )
                    ) : (
                      // Icon mặc định khi chưa đăng nhập
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <User className={`h-4 w-4 ${iconColor}`} />
                      </div>
                    )}
                    {/* Online indicator khi đã đăng nhập */}
                    {isAuthenticated && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isAuthenticated ? (user?.username || 'Tài khoản') : 'Đăng nhập'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenuContent className="w-64" align="end">
            {isAuthenticated && user ? (
              <>
                {/* User Info Header */}
                <DropdownMenuLabel className="font-normal pb-3">
                  <div className="flex items-center gap-3">
                    {(user as any).avatar ? (
                      <img 
                        src={(user as any).avatar} 
                        alt={user.username || 'User'}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col flex-1 min-w-0">
                      <p className="text-sm font-semibold leading-none truncate">{user.username || 'User'}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
                      <Badge variant="secondary" className="w-fit mt-1.5 text-[10px] px-1.5 py-0">
                        {user.roleType || 'USER'}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Quick Actions - Notifications, Apps, Chat */}
                {config.showQuickActions && (config.showNotifications || config.showApps || config.showChat) && (
                  <>
                    <div className="px-2 py-2">
                      <div className="flex items-center justify-around gap-1">
                        {config.showNotifications && (
                          <button
                            onClick={() => router.push('/admin/notifications')}
                            className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 transition-colors flex-1"
                          >
                            <Bell className="h-5 w-5 text-gray-600" />
                            <span className="text-[10px] text-gray-500">Thông báo</span>
                          </button>
                        )}
                        {config.showApps && availableModules.length > 0 && (
                          <Popover open={appsPopoverOpen} onOpenChange={setAppsPopoverOpen}>
                            <PopoverTrigger asChild>
                              <button
                                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 transition-colors flex-1"
                              >
                                <Grid3X3 className="h-5 w-5 text-gray-600" />
                                <span className="text-[10px] text-gray-500">Ứng dụng</span>
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-4" align="end" side="left">
                              <div className="space-y-3">
                                <h4 className="font-semibold text-sm text-gray-900">Chuyển đổi ứng dụng</h4>
                                <div className="grid grid-cols-3 gap-3">
                                  {availableModules.map((module) => (
                                    <Link
                                      key={module.id}
                                      href={module.href}
                                      onClick={() => setAppsPopoverOpen(false)}
                                      className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 transition-colors group"
                                      title={module.description}
                                    >
                                      <div className={`w-10 h-10 rounded-xl ${module.color || 'bg-gray-500'} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                                        {renderIcon(module.icon, 'w-5 h-5 text-white')}
                                      </div>
                                      <span className="text-xs font-medium text-gray-700 text-center line-clamp-2">
                                        {module.name}
                                      </span>
                                    </Link>
                                  ))}
                                </div>
                                <div className="border-t pt-3">
                                  <Link
                                    href="/admin/settings"
                                    onClick={() => setAppsPopoverOpen(false)}
                                    className="flex items-center justify-between text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                  >
                                    <span className="flex items-center gap-2">
                                      <Settings className="w-4 h-4" />
                                      Cài đặt chung
                                    </span>
                                    <ChevronRight className="w-4 h-4" />
                                  </Link>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                        {config.showChat && (
                          <button
                            onClick={handleChatClick}
                            className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 transition-colors flex-1 relative"
                          >
                            <MessageCircle className="h-5 w-5 text-gray-600" />
                            <span className="text-[10px] text-gray-500">Hỗ trợ</span>
                            <span className="absolute top-1 right-3 w-2 h-2 bg-green-500 rounded-full" />
                          </button>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                  </>
                )}
                
                {/* Menu Items */}
                {filteredUserMenuItems.map((item) => {
                  if (item.isDivider) {
                    return <DropdownMenuSeparator key={item.id} />;
                  }
                  
                  const Icon = item.icon;
                  const variantClass = item.variant === 'danger' 
                    ? 'text-red-600 focus:text-red-600 focus:bg-red-50' 
                    : '';
                  
                  return (
                    <DropdownMenuItem
                      key={item.id}
                      onClick={() => handleMenuItemClick(item)}
                      className={`cursor-pointer ${variantClass}`}
                    >
                      {Icon && <Icon className="mr-2 h-4 w-4" />}
                      {item.label}
                    </DropdownMenuItem>
                  );
                })}
              </>
            ) : (
              <>
                {/* Guest Header */}
                <DropdownMenuLabel className="font-normal pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold">Khách</p>
                      <p className="text-xs text-muted-foreground">Chưa đăng nhập</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {guestMenuItems.map((item) => {
                  if (item.isDivider) {
                    return <DropdownMenuSeparator key={item.id} />;
                  }
                  
                  const Icon = item.icon;
                  
                  return (
                    <DropdownMenuItem
                      key={item.id}
                      onClick={() => handleMenuItemClick(item)}
                      className="cursor-pointer"
                    >
                      {Icon && <Icon className="mr-2 h-4 w-4" />}
                      {item.label}
                    </DropdownMenuItem>
                  );
                })}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* 4. Support Chat Widget - Icon riêng bên ngoài */}
      {showChat && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`h-9 w-9 p-0 ${iconColor} ${hoverBg} relative`}
                onClick={handleChatClick}
              >
                <MessageCircle className="h-5 w-5" />
                {/* Online indicator */}
                <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full border border-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Hỗ trợ trực tuyến</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
