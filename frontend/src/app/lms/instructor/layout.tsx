'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Menu, BookOpen, Users, ClipboardList, BarChart3, Settings, Home, LayoutDashboard, FileText } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const menuItems = [
  { 
    title: 'Tổng quan', 
    icon: LayoutDashboard, 
    href: '/lms/instructor' 
  },
  { 
    title: 'Khóa học của tôi', 
    icon: BookOpen, 
    href: '/lms/instructor/courses',
    children: [
      { title: 'Danh sách', href: '/lms/instructor/courses' },
      { title: 'Tạo mới', href: '/lms/instructor/courses/create' },
      { title: 'Từ tài liệu', href: '/lms/instructor/courses/create-from-documents' },
      { title: 'Tạo với AI', href: '/lms/instructor/courses/create-with-ai' },
    ],
  },
  { 
    title: 'Tài liệu nguồn', 
    icon: FileText, 
    href: '/lms/instructor/source-documents',
    children: [
      { title: 'Danh sách', href: '/lms/instructor/source-documents' },
      { title: 'Thêm mới', href: '/lms/instructor/source-documents/new' },
    ],
  },
  { 
    title: 'Học viên', 
    icon: Users, 
    href: '/lms/instructor/students' 
  },
  { 
    title: 'Bài kiểm tra', 
    icon: ClipboardList, 
    href: '/lms/instructor/quizzes' 
  },
  { 
    title: 'Báo cáo', 
    icon: BarChart3, 
    href: '/lms/instructor/reports' 
  },
  { 
    title: 'Cài đặt', 
    icon: Settings, 
    href: '/lms/instructor/settings' 
  },
];

// Helper to check if user is admin (for navigation to admin dashboard)
const getAdminLink = () => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.roleType === 'ADMIN' ? '/lms/admin' : null;
    }
  } catch (error) {
    // Ignore error
  }
  return null;
};

function InstructorSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-purple-900">Giảng viên</h2>
        <p className="text-sm text-gray-500 mt-1">Quản lý khóa học của bạn</p>
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
                      ? 'bg-purple-50 text-purple-700 font-semibold'
                      : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </button>
                
                {/* Submenu */}
                {item.children && isActive && (
                  <ul className="mt-1 ml-9 space-y-0.5">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(child.href);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                            pathname === child.href
                              ? 'text-purple-700 font-medium bg-purple-50/50'
                              : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50/30'
                          }`}
                        >
                          {child.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 space-y-2">
        {/* Check if user is admin - show link to admin dashboard */}
        {(() => {
          const adminLink = getAdminLink();
          if (adminLink) {
            return (
              <button
                onClick={() => router.push(adminLink)}
                className="w-full px-4 py-2 text-sm text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2 font-medium"
              >
                <LayoutDashboard className="w-4 h-4" />
                Quay lại Admin
              </button>
            );
          }
          return null;
        })()}
        
        <button
          onClick={() => router.push('/lms')}
          className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          LMS Home
        </button>
      </div>
    </aside>
  );
}

function InstructorMobileSidebar({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <aside className="w-full bg-white flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-purple-900">Giảng viên</h2>
        <p className="text-xs text-gray-500 mt-1">Quản lý khóa học của bạn</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <li key={item.href}>
                <button
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                    isActive
                      ? 'bg-purple-50 text-purple-700 font-semibold'
                      : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium truncate">{item.title}</span>
                </button>
                
                {/* Submenu */}
                {item.children && isActive && (
                  <ul className="mt-1 ml-7 space-y-0.5">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNavigation(child.href);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${
                            pathname === child.href
                              ? 'text-purple-700 font-medium bg-purple-50/50'
                              : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50/30'
                          }`}
                        >
                          {child.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3 border-t border-gray-200 space-y-2">
        {(() => {
          const adminLink = getAdminLink();
          if (adminLink) {
            return (
              <button
                onClick={() => handleNavigation(adminLink)}
                className="w-full px-3 py-2 text-xs text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2 font-medium"
              >
                <LayoutDashboard className="w-4 h-4" />
                Quay lại Admin
              </button>
            );
          }
          return null;
        })()}
        
        <button
          onClick={() => handleNavigation('/lms')}
          className="w-full px-3 py-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          LMS Home
        </button>
      </div>
    </aside>
  );
}

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={['USER']}>
      <div className="flex h-screen bg-gray-50">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <InstructorSidebar />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Mobile Menu Button */}
          <div className="lg:hidden sticky top-0 z-10 bg-white border-b p-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <InstructorMobileSidebar onClose={() => setIsMobileMenuOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Page Content */}
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
