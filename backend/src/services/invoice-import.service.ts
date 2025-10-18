import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import { Decimal } from '@prisma/client/runtime/library';

interface ImportInvoiceData {
  // Thông tin cơ bản
  shdon?: string; // Số hóa đơn
  khhdon?: string; // Ký hiệu hóa đơn
  khmshdon?: string; // Ký hiệu mẫu số hóa đơn
  tdlap?: Date; // Thời điểm lập
  
  // Thông tin người bán
  nbmst?: string; // Mã số thuế người bán
  nbten?: string; // Tên người bán
  nbdchi?: string; // Địa chỉ người bán
  nbstkhoan?: string; // Số tài khoản người bán
  
  // Thông tin người mua
  nmmst?: string; // Mã số thuế người mua
  nmten?: string; // Tên người mua
  nmdchi?: string; // Địa chỉ người mua
  nmstkhoan?: string; // Số tài khoản người mua
  
  // Thông tin tiền
  tgtcthue?: number; // Tổng giá trị chưa thuế
  tgtthue?: number; // Tổng giá trị thuế
  tgtttbso?: number; // Tổng giá trị thanh toán bằng số
  tgtttbchu?: string; // Tổng giá trị thanh toán bằng chữ
  
  // Trạng thái
  tthai?: string; // Trạng thái
  htttoan?: string; // Hình thức thanh toán
  
  // Chi tiết hóa đơn
  details?: ImportInvoiceDetail[];
}

interface ImportInvoiceDetail {
  stt?: number; // Số thứ tự
  ten?: string; // Tên hàng hóa/dịch vụ
  dvtinh?: string; // Đơn vị tính
  sluong?: number; // Số lượng
  dgia?: number; // Đơn giá
  thtcthue?: number; // Thành tiền chưa thuế
  tsuat?: number; // Thuế suất
  tthue?: number; // Tiền thuế
  thtien?: number; // Thành tiền
}

export interface ImportResult {
  success: boolean;
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: Array<{
    row: number;
    error: string;
    data?: any;
  }>;
  invoiceIds: string[];
  message: string;
}

