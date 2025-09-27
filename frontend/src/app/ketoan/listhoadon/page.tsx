'use client'

import React, { useState, useEffect } from 'react';
import InvoiceTable from '@/components/InvoiceTable';
import ConfigModal from '@/components/ConfigModal';
import InvoiceApiService from '@/services/invoiceApi';
import ExcelExportService from '@/services/excelExport';
import BackendExcelExportService from '@/services/backendExcelExport';
import ConfigService from '@/services/configService';
import DateService from '@/services/dateService';
import { useInvoiceDatabase } from '@/services/invoiceDatabaseServiceNew';
import { InvoiceData, AdvancedFilter, InvoiceApiResponse, InvoiceType } from '@/types/invoice';
import { Search, RefreshCw, FileSpreadsheet, Settings, Calendar, Filter, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import toast from 'react-hot-toast';

const ListHoaDonPage = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 50,
    totalElements: 0,
    totalPages: 0
  });

  // Configuration state
  const [config, setConfig] = useState(ConfigService.getConfig());
  const [showConfigModal, setShowConfigModal] = useState(false);
  
  // Database integration
  const { syncData, searchInvoices: searchDatabaseInvoices, isLoading: dbLoading } = useInvoiceDatabase();
  const [syncStatus, setSyncStatus] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Filter state - now using month/year instead of direct dates
  const [selectedMonth, setSelectedMonth] = useState<number>(() => {
    const { month } = DateService.getCurrentMonthYear();
    return month;
  });
  
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    const { year } = DateService.getCurrentMonthYear();
    return year;
  });

  const [filter, setFilter] = useState<AdvancedFilter>(() => {
    const { month, year } = DateService.getCurrentMonthYear();
    const dateRange = DateService.getMonthDateRange(month, year);
    return {
      fromDate: dateRange.fromDate,
      toDate: dateRange.toDate,
      month,
      year,
      invoiceNumber: '',
      taxCode: '',
      buyerName: '',
      globalSearch: '',
      amountFrom: undefined,
      amountTo: undefined
    };
  });

  // Quick date range filters
  const [quickDateRange, setQuickDateRange] = useState<string>('custom');

  // Sort state
  const [sortField, setSortField] = useState<keyof InvoiceData>('tdlap');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Client-side hydration check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update filter when month/year changes
  useEffect(() => {
    const dateRange = DateService.getMonthDateRange(selectedMonth, selectedYear);
    setFilter(prev => ({
      ...prev,
      fromDate: dateRange.fromDate,
      toDate: dateRange.toDate,
      month: selectedMonth,
      year: selectedYear
    }));
  }, [selectedMonth, selectedYear]);

  // Sync data from external API to database
  const syncDataFromAPI = async () => {
    try {
      setIsSyncing(true);
      setSyncStatus('Đang lấy dữ liệu từ API bên ngoài...');
      
      // Update config in case it changed
      const currentConfig = ConfigService.getValidatedConfig();
      setConfig(currentConfig);

      // Validate month/year combination
      if (!filter.month || !filter.year || filter.month < 1 || filter.month > 12) {
        toast.error('Vui lòng chọn tháng và năm hợp lệ');
        return;
      }

      // Fetch data from external API
      const response: InvoiceApiResponse = await InvoiceApiService.fetchInvoices(filter, {
        page: 0,
        size: 50, // Get more records for sync
        sort: `tdlap:desc,khmshdon:asc,shdon:desc`
      }, currentConfig.invoiceType);

      if (response.datas && response.datas.length > 0) {
        setSyncStatus(`Đang đồng bộ ${response.datas.length} hóa đơn vào database...`);
        
        // Sync to database
        const syncResult = await syncData(response.datas, []);
        
        if (syncResult.success) {
          toast.success(`Đã đồng bộ thành công ${syncResult.invoicesSaved} hóa đơn`);
          setSyncStatus(`Đồng bộ thành công: ${syncResult.invoicesSaved} hóa đơn`);
          
          // Now fetch from database to display
          await fetchFromDatabase();
        } else {
          toast.error(`Đồng bộ thất bại: ${syncResult.errors.join(', ')}`);
          setSyncStatus('Đồng bộ thất bại');
        }
      } else {
        toast('Không có dữ liệu mới để đồng bộ', { icon: 'ℹ️' });
        setSyncStatus('Không có dữ liệu mới');
        
        // Still try to fetch from database
        await fetchFromDatabase();
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Không thể đồng bộ dữ liệu';
      setError(errorMessage);
      toast.error(errorMessage);
      setSyncStatus('Lỗi đồng bộ');
      console.error('Error syncing data:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Fetch invoices from database
  const fetchFromDatabase = async (pageNumber: number = 0, showLoading: boolean = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      // Build search filters for database
      const searchFilters = {
        page: pageNumber,
        size: config.pageSize,
        sortBy: sortField,
        sortOrder: sortDirection,
        fromDate: filter.fromDate,
        toDate: filter.toDate,
        ...(filter.invoiceNumber && { shdon: filter.invoiceNumber }),
        ...(filter.taxCode && { nbmst: filter.taxCode }),
        ...(filter.buyerName && { nmten: filter.buyerName })
      };

      const result = await searchDatabaseInvoices(searchFilters);
      
      setInvoices(result.invoices || []);
      setPagination({
        page: result.page || 0,
        size: result.size || config.pageSize,
        totalElements: result.total || 0,
        totalPages: result.totalPages || 0
      });

      if ((!result.invoices || result.invoices.length === 0) && pageNumber === 0) {
        toast(`Không tìm thấy hóa đơn nào trong database cho tháng ${selectedMonth}/${selectedYear}`, {
          icon: 'ℹ️'
        });
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Không thể tải dữ liệu từ database';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching from database:', err);
    } finally {
      setLoading(false);
    }
  };

  // Main function to load data (check database first, then sync if needed)
  const fetchInvoices = async (pageNumber: number = 0, showLoading: boolean = true) => {
    // First, try to fetch from database
    await fetchFromDatabase(pageNumber, showLoading);
  };

  // Handle quick date range selection
  const handleQuickDateRange = (range: string) => {
    setQuickDateRange(range);
    
    if (range === 'custom') {
      return; // Keep current month/year selection
    }
    
    const dateRangeOptions = DateService.getDateRangeOptions();
    const selectedOption = dateRangeOptions.find(option => option.value === range);
    
    if (selectedOption) {
      const { fromDate, toDate } = selectedOption.getData();
      setFilter(prev => ({ ...prev, fromDate, toDate }));
    }
  };

  // Handle configuration changes
  const handleConfigChanged = () => {
    const newConfig = ConfigService.getConfig();
    setConfig(newConfig);
    
    // Refresh data with new configuration
    fetchInvoices(0, true);
    toast.success(`Đã chuyển sang hóa đơn ${newConfig.invoiceType === 'banra' ? 'bán ra' : 'mua vào'}`);
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInvoices(0, true);
  };

  // Handle sorting
  const handleSort = (field: keyof InvoiceData, direction: 'asc' | 'desc') => {
    setSortField(field);
    setSortDirection(direction);
    // Refresh data with new sort
    fetchInvoices(pagination.page, false);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    fetchInvoices(newPage, false);
  };

  const handlePageSizeChange = (newSize: number) => {
    ConfigService.setPageSize(newSize);
    setConfig(prev => ({ ...prev, pageSize: newSize }));
    fetchInvoices(0, false);
  };

  // Handle filter changes
  const handleFilterChange = (newFilter: AdvancedFilter) => {
    setFilter(newFilter);
    // Trigger search after a short delay to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchInvoices(0, false);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  // Export to Excel
  const handleExportExcel = async () => {
    try {
      // Validate date range first
      const validation = BackendExcelExportService.validateDateRange(filter.fromDate, filter.toDate);
      if (!validation.isValid) {
        toast.error(validation.message || 'Khoảng thời gian không hợp lệ');
        return;
      }

      toast.loading('Đang xuất file Excel từ server...', { id: 'excel-export' });
      
      // Use backend API for Excel export with date range and invoice type
      await BackendExcelExportService.exportToExcel({
        fromDate: filter.fromDate,
        toDate: filter.toDate,
        invoiceType: config.invoiceType as 'banra' | 'muavao'
      });

      // Success toast is handled in the service
    } catch (error: any) {
      console.error('Excel export error:', error);
      // Error toast is handled in the service
    } finally {
      toast.dismiss('excel-export');
    }
  };

  // Initial load
  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Danh sách hóa đơn điện tử
          </h1>
          <p className="text-gray-600">
            Quản lý và tra cứu hóa đôn điện tử từ hệ thống thuế điện tử
          </p>
        </div>

        {/* Header Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 px-3 py-2 rounded-lg">
                <span className="text-sm font-medium text-blue-800">
                  {isClient ? (
                    `Loại: ${config.invoiceType === 'banra' ? 'Hóa đơn bán ra' : 'Hóa đơn mua vào'}`
                  ) : (
                    'Loại: Hóa đơn bán ra'
                  )}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Kích thước trang: {isClient ? config.pageSize : 20}
              </div>
            </div>
            
            <button
              onClick={() => setShowConfigModal(true)}
              className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4 mr-2" />
              Cấu hình
            </button>
          </div>

          <form onSubmit={handleSearch} className="space-y-6">
            {/* Date Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Quick Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Khoảng thời gian
                </label>
                <select
                  value={quickDateRange}
                  onChange={(e) => handleQuickDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="current_month">Tháng này</option>
                  <option value="previous_month">Tháng trước</option>
                  <option value="last_3_months">3 tháng gần nhất</option>
                  <option value="last_6_months">6 tháng gần nhất</option>
                  <option value="custom">Tùy chọn</option>
                </select>
              </div>

              {/* Month Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tháng
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  disabled={quickDateRange !== 'custom'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                >
                  {DateService.getMonthOptions().map(month => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Năm
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  disabled={quickDateRange !== 'custom'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                >
                  {DateService.getYearOptions().map(year => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range Display */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Từ ngày
                </label>
                <input
                  type="text"
                  value={filter.fromDate}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đến ngày
                </label>
                <input
                  type="text"
                  value={filter.toDate}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                <Search className="w-4 h-4 mr-2" />
                {loading ? 'Đang tìm...' : 'Tìm kiếm'}
              </button>
              
              <button
                type="button"
                onClick={() => fetchInvoices(0, true)}
                disabled={loading || isSyncing}
                className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Làm mới
              </button>
              
              <button
                type="button"
                onClick={syncDataFromAPI}
                disabled={loading || isSyncing || !filter.month || !filter.year}
                className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ từ API'}
              </button>
              
              <button
                type="button"
                onClick={handleExportExcel}
                disabled={!filter.fromDate || !filter.toDate}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                title={`Xuất Excel từ ${filter.fromDate} đến ${filter.toDate}`}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Xuất Excel
                <span className="ml-1 text-xs opacity-75">
                  ({filter.fromDate} - {filter.toDate})
                </span>
              </button>
            </div>
          </form>
        </div>

        {syncStatus && (
          <div className="bg-purple-50 border border-purple-200 text-purple-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <span className="font-medium">Trạng thái đồng bộ:</span>
              <span className="ml-2">{syncStatus}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <span className="font-medium">Lỗi:</span>
              <span className="ml-2">{error}</span>
            </div>
          </div>
        )}

        {/* Enhanced Invoice Table */}
        <InvoiceTable
          invoices={invoices}
          loading={loading}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          filter={filter}
          onFilterChange={handleFilterChange}
          showAdvancedFilter={true}
        />

        {/* Configuration Modal */}
        <ConfigModal
          isOpen={showConfigModal}
          onClose={() => setShowConfigModal(false)}
          onConfigChanged={handleConfigChanged}
        />
      </div>
    </div>
  );
};

export default ListHoaDonPage;
