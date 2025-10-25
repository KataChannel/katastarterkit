'use client';

import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import { GET_PRODUCT_BY_SLUG } from '@/graphql/product.queries';
import { ProductDetail } from '@/components/product/ProductDetail';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

interface ProductBySlugData {
  productBySlug: {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDesc: string;
    sku: string;
    barcode: string;
    price: number;
    originalPrice: number;
    costPrice: number;
    unit: string;
    stock: number;
    minStock: number;
    status: string;
    thumbnail: string;
    origin: string;
    category: {
      id: string;
      name: string;
      slug: string;
    };
    images: Array<{
      id: string;
      url: string;
      alt: string;
      isPrimary: boolean;
      order: number;
    }>;
    variants: Array<{
      id: string;
      name: string;
      sku: string;
      price: number;
      stock: number;
      order: number;
      isActive: boolean;
      attributes: Record<string, any>;
    }>;
    isFeatured: boolean;
    isNewArrival: boolean;
    isBestSeller: boolean;
    isOnSale: boolean;
    weight: number;
    attributes: Record<string, any>;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    createdAt: string;
    updatedAt: string;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data, loading, error } = useQuery<ProductBySlugData>(GET_PRODUCT_BY_SLUG, {
    variables: { slug },
    errorPolicy: 'all',
    skip: !slug,
  });

  const handleAddToCart = (product: any, quantity: number, variant?: any) => {
    console.log('Add to cart:', {
      productId: product.id,
      productName: product.name,
      quantity,
      variant: variant?.id,
      price: variant?.price || product.price,
      totalPrice: (variant?.price || product.price) * quantity,
    });
    // Implement your cart logic here
  };

  const handleToggleFavorite = (product: any) => {
    console.log('Toggle favorite:', product.id);
    // Implement your wishlist logic here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb skeleton */}
          <Skeleton className="h-6 w-32 mb-8" />

          {/* Product detail skeleton */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image gallery skeleton */}
            <div className="space-y-4">
              <Skeleton className="aspect-square rounded-lg" />
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-lg" />
                ))}
              </div>
            </div>

            {/* Product info skeleton */}
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-6 w-2/3" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.productBySlug) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <AlertCircle className="h-5 w-5" />
              <h2 className="font-semibold">Lỗi tải sản phẩm</h2>
            </div>
            <p className="text-red-600 text-sm mb-4">
              {error?.message || 'Không tìm thấy sản phẩm này.'}
            </p>
            <Link href="/website/sanpham" className="text-red-700 hover:underline text-sm font-medium">
              ← Quay lại cửa hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const product = data.productBySlug;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/website/sanpham">Sản phẩm</BreadcrumbLink>
            </BreadcrumbItem>
            {product.category && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/website/sanpham?category=${product.category.slug}`}>
                    {product.category.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Product Detail */}
        <ProductDetail
          product={product as any}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
          className="mb-16"
        />

        {/* Related Products */}
        {product.category && (
          <RelatedProducts
            categoryId={product.category.id}
            excludeProductId={product.id}
            title="Sản phẩm liên quan"
          />
        )}
      </div>
    </div>
  );
}
