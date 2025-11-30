/**
 * HeaderActions Example Usage - RauSach
 * 
 * Ví dụ cách sử dụng HeaderActions với dynamic menu và phân quyền
 * Dựa trên cấu trúc thực tế của dự án RauSach
 * 
 * Roles trong hệ thống:
 * - ADMIN: Quản trị viên hệ thống (roleType)
 * - USER: Người dùng thông thường (roleType)
 * - giangvien: Giảng viên LMS (RBAC role)
 * - content_manager: Quản lý nội dung
 * - content_editor: Biên tập viên
 * - product_manager: Quản lý sản phẩm
 * - order_manager: Quản lý đơn hàng
 * - blog_manager: Quản lý blog
 * - blog_editor: Biên tập viên blog
 * - ecommerce_manager: Quản lý E-commerce
 * - page_builder_manager: Quản lý Page Builder
 * - hr_manager: Quản lý nhân sự
 * - accountant: Kế toán
 * - affiliate_manager: Quản lý affiliate
 */

'use client';

import {
  HeaderActions,
  AppModule,
  UserMenuItem,
  DEFAULT_APP_MODULES,
  DEFAULT_USER_MENU_ITEMS,
  DEFAULT_GUEST_MENU_ITEMS,
  ADMIN_APP_MODULES,
  LMS_APP_MODULES,
  INSTRUCTOR_APP_MODULES,
  STUDENT_USER_MENU,
  INSTRUCTOR_USER_MENU,
} from './HeaderActions';
import {
  Shield,
  GraduationCap,
  Calculator,
  Workflow,
  ShoppingCart,
  Globe,
  Headphones,
  UserCircle,
  Settings,
  LogOut,
  BookOpen,
  LayoutDashboard,
  Users,
  FileText,
  Briefcase,
} from 'lucide-react';

// ===================== EXAMPLE 1: Basic Usage (Mặc định) =====================
/**
 * Sử dụng mặc định - Hiển thị tất cả modules dựa trên quyền của user
 */
export function BasicHeaderActions() {
  return (
    <HeaderActions
      variant="light"
      showNotifications={true}
      showApps={true}
      showUser={true}
      showChat={true}
    />
  );
}

// ===================== EXAMPLE 2: Dark Theme (Admin/LMS) =====================
/**
 * Sử dụng cho các trang có header dark như Admin, LMS Admin
 */
export function DarkHeaderActions() {
  return (
    <HeaderActions
      variant="dark"
      showNotifications={true}
      showApps={true}
      showUser={true}
      showChat={true}
    />
  );
}

// ===================== EXAMPLE 3: Admin Panel =====================
/**
 * Sử dụng trong Admin Panel - Chỉ hiển thị modules quản trị
 */
export function AdminPanelHeaderActions() {
  return (
    <HeaderActions
      variant="dark"
      appModules={ADMIN_APP_MODULES}
      showNotifications={true}
      showApps={true}
      showUser={true}
      showChat={true}
    />
  );
}

// ===================== EXAMPLE 4: LMS Platform =====================
/**
 * Sử dụng cho trang LMS - Chỉ hiển thị modules học tập
 */
export function LMSHeaderActions() {
  return (
    <HeaderActions
      variant="light"
      appModules={LMS_APP_MODULES}
      showNotifications={true}
      showApps={true}
      showUser={true}
      showChat={true}
    />
  );
}

// ===================== EXAMPLE 5: Instructor Dashboard =====================
/**
 * Sử dụng cho trang Giảng viên - Modules và menu riêng cho giảng viên
 */
export function InstructorHeaderActions() {
  return (
    <HeaderActions
      variant="dark"
      appModules={INSTRUCTOR_APP_MODULES}
      userMenuItems={INSTRUCTOR_USER_MENU}
      showNotifications={true}
      showApps={true}
      showUser={true}
      showChat={true}
    />
  );
}

// ===================== EXAMPLE 6: Student View =====================
/**
 * Sử dụng cho trang Học viên - Menu đơn giản cho học viên
 */
export function StudentHeaderActions() {
  return (
    <HeaderActions
      variant="light"
      appModules={LMS_APP_MODULES}
      userMenuItems={STUDENT_USER_MENU}
      showNotifications={true}
      showApps={true}
      showUser={true}
      showChat={true}
    />
  );
}

