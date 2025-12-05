/**
 * Order Advanced Table Component
 * Hiển thị danh sách đơn hàng sử dụng AdvancedTable
 */

'use client';

import React, { useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AdvancedTable, ColumnDef, TableConfig, FilterCondition, SortConfig } from '@/components/ui/advanced-table';
import { MoreVertical, Eye, Printer, Mail } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { OrderStatusCombobox } from './OrderStatusCombobox';
import { formatCurrency, formatCustomerName, getPaymentStatusConfig } from './helpers';
import { Order, OrderStatus, ORDER_STATUS_LABELS, PaymentStatus, PAYMENT_STATUS_LABELS } from './types';

interface OrderRow extends Order {
  // Extended for table
}

interface OrderAdvancedTableProps {
  orders: Order[];
  onViewDetail: (orderId: string) => void;
  onStatusChange: (orderId: string, newStatus: string) => void;
  onPrint?: (orderId: string) => void;
  onEmail?: (orderId: string) => void;
  onFilter?: (filters: FilterCondition[]) => void;
  onSort?: (sortConfigs: SortConfig[]) => void;
  loading?: boolean;
}

export default function OrderAdvancedTable({
  orders,
  onViewDetail,
  onStatusChange,
  onPrint,
  onEmail,
  onFilter,
  onSort,
  loading = false,
}: OrderAdvancedTableProps) {
  // Convert orders to row format
  const orderRows = useMemo<OrderRow[]>(() => 
    orders.map(order => ({ ...order })),
    [orders]
  );

  // Column definitions
  const columns: ColumnDef<OrderRow>[] = useMemo(() => [
    {
      field: 'orderNumber',
      headerName: 'Mã đơn',
      width: 180,
      sortable: true,
      filterable: true,
      resizable: true,
      cellRenderer: ({ value }) => (
        <span className="font-medium text-sm">{value}</span>
      ),
    },
    {
      field: 'guestName',
      headerName: 'Khách hàng',
      width: 180,
      sortable: true,
      filterable: true,
      resizable: true,
      cellRenderer: ({ data }) => {
        const customerName = formatCustomerName(data.guestName, data.shippingAddress);
        return (
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{customerName}</p>
            <p className="text-xs text-muted-foreground truncate">
              {data.guestEmail || 'N/A'}
            </p>
          </div>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 150,
      type: 'select',
      sortable: true,
      filterable: true,
      resizable: true,
      filterOptions: Object.values(OrderStatus),
      cellRenderer: ({ value, data }) => (
        <OrderStatusCombobox
          value={value}
          onChange={(newStatus: string) => onStatusChange(data.id, newStatus)}
        />
      ),
    },
    {
      field: 'paymentStatus',
      headerName: 'Thanh toán',
      width: 140,
      type: 'select',
      sortable: true,
      filterable: true,
      resizable: true,
      filterOptions: Object.values(PaymentStatus),
      cellRenderer: ({ value }) => {
        const config = getPaymentStatusConfig(value);
        return (
          <Badge variant="secondary" className={`text-xs ${config.className}`}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      field: 'items',
      headerName: 'Số lượng',
      width: 100,
      sortable: false,
      filterable: false,
      resizable: true,
      cellRenderer: ({ value }) => (
        <span className="text-sm">{value?.length || 0} sản phẩm</span>
      ),
    },
    {
      field: 'total',
      headerName: 'Tổng tiền',
      width: 130,
      type: 'number',
      sortable: true,
      filterable: true,
      resizable: true,
      cellRenderer: ({ value }) => (
        <span className="font-semibold text-sm text-green-600">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Ngày tạo',
      width: 120,
      type: 'date',
      sortable: true,
      filterable: true,
      resizable: true,
      cellRenderer: ({ value }) => (
        <span className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(value), {
            addSuffix: true,
            locale: vi,
          })}
        </span>
      ),
    },
    {
      field: 'id',
      headerName: 'Thao tác',
      width: 130,
      sortable: false,
      filterable: false,
      resizable: true,
      cellRenderer: ({ data }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetail(data.id)}
            className="h-8 px-2 text-xs"
          >
            <Eye className="h-3.5 w-3.5 mr-1" />
            Chi tiết
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onPrint && (
                <DropdownMenuItem onClick={() => onPrint(data.id)}>
                  <Printer className="mr-2 h-4 w-4" />
                  In đơn hàng
                </DropdownMenuItem>
              )}
              {onEmail && (
                <DropdownMenuItem onClick={() => onEmail(data.id)}>
                  <Mail className="mr-2 h-4 w-4" />
                  Gửi email
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ], [onStatusChange, onViewDetail, onPrint, onEmail]);

  // Table configuration
  const tableConfig: TableConfig = useMemo(() => ({
    enableSorting: true,
    enableFiltering: true,
    enableColumnPinning: true,
    enableColumnResizing: true,
    enableColumnHiding: true,
    enableRowSelection: false,
    enableInlineEditing: false,
    enableRowDeletion: false,
    rowHeight: 56,
    headerHeight: 40,
    showToolbar: true,
  }), []);

  // Handle filter changes
  const handleFilter = useCallback((filters: FilterCondition[]) => {
    onFilter?.(filters);
  }, [onFilter]);

  // Handle sort changes
  const handleSort = useCallback((sortConfigs: SortConfig[]) => {
    onSort?.(sortConfigs);
  }, [onSort]);

  return (
    <AdvancedTable
      columns={columns}
      data={orderRows}
      config={tableConfig}
      onFilter={handleFilter}
      onSort={handleSort}
      loading={loading}
      height={600}
      className="w-full"
    />
  );
}
