import axios, { AxiosResponse } from 'axios';
import { InvoiceApiResponse, InvoiceApiParams, InvoiceFilter, InvoiceData, AdvancedFilter, InvoiceType } from '@/types/invoice';
import ConfigService from './configService';
import DateService from './dateService';

export class InvoiceApiService {
  private static readonly BASE_URL = 'https://hoadondientu.gdt.gov.vn:30000';

  private static createAxiosInstance() {
    const config = ConfigService.getValidatedConfig();
    
    return axios.create({
      baseURL: this.BASE_URL,
      headers: {
        'Authorization': `Bearer ${config.bearerToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });
  }

  /**
   * Build search query string for date range and filters
   */
  private static buildSearchQuery(filter: InvoiceFilter | AdvancedFilter): string {
    const searchParts: string[] = [];

    // Handle month/year inputs or direct date inputs
    let fromDate = filter.fromDate;
    let toDate = filter.toDate;

    if (filter.month && filter.year) {
      const dateRange = DateService.getMonthDateRange(filter.month, filter.year);
      fromDate = dateRange.fromDate;
      toDate = dateRange.toDate;
    }

    // Add date range (required)
    if (fromDate) {
      searchParts.push(`tdlap=ge=${fromDate}T00:00:00`);
    }
    if (toDate) {
      searchParts.push(`tdlap=le=${toDate}T23:59:59`);
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

    // Advanced filters
    const advancedFilter = filter as AdvancedFilter;
    if (advancedFilter.globalSearch) {
      // Search across multiple fields
      const globalTerm = encodeURIComponent(advancedFilter.globalSearch);
      searchParts.push(`(shdon=like=${globalTerm};tenxmua=like=${globalTerm};msttcgp=like=${globalTerm})`);
    }

    if (advancedFilter.amountFrom) {
      searchParts.push(`tgtttbso=ge=${advancedFilter.amountFrom}`);
    }

    if (advancedFilter.amountTo) {
      searchParts.push(`tgtttbso=le=${advancedFilter.amountTo}`);
    }

    if (advancedFilter.status) {
      searchParts.push(`tghdon=like=${encodeURIComponent(advancedFilter.status)}`);
    }

    return searchParts.join(';');
  }

  /**
   * Fetch invoice data from external API
   */
  static async fetchInvoices(
    filter: InvoiceFilter | AdvancedFilter,
    params: InvoiceApiParams = {},
    invoiceType?: InvoiceType
  ): Promise<InvoiceApiResponse> {
    try {
      const axiosInstance = this.createAxiosInstance();
      const config = ConfigService.getValidatedConfig();
      
      const searchQuery = this.buildSearchQuery(filter);
      const endpoint = ConfigService.getApiEndpoint(invoiceType);
      
      const queryParams = new URLSearchParams({
        sort: params.sort || 'tdlap:desc,khmshdon:asc,shdon:desc',
        size: (params.size || config.pageSize).toString(),
        page: (params.page || 0).toString(),
        ...(searchQuery && { search: searchQuery })
      });

      const response: AxiosResponse<InvoiceApiResponse> = await axiosInstance.get(
        `${endpoint}?${queryParams.toString()}`
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching invoice data:', error);
      
      // Handle different types of errors
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Token xác thực không hợp lệ hoặc đã hết hạn. Vui lòng cập nhật token trong cấu hình.');
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
   * Get default month and year (current month)
   */
  static getDefaultMonthYear(): { month: number; year: number } {
    return DateService.getCurrentMonthYear();
  }

  /**
   * Get default date range (current month)
   */
  static getDefaultDateRange(): { fromDate: string; toDate: string } {
    const { month, year } = DateService.getCurrentMonthYear();
    return DateService.getMonthDateRange(month, year);
  }

  /**
   * Format date for API (DD/MM/YYYY format as used in the original endpoint)
   */
  private static formatDateForAPI(date: Date): string {
    return DateService.formatDate(date);
  }

  /**
   * Validate date range
   */
  static validateDateRange(fromDate: string, toDate: string): { isValid: boolean; error?: string } {
    return DateService.validateDateRange(fromDate, toDate);
  }

  /**
   * Get configuration options for UI
   */
  static getConfigOptions() {
    return {
      invoiceTypes: [
        { value: 'banra', label: 'Hóa đơn bán ra' },
        { value: 'muavao', label: 'Hóa đơn mua vào' }
      ],
      pageSizes: [10, 20, 50, 100, 200],
      monthOptions: DateService.getMonthOptions(),
      yearOptions: DateService.getYearOptions(),
      dateRangeOptions: DateService.getDateRangeOptions()
    };
  }
}

export default InvoiceApiService;