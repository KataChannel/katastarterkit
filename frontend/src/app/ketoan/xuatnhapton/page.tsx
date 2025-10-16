'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

// Types
import { UserConfig, DateRange, GroupBy, SortField, SortDirection } from './types';

// Components
import {
  ConfigModal,
  SummaryCards,
  FilterToolbar,
  InventoryTable,
  Pagination,
} from './components';

// Hooks
import { useInventoryData, useInventoryFilter, usePagination } from './hooks';

// Utils
import {
  getUserConfig,
  saveUserConfig,
  getDefaultDateRange,
  calculateInventory,
  calculateSummary,
  exportToExcel,
} from './utils';

export default function XuatNhapTonPage() {
  // User configuration
  const [userConfig, setUserConfig] = useState<UserConfig | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  
  // Date range
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
  
  // Filters and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [groupBy, setGroupBy] = useState<GroupBy>('ma');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Pagination
  const [itemsPerPage] = useState(50);
  
  // Data loading
  const {
    invoices,
    details,
    products,
    loading,
    error,
    isReady,
    refetch,
  } = useInventoryData();
  
  // Load user config from localStorage on mount
  useEffect(() => {
    const config = getUserConfig();
    if (config) {
      setUserConfig(config);
    } else {
      // Show config modal if no config exists
      setShowConfigModal(true);
    }
  }, []);
  
  // Calculate inventory rows
  const inventoryRows = useMemo(() => {
    if (!userConfig || !isReady) {
      console.log('⚠️ Inventory calculation skipped:', { 
        hasUserConfig: !!userConfig, 
        isReady,
        userConfig 
      });
      return [];
    }
    
    console.log('📊 Calculating inventory with:', {
      invoicesCount: invoices.length,
      detailsCount: details.length,
      productsCount: products.length,
      userMST: userConfig.mst,
      groupBy,
      dateRange,
      sampleInvoice: invoices[0],
      sampleDetail: details[0],
      sampleProduct: products[0],
    });
    
    // Debug: Check if invoices have nbmst/nmmst matching userMST
    const userMSTLower = userConfig.mst.trim().toLowerCase();
    const matchingSales = invoices.filter(inv => inv.nbmst?.trim().toLowerCase() === userMSTLower);
    const matchingPurchases = invoices.filter(inv => inv.nmmst?.trim().toLowerCase() === userMSTLower);
    
    console.log('🔍 MST Matching Debug:', {
      userMST: userConfig.mst,
      userMSTLower,
      matchingSalesCount: matchingSales.length,
      matchingPurchasesCount: matchingPurchases.length,
      sampleSaleInvoice: matchingSales[0],
      samplePurchaseInvoice: matchingPurchases[0],
      firstInvoiceNbmst: invoices[0]?.nbmst,
      firstInvoiceNmmst: invoices[0]?.nmmst,
    });
    
    const result = calculateInventory(
      invoices,
      details,
      products,
      userConfig.mst,
      groupBy,
      dateRange.startDate,
      dateRange.endDate
    );
    
    console.log('✅ Inventory rows calculated:', result.length);
    if (result.length > 0) {
      console.log('Sample result rows (first 3):', result.slice(0, 3));
    } else {
      console.warn('⚠️ No inventory rows generated! Check MST matching logic.');
    }
    
    return result;
  }, [invoices, details, products, userConfig, groupBy, dateRange, isReady]);
  
  // Apply filters and sorting
  const filteredRows = useInventoryFilter({
    rows: inventoryRows,
    searchTerm,
    sortField,
    sortDirection,
  });
  
  console.log('🔍 Filtered rows:', filteredRows.length, { searchTerm, sortField, sortDirection });
  
  // Calculate summary
  const summary = useMemo(() => calculateSummary(filteredRows), [filteredRows]);
  
  // Pagination
  const {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev,
  } = usePagination({
    totalItems: filteredRows.length,
    itemsPerPage,
  });
  
  // Handlers
  const handleSaveConfig = (config: UserConfig) => {
    saveUserConfig(config);
    setUserConfig(config);
    setShowConfigModal(false);
    toast.success('Đã lưu cấu hình MST');
  };
  
  const handleExport = () => {
    if (!userConfig) {
      toast.error('Vui lòng cấu hình MST trước');
      setShowConfigModal(true);
      return;
    }
    
    if (filteredRows.length === 0) {
      toast.error('Không có dữ liệu để xuất');
      return;
    }
    
    try {
      exportToExcel(
        filteredRows,
        summary,
        dateRange,
        userConfig.companyName || 'Công ty'
      );
      toast.success('Đã xuất file Excel thành công');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Lỗi khi xuất file Excel');
    }
  };
  
  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success('Đã làm mới dữ liệu');
    } catch (error) {
      console.error('Refresh error:', error);
      toast.error('Lỗi khi làm mới dữ liệu');
    }
  };
  
  const handleSortChange = (field: SortField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  };
  
  // Show error if data loading failed
  useEffect(() => {
    if (error.any) {
      if (error.invoices) toast.error(`Lỗi tải hóa đơn: ${error.invoices}`);
      if (error.details) toast.error(`Lỗi tải chi tiết: ${error.details}`);
      if (error.products) toast.error(`Lỗi tải sản phẩm: ${error.products}`);
    }
  }, [error]);
  
  // Warning if no config
  const showWarning = !userConfig && !showConfigModal;
  
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Báo Cáo Xuất Nhập Tồn</h1>
        <p className="text-muted-foreground mt-1">
          Quản lý và theo dõi xuất nhập tồn kho theo hóa đơn
        </p>
        {userConfig && (
          <p className="text-sm text-muted-foreground mt-1">
            MST: <span className="font-medium">{userConfig.mst}</span>
            {userConfig.companyName && ` - ${userConfig.companyName}`}
          </p>
        )}
      </div>
      
      {/* Warning Alert */}
      {showWarning && (
        <Alert className="border-yellow-500 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            <span className="font-medium">Cần cấu hình MST:</span> Vui lòng cấu hình mã số thuế (MST) để phân loại hóa đơn bán/mua.{' '}
            <Button
              variant="link"
              className="h-auto p-0 text-yellow-800 underline"
              onClick={() => setShowConfigModal(true)}
            >
              Cấu hình ngay
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Config Modal */}
      <ConfigModal
        isOpen={showConfigModal}
        currentConfig={userConfig}
        onSave={handleSaveConfig}
        onClose={() => setShowConfigModal(false)}
      />
      
      {/* Summary Cards */}
      <SummaryCards summary={summary} loading={loading.any} />
      
      {/* Filter Toolbar */}
      <FilterToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        onExport={handleExport}
        onRefresh={handleRefresh}
        onConfig={() => setShowConfigModal(true)}
        loading={loading.any}
      />
      
      {/* Inventory Table */}
      <InventoryTable
        rows={filteredRows}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        loading={loading.any}
      />
      
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredRows.length}
        itemsPerPage={itemsPerPage}
        onPageChange={goToPage}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
      />
    </div>
  );
}
