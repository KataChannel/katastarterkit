/**
 * RecordsTab Component
 * Tab hiển thị danh sách cuộc gọi với filters
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Filter, 
  XCircle, 
  ChevronLeft, 
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
} from 'lucide-react';
import { AdvancedTable } from '@/components/ui/advanced-table/AdvancedTable';
import type { ColumnDef } from '@/components/ui/advanced-table/types';
import { AudioPlayer } from './AudioPlayer';
import { formatEpoch, formatDuration } from '../utils';
import { CALL_DIRECTION_OPTIONS, CALL_STATUS_OPTIONS, CALL_STATUS_VARIANTS } from '../constants';
import type { CallCenterRecord, Pagination, PaginationInfo, QuickFilterType } from '../types';

interface RecordsTabProps {
  records: CallCenterRecord[];
  loading: boolean;
  pagination: Pagination;
  paginationInfo: PaginationInfo | null;
  // Filter state
  filterState: {
    dateFrom: string;
    dateTo: string;
    extension: string;
    direction: string;
    status: string;
  };
  setFilterState: React.Dispatch<React.SetStateAction<{
    dateFrom: string;
    dateTo: string;
    extension: string;
    direction: string;
    status: string;
  }>>;
  quickFilter: QuickFilterType;
  showFilters: boolean;
  hasActiveFilters: boolean;
  // Actions
  onShowFiltersChange: (show: boolean) => void;
  onQuickFilter: (type: QuickFilterType) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  onPaginationChange: (pagination: Pagination) => void;
}

// Helper functions
const getDirectionIcon = (direction: string) => {
  switch (direction) {
    case 'INBOUND':
      return <PhoneIncoming className="h-4 w-4 text-blue-600" />;
    case 'OUTBOUND':
      return <PhoneOutgoing className="h-4 w-4 text-green-600" />;
    case 'LOCAL':
      return <Phone className="h-4 w-4 text-purple-600" />;
    default:
      return <Phone className="h-4 w-4" />;
  }
};

const getStatusBadge = (status: string) => {
  const config = CALL_STATUS_VARIANTS[status] || { variant: 'outline' as const, label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export function RecordsTab({
  records,
  loading,
  pagination,
  paginationInfo,
  filterState,
  setFilterState,
  quickFilter,
  showFilters,
  hasActiveFilters,
  onShowFiltersChange,
  onQuickFilter,
  onApplyFilters,
  onClearFilters,
  onPaginationChange,
}: RecordsTabProps) {
  // Define columns for AdvancedTable
  const callRecordColumns: ColumnDef<CallCenterRecord>[] = [
    {
      field: 'direction',
      headerName: 'Hướng',
      width: 120,
      sortable: true,
      cellRenderer: (params) => (
        <div className="flex items-center gap-2">
          {getDirectionIcon(params.value)}
          <span className="text-xs">{params.value}</span>
        </div>
      ),
    },
    {
      field: 'callerIdNumber',
      headerName: 'Số gọi',
      width: 130,
      sortable: true,
      cellRenderer: (params) => <div className="font-mono text-sm">{params.value}</div>,
    },
    {
      field: 'destinationNumber',
      headerName: 'Số nhận',
      width: 130,
      sortable: true,
      cellRenderer: (params) => <div className="font-mono text-sm">{params.value}</div>,
    },
    {
      field: 'startEpoch',
      headerName: 'Thời gian',
      width: 180,
      sortable: true,
      cellRenderer: (params) => <div className="text-sm">{formatEpoch(params.value)}</div>,
    },
    {
      field: 'duration',
      headerName: 'Thời lượng',
      width: 120,
      sortable: true,
      cellRenderer: (params) => (
        <div className="flex flex-col gap-1 text-sm">
          <span>Tổng: {formatDuration(params.value)}</span>
          <span className="text-xs text-muted-foreground">
            Nói: {formatDuration(params.data.billsec)}
          </span>
        </div>
      ),
    },
    {
      field: 'callStatus',
      headerName: 'Trạng thái',
      width: 120,
      sortable: true,
      cellRenderer: (params) => getStatusBadge(params.value),
    },
    {
      field: 'recordPath',
      headerName: 'Ghi âm',
      width: 180,
      cellRenderer: (params) => (
        <AudioPlayer recordPath={params.value} domain={params.data.domain} />
      ),
    },
  ];

  return (
    <div className="space-y-3 mt-3">
      {/* Quick Filters + Filter Toggle */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Lọc nhanh:</span>
        <Button
          variant={quickFilter === 'today' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onQuickFilter('today')}
        >
          Hôm nay
        </Button>
        <Button
          variant={quickFilter === '7days' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onQuickFilter('7days')}
        >
          7 ngày
        </Button>
        <Button
          variant={quickFilter === '30days' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onQuickFilter('30days')}
        >
          30 ngày
        </Button>
        <div className="h-4 w-px bg-border mx-1" />
        <Button
          variant={showFilters ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => onShowFiltersChange(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-1" />
          Lọc nâng cao
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 h-5 px-1 bg-blue-100 text-blue-700">
              !
            </Badge>
          )}
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <XCircle className="h-4 w-4 mr-1" />
            Xóa lọc
          </Button>
        )}
      </div>

      {/* Advanced Filters - Collapsible Inline */}
      {showFilters && (
        <Card className="border-blue-100 bg-blue-50/30">
          <CardContent className="py-3">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 items-end">
              <div className="space-y-1">
                <Label className="text-xs">Từ ngày</Label>
                <Input
                  type="date"
                  value={filterState.dateFrom}
                  onChange={(e) => setFilterState(prev => ({ ...prev, dateFrom: e.target.value }))}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Đến ngày</Label>
                <Input
                  type="date"
                  value={filterState.dateTo}
                  onChange={(e) => setFilterState(prev => ({ ...prev, dateTo: e.target.value }))}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Extension/SĐT</Label>
                <Input
                  placeholder="VD: 101..."
                  value={filterState.extension}
                  onChange={(e) => setFilterState(prev => ({ ...prev, extension: e.target.value }))}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Hướng gọi</Label>
                <Select
                  value={filterState.direction}
                  onValueChange={(val) => setFilterState(prev => ({ ...prev, direction: val }))}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    {CALL_DIRECTION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Trạng thái</Label>
                <Select
                  value={filterState.status}
                  onValueChange={(val) => setFilterState(prev => ({ ...prev, status: val }))}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    {CALL_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button size="sm" className="h-8" onClick={onApplyFilters}>
                <Filter className="h-3 w-3 mr-1" />
                Áp dụng
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Records Table */}
      <Card>
        <CardHeader className="py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Danh sách cuộc gọi</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {paginationInfo?.totalItems?.toLocaleString('vi-VN') || 0} cuộc gọi
              </span>
              {hasActiveFilters && (
                <Badge variant="secondary" className="text-xs">
                  đã lọc
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <AdvancedTable
              columns={callRecordColumns}
              data={records}
              config={{
                enableSorting: true,
                enableFiltering: true,
                enableColumnPinning: false,
                enableColumnResizing: true,
                enableColumnHiding: true,
                enableRowSelection: false,
                enableInlineEditing: false,
                enableRowDeletion: false,
                showToolbar: true,
                showPagination: false,
              }}
              height={500}
            />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {paginationInfo && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-2">
          {/* Left - Page size selector and info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Hiển thị</span>
              <Select
                value={pagination.limit.toString()}
                onValueChange={(val) => onPaginationChange({ page: 1, limit: parseInt(val) })}
              >
                <SelectTrigger className="h-8 w-[70px] text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">/ trang</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-border" />
            <span className="text-sm text-muted-foreground">
              Hiển thị {Math.min((paginationInfo.currentPage - 1) * pagination.limit + 1, paginationInfo.totalItems)} -{' '}
              {Math.min(paginationInfo.currentPage * pagination.limit, paginationInfo.totalItems)} trong{' '}
              <span className="font-medium text-foreground">{paginationInfo.totalItems.toLocaleString('vi-VN')}</span> cuộc gọi
            </span>
          </div>

          {/* Right - Pagination controls */}
          <div className="flex items-center gap-1">
            {/* First page */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onPaginationChange({ ...pagination, page: 1 })}
              disabled={!paginationInfo.hasPreviousPage}
              title="Trang đầu"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            {/* Previous page */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onPaginationChange({ ...pagination, page: pagination.page - 1 })}
              disabled={!paginationInfo.hasPreviousPage}
              title="Trang trước"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page numbers */}
            <div className="flex items-center gap-1 mx-1">
              {(() => {
                const totalPages = paginationInfo.totalPages;
                const currentPage = paginationInfo.currentPage;
                const pages: (number | string)[] = [];
                
                // Logic: show first, last, current, and 1 page before/after current
                const showPages = new Set<number>();
                showPages.add(1);
                showPages.add(totalPages);
                for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
                  showPages.add(i);
                }
                
                const sortedPages = Array.from(showPages).sort((a, b) => a - b);
                
                sortedPages.forEach((page, idx) => {
                  if (idx > 0 && page - sortedPages[idx - 1] > 1) {
                    pages.push('...');
                  }
                  pages.push(page);
                });
                
                return pages.map((page, idx) => {
                  if (page === '...') {
                    return (
                      <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
                        ...
                      </span>
                    );
                  }
                  return (
                    <Button
                      key={page}
                      variant={page === currentPage ? 'default' : 'outline'}
                      size="sm"
                      className="h-8 min-w-8 px-2"
                      onClick={() => onPaginationChange({ ...pagination, page: page as number })}
                    >
                      {page}
                    </Button>
                  );
                });
              })()}
            </div>

            {/* Next page */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onPaginationChange({ ...pagination, page: pagination.page + 1 })}
              disabled={!paginationInfo.hasNextPage}
              title="Trang sau"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            {/* Last page */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onPaginationChange({ ...pagination, page: paginationInfo.totalPages })}
              disabled={!paginationInfo.hasNextPage}
              title="Trang cuối"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
