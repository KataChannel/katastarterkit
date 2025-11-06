'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  GET_PRODUCT_BY_SLUG, 
  ADD_TO_CART, 
  GET_CART,
  ADD_TO_WISHLIST,
  REMOVE_FROM_WISHLIST,
} from '@/graphql/ecommerce.queries';
import { ProductImage } from '@/components/ui/product-image';
import { ProductReviews } from '@/components/ecommerce/ProductReviews';
import { QuantitySelector } from '@/components/ecommerce/QuantitySelector';
import { PriceDisplay } from '@/components/ecommerce/PriceDisplay';
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
import { useToast } from '@/hooks/use-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { toast } = useToast();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isInWishlist, setIsInWishlist] = useState(false);

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
        toast({
          title: 'Thành công',
          description: 'Đã thêm vào giỏ hàng!',
          type: 'success',
        });
      } else {
        toast({
          title: 'Lỗi',
          description: data.addToCart.message || 'Có lỗi xảy ra',
          type: 'error',
          variant: 'destructive',
        });
      }
    },
    onError: (error) => {
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm vào giỏ hàng: ' + error.message,
        type: 'error',
        variant: 'destructive',
      });
    },
  });

  // Wishlist mutations
  const [addToWishlist, { loading: addingToWishlist }] = useMutation(ADD_TO_WISHLIST, {
    onCompleted: () => {
      setIsInWishlist(true);
      toast({
        title: 'Đã thêm vào yêu thích',
        description: 'Sản phẩm đã được lưu vào danh sách yêu thích',
        type: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: 'Lỗi',
        description: error.message,
        type: 'error',
        variant: 'destructive',
      });
    },
  });

  const [removeFromWishlist, { loading: removingFromWishlist }] = useMutation(REMOVE_FROM_WISHLIST, {
    onCompleted: () => {
      setIsInWishlist(false);
      toast({
        title: 'Đã xóa khỏi yêu thích',
        description: 'Sản phẩm đã được xóa khỏi danh sách yêu thích',
        type: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: 'Lỗi',
        description: error.message,
        type: 'error',
        variant: 'destructive',
      });
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
            onClick={() => router.push('/san-pham')}
            className="text-blue-600 hover:underline"
          >
            ← Quay lại danh sách sản phẩm
          </button>
        </div>
      </div>
    );
  }

  const product = data.productBySlug;
  
  // Sử dụng images từ database, với thumbnail làm ảnh đầu tiên
  const productImages = product.images && product.images.length > 0 
    ? [...product.images].sort((a: any, b: any) => a.order - b.order).map((img: any) => img.url)
    : [];
  const images = product.thumbnail 
    ? [product.thumbnail, ...productImages.filter((img: string) => img !== product.thumbnail)]
    : productImages;
  
  const currentVariant = selectedVariant
    ? product.variants?.find((v: any) => v.id === selectedVariant)
    : null;
  const effectivePrice = currentVariant?.price || product.price;
  const effectiveStock = currentVariant?.stock ?? product.stock;
  
  // Tính % giảm giá
  const discountPercent = product.discountPercentage || 
    (product.originalPrice && product.price < product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleAddToCart = async () => {
    if (effectiveStock === 0) {
      toast({
        title: 'Không thể thêm',
        description: 'Sản phẩm đã hết hàng',
        type: 'error',
        variant: 'destructive',
      });
      return;
    }

    if (quantity > effectiveStock) {
      toast({
        title: 'Số lượng không hợp lệ',
        description: `Chỉ còn ${effectiveStock} sản phẩm`,
        type: 'error',
        variant: 'destructive',
      });
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

  const handleToggleWishlist = async () => {
    try {
      if (isInWishlist) {
        await removeFromWishlist({
          variables: { productId: product.id },
        });
      } else {
        await addToWishlist({
          variables: { productId: product.id },
        });
      }
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
                  href={`/san-pham?category=${product.category.slug}`}
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
              {images.length > 0 ? (
                <ProductImage
                  src={images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-gray-400">Chưa có hình ảnh</span>
                </div>
              )}
              {discountPercent > 0 && (
                <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-md font-bold z-10">
                  -{discountPercent}%
                </span>
              )}
              {product.isBestSeller && (
                <span className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-md font-bold z-10">
                  Bán chạy
                </span>
              )}
              {product.isNewArrival && (
                <span className="absolute top-14 left-4 bg-green-500 text-white px-3 py-1 rounded-md font-bold z-10">
                  Mới
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
                    <ProductImage src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
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
                      i < 4 // Default 4 stars nếu chưa có review system
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-gray-600">
                  4.0 (Sắp có đánh giá)
                </span>
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">{product.viewCount || 0} lượt xem</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Đã bán: {product.soldCount || 0}</span>
            </div>

            {/* Product Info */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.sku && (
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-md">
                  SKU: <span className="font-medium">{product.sku}</span>
                </span>
              )}
              {product.origin && (
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-md">
                  Xuất xứ: <span className="font-medium">{product.origin}</span>
                </span>
              )}
              {product.unit && (
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-md">
                  Đơn vị: <span className="font-medium">{product.unit}</span>
                </span>
              )}
              {product.weight && (
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-md">
                  Trọng lượng: <span className="font-medium">{product.weight}g</span>
                </span>
              )}
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-blue-600">
                  {formatPrice(effectivePrice)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-sm text-red-600 font-medium">
                      Tiết kiệm {formatPrice(product.originalPrice - product.price)}
                    </span>
                  </>
                )}
              </div>
              {product.profitMargin && (
                <p className="text-xs text-gray-500 mt-1">
                  * Lợi nhuận ước tính: {product.profitMargin.toFixed(1)}%
                </p>
              )}
            </div>

            {/* Short Description */}
            {product.shortDesc && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="text-gray-700">{product.shortDesc}</p>
              </div>
            )}

            {/* Attributes - Hiển thị thuộc tính sản phẩm từ JSON */}
            {product.attributes && Object.keys(product.attributes).length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Đặc điểm nổi bật:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(product.attributes).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      <span className="text-green-600">✓</span>
                      <span className="text-gray-700">
                        {key}: <span className="font-medium">{String(value)}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
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
                      disabled={variant.stock === 0 || !variant.isActive}
                    >
                      <div className="flex flex-col items-start">
                        <span>{variant.name}</span>
                        {variant.sku && <span className="text-xs text-gray-500">SKU: {variant.sku}</span>}
                        {variant.price !== product.price && (
                          <span className="text-xs text-blue-600 font-medium">
                            {formatPrice(variant.price)}
                          </span>
                        )}
                      </div>
                      {variant.stock === 0 && <span className="text-xs text-red-500 ml-2">(Hết hàng)</span>}
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
              <button 
                onClick={() => router.push('/thanh-toan')}
                className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
              >
                Mua ngay
              </button>
              <button 
                onClick={handleToggleWishlist}
                disabled={addingToWishlist || removingFromWishlist}
                className={`p-3 border rounded-lg transition ${
                  isInWishlist 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Heart className={`h-6 w-6 ${isInWishlist ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
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
              <div className="prose max-w-none">
                {product.description ? (
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                ) : (
                  <p className="text-gray-500">Chưa có mô tả chi tiết</p>
                )}
              </div>
            )}
            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin sản phẩm</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.sku && (
                    <div className="border-b pb-2">
                      <dt className="text-sm font-medium text-gray-900">Mã SKU</dt>
                      <dd className="mt-1 text-sm text-gray-600">{product.sku}</dd>
                    </div>
                  )}
                  {product.barcode && (
                    <div className="border-b pb-2">
                      <dt className="text-sm font-medium text-gray-900">Mã vạch</dt>
                      <dd className="mt-1 text-sm text-gray-600">{product.barcode}</dd>
                    </div>
                  )}
                  {product.origin && (
                    <div className="border-b pb-2">
                      <dt className="text-sm font-medium text-gray-900">Xuất xứ</dt>
                      <dd className="mt-1 text-sm text-gray-600">{product.origin}</dd>
                    </div>
                  )}
                  {product.unit && (
                    <div className="border-b pb-2">
                      <dt className="text-sm font-medium text-gray-900">Đơn vị tính</dt>
                      <dd className="mt-1 text-sm text-gray-600">{product.unit}</dd>
                    </div>
                  )}
                  {product.weight && (
                    <div className="border-b pb-2">
                      <dt className="text-sm font-medium text-gray-900">Trọng lượng</dt>
                      <dd className="mt-1 text-sm text-gray-600">{product.weight} gram</dd>
                    </div>
                  )}
                  <div className="border-b pb-2">
                    <dt className="text-sm font-medium text-gray-900">Tồn kho</dt>
                    <dd className="mt-1 text-sm text-gray-600">{product.stock} {product.unit || 'sản phẩm'}</dd>
                  </div>
                  {product.minStock && (
                    <div className="border-b pb-2">
                      <dt className="text-sm font-medium text-gray-900">Tồn kho tối thiểu</dt>
                      <dd className="mt-1 text-sm text-gray-600">{product.minStock}</dd>
                    </div>
                  )}
                  {product.attributes && Object.keys(product.attributes).length > 0 && (
                    <>
                      {Object.entries(product.attributes).map(([key, value]) => (
                        <div key={key} className="border-b pb-2">
                          <dt className="text-sm font-medium text-gray-900">{key}</dt>
                          <dd className="mt-1 text-sm text-gray-600">{String(value)}</dd>
                        </div>
                      ))}
                    </>
                  )}
                </dl>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div>
                <ProductReviews productId={product.id} canReview={true} />
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {product.category && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Sản phẩm cùng danh mục: {product.category.name}
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Các sản phẩm liên quan sẽ được hiển thị ở đây (đang phát triển)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
