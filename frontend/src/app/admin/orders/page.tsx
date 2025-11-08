'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Eye, Package, Truck, CheckCircle, XCircle, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

// GraphQL Queries
const GET_ORDERS = gql`
  query GetOrders($input: OrderFilterInput) {
    orders(input: $input) {
      items {
        id
        orderNumber
        status
        paymentStatus
        total
        shippingMethod
        createdAt
        user {
          id
          email
          profile {
            fullName
          }
        }
        guestEmail
        guestName
        items {
          id
          productName
          quantity
          price
        }
      }
      pagination {
        total
        page
        pageSize
        totalPages
        hasMore
      }
    }
  }
`;

const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($input: UpdateOrderStatusInput!) {
    updateOrderStatus(input: $input) {
      success
      message
      order {
        id
        status
        paymentStatus
      }
    }
  }
`;

const GET_ORDER_DETAIL = gql`
  query GetOrderDetail($orderId: ID!) {
    getOrder(orderId: $orderId) {
      id
      orderNumber
      status
      paymentStatus
      paymentMethod
      shippingMethod
      subtotal
      shippingFee
      tax
      discount
      total
      customerNote
      internalNote
      createdAt
      confirmedAt
      shippedAt
      deliveredAt
      cancelledAt
      user {
        email
        profile {
          fullName
          phone
        }
      }
      guestEmail
      guestName
      guestPhone
      shippingAddress
      billingAddress
      items {
        id
        productName
        variantName
        sku
        thumbnail
        quantity
        price
        subtotal
      }
      tracking {
        id
        status
        carrier
        trackingNumber
        trackingUrl
        estimatedDelivery
        actualDelivery
        events {
          id
          status
          description
          location
          eventTime
        }
      }
    }
  }
