/**
 * RAG Context Service - Rausach Domain
 * Service để lấy và quản lý context data từ database testdata
 * 
 * Kết nối tới database: testdata (116.118.49.243:55432)
 * Schema từ: external/noiborausach/schema.prisma
 */

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RagPrismaService } from './rag-prisma.service';
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

@Injectable()
export class RagContextService implements OnModuleInit {
  private readonly logger = new Logger(RagContextService.name);
  private contextCache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 phút
  private databaseAvailable = false;

  constructor(private readonly prisma: RagPrismaService) {}

  async onModuleInit() {
    await this.checkDatabaseConnection();
  }

  /**
   * Kiểm tra kết nối database và tables
   */
  private async checkDatabaseConnection(): Promise<void> {
    try {
      // Kiểm tra kết nối và table Sanpham
      const result = await this.prisma.$queryRaw<any[]>`SELECT COUNT(*) as count FROM "Sanpham" LIMIT 1`;
      this.databaseAvailable = true;
      this.logger.log('✅ RAG Context: Connected to testdata database successfully');
    } catch (error) {
      this.databaseAvailable = false;
      this.logger.error('❌ RAG Context: Failed to connect to database', error.message);
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
   * Lấy thông tin sản phẩm từ database với cache
   */
  async getSanphamContext(): Promise<SanphamContext[]> {
    const cached = this.getFromCache<SanphamContext[]>('sanpham');
    if (cached) return cached;

    try {
      const sanphams = await this.prisma.$queryRaw<any[]>`
        SELECT 
          id, 
          title, 
          masp, 
          CAST(giagoc AS FLOAT) as giagoc,
          CAST(giaban AS FLOAT) as giaban, 
          dvt, 
          CAST(soluong AS FLOAT) as soluong, 
          CAST(soluongkho AS FLOAT) as soluongkho,
          CAST(COALESCE(vat, 0) AS FLOAT) as vat,
          "isActive"
        FROM "Sanpham" 
        WHERE "isActive" = true
        ORDER BY title ASC
        LIMIT 100
      `;

      const result: SanphamContext[] = sanphams.map(sp => ({
        id: sp.id,
        title: sp.title,
        masp: sp.masp,
        giagoc: Number(sp.giagoc) || 0,
        giaban: Number(sp.giaban) || 0,
        dvt: sp.dvt,
        soluong: Number(sp.soluong) || 0,
        soluongkho: Number(sp.soluongkho) || 0,
        vat: Number(sp.vat) || 0,
        isActive: sp.isActive,
      }));

      this.logger.debug(`Fetched ${result.length} products from database`);
      this.setCache('sanpham', result);
      return result;
    } catch (error) {
      this.logger.error('Error fetching Sanpham from database', error.message);
      return [];
    }
  }

  /**
   * Lấy thông tin đơn hàng từ database
   */
  async getDonhangContext(): Promise<DonhangContext[]> {
    const cached = this.getFromCache<DonhangContext[]>('donhang');
    if (cached) return cached;

    try {
      const donhangs = await this.prisma.$queryRaw<any[]>`
        SELECT 
          d.id,
          d.madonhang,
          d.ngaygiao,
          d.status,
          CAST(d.tongtien AS FLOAT) as tongtien,
          CAST(d.tongvat AS FLOAT) as tongvat,
          k.name as "khachhangName",
          (SELECT COUNT(*) FROM "Donhangsanpham" WHERE "donhangId" = d.id) as "sanphamCount"
        FROM "Donhang" d
        LEFT JOIN "Khachhang" k ON d."khachhangId" = k.id
        ORDER BY d."createdAt" DESC
        LIMIT 100
      `;

      const result: DonhangContext[] = donhangs.map(dh => ({
        id: dh.id,
        madonhang: dh.madonhang,
        ngaygiao: dh.ngaygiao,
        status: dh.status,
        tongtien: Number(dh.tongtien) || 0,
        tongvat: Number(dh.tongvat) || 0,
        khachhangName: dh.khachhangName,
        sanphamCount: Number(dh.sanphamCount) || 0,
      }));

      this.logger.debug(`Fetched ${result.length} orders from database`);
      this.setCache('donhang', result);
      return result;
    } catch (error) {
      this.logger.error('Error fetching Donhang from database', error.message);
      return [];
    }
  }

  /**
   * Lấy thông tin khách hàng từ database
   */
  async getKhachhangContext(): Promise<KhachhangContext[]> {
    const cached = this.getFromCache<KhachhangContext[]>('khachhang');
    if (cached) return cached;

    try {
      const khachhangs = await this.prisma.$queryRaw<any[]>`
        SELECT 
          k.id,
          k.name,
          k.makh,
          k.diachi,
          k.sdt,
          k.loaikh,
          (SELECT COUNT(*) FROM "Donhang" WHERE "khachhangId" = k.id) as "donhangCount"
        FROM "Khachhang" k
        WHERE k."isActive" = true OR k."isActive" IS NULL
        ORDER BY k.name ASC
        LIMIT 100
      `;

      const result: KhachhangContext[] = khachhangs.map(kh => ({
        id: kh.id,
        name: kh.name,
        makh: kh.makh,
        diachi: kh.diachi,
        sdt: kh.sdt,
        loaikh: kh.loaikh,
        donhangCount: Number(kh.donhangCount) || 0,
      }));

      this.logger.debug(`Fetched ${result.length} customers from database`);
      this.setCache('khachhang', result);
      return result;
    } catch (error) {
      this.logger.error('Error fetching Khachhang from database', error.message);
      return [];
    }
  }

  /**
   * Lấy thông tin nhà cung cấp từ database
   */
  async getNhacungcapContext(): Promise<NhacungcapContext[]> {
    const cached = this.getFromCache<NhacungcapContext[]>('nhacungcap');
    if (cached) return cached;

    try {
      const nhacungcaps = await this.prisma.$queryRaw<any[]>`
        SELECT 
          n.id,
          n.name,
          n.mancc,
          n.diachi,
          n.sdt,
          (SELECT COUNT(*) FROM "Dathang" WHERE "nhacungcapId" = n.id) as "dathangCount"
        FROM "Nhacungcap" n
        WHERE n."isActive" = true
        ORDER BY n.name ASC
        LIMIT 50
      `;

      const result: NhacungcapContext[] = nhacungcaps.map(ncc => ({
        id: ncc.id,
        name: ncc.name,
        mancc: ncc.mancc,
        diachi: ncc.diachi,
        sdt: ncc.sdt,
        dathangCount: Number(ncc.dathangCount) || 0,
      }));

      this.logger.debug(`Fetched ${result.length} suppliers from database`);
      this.setCache('nhacungcap', result);
      return result;
    } catch (error) {
      this.logger.error('Error fetching Nhacungcap from database', error.message);
      return [];
    }
  }

  /**
   * Lấy thông tin tồn kho từ database
   */
  async getTonkhoContext(): Promise<TonkhoContext[]> {
    const cached = this.getFromCache<TonkhoContext[]>('tonkho');
    if (cached) return cached;

    try {
      const tonkhos = await this.prisma.$queryRaw<any[]>`
        SELECT 
          t.id,
          s.title as "sanphamTitle",
          s.masp,
          CAST(t.slton AS FLOAT) as slton,
          CAST(t.slchogiao AS FLOAT) as slchogiao,
          CAST(t.slchonhap AS FLOAT) as slchonhap,
          CAST(t.sltontt AS FLOAT) as sltontt
        FROM "TonKho" t
        JOIN "Sanpham" s ON t."sanphamId" = s.id
        ORDER BY s.title ASC
        LIMIT 100
      `;

      const result: TonkhoContext[] = tonkhos.map(tk => ({
        id: tk.id,
        sanphamTitle: tk.sanphamTitle,
        masp: tk.masp,
        slton: Number(tk.slton) || 0,
        slchogiao: Number(tk.slchogiao) || 0,
        slchonhap: Number(tk.slchonhap) || 0,
        sltontt: Number(tk.sltontt) || 0,
      }));

      this.logger.debug(`Fetched ${result.length} inventory records from database`);
      this.setCache('tonkho', result);
      return result;
    } catch (error) {
      this.logger.error('Error fetching TonKho from database', error.message);
      return [];
    }
  }

  /**
   * Lấy thông tin bảng giá từ database
   */
  async getBanggiaContext(): Promise<BanggiaContext[]> {
    const cached = this.getFromCache<BanggiaContext[]>('banggia');
    if (cached) return cached;

    try {
      const banggias = await this.prisma.$queryRaw<any[]>`
        SELECT 
          b.id,
          b.title,
          b.mabanggia,
          b.type,
          b.batdau,
          b.ketthuc,
          b."isDefault",
          (SELECT COUNT(*) FROM "Banggiasanpham" WHERE "banggiaId" = b.id) as "sanphamCount"
        FROM "Banggia" b
        WHERE b."isActive" = true
        ORDER BY b."isDefault" DESC, b.title ASC
        LIMIT 20
      `;

      const result: BanggiaContext[] = banggias.map(bg => ({
        id: bg.id,
        title: bg.title,
        mabanggia: bg.mabanggia,
        type: bg.type,
        batdau: bg.batdau,
        ketthuc: bg.ketthuc,
        isDefault: bg.isDefault || false,
        sanphamCount: Number(bg.sanphamCount) || 0,
      }));

      this.logger.debug(`Fetched ${result.length} price lists from database`);
      this.setCache('banggia', result);
      return result;
    } catch (error) {
      this.logger.error('Error fetching Banggia from database', error.message);
      return [];
    }
  }

  /**
   * Lấy thông tin kho từ database
   */
  async getKhoContext(): Promise<KhoContext[]> {
    const cached = this.getFromCache<KhoContext[]>('kho');
    if (cached) return cached;

    try {
      const khos = await this.prisma.$queryRaw<any[]>`
        SELECT 
          k.id,
          k.name,
          k.makho,
          k.diachi,
          c.name as "congtyName"
        FROM "Kho" k
        LEFT JOIN "Congty" c ON k."congtyId" = c.id
        WHERE k."isActive" = true
        ORDER BY k.name ASC
        LIMIT 20
      `;

      const result: KhoContext[] = khos.map(kho => ({
        id: kho.id,
        name: kho.name,
        makho: kho.makho,
        diachi: kho.diachi,
        congtyName: kho.congtyName,
      }));

      this.logger.debug(`Fetched ${result.length} warehouses from database`);
      this.setCache('kho', result);
      return result;
    } catch (error) {
      this.logger.error('Error fetching Kho from database', error.message);
      return [];
    }
  }

  /**
   * Tìm kiếm sản phẩm theo từ khóa
   */
  async searchSanpham(keyword: string): Promise<SanphamContext[]> {
    const lowerKeyword = `%${keyword.toLowerCase()}%`;
    
    try {
      const sanphams = await this.prisma.$queryRaw<any[]>`
        SELECT 
          id, 
          title, 
          masp, 
          CAST(giagoc AS FLOAT) as giagoc,
          CAST(giaban AS FLOAT) as giaban, 
          dvt, 
          CAST(soluong AS FLOAT) as soluong, 
          CAST(soluongkho AS FLOAT) as soluongkho,
          CAST(COALESCE(vat, 0) AS FLOAT) as vat,
          "isActive"
        FROM "Sanpham" 
        WHERE 
          "isActive" = true 
          AND (LOWER(title) LIKE ${lowerKeyword} OR LOWER(masp) LIKE ${lowerKeyword})
        ORDER BY title ASC
        LIMIT 20
      `;

      return sanphams.map(sp => ({
        id: sp.id,
        title: sp.title,
        masp: sp.masp,
        giagoc: Number(sp.giagoc) || 0,
        giaban: Number(sp.giaban) || 0,
        dvt: sp.dvt,
        soluong: Number(sp.soluong) || 0,
        soluongkho: Number(sp.soluongkho) || 0,
        vat: Number(sp.vat) || 0,
        isActive: sp.isActive,
      }));
    } catch (error) {
      this.logger.error('Error searching Sanpham', error.message);
      return [];
    }
  }

  /**
   * Lấy thống kê tổng quan từ database
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

    try {
      // Đếm sản phẩm
      const sanphamCount = await this.prisma.$queryRaw<any[]>`
        SELECT COUNT(*) as count FROM "Sanpham" WHERE "isActive" = true
      `;
      
      // Đếm đơn hàng
      const donhangCount = await this.prisma.$queryRaw<any[]>`
        SELECT COUNT(*) as count FROM "Donhang"
      `;
      
      // Đếm khách hàng
      const khachhangCount = await this.prisma.$queryRaw<any[]>`
        SELECT COUNT(*) as count FROM "Khachhang" WHERE "isActive" = true OR "isActive" IS NULL
      `;
      
      // Đếm nhà cung cấp
      const nhacungcapCount = await this.prisma.$queryRaw<any[]>`
        SELECT COUNT(*) as count FROM "Nhacungcap" WHERE "isActive" = true
      `;
      
      // Tính doanh thu từ đơn hàng hoàn thành
      const doanhThuResult = await this.prisma.$queryRaw<any[]>`
        SELECT COALESCE(SUM(CAST(tongtien AS FLOAT)), 0) as total 
        FROM "Donhang" 
        WHERE status = 'hoanthanh' OR status = 'danhan'
      `;
      
      // Thống kê theo trạng thái đơn hàng
      const statusCounts = await this.prisma.$queryRaw<any[]>`
        SELECT status, COUNT(*) as count 
        FROM "Donhang" 
        GROUP BY status
      `;

      const stats = {
        totalSanpham: Number(sanphamCount[0]?.count) || 0,
        totalDonhang: Number(donhangCount[0]?.count) || 0,
        totalKhachhang: Number(khachhangCount[0]?.count) || 0,
        totalNhacungcap: Number(nhacungcapCount[0]?.count) || 0,
        doanhThu: Number(doanhThuResult[0]?.total) || 0,
        donhangStatus: statusCounts.map(s => ({
          status: s.status,
          count: Number(s.count) || 0,
        })),
      };

      this.logger.debug('Fetched statistics from database:', stats);
      this.setCache('statistics', stats);
      return stats;
    } catch (error) {
      this.logger.error('Error fetching statistics from database', error.message);
      return {
        totalSanpham: 0,
        totalDonhang: 0,
        totalKhachhang: 0,
        totalNhacungcap: 0,
        doanhThu: 0,
        donhangStatus: [],
      };
    }
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
    await this.checkDatabaseConnection();
    this.logger.log('Context refreshed');
  }

  /**
   * Kiểm tra database có available không
   */
  isDatabaseAvailable(): boolean {
    return this.databaseAvailable;
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
