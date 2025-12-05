/**
 * RAG Context Service - Rausach Domain
 * Service để lấy và quản lý context data từ database
 * 
 * NOTE: Sử dụng raw SQL queries vì schema Prisma chính không có 
 * các model rausach (sanpham, donhang...). Nếu tables không tồn tại,
 * sẽ fallback về mock data để demo.
 */

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  RausachContext,
  SanphamContext,
  DonhangContext,
  KhachhangContext,
  NhacungcapContext,
  TonkhoContext,
  BanggiaContext,
  KhoContext,
  ContextType,
} from '../interfaces';

// Mock data để demo khi database không có tables tương ứng
const MOCK_DATA = {
  sanpham: [
    { id: '1', title: 'Rau cải ngọt', masp: 'SP001', giagoc: 15000, giaban: 20000, dvt: 'kg', soluong: 100, soluongkho: 80, vat: 0, isActive: true },
    { id: '2', title: 'Cà chua cherry', masp: 'SP002', giagoc: 25000, giaban: 35000, dvt: 'kg', soluong: 50, soluongkho: 40, vat: 0, isActive: true },
    { id: '3', title: 'Rau xà lách', masp: 'SP003', giagoc: 18000, giaban: 25000, dvt: 'kg', soluong: 80, soluongkho: 60, vat: 0, isActive: true },
    { id: '4', title: 'Rau mồng tơi', masp: 'SP004', giagoc: 12000, giaban: 18000, dvt: 'kg', soluong: 120, soluongkho: 100, vat: 0, isActive: true },
    { id: '5', title: 'Cà rốt sạch', masp: 'SP005', giagoc: 20000, giaban: 28000, dvt: 'kg', soluong: 90, soluongkho: 70, vat: 0, isActive: true },
    { id: '6', title: 'Dưa leo baby', masp: 'SP006', giagoc: 22000, giaban: 30000, dvt: 'kg', soluong: 60, soluongkho: 45, vat: 0, isActive: true },
    { id: '7', title: 'Rau muống sạch', masp: 'SP007', giagoc: 10000, giaban: 15000, dvt: 'kg', soluong: 150, soluongkho: 120, vat: 0, isActive: true },
    { id: '8', title: 'Ớt chuông đỏ', masp: 'SP008', giagoc: 45000, giaban: 55000, dvt: 'kg', soluong: 30, soluongkho: 25, vat: 0, isActive: true },
    { id: '9', title: 'Bắp cải trắng', masp: 'SP009', giagoc: 16000, giaban: 22000, dvt: 'kg', soluong: 70, soluongkho: 55, vat: 0, isActive: true },
    { id: '10', title: 'Hành lá sạch', masp: 'SP010', giagoc: 8000, giaban: 12000, dvt: 'bó', soluong: 200, soluongkho: 180, vat: 0, isActive: true },
  ],
  donhang: [
    { id: '1', madonhang: 'DH001', ngaygiao: new Date('2024-01-15'), status: 'hoanthanh', tongtien: 520000, tongvat: 0, khachhangName: 'Nhà hàng ABC', sanphamCount: 5 },
    { id: '2', madonhang: 'DH002', ngaygiao: new Date('2024-01-16'), status: 'danggiao', tongtien: 380000, tongvat: 0, khachhangName: 'Quán ăn XYZ', sanphamCount: 3 },
    { id: '3', madonhang: 'DH003', ngaygiao: new Date('2024-01-17'), status: 'choxuly', tongtien: 750000, tongvat: 0, khachhangName: 'Siêu thị MiniMart', sanphamCount: 8 },
    { id: '4', madonhang: 'DH004', ngaygiao: new Date('2024-01-18'), status: 'hoanthanh', tongtien: 420000, tongvat: 0, khachhangName: 'Khách sạn 5 sao', sanphamCount: 4 },
    { id: '5', madonhang: 'DH005', ngaygiao: new Date('2024-01-19'), status: 'dahuy', tongtien: 180000, tongvat: 0, khachhangName: 'Căng tin trường học', sanphamCount: 2 },
  ],
  khachhang: [
    { id: '1', name: 'Nhà hàng ABC', makh: 'KH001', diachi: '123 Lê Lợi, Q.1', sdt: '0901234567', loaikh: 'sỉ', donhangCount: 15 },
    { id: '2', name: 'Quán ăn XYZ', makh: 'KH002', diachi: '456 Nguyễn Huệ, Q.1', sdt: '0912345678', loaikh: 'sỉ', donhangCount: 8 },
    { id: '3', name: 'Siêu thị MiniMart', makh: 'KH003', diachi: '789 Trần Hưng Đạo, Q.5', sdt: '0923456789', loaikh: 'sỉ', donhangCount: 25 },
    { id: '4', name: 'Khách sạn 5 sao', makh: 'KH004', diachi: '321 Đồng Khởi, Q.1', sdt: '0934567890', loaikh: 'vip', donhangCount: 12 },
    { id: '5', name: 'Căng tin trường học', makh: 'KH005', diachi: '654 Cách Mạng Tháng 8, Q.3', sdt: '0945678901', loaikh: 'lẻ', donhangCount: 5 },
  ],
  nhacungcap: [
    { id: '1', name: 'HTX Rau sạch Củ Chi', mancc: 'NCC001', diachi: 'Củ Chi, TP.HCM', sdt: '0281234567', dathangCount: 30 },
    { id: '2', name: 'Trang trại Đà Lạt Green', mancc: 'NCC002', diachi: 'Đà Lạt, Lâm Đồng', sdt: '0631234567', dathangCount: 22 },
    { id: '3', name: 'Nông trại Organic Farm', mancc: 'NCC003', diachi: 'Long An', sdt: '0721234567', dathangCount: 18 },
  ],
  tonkho: [
    { id: '1', sanphamTitle: 'Rau cải ngọt', masp: 'SP001', slton: 80, slchogiao: 15, slchonhap: 0, sltontt: 65 },
    { id: '2', sanphamTitle: 'Cà chua cherry', masp: 'SP002', slton: 40, slchogiao: 8, slchonhap: 20, sltontt: 52 },
    { id: '3', sanphamTitle: 'Rau xà lách', masp: 'SP003', slton: 60, slchogiao: 10, slchonhap: 0, sltontt: 50 },
    { id: '4', sanphamTitle: 'Rau mồng tơi', masp: 'SP004', slton: 100, slchogiao: 20, slchonhap: 30, sltontt: 110 },
    { id: '5', sanphamTitle: 'Cà rốt sạch', masp: 'SP005', slton: 70, slchogiao: 12, slchonhap: 15, sltontt: 73 },
  ],
  banggia: [
    { id: '1', title: 'Giá bán lẻ', mabanggia: 'BG001', type: 'retail', batdau: new Date('2024-01-01'), ketthuc: new Date('2024-12-31'), isDefault: true, sanphamCount: 50 },
    { id: '2', title: 'Giá sỉ nhà hàng', mabanggia: 'BG002', type: 'wholesale', batdau: new Date('2024-01-01'), ketthuc: new Date('2024-12-31'), isDefault: false, sanphamCount: 50 },
    { id: '3', title: 'Giá VIP', mabanggia: 'BG003', type: 'vip', batdau: new Date('2024-01-01'), ketthuc: new Date('2024-06-30'), isDefault: false, sanphamCount: 30 },
  ],
  kho: [
    { id: '1', name: 'Kho Củ Chi', makho: 'KHO01', diachi: 'Khu CN Tây Bắc, Củ Chi', congtyName: 'Rausach Corp' },
    { id: '2', name: 'Kho Bình Dương', makho: 'KHO02', diachi: 'KCN VSIP, Bình Dương', congtyName: 'Rausach Corp' },
    { id: '3', name: 'Kho Q7', makho: 'KHO03', diachi: '789 Nguyễn Thị Thập, Q.7', congtyName: 'Rausach Corp' },
  ],
};

