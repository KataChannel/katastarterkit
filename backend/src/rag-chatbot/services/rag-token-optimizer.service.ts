/**
 * RAG Token Optimizer - Rausach Domain
 * Service tối ưu hóa token usage cho Gemini API
 */

import { Injectable, Logger } from '@nestjs/common';
import {
  RausachContext,
  SanphamContext,
  DonhangContext,
  KhachhangContext,
  NhacungcapContext,
  TonkhoContext,
  QueryIntent,
  ExtractedEntity,
} from '../interfaces';

// Config tối ưu
const TOKEN_CONFIG = {
  MAX_ITEMS_PER_CONTEXT: 15,       // Giới hạn số item mỗi loại
  MAX_TOTAL_CONTEXT_ITEMS: 30,     // Tổng tất cả items
  COMPACT_MODE_THRESHOLD: 20,      // Bật compact mode khi > 20 items
  SUMMARY_MODE_THRESHOLD: 50,      // Bật summary mode khi > 50 items  
};

// Compact field mappings - rút gọn tên field
const FIELD_ABBREV: Record<string, string> = {
  'title': 'T',
  'masp': 'M', 
  'giagoc': 'GG',
  'giaban': 'GB',
  'dvt': 'Đ',
  'soluong': 'SL',
  'soluongkho': 'TK',
  'madonhang': 'MĐ',
  'tongtien': 'TT',
  'status': 'ST',
  'khachhangName': 'KH',
  'ngaygiao': 'NG',
  'makh': 'MK',
  'sdt': 'Đ',
  'donhangCount': 'SĐ',
  'mancc': 'MN',
  'slton': 'TN',
  'slchogiao': 'CG',
};

@Injectable()
export class RagTokenOptimizer {
  private readonly logger = new Logger(RagTokenOptimizer.name);

  /**
   * Tối ưu context dựa trên intent - CHỈ lấy data cần thiết
   */
  optimizeContext(
    context: Partial<RausachContext>,
    intent: QueryIntent,
  ): Partial<RausachContext> {
    const optimized: Partial<RausachContext> = {};
    
    // Xác định context types ưu tiên dựa trên intent
    const priorityTypes = this.getPriorityTypes(intent);
    
    let totalItems = 0;
    
    for (const type of priorityTypes) {
      if (totalItems >= TOKEN_CONFIG.MAX_TOTAL_CONTEXT_ITEMS) break;
      
      const remaining = TOKEN_CONFIG.MAX_TOTAL_CONTEXT_ITEMS - totalItems;
      const limit = Math.min(TOKEN_CONFIG.MAX_ITEMS_PER_CONTEXT, remaining);
      
      switch (type) {
        case 'sanpham':
          if (context.sanpham) {
            optimized.sanpham = this.filterSanpham(context.sanpham, intent, limit);
            totalItems += optimized.sanpham.length;
          }
          break;
        case 'donhang':
          if (context.donhang) {
            optimized.donhang = this.filterDonhang(context.donhang, intent, limit);
            totalItems += optimized.donhang.length;
          }
          break;
        case 'khachhang':
          if (context.khachhang) {
            optimized.khachhang = this.filterKhachhang(context.khachhang, intent, limit);
            totalItems += optimized.khachhang.length;
          }
          break;
        case 'nhacungcap':
          if (context.nhacungcap) {
            optimized.nhacungcap = context.nhacungcap.slice(0, limit);
            totalItems += optimized.nhacungcap.length;
          }
          break;
        case 'tonkho':
          if (context.tonkho) {
            optimized.tonkho = this.filterTonkho(context.tonkho, intent, limit);
            totalItems += optimized.tonkho.length;
          }
          break;
        case 'banggia':
          if (context.banggia) {
            optimized.banggia = context.banggia.slice(0, limit);
            totalItems += optimized.banggia.length;
          }
          break;
        case 'kho':
          if (context.kho) {
            optimized.kho = context.kho.slice(0, limit);
            totalItems += optimized.kho.length;
          }
          break;
      }
    }
    
    this.logger.debug(`Optimized context: ${totalItems} total items`);
    return optimized;
  }

  /**
   * Xác định context types ưu tiên theo intent
   */
  private getPriorityTypes(intent: QueryIntent): string[] {
    const priorityMap: Record<string, string[]> = {
      'query_product': ['sanpham', 'tonkho'],
      'query_order': ['donhang', 'khachhang'],
      'query_customer': ['khachhang', 'donhang'],
      'query_supplier': ['nhacungcap'],
      'query_inventory': ['tonkho', 'sanpham'],
      'query_price': ['sanpham', 'banggia'],
      'query_statistics': ['donhang', 'sanpham', 'khachhang'],
      'query_general': ['sanpham', 'donhang'],
    };
    
    return priorityMap[intent.intent] || ['sanpham', 'donhang'];
  }

