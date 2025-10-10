import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export interface InvoiceExportData {
  nbmst?: string;      // MST Người bán
  khmshdon?: string;   // Ký hiệu mẫu
  khhdon?: string;     // Ký hiệu HĐ
  shdon?: string;      // Số HĐ
  cqt?: string;        // CQT
  nbdchi?: string;     // Địa chỉ NB
  nbten?: string;      // Tên NB
  nmdchi?: string;     // Địa chỉ NM
  nmmst?: string;      // MST NM
  nmten?: string;      // Tên NM
  nmtnmua?: string;    // Tên NM mua
  tgtcthue?: number;   // Tiền chưa thuế
  tgtthue?: number;    // Tiền thuế
  tgtttbso?: number;   // Tổng TT (số)
  tgtttbchu?: string;  // Tổng TT (chữ)
  thlap?: string;      // Thời điểm lập
  ttcktmai?: string;   // CKTM
  tthai?: string;      // Trạng thái
  tttbao?: string;     // TT Báo
  ttxly?: string;      // TT Xử lý
}

export interface ExcelPreviewData {
  headers: string[];
  rows: any[][];
  totalRows: number;
  previewRows: number;
  fileName: string;
}

/**
 * Frontend Excel Export Service with Preview
 * Handles all data processing on the client side
 */
class FrontendExcelExportService {
  
