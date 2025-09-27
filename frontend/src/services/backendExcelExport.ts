import axios from 'axios';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';

export interface ExcelExportParams {
  fromDate: string;
  toDate: string;
  invoiceType?: 'banra' | 'muavao';
}

export class BackendExcelExportService {
  private static getApiUrl(): string {
    // Get backend URL from environment or default
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    return `${backendUrl}/ketoan/listhoadon`;
  }

  /**
   * Export invoices to Excel using backend API
   */
  static async exportToExcel(params: ExcelExportParams): Promise<void> {
    try {
      console.log('🚀 Starting Excel export with params:', params);
      
      const response = await axios.get(`${this.getApiUrl()}/export-excel`, {
        params: {
          fromDate: params.fromDate,
          toDate: params.toDate,
          ...(params.invoiceType && { invoiceType: params.invoiceType }),
        },
        responseType: 'blob', // Important for file download
        timeout: 120000, // 2 minutes timeout for large exports
      });

      console.log('✅ Excel export response received:', {
        size: response.data.size,
        type: response.data.type,
        headers: response.headers
      });

      // Extract filename from response headers or create default
      const contentDisposition = response.headers['content-disposition'];
      let filename = `hoadon_${params.fromDate}_${params.toDate}.xlsx`;
      
      if (contentDisposition) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition);
        if (matches != null && matches[1]) { 
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      // Create blob and download
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      saveAs(blob, filename);
      
      console.log(`✅ Excel file downloaded: ${filename}`);
      toast.success(`Đã xuất file Excel: ${filename}`);
      
    } catch (error: any) {
      console.error('❌ Excel export error:', error);
      
      let errorMessage = 'Không thể xuất file Excel';
      
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = 'Tham số không hợp lệ. Vui lòng kiểm tra khoảng thời gian.';
        } else if (error.response.status === 404) {
          errorMessage = 'Không tìm thấy dữ liệu trong khoảng thời gian đã chọn.';
        } else if (error.response.status === 500) {
          errorMessage = 'Lỗi hệ thống. Vui lòng thử lại sau.';
        } else {
          errorMessage = `Lỗi ${error.response.status}: ${error.response.data?.message || 'Không thể xuất file'}`;
        }
      } else if (error.request) {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Thời gian chờ quá lâu. Vui lòng thử với khoảng thời gian ngắn hơn.';
      }
      
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Preview data that would be exported (for testing)
   */
  static async previewData(params: ExcelExportParams, limit: number = 10) {
    try {
      console.log('🔍 Previewing export data:', params);
      
      const response = await axios.get(`${this.getApiUrl()}/preview`, {
        params: {
          fromDate: params.fromDate,
          toDate: params.toDate,
          limit,
          ...(params.invoiceType && { invoiceType: params.invoiceType }),
        },
        timeout: 30000,
      });

      console.log('✅ Preview data received:', response.data);
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Preview data error:', error);
      throw error;
    }
  }

  /**
   * Validate date range before export
   */
  static validateDateRange(fromDate: string, toDate: string): { isValid: boolean; message?: string } {
    try {
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);
      console.log('🔍 Validating date range:', { fromDate, toDate, startDate, endDate });
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return { isValid: false, message: 'Định dạng ngày không hợp lệ 456' };
      }
      
      if (startDate > endDate) {
        return { isValid: false, message: 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc' };
      }
      
      // Check if date range is not too large (prevent performance issues)
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff > 365) {
        return { isValid: false, message: 'Khoảng thời gian không được vượt quá 365 ngày' };
      }
      
      return { isValid: true };
    } catch (error) {
      return { isValid: false, message: 'Lỗi kiểm tra khoảng thời gian' };
    }
  }
}

export default BackendExcelExportService;