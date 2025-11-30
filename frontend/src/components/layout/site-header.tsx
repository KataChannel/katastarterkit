'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSiteName } from '@/hooks/useSiteName';
import { HeaderActions } from './HeaderActions';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export function SiteHeader() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const { siteName } = useSiteName();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const authenticatedNavigation = [
    { name: 'Demo', href: '/demo' },
    { name: 'Kế Toán', href: '/ketoan' },
    { name: 'Chat Bot', href: '/chatbot' },
    { name: 'Website', href: '/website' },
  ];

  const publicNavigation = [
    { name: 'Features', href: '#features' },
    { name: 'Tech Stack', href: '#tech-stack' },
    { name: 'Demo', href: '/demo' },
    { name: 'Chatbot', href: '/chatbot' },
    { name: 'Website', href: '/website' },
  ];

  const currentNavigation = isAuthenticated ? authenticatedNavigation : publicNavigation;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              {siteName}
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {currentNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Header Actions - Bell, Apps, User, Chat */}
            <HeaderActions 
              variant="light"
              showNotifications={isAuthenticated}
              showApps={isAuthenticated}
              showUser={true}
              showChat={true}
            />

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden h-9 w-9 p-0">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 mt-6">
                  {currentNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-sm font-medium text-gray-600 hover:text-blue-600 py-2 px-3 rounded-md hover:bg-gray-100 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
