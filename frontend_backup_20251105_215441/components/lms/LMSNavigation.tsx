'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  GraduationCap,
  Award,
  LayoutDashboard,
  Menu,
  X,
  Home,
  Library,
  Users,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredRole?: 'instructor' | 'student';
}

const mainNavigation: NavigationItem[] = [
  {
    name: 'Trang chủ',
    href: '/lms',
    icon: Home,
  },
  {
    name: 'Khóa học',
    href: '/lms/courses',
    icon: BookOpen,
  },
  {
    name: 'Học tập của tôi',
    href: '/lms/my-learning',
    icon: Library,
  },
  {
    name: 'Chứng chỉ',
    href: '/lms/my-certificates',
    icon: Award,
  },
];

const instructorNavigation: NavigationItem = {
  name: 'Dashboard Giảng viên',
  href: '/lms/instructor/dashboard',
  icon: LayoutDashboard,
  requiredRole: 'instructor',
};

interface LMSNavigationProps {
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
    role?: string;
  } | null;
  showInstructorLink?: boolean;
}

export function LMSNavigation({ user, showInstructorLink = true }: LMSNavigationProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/lms') {
      return pathname === '/lms';
    }
    return pathname?.startsWith(href);
  };

  const NavLink = ({ item }: { item: NavigationItem }) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    return (
      <Link
        href={item.href}
        onClick={() => setIsMobileMenuOpen(false)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
          active
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        )}
      >
        <Icon className="h-4 w-4" />
        <span>{item.name}</span>
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/lms" className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold hidden sm:inline">LMS</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {mainNavigation.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
            {showInstructorLink && (
              <NavLink item={instructorNavigation} />
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar} alt={user.name || user.email} />
                      <AvatarFallback>
                        {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      {user.name && (
                        <p className="text-sm font-medium">{user.name}</p>
                      )}
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/lms/my-learning">
                      <Library className="mr-2 h-4 w-4" />
                      Học tập của tôi
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/lms/my-certificates">
                      <Award className="mr-2 h-4 w-4" />
                      Chứng chỉ của tôi
                    </Link>
                  </DropdownMenuItem>
                  {showInstructorLink && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/lms/instructor/dashboard">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard Giảng viên
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Cài đặt
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/logout">
                      Đăng xuất
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default" size="sm">
                <Link href="/login">Đăng nhập</Link>
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-4 mt-8">
                  <nav className="flex flex-col gap-1">
                    {mainNavigation.map((item) => (
                      <NavLink key={item.href} item={item} />
                    ))}
                    {showInstructorLink && (
                      <NavLink item={instructorNavigation} />
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
