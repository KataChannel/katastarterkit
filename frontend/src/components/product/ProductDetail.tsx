'use client';

import React from 'react';
import { Product, ProductVariant } from '@/graphql/product.queries';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingCart,
  Heart,
  Share2,
  Package,
  Truck,
  ShieldCheck,
  Star,
  Minus,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductDetailProps {
  product: Product;
  onAddToCart?: (product: Product, quantity: number, variant?: ProductVariant) => void;
  onToggleFavorite?: (product: Product) => void;
  className?: string;
}

const UNIT_LABELS: Record<string, string> = {
  KG: 'kg',
  G: 'g',
  BUNDLE: 'bó',
  PIECE: 'củ',
  BAG: 'túi',
  BOX: 'hộp',
};

export function ProductDetail({
  product,
  onAddToCart,
  onToggleFavorite,
  className,
}: ProductDetailProps) {
  const [quantity, setQuantity] = React.useState(1);
  const [selectedVariant, setSelectedVariant] = React.useState<ProductVariant | undefined>(
    product.variants?.[0]
  );
  const [selectedImage, setSelectedImage] = React.useState(
    product.thumbnail || product.images?.[0]?.url || '/placeholder-product.png'
  );
  const [isFavorite, setIsFavorite] = React.useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const currentPrice = selectedVariant?.price || product.price;
  const currentComparePrice = product.originalPrice;
  const currentStock = selectedVariant?.stock || product.stock;
  const currentUnit = product.unit;

  const isOutOfStock = currentStock === 0;
  const isLowStock = currentStock > 0 && currentStock <= product.minStock;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= currentStock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    onAddToCart?.(product, quantity, selectedVariant);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    onToggleFavorite?.(product);
  };

  const images = product.images && product.images.length > 0
    ? product.images.map((img) => img.url)
    : product.thumbnail
    ? [product.thumbnail]
    : ['/placeholder-product.png'];

  return (
    <div className={cn('grid lg:grid-cols-2 gap-8', className)}>
      {/* Image Gallery */}
      <div className="space-y-4 sticky top-4">
        {/* Main Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.originalPrice && product.originalPrice > product.price && (
            <Badge className="absolute top-4 right-4 bg-red-500 text-white text-lg px-3 py-1">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </Badge>
          )}
        </div>

        {/* Thumbnail Gallery - Horizontal Scrollable */}
        {images.length > 1 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Hình ảnh khác</p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={cn(
                    'flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all',
                    selectedImage === img
                      ? 'border-primary ring-2 ring-primary/50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                  title={`Hình ${index + 1}`}
                >
                  <img 
                    src={img} 
                    alt={`${product.name} ${index + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Image Counter */}
        <div className="text-xs text-muted-foreground text-center">
          {images.length > 0 && `${images.indexOf(selectedImage) + 1} / ${images.length}`}
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          {product.category && (
            <p className="text-sm text-muted-foreground mb-2">{product.category.name}</p>
          )}
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            {product.isNewArrival && <Badge className="bg-blue-500">Mới</Badge>}
            {product.isBestSeller && <Badge className="bg-orange-500">Bán chạy</Badge>}
            {product.isOnSale && <Badge className="bg-green-500">Giảm giá</Badge>}
            {isLowStock && <Badge variant="outline" className="text-yellow-600">Sắp hết hàng</Badge>}
          </div>
        </div>

        {/* Price */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-primary">
              {formatPrice(currentPrice)}
            </span>
            <span className="text-lg text-muted-foreground">
              / {UNIT_LABELS[currentUnit] || currentUnit}
            </span>
          </div>
          {currentComparePrice && currentComparePrice > currentPrice && (
            <div className="flex items-center gap-2">
              <span className="text-xl text-muted-foreground line-through">
                {formatPrice(currentComparePrice)}
              </span>
              <span className="text-sm text-green-600 font-medium">
                Tiết kiệm {formatPrice(currentComparePrice - currentPrice)}
              </span>
            </div>
          )}
        </div>

        {/* Specifications */}
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-sm">Thông tin sản phẩm</h3>
          <div className="space-y-2">
            {product.sku && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mã SKU:</span>
                <span className="font-medium text-right">{product.sku}</span>
              </div>
            )}
            {product.origin && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Xuất xứ:</span>
                <span className="font-medium text-right">{product.origin}</span>
              </div>
            )}
            {product.weight && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Khối lượng:</span>
                <span className="font-medium text-right">{product.weight}g</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Số lượng có sẵn:</span>
              <span className={cn(
                'font-medium',
                currentStock === 0 ? 'text-red-600' : currentStock <= product.minStock ? 'text-yellow-600' : 'text-green-600'
              )}>
                {currentStock} {UNIT_LABELS[currentUnit] || currentUnit}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.shortDesc && (
          <p className="text-lg text-muted-foreground">{product.shortDesc}</p>
        )}

        {/* Variants */}
        {product.variants && product.variants.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Chọn phân loại:</label>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <Button
                  key={variant.id}
                  variant={selectedVariant?.id === variant.id ? 'default' : 'outline'}
                  onClick={() => setSelectedVariant(variant)}
                  disabled={variant.stock === 0}
                  className="min-w-[100px]"
                >
                  {variant.name}
                  <span className="ml-2 text-xs">
                    {formatPrice(variant.price)}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Quantity */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Số lượng:</label>
          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-4 py-2 min-w-[60px] text-center font-medium">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= currentStock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-sm text-muted-foreground">
              {currentStock} sản phẩm có sẵn
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            size="lg"
            className="flex-1"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? (
              'Hết hàng'
            ) : (
              <>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Thêm vào giỏ - {formatPrice(currentPrice * quantity)}
              </>
            )}
          </Button>
          <Button size="lg" variant="outline" onClick={handleToggleFavorite}>
            <Heart className={cn('h-5 w-5', isFavorite && 'fill-red-500 text-red-500')} />
          </Button>
          <Button size="lg" variant="outline">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Product Info Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="flex flex-col items-center p-4 text-center">
              <Package className="h-6 w-6 mb-2 text-primary" />
              <p className="text-xs font-medium">Đóng gói cẩn thận</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-4 text-center">
              <Truck className="h-6 w-6 mb-2 text-primary" />
              <p className="text-xs font-medium">Giao hàng nhanh</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-4 text-center">
              <ShieldCheck className="h-6 w-6 mb-2 text-primary" />
              <p className="text-xs font-medium">Đảm bảo chất lượng</p>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="description">Mô tả chi tiết</TabsTrigger>
            <TabsTrigger value="reviews">Đánh giá & Xếp hạng</TabsTrigger>
          </TabsList>
          
          {/* Description Tab */}
          <TabsContent value="description" className="mt-6 space-y-4">
            {product.description ? (
              <div className="prose prose-sm max-w-none">
                {typeof product.description === 'string' ? (
                  product.description.includes('<') ? (
                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                  ) : (
                    <p className="whitespace-pre-line">{product.description}</p>
                  )
                ) : (
                  <p className="text-muted-foreground">Chưa có mô tả chi tiết</p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Chưa có mô tả chi tiết</p>
            )}

            {/* Specifications Table */}
            {product.attributes && typeof product.attributes === 'object' && Object.keys(product.attributes).length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Thông số kỹ thuật</h4>
                <div className="border rounded-lg overflow-hidden">
                  {Object.entries(product.attributes).map(([key, value], index) => (
                    <div
                      key={key}
                      className={cn(
                        'flex items-center justify-between px-4 py-3 text-sm',
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      )}
                    >
                      <span className="font-medium text-muted-foreground capitalize">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="font-medium text-foreground">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="mt-6 space-y-6">
            <div className="flex items-center gap-8">
              {/* Overall Rating */}
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-primary mb-2">4.5</div>
                <div className="flex gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-5 w-5',
                        i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      )}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Dựa trên 12 đánh giá</p>
              </div>

              {/* Rating Breakdown */}
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-8">{stars}⭐</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{
                          width: `${stars === 5 ? 60 : stars === 4 ? 25 : stars === 3 ? 10 : 5}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8 text-right">
                      {stars === 5 ? 7 : stars === 4 ? 3 : stars === 3 ? 1 : 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4 border-t pt-6">
              <h4 className="font-semibold">Đánh giá từ khách hàng</h4>
              
              {/* Sample Reviews */}
              {[
                {
                  author: 'Nguyễn Văn A',
                  rating: 5,
                  date: '2 ngày trước',
                  title: 'Sản phẩm rất tốt',
                  comment: 'Chất lượng tốt, giao hàng nhanh, rất hài lòng với đơn hàng.',
                },
                {
                  author: 'Trần Thị B',
                  rating: 4,
                  date: '1 tuần trước',
                  title: 'Khá hài lòng',
                  comment: 'Sản phẩm đúng như mô tả. Có thể cộng hơi chậm một chút.',
                },
              ].map((review, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{review.author}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'h-4 w-4',
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="font-medium text-sm mb-1">{review.title}</p>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>
              ))}

              <Button variant="outline" className="w-full mt-4">
                Xem thêm đánh giá
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
