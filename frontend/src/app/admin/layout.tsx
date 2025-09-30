'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/layout/admin-header';
import { AdminFooter } from '@/components/layout/admin-footer';
import { useAuth } from '@/contexts/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login?redirect=/admin');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show nothing (will redirect) if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <AdminHeader />
      <div className="h-full flex-1">
        {children}
      </div>
      <AdminFooter />
    </div>
  );
}
