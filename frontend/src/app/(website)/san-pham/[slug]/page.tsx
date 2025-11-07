'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  GET_PRODUCT_BY_SLUG, 
  ADD_TO_CART, 
  GET_CART,
} from '@/graphql/ecommerce.queries';
import { ProductImage } from '@/components/ui/product-image';
import { ProductReviews } from '@/components/ecommerce/ProductReviews';
import { QuantitySelector } from '@/components/ecommerce/QuantitySelector';
import { PriceDisplay } from '@/components/ecommerce/PriceDisplay';
import { AddToCartButton } from '@/components/ecommerce/AddToCartButton';
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
  Home,
  Package,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { toast } = useToast();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Fetch product
  const { data, loading, error } = useQuery(GET_PRODUCT_BY_SLUG, {
    variables: { slug },
    skip: !slug,
  });

  // Add to cart mutation - now handled by AddToCartButton component
  // const [addToCart, { loading: adding }] = useMutation(ADD_TO_CART, {
  //   refetchQueries: [{ query: GET_CART }],
  //   onCompleted: (data) => {
  //     if (data.addToCart.success) {
  //       toast({
  //         title: 'Thành công',
  //         description: 'Đã thêm vào giỏ hàng!',
  //         type: 'success',
  //       });
  //     } else {
  //       toast({
  //         title: 'Lỗi',
  //         description: data.addToCart.message || 'Có lỗi xảy ra',
  //         type: 'error',
  //         variant: 'destructive',
  //       });
  //     }
  //   },
  //   onError: (error) => {
  //     toast({
  //       title: 'Lỗi',
  //       description: 'Không thể thêm vào giỏ hàng: ' + error.message,
  //       type: 'error',
  //       variant: 'destructive',
  //     });
  //   },
  // });

  // Wishlist mutations (disabled - backend not implemented)
  // const [addToWishlist, { loading: addingToWishlist }] = useMutation(ADD_TO_WISHLIST, {
  //   onCompleted: () => {
  //     setIsInWishlist(true);
  //     toast({
  //       title: 'Đã thêm vào yêu thích',
  //       description: 'Sản phẩm đã được lưu vào danh sách yêu thích',
  //       type: 'success',
  //     });
  //   },
  //   onError: (error) => {
  //     toast({
  //       title: 'Lỗi',
  //       description: error.message,
  //       type: 'error',
  //       variant: 'destructive',
  //     });
  //   },
  // });

  // const [removeFromWishlist, { loading: removingFromWishlist }] = useMutation(REMOVE_FROM_WISHLIST, {
  //   onCompleted: () => {
  //     setIsInWishlist(false);
  //     toast({
  //       title: 'Đã xóa khỏi yêu thích',
  //       description: 'Sản phẩm đã được xóa khỏi danh sách yêu thích',
  //       type: 'success',
  //     });
  //   },
  //   onError: (error) => {
  //     toast({
  //       title: 'Lỗi',
  //       description: error.message,
  //       type: 'error',
  //       variant: 'destructive',
  //     });
  //   },
  // });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !data?.productBySlug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <h1 className="text-2xl font-bold mb-2">
              Không tìm thấy sản phẩm
            </h1>
            <Button
              variant="link"
              onClick={() => router.push('/san-pham')}
            >
              ← Quay lại danh sách sản phẩm
            </Button>
          </CardContent>
        </Card>
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

  // handleAddToCart - now handled by AddToCartButton component
  // const handleAddToCart = async () => {
  //   if (effectiveStock === 0) {
  //     toast({
  //       title: 'Không thể thêm',
  //       description: 'Sản phẩm đã hết hàng',
  //       type: 'error',
  //       variant: 'destructive',
  //     });
  //     return;
  //   }

  //   if (quantity > effectiveStock) {
  //     toast({
  //       title: 'Số lượng không hợp lệ',
  //       description: `Chỉ còn ${effectiveStock} sản phẩm`,
  //       type: 'error',
  //       variant: 'destructive',
  //     });
  //     return;
  //   }

  //   try {
  //     await addToCart({
  //       variables: {
  //         input: {
  //           productId: product.id,
  //           variantId: selectedVariant,
  //           quantity,
  //         },
  //       },
  //     });
  //   } catch (err) {
  //     // Error handled by onError
  //   }
  // };

  // const handleToggleWishlist = async () => {
  //   try {
  //     if (isInWishlist) {
  //       await removeFromWishlist({
  //         variables: { productId: product.id },
  //       });
  //     } else {
  //       await addToWishlist({
  //         variables: { productId: product.id },
  //       });
  //     }
  //   } catch (err) {
  //     // Error handled by onError
  //   }
  // };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb - Mobile First */}
      <div className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumb>
            <BreadcrumbList className="flex-wrap">
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <Home className="h-4 w-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/san-pham">Sản phẩm</BreadcrumbLink>
              </BreadcrumbItem>
              {product.category && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem className="hidden sm:block">
                    <BreadcrumbLink href={`/san-pham?category=${product.category.slug}`}>
                      {product.category.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator className="hidden sm:block" />
              <BreadcrumbItem className="hidden sm:block">
                <BreadcrumbPage className="line-clamp-1">{product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Product Detail */}
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Images Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-square bg-muted">
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
                      <Package className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                    {discountPercent > 0 && (
                      <Badge variant="destructive" className="text-base font-bold">
                        -{discountPercent}%
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    {product.isBestSeller && (
                      <Badge className="bg-yellow-500 hover:bg-yellow-600">Bán chạy</Badge>
                    )}
                    {product.isNewArrival && (
                      <Badge className="bg-green-500 hover:bg-green-600">Mới</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === index
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <ProductImage src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">{product.name}</h1>

              {/* Rating & Stats */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < 4
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-muted-foreground">4.0</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-muted-foreground">{product.viewCount || 0} lượt xem</span>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-muted-foreground">Đã bán: {product.soldCount || 0}</span>
              </div>
            </div>

            {/* Product Meta */}
            <div className="flex flex-wrap gap-2">
              {product.sku && (
                <Badge variant="secondary">SKU: {product.sku}</Badge>
              )}
              {product.origin && (
                <Badge variant="secondary">Xuất xứ: {product.origin}</Badge>
              )}
              {product.unit && (
                <Badge variant="secondary">Đơn vị: {product.unit}</Badge>
              )}
              {product.weight && (
                <Badge variant="secondary">Trọng lượng: {product.weight}g</Badge>
              )}
            </div>

            {/* Price */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-bold text-primary">
                    {formatPrice(effectivePrice)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-lg sm:text-xl text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <Badge variant="destructive">
                        Tiết kiệm {formatPrice(product.originalPrice - product.price)}
                      </Badge>
                    </>
                  )}
                </div>
                {product.profitMargin && (
                  <p className="text-xs text-muted-foreground mt-2">
                    * Lợi nhuận ước tính: {product.profitMargin.toFixed(1)}%
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Short Description */}
            {product.shortDesc && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <p className="text-sm sm:text-base">{product.shortDesc}</p>
                </CardContent>
              </Card>
            )}

            {/* Attributes */}
            {product.attributes && Object.keys(product.attributes).length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Đặc điểm nổi bật:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(product.attributes).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      <Badge variant="outline" className="gap-1">
                        <span className="text-green-600">✓</span>
                        <span>{key}: <strong>{String(value)}</strong></span>
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Chọn phân loại:</Label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant: any) => (
                    <Button
                      key={variant.id}
                      variant={selectedVariant === variant.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedVariant(variant.id)}
                      disabled={variant.stock === 0 || !variant.isActive}
                      className="flex flex-col h-auto py-2"
                    >
                      <span>{variant.name}</span>
                      {variant.sku && <span className="text-xs opacity-70">SKU: {variant.sku}</span>}
                      {variant.price !== product.price && (
                        <span className="text-xs font-semibold mt-1">
                          {formatPrice(variant.price)}
                        </span>
                      )}
                      {variant.stock === 0 && <span className="text-xs text-destructive">(Hết hàng)</span>}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Quantity */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Số lượng:</Label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center bg-transparent py-2 text-sm font-medium"
                    min="1"
                    max={effectiveStock}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(effectiveStock, quantity + 1))}
                    disabled={quantity >= effectiveStock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {effectiveStock > 0 ? (
                    <>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {effectiveStock} sản phẩm có sẵn
                      </Badge>
                    </>
                  ) : (
                    <Badge variant="destructive">Hết hàng</Badge>
                  )}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <AddToCartButton
                productId={product.id}
                productName={product.name}
                quantity={quantity}
                variantId={selectedVariant || undefined}
                disabled={effectiveStock === 0}
                size="lg"
                fullWidth
                className="flex-1 h-12 sm:h-11"
              />
              <Button 
                variant="outline"
                size="lg"
                onClick={() => router.push('/thanh-toan')}
                className="flex-1 h-12 sm:h-11"
              >
                Mua ngay
              </Button>
              <Button 
                variant="outline"
                size="lg"
                disabled
                className="opacity-50 h-12 sm:h-11"
                title="Chức năng đang phát triển"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Features */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Truck className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Giao hàng nhanh</p>
                      <p className="text-xs text-muted-foreground">2-3 ngày</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Shield className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Bảo hành</p>
                      <p className="text-xs text-muted-foreground">12 tháng</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <RefreshCw className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Đổi trả</p>
                      <p className="text-xs text-muted-foreground">Trong 7 ngày</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Card className="mt-6 sm:mt-8">
          <Tabs defaultValue="description" className="w-full">
            <CardContent className="p-0">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto">
                <TabsTrigger 
                  value="description"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 sm:px-6 py-3 sm:py-4"
                >
                  Mô tả
                </TabsTrigger>
                <TabsTrigger 
                  value="specifications"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 sm:px-6 py-3 sm:py-4"
                >
                  Thông số
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 sm:px-6 py-3 sm:py-4"
                >
                  Đánh giá ({product.reviewCount || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="p-4 sm:p-6">
                <div className="prose prose-sm sm:prose max-w-none dark:prose-invert">
                  {product.description ? (
                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                  ) : (
                    <p className="text-muted-foreground">Chưa có mô tả chi tiết</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="p-4 sm:p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Thông tin sản phẩm</h3>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.sku && (
                      <div className="border-b pb-3">
                        <dt className="text-sm font-medium text-muted-foreground">Mã SKU</dt>
                        <dd className="mt-1 text-sm font-semibold">{product.sku}</dd>
                      </div>
                    )}
                    {product.barcode && (
                      <div className="border-b pb-3">
                        <dt className="text-sm font-medium text-muted-foreground">Mã vạch</dt>
                        <dd className="mt-1 text-sm font-semibold">{product.barcode}</dd>
                      </div>
                    )}
                    {product.origin && (
                      <div className="border-b pb-3">
                        <dt className="text-sm font-medium text-muted-foreground">Xuất xứ</dt>
                        <dd className="mt-1 text-sm font-semibold">{product.origin}</dd>
                      </div>
                    )}
                    {product.unit && (
                      <div className="border-b pb-3">
                        <dt className="text-sm font-medium text-muted-foreground">Đơn vị tính</dt>
                        <dd className="mt-1 text-sm font-semibold">{product.unit}</dd>
                      </div>
                    )}
                    {product.weight && (
                      <div className="border-b pb-3">
                        <dt className="text-sm font-medium text-muted-foreground">Trọng lượng</dt>
                        <dd className="mt-1 text-sm font-semibold">{product.weight} gram</dd>
                      </div>
                    )}
                    <div className="border-b pb-3">
                      <dt className="text-sm font-medium text-muted-foreground">Tồn kho</dt>
                      <dd className="mt-1 text-sm font-semibold">{product.stock} {product.unit || 'sản phẩm'}</dd>
                    </div>
                    {product.minStock && (
                      <div className="border-b pb-3">
                        <dt className="text-sm font-medium text-muted-foreground">Tồn kho tối thiểu</dt>
                        <dd className="mt-1 text-sm font-semibold">{product.minStock}</dd>
                      </div>
                    )}
                    {product.attributes && Object.keys(product.attributes).length > 0 && (
                      <>
                        {Object.entries(product.attributes).map(([key, value]) => (
                          <div key={key} className="border-b pb-3">
                            <dt className="text-sm font-medium text-muted-foreground">{key}</dt>
                            <dd className="mt-1 text-sm font-semibold">{String(value)}</dd>
                          </div>
                        ))}
                      </>
                    )}
                  </dl>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="p-4 sm:p-6">
                <ProductReviews productId={product.id} canReview={true} />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* Related Products */}
        {product.category && (
          <div className="mt-6 sm:mt-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              Sản phẩm cùng danh mục: {product.category.name}
            </h2>
            <Card>
              <CardContent className="p-4 sm:p-6 text-center text-muted-foreground">
                <p className="text-sm">Các sản phẩm liên quan sẽ được hiển thị ở đây (đang phát triển)</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