  /**
   * Format currency value
   */
  private static formatCurrency(value: number | undefined | null): string {
    if (!value && value !== 0) return '';
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  /**
   * Format date string
   */
  private static formatDate(dateString: string | undefined | null): string {
    if (!dateString) return '';
    try {
      // Handle DD/MM/YYYY format
      if (dateString.includes('/')) {
        return dateString;
      }
      // Handle ISO format
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  }

  /**
   * Format status
   */
  private static formatStatus(status: string | undefined | null): string {
    if (!status) return '';
    if (status === '1' || status === 'active') return 'Hợp lệ';
    if (status === '0' || status === 'cancelled') return 'Đã hủy';
    return status;
  }

  /**
   * Define Excel column headers
   */
  private static getHeaders(): string[] {
    return [
      'STT',
      'MST Người bán',
      'Ký hiệu mẫu',
      'Ký hiệu HĐ',
      'Số HĐ',
      'CQT',
      'Địa chỉ NB',
      'Tên NB',
      'Địa chỉ NM',
      'MST NM',
      'Tên NM',
      'Tên NM mua',
      'Tiền chưa thuế',
      'Tiền thuế',
      'Tổng thanh toán',
      'Tổng TT (chữ)',
      'Thời điểm lập',
      'CKTM',
      'Trạng thái',
      'TT Báo',
      'TT Xử lý'
    ];
  }

  /**
   * Convert invoice data to Excel row
   */
  private static invoiceToRow(invoice: InvoiceExportData, index: number): any[] {
    return [
      index + 1,                                            // STT
      invoice.nbmst || '',                                  // MST Người bán
      invoice.khmshdon || '',                               // Ký hiệu mẫu
      invoice.khhdon || '',                                 // Ký hiệu HĐ
      invoice.shdon || '',                                  // Số HĐ
      invoice.cqt || '',                                    // CQT
      invoice.nbdchi || '',                                 // Địa chỉ NB
      invoice.nbten || '',                                  // Tên NB
      invoice.nmdchi || '',                                 // Địa chỉ NM
      invoice.nmmst || '',                                  // MST NM
      invoice.nmten || '',                                  // Tên NM
      invoice.nmtnmua || '',                                // Tên NM mua
      this.formatCurrency(invoice.tgtcthue),                // Tiền chưa thuế
      this.formatCurrency(invoice.tgtthue),                 // Tiền thuế
      this.formatCurrency(invoice.tgtttbso),                // Tổng thanh toán
      invoice.tgtttbchu || '',                              // Tổng TT (chữ)
      this.formatDate(invoice.thlap),                       // Thời điểm lập
      invoice.ttcktmai || '',                               // CKTM
      this.formatStatus(invoice.tthai),                     // Trạng thái
      invoice.tttbao || '',                                 // TT Báo
      invoice.ttxly || ''                                   // TT Xử lý
    ];
  }

  /**
   * Generate preview data from invoices
   * @param invoices - Array of invoice data
   * @param maxPreviewRows - Maximum rows to preview (default: 10)
   */
  static generatePreview(
    invoices: InvoiceExportData[], 
    maxPreviewRows: number = 10
  ): ExcelPreviewData {
    const headers = this.getHeaders();
    const allRows = invoices.map((invoice, index) => this.invoiceToRow(invoice, index));
    const previewRows = allRows.slice(0, maxPreviewRows);
    
    return {
      headers,
      rows: previewRows,
      totalRows: allRows.length,
      previewRows: previewRows.length,
      fileName: `hoa-don-${new Date().toISOString().split('T')[0]}.xlsx`
    };
  }

  /**
   * Create Excel workbook from invoice data
   */
  private static createWorkbook(invoices: InvoiceExportData[]): XLSX.WorkBook {
    // Prepare data
    const headers = this.getHeaders();
    const rows = invoices.map((invoice, index) => this.invoiceToRow(invoice, index));
    
    // Create worksheet with headers and data
    const wsData = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Set column widths
    const columnWidths = [
      { wch: 5 },   // STT
      { wch: 15 },  // MST Người bán
      { wch: 15 },  // Ký hiệu mẫu
      { wch: 15 },  // Ký hiệu HĐ
      { wch: 12 },  // Số HĐ
      { wch: 8 },   // CQT
      { wch: 30 },  // Địa chỉ NB
      { wch: 25 },  // Tên NB
      { wch: 30 },  // Địa chỉ NM
      { wch: 15 },  // MST NM
      { wch: 25 },  // Tên NM
      { wch: 25 },  // Tên NM mua
      { wch: 18 },  // Tiền chưa thuế
      { wch: 15 },  // Tiền thuế
      { wch: 18 },  // Tổng thanh toán
      { wch: 35 },  // Tổng TT (chữ)
      { wch: 18 },  // Thời điểm lập
      { wch: 10 },  // CKTM
      { wch: 12 },  // Trạng thái
      { wch: 10 },  // TT Báo
      { wch: 10 }   // TT Xử lý
    ];
    ws['!cols'] = columnWidths;
    
    // Style header row (bold)
    const headerRange = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!ws[cellAddress]) continue;
      
      ws[cellAddress].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: 'E0E0E0' } },
        alignment: { horizontal: 'center', vertical: 'center' }
      };
    }
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hóa đơn');
    
    return wb;
  }

  /**
   * Export invoices to Excel file
   * @param invoices - Array of invoice data
   * @param fileName - Custom file name (optional)
   */
  static exportToExcel(
    invoices: InvoiceExportData[], 
    fileName?: string
  ): void {
    try {
      console.log('🚀 Starting frontend Excel export...');
      console.log('📊 Total invoices:', invoices.length);
      
      if (invoices.length === 0) {
        alert('⚠️ Không có dữ liệu để xuất');
        return;
      }
      
      // Create workbook
      const wb = this.createWorkbook(invoices);
      
      // Generate Excel file
      const wbout = XLSX.write(wb, { 
        bookType: 'xlsx', 
        type: 'array',
        cellStyles: true
      });
      
      // Create blob
      const blob = new Blob([wbout], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      // Generate filename
      const defaultFileName = `hoa-don-${new Date().toISOString().split('T')[0]}.xlsx`;
      const finalFileName = fileName || defaultFileName;
      
      // Download file
      saveAs(blob, finalFileName);
      
      console.log('✅ Excel export completed:', finalFileName);
      console.log('📦 File size:', blob.size, 'bytes');
      
    } catch (error) {
      console.error('❌ Frontend Excel export error:', error);
      alert(`❌ Lỗi xuất Excel: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  /**
   * Export with date range in filename
   */
  static exportWithDateRange(
    invoices: InvoiceExportData[],
    fromDate: string,
    toDate: string
  ): void {
    const fileName = `hoa-don-${fromDate}_${toDate}.xlsx`;
    this.exportToExcel(invoices, fileName);
  }

  /**
   * Filter invoices by date range
   */
  static filterByDateRange(
    invoices: InvoiceExportData[],
    fromDate: string,
    toDate: string
  ): InvoiceExportData[] {
    try {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999); // End of day
      
      return invoices.filter(invoice => {
        if (!invoice.thlap) return false;
        
        try {
          // Parse Vietnamese date format DD/MM/YYYY
          let invoiceDate: Date;
          if (invoice.thlap.includes('/')) {
            const [day, month, year] = invoice.thlap.split('/');
            invoiceDate = new Date(`${year}-${month}-${day}`);
          } else {
            invoiceDate = new Date(invoice.thlap);
          }
          
          return invoiceDate >= from && invoiceDate <= to;
        } catch {
          return false;
        }
      });
    } catch (error) {
      console.error('Error filtering by date range:', error);
      return invoices;
    }
  }

  /**
   * Get statistics from invoice data
   */
  static getStatistics(invoices: InvoiceExportData[]): {
    totalInvoices: number;
    totalAmount: number;
    totalTax: number;
    totalBeforeTax: number;
    validInvoices: number;
    cancelledInvoices: number;
  } {
    return {
      totalInvoices: invoices.length,
      totalAmount: invoices.reduce((sum, inv) => sum + (inv.tgtttbso || 0), 0),
      totalTax: invoices.reduce((sum, inv) => sum + (inv.tgtthue || 0), 0),
      totalBeforeTax: invoices.reduce((sum, inv) => sum + (inv.tgtcthue || 0), 0),
      validInvoices: invoices.filter(inv => inv.tthai === '1' || inv.tthai === 'active').length,
      cancelledInvoices: invoices.filter(inv => inv.tthai === '0' || inv.tthai === 'cancelled').length
    };
  }

  /**
   * Validate invoice data before export
   */
  static validateData(invoices: InvoiceExportData[]): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (invoices.length === 0) {
      errors.push('Không có dữ liệu để xuất');
    }
    
    if (invoices.length > 10000) {
      warnings.push(`Số lượng hóa đơn lớn (${invoices.length}). Quá trình export có thể mất thời gian.`);
    }
    
    // Check for missing critical fields
    const missingFields = invoices.filter(inv => !inv.shdon || !inv.nbmst);
    if (missingFields.length > 0) {
      warnings.push(`${missingFields.length} hóa đơn thiếu thông tin quan trọng (Số HĐ hoặc MST)`);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

export default FrontendExcelExportService;
