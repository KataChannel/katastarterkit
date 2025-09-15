import { WebsiteFooter } from '@/components/layout/website-footer';
import { WebsiteHeader } from '@/components/layout/website-header';
import { ReactNode } from 'react';

interface websiteLayoutProps {
  children: ReactNode;
}

export default function websiteLayout({ children }: websiteLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <WebsiteHeader />
      <main className="flex-1">
        {children}
      </main>
      <WebsiteFooter />
    </div>
  );
}