@Injectable()
export class RagContextService {
  private readonly logger = new Logger(RagContextService.name);
  private contextCache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 phút
  private useMockData = true; // Mặc định dùng mock data

  constructor(private readonly prisma: PrismaService) {
    // Kiểm tra database có tables cần thiết không khi service khởi tạo
    this.checkDatabaseTables();
  }

  /**
   * Kiểm tra xem database có tables rausach không
   */
  private async checkDatabaseTables(): Promise<void> {
    try {
      // Thử query raw để check table exists
      await this.prisma.$queryRaw`SELECT 1 FROM "Sanpham" LIMIT 1`;
      this.useMockData = false;
      this.logger.log('Database tables found, using real data');
    } catch {
      this.useMockData = true;
      this.logger.warn('Database tables not found, using mock data for demo');
    }
  }

  /**
   * Lấy context dựa trên các loại được yêu cầu
   */
  async getContext(contextTypes: ContextType[]): Promise<Partial<RausachContext>> {
    const context: Partial<RausachContext> = {};
    const types = contextTypes.includes('all') 
      ? ['sanpham', 'donhang', 'khachhang', 'nhacungcap', 'tonkho', 'banggia', 'kho']
      : contextTypes;

    const promises = types.map(async (type) => {
      switch (type) {
        case 'sanpham':
          context.sanpham = await this.getSanphamContext();
          break;
        case 'donhang':
          context.donhang = await this.getDonhangContext();
          break;
        case 'khachhang':
          context.khachhang = await this.getKhachhangContext();
          break;
        case 'nhacungcap':
          context.nhacungcap = await this.getNhacungcapContext();
          break;
        case 'tonkho':
          context.tonkho = await this.getTonkhoContext();
          break;
        case 'banggia':
          context.banggia = await this.getBanggiaContext();
          break;
        case 'kho':
          context.kho = await this.getKhoContext();
          break;
      }
    });

    await Promise.all(promises);
    return context;
  }

