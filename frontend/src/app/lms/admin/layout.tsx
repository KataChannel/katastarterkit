'use client';

import { ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  GraduationCap,
  ClipboardList,
  BarChart3,
  Settings,
  Folder,
  UserCheck,
  Home
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface AdminLMSLayoutProps {
  children: ReactNode;
}

const menuItems = [
  {
    title: 'Tổng quan',
    icon: LayoutDashboard,
    href: '/lms/admin',
  },
  {
    title: 'Khóa học',
    icon: BookOpen,
    href: '/lms/admin/courses',
  },
  {
    title: 'Danh mục',
    icon: Folder,
    href: '/lms/admin/categories',
  },
  {
    title: 'Giảng viên',
    icon: GraduationCap,
    href: '/lms/admin/instructors',
  },
  {
    title: 'Học viên',
    icon: Users,
    href: '/lms/admin/students',
  },
  {
    title: 'Ghi danh',
    icon: UserCheck,
    href: '/lms/admin/enrollments',
  },
  {
    title: 'Bài kiểm tra',
    icon: ClipboardList,
    href: '/lms/admin/quizzes',
  },
  {
    title: 'Báo cáo',
    icon: BarChart3,
    href: '/lms/admin/reports',
  },
  {
    title: 'Cài đặt LMS',
    icon: Settings,
    href: '/lms/admin/settings',
  },
];

export default function AdminLMSLayout({ children }: AdminLMSLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">LMS Admin</h2>
            <p className="text-sm text-gray-500 mt-1">Quản lý hệ thống học tập</p>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <li key={item.href}>
                    <button
                      onClick={() => router.push(item.href)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-200 space-y-2">
            <button
              onClick={() => router.push('/lms')}
              className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              LMS Home
            </button>
            <button
              onClick={() => router.push('/admin')}
              className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← Admin Panel
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
