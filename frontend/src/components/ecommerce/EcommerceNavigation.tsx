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
    <nav className="bg-white border-b">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {accountMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2',
                  isActive
                    ? 'text-primary border-primary'
                    : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
