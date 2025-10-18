'use client'

import React, { useState, useRef } from 'react';
import { Upload, Download, FileSpreadsheet, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api-config';

interface ImportError {
  row: number;
  error: string;
  data?: any;
}

interface ImportResult {
  success: boolean;
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: ImportError[];
  invoiceIds: string[];
  message: string;
}

interface InvoiceImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function InvoiceImportModal({ isOpen, onClose, onSuccess }: InvoiceImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [preview, setPreview] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
        toast.error('Vui lòng chọn file Excel (.xlsx hoặc .xls)');
        return;
      }
      setFile(selectedFile);
      setResult(null);
      setPreview(null);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await apiFetch('/api/invoice-import/template', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Không thể tải file mẫu');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Mau_Import_Hoadon_${new Date().getTime()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Đã tải file mẫu thành công');
    } catch (error) {
      console.error('Error downloading template:', error);
      toast.error('Không thể tải file mẫu');
    }
  };

  const handlePreview = async () => {
    if (!file) {
      toast.error('Vui lòng chọn file để preview');
      return;
    }

    try {
      setImporting(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiFetch('/api/invoice-import/preview', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setPreview(data);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error previewing file:', error);
      toast.error('Không thể preview file');
    } finally {
      setImporting(false);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Vui lòng chọn file để import');
      return;
    }

    try {
      setImporting(true);
      setResult(null);

      const formData = new FormData();
      formData.append('file', file);

      const response = await apiFetch('/api/invoice-import/upload', {
        method: 'POST',
        body: formData,
      });

      const data: ImportResult = await response.json();
      setResult(data);

      if (data.success) {
        toast.success(data.message);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error importing file:', error);
      toast.error('Import thất bại');
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-blue-600" />
            Import dữ liệu hóa đơn
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          {/* Download Template */}
          <div className="mb-6">
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Tải file mẫu
            </button>
            <p className="text-sm text-gray-600 mt-2">
              Tải file Excel mẫu để điền dữ liệu hóa đơn của bạn
            </p>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn file Excel để import
            </label>
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500 cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">Chọn file</span>
              </label>
              {file && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                  {file.name}
                  <button
                    onClick={() => setFile(null)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {file && !result && (
            <div className="flex gap-4 mb-6">
              <button
                onClick={handlePreview}
                disabled={importing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {importing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileSpreadsheet className="w-4 h-4" />
                )}
                Xem trước dữ liệu
              </button>
              <button
                onClick={handleImport}
                disabled={importing}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
              >
                {importing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                Import ngay
              </button>
            </div>
          )}

          {/* Preview Data */}
          {preview && !result && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="font-semibold text-blue-900 mb-2">Preview dữ liệu</h3>
              <p className="text-sm text-blue-700">
                Tìm thấy <strong>{preview.totalInvoices}</strong> hóa đơn trong file
              </p>
              {preview.data && preview.data.length > 0 && (
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-blue-100">
                        <th className="px-2 py-1 text-left">Số HĐ</th>
                        <th className="px-2 py-1 text-left">Ký hiệu</th>
                        <th className="px-2 py-1 text-left">Người bán</th>
                        <th className="px-2 py-1 text-left">Người mua</th>
                        <th className="px-2 py-1 text-right">Tổng tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.data.slice(0, 5).map((invoice: any, idx: number) => (
                        <tr key={idx} className="border-b border-blue-100">
                          <td className="px-2 py-1">{invoice.shdon}</td>
                          <td className="px-2 py-1">{invoice.khhdon}</td>
                          <td className="px-2 py-1">{invoice.nbten}</td>
                          <td className="px-2 py-1">{invoice.nmten}</td>
                          <td className="px-2 py-1 text-right">
                            {invoice.tgtttbso?.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {preview.totalInvoices > 5 && (
                    <p className="text-xs text-blue-600 mt-2">
                      ... và {preview.totalInvoices - 5} hóa đơn khác
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Import Result */}
          {result && (
            <div className="space-y-4">
              {/* Summary */}
              <div className={`p-4 rounded-md ${result.success ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                <div className="flex items-start gap-3">
                  {result.success ? (
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-2 ${result.success ? 'text-green-900' : 'text-yellow-900'}`}>
                      {result.message}
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Tổng số:</span>
                        <span className="ml-2 font-semibold">{result.totalRows}</span>
                      </div>
                      <div>
                        <span className="text-green-600">Thành công:</span>
                        <span className="ml-2 font-semibold text-green-700">{result.successCount}</span>
                      </div>
                      <div>
                        <span className="text-red-600">Lỗi:</span>
                        <span className="ml-2 font-semibold text-red-700">{result.errorCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Errors */}
              {result.errors && result.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <h4 className="font-semibold text-red-900 mb-2">
                    Chi tiết lỗi ({result.errors.length})
                  </h4>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {result.errors.map((error, idx) => (
                      <div key={idx} className="text-sm bg-white p-3 rounded border border-red-100">
                        <div className="flex items-center gap-2 text-red-700 font-medium mb-1">
                          <AlertCircle className="w-4 h-4" />
                          Dòng {error.row}
                        </div>
                        <p className="text-red-600">{error.error}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success Actions */}
              {result.success && result.invoiceIds.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-sm text-green-700">
                    ✅ Đã import thành công <strong>{result.invoiceIds.length}</strong> hóa đơn
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          {!file && !result && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Hướng dẫn</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Tải file mẫu Excel và điền dữ liệu hóa đơn</li>
                <li>Đảm bảo các trường bắt buộc (*) được điền đầy đủ</li>
                <li>Chọn file Excel đã điền dữ liệu</li>
                <li>Click "Xem trước dữ liệu" để kiểm tra trước khi import</li>
                <li>Click "Import ngay" để thêm dữ liệu vào hệ thống</li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-4">
          {result && (
            <button
              onClick={() => {
                setResult(null);
                setFile(null);
                setPreview(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Import tiếp
            </button>
          )}
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
