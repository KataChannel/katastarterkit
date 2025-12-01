'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { GET_PRODUCTS, GET_PRODUCT_CATEGORIES } from '@/graphql/ecommerce.queries';
import { GET_CATEGORY_BY_SLUG, GET_ACTIVE_CATEGORIES } from '@/graphql/category.queries';
import { ShoppingCart, Heart, Star, ChevronDown, Filter, Search, X, SlidersHorizontal, Grid3x3, List, Home, Package, Layers, ArrowLeft } from 'lucide-react';
import { ProductImage } from '@/components/ui/product-image';
import { AddToCartButton } from '@/components/ecommerce/AddToCartButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import PageBreadcrumb from '@/components/common/PageBreadcrumb';
import Head from 'next/head';

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params?.slug as string;
  
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch category by slug
  const { data: categoryData, loading: categoryLoading, error: categoryError } = useQuery(GET_CATEGORY_BY_SLUG, {
    variables: { slug: categorySlug },
    skip: !categorySlug,
  });

  const category = categoryData?.categoryBySlug;

  // Fetch products for this category
  const { data, loading, error } = useQuery(GET_PRODUCTS, {
    variables: {
      input: {
        page,
        limit: 12,
        sortBy,
        sortOrder: 'desc',
        filters: {
          categoryId: category?.id || undefined,
          search: searchQuery || undefined,
          inStock: true,
        }
      }
    },
    skip: !category?.id,
  });

  // Fetch all categories for sidebar
  const { data: categoriesData } = useQuery(GET_ACTIVE_CATEGORIES);

  const products = data?.products?.items || [];
  const total = data?.products?.total || 0;
  const hasMore = data?.products?.hasMore || false;
  const categories = categoriesData?.categories?.items || [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Reset page when category changes
  useEffect(() => {
    setPage(1);
  }, [categorySlug]);

  // Filter sidebar component
  const FilterSidebar = () => (
    <div className="space-y-0">
      {/* Green Header */}
      <div className="bg-green-600 text-white px-4 py-3 rounded-t-lg">
        <h2 className="font-bold text-base uppercase">DANH MỤC SẢN PHẨM</h2>
      </div>

      {/* Categories List */}
      <div className="border border-t-0 rounded-b-lg overflow-hidden bg-white">
        <div className="divide-y">
          <Link
            href="/san-pham"
            className="w-full px-4 py-3 text-left flex items-center gap-2 hover:bg-gray-50 transition-colors text-gray-700"
          >
            <span className="text-lg">📦</span>
            <span className="text-sm">Tất cả sản phẩm</span>
          </Link>
          {categories.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/danh-muc/${cat.slug}`}
              className={`w-full px-4 py-3 text-left flex items-center gap-2 hover:bg-gray-50 transition-colors ${
                categorySlug === cat.slug ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700'
              }`}
            >
              <span className="text-lg">
                {cat.icon || '📂'}
              </span>
              <span className="text-sm flex-1">{cat.name}</span>
              {cat.productCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {cat.productCount}
                </Badge>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Back to All Products */}
      <div className="mt-6">
        <Button variant="outline" asChild className="w-full">
          <Link href="/san-pham" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Xem tất cả sản phẩm
          </Link>
        </Button>
      </div>
    </div>
  );

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/', icon: <Home className="h-4 w-4" /> },
    { label: 'Sản phẩm', href: '/san-pham', icon: <Package className="h-4 w-4" /> },
    { label: category?.name || 'Danh mục', icon: <Layers className="h-4 w-4" /> },
  ];

  // Loading state for category
  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải danh mục...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (categoryError || !category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageBreadcrumb items={breadcrumbItems} />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="py-12 text-center">
              <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy danh mục</h2>
              <p className="text-gray-600 mb-6">Danh mục "{categorySlug}" không tồn tại hoặc đã bị xóa.</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button asChild>
                  <Link href="/san-pham">Xem tất cả sản phẩm</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Về trang chủ</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta */}
      <Head>
        <title>{category.name} - Rau Sạch Tràng An</title>
        <meta name="description" content={category.description || `Khám phá các sản phẩm ${category.name} tươi ngon, chất lượng cao tại Rau Sạch Tràng An`} />
        <meta property="og:title" content={`${category.name} - Rau Sạch Tràng An`} />
        <meta property="og:description" content={category.description || `Khám phá các sản phẩm ${category.name} tươi ngon, chất lượng cao tại Rau Sạch Tràng An`} />
      </Head>

      {/* Breadcrumb */}
      <PageBreadcrumb items={breadcrumbItems} />

      {/* Category Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="flex items-center gap-4">
            {category.image && (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-white/10 overflow-hidden flex-shrink-0">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{category.name}</h1>
              {category.description && (
                <p className="text-green-100 text-sm sm:text-base line-clamp-2">{category.description}</p>
              )}
              <div className="mt-2 flex items-center gap-4 text-sm text-green-100">
                <span className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  {total} sản phẩm
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <Card className="sticky top-24">
              <CardContent className="p-0">
                <FilterSidebar />
              </CardContent>
            </Card>
          </aside>

          {/* Products Grid */}
          <main className="flex-1 min-w-0">
            {/* Toolbar - Mobile First */}
            <Card className="mb-4 sm:mb-6">
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  {/* Mobile Filter Button */}
                  <Sheet open={showFilters} onOpenChange={setShowFilters}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden w-full sm:w-auto">
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        Danh mục khác
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Danh mục sản phẩm</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterSidebar />
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* View Mode Toggle - Hidden on mobile */}
                  <div className="hidden sm:flex items-center gap-2 ml-auto">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Sort Select */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Label htmlFor="sort" className="text-sm whitespace-nowrap hidden sm:block">
                      Sắp xếp:
                    </Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger id="sort" className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Sắp xếp theo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Mới nhất</SelectItem>
                        <SelectItem value="price_asc">Giá thấp đến cao</SelectItem>
                        <SelectItem value="price_desc">Giá cao đến thấp</SelectItem>
                        <SelectItem value="popular">Phổ biến nhất</SelectItem>
                        <SelectItem value="rating">Đánh giá cao</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loading State */}
            {loading && (
              <div className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <Skeleton className="aspect-square rounded-lg mb-4" />
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <Card className="border-destructive">
                <CardContent className="p-6 text-center text-destructive">
                  <p className="font-medium">Có lỗi xảy ra</p>
                  <p className="text-sm mt-1">{error.message}</p>
                </CardContent>
              </Card>
            )}

            {/* Products Grid/List */}
            {!loading && products.length > 0 && (
              <>
                <div className={`grid gap-4 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {products.map((product: any) => (
                    <Card key={product.id} className="h-full hover:shadow-lg transition-shadow group overflow-hidden bg-white">
                      <CardContent className="p-0">
                        {/* Product Image */}
                        <div className="relative aspect-square bg-gray-100 overflow-hidden">
                          <ProductImage
                            src={product.thumbnail}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {/* Cart Icon - Orange Circle */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              // Add to cart logic here
                            }}
                            disabled={product.stock === 0}
                            className="absolute bottom-3 right-3 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg z-10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <ShoppingCart className="h-5 w-5" />
                          </button>
                          {/* Category Badge */}
                          {product.category && (
                            <Badge className="absolute top-3 left-3 bg-green-600 text-white">
                              {product.category.name}
                            </Badge>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="p-4 flex flex-col">
                          <Link
                            href={`/san-pham/${product.slug}`}
                            className="block"
                          >
                            <h3 className="font-medium text-sm sm:text-base line-clamp-2 mb-3 text-gray-800 hover:text-green-600 transition-colors min-h-[2.5rem]">
                              {product.name}
                            </h3>
                          </Link>
                          
                          {/* Price - Red Color */}
                          <div className="mb-3">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="text-lg sm:text-xl font-bold text-red-600">
                                {product.price > 0 ? formatPrice(product.price) : '0₫'}
                              </span>
                              <span className="text-sm text-gray-500">
                                /{product.unit || 'Kg'}
                              </span>
                            </div>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-sm text-gray-400 line-through">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>

                          {/* Buy Now Button - Red */}
                          <Button
                            asChild
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium"
                            disabled={product.stock === 0}
                          >
                            <Link href={`/san-pham/${product.slug}`}>
                              {product.stock === 0 ? 'Hết hàng' : 'Mua Ngay'}
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    Trước
                  </Button>
                  <div className="px-4 py-2 text-sm font-medium">
                    Trang {page}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={!hasMore}
                  >
                    Sau
                  </Button>
                </div>
              </>
            )}

            {/* Empty State */}
            {!loading && products.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có sản phẩm</h3>
                  <p className="text-muted-foreground mb-4">
                    Danh mục "{category.name}" chưa có sản phẩm nào.
                  </p>
                  <Button asChild>
                    <Link href="/san-pham">Xem tất cả sản phẩm</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
