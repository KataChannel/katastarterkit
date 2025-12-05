/**
 * RAG Intent Service - Rausach Domain  
 * Service để nhận diện intent và extract entities từ câu hỏi
 */

import { Injectable, Logger } from '@nestjs/common';
import {
  QueryIntent,
  IntentType,
  ExtractedEntity,
  EntityType,
  ContextType,
} from '../interfaces';

// Patterns để nhận diện intent
const INTENT_PATTERNS: { pattern: RegExp; intent: IntentType; contextTypes: ContextType[] }[] = [
  // Sản phẩm
  { pattern: /sản phẩm|sp|hàng|hàng hóa|mặt hàng|rau|củ|quả/i, intent: 'query_product', contextTypes: ['sanpham', 'tonkho'] },
  { pattern: /giá|bảng giá|giá bán|giá gốc|chi phí/i, intent: 'query_price', contextTypes: ['sanpham', 'banggia'] },
  
  // Đơn hàng
  { pattern: /đơn hàng|đơn|order|đặt hàng|giao hàng/i, intent: 'query_order', contextTypes: ['donhang', 'khachhang'] },
  { pattern: /trạng thái đơn|tình trạng đơn|đơn đã giao|đơn chờ/i, intent: 'query_order', contextTypes: ['donhang'] },
  
  // Khách hàng
  { pattern: /khách hàng|khách|kh|customer|người mua/i, intent: 'query_customer', contextTypes: ['khachhang', 'donhang'] },
  
  // Nhà cung cấp
  { pattern: /nhà cung cấp|ncc|supplier|đối tác|nhập hàng/i, intent: 'query_supplier', contextTypes: ['nhacungcap'] },
  
  // Tồn kho
  { pattern: /tồn kho|kho|tồn|stock|inventory|còn hàng|hết hàng/i, intent: 'query_inventory', contextTypes: ['tonkho', 'kho', 'sanpham'] },
  
  // Thống kê
  { pattern: /thống kê|tổng|bao nhiêu|số lượng|count|statistics|doanh thu|tổng tiền|báo cáo/i, intent: 'query_statistics', contextTypes: ['all'] },
  
  // Actions
  { pattern: /tìm|search|tra cứu|kiếm|look/i, intent: 'action_search', contextTypes: [] },
  { pattern: /danh sách|list|liệt kê|show|hiển thị|xem/i, intent: 'action_list', contextTypes: [] },
  { pattern: /so sánh|compare|đối chiếu/i, intent: 'action_compare', contextTypes: [] },
  { pattern: /tính|calculate|cộng|trừ|nhân|chia|tổng/i, intent: 'action_calculate', contextTypes: [] },
];

// Patterns để extract entity
const ENTITY_PATTERNS: { pattern: RegExp; type: EntityType }[] = [
  // Mã code
  { pattern: /(?:mã\s*(?:sp|sản phẩm)?|masp|code)[:\s]*([A-Z0-9]+)/i, type: 'product_code' },
  { pattern: /(?:mã\s*kh|makh)[:\s]*([A-Z0-9]+)/i, type: 'customer_code' },
  { pattern: /(?:mã\s*(?:đơn|đơn hàng)|madonhang)[:\s]*([A-Z0-9\-]+)/i, type: 'order_code' },
  { pattern: /(?:mã\s*ncc|mancc)[:\s]*([A-Z0-9]+)/i, type: 'supplier_code' },
  
  // Ngày tháng
  { pattern: /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/g, type: 'date' },
  { pattern: /(?:từ|from)\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\s*(?:đến|to)\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i, type: 'date_range' },
  { pattern: /(?:hôm nay|today|ngày hôm nay)/i, type: 'date' },
  { pattern: /(?:hôm qua|yesterday)/i, type: 'date' },
  { pattern: /(?:tuần này|this week|tuần trước|last week)/i, type: 'date_range' },
  { pattern: /(?:tháng này|this month|tháng trước|last month)/i, type: 'date_range' },
  
  // Số tiền
  { pattern: /(\d+(?:\.\d{3})*(?:,\d+)?)\s*(?:đ|đồng|vnd|vnđ)/i, type: 'price' },
  { pattern: /(\d+(?:\.\d+)?)\s*(?:triệu|tr)/i, type: 'price' },
  
  // Số lượng
  { pattern: /(\d+)\s*(?:cái|sản phẩm|sp|đơn|kg|g|lít|l)/i, type: 'quantity' },
  
  // Trạng thái
  { pattern: /(?:trạng thái|status)[:\s]*(đã đặt|đã giao|đã nhận|hủy|hoàn thành)/i, type: 'status' },
  { pattern: /(?:đơn\s*)?(đã đặt|đã giao|đã nhận|bị hủy|hoàn thành)/i, type: 'status' },
];

