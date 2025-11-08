'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ShoppingCart, Package, Heart, MapPin, User, CreditCard } from 'lucide-react';

const accountMenuItems = [
  {
    icon: User,
    label: 'Thông tin tài khoản',
    href: '/tai-khoan',
    description: 'Quản lý thông tin cá nhân',
  },
  {
    icon: Package,
    label: 'Đơn hàng của tôi',
    href: '/don-hang',
    description: 'Theo dõi đơn hàng',
  },
  // Wishlist - disabled (backend not implemented)
  // {
  //   icon: Heart,
  //   label: 'Sản phẩm yêu thích',
  //   href: '/yeu-thich',
  //   description: 'Danh sách wishlist',
  // },
  {
    icon: MapPin,
    label: 'Địa chỉ giao hàng',
    href: '/dia-chi',
    description: 'Quản lý địa chỉ',
  },
  {
    icon: CreditCard,
    label: 'Phương thức thanh toán',
    href: '/phuong-thuc-thanh-toan',
    description: 'Quản lý thanh toán',
  },
];

export function EcommerceNavigation() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-10 bg-white border-b shadow-sm rounded-lg">
      <div className="container max-w-4xl mx-auto px-3 sm:px-4">
        {/* Mobile First: Horizontal Scrollable Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0">
          {accountMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 min-w-[72px] sm:min-w-0 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 -mb-px',
                  isActive
                    ? 'text-primary border-primary bg-primary/5'
                    : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100'
                )}
                aria-label={item.label}
                title={item.description}
              >
                <Icon className={cn(
                  'flex-shrink-0 transition-transform',
                  isActive ? 'h-5 w-5 sm:h-4 sm:w-4' : 'h-4 w-4'
                )} />
                <span className="text-[10px] leading-tight sm:text-sm sm:leading-normal">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
