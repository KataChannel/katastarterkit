'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { useDynamicQuery } from '@/lib/graphql/dynamic-hooks';

// Types
import { SortField, SortDirection, FilterStatus, NormalizationResult } from './types';

// Components
import {
  StatsCards,
  SearchToolbar,
  ProductTable,
  Pagination,
  NormalizationModal,
} from './components';

// Hooks
import { useProductFilters, useProductPagination } from './hooks';

export default function SanPhamPage() {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [normalizing, setNormalizing] = useState(false);
  const [showNormalizeModal, setShowNormalizeModal] = useState(false);

  // GraphQL query
  const { data: productsData, loading: queryLoading, refetch } = useDynamicQuery('GET_ALL', 'ext_sanphamhoadon', {
    fetchPolicy: 'network-only',
  });

  // Extract products from GraphQL response
  const rawProducts = productsData?.getext_sanphamhoadons || [];

  // Apply filters and sorting
  const { filteredProducts, stats } = useProductFilters({
    products: rawProducts,
    searchTerm,
    filterStatus,
    sortField,
    sortDirection,
  });

  // Apply pagination
  const { paginatedProducts } = useProductPagination({
    products: filteredProducts,
    page,
    limit,
    setPage,
    dependencies: [searchTerm, filterStatus, sortField, sortDirection],
  });

  // Handlers
  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success('Đã tải lại dữ liệu');
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Lỗi khi tải dữ liệu');
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleNormalization = async (dryRun: boolean, limitValue: number) => {
    setNormalizing(true);
    
    try {
      const response = await fetch('/api/ketoan/normalize-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dryRun, limit: limitValue }),
      });

      const result: NormalizationResult = await response.json();

      if (result.success) {
        toast.success(result.message);
        if (!dryRun) {
          await handleRefresh();
        }
        setShowNormalizeModal(false);
      } else {
        toast.error(result.message || 'Lỗi khi chuẩn hóa dữ liệu');
      }
    } catch (error) {
      console.error('Normalization error:', error);
      toast.error('Không thể kết nối với server');
    } finally {
      setNormalizing(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Quản Lý Sản Phẩm
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Danh sách sản phẩm từ hóa đơn với tính năng chuẩn hóa tên sản phẩm
        </p>
      </div>

      {/* Search Toolbar */}
      <SearchToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        stats={stats}
        loading={queryLoading}
        onRefresh={handleRefresh}
        onNormalize={() => setShowNormalizeModal(true)}
      />

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Products Table */}
      <ProductTable
        products={paginatedProducts}
        loading={queryLoading}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        emptyMessage={
          searchTerm || filterStatus !== 'all'
            ? 'Không tìm thấy sản phẩm phù hợp'
            : 'Không có dữ liệu'
        }
      />

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalItems={filteredProducts.length}
        itemsPerPage={limit}
        onPageChange={setPage}
      />

      {/* Normalization Modal */}
      <NormalizationModal
        isOpen={showNormalizeModal}
        onClose={() => setShowNormalizeModal(false)}
        onNormalize={handleNormalization}
        loading={normalizing}
      />
    </div>
  );
}
