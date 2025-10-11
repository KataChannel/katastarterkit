import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

/**
 * Product Normalization Service
 * 
 * Sử dụng PostgreSQL pg_trgm extension để:
 * 1. Tìm sản phẩm tương tự bằng fuzzy matching
 * 2. Chuẩn hóa tên sản phẩm vào field ten2
 * 3. Nhóm các sản phẩm giống nhau
 * 
 * Example:
 * - "main asus i7" 
 * - "bo mạch asus i7300"
 * - "asus i7300 main"
 * → Tất cả sẽ có cùng ten2: "Main Asus i7"
 */
@Injectable()
export class ProductNormalizationService {
  constructor(private prisma: PrismaService) {}

  /**
   * Tìm sản phẩm tương tự bằng pg_trgm similarity
   * 
   * @param searchText - Tên sản phẩm cần tìm
   * @param threshold - Ngưỡng similarity (0.0-1.0), mặc định 0.3
   * @returns Danh sách sản phẩm tương tự với điểm similarity
   */
  async findSimilarProducts(
    searchText: string,
    threshold: number = 0.3,
  ): Promise<
    Array<{
      id: string;
      ten: string;
      ten2: string | null;
      ma: string | null;
      similarity_score: number;
    }>
  > {
    if (!searchText || searchText.trim() === '') {
      return [];
    }

    // Sử dụng function PostgreSQL đã tạo trong migration
    const result = await this.prisma.$queryRaw<
      Array<{
        id: string;
        ten: string;
        ten2: string | null;
        ma: string | null;
        similarity_score: number;
      }>
    >`
      SELECT * FROM get_similar_products(${searchText}, ${threshold}::real)
    `;

    return result;
  }

  /**
   * Tìm tên chuẩn (canonical name) cho một sản phẩm
   * Dựa trên ten2 phổ biến nhất trong các sản phẩm tương tự
   * 
   * @param productName - Tên sản phẩm
   * @param threshold - Ngưỡng similarity, mặc định 0.6
   * @returns Tên chuẩn (ten2) hoặc null nếu không tìm thấy
   */
  async findCanonicalName(
    productName: string,
    threshold: number = 0.6,
  ): Promise<string | null> {
    if (!productName || productName.trim() === '') {
      return null;
    }

    const result = await this.prisma.$queryRaw<Array<{ find_canonical_name: string | null }>>`
      SELECT find_canonical_name(${productName}, ${threshold}::real)
    `;

    return result[0]?.find_canonical_name || null;
  }

  /**
   * Chuẩn hóa tên sản phẩm
   * 
   * Logic:
   * 1. Tìm canonical name từ DB (nếu có sản phẩm tương tự)
   * 2. Nếu không có, tạo normalized name mới
   * 3. Làm sạch: trim, lowercase, remove extra spaces
   * 
   * @param productName - Tên sản phẩm gốc
   * @param threshold - Ngưỡng similarity
   * @returns Tên đã chuẩn hóa (ten2)
   */
  async normalizeProductName(
    productName: string,
    threshold: number = 0.6,
  ): Promise<string> {
    if (!productName || productName.trim() === '') {
      return '';
    }

    // Bước 1: Tìm canonical name từ DB
    const canonical = await this.findCanonicalName(productName, threshold);
    if (canonical) {
      return canonical;
    }

    // Bước 2: Không tìm thấy → tạo normalized name mới
    const normalized = this.createNormalizedName(productName);
    return normalized;
  }

