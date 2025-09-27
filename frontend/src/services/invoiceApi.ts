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
        ...(searchQuery && { search: searchQuery }),
        ...(params.state && { state: params.state })
      });

      const response: AxiosResponse<InvoiceApiResponse> = await axiosInstance.get(
        `${endpoint}?${queryParams.toString()}`
      );

      const responseData = response.data;
      
      // Check if we need to fetch more data (when total > 50)
      if (responseData.total && responseData.total > 50 && responseData.state && !params.state) {
        console.log(`Total records: ${responseData.total}, fetching all pages...`);
        return await this.fetchAllInvoices(filter, params, invoiceType, responseData);
      }

      return responseData;
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
   * Fetch all invoices when total > 50 using state-based pagination
   */
  private static async fetchAllInvoices(
    filter: InvoiceFilter | AdvancedFilter,
    params: InvoiceApiParams,
    invoiceType?: InvoiceType,
    initialResponse?: InvoiceApiResponse
  ): Promise<InvoiceApiResponse> {
    const allData: InvoiceData[] = [];
    let currentState: string | undefined = initialResponse?.state;
    let totalFetched = 0;
    const totalRecords = initialResponse?.total || 0;
    let pageCount = 1;
    
    // Add initial response data if provided
    if (initialResponse?.datas) {
      allData.push(...initialResponse.datas);
      totalFetched = initialResponse.datas.length;
    }
    
    console.log(`🔄 Starting pagination fetch: ${totalFetched}/${totalRecords} records (${Math.ceil(totalRecords / 50)} estimated pages)`);
    
    // Continue fetching while we have a state and haven't reached the total
    while (currentState && totalFetched < totalRecords) {
      try {
        const statePreview = currentState.length > 50 ? `${currentState.substring(0, 50)}...` : currentState;
        console.log(`📄 Fetching page ${pageCount + 1} with state: ${statePreview}`);
        
        const nextResponse = await this.fetchInvoices(
          filter,
          { ...params, state: currentState },
          invoiceType
        );
        
        if (nextResponse.datas && nextResponse.datas.length > 0) {
          allData.push(...nextResponse.datas);
          totalFetched += nextResponse.datas.length;
          const progress = Math.round((totalFetched / totalRecords) * 100);
          console.log(`✅ Page ${pageCount + 1}: ${nextResponse.datas.length} records | Total: ${totalFetched}/${totalRecords} (${progress}%)`);
        } else {
          console.log(`⚠️ Page ${pageCount + 1}: No data returned`);
        }
        
        // Update state for next iteration
        currentState = nextResponse.state;
        pageCount++;
        
        // Break if no more state (reached end)
        if (!currentState) {
          console.log('🏁 No more state token, pagination complete');
          break;
        }
        
        // Safety check to prevent infinite loops
        if (totalFetched >= totalRecords) {
          console.log('🎯 Reached total record count, stopping pagination');
          break;
        }
        
        // Safety check for excessive pages (prevent runaway pagination)
        if (pageCount > 100) {
          console.warn('⚠️ Exceeded 100 pages, stopping pagination for safety');
          break;
        }
        
        // Add a small delay to prevent overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error(`❌ Error during pagination fetch (page ${pageCount + 1}):`, error);
        // If pagination fails, return what we have so far
        break;
      }
    }
    
    const successRate = Math.round((allData.length / totalRecords) * 100);
    console.log(`🎉 Pagination complete: fetched ${allData.length} records out of ${totalRecords} total (${successRate}% success rate)`);
    
    // Return combined result
    return {
      datas: allData,
      totalElements: totalRecords,
      totalPages: Math.ceil(totalRecords / (params.size || 50)),
      size: allData.length,
      number: 0,
      numberOfElements: allData.length,
      first: true,
      last: true,
      total: totalRecords,
      state: undefined // Clear state since we've fetched everything
    };
  }

  /**
   * Fetch invoices with progress callback for UI updates
   */
  static async fetchInvoicesWithProgress(
    filter: InvoiceFilter | AdvancedFilter,
    params: InvoiceApiParams = {},
    invoiceType?: InvoiceType,
    onProgress?: (current: number, total: number, percentage: number) => void
  ): Promise<InvoiceApiResponse> {
    // First, get initial response to check total count
    const initialResponse = await this.fetchInvoices(filter, params, invoiceType);
    
    // If total <= 50 or no state, return as is
    if (!initialResponse.total || initialResponse.total <= 50 || !initialResponse.state) {
      onProgress?.(initialResponse.datas.length, initialResponse.total || initialResponse.datas.length, 100);
      return initialResponse;
    }
    
    // For large datasets, use pagination with progress tracking
    const allData: InvoiceData[] = [];
    let currentState: string | undefined = initialResponse.state;
    let totalFetched = 0;
    const totalRecords = initialResponse.total;
    
    // Add initial data
    if (initialResponse.datas) {
      allData.push(...initialResponse.datas);
      totalFetched = initialResponse.datas.length;
      onProgress?.(totalFetched, totalRecords, Math.round((totalFetched / totalRecords) * 100));
    }
    
    // Continue fetching with progress updates
    while (currentState && totalFetched < totalRecords) {
      try {
        const nextResponse = await this.fetchInvoices(
          filter,
          { ...params, state: currentState },
          invoiceType
        );
        
        if (nextResponse.datas && nextResponse.datas.length > 0) {
          allData.push(...nextResponse.datas);
          totalFetched += nextResponse.datas.length;
          const percentage = Math.round((totalFetched / totalRecords) * 100);
          onProgress?.(totalFetched, totalRecords, percentage);
        }
        
        currentState = nextResponse.state;
        
        if (!currentState || totalFetched >= totalRecords) break;
        
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error('Error during progress fetch:', error);
        break;
      }
    }
    
    return {
      datas: allData,
      totalElements: totalRecords,
      totalPages: Math.ceil(totalRecords / (params.size || 50)),
      size: allData.length,
      number: 0,
      numberOfElements: allData.length,
      first: true,
      last: true,
      total: totalRecords,
      state: undefined
    };
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