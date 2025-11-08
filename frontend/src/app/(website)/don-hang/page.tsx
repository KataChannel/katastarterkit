'use client';

import { Suspense } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Package, Search, Filter, Check, ChevronsUpDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EcommerceNavigation } from '@/components/ecommerce/EcommerceNavigation';
import { OrderStatusBadge, type OrderStatus } from '@/components/ecommerce/OrderStatusBadge';
import { PaymentMethodBadge, type PaymentMethod } from '@/components/ecommerce/PaymentMethodBadge';
import { PriceDisplay } from '@/components/ecommerce/PriceDisplay';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { GET_USER_ORDERS } from '@/graphql/ecommerce.queries';

// Removed duplicate query - using centralized version from ecommerce.queries.ts

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: string;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      slug: string;
      thumbnailUrl?: string;
    };
  }>;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    ward: string;
    district: string;
    province: string;
  };
}

function OrderListContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [openStatusCombobox, setOpenStatusCombobox] = useState(false);

  const statusOptions = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'PENDING', label: 'Chờ xác nhận' },
    { value: 'CONFIRMED', label: 'Đã xác nhận' },
    { value: 'PROCESSING', label: 'Đang xử lý' },
    { value: 'SHIPPING', label: 'Đang giao' },
    { value: 'DELIVERED', label: 'Đã giao' },
    { value: 'COMPLETED', label: 'Hoàn thành' },
    { value: 'CANCELLED', label: 'Đã hủy' },
  ];

  const { data, loading, error } = useQuery(
    GET_USER_ORDERS,
    {
      variables: {
        skip: 0,
        take: 50,
      },
      fetchPolicy: 'cache-and-network',
    }
  );

  const orders = data?.getMyOrders?.orders || [];
  const total = data?.getMyOrders?.total || 0;

  // Client-side filters
  const filteredOrders = orders.filter((order: any) => {
    // Search filter
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(search) ||
        order.items?.some((item: any) =>
          item.productName?.toLowerCase().includes(search)
        );
      if (!matchesSearch) return false;
    }

    // Status filter
    if (statusFilter !== 'ALL' && order.status !== statusFilter) {
      return false;
    }

    return true;
  });

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-600 text-center">
              Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6 md:py-8">
      <div className="flex flex-col md:flex-row gap-6">

        {/* Main Content */}
        <div className="flex-1">
                  {/* Navigation Sidebar */}
        <aside className="flex-shrink-0 py-4">
          <EcommerceNavigation />
        </aside>

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Đơn hàng của tôi
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Quản lý và theo dõi đơn hàng của bạn
            </p>
          </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm theo mã đơn hoặc tên sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter - Combobox */}
            <Popover open={openStatusCombobox} onOpenChange={setOpenStatusCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openStatusCombobox}
                  className="w-full sm:w-[200px] justify-between"
                >
                  <Filter className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">
                    {statusOptions.find((option) => option.value === statusFilter)?.label || 'Trạng thái'}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Tìm trạng thái..." />
                  <CommandList>
                    <CommandEmpty>Không tìm thấy trạng thái</CommandEmpty>
                    <CommandGroup>
                      {statusOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={(currentValue) => {
                            setStatusFilter(currentValue.toUpperCase());
                            setOpenStatusCombobox(false);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              statusFilter === option.value ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {loading && !data ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chưa có đơn hàng
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'ALL'
                ? 'Không tìm thấy đơn hàng phù hợp'
                : 'Bạn chưa có đơn hàng nào'}
            </p>
            <Button asChild>
              <Link href="/san-pham">Mua sắm ngay</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order: any) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-base">
                      #{order.orderNumber}
                    </CardTitle>
                    <OrderStatusBadge status={order.status} size="sm" />
                  </div>
                  <time className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(order.createdAt), {
                      addSuffix: true,
                      locale: vi,
                    })}
                  </time>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-2">
                  {order.items?.slice(0, 2).map((item: any) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-2 rounded-lg hover:bg-gray-50"
                    >
                      {/* Product Image */}
                      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-8 h-8 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.productName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            SL: {item.quantity}
                          </span>
                          <span className="text-xs text-gray-300">•</span>
                          <PriceDisplay
                            price={item.price}
                            size="sm"
                            showCurrency
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {order.items?.length > 2 && (
                    <p className="text-sm text-gray-500 pl-2">
                      +{order.items.length - 2} sản phẩm khác
                    </p>
                  )}
                </div>

                {/* Order Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t">
                  <div className="flex flex-wrap items-center gap-2">
                    <PaymentMethodBadge
                      method={order.paymentMethod}
                      size="sm"
                    />
                    <span
                      className={`text-xs px-2 py-1 rounded ${
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

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Tổng tiền</p>
                      <PriceDisplay
                        price={order.totalAmount}
                        size="md"
                        className="font-bold"
                      />
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/don-hang/${order.orderNumber}`}>
                        Chi tiết
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
        </div>
      </div>
    </div>
  );
}

export default function OrderListPage() {
  return (
    <Suspense
      fallback={
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      }
    >
      <OrderListContent />
    </Suspense>
  );
}
