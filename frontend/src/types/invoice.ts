// Vietnamese Invoice Data Types for Electronic Tax Invoice API

export interface InvoiceData {
  id?: string;
  khmshdon: string; // Ký hiệu mẫu số hóa đơn (Invoice template symbol)
  shdon: string;    // Số hóa đơn (Invoice number)
  tdlap: string;    // Thời điểm lập (Creation date)
  msttcgp: string;  // Mã số thuế TCGp (Tax code of issuer)
  tentcgp: string;  // Tên TCGp (Name of issuer)
  dctcgp?: string;  // Địa chỉ TCGp (Address of issuer)
  msttmua?: string; // Mã số thuế TMua (Tax code of buyer)
  tenxmua?: string; // Tên người mua (Buyer name)
  dcxmua?: string;  // Địa chỉ người mua (Buyer address)
  tgtcthue: number; // Tổng giá trị chưa thuế (Total value before tax)
  tgtthue: number;  // Tổng giá trị thuế (Total tax value)
  tgtttbso: number; // Tổng giá trị thanh toán bằng số (Total payment amount)
  tgtttchu?: string; // Tổng giá trị thanh toán bằng chữ (Total payment in words)
  dvtte?: string;   // Đơn vị tiền tệ (Currency unit)
  tghdon?: string;  // Trạng thái hóa đơn (Invoice status)
  pthuc?: string;   // Phương thức thanh toán (Payment method)
  mtdieu?: string;  // Mô tả điều khoản (Terms description)
  ttxmua?: string;  // Thông tin người mua (Buyer information)
  nbmst?: string;   // Người bán MST (Seller tax code)
  nten?: string;    // Người tên (Person name)
  dchi?: string;    // Địa chỉ (Address)
  stk?: string;     // Số tài khoản (Account number)
  nh?: string;      // Ngân hàng (Bank)
  fkey?: string;    // File key
  cccd?: string;    // Căn cước công dân (Citizen ID)
}

export interface InvoiceItem {
  stt: number;      // Số thứ tự (Sequential number)
  mahang?: string;  // Mã hàng (Item code)
  tenhang: string;  // Tên hàng hóa, dịch vụ (Item/service name)
  dvt?: string;     // Đơn vị tính (Unit of measurement)
  sluong: number;   // Số lượng (Quantity)
  dgia: number;     // Đơn giá (Unit price)
  thtien: number;   // Thành tiền (Line total)
  tsuat?: number;   // Thuế suất (Tax rate)
  tthue: number;    // Tiền thuế (Tax amount)
}

export interface InvoiceApiResponse {
  datas: InvoiceData[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
}

export interface InvoiceApiParams {
  sort?: string;    // Sorting parameters
  size?: number;    // Page size
  page?: number;    // Page number
  search?: string;  // Search query with date range and filters
}

export interface InvoiceFilter {
  fromDate: string;  // Start date (tdlap>=)
  toDate: string;    // End date (tdlap<=)
  invoiceNumber?: string;  // Số hóa đơn
  taxCode?: string;  // Mã số thuế
  buyerName?: string; // Tên người mua
  month?: number;    // Tháng (1-12)
  year?: number;     // Năm
}

export interface ExportOptions {
  filename?: string;
  includeHeaders?: boolean;
  dateFormat?: string;
  currencyFormat?: string;
}

// Configuration types
export interface InvoiceConfig {
  bearerToken: string;
  pageSize: number;
  invoiceType: 'banra' | 'muavao';
  apiEndpoint?: string;
}

export type InvoiceType = 'banra' | 'muavao';

// Enhanced filtering and search
export interface AdvancedFilter extends InvoiceFilter {
  globalSearch?: string;    // Search across multiple fields
  dateRange?: string;       // Predefined date ranges
  status?: string;          // Invoice status filter
  amountFrom?: number;      // Minimum amount filter
  amountTo?: number;        // Maximum amount filter
}

// Table configuration
export interface TableConfig {
  sortField: keyof InvoiceData;
  sortDirection: 'asc' | 'desc';
  currentPage: number;
  pageSize: number;
  filters: AdvancedFilter;
}