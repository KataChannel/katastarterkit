import { ReactNode } from 'react';
import { AdminHeader } from '@/components/layout/admin-header';
import { AdminFooter } from '@/components/layout/admin-footer';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminHeader />
      <main className="flex-1">
        {children}
      </main>
      <AdminFooter />
    </div>
  );
}