@Injectable()
export class InvoiceImportService {
  private readonly logger = new Logger(InvoiceImportService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generate Excel template for invoice import
   */
  async generateImportTemplate(): Promise<any> {
    const workbook = new ExcelJS.Workbook();
    
    // Sheet 1: Thông tin hóa đơn
    const invoiceSheet = workbook.addWorksheet('Danh sách hóa đơn');
    
    // Define columns
    invoiceSheet.columns = [
      { header: 'Số hóa đơn (*)', key: 'shdon', width: 15 },
      { header: 'Ký hiệu hóa đơn (*)', key: 'khhdon', width: 15 },
      { header: 'Ký hiệu mẫu số (*)', key: 'khmshdon', width: 15 },
      { header: 'Thời điểm lập (*)', key: 'tdlap', width: 20 },
      { header: 'MST người bán (*)', key: 'nbmst', width: 15 },
      { header: 'Tên người bán', key: 'nbten', width: 30 },
      { header: 'Địa chỉ người bán', key: 'nbdchi', width: 40 },
      { header: 'STK người bán', key: 'nbstkhoan', width: 20 },
      { header: 'MST người mua', key: 'nmmst', width: 15 },
      { header: 'Tên người mua', key: 'nmten', width: 30 },
      { header: 'Địa chỉ người mua', key: 'nmdchi', width: 40 },
      { header: 'STK người mua', key: 'nmstkhoan', width: 20 },
      { header: 'Tổng tiền chưa thuế', key: 'tgtcthue', width: 20 },
      { header: 'Tổng tiền thuế', key: 'tgtthue', width: 15 },
      { header: 'Tổng tiền TT', key: 'tgtttbso', width: 20 },
      { header: 'Tổng tiền bằng chữ', key: 'tgtttbchu', width: 40 },
      { header: 'Trạng thái', key: 'tthai', width: 15 },
      { header: 'HT thanh toán', key: 'htttoan', width: 20 },
    ];

    // Style header row
    const headerRow = invoiceSheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 25;

    // Add sample data
    invoiceSheet.addRow({
      shdon: '0000001',
      khhdon: 'AA/23E',
      khmshdon: '1/001',
      tdlap: '2025-10-18 10:00:00',
      nbmst: '0123456789',
      nbten: 'CÔNG TY TNHH ABC',
      nbdchi: '123 Đường ABC, Quận 1, TP.HCM',
      nbstkhoan: '1234567890',
      nmmst: '9876543210',
      nmten: 'CÔNG TY CP XYZ',
      nmdchi: '456 Đường XYZ, Quận 2, TP.HCM',
      nmstkhoan: '0987654321',
      tgtcthue: 10000000,
      tgtthue: 1000000,
      tgtttbso: 11000000,
      tgtttbchu: 'Mười một triệu đồng chẵn',
      tthai: 'Đã ký',
      htttoan: 'Chuyển khoản'
    });

    // Add border to all cells
    invoiceSheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Sheet 2: Chi tiết hóa đơn
    const detailSheet = workbook.addWorksheet('Chi tiết hóa đơn');
    
    detailSheet.columns = [
      { header: 'Số hóa đơn (*)', key: 'shdon', width: 15 },
      { header: 'STT', key: 'stt', width: 8 },
      { header: 'Tên hàng hóa/DV (*)', key: 'ten', width: 40 },
      { header: 'Đơn vị tính', key: 'dvtinh', width: 12 },
      { header: 'Số lượng', key: 'sluong', width: 12 },
      { header: 'Đơn giá', key: 'dgia', width: 15 },
      { header: 'Thành tiền chưa thuế', key: 'thtcthue', width: 20 },
      { header: 'Thuế suất (%)', key: 'tsuat', width: 12 },
      { header: 'Tiền thuế', key: 'tthue', width: 15 },
      { header: 'Thành tiền', key: 'thtien', width: 20 },
    ];

    // Style header row
    const detailHeaderRow = detailSheet.getRow(1);
    detailHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    detailHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF70AD47' }
    };
    detailHeaderRow.alignment = { vertical: 'middle', horizontal: 'center' };
    detailHeaderRow.height = 25;

    // Add sample data
    detailSheet.addRow({
      shdon: '0000001',
      stt: 1,
      ten: 'Dịch vụ tư vấn',
      dvtinh: 'Giờ',
      sluong: 10,
      dgia: 1000000,
      thtcthue: 10000000,
      tsuat: 10,
      tthue: 1000000,
      thtien: 11000000
    });

    // Add border to all cells
    detailSheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Sheet 3: Hướng dẫn
    const instructionSheet = workbook.addWorksheet('Hướng dẫn');
    
    instructionSheet.mergeCells('A1:B1');
    const titleCell = instructionSheet.getCell('A1');
    titleCell.value = 'HƯỚNG DẪN IMPORT DỮ LIỆU HÓA ĐƠN';
    titleCell.font = { bold: true, size: 14, color: { argb: 'FF0000FF' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    
    instructionSheet.addRow([]);
    instructionSheet.addRow(['1. CẤU TRÚC FILE']);
    instructionSheet.addRow(['', 'File gồm 2 sheet chính:']);
    instructionSheet.addRow(['', '- Sheet "Danh sách hóa đơn": Thông tin tổng hợp hóa đơn']);
    instructionSheet.addRow(['', '- Sheet "Chi tiết hóa đơn": Thông tin chi tiết hàng hóa/dịch vụ']);
    instructionSheet.addRow([]);
    
    instructionSheet.addRow(['2. QUY TẮC NHẬP LIỆU']);
    instructionSheet.addRow(['', '- Các trường có dấu (*) là bắt buộc']);
    instructionSheet.addRow(['', '- Số hóa đơn phải duy nhất trong hệ thống']);
    instructionSheet.addRow(['', '- Thời điểm lập: định dạng YYYY-MM-DD HH:mm:ss']);
    instructionSheet.addRow(['', '- Số tiền: chỉ nhập số, không nhập dấu phân cách']);
    instructionSheet.addRow(['', '- MST: 10 hoặc 13 ký tự số']);
    instructionSheet.addRow([]);
    
    instructionSheet.addRow(['3. LIÊN KẾT DỮ LIỆU']);
    instructionSheet.addRow(['', '- Chi tiết hóa đơn liên kết qua "Số hóa đơn"']);
    instructionSheet.addRow(['', '- Một hóa đơn có thể có nhiều dòng chi tiết']);
    instructionSheet.addRow(['', '- Số hóa đơn ở sheet chi tiết phải tồn tại ở sheet danh sách']);
    instructionSheet.addRow([]);
    
    instructionSheet.addRow(['4. CHÚ Ý']);
    instructionSheet.addRow(['', '- Không xóa dòng tiêu đề']);
    instructionSheet.addRow(['', '- Không thay đổi tên các cột']);
    instructionSheet.addRow(['', '- Dữ liệu mẫu có thể xóa và thay bằng dữ liệu thực']);
    instructionSheet.addRow(['', '- Hệ thống sẽ bỏ qua các dòng trống']);

    instructionSheet.getColumn('A').width = 5;
    instructionSheet.getColumn('B').width = 70;

    return await workbook.xlsx.writeBuffer();
  }

  /**
   * Parse Excel file and extract invoice data
   */
  async parseImportFile(buffer: any): Promise<ImportInvoiceData[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    const invoiceSheet = workbook.getWorksheet('Danh sách hóa đơn');
    const detailSheet = workbook.getWorksheet('Chi tiết hóa đơn');

    if (!invoiceSheet) {
      throw new BadRequestException('Không tìm thấy sheet "Danh sách hóa đơn"');
    }

    const invoices: Map<string, ImportInvoiceData> = new Map();
    const details: Map<string, ImportInvoiceDetail[]> = new Map();

    // Parse invoices
    invoiceSheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header
      
      const rowData = row.values as any[];
      const shdon = this.getCellValue(row, 1);
      
      if (!shdon) return; // Skip empty rows

      const invoice: ImportInvoiceData = {
        shdon: shdon,
        khhdon: this.getCellValue(row, 2),
        khmshdon: this.getCellValue(row, 3),
        tdlap: this.parseDateValue(this.getCellValue(row, 4)),
        nbmst: this.getCellValue(row, 5),
        nbten: this.getCellValue(row, 6),
        nbdchi: this.getCellValue(row, 7),
        nbstkhoan: this.getCellValue(row, 8),
        nmmst: this.getCellValue(row, 9),
        nmten: this.getCellValue(row, 10),
        nmdchi: this.getCellValue(row, 11),
        nmstkhoan: this.getCellValue(row, 12),
        tgtcthue: this.parseNumberValue(this.getCellValue(row, 13)),
        tgtthue: this.parseNumberValue(this.getCellValue(row, 14)),
        tgtttbso: this.parseNumberValue(this.getCellValue(row, 15)),
        tgtttbchu: this.getCellValue(row, 16),
        tthai: this.getCellValue(row, 17),
        htttoan: this.getCellValue(row, 18),
      };

      invoices.set(shdon, invoice);
    });

    // Parse details if sheet exists
    if (detailSheet) {
      detailSheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header
        
        const shdon = this.getCellValue(row, 1);
        if (!shdon) return; // Skip empty rows

        const detail: ImportInvoiceDetail = {
          stt: this.parseNumberValue(this.getCellValue(row, 2)),
          ten: this.getCellValue(row, 3),
          dvtinh: this.getCellValue(row, 4),
          sluong: this.parseNumberValue(this.getCellValue(row, 5)),
          dgia: this.parseNumberValue(this.getCellValue(row, 6)),
          thtcthue: this.parseNumberValue(this.getCellValue(row, 7)),
          tsuat: this.parseNumberValue(this.getCellValue(row, 8)),
          tthue: this.parseNumberValue(this.getCellValue(row, 9)),
          thtien: this.parseNumberValue(this.getCellValue(row, 10)),
        };

        if (!details.has(shdon)) {
          details.set(shdon, []);
        }
        details.get(shdon)!.push(detail);
      });
    }

    // Merge invoices with details
    const result: ImportInvoiceData[] = [];
    invoices.forEach((invoice, shdon) => {
      invoice.details = details.get(shdon) || [];
      result.push(invoice);
    });

    return result;
  }

  /**
   * Import invoices from parsed data
   */
  async importInvoices(data: ImportInvoiceData[]): Promise<ImportResult> {
    const result: ImportResult = {
      success: true,
      totalRows: data.length,
      successCount: 0,
      errorCount: 0,
      errors: [],
      invoiceIds: [],
      message: ''
    };

    for (let i = 0; i < data.length; i++) {
      const invoiceData = data[i];
      const rowNumber = i + 2; // +2 because Excel rows start at 1 and we skip header

      try {
        // Validate required fields
        if (!invoiceData.shdon || !invoiceData.khhdon || !invoiceData.khmshdon) {
          throw new Error('Thiếu thông tin bắt buộc: Số hóa đơn, Ký hiệu hóa đơn, hoặc Ký hiệu mẫu số');
        }

        if (!invoiceData.nbmst) {
          throw new Error('Thiếu mã số thuế người bán');
        }

        // Check for duplicate
        const existing = await this.prisma.ext_listhoadon.findFirst({
          where: {
            nbmst: invoiceData.nbmst,
            khmshdon: invoiceData.khmshdon,
            shdon: invoiceData.shdon,
            khhdon: invoiceData.khhdon,
          }
        });

        if (existing) {
          result.errors.push({
            row: rowNumber,
            error: `Hóa đơn đã tồn tại: ${invoiceData.shdon}`,
            data: invoiceData
          });
          result.errorCount++;
          continue;
        }

        // Create invoice
        const invoice = await this.prisma.ext_listhoadon.create({
          data: {
            shdon: invoiceData.shdon,
            khhdon: invoiceData.khhdon,
            khmshdon: invoiceData.khmshdon,
            tdlap: invoiceData.tdlap,
            nbmst: invoiceData.nbmst,
            nbten: invoiceData.nbten,
            nbdchi: invoiceData.nbdchi,
            nbstkhoan: invoiceData.nbstkhoan,
            nmmst: invoiceData.nmmst,
            nmten: invoiceData.nmten,
            nmdchi: invoiceData.nmdchi,
            nmstkhoan: invoiceData.nmstkhoan,
            tgtcthue: invoiceData.tgtcthue ? new Decimal(invoiceData.tgtcthue) : null,
            tgtthue: invoiceData.tgtthue ? new Decimal(invoiceData.tgtthue) : null,
            tgtttbso: invoiceData.tgtttbso ? new Decimal(invoiceData.tgtttbso) : null,
            tgtttbchu: invoiceData.tgtttbchu,
            tthai: invoiceData.tthai,
            htttoan: invoiceData.htttoan,
            idServer: `IMPORT-${invoiceData.nbmst}-${invoiceData.shdon}-${Date.now()}`,
          }
        });

        // Create details if any
        if (invoiceData.details && invoiceData.details.length > 0) {
          for (const detail of invoiceData.details) {
            await this.prisma.ext_detailhoadon.create({
              data: {
                idhdonServer: invoice.idServer!,
                idServer: `${invoice.idServer}-${detail.stt || 0}`,
                stt: detail.stt,
                ten: detail.ten,
                dvtinh: detail.dvtinh,
                sluong: detail.sluong ? new Decimal(detail.sluong) : null,
                dgia: detail.dgia ? new Decimal(detail.dgia) : null,
                thtcthue: detail.thtcthue ? new Decimal(detail.thtcthue) : null,
                tsuat: detail.tsuat ? new Decimal(detail.tsuat) : null,
                tthue: detail.tthue ? new Decimal(detail.tthue) : null,
                thtien: detail.thtien ? new Decimal(detail.thtien) : null,
              }
            });
          }
        }

        result.invoiceIds.push(invoice.id);
        result.successCount++;

      } catch (error) {
        this.logger.error(`Error importing invoice at row ${rowNumber}:`, error);
        result.errors.push({
          row: rowNumber,
          error: error.message,
          data: invoiceData
        });
        result.errorCount++;
      }
    }

    result.success = result.errorCount === 0;
    result.message = `Import completed: ${result.successCount} thành công, ${result.errorCount} lỗi`;

    return result;
  }

  /**
   * Import from Excel file buffer
   */
  async importFromExcel(buffer: any): Promise<ImportResult> {
    try {
      const data = await this.parseImportFile(buffer);
      return await this.importInvoices(data);
    } catch (error) {
      this.logger.error('Error importing from Excel:', error);
      throw new BadRequestException(`Import failed: ${error.message}`);
    }
  }

  // Helper methods
  private getCellValue(row: ExcelJS.Row, columnNumber: number): string {
    const cell = row.getCell(columnNumber);
    if (!cell || cell.value === null || cell.value === undefined) {
      return '';
    }
    return String(cell.value).trim();
  }

  private parseNumberValue(value: string | number): number | undefined {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    const num = typeof value === 'number' ? value : parseFloat(String(value).replace(/[,\s]/g, ''));
    return isNaN(num) ? undefined : num;
  }

  private parseDateValue(value: string | Date): Date | undefined {
    if (!value) return undefined;
    
    if (value instanceof Date) {
      return value;
    }

    try {
      // Try parsing various date formats
      const dateStr = String(value).trim();
      
      // Format: YYYY-MM-DD HH:mm:ss
      if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$/.test(dateStr)) {
        return new Date(dateStr);
      }
      
      // Format: YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return new Date(dateStr);
      }
      
      // Format: DD/MM/YYYY
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
        const [day, month, year] = dateStr.split('/');
        return new Date(`${year}-${month}-${day}`);
      }

      // Try default parsing
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }

      return undefined;
    } catch (error) {
      return undefined;
    }
  }
}
