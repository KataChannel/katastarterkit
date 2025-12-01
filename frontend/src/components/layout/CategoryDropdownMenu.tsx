'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { GET_ACTIVE_CATEGORIES } from '@/graphql/category.queries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, Grid3X3, Layers, Leaf, Apple, Carrot, ShoppingBag, Loader2, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  displayOrder: number;
  isActive: boolean;
  isFeatured?: boolean;
  productCount?: number;
}

// Icon mapping for categories
const getCategoryIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('rau') || lowerName.includes('lá') || lowerName.includes('gia vị')) {
    return <Leaf className="w-4 h-4 text-green-600" />;
  }
  if (lowerName.includes('trái cây') || lowerName.includes('quả')) {
    return <Apple className="w-4 h-4 text-red-500" />;
  }
  if (lowerName.includes('củ')) {
    return <Carrot className="w-4 h-4 text-orange-500" />;
  }
  if (lowerName.includes('thực phẩm') || lowerName.includes('chế biến')) {
    return <Package className="w-4 h-4 text-amber-600" />;
  }
  return <ShoppingBag className="w-4 h-4 text-gray-500" />;
};

interface CategoryDropdownMenuProps {
  variant?: 'desktop' | 'mobile';
  className?: string;
  buttonClassName?: string;
  showProductCount?: boolean;
  maxItems?: number;
  menuTitle?: string;
  menuBadge?: string;
}

export function CategoryDropdownMenu({
  variant = 'desktop',
  className,
  buttonClassName,
  showProductCount = true,
  maxItems,
  menuTitle,
  menuBadge,
}: CategoryDropdownMenuProps) {
  const { data, loading, error } = useQuery(GET_ACTIVE_CATEGORIES, {
    fetchPolicy: 'cache-and-network',
  });

  const categories: Category[] = data?.categories?.items || [];
  const displayCategories = maxItems ? categories.slice(0, maxItems) : categories;
  const hasMoreCategories = maxItems && categories.length > maxItems;

  if (loading && !data) {
    return (
      <Button variant="ghost" size="sm" className={cn('text-white hover:bg-white/10', buttonClassName)} disabled>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Danh mục
      </Button>
    );
  }

  if (error || categories.length === 0) {
    return null; // Hide if no categories
  }

  if (variant === 'mobile') {
    return (
      <div className={cn('space-y-1', className)}>
        <div className="px-3 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
          Danh mục sản phẩm
        </div>
        {displayCategories.map((category) => (
          <Link
            key={category.id}
            href={`/danh-muc/${category.slug}`}
            className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors"
          >
            {getCategoryIcon(category.name)}
            <span className="flex-1">{category.name}</span>
            {showProductCount && category.productCount !== undefined && category.productCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {category.productCount}
              </Badge>
            )}
          </Link>
        ))}
        {hasMoreCategories && (
          <>
            <div className="border-t my-2" />
            <Link
              href="/san-pham"
              className="flex items-center gap-3 px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-md transition-colors font-medium"
            >
              <Grid3X3 className="w-4 h-4" />
              <span>Xem tất cả danh mục</span>
            </Link>
          </>
        )}
      </div>
    );
  }

  // Desktop variant with mega menu style
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'text-white hover:text-blue-200 hover:bg-white/10 transition-all flex items-center gap-1',
            buttonClassName
          )}
        >
          <Layers className="w-4 h-4" />
          <span>{menuTitle || 'Danh mục'}</span>
          {menuBadge && (
            <Badge className="ml-1 text-xs bg-red-500 text-white">{menuBadge}</Badge>
          )}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className={cn('w-[400px] p-0', className)} 
        align="start"
        sideOffset={8}
      >
        <div className="bg-white rounded-lg shadow-xl border overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 px-4 py-3">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Grid3X3 className="w-5 h-5" />
              Danh mục sản phẩm
            </h3>
            <p className="text-green-100 text-sm mt-1">
              {categories.length} danh mục sản phẩm
            </p>
          </div>

          {/* Category Grid */}
          <div className="p-4 max-h-[400px] overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {displayCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/danh-muc/${category.slug}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group border border-transparent hover:border-green-200"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                    {getCategoryIcon(category.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm truncate group-hover:text-green-600 transition-colors">
                      {category.name}
                    </div>
                    {showProductCount && category.productCount !== undefined && (
                      <div className="text-xs text-gray-500">
                        {category.productCount} sản phẩm
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-4 py-3 bg-gray-50">
            <Link
              href="/san-pham"
              className="flex items-center justify-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
            >
              <span>Xem tất cả sản phẩm</span>
              <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
            </Link>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Simple dropdown version for narrow spaces
export function CategorySimpleDropdown({
  className,
  buttonClassName,
}: {
  className?: string;
  buttonClassName?: string;
}) {
  const { data, loading, error } = useQuery(GET_ACTIVE_CATEGORIES, {
    fetchPolicy: 'cache-and-network',
  });

  const categories: Category[] = data?.categories?.items || [];

  if (loading && !data) {
    return (
      <Button variant="ghost" size="sm" className={cn('text-white hover:bg-white/10', buttonClassName)} disabled>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Danh mục
      </Button>
    );
  }

  if (error || categories.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'text-white hover:text-blue-200 hover:bg-white/10 transition-all',
            buttonClassName
          )}
        >
          <Layers className="w-4 h-4 mr-2" />
          Danh mục
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn('w-64', className)} align="start">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Grid3X3 className="w-4 h-4 text-green-600" />
          Danh mục sản phẩm
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {categories.map((category) => (
          <DropdownMenuItem key={category.id} asChild>
            <Link
              href={`/danh-muc/${category.slug}`}
              className="flex items-center gap-3 cursor-pointer"
            >
              {getCategoryIcon(category.name)}
              <span className="flex-1">{category.name}</span>
              {category.productCount !== undefined && category.productCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {category.productCount}
                </Badge>
              )}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href="/san-pham"
            className="flex items-center gap-2 text-green-600 font-medium cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            Xem tất cả sản phẩm
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CategoryDropdownMenu;
