'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { LIST_ORDERS, GET_ORDER_STATS, UPDATE_ORDER_STATUS } from '@/components/admin/orders/queries';
import { OrderFilterInput } from '@/components/admin/orders/types';
import OrderStatsCards from '@/components/admin/orders/OrderStatsCards';
import OrderMobileCards from '@/components/admin/orders/OrderMobileCards';
import OrderAdvancedTable from '@/components/admin/orders/OrderAdvancedTable';
import OrderLoadingState from '@/components/admin/orders/OrderLoadingState';
import OrderEmptyState from '@/components/admin/orders/OrderEmptyState';
import OrderDetailDialog from '@/components/admin/orders/OrderDetailDialog';
import { Card, CardContent } from '@/components/ui/card';
import { FilterCondition, SortConfig } from '@/components/ui/advanced-table';

export default function AdminOrdersPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [filters, setFilters] = useState<OrderFilterInput>({});

  const { data: statsData, loading: statsLoading } = useQuery(GET_ORDER_STATS, {
    fetchPolicy: 'cache-and-network',
  });

  const { data, loading, error, refetch } = useQuery(LIST_ORDERS, {
    variables: {
      filter: filters,
    },
    fetchPolicy: 'cache-and-network',
  });

  const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS, {
    onCompleted: () => {
      toast.success('Cập nhật trạng thái thành công');
      refetch();
    },
    onError: (error) => toast.error(`Lỗi: ${error.message}`),
  });

  const orders = data?.listOrders?.orders || [];
  const stats = statsData?.getOrderStatistics || null;
  const hasFilters = Object.keys(filters).length > 0;

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus({ variables: { input: { orderId, status: newStatus } } });
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Handle advanced table filters
  const handleTableFilter = useCallback((tableFilters: FilterCondition[]) => {
    const graphqlFilters: OrderFilterInput = {};
    
    tableFilters.forEach(filter => {
      switch (filter.field) {
        case 'status':
          graphqlFilters.status = filter.value;
          break;
        case 'paymentStatus':
          graphqlFilters.paymentStatus = filter.value;
          break;
        case 'orderNumber':
        case 'guestName':
          graphqlFilters.searchTerm = filter.value;
          break;
      }
    });
    
    setFilters(graphqlFilters);
  }, []);

  // Handle advanced table sorting
  const handleTableSort = useCallback((sortConfigs: SortConfig[]) => {
    // Can be extended to send sort params to GraphQL if supported
    console.log('Sort configs:', sortConfigs);
  }, []);

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-4">
        <h1 className="text-2xl lg:text-3xl font-bold mb-1">Quản lý đơn hàng</h1>
        <p className="text-sm text-muted-foreground">Tất cả đơn hàng từ khách hàng website</p>
      </div>

      <OrderStatsCards stats={stats} loading={statsLoading} />

      {error && (
        <div className="bg-destructive/10 border border-destructive rounded-lg p-4 mb-4">
          <p className="text-destructive font-medium">Lỗi: {error.message}</p>
        </div>
      )}

      {/* Mobile Cards View */}
      <div className="lg:hidden">
        {loading && <OrderLoadingState />}
        {!loading && !error && orders.length === 0 && <OrderEmptyState hasFilters={hasFilters} />}
        {!loading && !error && orders.length > 0 && (
          <OrderMobileCards 
            orders={orders} 
            onViewDetail={setSelectedOrderId} 
            onStatusChange={handleStatusChange} 
          />
        )}
      </div>

      {/* Desktop Advanced Table View */}
      <div className="hidden lg:block">
        <Card>
          <CardContent className="p-0">
            {orders.length === 0 && !loading ? (
              <OrderEmptyState hasFilters={hasFilters} />
            ) : (
              <OrderAdvancedTable
                orders={orders}
                onViewDetail={setSelectedOrderId}
                onStatusChange={handleStatusChange}
                onFilter={handleTableFilter}
                onSort={handleTableSort}
                loading={loading}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {selectedOrderId && (
        <OrderDetailDialog
          order={selectedOrderId}
          open={!!selectedOrderId}
          onOpenChange={(open) => !open && setSelectedOrderId(null)}
        />
      )}
    </div>
  );
}