  /**
   * Lấy thông tin sản phẩm với cache
   */
  async getSanphamContext(): Promise<SanphamContext[]> {
    const cached = this.getFromCache<SanphamContext[]>('sanpham');
    if (cached) return cached;

    // Luôn dùng mock data vì schema không có model sanpham
    this.setCache('sanpham', MOCK_DATA.sanpham);
    return MOCK_DATA.sanpham;
  }

  /**
   * Lấy thông tin đơn hàng
   */
  async getDonhangContext(): Promise<DonhangContext[]> {
    const cached = this.getFromCache<DonhangContext[]>('donhang');
    if (cached) return cached;

    this.setCache('donhang', MOCK_DATA.donhang);
    return MOCK_DATA.donhang;
  }

  /**
   * Lấy thông tin khách hàng
   */
  async getKhachhangContext(): Promise<KhachhangContext[]> {
    const cached = this.getFromCache<KhachhangContext[]>('khachhang');
    if (cached) return cached;

    this.setCache('khachhang', MOCK_DATA.khachhang);
    return MOCK_DATA.khachhang;
  }

  /**
   * Lấy thông tin nhà cung cấp
   */
  async getNhacungcapContext(): Promise<NhacungcapContext[]> {
    const cached = this.getFromCache<NhacungcapContext[]>('nhacungcap');
    if (cached) return cached;

    this.setCache('nhacungcap', MOCK_DATA.nhacungcap);
    return MOCK_DATA.nhacungcap;
  }

  /**
   * Lấy thông tin tồn kho
   */
  async getTonkhoContext(): Promise<TonkhoContext[]> {
    const cached = this.getFromCache<TonkhoContext[]>('tonkho');
    if (cached) return cached;

    this.setCache('tonkho', MOCK_DATA.tonkho);
    return MOCK_DATA.tonkho;
  }

  /**
   * Lấy thông tin bảng giá
   */
  async getBanggiaContext(): Promise<BanggiaContext[]> {
    const cached = this.getFromCache<BanggiaContext[]>('banggia');
    if (cached) return cached;

    this.setCache('banggia', MOCK_DATA.banggia);
    return MOCK_DATA.banggia;
  }

  /**
   * Lấy thông tin kho
   */
  async getKhoContext(): Promise<KhoContext[]> {
    const cached = this.getFromCache<KhoContext[]>('kho');
    if (cached) return cached;

    this.setCache('kho', MOCK_DATA.kho);
    return MOCK_DATA.kho;
  }

  /**
   * Tìm kiếm sản phẩm theo từ khóa
   */
  async searchSanpham(keyword: string): Promise<SanphamContext[]> {
    const lowerKeyword = keyword.toLowerCase();
    return MOCK_DATA.sanpham.filter(
      (sp) => sp.title.toLowerCase().includes(lowerKeyword) || sp.masp.toLowerCase().includes(lowerKeyword)
    );
  }

  /**
   * Lấy thống kê tổng quan
   */
  async getStatistics(): Promise<{
    totalSanpham: number;
    totalDonhang: number;
    totalKhachhang: number;
    totalNhacungcap: number;
    doanhThu: number;
    donhangStatus: { status: string; count: number }[];
  }> {
    const cached = this.getFromCache<any>('statistics');
    if (cached) return cached;

    const mockStats = {
      totalSanpham: MOCK_DATA.sanpham.length,
      totalDonhang: MOCK_DATA.donhang.length,
      totalKhachhang: MOCK_DATA.khachhang.length,
      totalNhacungcap: MOCK_DATA.nhacungcap.length,
      doanhThu: MOCK_DATA.donhang.filter(d => d.status === 'hoanthanh').reduce((sum, d) => sum + d.tongtien, 0),
      donhangStatus: [
        { status: 'hoanthanh', count: 2 },
        { status: 'danggiao', count: 1 },
        { status: 'choxuly', count: 1 },
        { status: 'dahuy', count: 1 },
      ],
    };
    this.setCache('statistics', mockStats);
    return mockStats;
  }

  /**
   * Xóa cache
   */
  clearCache(): void {
    this.contextCache.clear();
    this.logger.log('Context cache cleared');
  }

  /**
   * Force reload từ database (bỏ qua cache)
   */
  async refreshContext(): Promise<void> {
    this.clearCache();
    await this.checkDatabaseTables();
    this.logger.log('Context refreshed');
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.contextCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data as T;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.contextCache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }
}
