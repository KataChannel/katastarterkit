'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { GET_PRODUCT_BY_SLUG, ADD_TO_CART, GET_CART } from '@/graphql/ecommerce.queries';
import {
  ShoppingCart,
  Heart,
  Star,
  Minus,
  Plus,
  Share2,
  Truck,
  Shield,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Fetch product
  const { data, loading, error } = useQuery(GET_PRODUCT_BY_SLUG, {
    variables: { slug },
    skip: !slug,
  });

  // Add to cart mutation
  const [addToCart, { loading: adding }] = useMutation(ADD_TO_CART, {
    refetchQueries: [{ query: GET_CART }],
    onCompleted: (data) => {
      if (data.addToCart.success) {
        toast.success('Đã thêm vào giỏ hàng!');
      } else {
        toast.error(data.addToCart.message || 'Có lỗi xảy ra');
      }
    },
    onError: (error) => {
      toast.error('Không thể thêm vào giỏ hàng: ' + error.message);
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !data?.productBySlug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy sản phẩm
          </h1>
          <button
            onClick={() => router.push('/products')}
            className="text-blue-600 hover:underline"
          >
            ← Quay lại danh sách sản phẩm
          </button>
        </div>
      </div>
    );
  }

  const product = data.productBySlug;
  const images = [product.featuredImage, ...(product.images || [])].filter(Boolean);
  const currentVariant = selectedVariant
    ? product.variants?.find((v: any) => v.id === selectedVariant)
    : null;
  const effectivePrice = currentVariant?.price || product.finalPrice;
  const effectiveStock = currentVariant?.stock ?? product.stock;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleAddToCart = async () => {
    if (effectiveStock === 0) {
      toast.error('Sản phẩm đã hết hàng');
      return;
    }

    if (quantity > effectiveStock) {
      toast.error(`Chỉ còn ${effectiveStock} sản phẩm`);
      return;
    }

    try {
      await addToCart({
        variables: {
          input: {
            productId: product.id,
            variantId: selectedVariant,
            quantity,
          },
        },
      });
    } catch (err) {
      // Error handled by onError
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-blue-600">
              Sản phẩm
            </Link>
            {product.category && (
              <>
                <span>/</span>
                <Link
                  href={`/products?category=${product.category.id}`}
                  className="hover:text-blue-600"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg shadow-sm p-6">
          {/* Images */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-gray-100">
              {images[selectedImage] && (
                <Image
                  src={images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                />
              )}
              {product.discount > 0 && (
                <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-md font-bold">
                  -{product.discount}%
                </span>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition ${
                      selectedImage === index
                        ? 'border-blue-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-gray-600">
                  {product.rating.toFixed(1)} ({product.reviewCount} đánh giá)
                </span>
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">{product.viewCount} lượt xem</span>
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-blue-600">
                  {formatPrice(effectivePrice)}
                </span>
                {product.compareAtPrice > product.finalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-gray-700 mb-6">{product.shortDescription}</p>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Chọn phân loại:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant: any) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      className={`px-4 py-2 border rounded-md transition ${
                        selectedVariant === variant.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                          : 'border-gray-300 hover:border-gray-400'
                      } ${variant.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={variant.stock === 0}
                    >
                      {variant.name}
                      {variant.stock === 0 && ' (Hết hàng)'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Số lượng:
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-50 transition"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-x border-gray-300 py-2"
                    min="1"
                    max={effectiveStock}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(effectiveStock, quantity + 1))}
                    className="p-2 hover:bg-gray-50 transition"
                    disabled={quantity >= effectiveStock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {effectiveStock > 0 ? `${effectiveStock} sản phẩm có sẵn` : 'Hết hàng'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={effectiveStock === 0 || adding}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium"
              >
                <ShoppingCart className="h-5 w-5" />
                {adding ? 'Đang thêm...' : 'Thêm vào giỏ'}
              </button>
              <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium">
                Mua ngay
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Heart className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <Truck className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Giao hàng nhanh</p>
                  <p className="text-xs text-gray-500">2-3 ngày</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Bảo hành</p>
                  <p className="text-xs text-gray-500">12 tháng</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw className="h-6 w-6 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Đổi trả</p>
                  <p className="text-xs text-gray-500">Trong 7 ngày</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 bg-white rounded-lg shadow-sm">
          <div className="border-b">
            <div className="flex gap-8 px-6">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 border-b-2 transition ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600 font-medium'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'description' && 'Mô tả'}
                  {tab === 'specifications' && 'Thông số kỹ thuật'}
                  {tab === 'reviews' && `Đánh giá (${product.reviewCount})`}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description || 'Chưa có mô tả' }}
              />
            )}
            {activeTab === 'specifications' && (
              <div>
                {product.specifications ? (
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="border-b pb-2">
                        <dt className="text-sm font-medium text-gray-900">{key}</dt>
                        <dd className="mt-1 text-sm text-gray-600">{value as string}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="text-gray-500">Chưa có thông số kỹ thuật</p>
                )}
              </div>
            )}
            {activeTab === 'reviews' && (
              <div>
                <p className="text-gray-500">Chức năng đánh giá đang được phát triển</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {product.relatedProducts.map((related: any) => (
                <Link
                  key={related.id}
                  href={`/products/${related.slug}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-4"
                >
                  <div className="relative aspect-square rounded-md overflow-hidden mb-3">
                    <Image
                      src={related.featuredImage || '/placeholder-product.jpg'}
                      alt={related.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                    {related.name}
                  </h3>
                  <p className="text-blue-600 font-bold">{formatPrice(related.finalPrice)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
