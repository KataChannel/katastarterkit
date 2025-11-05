'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  GET_PRODUCTS_FOR_MENU,
  GET_BLOGS_FOR_MENU,
  GET_BLOG_CATEGORIES,
  GET_CATEGORIES,
} from '@/graphql/menu.queries';
import { Loader2, Search } from 'lucide-react';

interface DynamicMenuLinkSelectorProps {
  linkType: string;
  value: {
    productId?: string;
    blogPostId?: string;
    pageId?: string;
    categoryId?: string;
    blogCategoryId?: string;
    queryConditions?: any;
  };
  onChange: (value: any) => void;
}

export function DynamicMenuLinkSelector({
  linkType,
  value,
  onChange,
}: DynamicMenuLinkSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Render based on link type
  switch (linkType) {
    case 'PRODUCT_LIST':
      return <ProductListConditions value={value.queryConditions} onChange={(v) => onChange({ queryConditions: v })} />;

    case 'PRODUCT_DETAIL':
      return <ProductSelector value={value.productId} onChange={(v) => onChange({ productId: v })} searchTerm={searchTerm} onSearchChange={setSearchTerm} />;

    case 'BLOG_LIST':
      return <BlogListConditions value={value.queryConditions} onChange={(v) => onChange({ queryConditions: v })} />;

    case 'BLOG_DETAIL':
      return <BlogSelector value={value.blogPostId} onChange={(v) => onChange({ blogPostId: v })} searchTerm={searchTerm} onSearchChange={setSearchTerm} />;

    case 'CATEGORY':
      return <CategorySelector value={value.categoryId} onChange={(v) => onChange({ categoryId: v })} />;

    case 'BLOG_CATEGORY':
      return <BlogCategorySelector value={value.blogCategoryId} onChange={(v) => onChange({ blogCategoryId: v })} />;

    case 'PAGE':
      return <PageSelector value={value.pageId} onChange={(v) => onChange({ pageId: v })} />;

    default:
      return null;
  }
}

// Product List Conditions
function ProductListConditions({ value, onChange }: { value?: any; onChange: (v: any) => void }) {
  const conditions = value || {};

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <Label>Sắp Xếp</Label>
          <Select
            value={conditions.sort || 'latest'}
            onValueChange={(sort) => onChange({ ...conditions, sort })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Mới Nhất</SelectItem>
              <SelectItem value="bestseller">Bán Chạy</SelectItem>
              <SelectItem value="popular">Xem Nhiều</SelectItem>
              <SelectItem value="price_asc">Giá Tăng Dần</SelectItem>
              <SelectItem value="price_desc">Giá Giảm Dần</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Giới Hạn (Số Sản Phẩm)</Label>
          <Input
            type="number"
            value={conditions.limit || 12}
            onChange={(e) => onChange({ ...conditions, limit: parseInt(e.target.value) })}
            min={1}
            max={100}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={conditions.featured || false}
            onChange={(e) => onChange({ ...conditions, featured: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor="featured">Chỉ Sản Phẩm Nổi Bật</Label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="onSale"
            checked={conditions.onSale || false}
            onChange={(e) => onChange({ ...conditions, onSale: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor="onSale">Chỉ Sản Phẩm Giảm Giá</Label>
        </div>
      </CardContent>
    </Card>
  );
}

// Product Selector
function ProductSelector({ 
  value, 
  onChange, 
  searchTerm, 
  onSearchChange 
}: { 
  value?: string; 
  onChange: (v: string) => void;
  searchTerm: string;
  onSearchChange: (v: string) => void;
}) {
  const { data, loading } = useQuery(GET_PRODUCTS_FOR_MENU, {
    variables: { search: searchTerm, limit: 50 },
  });

  const products = data?.products?.items || [];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Tìm Kiếm Sản Phẩm</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Nhập tên sản phẩm..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Chọn Sản Phẩm</Label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="-- Chọn sản phẩm --" />
          </SelectTrigger>
          <SelectContent>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              products.map((product: any) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name || product.nameEn}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Blog List Conditions
function BlogListConditions({ value, onChange }: { value?: any; onChange: (v: any) => void }) {
  const conditions = value || {};

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <Label>Sắp Xếp</Label>
          <Select
            value={conditions.sort || 'latest'}
            onValueChange={(sort) => onChange({ ...conditions, sort })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Mới Nhất</SelectItem>
              <SelectItem value="oldest">Cũ Nhất</SelectItem>
              <SelectItem value="popular">Xem Nhiều</SelectItem>
              <SelectItem value="featured">Nổi Bật</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Giới Hạn (Số Bài Viết)</Label>
          <Input
            type="number"
            value={conditions.limit || 12}
            onChange={(e) => onChange({ ...conditions, limit: parseInt(e.target.value) })}
            min={1}
            max={100}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="blogFeatured"
            checked={conditions.featured || false}
            onChange={(e) => onChange({ ...conditions, featured: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor="blogFeatured">Chỉ Bài Viết Nổi Bật</Label>
        </div>
      </CardContent>
    </Card>
  );
}

// Blog Selector
function BlogSelector({ 
  value, 
  onChange, 
  searchTerm, 
  onSearchChange 
}: { 
  value?: string; 
  onChange: (v: string) => void;
  searchTerm: string;
  onSearchChange: (v: string) => void;
}) {
  const { data, loading } = useQuery(GET_BLOGS_FOR_MENU, {
    variables: { search: searchTerm, limit: 50 },
  });

  const blogs = data?.blogs?.items || [];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Tìm Kiếm Bài Viết</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Nhập tiêu đề bài viết..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Chọn Bài Viết</Label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="-- Chọn bài viết --" />
          </SelectTrigger>
          <SelectContent>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              blogs.map((blog: any) => (
                <SelectItem key={blog.id} value={blog.id}>
                  {blog.title}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Category Selector
function CategorySelector({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  const { data, loading } = useQuery(GET_CATEGORIES);
  const categories = data?.categories || [];

  return (
    <div className="space-y-2">
      <Label>Chọn Danh Mục Sản Phẩm</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="-- Chọn danh mục --" />
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            categories.map((cat: any) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

// Blog Category Selector
function BlogCategorySelector({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  const { data, loading } = useQuery(GET_BLOG_CATEGORIES);
  const categories = data?.blogCategories || [];

  return (
    <div className="space-y-2">
      <Label>Chọn Danh Mục Bài Viết</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="-- Chọn danh mục --" />
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            categories.map((cat: any) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

// Page Selector
function PageSelector({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <Label>Chọn Trang (Page Builder)</Label>
      <Input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Nhập Page ID hoặc Slug..."
      />
      <p className="text-sm text-muted-foreground">
        Nhập ID hoặc slug của trang từ Page Builder
      </p>
    </div>
  );
}
