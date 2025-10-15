'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';

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
    if (!userConfig || !isReady) return [];
    
    return calculateInventory(
      invoices,
      details,
      products,
      userConfig.mst,
      groupBy,
      dateRange.startDate,
      dateRange.endDate
    );
  }, [invoices, details, products, userConfig, groupBy, dateRange, isReady]);
  
  // Apply filters and sorting
  const filteredRows = useInventoryFilter({
    rows: inventoryRows,
    searchTerm,
    sortField,
    sortDirection,
  });
  
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
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Báo Cáo Xuất Nhập Tồn</h1>
        <p className="text-gray-600 mt-1">
          Quản lý và theo dõi xuất nhập tồn kho theo hóa đơn
        </p>
        {userConfig && (
          <p className="text-sm text-gray-500 mt-1">
            MST: <span className="font-medium">{userConfig.mst}</span>
            {userConfig.companyName && ` - ${userConfig.companyName}`}
          </p>
        )}
      </div>
      
      {/* Warning banner */}
      {showWarning && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Vui lòng cấu hình mã số thuế (MST) để phân loại hóa đơn bán/mua.{' '}
                <button
                  onClick={() => setShowConfigModal(true)}
                  className="font-medium underline text-yellow-700 hover:text-yellow-600"
                >
                  Cấu hình ngay
                </button>
              </p>
            </div>
          </div>
        </div>
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
      <div className="mt-4">
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
    </div>
  );
}
