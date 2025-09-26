'use client'

import React, { useState, useEffect } from 'react';
import InvoiceTable from '@/components/InvoiceTable';
import ConfigModal from '@/components/ConfigModal';
import InvoiceApiService from '@/services/invoiceApi';
import ExcelExportService from '@/services/excelExport';
import ConfigService from '@/services/configService';
import DateService from '@/services/dateService';
import { InvoiceData, AdvancedFilter, InvoiceApiResponse, InvoiceType } from '@/types/invoice';
import { Search, RefreshCw, FileSpreadsheet, Settings, Calendar, Filter, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import toast from 'react-hot-toast';

const ListHoaDonPage = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 15,
    totalElements: 0,
    totalPages: 0
  });

  // Configuration state
  const [config, setConfig] = useState(ConfigService.getConfig());
  const [showConfigModal, setShowConfigModal] = useState(false);

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

  // Fetch invoice data from API
  const fetchInvoices = async (pageNumber: number = 0, showLoading: boolean = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      // Update config in case it changed
      const currentConfig = ConfigService.getValidatedConfig();
      setConfig(currentConfig);

      let dateValidation;
      if (filter.month && filter.year) {
        // Validate month/year combination
        if (filter.month < 1 || filter.month > 12) {
          toast.error('Tháng phải từ 1 đến 12');
          return;
        }
      } else {
        // Validate date range
        dateValidation = DateService.validateDateRange(filter.fromDate, filter.toDate);
        if (!dateValidation.isValid) {
          toast.error(dateValidation.error || 'Khoảng thời gian không hợp lệ');
          return;
        }
      }

      const response: InvoiceApiResponse = await InvoiceApiService.fetchInvoices(filter, {
        page: pageNumber,
        size: currentConfig.pageSize,
        sort: `${sortField}:${sortDirection},khmshdon:asc,shdon:desc`
      }, currentConfig.invoiceType);
      
      setInvoices(response.datas || []);
      setPagination({
        page: response.number || 0,
        size: response.size || currentConfig.pageSize,
        totalElements: response.totalElements || 0,
        totalPages: response.totalPages || 0
      });

      if (response.datas && response.datas.length === 0 && pageNumber === 0) {
        toast(`Không tìm thấy hóa đơn ${currentConfig.invoiceType === 'banra' ? 'bán ra' : 'mua vào'} nào trong khoảng thời gian đã chọn`, {
          icon: 'ℹ️'
        });
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Không thể tải dữ liệu hóa đơn';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
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
      if (!invoices || invoices.length === 0) {
        toast.error('Không có dữ liệu để xuất');
        return;
      }

      toast.loading('Đang xuất file Excel...', { id: 'excel-export' });
      
      ExcelExportService.exportToExcel(invoices, {
        filename: `DanhSachHoaDon_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`
      });

      toast.success('Đã xuất file Excel thành công', { id: 'excel-export' });
    } catch (error: any) {
      toast.error(error?.message || 'Không thể xuất file Excel', { id: 'excel-export' });
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
                  Loại: {config.invoiceType === 'banra' ? 'Hóa đơn bán ra' : 'Hóa đơn mua vào'}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Kích thước trang: {config.pageSize}
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
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Làm mới
              </button>
              
              <button
                type="button"
                onClick={handleExportExcel}
                disabled={!invoices || invoices.length === 0}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Xuất Excel
              </button>
            </div>
          </form>
        </div>

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
