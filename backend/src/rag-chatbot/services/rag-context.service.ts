/**
 * RAG Context Service - Rausach Domain
 * Service để lấy và quản lý context data từ database
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

@Injectable()
export class RagContextService {
  private readonly logger = new Logger(RagContextService.name);
  private contextCache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 phút

  constructor(private readonly prisma: PrismaService) {}

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
    const cached = this.getFromCache('sanpham');
    if (cached) return cached;

    try {
      const sanpham = await this.prisma.sanpham.findMany({
        where: { isActive: true },
        select: {
          id: true,
          title: true,
          masp: true,
          giagoc: true,
          giaban: true,
          dvt: true,
          soluong: true,
          soluongkho: true,
          vat: true,
          isActive: true,
        },
        take: 500, // Giới hạn để tối ưu
        orderBy: { updatedAt: 'desc' },
      });

      const result = sanpham.map((sp) => ({
        id: sp.id,
        title: sp.title,
        masp: sp.masp,
        giagoc: Number(sp.giagoc),
        giaban: Number(sp.giaban),
        dvt: sp.dvt,
        soluong: Number(sp.soluong),
        soluongkho: Number(sp.soluongkho),
        vat: Number(sp.vat),
        isActive: sp.isActive,
      }));

      this.setCache('sanpham', result);
      return result;
    } catch (error) {
      this.logger.error('Error fetching sanpham context', error);
      return [];
    }
  }

  /**
   * Lấy thông tin đơn hàng
   */
  async getDonhangContext(): Promise<DonhangContext[]> {
    const cached = this.getFromCache('donhang');
    if (cached) return cached;

    try {
      const donhang = await this.prisma.donhang.findMany({
        select: {
          id: true,
          madonhang: true,
          ngaygiao: true,
          status: true,
          tongtien: true,
          tongvat: true,
          khachhang: {
            select: { name: true },
          },
          _count: {
            select: { sanpham: true },
          },
        },
        take: 200,
        orderBy: { createdAt: 'desc' },
      });

      const result = donhang.map((dh) => ({
        id: dh.id,
        madonhang: dh.madonhang,
        ngaygiao: dh.ngaygiao,
        status: dh.status,
        tongtien: Number(dh.tongtien),
        tongvat: Number(dh.tongvat),
        khachhangName: dh.khachhang?.name || null,
        sanphamCount: dh._count.sanpham,
      }));

      this.setCache('donhang', result);
      return result;
    } catch (error) {
      this.logger.error('Error fetching donhang context', error);
      return [];
    }
  }

  /**
   * Lấy thông tin khách hàng
   */
  async getKhachhangContext(): Promise<KhachhangContext[]> {
    const cached = this.getFromCache('khachhang');
    if (cached) return cached;

    try {
      const khachhang = await this.prisma.khachhang.findMany({
        select: {
          id: true,
          name: true,
          makh: true,
          diachi: true,
          sdt: true,
          loaikh: true,
          _count: {
            select: { donhang: true },
          },
        },
        take: 300,
        orderBy: { updatedAt: 'desc' },
      });

      const result = khachhang.map((kh) => ({
        id: kh.id,
        name: kh.name,
        makh: kh.makh,
        diachi: kh.diachi,
        sdt: kh.sdt,
        loaikh: kh.loaikh,
        donhangCount: kh._count.donhang,
      }));

      this.setCache('khachhang', result);
      return result;
    } catch (error) {
      this.logger.error('Error fetching khachhang context', error);
      return [];
    }
  }

  /**
   * Lấy thông tin nhà cung cấp
   */
  async getNhacungcapContext(): Promise<NhacungcapContext[]> {
    const cached = this.getFromCache('nhacungcap');
    if (cached) return cached;

    try {
      const nhacungcap = await this.prisma.nhacungcap.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          mancc: true,
          diachi: true,
          sdt: true,
          _count: {
            select: { dathang: true },
          },
        },
        take: 200,
      });

      const result = nhacungcap.map((ncc) => ({
        id: ncc.id,
        name: ncc.name,
        mancc: ncc.mancc,
        diachi: ncc.diachi,
        sdt: ncc.sdt,
        dathangCount: ncc._count.dathang,
      }));

      this.setCache('nhacungcap', result);
      return result;
    } catch (error) {
      this.logger.error('Error fetching nhacungcap context', error);
      return [];
    }
  }

  /**
   * Lấy thông tin tồn kho
   */
  async getTonkhoContext(): Promise<TonkhoContext[]> {
    const cached = this.getFromCache('tonkho');
    if (cached) return cached;

    try {
      const tonkho = await this.prisma.tonKho.findMany({
        select: {
          id: true,
          slton: true,
          slchogiao: true,
          slchonhap: true,
          sltontt: true,
          sanpham: {
            select: {
              title: true,
              masp: true,
            },
          },
        },
        take: 500,
      });

      const result = tonkho.map((tk) => ({
        id: tk.id,
        sanphamTitle: tk.sanpham.title,
        masp: tk.sanpham.masp,
        slton: Number(tk.slton),
        slchogiao: Number(tk.slchogiao),
        slchonhap: Number(tk.slchonhap),
        sltontt: Number(tk.sltontt),
      }));

      this.setCache('tonkho', result);
      return result;
    } catch (error) {
      this.logger.error('Error fetching tonkho context', error);
      return [];
    }
  }

  /**
   * Lấy thông tin bảng giá
   */
  async getBanggiaContext(): Promise<BanggiaContext[]> {
    const cached = this.getFromCache('banggia');
    if (cached) return cached;

    try {
      const banggia = await this.prisma.banggia.findMany({
        where: { isActive: true },
        select: {
          id: true,
          title: true,
          mabanggia: true,
          type: true,
          batdau: true,
          ketthuc: true,
          isDefault: true,
          _count: {
            select: { sanpham: true },
          },
        },
        take: 50,
      });

      const result = banggia.map((bg) => ({
        id: bg.id,
        title: bg.title,
        mabanggia: bg.mabanggia,
        type: bg.type,
        batdau: bg.batdau,
        ketthuc: bg.ketthuc,
        isDefault: bg.isDefault,
        sanphamCount: bg._count.sanpham,
      }));

      this.setCache('banggia', result);
      return result;
    } catch (error) {
      this.logger.error('Error fetching banggia context', error);
      return [];
    }
  }

  /**
   * Lấy thông tin kho
   */
  async getKhoContext(): Promise<KhoContext[]> {
    const cached = this.getFromCache('kho');
    if (cached) return cached;

    try {
      const kho = await this.prisma.kho.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          makho: true,
          diachi: true,
          congty: {
            select: { name: true },
          },
        },
        take: 50,
      });

      const result = kho.map((k) => ({
        id: k.id,
        name: k.name,
        makho: k.makho,
        diachi: k.diachi,
        congtyName: k.congty?.name || null,
      }));

      this.setCache('kho', result);
      return result;
    } catch (error) {
      this.logger.error('Error fetching kho context', error);
      return [];
    }
  }

  /**
   * Tìm kiếm sản phẩm theo từ khóa
   */
  async searchSanpham(keyword: string): Promise<SanphamContext[]> {
    try {
      const sanpham = await this.prisma.sanpham.findMany({
        where: {
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { masp: { contains: keyword, mode: 'insensitive' } },
          ],
          isActive: true,
        },
        select: {
          id: true,
          title: true,
          masp: true,
          giagoc: true,
          giaban: true,
          dvt: true,
          soluong: true,
          soluongkho: true,
          vat: true,
          isActive: true,
        },
        take: 20,
      });

      return sanpham.map((sp) => ({
        id: sp.id,
        title: sp.title,
        masp: sp.masp,
        giagoc: Number(sp.giagoc),
        giaban: Number(sp.giaban),
        dvt: sp.dvt,
        soluong: Number(sp.soluong),
        soluongkho: Number(sp.soluongkho),
        vat: Number(sp.vat),
        isActive: sp.isActive,
      }));
    } catch (error) {
      this.logger.error('Error searching sanpham', error);
      return [];
    }
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
    const cached = this.getFromCache('statistics');
    if (cached) return cached;

    try {
      const [
        totalSanpham,
        totalDonhang,
        totalKhachhang,
        totalNhacungcap,
        donhangStats,
        doanhThuResult,
      ] = await Promise.all([
        this.prisma.sanpham.count({ where: { isActive: true } }),
        this.prisma.donhang.count(),
        this.prisma.khachhang.count(),
        this.prisma.nhacungcap.count({ where: { isActive: true } }),
        this.prisma.donhang.groupBy({
          by: ['status'],
          _count: { status: true },
        }),
        this.prisma.donhang.aggregate({
          _sum: { tongtien: true },
          where: { status: 'hoanthanh' },
        }),
      ]);

      const result = {
        totalSanpham,
        totalDonhang,
        totalKhachhang,
        totalNhacungcap,
        doanhThu: Number(doanhThuResult._sum.tongtien || 0),
        donhangStatus: donhangStats.map((s) => ({
          status: s.status,
          count: s._count.status,
        })),
      };

      this.setCache('statistics', result);
      return result;
    } catch (error) {
      this.logger.error('Error fetching statistics', error);
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
