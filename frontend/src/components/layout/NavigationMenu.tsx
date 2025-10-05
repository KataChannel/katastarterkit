'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  children?: NavigationItem[];
}

interface NavigationMenuProps {
  navigation: NavigationItem[];
  collapsed: boolean;
  onItemClick?: () => void;
}

export function NavigationMenu({ navigation, collapsed, onItemClick }: NavigationMenuProps) {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (itemName: string) => {
    setOpenItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openItems.includes(item.name);
    const Icon = item.icon;

    if (hasChildren) {
      return (
        <div key={item.name}>
          <Button
            variant="ghost"
            onClick={() => toggleItem(item.name)}
            className={cn(
              'w-full justify-between gap-3 px-3 py-2 text-sm font-medium transition-all hover:bg-accent',
              isActive
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground',
              collapsed && 'justify-center',
              level > 0 && 'ml-4'
            )}
          >
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </div>
            {!collapsed && (
              isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          {!collapsed && isOpen && (
            <div className="space-y-1 ml-4">
              {item.children?.map(child => renderNavigationItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        href={item.href}
        onClick={onItemClick}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent',
          isActive
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground hover:text-foreground',
          collapsed && 'justify-center',
          level > 0 && 'ml-4'
        )}
        title={collapsed ? item.name : undefined}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {!collapsed && <span>{item.name}</span>}
      </Link>
    );
  };

  return (
    <nav className="flex flex-col gap-1 px-2">
      {navigation.map(item => renderNavigationItem(item))}
    </nav>
  );
}