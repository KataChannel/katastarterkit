import axios, { AxiosResponse } from 'axios';
import { InvoiceApiResponse, InvoiceApiParams, InvoiceFilter, InvoiceData } from '@/types/invoice';

export class InvoiceApiService {
  private static readonly BASE_URL = 'https://hoadondientu.gdt.gov.vn:30000';
  private static readonly BEARER_TOKEN = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI1OTAwNDI4OTA0IiwidHlwZSI6MiwiZXhwIjoxNzU4OTQ2MjgxLCJpYXQiOjE3NTg4NTk4ODF9.Uo17DIposfoivAM-o6BYe0gxa6YY2rIeWn1QhthrZitU6cHDFM5A70ngBeGoe1RUPz4R9_K_CjqkB3YbDhNkbA';

  private static createAxiosInstance() {
    return axios.create({
      baseURL: this.BASE_URL,
      headers: {
        'Authorization': `Bearer ${this.BEARER_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });
  }

  /**
   * Build search query string for date range and filters
   */
  private static buildSearchQuery(filter: InvoiceFilter): string {
    const searchParts: string[] = [];

    // Add date range (required)
    if (filter.fromDate) {
      searchParts.push(`tdlap=ge=${filter.fromDate}T00:00:00`);
    }
    if (filter.toDate) {
      searchParts.push(`tdlap=le=${filter.toDate}T23:59:59`);
    }

    // Add optional filters
    if (filter.invoiceNumber) {
      searchParts.push(`shdon=like=${encodeURIComponent(filter.invoiceNumber)}`);
    }
    if (filter.taxCode) {
      searchParts.push(`msttcgp=like=${encodeURIComponent(filter.taxCode)}`);
    }
    if (filter.buyerName) {
      searchParts.push(`tenxmua=like=${encodeURIComponent(filter.buyerName)}`);
    }

    return searchParts.join(';');
  }

  /**
   * Fetch invoice data from external API
   */
  static async fetchInvoices(
    filter: InvoiceFilter,
    params: InvoiceApiParams = {}
  ): Promise<InvoiceApiResponse> {
    try {
      const axiosInstance = this.createAxiosInstance();
      
      const searchQuery = this.buildSearchQuery(filter);
      
      const queryParams = new URLSearchParams({
        sort: params.sort || 'tdlap:desc,khmshdon:asc,shdon:desc',
        size: (params.size || 15).toString(),
        page: (params.page || 0).toString(),
        ...(searchQuery && { search: searchQuery })
      });

      const response: AxiosResponse<InvoiceApiResponse> = await axiosInstance.get(
        `/query/invoices/sold?${queryParams.toString()}`
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching invoice data:', error);
      
      // Handle different types of errors
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Token xác thực không hợp lệ hoặc đã hết hạn');
        } else if (error.response?.status === 403) {
          throw new Error('Không có quyền truy cập dữ liệu hóa đơn');
        } else if (error.response?.status === 404) {
          throw new Error('Endpoint API không tồn tại');
        } else if (error.code === 'ECONNABORTED') {
          throw new Error('Kết nối timeout, vui lòng thử lại');
        } else if (error.response?.status && error.response.status >= 500) {
          throw new Error('Lỗi hệ thống phía server, vui lòng thử lại sau');
        }
      }
      
      throw new Error('Không thể tải dữ liệu hóa đơn. Vui lòng kiểm tra kết nối internet và thử lại.');
    }
  }

  /**
   * Get default date range (last 30 days)
   */
  static getDefaultDateRange(): { fromDate: string; toDate: string } {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    return {
      fromDate: this.formatDateForAPI(thirtyDaysAgo),
      toDate: this.formatDateForAPI(today)
    };
  }

  /**
   * Format date for API (DD/MM/YYYY format as used in the original endpoint)
   */
  private static formatDateForAPI(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /**
   * Validate date range
   */
  static validateDateRange(fromDate: string, toDate: string): { isValid: boolean; error?: string } {
    const from = new Date(fromDate.split('/').reverse().join('-'));
    const to = new Date(toDate.split('/').reverse().join('-'));
    const today = new Date();

    if (from > to) {
      return { isValid: false, error: 'Ngày bắt đầu không thể lớn hơn ngày kết thúc' };
    }

    if (to > today) {
      return { isValid: false, error: 'Ngày kết thúc không thể lớn hơn ngày hiện tại' };
    }

    // Check if date range is too large (more than 365 days)
    const daysDiff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 365) {
      return { isValid: false, error: 'Khoảng thời gian không được vượt quá 365 ngày' };
    }

    return { isValid: true };
  }
}

export default InvoiceApiService;