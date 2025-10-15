'use client';

import React, { useState, useEffect, useMemo } from 'react';

import { 
  Search, 
  RefreshCw, 
  Settings, 
  Play, 
  Eye, 
  Database,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { toast } from 'sonner';
import { useDynamicQuery } from '@/lib/graphql/dynamic-hooks';

interface Product {
  id: string;
  ten: string | null;
  ten2: string | null;
  ma: string | null;
  dvt: string | null;
  dgia: number | null;
  createdAt: string;
  updatedAt: string;
}

interface NormalizationResult {
  success: boolean;
  message: string;
  stats?: {
    total: number;
    normalized: number;
    pending: number;
  };
}

type SortField = 'ten' | 'ma' | 'dgia' | 'createdAt';
type SortDirection = 'asc' | 'desc';
type FilterStatus = 'all' | 'normalized' | 'pending';

export default function SanPhamPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  
  // Sort & Filter states
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  
  // Normalization states
  const [normalizing, setNormalizing] = useState(false);
  const [showNormalizeModal, setShowNormalizeModal] = useState(false);
  const [normalizeMode, setNormalizeMode] = useState<'preview' | 'update'>('preview');
  const [normalizeLimit, setNormalizeLimit] = useState(10);

  // GraphQL query để lấy products
  const { data: productsData, loading: queryLoading, error: queryError, refetch } = useDynamicQuery('GET_ALL', 'ext_sanphamhoadon', {
    fetchPolicy: 'network-only', // Always fetch fresh data
  });

  // Process and filter products with useMemo for performance
  const { filteredProducts, stats } = useMemo(() => {
    // Extract array from GraphQL response
    const rawProducts = productsData?.getext_sanphamhoadons || [];
    
    if (!Array.isArray(rawProducts)) {
      console.warn('Products data is not an array:', rawProducts);
      return { filteredProducts: [], stats: { total: 0, normalized: 0, pending: 0 } };
    }

    let filtered = [...rawProducts];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((p: Product) => 
        p.ten?.toLowerCase().includes(term) ||
        p.ten2?.toLowerCase().includes(term) ||
        p.ma?.toLowerCase().includes(term) ||
        p.dvt?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (filterStatus === 'normalized') {
      filtered = filtered.filter((p: Product) => p.ten2);
    } else if (filterStatus === 'pending') {
      filtered = filtered.filter((p: Product) => !p.ten2);
    }

    // Apply sorting
    filtered.sort((a: Product, b: Product) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      // Handle null values
      if (aVal === null) return 1;
      if (bVal === null) return -1;

      // Convert to comparable values
      if (sortField === 'dgia') {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else if (sortField === 'createdAt') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    // Calculate stats
    const statsData = {
      total: rawProducts.length,
      normalized: rawProducts.filter((p: Product) => p.ten2).length,
      pending: rawProducts.filter((p: Product) => !p.ten2).length,
    };

    return { filteredProducts: filtered, stats: statsData };
  }, [productsData, searchTerm, filterStatus, sortField, sortDirection]);

  // Paginated products
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, page, limit]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterStatus, sortField, sortDirection]);

  // Load products (now just triggers refetch)
  const loadProducts = async () => {
    try {
      await refetch();
      toast.success('Đã tải lại dữ liệu');
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Lỗi khi tải dữ liệu');
    }
  };

  // Toggle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Render sort icon
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4 text-blue-500" />
      : <ArrowDown className="h-4 w-4 text-blue-500" />;
  };

  // Run normalization via backend script
  const runNormalization = async (dryRun: boolean = false, limitValue: number = 10) => {
    setNormalizing(true);
    
    try {
      // Call backend API to run the updateten2.js script
      const response = await fetch('/api/ketoan/normalize-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dryRun,
          limit: limitValue,
        }),
      });

      const result: NormalizationResult = await response.json();

      if (result.success) {
        toast.success(result.message);
        if (!dryRun) {
          // Reload products after normalization
          await loadProducts();
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

  const formatPrice = (price: number | null) => {
    if (price === null) return '-';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(Number(price));
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('vi-VN');
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

      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search and Actions */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mã, DVT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={loadProducts}
                disabled={queryLoading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${queryLoading ? 'animate-spin' : ''}`} />
                Làm mới
              </button>

              <button
                onClick={() => setShowNormalizeModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Database className="h-4 w-4" />
                Chuẩn hóa
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Trạng thái:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Tất cả ({stats.total})
              </button>
              <button
                onClick={() => setFilterStatus('normalized')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  filterStatus === 'normalized'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Đã chuẩn hóa ({stats.normalized})
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  filterStatus === 'pending'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Chưa xử lý ({stats.pending})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <Database className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Đã chuẩn hóa</p>
              <p className="text-2xl font-bold text-green-600">{stats.normalized}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Chưa chuẩn hóa</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
            </div>
            <XCircle className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('ma')}
                >
                  <div className="flex items-center gap-2">
                    Mã SP
                    {renderSortIcon('ma')}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('ten')}
                >
                  <div className="flex items-center gap-2">
                    Tên sản phẩm
                    {renderSortIcon('ten')}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tên chuẩn hóa
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ĐVT
                </th>
                <th 
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('dgia')}
                >
                  <div className="flex items-center justify-end gap-2">
                    Đơn giá
                    {renderSortIcon('dgia')}
                  </div>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {queryLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                      <span className="text-gray-500">Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Không tìm thấy sản phẩm phù hợp' 
                      : 'Không có dữ liệu'
                    }
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {product.ma || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {product.ten || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {product.ten2 ? (
                        <span className="text-green-700 dark:text-green-400 font-medium">
                          {product.ten2}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Chưa chuẩn hóa</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {product.dvt || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white font-medium">
                      {formatPrice(product.dgia)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {product.ten2 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                          <CheckCircle2 className="h-3 w-3" />
                          Đã chuẩn hóa
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs rounded-full">
                          <XCircle className="h-3 w-3" />
                          Chưa xử lý
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredProducts.length > limit && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Hiển thị {((page - 1) * limit) + 1} - {Math.min(page * limit, filteredProducts.length)} trong tổng số {filteredProducts.length} sản phẩm
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trang trước
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Trang {page} / {Math.ceil(filteredProducts.length / limit)}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= Math.ceil(filteredProducts.length / limit)}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trang sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Normalization Modal */}
      {showNormalizeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Chuẩn hóa tên sản phẩm
            </h3>

            <div className="space-y-4">
              {/* Mode Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chế độ
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={normalizeMode === 'preview'}
                      onChange={() => setNormalizeMode('preview')}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Xem trước (Dry run)
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={normalizeMode === 'update'}
                      onChange={() => setNormalizeMode('update')}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Cập nhật thực tế
                    </span>
                  </label>
                </div>
              </div>

              {/* Limit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Số lượng sản phẩm
                </label>
                <select
                  value={normalizeLimit}
                  onChange={(e) => setNormalizeLimit(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value={10}>10 sản phẩm</option>
                  <option value={100}>100 sản phẩm</option>
                  <option value={1000}>1000 sản phẩm</option>
                  <option value={0}>Tất cả</option>
                </select>
              </div>

              {/* Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Fuzzy Matching với pg_trgm:</strong> Hệ thống sẽ tự động nhóm các sản phẩm có tên tương tự nhau bằng thuật toán fuzzy matching.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowNormalizeModal(false)}
                disabled={normalizing}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Hủy
              </button>
              <button
                onClick={() => runNormalization(normalizeMode === 'preview', normalizeLimit)}
                disabled={normalizing}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {normalizing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    {normalizeMode === 'preview' ? 'Xem trước' : 'Chạy ngay'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
