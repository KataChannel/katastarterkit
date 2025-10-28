'use client';

import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import { GET_PRODUCT_BY_SLUG } from '@/graphql/queries/products';
import { BlockRenderer } from '@/components/page-builder/blocks/BlockRenderer';
import { notFound } from 'next/navigation';

interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary?: boolean;
  order?: number;
}

interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface ProductTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  price: number;
  stock: number;
  options?: any;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDesc?: string;
  price: number;
  originalPrice?: number;
  costPrice?: number;
  sku?: string;
  barcode?: string;
  stock: number;
  minStock: number;
  maxStock?: number;
  unit: string;
  status: string;
  images?: ProductImage[];
  category?: ProductCategory;
  tags?: ProductTag[];
  variants?: ProductVariant[];
  metaFields?: any;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdAt: string;
  updatedAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { data, loading, error } = useQuery<{ productBySlug: Product }>(GET_PRODUCT_BY_SLUG, {
    variables: { slug },
    skip: !slug,
    errorPolicy: 'all',
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const product = data?.productBySlug;

  if (error || !product) {
    return notFound();
  }

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Get primary image
  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <a href="/" className="hover:text-blue-600">Trang chủ</a>
          <span className="mx-2">/</span>
          <a href="/san-pham" className="hover:text-blue-600">Sản phẩm</a>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              {primaryImage ? (
                <img
                  src={primaryImage.url}
                  alt={primaryImage.alt || product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((image) => (
                  <div
                    key={image.id}
                    className="aspect-square rounded-md overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition"
                  >
                    <img
                      src={image.url}
                      alt={image.alt || product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            {product.category && (
              <div className="text-sm text-blue-600 font-medium">
                {product.category.name}
              </div>
            )}

            {/* Product Name */}
            <h1 className="text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-red-600">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            {product.shortDesc && (
              <p className="text-gray-600 leading-relaxed">
                {product.shortDesc}
              </p>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="text-sm text-green-600 font-medium">
                    Còn hàng ({product.stock} {product.unit})
                  </span>
                </>
              ) : (
                <>
                  <span className="flex h-2 w-2 rounded-full bg-red-500"></span>
                  <span className="text-sm text-red-600 font-medium">
                    Hết hàng
                  </span>
                </>
              )}
            </div>

            {/* Product Info */}
            <div className="border-t border-b border-gray-200 py-4 space-y-2">
              {product.sku && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Mã SP:</span>
                  <span className="font-medium">{product.sku}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Đơn vị:</span>
                <span className="font-medium">{product.unit}</span>
              </div>
              {product.category && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Danh mục:</span>
                  <span className="font-medium">{product.category.name}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
            </button>

            {/* Buy Now Button */}
            {product.stock > 0 && (
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition">
                Mua ngay
              </button>
            )}
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold mb-6">Mô tả chi tiết</h2>
            <div
              className="prose max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        )}

        {/* Variants */}
        {product.variants && product.variants.length > 0 && (
          <div className="border-t border-gray-200 pt-8 mt-8">
            <h2 className="text-2xl font-bold mb-6">Các phiên bản</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {product.variants.map((variant) => (
                <div
                  key={variant.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition cursor-pointer"
                >
                  <h3 className="font-semibold mb-2">{variant.name}</h3>
                  <div className="text-lg font-bold text-red-600 mb-2">
                    {formatPrice(variant.price)}
                  </div>
                  {variant.sku && (
                    <div className="text-sm text-gray-500">Mã: {variant.sku}</div>
                  )}
                  <div className="text-sm text-gray-600 mt-2">
                    Còn lại: {variant.stock}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
