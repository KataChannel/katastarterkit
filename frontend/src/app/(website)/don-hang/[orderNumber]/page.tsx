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

  const { data, loading, error } = useQuery<{ order: OrderDetail }>(
    GET_ORDER_DETAIL,
    {
      variables: { orderNumber },
      skip: !orderNumber,
    }
  );

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.order) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card className="border-red-200">
          <CardContent className="pt-12 pb-12 text-center">
            <Package className="h-16 w-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy đơn hàng
            </h3>
            <p className="text-gray-600 mb-6">
              Đơn hàng #{orderNumber} không tồn tại hoặc đã bị xóa.
            </p>
            <Button asChild>
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

  const order = data.order;
  
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
    <div className="container max-w-6xl mx-auto px-4 py-6 md:py-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/don-hang')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Đơn hàng #{order.orderNumber}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Đặt ngày {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
            </p>
          </div>
          <OrderStatusBadge status={order.status} size="lg" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tracking Timeline */}
          {order.tracking?.events && order.tracking.events.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Theo dõi đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OrderTimeline events={order.tracking.events} />
              </CardContent>
            </Card>
          )}

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Sản phẩm ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 rounded-lg hover:bg-gray-50"
                  >
                    {/* Product Image */}
                    <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden group">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.productName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <Package className="w-10 h-10 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.productName}
                      </div>
                      {item.variantName && (
                        <p className="text-xs text-gray-500 mt-1">
                          Phân loại: {item.variantName}
                        </p>
                      )}
                      {item.sku && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          SKU: {item.sku}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <PriceDisplay price={item.price} size="sm" />
                        <span className="text-xs text-gray-500">
                          × {item.quantity}
                        </span>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right flex-shrink-0">
                      <PriceDisplay
                        price={item.subtotal}
                        size="md"
                        className="font-semibold"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customer Note */}
          {order.customerNote && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Ghi chú
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{order.customerNote}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tổng quan đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
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
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">Tổng cộng</span>
                <PriceDisplay
                  price={order.total}
                  size="lg"
                  className="font-bold text-primary"
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Phương thức</p>
                <PaymentMethodBadge method={order.paymentMethod} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Trạng thái</p>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded text-sm font-medium ${
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

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Địa chỉ giao hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium text-gray-900">
                {shippingAddress?.name || shippingAddress?.fullName || 'N/A'}
              </p>
              <div className="flex items-start gap-2 text-gray-600">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{shippingAddress?.phone || 'N/A'}</span>
              </div>
              {shippingAddress?.email && (
                <div className="flex items-start gap-2 text-gray-600">
                  <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{shippingAddress.email}</span>
                </div>
              )}
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{fullAddress || 'N/A'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="pt-6 space-y-2">
              <Button asChild className="w-full" variant="outline">
                <Link href={`/theo-doi-don-hang?order=${order.orderNumber}`}>
                  <Truck className="h-4 w-4 mr-2" />
                  Theo dõi vận chuyển
                </Link>
              </Button>
              {order.status === 'PENDING' && (
                <Button variant="destructive" className="w-full">
                  Hủy đơn hàng
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <Skeleton className="h-40 w-full" />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <Skeleton className="h-32 w-full" />
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
