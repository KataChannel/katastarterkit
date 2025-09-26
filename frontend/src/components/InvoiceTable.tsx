import React from 'react';
import { InvoiceData } from '@/types/invoice';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface InvoiceTableProps {
  invoices: InvoiceData[];
  loading?: boolean;
  onSort?: (field: keyof InvoiceData, direction: 'asc' | 'desc') => void;
  sortField?: keyof InvoiceData;
  sortDirection?: 'asc' | 'desc';
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  loading = false,
  onSort,
  sortField,
  sortDirection
}) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    try {
      // Handle various date formats from API
      let date: Date;
      if (dateString.includes('/')) {
        // DD/MM/YYYY format
        const [day, month, year] = dateString.split('/');
        date = new Date(`${year}-${month}-${day}`);
      } else {
        // ISO format
        date = new Date(dateString);
      }
      
      return format(date, 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  const handleSort = (field: keyof InvoiceData) => {
    if (!onSort) return;
    
    const newDirection = 
      sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(field, newDirection);
  };

  const getSortIcon = (field: keyof InvoiceData) => {
    if (sortField !== field) {
      return '↕️';
    }
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded mb-2"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!invoices || invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">📄</div>
        <p className="text-gray-600">Không có dữ liệu hóa đơn</p>
        <p className="text-gray-500 text-sm">Vui lòng thay đổi bộ lọc để xem kết quả</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('shdon')}
            >
              <div className="flex items-center space-x-1">
                <span>Số hóa đơn</span>
                <span className="text-gray-400">{getSortIcon('shdon')}</span>
              </div>
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('khmshdon')}
            >
              <div className="flex items-center space-x-1">
                <span>Ký hiệu</span>
                <span className="text-gray-400">{getSortIcon('khmshdon')}</span>
              </div>
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('tdlap')}
            >
              <div className="flex items-center space-x-1">
                <span>Ngày lập</span>
                <span className="text-gray-400">{getSortIcon('tdlap')}</span>
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Người bán
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Người mua
            </th>
            <th
              className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('tgtcthue')}
            >
              <div className="flex items-center justify-end space-x-1">
                <span>Tiền chưa thuế</span>
                <span className="text-gray-400">{getSortIcon('tgtcthue')}</span>
              </div>
            </th>
            <th
              className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('tgtthue')}
            >
              <div className="flex items-center justify-end space-x-1">
                <span>Tiền thuế</span>
                <span className="text-gray-400">{getSortIcon('tgtthue')}</span>
              </div>
            </th>
            <th
              className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('tgtttbso')}
            >
              <div className="flex items-center justify-end space-x-1">
                <span>Tổng thanh toán</span>
                <span className="text-gray-400">{getSortIcon('tgtttbso')}</span>
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {invoices.map((invoice, index) => (
            <tr 
              key={invoice.id || `${invoice.shdon}-${invoice.khmshdon}-${index}`}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-4 text-sm font-medium text-gray-900">
                {invoice.shdon}
              </td>
              <td className="px-4 py-4 text-sm text-gray-600">
                {invoice.khmshdon}
              </td>
              <td className="px-4 py-4 text-sm text-gray-600">
                {formatDate(invoice.tdlap)}
              </td>
              <td className="px-4 py-4 text-sm">
                <div>
                  <div className="font-medium text-gray-900 truncate max-w-[200px]" title={invoice.tentcgp}>
                    {invoice.tentcgp}
                  </div>
                  <div className="text-gray-500 text-xs">
                    MST: {invoice.msttcgp}
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-sm">
                <div>
                  <div className="font-medium text-gray-900 truncate max-w-[200px]" title={invoice.tenxmua || 'N/A'}>
                    {invoice.tenxmua || 'N/A'}
                  </div>
                  {invoice.msttmua && (
                    <div className="text-gray-500 text-xs">
                      MST: {invoice.msttmua}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-4 py-4 text-sm text-right text-gray-900 font-medium">
                {formatCurrency(invoice.tgtcthue)}
              </td>
              <td className="px-4 py-4 text-sm text-right text-gray-900 font-medium">
                {formatCurrency(invoice.tgtthue)}
              </td>
              <td className="px-4 py-4 text-sm text-right text-gray-900 font-bold">
                {formatCurrency(invoice.tgtttbso)}
              </td>
              <td className="px-4 py-4 text-sm">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  invoice.tghdon === 'active' || !invoice.tghdon
                    ? 'bg-green-100 text-green-800' 
                    : invoice.tghdon === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {invoice.tghdon === 'active' || !invoice.tghdon ? 'Hợp lệ' : 
                   invoice.tghdon === 'cancelled' ? 'Đã hủy' : 
                   invoice.tghdon || 'Không xác định'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;