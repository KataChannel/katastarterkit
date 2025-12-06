/**
 * RAG Gemini Service - Rausach Domain
 * Service để tương tác với Google Gemini AI cho RAG
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import {
  RausachContext,
  RAGResponse,
  RAGSource,
  ContextType,
  QueryIntent,
} from '../interfaces';

@Injectable()
export class RagGeminiService {
  private readonly logger = new Logger(RagGeminiService.name);
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;
  private readonly modelName = 'gemini-2.0-flash';

  constructor(private readonly configService: ConfigService) {
    this.initializeGemini();
  }

  private initializeGemini(): void {
    // Priority: RAG_GEMINI_API_KEY (dedicated for RAG) > GEMINI_API_KEY > GOOGLE_GEMINI_API_KEY
    const apiKey = this.configService.get<string>('RAG_GEMINI_API_KEY') ||
                   this.configService.get<string>('GEMINI_API_KEY') || 
                   this.configService.get<string>('GOOGLE_GEMINI_API_KEY') ||
                   this.configService.get<string>('GOOGLE_API_KEY');
    
    if (!apiKey) {
      this.logger.warn('RAG Gemini API key not configured. RAG features will be disabled.');
      this.logger.warn('Please set RAG_GEMINI_API_KEY in your .env file');
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: this.modelName });
      this.logger.log(`✅ RAG Gemini AI initialized with model: ${this.modelName}`);
    } catch (error) {
      this.logger.error('Failed to initialize RAG Gemini AI', error);
    }
  }

  /**
   * Kiểm tra service có sẵn sàng không
   */
  isReady(): boolean {
    return this.model !== null;
  }

  /**
   * Tạo câu trả lời RAG từ context và câu hỏi (original - verbose)
   */
  async generateRAGResponse(
    query: string,
    intent: QueryIntent,
    context: Partial<RausachContext>,
  ): Promise<RAGResponse> {
    if (!this.model) {
      throw new Error('Gemini AI chưa được cấu hình. Vui lòng kiểm tra GEMINI_API_KEY.');
    }

    try {
      const startTime = Date.now();
      
      // Xây dựng prompt với context
      const prompt = this.buildRAGPrompt(query, intent, context);
      
      // Ước tính tokens
      const estimatedTokens = Math.ceil(prompt.length / 4);
      
      // Gọi Gemini API
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse response và tạo sources
      const { answer, sources } = this.parseResponse(text, context, intent);
      
      const processingTime = Date.now() - startTime;
      this.logger.debug(`RAG response generated in ${processingTime}ms, ~${estimatedTokens} tokens`);

      return {
        answer,
        sources,
        contextUsed: intent.contextTypes,
        confidence: this.calculateConfidence(intent, sources),
        suggestedQueries: this.generateSuggestedQueries(intent),
        tokensUsed: estimatedTokens,
      };
    } catch (error) {
      this.logger.error('Error generating RAG response', error);
      throw new Error('Không thể tạo câu trả lời. Vui lòng thử lại.');
    }
  }

  /**
   * ⚡ TỐI ƯU: Tạo câu trả lời RAG với context đã được format compact
   * Tiết kiệm 60-70% tokens so với phương thức gốc
   */
  async generateRAGResponseWithOptimizedContext(
    query: string,
    intent: QueryIntent,
    compactContextString: string,
  ): Promise<RAGResponse> {
    if (!this.model) {
      throw new Error('Gemini AI chưa được cấu hình. Vui lòng kiểm tra GEMINI_API_KEY.');
    }

    try {
      const startTime = Date.now();
      
      // System prompt tối ưu - ngắn gọn hơn 50%
      const optimizedPrompt = this.buildOptimizedPrompt(query, intent, compactContextString);
      
      // Ước tính tokens
      const estimatedTokens = Math.ceil(optimizedPrompt.length / 4);
      this.logger.debug(`Optimized prompt: ~${estimatedTokens} tokens`);
      
      // Gọi Gemini API
      const result = await this.model.generateContent(optimizedPrompt);
      const response = await result.response;
      const text = response.text();
      
      const processingTime = Date.now() - startTime;
      this.logger.debug(`Optimized RAG response in ${processingTime}ms`);

      return {
        answer: text,
        sources: this.extractSourcesFromContext(compactContextString),
        contextUsed: intent.contextTypes,
        confidence: this.calculateConfidence(intent, []),
        suggestedQueries: this.generateSuggestedQueries(intent),
        tokensUsed: estimatedTokens,
      };
    } catch (error) {
      this.logger.error('Error generating optimized RAG response', error);
      throw new Error('Không thể tạo câu trả lời. Vui lòng thử lại.');
    }
  }

  /**
   * Build optimized prompt - 50% ngắn hơn prompt gốc
   */
  private buildOptimizedPrompt(
    query: string,
    intent: QueryIntent,
    contextString: string,
  ): string {
    return `Trợ lý AI rau sạch. Quy tắc: CHỈ dùng data cho, KHÔNG bịa, tiếng Việt ngắn gọn, max 10 mục.
Ký hiệu: SP=sản phẩm, ĐH=đơn hàng, KH=khách hàng, k=nghìn, tr=triệu, ⏳=chờ, 🚚=giao, ✅=nhận, ❌=hủy

[DATA]
${contextString}

[QUERY] ${query}

Trả lời:`;
  }

  /**
   * Extract sources từ compact context string
   */
  private extractSourcesFromContext(contextString: string): RAGSource[] {
    const sources: RAGSource[] = [];
    
    // Parse [SP:X], [ĐH:Y], etc.
    const patterns = [
      { regex: /\[SP:(\d+)\]/, type: 'sanpham' as ContextType, name: 'sản phẩm' },
      { regex: /\[ĐH:(\d+)\]/, type: 'donhang' as ContextType, name: 'đơn hàng' },
      { regex: /\[KH:(\d+)\]/, type: 'khachhang' as ContextType, name: 'khách hàng' },
      { regex: /\[NCC:(\d+)\]/, type: 'nhacungcap' as ContextType, name: 'nhà cung cấp' },
      { regex: /\[TK:(\d+)\]/, type: 'tonkho' as ContextType, name: 'tồn kho' },
      { regex: /\[BG:(\d+)\]/, type: 'banggia' as ContextType, name: 'bảng giá' },
      { regex: /\[Kho:(\d+)\]/, type: 'kho' as ContextType, name: 'kho' },
    ];
    
    for (const { regex, type, name } of patterns) {
      const match = contextString.match(regex);
      if (match) {
        sources.push({
          type,
          entity: `${match[1]} ${name}`,
          relevance: 0.9,
        });
      }
    }
    
    return sources;
  }

  /**
   * Xây dựng prompt cho RAG (original - verbose)
   */
  private buildRAGPrompt(
    query: string,
    intent: QueryIntent,
    context: Partial<RausachContext>,
  ): string {
    const systemPrompt = `Bạn là trợ lý AI thông minh cho hệ thống quản lý rau sạch. 
Nhiệm vụ của bạn là trả lời câu hỏi của người dùng dựa trên dữ liệu được cung cấp.

QUY TẮC QUAN TRỌNG:
1. CHỈ trả lời dựa trên dữ liệu được cung cấp, KHÔNG bịa thông tin
2. Nếu không có dữ liệu liên quan, hãy nói rõ "Không tìm thấy dữ liệu phù hợp"
3. Trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu
4. Định dạng số tiền: sử dụng dấu chấm phân cách hàng nghìn (VD: 100.000đ)
5. Khi liệt kê, sử dụng bullet points
6. Nếu có nhiều kết quả, hiển thị tối đa 10 mục đầu tiên
7. Luôn kết thúc bằng một câu hỏi gợi ý hoặc thông tin bổ sung nếu phù hợp

INTENT DETECTED: ${intent.intent}
ENTITIES EXTRACTED: ${JSON.stringify(intent.entities)}
`;

    const contextString = this.formatContext(context);
    
    return `${systemPrompt}

=== DỮ LIỆU HỆ THỐNG ===
${contextString}

=== CÂU HỎI CỦA NGƯỜI DÙNG ===
${query}

=== YÊU CẦU ===
Hãy trả lời câu hỏi trên dựa trên dữ liệu đã cung cấp. Format câu trả lời rõ ràng, có cấu trúc.`;
  }

  /**
   * Format context thành string cho prompt
   */
  private formatContext(context: Partial<RausachContext>): string {
    const parts: string[] = [];

    if (context.sanpham && context.sanpham.length > 0) {
      parts.push(`
### SẢN PHẨM (${context.sanpham.length} sản phẩm)
${context.sanpham.slice(0, 50).map(sp => 
  `- ${sp.title} (Mã: ${sp.masp}) | Giá gốc: ${sp.giagoc.toLocaleString('vi-VN')}đ | Giá bán: ${sp.giaban.toLocaleString('vi-VN')}đ | Tồn: ${sp.soluongkho} ${sp.dvt || ''} | VAT: ${sp.vat}%`
).join('\n')}`);
    }

    if (context.donhang && context.donhang.length > 0) {
      parts.push(`
### ĐƠN HÀNG (${context.donhang.length} đơn)
${context.donhang.slice(0, 30).map(dh => {
  const statusMap: Record<string, string> = {
    'dadat': 'Đã đặt',
    'dagiao': 'Đã giao',
    'danhan': 'Đã nhận',
    'huy': 'Hủy',
    'hoanthanh': 'Hoàn thành'
  };
  return `- ${dh.madonhang} | KH: ${dh.khachhangName || 'N/A'} | Ngày: ${dh.ngaygiao ? new Date(dh.ngaygiao).toLocaleDateString('vi-VN') : 'N/A'} | Tổng: ${dh.tongtien.toLocaleString('vi-VN')}đ | Trạng thái: ${statusMap[dh.status] || dh.status}`;
}).join('\n')}`);
    }

    if (context.khachhang && context.khachhang.length > 0) {
      parts.push(`
### KHÁCH HÀNG (${context.khachhang.length} khách)
${context.khachhang.slice(0, 30).map(kh => 
  `- ${kh.name || 'N/A'} (Mã: ${kh.makh}) | SĐT: ${kh.sdt || 'N/A'} | Loại: ${kh.loaikh || 'N/A'} | Số đơn: ${kh.donhangCount}`
).join('\n')}`);
    }

    if (context.nhacungcap && context.nhacungcap.length > 0) {
      parts.push(`
### NHÀ CUNG CẤP (${context.nhacungcap.length} NCC)
${context.nhacungcap.slice(0, 20).map(ncc => 
  `- ${ncc.name || 'N/A'} (Mã: ${ncc.mancc}) | SĐT: ${ncc.sdt || 'N/A'} | Số đơn đặt: ${ncc.dathangCount}`
).join('\n')}`);
    }

    if (context.tonkho && context.tonkho.length > 0) {
      parts.push(`
### TỒN KHO (${context.tonkho.length} sản phẩm)
${context.tonkho.slice(0, 30).map(tk => 
  `- ${tk.sanphamTitle} (${tk.masp}) | Tồn: ${tk.slton} | Chờ giao: ${tk.slchogiao} | Chờ nhập: ${tk.slchonhap} | Tồn TT: ${tk.sltontt}`
).join('\n')}`);
    }

    if (context.banggia && context.banggia.length > 0) {
      parts.push(`
### BẢNG GIÁ (${context.banggia.length} bảng giá)
${context.banggia.map(bg => {
  const batdau = bg.batdau ? new Date(bg.batdau).toLocaleDateString('vi-VN') : 'N/A';
  const ketthuc = bg.ketthuc ? new Date(bg.ketthuc).toLocaleDateString('vi-VN') : 'N/A';
  return `- ${bg.title || bg.mabanggia || 'N/A'} | Loại: ${bg.type || 'N/A'} | Từ: ${batdau} - ${ketthuc} | SP: ${bg.sanphamCount} | ${bg.isDefault ? '(Mặc định)' : ''}`;
}).join('\n')}`);
    }

    if (context.kho && context.kho.length > 0) {
      parts.push(`
### KHO (${context.kho.length} kho)
${context.kho.map(k => 
  `- ${k.name} (Mã: ${k.makho || 'N/A'}) | Địa chỉ: ${k.diachi || 'N/A'} | Công ty: ${k.congtyName || 'N/A'}`
).join('\n')}`);
    }

    if (parts.length === 0) {
      return 'Không có dữ liệu context.';
    }

    return parts.join('\n');
  }

  /**
   * Parse response từ Gemini và tạo sources
   */
  private parseResponse(
    text: string,
    context: Partial<RausachContext>,
    intent: QueryIntent,
  ): { answer: string; sources: RAGSource[] } {
    const sources: RAGSource[] = [];

    // Tạo sources từ context đã sử dụng
    if (context.sanpham && context.sanpham.length > 0) {
      sources.push({
        type: 'sanpham',
        entity: `${context.sanpham.length} sản phẩm`,
        relevance: 0.9,
      });
    }

    if (context.donhang && context.donhang.length > 0) {
      sources.push({
        type: 'donhang',
        entity: `${context.donhang.length} đơn hàng`,
        relevance: 0.9,
      });
    }

    if (context.khachhang && context.khachhang.length > 0) {
      sources.push({
        type: 'khachhang',
        entity: `${context.khachhang.length} khách hàng`,
        relevance: 0.8,
      });
    }

    if (context.nhacungcap && context.nhacungcap.length > 0) {
      sources.push({
        type: 'nhacungcap',
        entity: `${context.nhacungcap.length} nhà cung cấp`,
        relevance: 0.8,
      });
    }

    if (context.tonkho && context.tonkho.length > 0) {
      sources.push({
        type: 'tonkho',
        entity: `${context.tonkho.length} bản ghi tồn kho`,
        relevance: 0.85,
      });
    }

    return {
      answer: text,
      sources,
    };
  }

  /**
   * Tính confidence score
   */
  private calculateConfidence(intent: QueryIntent, sources: RAGSource[]): number {
    let confidence = intent.confidence;
    
    // Tăng confidence nếu có nhiều sources
    if (sources.length > 0) {
      confidence = Math.min(confidence + sources.length * 0.05, 0.95);
    }

    return confidence;
  }

  /**
   * Tạo suggested queries
   */
  private generateSuggestedQueries(intent: QueryIntent): string[] {
    const suggestions: Record<string, string[]> = {
      query_product: [
        'Sản phẩm nào bán chạy nhất?',
        'Danh sách sản phẩm có tồn kho thấp',
        'So sánh giá các sản phẩm',
      ],
      query_order: [
        'Đơn hàng trong tuần này',
        'Tổng doanh thu tháng này',
        'Đơn hàng cần giao hôm nay',
      ],
      query_customer: [
        'Top khách hàng mua nhiều nhất',
        'Khách hàng mới trong tháng',
        'Khách hàng chưa đặt hàng lâu',
      ],
      query_inventory: [
        'Sản phẩm sắp hết hàng',
        'Tổng giá trị tồn kho',
        'Cần nhập thêm sản phẩm nào?',
      ],
      default: [
        'Thống kê tổng quan',
        'Báo cáo doanh thu',
        'Tình trạng tồn kho',
      ],
    };

    return suggestions[intent.intent] || suggestions.default;
  }

  /**
   * Chat đơn giản không cần context (cho câu hỏi chung)
   */
  async simpleChat(message: string): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini AI chưa được cấu hình.');
    }

    try {
      const prompt = `Bạn là trợ lý AI cho hệ thống quản lý rau sạch.
Trả lời ngắn gọn, bằng tiếng Việt.

Câu hỏi: ${message}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      this.logger.error('Error in simple chat', error);
      throw new Error('Không thể xử lý tin nhắn.');
    }
  }
}
