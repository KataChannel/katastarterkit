'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { GET_PRODUCTS, GET_PRODUCT_CATEGORIES } from '@/graphql/ecommerce.queries';
import { ShoppingCart, Heart, Star, ChevronDown, Filter, Search, X, SlidersHorizontal, Grid3x3, List } from 'lucide-react';
import { ProductImage } from '@/components/ui/product-image';
import { AddToCartButton } from '@/components/ecommerce/AddToCartButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch products
  const { data, loading, error } = useQuery(GET_PRODUCTS, {
    variables: {
      input: {
        page,
        limit: 12,
        sortBy,
        sortOrder: 'desc',
        filters: {
          categoryId: categoryId || undefined,
          search: searchQuery || undefined,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          inStock: true,
        }
      }
    }
  });

  // Fetch categories
  const { data: categoriesData } = useQuery(GET_PRODUCT_CATEGORIES, {
    variables: {
      input: {
        page: 1,
        limit: 100
      }
    }
  });

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

  // Filter sidebar component
  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search" className="text-sm font-medium">
          Tìm kiếm
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm sản phẩm..."
            className="pl-9"
          />
        </div>
      </div>

      <Separator />

      {/* Categories */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Danh mục</Label>
        <div className="space-y-1">
          <Button
            variant={categoryId === null ? "default" : "ghost"}
            size="sm"
            onClick={() => setCategoryId(null)}
            className="w-full justify-start"
          >
            Tất cả
          </Button>
          {categories.map((category: any) => (
            <Button
              key={category.id}
              variant={categoryId === category.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setCategoryId(category.id)}
              className="w-full justify-between"
            >
              <span>{category.name}</span>
              <Badge variant="secondary" className="ml-2">
                {category._count?.products || 0}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Khoảng giá</Label>
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="10000000"
            step="100000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatPrice(0)}</span>
            <span className="font-medium text-foreground">{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Clear Filters */}
      <Button
        variant="outline"
        onClick={() => {
          setCategoryId(null);
          setSearchQuery('');
          setPriceRange([0, 10000000]);
          setSortBy('newest');
        }}
        className="w-full"
      >
        <X className="mr-2 h-4 w-4" />
        Xóa bộ lọc
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Mobile First */}
      <div className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Sản phẩm</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Tìm thấy <span className="font-semibold text-foreground">{total}</span> sản phẩm
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <Card className="sticky top-24">
              <CardContent className="p-6">
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
                        Bộ lọc
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Bộ lọc sản phẩm</SheetTitle>
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
                  ? 'grid-cols-2 lg:grid-cols-4' 
                  : 'grid-cols-2'
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
                    ? 'grid-cols-2 lg:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {products.map((product: any) => (
                    <Link
                      key={product.id}
                      href={`/san-pham/${product.slug}`}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow group overflow-hidden">
                        <CardContent className="p-0">
                          <div className={viewMode === 'grid' ? '' : 'sm:flex sm:gap-4'}>
                            {/* Product Image */}
                            <div className={`relative overflow-hidden ${
                              viewMode === 'grid' 
                                ? 'aspect-square' 
                                : 'aspect-square sm:w-48 sm:flex-shrink-0'
                            }`}>
                              <ProductImage
                                src={product.thumbnail}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              {/* Badges */}
                              <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
                                {product.originalPrice && product.price < product.originalPrice && (
                                  <Badge variant="destructive" className="font-bold">
                                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                  </Badge>
                                )}
                                {product.isFeatured && (
                                  <Badge className="bg-yellow-500 hover:bg-yellow-600">HOT</Badge>
                                )}
                              </div>
                              <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                                {product.isNewArrival && (
                                  <Badge className="bg-green-500 hover:bg-green-600">MỚI</Badge>
                                )}
                                {product.isBestSeller && (
                                  <Badge className="bg-purple-500 hover:bg-purple-600">BÁN CHẠY</Badge>
                                )}
                              </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-4 flex-1 flex flex-col">
                              <h3 className="font-semibold text-sm sm:text-base line-clamp-2 mb-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
                                {product.name}
                              </h3>
                              
                              {/* Category & SKU */}
                              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                                <span>{product.category?.name}</span>
                                {product.sku && (
                                  <span className="font-mono">SKU: {product.sku}</span>
                                )}
                              </div>

                              {/* Origin & Unit */}
                              {(product.origin || product.unit) && (
                                <div className="flex flex-wrap gap-1 text-xs text-muted-foreground mb-2">
                                  {product.origin && (
                                    <Badge variant="outline" className="text-xs">
                                      📍 {product.origin}
                                    </Badge>
                                  )}
                                  {product.unit && (
                                    <Badge variant="outline" className="text-xs">
                                      {product.unit}
                                    </Badge>
                                  )}
                                </div>
                              )}

                              {/* Price */}
                              <div className="mb-3">
                                <div className="flex items-baseline gap-2 flex-wrap">
                                  <span className="text-lg sm:text-xl font-bold text-primary">
                                    {formatPrice(product.price)}
                                  </span>
                                  {product.originalPrice && product.price < product.originalPrice && (
                                    <span className="text-xs sm:text-sm text-muted-foreground line-through">
                                      {formatPrice(product.originalPrice)}
                                    </span>
                                  )}
                                </div>
                                {product.unit && (
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    {formatPrice(product.price)}/{product.unit}
                                  </div>
                                )}
                              </div>

                              {/* Stock Status */}
                              <div className="text-xs mb-3">
                                {product.stock > 0 ? (
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-green-600 border-green-600">
                                      ✓ Còn hàng
                                    </Badge>
                                    <span className="text-muted-foreground">
                                      ({product.stock} {product.unit || 'sp'})
                                    </span>
                                  </div>
                                ) : (
                                  <Badge variant="outline" className="text-destructive border-destructive">
                                    ✗ Hết hàng
                                  </Badge>
                                )}
                              </div>

                              {/* Product Attributes */}
                              {product.attributes && typeof product.attributes === 'object' && Object.keys(product.attributes).length > 0 && (
                                <div className="mb-3 flex flex-wrap gap-1">
                                  {Object.entries(product.attributes).slice(0, 3).map(([key, value]: [string, any]) => (
                                    value && (
                                      <Badge
                                        key={key}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {key === 'organic' && value ? '🌱 Hữu cơ' :
                                         key === 'pesticide_free' && value ? '🚫 Không thuốc' :
                                         key === 'fresh' && value ? '🍃 Tươi mới' :
                                         `${key}`}
                                      </Badge>
                                    )
                                  ))}
                                </div>
                              )}

                              {/* Actions */}
                              <div className="flex gap-2 mt-auto">
                                <AddToCartButton
                                  productId={product.id}
                                  productName={product.name}
                                  quantity={1}
                                  disabled={product.stock === 0}
                                  size="sm"
                                  fullWidth
                                  className="flex-1"
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled
                                  className="opacity-50"
                                  title="Chức năng đang phát triển"
                                >
                                  <Heart className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
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
                  <p className="text-muted-foreground">Không tìm thấy sản phẩm nào</p>
                  <Button
                    variant="link"
                    onClick={() => {
                      setCategoryId(null);
                      setSearchQuery('');
                      setPriceRange([0, 10000000]);
                    }}
                    className="mt-2"
                  >
                    Xóa bộ lọc
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
