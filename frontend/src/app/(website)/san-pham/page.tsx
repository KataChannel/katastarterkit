'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { GET_PRODUCTS, GET_PRODUCT_CATEGORIES } from '@/graphql/ecommerce.queries';
import { ShoppingCart, Heart, Star, ChevronDown, Filter, Search } from 'lucide-react';
import { ProductImage } from '@/components/ui/product-image';
import { AddToCartButton } from '@/components/ecommerce/AddToCartButton';

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [showFilters, setShowFilters] = useState(true);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Sản phẩm</h1>
          <p className="mt-2 text-gray-600">
            Tìm thấy {total} sản phẩm
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm kiếm
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm sản phẩm..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Danh mục
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setCategoryId(null)}
                    className={`w-full text-left px-3 py-2 rounded-md transition ${
                      categoryId === null
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Tất cả
                  </button>
                  {categories.map((category: any) => (
                    <button
                      key={category.id}
                      onClick={() => setCategoryId(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-md transition ${
                        categoryId === category.id
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {category.name}
                      <span className="text-xs text-gray-500 ml-2">
                        ({category._count?.products || 0})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Khoảng giá
                </h3>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="10000000"
                    step="100000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{formatPrice(0)}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setCategoryId(null);
                  setSearchQuery('');
                  setPriceRange([0, 10000000]);
                  setSortBy('newest');
                }}
                className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition"
              >
                Xóa bộ lọc
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Filter className="h-5 w-5" />
                Bộ lọc
              </button>

              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-700">Sắp xếp:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price_asc">Giá thấp đến cao</option>
                  <option value="price_desc">Giá cao đến thấp</option>
                  <option value="popular">Phổ biến nhất</option>
                  <option value="rating">Đánh giá cao</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                Có lỗi xảy ra: {error.message}
              </div>
            )}

            {/* Products Grid */}
            {!loading && products.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product: any) => (
                    <Link
                      key={product.id}
                      href={`${process.env.NEXT_PUBLIC_APP_URL || ''}/san-pham/${product.slug}`}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition group"
                    >
                      {/* Product Image */}
                      <div className="relative aspect-square overflow-hidden rounded-t-lg">
                        <ProductImage
                          src={product.thumbnail}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-300"
                        />
                        {/* Discount Badge */}
                        {product.originalPrice && product.price < product.originalPrice && (
                          <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10">
                            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                          </span>
                        )}
                        {/* Featured Badge */}
                        {product.isFeatured && (
                          <span className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10">
                            HOT
                          </span>
                        )}
                        {/* New Arrival Badge */}
                        {product.isNewArrival && (
                          <span className="absolute top-12 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10">
                            MỚI
                          </span>
                        )}
                        {/* Best Seller Badge */}
                        {product.isBestSeller && (
                          <span className="absolute top-22 left-2 bg-purple-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10">
                            BÁN CHẠY
                          </span>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[3rem]">
                          {product.name}
                        </h3>
                        
                        {/* Category & SKU */}
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span>{product.category?.name}</span>
                          {product.sku && (
                            <span className="font-mono">SKU: {product.sku}</span>
                          )}
                        </div>

                        {/* Origin */}
                        {product.origin && (
                          <p className="text-xs text-gray-600 mb-2">
                            📍 Xuất xứ: {product.origin}
                          </p>
                        )}

                        {/* Unit */}
                        {product.unit && (
                          <p className="text-xs text-gray-500 mb-2">
                            Đơn vị: {product.unit}
                          </p>
                        )}

                        {/* Price */}
                        <div className="mb-3">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-lg font-bold text-blue-600">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && product.price < product.originalPrice && (
                              <span className="text-sm text-gray-400 line-through">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          {product.unit && (
                            <div className="text-xs text-gray-500 mt-1">
                              {formatPrice(product.price)}/{product.unit}
                            </div>
                          )}
                        </div>

                        {/* Stock Status */}
                        <div className="text-xs mb-3">
                          {product.stock > 0 ? (
                            <div className="flex items-center gap-2">
                              <span className="text-green-600 font-medium">
                                ✓ Còn hàng
                              </span>
                              <span className="text-gray-500">
                                ({product.stock} {product.unit || 'sản phẩm'})
                              </span>
                            </div>
                          ) : (
                            <span className="text-red-600 font-medium">✗ Hết hàng</span>
                          )}
                        </div>

                        {/* Product Attributes (if any) */}
                        {product.attributes && typeof product.attributes === 'object' && Object.keys(product.attributes).length > 0 && (
                          <div className="mb-3 flex flex-wrap gap-1">
                            {Object.entries(product.attributes).slice(0, 3).map(([key, value]: [string, any]) => (
                              value && (
                                <span
                                  key={key}
                                  className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full"
                                  title={`${key}: ${value}`}
                                >
                                  {key === 'organic' && value ? '🌱 Hữu cơ' :
                                   key === 'pesticide_free' && value ? '🚫 Không thuốc' :
                                   key === 'fresh' && value ? '🍃 Tươi mới' :
                                   `${key}`}
                                </span>
                              )
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          <AddToCartButton
                            productId={product.id}
                            productName={product.name}
                            quantity={1}
                            disabled={product.stock === 0}
                            size="sm"
                            fullWidth
                          >
                            <span className="flex items-center gap-1.5">
                              <ShoppingCart className="h-3.5 w-3.5" />
                              Thêm
                            </span>
                          </AddToCartButton>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              // Wishlist disabled - backend not implemented
                            }}
                            disabled
                            className="p-2 border border-gray-300 rounded-md opacity-50 cursor-not-allowed"
                            title="Chức năng đang phát triển"
                          >
                            <Heart className="h-5 w-5 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-8 flex justify-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>
                  <span className="px-4 py-2 text-gray-700">
                    Trang {page}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={!hasMore}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </div>
              </>
            )}

            {/* Empty State */}
            {!loading && products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
