'use client';

import { Suspense } from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  Mail,
  Truck,
  FileText,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { OrderStatusBadge, type OrderStatus } from '@/components/ecommerce/OrderStatusBadge';
import { PaymentMethodBadge, type PaymentMethod } from '@/components/ecommerce/PaymentMethodBadge';
import { OrderTimeline, type OrderTrackingEvent } from '@/components/ecommerce/OrderTimeline';
import { PriceDisplay } from '@/components/ecommerce/PriceDisplay';
import { Skeleton } from '@/components/ui/skeleton';
import { GET_ORDER_DETAIL } from '@/graphql/ecommerce.queries';

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: string;
  shippingMethod: string;
  customerNote?: string;
  internalNote?: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  items: Array<{
    id: string;
    productId?: string;
    productName: string;
    variantName?: string;
    sku?: string;
    thumbnail?: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  shippingAddress: any;
  billingAddress?: any;
  tracking?: {
    id: string;
    status: string;
    carrier?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    estimatedDelivery?: string;
    actualDelivery?: string;
    events: OrderTrackingEvent[];
  };
}

function OrderDetailContent() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params.orderNumber as string;

  const { data, loading, error } = useQuery<{ getOrderByNumber: OrderDetail }>(
    GET_ORDER_DETAIL,
    {
      variables: { orderNumber },
      skip: !orderNumber,
    }
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-40 mb-6" />
          <div className="space-y-3 sm:space-y-4">
            <Card>
              <CardContent className="p-4">
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.getOrderByNumber) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-3 sm:p-4">
        <Card className="w-full max-w-md border-red-200">
          <CardContent className="pt-8 pb-8 px-4 text-center">
            <Package className="h-12 w-12 sm:h-16 sm:w-16 text-red-300 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy đơn hàng
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              Đơn hàng #{orderNumber} không tồn tại hoặc đã bị xóa.
            </p>
            <Button asChild size="sm" className="w-full sm:w-auto">
              <Link href="/don-hang">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại danh sách
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const order = data.getOrderByNumber;
  
  // Parse shippingAddress from JSON
  const shippingAddress = typeof order.shippingAddress === 'string' 
    ? JSON.parse(order.shippingAddress) 
    : order.shippingAddress;
  
  const fullAddress = [
    shippingAddress?.address,
    shippingAddress?.ward,
    shippingAddress?.district,
    shippingAddress?.city,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-6">
        {/* Header - Mobile First */}
        <div className="mb-4 sm:mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/don-hang')}
            className="-ml-2 mb-3 sm:mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-sm">Quay lại</span>
          </Button>

          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 break-words">
                  #{order.orderNumber}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                </p>
              </div>
              <div className="flex-shrink-0">
                <OrderStatusBadge status={order.status} size="sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-First Single Column Layout */}
        <div className="space-y-3 sm:space-y-4">
          {/* Order Summary Card - Mobile First */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Tổng đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tạm tính</span>
                <PriceDisplay price={order.subtotal} size="sm" />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phí vận chuyển</span>
                <PriceDisplay price={order.shippingFee} size="sm" />
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Giảm giá</span>
                  <span className="text-red-600 font-medium">
                    -<PriceDisplay price={order.discount} size="sm" />
                  </span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between items-center pt-1">
                <span className="font-semibold text-base">Tổng cộng</span>
                <PriceDisplay
                  price={order.total}
                  size="lg"
                  className="font-bold text-primary"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tracking Timeline - Mobile Optimized */}
          {order.tracking?.events && order.tracking.events.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
                  Theo dõi đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <OrderTimeline events={order.tracking.events} />
              </CardContent>
            </Card>
          )}

          {/* Order Items - Mobile Optimized */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                Sản phẩm
                <span className="text-sm font-normal text-gray-500">({order.items.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={item.id}>
                    {index > 0 && <Separator className="my-3" />}
                    <div className="flex gap-3">
                      {/* Product Image - Smaller on mobile */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2 mb-1">
                          {item.productName}
                        </h4>
                        {item.variantName && (
                          <p className="text-xs text-gray-500 mb-0.5">
                            {item.variantName}
                          </p>
                        )}
                        {item.sku && (
                          <p className="text-xs text-gray-400 mb-1">
                            SKU: {item.sku}
                          </p>
                        )}
                        
                        {/* Price & Quantity - Stacked on mobile */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3 mt-2">
                          <div className="flex items-center gap-2 text-xs sm:text-sm">
                            <PriceDisplay price={item.price} size="sm" />
                            <span className="text-gray-400">×</span>
                            <span className="text-gray-600">{item.quantity}</span>
                          </div>
                          <PriceDisplay
                            price={item.subtotal}
                            size="sm"
                            className="font-semibold text-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment & Shipping Info - Mobile Optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Payment Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Thanh toán</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 pt-0">
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">Phương thức</p>
                  <PaymentMethodBadge method={order.paymentMethod} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">Trạng thái</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded text-xs sm:text-sm font-medium ${
                      order.paymentStatus === 'PAID'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {order.paymentStatus === 'PAID'
                      ? 'Đã thanh toán'
                      : 'Chưa thanh toán'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Method */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Vận chuyển
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-500 mb-1.5">Phương thức</p>
                <span className="inline-flex items-center px-2.5 py-1 rounded bg-blue-100 text-blue-700 text-xs sm:text-sm font-medium">
                  {order.shippingMethod === 'STANDARD' && 'Giao hàng tiêu chuẩn'}
                  {order.shippingMethod === 'EXPRESS' && 'Giao hàng nhanh'}
                  {order.shippingMethod === 'SAME_DAY' && 'Giao trong ngày'}
                </span>
              </CardContent>
            </Card>
          </div>

          {/* Shipping Address - Mobile Optimized */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Địa chỉ giao hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm pt-0">
              <p className="font-medium text-gray-900">
                {shippingAddress?.name || shippingAddress?.fullName || 'N/A'}
              </p>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm">{shippingAddress?.phone || 'N/A'}</span>
              </div>
              {shippingAddress?.email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm break-all">{shippingAddress.email}</span>
                </div>
              )}
              <div className="flex items-start gap-2 text-gray-600 pt-1">
                <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm leading-relaxed">{fullAddress || 'N/A'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Customer Note */}
          {order.customerNote && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Ghi chú
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{order.customerNote}</p>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions - Mobile First */}
          <div className="flex flex-col gap-2 pt-2">
            <Button asChild className="w-full" variant="outline" size="sm">
              <Link href={`/theo-doi-don-hang?order=${order.orderNumber}`}>
                <Truck className="h-4 w-4 mr-2" />
                Theo dõi vận chuyển
              </Link>
            </Button>
            {order.status === 'PENDING' && (
              <Button variant="destructive" className="w-full" size="sm">
                Hủy đơn hàng
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <div className="container max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-40 mb-6" />
            <div className="space-y-3 sm:space-y-4">
              <Card>
                <CardContent className="p-4">
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Skeleton className="h-40 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      }
    >
      <OrderDetailContent />
    </Suspense>
  );
}