// ===================== EXAMPLE 7: E-commerce Manager =====================
/**
 * Sử dụng cho người quản lý E-commerce - Chỉ hiển thị modules bán hàng
 */
const ECOMMERCE_MODULES: AppModule[] = [
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
    id: 'categories',
    name: 'Danh mục',
    icon: FileText,
    href: '/admin/categories',
    color: 'bg-orange-500',
    requireAuth: true,
  },
  {
    id: 'analytics',
    name: 'Thống kê',
    icon: LayoutDashboard,
    href: '/admin/analytics',
    color: 'bg-blue-500',
    requireAuth: true,
  },
];

export function EcommerceManagerHeaderActions() {
  return (
    <HeaderActions
      variant="light"
      appModules={ECOMMERCE_MODULES}
      showNotifications={true}
      showApps={true}
      showUser={true}
      showChat={true}
    />
  );
}

// ===================== EXAMPLE 8: Content Editor =====================
/**
 * Sử dụng cho Biên tập viên nội dung
 */
const CONTENT_EDITOR_MODULES: AppModule[] = [
  {
    id: 'blog',
    name: 'Blog',
    icon: FileText,
    href: '/admin/blog',
    color: 'bg-orange-500',
    requireAuth: true,
  },
  {
    id: 'pages',
    name: 'Trang',
    icon: Globe,
    href: '/admin/pagebuilder',
    color: 'bg-teal-500',
    requireAuth: true,
  },
  {
    id: 'media',
    name: 'Media',
    icon: '🖼️',
    href: '/admin/filemanager',
    color: 'bg-purple-500',
    requireAuth: true,
  },
];

export function ContentEditorHeaderActions() {
  return (
    <HeaderActions
      variant="light"
      appModules={CONTENT_EDITOR_MODULES}
      showNotifications={true}
      showApps={true}
      showUser={true}
      showChat={false}
    />
  );
}

// ===================== EXAMPLE 9: Custom Logout Handler =====================
export function CustomLogoutHeaderActions() {
  const handleCustomLogout = async () => {
    // Custom logout logic
    console.log('Custom logout...');
    // Clear custom state
    localStorage.removeItem('custom-data');
    // Call API
    // await customLogoutApi();
    // Redirect
    window.location.href = '/goodbye';
  };

  return (
    <HeaderActions
      variant="light"
      onLogout={handleCustomLogout}
    />
  );
}

// ===================== EXAMPLE 10: Custom Chat Handler =====================
export function CustomChatHeaderActions() {
  const handleChatClick = () => {
    // Custom chat logic
    console.log('Opening custom chat...');
    // Open chat widget
    // openCrisp();
    // openIntercom();
    // openTawk();
  };

  return (
    <HeaderActions
      variant="light"
      onChatClick={handleChatClick}
    />
  );
}

// ===================== EXAMPLE 11: LMS Admin Header =====================
const LMS_ADMIN_MODULES: AppModule[] = [
  {
    id: 'lms-dashboard',
    name: 'Dashboard',
    icon: '📊',
    href: '/lms/admin',
    color: 'bg-blue-500',
    requireAuth: true,
  },
  {
    id: 'courses',
    name: 'Khóa học',
    icon: '📚',
    href: '/lms/admin/courses',
    color: 'bg-purple-500',
    requireAuth: true,
  },
  {
    id: 'students',
    name: 'Học viên',
    icon: '👥',
    href: '/lms/admin/students',
    color: 'bg-green-500',
    requireAuth: true,
  },
  {
    id: 'reports',
    name: 'Báo cáo',
    icon: '📈',
    href: '/lms/admin/reports',
    color: 'bg-orange-500',
    roles: ['ADMIN', 'SUPERADMIN'], // Chỉ Admin
    requireAuth: true,
  },
];

const LMS_USER_MENU: UserMenuItem[] = [
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
  { id: 'divider', label: '', isDivider: true },
  {
    id: 'logout',
    label: 'Đăng xuất',
    icon: LogOut,
    variant: 'danger',
    requireAuth: true,
  },
];

export function LMSAdminHeaderActions() {
  return (
    <HeaderActions
      variant="dark"
      appModules={LMS_ADMIN_MODULES}
      userMenuItems={LMS_USER_MENU}
    />
  );
}

