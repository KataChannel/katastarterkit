'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { BookOpen, Award, User, Home } from 'lucide-react';

const menuItems = [
  { title: 'Khóa học của tôi', icon: BookOpen, href: '/lms/student/my-courses' },
  { title: 'Chứng chỉ', icon: Award, href: '/lms/student/certificates' },
  { title: 'Hồ sơ', icon: User, href: '/lms/student/profile' },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <ProtectedRoute allowedRoles={['USER']}>
      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-8">
                <button
                  onClick={() => router.push('/lms')}
                  className="flex items-center gap-2 text-lg font-bold text-gray-900 hover:text-blue-600"
                >
                  <Home className="w-5 h-5" />
                  <span className="hidden sm:inline">LMS</span>
                </button>
                
                <div className="hidden md:flex items-center gap-4">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                    return (
                      <button
                        key={item.href}
                        onClick={() => router.push(item.href)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => router.push('/lms/courses')}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Khám phá khóa học
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden border-t border-gray-200 px-4 py-3">
            <div className="flex items-center gap-2 overflow-x-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.title}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