  /**
   * Filter sản phẩm theo entities
   */
  private filterSanpham(
    items: SanphamContext[], 
    intent: QueryIntent, 
    limit: number
  ): SanphamContext[] {
    // Nếu có product_code hoặc product_name entity, filter theo đó
    const productEntity = intent.entities.find(
      e => e.type === 'product_code' || e.type === 'product_name'
    );
    
    if (productEntity) {
      const keyword = productEntity.value.toLowerCase();
      const filtered = items.filter(sp => 
        sp.masp.toLowerCase().includes(keyword) || 
        sp.title.toLowerCase().includes(keyword)
      );
      return filtered.slice(0, limit);
    }
    
    // Nếu là query_inventory, ưu tiên SP có tồn kho thấp
    if (intent.intent === 'query_inventory') {
      return items
        .sort((a, b) => a.soluongkho - b.soluongkho)
        .slice(0, limit);
    }
    
    // Mặc định: lấy theo thứ tự mới nhất
    return items.slice(0, limit);
  }

  /**
   * Filter đơn hàng theo entities
   */
  private filterDonhang(
    items: DonhangContext[], 
    intent: QueryIntent, 
    limit: number
  ): DonhangContext[] {
    // Filter theo status entity
    const statusEntity = intent.entities.find(e => e.type === 'status');
    if (statusEntity) {
      const filtered = items.filter(dh => dh.status === statusEntity.value);
      return filtered.slice(0, limit);
    }
    
    // Filter theo date entity
    const dateEntity = intent.entities.find(e => e.type === 'date');
    if (dateEntity) {
      const targetDate = new Date(dateEntity.value);
      const filtered = items.filter(dh => {
        if (!dh.ngaygiao) return false;
        const orderDate = new Date(dh.ngaygiao);
        return orderDate.toDateString() === targetDate.toDateString();
      });
      if (filtered.length > 0) return filtered.slice(0, limit);
    }
    
    return items.slice(0, limit);
  }

  /**
   * Filter khách hàng
   */
  private filterKhachhang(
    items: KhachhangContext[], 
    intent: QueryIntent, 
    limit: number
  ): KhachhangContext[] {
    // Nếu query về top khách hàng
    if (intent.intent === 'query_customer') {
      return items
        .sort((a, b) => b.donhangCount - a.donhangCount)
        .slice(0, limit);
    }
    
    return items.slice(0, limit);
  }

  /**
   * Filter tồn kho - ưu tiên hàng sắp hết
   */
  private filterTonkho(
    items: TonkhoContext[], 
    intent: QueryIntent, 
    limit: number
  ): TonkhoContext[] {
    // Ưu tiên sản phẩm có tồn kho thấp
    return items
      .sort((a, b) => a.slton - b.slton)
      .slice(0, limit);
  }

  /**
   * Format context thành string compact - TIẾT KIỆM TOKEN
   */
  formatContextCompact(context: Partial<RausachContext>): string {
    const parts: string[] = [];
    
    // Header ngắn gọn
    if (context.sanpham && context.sanpham.length > 0) {
      parts.push(this.formatSanphamCompact(context.sanpham));
    }
    
    if (context.donhang && context.donhang.length > 0) {
      parts.push(this.formatDonhangCompact(context.donhang));
    }
    
    if (context.khachhang && context.khachhang.length > 0) {
      parts.push(this.formatKhachhangCompact(context.khachhang));
    }
    
    if (context.nhacungcap && context.nhacungcap.length > 0) {
      parts.push(this.formatNhacungcapCompact(context.nhacungcap));
    }
    
    if (context.tonkho && context.tonkho.length > 0) {
      parts.push(this.formatTonkhoCompact(context.tonkho));
    }
    
    if (context.banggia && context.banggia.length > 0) {
      parts.push(this.formatBanggiaCompact(context.banggia));
    }
    
    if (context.kho && context.kho.length > 0) {
      parts.push(this.formatKhoCompact(context.kho));
    }
    
    return parts.length > 0 ? parts.join('\n') : 'Không có dữ liệu.';
  }

