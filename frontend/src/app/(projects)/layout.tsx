'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  List, 
  Settings, 
  Bell,
  Search,
  Menu,
  X,
  Kanban,
  Calendar,
  Map,
  Loader2,
  GanttChart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

// View types for project management
type ViewType = 'dashboard' | 'list' | 'kanban' | 'timeline' | 'calendar' | 'roadmap';

const viewTabs: { id: ViewType; name: string; icon: any }[] = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'list', name: 'Danh sách', icon: List },
  { id: 'kanban', name: 'Kanban', icon: Kanban },
  { id: 'timeline', name: 'Timeline', icon: GanttChart },
  { id: 'calendar', name: 'Lịch', icon: Calendar },
  { id: 'roadmap', name: 'Roadmap', icon: Map },
];

// Component sử dụng useSearchParams - cần được wrap trong Suspense
function ProjectsNavigation({ 
  isMobileMenuOpen, 
  setIsMobileMenuOpen 
}: { 
  isMobileMenuOpen: boolean; 
  setIsMobileMenuOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeView, setActiveView] = useState<ViewType>('list');

  // Get active view from URL
  useEffect(() => {
    const viewParam = searchParams.get('view') as ViewType;
    if (viewParam && viewTabs.some(t => t.id === viewParam)) {
      setActiveView(viewParam);
    }
  }, [searchParams]);

  // Handle view change
  const handleViewChange = (viewId: ViewType) => {
    setActiveView(viewId);
    const projectId = searchParams.get('project');
    const params = new URLSearchParams();
    params.set('view', viewId);
    if (projectId) params.set('project', projectId);
    router.push(`/projects/views?${params.toString()}`);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-1">
        {viewTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleViewChange(tab.id)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
                transition-colors
                ${isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }
              `}
            >
              <Icon className="h-4 w-4" />
              {tab.name}
            </button>
          );
        })}
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t absolute top-14 left-0 right-0 bg-background z-50">
          <nav className="grid gap-1 p-2">
            {viewTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeView === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleViewChange(tab.id)}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium
                    transition-colors w-full text-left
                    ${isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
          
          {/* Mobile Search */}
          <div className="p-2 border-t">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm..."
                className="w-full pl-8"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Loading fallback cho navigation
function NavigationFallback() {
  return (
    <nav className="hidden lg:flex items-center gap-1">
      {viewTabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <div
            key={tab.id}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground"
          >
            <Icon className="h-4 w-4" />
            {tab.name}
          </div>
        );
      })}
    </nav>
  );
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Navigation Bar - Mobile First */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4 lg:px-6">
          {/* Left: Logo & Mobile Menu */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            
            <Link href="/projects/views" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="hidden sm:inline-block font-semibold text-lg">
                ProjectHub
              </span>
            </Link>
          </div>

          {/* Center: View Tabs Navigation - Wrapped in Suspense */}
          <Suspense fallback={<NavigationFallback />}>
            <ProjectsNavigation 
              isMobileMenuOpen={isMobileMenuOpen} 
              setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
          </Suspense>

          {/* Right: Search, Notifications, Profile */}
          <div className="flex items-center gap-2">
            {/* Search - Hidden on mobile */}
            <div className="hidden md:block relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm..."
                className="w-[200px] lg:w-[300px] pl-8 h-9"
              />
            </div>

            {/* Settings */}
            <Link href="/projects/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/avatars/default.png" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Hồ sơ</DropdownMenuItem>
                <DropdownMenuItem>Cài đặt</DropdownMenuItem>
                <DropdownMenuItem>Nhóm</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Đăng xuất</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content - Full Height */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
