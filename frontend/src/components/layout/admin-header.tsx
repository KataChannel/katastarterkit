'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSiteName } from '@/hooks/useSiteName';
import { SmartHeaderActions } from './SmartHeaderActions';
import { 
  HomeIcon, 
  ClipboardDocumentListIcon, 
  UserGroupIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

export function AdminHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { siteName } = useSiteName();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Todos', href: '/admin/todos', icon: ClipboardDocumentListIcon },
    { name: 'Users', href: '/admin/users', icon: UserGroupIcon },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
  ];

  return (
    <header className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link
              href="/admin/dashboard"
              className="text-2xl font-bold text-white"
              >
              {siteName} <span className="text-blue-400">Admin</span>
            </Link>
            
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-gray-800 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }
                    `}
                    >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* Header Actions - Tự động theo phân quyền của user */}
          <SmartHeaderActions variant="dark" />
        </div>
      </div>
    </header>
  );
}