// ===================== EXAMPLE 9: Permission-based Module =====================
/**
 * Ví dụ về cách sử dụng permissions (cần backend support)
 * 
 * Module sẽ chỉ hiển thị nếu user có permission tương ứng
 */
const PERMISSION_BASED_MODULES: AppModule[] = [
  {
    id: 'users',
    name: 'Quản lý Users',
    icon: Shield,
    href: '/admin/users',
    color: 'bg-red-500',
    requireAuth: true,
    permissions: [
      { resource: 'users', action: 'read' },
    ],
  },
  {
    id: 'reports',
    name: 'Báo cáo',
    icon: '📊',
    href: '/admin/reports',
    color: 'bg-blue-500',
    requireAuth: true,
    permissions: [
      { resource: 'reports', action: 'read' },
    ],
  },
];

// ===================== USAGE IN A LAYOUT =====================
/**
 * Cách sử dụng trong Layout component:
 * 
 * ```tsx
 * // In your layout.tsx
 * import { HeaderActions } from '@/components/layout/HeaderActions';
 * 
 * export default function AdminLayout({ children }) {
 *   return (
 *     <div>
 *       <header className="bg-gray-900 p-4">
 *         <div className="flex justify-between items-center">
 *           <Logo />
 *           <HeaderActions 
 *             variant="dark"
 *             showNotifications={true}
 *             showApps={true}
 *             showUser={true}
 *             showChat={true}
 *           />
 *         </div>
 *       </header>
 *       <main>{children}</main>
 *     </div>
 *   );
 * }
 * ```
 */

// ===================== ROLE-BASED ACCESS EXAMPLE =====================
/**
 * Các roles thường dùng trong hệ thống:
 * 
 * - SUPERADMIN: Quyền cao nhất, truy cập mọi thứ
 * - ADMIN: Quản trị viên, truy cập hầu hết các module
 * - INSTRUCTOR: Giảng viên LMS
 * - STUDENT: Học viên LMS
 * - ACCOUNTANT: Kế toán
 * - MANAGER: Quản lý
 * - SUPPORT: Nhân viên hỗ trợ
 * - EDITOR: Biên tập viên
 * - USER: Người dùng thông thường
 * 
 * Cách thiết lập roles cho module:
 * 
 * ```tsx
 * const module: AppModule = {
 *   id: 'admin',
 *   name: 'Admin Panel',
 *   href: '/admin',
 *   icon: Shield,
 *   color: 'bg-red-500',
 *   
 *   // Option 1: Chỉ định roles cụ thể
 *   roles: ['ADMIN', 'SUPERADMIN'],
 *   
 *   // Option 2: Public - ai cũng thấy
 *   isPublic: true,
 *   
 *   // Option 3: Hidden - luôn ẩn
 *   isHidden: true,
 *   
 *   // Option 4: Yêu cầu đăng nhập
 *   requireAuth: true,
 * };
 * ```
 */

export default function HeaderActionsExamples() {
  return (
    <div className="space-y-8 p-8">
      <section>
        <h2 className="text-xl font-bold mb-4">1. Basic Usage (Default)</h2>
        <div className="border p-4 rounded-lg bg-white">
          <BasicHeaderActions />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">2. Dark Theme (Admin)</h2>
        <div className="border p-4 rounded-lg bg-gray-900">
          <DarkHeaderActions />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">3. Admin Panel</h2>
        <div className="border p-4 rounded-lg bg-gray-900">
          <AdminPanelHeaderActions />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">4. LMS Platform</h2>
        <div className="border p-4 rounded-lg bg-white">
          <LMSHeaderActions />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">5. Instructor Dashboard</h2>
        <div className="border p-4 rounded-lg bg-gray-900">
          <InstructorHeaderActions />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">6. Student View</h2>
        <div className="border p-4 rounded-lg bg-white">
          <StudentHeaderActions />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">7. E-commerce Manager</h2>
        <div className="border p-4 rounded-lg bg-white">
          <EcommerceManagerHeaderActions />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">8. Content Editor</h2>
        <div className="border p-4 rounded-lg bg-white">
          <ContentEditorHeaderActions />
        </div>
      </section>
    </div>
  );
}
