'use client';

import { WebsiteFooter } from '@/components/layout/website-footer';
import { WebsiteHeader } from '@/components/layout/website-header';
import { CartProvider } from '@/contexts/CartContext';
import { useWebsiteSetting } from '@/hooks/useWebsiteSettings';
import { ReactNode } from 'react';

interface websiteLayoutProps {
  children: ReactNode;
}

export default function websiteLayout({ children }: websiteLayoutProps) {
  // Load header/footer visibility settings
  const { value: headerEnabled, loading: headerLoading } = useWebsiteSetting('header.enabled');
  const { value: footerEnabled, loading: footerLoading } = useWebsiteSetting('footer.enabled');

  // Default to true if loading or not set
  const showHeader = headerLoading ? true : (headerEnabled !== false);
  const showFooter = footerLoading ? true : (footerEnabled !== false);

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {showHeader && <WebsiteHeader />}
        <main className="flex-1">
          {children}
        </main>
        {showFooter && <WebsiteFooter />}
      </div>
    </CartProvider>
  );
}
