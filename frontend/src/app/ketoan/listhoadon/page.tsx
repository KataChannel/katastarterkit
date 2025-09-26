'use client'

import React, { useState, useEffect } from 'react';
import InvoiceTable from '@/components/InvoiceTable';
import InvoiceApiService from '@/services/invoiceApi';
import ExcelExportService from '@/services/excelExport';
import { InvoiceData, InvoiceFilter, InvoiceApiResponse } from '@/types/invoice';
import { Search, RefreshCw, FileSpreadsheet, BarChart3 } from 'lucide-react';
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

  // Filter state
  const [filter, setFilter] = useState<InvoiceFilter>(() => {
    const defaultRange = InvoiceApiService.getDefaultDateRange();
    return {
      fromDate: defaultRange.fromDate,
      toDate: defaultRange.toDate,
      invoiceNumber: '',
      taxCode: '',
      buyerName: ''
    };
  });

  // Sort state
  const [sortField, setSortField] = useState<keyof InvoiceData>('tdlap');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Fetch invoice data from API
  const fetchInvoices = async (pageNumber: number = 0, showLoading: boolean = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      const dateValidation = InvoiceApiService.validateDateRange(filter.fromDate, filter.toDate);
      if (!dateValidation.isValid) {
        toast.error(dateValidation.error || 'Khoảng thời gian không hợp lệ');
        return;
      }

      const response: InvoiceApiResponse = await InvoiceApiService.fetchInvoices(filter, {
        page: pageNumber,
        size: pagination.size,
        sort: `${sortField}:${sortDirection},khmshdon:asc,shdon:desc`
      });
      console.log(response);
      
      setInvoices(response.datas || []);
      setPagination({
        page: response.number || 0,
        size: response.size || 15,
        totalElements: response.totalElements || 0,
        totalPages: response.totalPages || 0
      });

      if (response.datas && response.datas.length === 0 && pageNumber === 0) {
        toast('Không tìm thấy hóa đơn nào trong khoảng thời gian đã chọn', {
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

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInvoices(0, true);
  };

  // Handle sorting
  const handleSort = (field: keyof InvoiceData, direction: 'asc' | 'desc') => {
    setSortField(field);
    setSortDirection(direction);
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

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Từ ngày
                </label>
                <input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filter.fromDate}
                  onChange={(e) => setFilter({ ...filter, fromDate: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đến ngày
                </label>
                <input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filter.toDate}
                  onChange={(e) => setFilter({ ...filter, toDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số hóa đơn
                </label>
                <input
                  type="text"
                  placeholder="Nhập số hóa đơn"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filter.invoiceNumber}
                  onChange={(e) => setFilter({ ...filter, invoiceNumber: e.target.value })}
                />
              </div>
            </div>

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

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <InvoiceTable
            invoices={invoices}
            loading={loading}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
          />
        </div>
      </div>
    </div>
  );
};

export default ListHoaDonPage;