  /**
   * Format sản phẩm compact
   * Từ: "- Rau muống (Mã: SP001) | Giá gốc: 15.000đ | Giá bán: 20.000đ | Tồn: 100 kg | VAT: 5%"
   * Thành: "SP001:Rau muống|15k→20k|100kg"
   */
  private formatSanphamCompact(items: SanphamContext[]): string {
    const header = `[SP:${items.length}]`;
    const rows = items.map(sp => {
      const gg = this.formatPrice(sp.giagoc);
      const gb = this.formatPrice(sp.giaban);
      return `${sp.masp}:${sp.title}|${gg}→${gb}|${sp.soluongkho}${sp.dvt || ''}`;
    });
    return `${header}\n${rows.join('\n')}`;
  }

  /**
   * Format đơn hàng compact  
   */
  private formatDonhangCompact(items: DonhangContext[]): string {
    const statusShort: Record<string, string> = {
      'dadat': '⏳',
      'dagiao': '🚚',
      'danhan': '✅',
      'huy': '❌',
      'hoanthanh': '✓'
    };
    
    const header = `[ĐH:${items.length}]`;
    const rows = items.map(dh => {
      const date = dh.ngaygiao ? new Date(dh.ngaygiao).toLocaleDateString('vi-VN') : '-';
      const status = statusShort[dh.status] || dh.status;
      return `${dh.madonhang}|${dh.khachhangName || '-'}|${date}|${this.formatPrice(dh.tongtien)}|${status}`;
    });
    return `${header}\n${rows.join('\n')}`;
  }

  /**
   * Format khách hàng compact
   */
  private formatKhachhangCompact(items: KhachhangContext[]): string {
    const header = `[KH:${items.length}]`;
    const rows = items.map(kh => 
      `${kh.makh}:${kh.name || '-'}|${kh.sdt || '-'}|${kh.donhangCount}đơn`
    );
    return `${header}\n${rows.join('\n')}`;
  }

  /**
   * Format nhà cung cấp compact
   */
  private formatNhacungcapCompact(items: NhacungcapContext[]): string {
    const header = `[NCC:${items.length}]`;
    const rows = items.map(ncc => 
      `${ncc.mancc}:${ncc.name || '-'}|${ncc.sdt || '-'}|${ncc.dathangCount}đơn`
    );
    return `${header}\n${rows.join('\n')}`;
  }

  /**
   * Format tồn kho compact
   */
  private formatTonkhoCompact(items: TonkhoContext[]): string {
    const header = `[TK:${items.length}]`;
    const rows = items.map(tk => 
      `${tk.masp}:${tk.sanphamTitle}|tồn:${tk.slton}|chờG:${tk.slchogiao}|chờN:${tk.slchonhap}`
    );
    return `${header}\n${rows.join('\n')}`;
  }

  /**
   * Format bảng giá compact
   */
  private formatBanggiaCompact(items: any[]): string {
    const header = `[BG:${items.length}]`;
    const rows = items.map(bg => 
      `${bg.mabanggia || bg.title}|${bg.type || '-'}|${bg.sanphamCount}sp${bg.isDefault ? '*' : ''}`
    );
    return `${header}\n${rows.join('\n')}`;
  }

  /**
   * Format kho compact
   */
  private formatKhoCompact(items: any[]): string {
    const header = `[Kho:${items.length}]`;
    const rows = items.map(k => 
      `${k.makho || k.name}|${k.diachi || '-'}`
    );
    return `${header}\n${rows.join('\n')}`;
  }

  /**
   * Format giá ngắn gọn: 15000 -> 15k, 1500000 -> 1.5tr
   */
  private formatPrice(price: number): string {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}tr`;
    }
    if (price >= 1000) {
      return `${Math.round(price / 1000)}k`;
    }
    return `${price}đ`;
  }

  /**
   * Tạo system prompt tối ưu - ngắn gọn hơn
   */
  getOptimizedSystemPrompt(intent: QueryIntent): string {
    return `Trợ lý AI hệ thống rau sạch.
Quy tắc:
- CHỈ dùng dữ liệu cung cấp, KHÔNG bịa
- Trả lời tiếng Việt, ngắn gọn
- Số tiền: dùng dấu chấm (VD: 100.000đ)  
- Tối đa 10 mục khi liệt kê
- Kết thúc bằng 1 gợi ý nếu phù hợp

Ký hiệu: SP=sản phẩm, ĐH=đơn hàng, KH=khách hàng, NCC=nhà cung cấp, TK=tồn kho
Trạng thái: ⏳=chờ, 🚚=đang giao, ✅=đã nhận, ❌=hủy, ✓=hoàn thành
Giá: k=nghìn, tr=triệu

Intent: ${intent.intent}`;
  }

  /**
   * Ước tính số token của context
   */
  estimateTokens(text: string): number {
    // Ước tính rough: ~4 chars = 1 token cho tiếng Việt
    return Math.ceil(text.length / 4);
  }
}