  /**
   * Tạo normalized name từ raw name
   * 
   * Rules:
   * 1. Lowercase
   * 2. Trim whitespace
   * 3. Remove extra spaces
   * 4. Remove special characters (giữ chữ, số, khoảng trắng)
   * 5. Capitalize first letter of each word
   * 
   * @param rawName - Tên gốc
   * @returns Tên đã normalized
   */
  private createNormalizedName(rawName: string): string {
    return rawName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ') // Multiple spaces → single space
      .replace(/[^\w\sÀ-ỹ]/g, '') // Remove special chars, keep Vietnamese
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Batch normalize: Chuẩn hóa nhiều sản phẩm cùng lúc
   * 
   * @param productIds - Array of product IDs
   * @param threshold - Similarity threshold
   * @returns Số lượng sản phẩm đã update
   */
  async batchNormalize(
    productIds?: string[],
    threshold: number = 0.6,
  ): Promise<{ updated: number; skipped: number; errors: number }> {
    const stats = { updated: 0, skipped: 0, errors: 0 };

    // Lấy sản phẩm cần normalize
    const whereClause: Prisma.ext_sanphamhoadonWhereInput = productIds
      ? { id: { in: productIds } }
      : { ten: { not: null } };

    const products = await this.prisma.ext_sanphamhoadon.findMany({
      where: whereClause,
      select: { id: true, ten: true, ten2: true },
    });

    // Process từng sản phẩm
    for (const product of products) {
      try {
        if (!product.ten) {
          stats.skipped++;
          continue;
        }

        // Normalize
        const normalizedName = await this.normalizeProductName(
          product.ten,
          threshold,
        );

        // Update if changed
        if (normalizedName !== product.ten2) {
          await this.prisma.ext_sanphamhoadon.update({
            where: { id: product.id },
            data: { ten2: normalizedName },
          });
          stats.updated++;
        } else {
          stats.skipped++;
        }
      } catch (error) {
        console.error(`Error normalizing product ${product.id}:`, error);
        stats.errors++;
      }
    }

    return stats;
  }

  /**
   * Group products by normalized name (ten2)
   * Trả về các nhóm sản phẩm có cùng ten2
   * 
   * @param minGroupSize - Chỉ trả về nhóm có ít nhất N sản phẩm
   * @returns Array of groups with products
   */
  async getProductGroups(minGroupSize: number = 2): Promise<
    Array<{
      ten2: string;
      count: number;
      products: Array<{
        id: string;
        ten: string;
        ma: string | null;
        dgia: any;
      }>;
    }>
  > {
    // Tìm ten2 có nhiều sản phẩm
    const groups = await this.prisma.ext_sanphamhoadon.groupBy({
      by: ['ten2'],
      where: {
        ten2: { not: null },
      },
      _count: {
        id: true,
      },
      having: {
        ten2: { not: null },
      },
    });

    // Lọc groups và lấy products
    const result = [];
    for (const group of groups) {
      if (group._count.id >= minGroupSize && group.ten2) {
        const products = await this.prisma.ext_sanphamhoadon.findMany({
          where: { ten2: group.ten2 },
          select: {
            id: true,
            ten: true,
            ma: true,
            dgia: true,
          },
        });

        result.push({
          ten2: group.ten2,
          count: group._count.id,
          products,
        });
      }
    }

    // Sort by count descending
    return result.sort((a, b) => b.count - a.count);
  }

  /**
   * Tìm duplicate products (cùng ten2 nhưng khác ID)
   * 
   * @returns Array of duplicate groups
   */
  async findDuplicates(): Promise<
    Array<{
      ten2: string;
      count: number;
      productIds: string[];
    }>
  > {
    const groups = await this.getProductGroups(2);

    return groups.map((group) => ({
      ten2: group.ten2,
      count: group.count,
      productIds: group.products.map((p) => p.id),
    }));
  }

  /**
   * Merge duplicate products
   * Giữ lại 1 sản phẩm (master), xóa các duplicates
   * 
   * @param ten2 - Normalized name
   * @param keepId - ID của sản phẩm giữ lại (nếu không có, giữ oldest)
   * @returns Số lượng sản phẩm đã xóa
   */
  async mergeDuplicates(ten2: string, keepId?: string): Promise<number> {
    const products = await this.prisma.ext_sanphamhoadon.findMany({
      where: { ten2 },
      orderBy: { createdAt: 'asc' },
    });

    if (products.length <= 1) {
      return 0;
    }

    // Determine master product
    const master = keepId
      ? products.find((p) => p.id === keepId)
      : products[0];

    if (!master) {
      throw new Error('Master product not found');
    }

    // Get IDs to delete
    const duplicateIds = products
      .filter((p) => p.id !== master.id)
      .map((p) => p.id);

    // Delete duplicates
    const result = await this.prisma.ext_sanphamhoadon.deleteMany({
      where: {
        id: { in: duplicateIds },
      },
    });

    return result.count;
  }

  /**
   * Test similarity function
   * Useful for debugging and tuning threshold
   * 
   * @param text1 - First text
   * @param text2 - Second text
   * @returns Similarity score (0.0-1.0)
   */
  async testSimilarity(text1: string, text2: string): Promise<number> {
    const result = await this.prisma.$queryRaw<Array<{ similarity: number }>>`
      SELECT similarity(${text1}, ${text2}) as similarity
    `;

    return result[0]?.similarity || 0;
  }
}
