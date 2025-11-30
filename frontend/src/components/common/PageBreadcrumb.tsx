'use client';

import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface PageBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Reusable breadcrumb component for website pages
 * - Mobile First + Responsive design
 * - Vietnamese language
 * - Follows shadcn UI standards
 * 
 * @example
 * <PageBreadcrumb items={[
 *   { label: 'Trang chủ', href: '/', icon: <Home /> },
 *   { label: 'Bài viết', href: '/bai-viet' },
 *   { label: 'Món ngon mỗi ngày' }
 * ]} />
 */
export default function PageBreadcrumb({ items, className = '' }: PageBreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className={`bg-white border-b py-3 ${className}`}>
      <div className="container mx-auto px-4">
        <Breadcrumb>
          <BreadcrumbList className="flex-wrap gap-1 sm:gap-2">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;

              return (
                <div key={index} className="flex items-center gap-1 sm:gap-2">
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="flex items-center gap-1.5 text-sm sm:text-base font-medium text-gray-900 max-w-[150px] sm:max-w-none truncate">
                        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                        <span className="truncate">{item.label}</span>
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link 
                          href={item.href || '#'}
                          className="flex items-center gap-1.5 text-sm sm:text-base text-gray-600 hover:text-green-600 transition-colors max-w-[100px] sm:max-w-[200px] truncate"
                        >
                          {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                          <span className="truncate">{item.label}</span>
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  
                  {!isLast && (
                    <BreadcrumbSeparator>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </BreadcrumbSeparator>
                  )}
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