// Mapping status tiếng Việt sang enum
const STATUS_MAP: Record<string, string> = {
  'đã đặt': 'dadat',
  'đã giao': 'dagiao',
  'đã nhận': 'danhan',
  'hủy': 'huy',
  'bị hủy': 'huy',
  'hoàn thành': 'hoanthanh',
};

@Injectable()
export class RagIntentService {
  private readonly logger = new Logger(RagIntentService.name);

  /**
   * Phân tích câu hỏi và trích xuất intent + entities
   */
  analyzeQuery(message: string): QueryIntent {
    const normalizedMessage = this.normalizeText(message);
    
    // Nhận diện intent
    const { intent, confidence, contextTypes } = this.detectIntent(normalizedMessage);
    
    // Extract entities
    const entities = this.extractEntities(normalizedMessage);
    
    // Bổ sung context types từ entities
    const enhancedContextTypes = this.enhanceContextTypes(contextTypes, entities);
    
    return {
      intent,
      entities,
      confidence,
      contextTypes: enhancedContextTypes,
    };
  }

  /**
   * Chuẩn hóa text
   */
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu để match dễ hơn
      .replace(/đ/g, 'd')
      .trim();
  }

  /**
   * Nhận diện intent từ câu hỏi
   */
  private detectIntent(message: string): { intent: IntentType; confidence: number; contextTypes: ContextType[] } {
    let bestMatch: { intent: IntentType; confidence: number; contextTypes: ContextType[] } = {
      intent: 'query_general',
      confidence: 0.3,
      contextTypes: ['all'],
    };

    for (const { pattern, intent, contextTypes } of INTENT_PATTERNS) {
      if (pattern.test(message)) {
        // Tính confidence dựa trên độ khớp
        const matchLength = message.match(pattern)?.[0]?.length || 0;
        const confidence = Math.min(0.5 + (matchLength / message.length) * 0.5, 0.95);
        
        if (confidence > bestMatch.confidence) {
          bestMatch = { intent, confidence, contextTypes };
        }
      }
    }

    return bestMatch;
  }

  /**
   * Trích xuất entities từ câu hỏi
   */
  private extractEntities(message: string): ExtractedEntity[] {
    const entities: ExtractedEntity[] = [];
    const originalMessage = message; // Giữ message gốc cho rawValue

    for (const { pattern, type } of ENTITY_PATTERNS) {
      const matches = message.matchAll(new RegExp(pattern, 'gi'));
      
      for (const match of matches) {
        let value = match[1] || match[0];
        
        // Xử lý đặc biệt cho status
        if (type === 'status') {
          const vietnameseStatus = value.toLowerCase();
          value = STATUS_MAP[vietnameseStatus] || value;
        }
        
        // Xử lý ngày đặc biệt
        if (type === 'date') {
          value = this.parseDateValue(match[0]);
        }

        entities.push({
          type,
          value: value.trim(),
          rawValue: match[0],
          confidence: 0.8,
        });
      }
    }

    // Extract tên sản phẩm từ context (nếu có từ khóa "sản phẩm" + text)
    const productNameMatch = originalMessage.match(/(?:sản phẩm|sp|hàng)\s+["']?([^"'\n,]+)["']?/i);
    if (productNameMatch) {
      entities.push({
        type: 'product_name',
        value: productNameMatch[1].trim(),
        rawValue: productNameMatch[0],
        confidence: 0.7,
      });
    }

    // Extract tên khách hàng
    const customerNameMatch = originalMessage.match(/(?:khách hàng|khách|kh)\s+["']?([^"'\n,]+)["']?/i);
    if (customerNameMatch) {
      entities.push({
        type: 'customer_name',
        value: customerNameMatch[1].trim(),
        rawValue: customerNameMatch[0],
        confidence: 0.7,
      });
    }

    return entities;
  }

  /**
   * Parse giá trị ngày
   */
  private parseDateValue(dateStr: string): string {
    const normalized = dateStr.toLowerCase();
    const now = new Date();
    
    if (normalized.includes('hôm nay') || normalized.includes('today')) {
      return now.toISOString().split('T')[0];
    }
    
    if (normalized.includes('hôm qua') || normalized.includes('yesterday')) {
      now.setDate(now.getDate() - 1);
      return now.toISOString().split('T')[0];
    }
    
    // Parse định dạng DD/MM/YYYY hoặc DD-MM-YYYY
    const dateMatch = dateStr.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
    if (dateMatch) {
      const day = dateMatch[1].padStart(2, '0');
      const month = dateMatch[2].padStart(2, '0');
      let year = dateMatch[3];
      if (year.length === 2) {
        year = '20' + year;
      }
      return `${year}-${month}-${day}`;
    }
    
    return dateStr;
  }

  /**
   * Bổ sung context types dựa trên entities
   */
  private enhanceContextTypes(baseTypes: ContextType[], entities: ExtractedEntity[]): ContextType[] {
    const types = new Set(baseTypes);
    
    for (const entity of entities) {
      switch (entity.type) {
        case 'product_name':
        case 'product_code':
          types.add('sanpham');
          types.add('tonkho');
          break;
        case 'customer_name':
        case 'customer_code':
          types.add('khachhang');
          types.add('donhang');
          break;
        case 'supplier_name':
        case 'supplier_code':
          types.add('nhacungcap');
          break;
        case 'order_code':
          types.add('donhang');
          break;
        case 'price':
          types.add('sanpham');
          types.add('banggia');
          break;
        case 'quantity':
          types.add('tonkho');
          break;
        case 'status':
          types.add('donhang');
          break;
      }
    }

    // Nếu không có type cụ thể, dùng all
    if (types.size === 0) {
      types.add('all');
    }

    return Array.from(types) as ContextType[];
  }

  /**
   * Tạo suggested queries dựa trên intent
   */
  getSuggestedQueries(intent: IntentType): string[] {
    const suggestions: Record<IntentType, string[]> = {
      query_product: [
        'Danh sách sản phẩm đang hoạt động',
        'Sản phẩm có giá dưới 100.000đ',
        'Tìm sản phẩm theo mã SP001',
      ],
      query_order: [
        'Đơn hàng hôm nay',
        'Đơn hàng chờ giao',
        'Tổng doanh thu tháng này',
      ],
      query_customer: [
        'Danh sách khách hàng',
        'Khách hàng có đơn nhiều nhất',
        'Tìm khách hàng theo số điện thoại',
      ],
      query_supplier: [
        'Danh sách nhà cung cấp',
        'NCC có nhiều đơn đặt hàng nhất',
      ],
      query_inventory: [
        'Sản phẩm sắp hết hàng',
        'Tồn kho thấp nhất',
        'Kiểm tra tồn kho sản phẩm X',
      ],
      query_price: [
        'Bảng giá hiện tại',
        'So sánh giá các sản phẩm',
        'Sản phẩm có giá cao nhất',
      ],
      query_statistics: [
        'Thống kê tổng quan',
        'Doanh thu theo tháng',
        'Số đơn hàng theo trạng thái',
      ],
      query_general: [
        'Thống kê tổng quan hệ thống',
        'Đơn hàng mới nhất',
        'Sản phẩm bán chạy',
      ],
      action_search: [],
      action_list: [],
      action_compare: [],
      action_calculate: [],
      unknown: [
        'Thống kê tổng quan',
        'Danh sách sản phẩm',
        'Đơn hàng gần đây',
      ],
    };

    return suggestions[intent] || suggestions.unknown;
  }
}
