/**
 * RAG Chatbot Interfaces - Rausach Domain
 * Định nghĩa các interface cho RAG system
 */

// Context data từ database
export interface RausachContext {
  sanpham: SanphamContext[];
  donhang: DonhangContext[];
  khachhang: KhachhangContext[];
  nhacungcap: NhacungcapContext[];
  tonkho: TonkhoContext[];
  banggia: BanggiaContext[];
  kho: KhoContext[];
}

export interface SanphamContext {
  id: string;
  title: string;
  masp: string;
  giagoc: number;
  giaban: number;
  dvt: string | null;
  soluong: number;
  soluongkho: number;
  vat: number;
  isActive: boolean;
}

export interface DonhangContext {
  id: string;
  madonhang: string;
  ngaygiao: Date | null;
  status: string;
  tongtien: number;
  tongvat: number;
  khachhangName: string | null;
  sanphamCount: number;
}

export interface KhachhangContext {
  id: string;
  name: string | null;
  makh: string;
  diachi: string | null;
  sdt: string | null;
  loaikh: string | null;
  donhangCount: number;
}

export interface NhacungcapContext {
  id: string;
  name: string | null;
  mancc: string;
  diachi: string | null;
  sdt: string | null;
  dathangCount: number;
}

export interface TonkhoContext {
  id: string;
  sanphamTitle: string;
  masp: string;
  slton: number;
  slchogiao: number;
  slchonhap: number;
  sltontt: number;
}

export interface BanggiaContext {
  id: string;
  title: string | null;
  mabanggia: string | null;
  type: string | null;
  batdau: Date | null;
  ketthuc: Date | null;
  isDefault: boolean;
  sanphamCount: number;
}

export interface KhoContext {
  id: string;
  name: string;
  makho: string | null;
  diachi: string | null;
  congtyName: string | null;
}

// RAG Query và Response
export interface RAGQuery {
  message: string;
  userId?: string;
  conversationId?: string;
  contextTypes?: ContextType[];
}

export type ContextType = 
  | 'sanpham' 
  | 'donhang' 
  | 'khachhang' 
  | 'nhacungcap' 
  | 'tonkho' 
  | 'banggia' 
  | 'kho'
  | 'all';

export interface RAGResponse {
  answer: string;
  sources: RAGSource[];
  contextUsed: ContextType[];
  confidence: number;
  suggestedQueries?: string[];
  tokensUsed?: number; // Ước tính số token đã dùng
}

export interface RAGSource {
  type: ContextType;
  entity: string;
  relevance: number;
  data?: any;
}

// Intent Recognition
export interface QueryIntent {
  intent: IntentType;
  entities: ExtractedEntity[];
  confidence: number;
  contextTypes: ContextType[];
}

export type IntentType = 
  | 'query_product'           // Hỏi về sản phẩm
  | 'query_order'             // Hỏi về đơn hàng
  | 'query_customer'          // Hỏi về khách hàng
  | 'query_supplier'          // Hỏi về nhà cung cấp
  | 'query_inventory'         // Hỏi về tồn kho
  | 'query_price'             // Hỏi về giá
  | 'query_statistics'        // Hỏi về thống kê
  | 'query_general'           // Hỏi chung
  | 'action_search'           // Tìm kiếm
  | 'action_list'             // Liệt kê
  | 'action_compare'          // So sánh
  | 'action_calculate'        // Tính toán
  | 'unknown';                // Không xác định

export interface ExtractedEntity {
  type: EntityType;
  value: string;
  rawValue: string;
  confidence: number;
}

export type EntityType = 
  | 'product_name'
  | 'product_code'
  | 'customer_name'
  | 'customer_code'
  | 'supplier_name'
  | 'supplier_code'
  | 'order_code'
  | 'date'
  | 'date_range'
  | 'price'
  | 'quantity'
  | 'status'
  | 'category';

// Conversation History
export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    intent?: QueryIntent;
    sources?: RAGSource[];
    processingTime?: number;
  };
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  messages: ConversationMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// Cache interfaces
export interface ContextCache {
  key: string;
  data: any;
  timestamp: Date;
  ttl: number; // seconds
}

// Metrics
export interface RAGMetrics {
  totalQueries: number;
  avgResponseTime: number;
  successRate: number;
  topIntents: { intent: string; count: number }[];
  topContextTypes: { type: string; count: number }[];
}