`;

const ORDER_STATUS_CONFIG = {
  PENDING: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800', icon: '✓' },
  PREPARING: { label: 'Đang chuẩn bị', color: 'bg-purple-100 text-purple-800', icon: '📦' },
  SHIPPING: { label: 'Đang giao', color: 'bg-indigo-100 text-indigo-800', icon: '🚚' },
  DELIVERED: { label: 'Đã giao', color: 'bg-green-100 text-green-800', icon: '✅' },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: '❌' },
};

const PAYMENT_STATUS_CONFIG = {
  PENDING: { label: 'Chưa thanh toán', color: 'bg-gray-100 text-gray-800' },
  PROCESSING: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
  PAID: { label: 'Đã thanh toán', color: 'bg-green-100 text-green-800' },
  FAILED: { label: 'Thất bại', color: 'bg-red-100 text-red-800' },
  REFUNDED: { label: 'Đã hoàn tiền', color: 'bg-orange-100 text-orange-800' },
};

export default function OrdersPage() {
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 20,
    status: undefined as string | undefined,
    search: undefined as string | undefined,
  });
  const [searchInput, setSearchInput] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const { data, loading, refetch } = useQuery(GET_ORDERS, {
    variables: { input: filters },
    fetchPolicy: 'cache-and-network',
  });

  const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS, {
    onCompleted: (data) => {
      if (data.updateOrderStatus.success) {
        toast.success(data.updateOrderStatus.message);
        refetch();
      } else {
        toast.error(data.updateOrderStatus.message);
      }
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchInput || undefined, page: 1 }));
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await updateOrderStatus({
      variables: {
        input: {
          orderId,
          status: newStatus,
        },
      },
    });
  };

  const orders = data?.orders?.items || [];
  const pagination = data?.orders?.pagination || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Quản Lý Đơn Hàng</h1>
          <p className="text-gray-600 mt-1">
            Quản lý và theo dõi tất cả đơn hàng
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="flex gap-2">
              <Input
                placeholder="Tìm theo mã đơn, email, SĐT..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} variant="secondary">
                <Search className="w-4 h-4" />
              </Button>
            </div>

            {/* Status Filter */}
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value === 'all' ? undefined : value, page: 1 }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="PENDING">Chờ xác nhận</SelectItem>
                <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
                <SelectItem value="PREPARING">Đang chuẩn bị</SelectItem>
                <SelectItem value="SHIPPING">Đang giao</SelectItem>
                <SelectItem value="DELIVERED">Đã giao</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
              </SelectContent>
            </Select>

            {/* Page Size */}
            <Select
              value={filters.pageSize.toString()}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, pageSize: parseInt(value), page: 1 }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 / trang</SelectItem>
                <SelectItem value="20">20 / trang</SelectItem>
                <SelectItem value="50">50 / trang</SelectItem>
                <SelectItem value="100">100 / trang</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Danh Sách Đơn Hàng ({pagination.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Không tìm thấy đơn hàng nào
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã đơn</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead>Tổng tiền</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Thanh toán</TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order: any) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono font-semibold">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {order.user?.profile?.fullName || order.guestName || 'Khách'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.user?.email || order.guestEmail}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {order.items.length} sản phẩm
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {order.total.toLocaleString('vi-VN')}₫
                        </TableCell>
                        <TableCell>
                          <Badge className={ORDER_STATUS_CONFIG[order.status as keyof typeof ORDER_STATUS_CONFIG].color}>
                            {ORDER_STATUS_CONFIG[order.status as keyof typeof ORDER_STATUS_CONFIG].icon}{' '}
                            {ORDER_STATUS_CONFIG[order.status as keyof typeof ORDER_STATUS_CONFIG].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={PAYMENT_STATUS_CONFIG[order.paymentStatus as keyof typeof PAYMENT_STATUS_CONFIG].color}>
                            {PAYMENT_STATUS_CONFIG[order.paymentStatus as keyof typeof PAYMENT_STATUS_CONFIG].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(order.createdAt), {
                            addSuffix: true,
                            locale: vi,
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedOrder(order.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {order.status === 'PENDING' && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(order.id, 'CONFIRMED')}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            {order.status === 'CONFIRMED' && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(order.id, 'PREPARING')}
                              >
                                <Package className="w-4 h-4" />
                              </Button>
                            )}
                            {order.status === 'PREPARING' && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(order.id, 'SHIPPING')}
                              >
                                <Truck className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-600">
                    Trang {pagination.page} / {pagination.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === 1}
                      onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!pagination.hasMore}
                      onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
                    >
                      Sau
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      {selectedOrder && (
        <OrderDetailDialog
          orderId={selectedOrder}
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={handleStatusChange}
        />
      )}
    </div>
  );
}

// Order Detail Dialog Component
function OrderDetailDialog({
  orderId,
  open,
  onClose,
  onStatusUpdate,
}: {
  orderId: string;
  open: boolean;
  onClose: () => void;
  onStatusUpdate: (orderId: string, status: string) => void;
}) {
  const { data, loading } = useQuery(GET_ORDER_DETAIL, {
    variables: { orderId },
    skip: !orderId,
  });

  const order = data?.getOrder;

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!order) return null;

  const shippingAddr = order.shippingAddress || {};
  const billingAddr = order.billingAddress || {};

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Chi Tiết Đơn Hàng #{order.orderNumber}</DialogTitle>
          <DialogDescription>
            Đặt hàng {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: vi })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Status Update */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cập Nhật Trạng Thái</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING', 'DELIVERED', 'CANCELLED'].map((status) => (
                  <Button
                    key={status}
                    variant={order.status === status ? 'default' : 'outline'}
                    onClick={() => {
                      onStatusUpdate(orderId, status);
                      onClose();
                    }}
                    disabled={order.status === status}
                  >
                    {ORDER_STATUS_CONFIG[status as keyof typeof ORDER_STATUS_CONFIG].icon}{' '}
                    {ORDER_STATUS_CONFIG[status as keyof typeof ORDER_STATUS_CONFIG].label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông Tin Khách Hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tên</p>
                  <p className="font-medium">{order.user?.profile?.fullName || order.guestName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{order.user?.email || order.guestEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số điện thoại</p>
                  <p className="font-medium">{order.user?.profile?.phone || order.guestPhone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Địa Chỉ Giao Hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{shippingAddr.fullName}</p>
              <p>{shippingAddr.phone}</p>
              <p>{shippingAddr.address}</p>
              <p>{shippingAddr.ward}, {shippingAddr.district}, {shippingAddr.city}</p>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sản Phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex gap-4 p-3 border rounded-lg">
                    {item.thumbnail && (
                      <img src={item.thumbnail} alt={item.productName} className="w-16 h-16 object-cover rounded" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      {item.variantName && <p className="text-sm text-gray-600">{item.variantName}</p>}
                      <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item.price.toLocaleString('vi-VN')}₫</p>
                      <p className="text-sm text-gray-600">x{item.quantity}</p>
                      <p className="font-semibold text-blue-600">{item.subtotal.toLocaleString('vi-VN')}₫</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Price Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tổng Kết</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{order.subtotal.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span>{order.shippingFee.toLocaleString('vi-VN')}₫</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá:</span>
                    <span>-{order.discount.toLocaleString('vi-VN')}₫</span>
                  </div>
                )}
                {order.tax > 0 && (
                  <div className="flex justify-between">
                    <span>Thuế:</span>
                    <span>{order.tax.toLocaleString('vi-VN')}₫</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold border-t pt-2">
                  <span>Tổng cộng:</span>
                  <span className="text-blue-600">{order.total.toLocaleString('vi-VN')}₫</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking */}
          {order.tracking && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Theo Dõi Đơn Hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.tracking.carrier && (
                    <div>
                      <p className="text-sm text-gray-600">Đơn vị vận chuyển</p>
                      <p className="font-medium">{order.tracking.carrier}</p>
                    </div>
                  )}
                  {order.tracking.trackingNumber && (
                    <div>
                      <p className="text-sm text-gray-600">Mã vận đơn</p>
                      <p className="font-mono font-medium">{order.tracking.trackingNumber}</p>
                    </div>
                  )}
                  {order.tracking.events && order.tracking.events.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 font-semibold">Lịch sử di chuyển</p>
                      {order.tracking.events.map((event: any) => (
                        <div key={event.id} className="flex gap-3 p-2 border-l-2 border-blue-500 pl-3">
                          <div className="flex-1">
                            <p className="font-medium">{event.description}</p>
                            {event.location && <p className="text-sm text-gray-600">{event.location}</p>}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(event.eventTime), { addSuffix: true, locale: vi })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
