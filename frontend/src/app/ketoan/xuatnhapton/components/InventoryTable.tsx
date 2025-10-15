import React from 'react';
import { InventoryRow } from '../types';
import { formatCurrency, formatNumber, formatDate } from '../utils';

interface InventoryTableProps {
  rows: InventoryRow[];
  currentPage: number;
  itemsPerPage: number;
  loading?: boolean;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  rows,
  currentPage,
  itemsPerPage,
  loading,
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, rows.length);
  const displayRows = rows.slice(startIndex, endIndex);
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }
  
  if (rows.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-8 text-center text-gray-500">
          Không có dữ liệu để hiển thị
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                STT
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên Sản Phẩm
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã SP
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ĐVT
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50" colSpan={2}>
                Tồn Đầu
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-green-50" colSpan={2}>
                Nhập
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-orange-50" colSpan={2}>
                Xuất
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-purple-50" colSpan={2}>
                Tồn Cuối
              </th>
            </tr>
            <tr>
              <th colSpan={5}></th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 bg-blue-50">SL</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 bg-blue-50">Thành Tiền</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 bg-green-50">SL</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 bg-green-50">Thành Tiền</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 bg-orange-50">SL</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 bg-orange-50">Thành Tiền</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 bg-purple-50">SL</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 bg-purple-50">Thành Tiền</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayRows.map((row, index) => (
              <tr key={`${row.productName}-${row.date}-${index}`} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-500">
                  {startIndex + index + 1}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                  {formatDate(row.date)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {row.productName}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {row.productCode || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {row.unit || '-'}
                </td>
                
                {/* Tồn Đầu */}
                <td className="px-4 py-3 text-sm text-right text-gray-900 bg-blue-50">
                  {formatNumber(row.openingQuantity)}
                </td>
                <td className="px-4 py-3 text-sm text-right text-blue-600 bg-blue-50">
                  {formatCurrency(row.openingAmount)}
                </td>
                
                {/* Nhập */}
                <td className="px-4 py-3 text-sm text-right text-gray-900 bg-green-50">
                  {formatNumber(row.importQuantity)}
                </td>
                <td className="px-4 py-3 text-sm text-right text-green-600 bg-green-50">
                  {formatCurrency(row.importAmount)}
                </td>
                
                {/* Xuất */}
                <td className="px-4 py-3 text-sm text-right text-gray-900 bg-orange-50">
                  {formatNumber(row.exportQuantity)}
                </td>
                <td className="px-4 py-3 text-sm text-right text-orange-600 bg-orange-50">
                  {formatCurrency(row.exportAmount)}
                </td>
                
                {/* Tồn Cuối */}
                <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900 bg-purple-50">
                  {formatNumber(row.closingQuantity)}
                </td>
                <td className="px-4 py-3 text-sm text-right font-semibold text-purple-600 bg-purple-50">
                  {formatCurrency(row.closingAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
