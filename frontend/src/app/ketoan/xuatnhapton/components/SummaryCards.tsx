import React from 'react';
import { InventorySummary } from '../types';
import { formatCurrency, formatNumber } from '../utils';

interface SummaryCardsProps {
  summary: InventorySummary;
  loading?: boolean;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Products */}
      <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
        <p className="text-sm text-gray-600">Tổng Số Sản Phẩm</p>
        <p className="text-2xl font-bold text-gray-900">{formatNumber(summary.totalProducts)}</p>
      </div>
      
      {/* Import Summary */}
      <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
        <p className="text-sm text-gray-600">Tổng Nhập</p>
        <p className="text-lg font-semibold text-gray-900">
          {formatNumber(summary.totalImportQuantity)} sp
        </p>
        <p className="text-sm text-green-600">{formatCurrency(summary.totalImportAmount)}</p>
      </div>
      
      {/* Export Summary */}
      <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
        <p className="text-sm text-gray-600">Tổng Xuất</p>
        <p className="text-lg font-semibold text-gray-900">
          {formatNumber(summary.totalExportQuantity)} sp
        </p>
        <p className="text-sm text-orange-600">{formatCurrency(summary.totalExportAmount)}</p>
      </div>
      
      {/* Closing Inventory */}
      <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
        <p className="text-sm text-gray-600">Tồn Cuối</p>
        <p className="text-lg font-semibold text-gray-900">
          {formatNumber(summary.totalClosingQuantity)} sp
        </p>
        <p className="text-sm text-purple-600">{formatCurrency(summary.totalClosingAmount)}</p>
      </div>
    </div>
  );
};
