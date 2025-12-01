#!/usr/bin/env bun
/**
 * Script cập nhật cấu trúc danh mục và phân bổ sản phẩm cho rausach
 * 
 * - Tạo danh mục thiếu
 * - Phân bổ sản phẩm vào danh mục phù hợp dựa trên tên
 * - Cải thiện mapping hình ảnh
 * 
 * Usage: cd backend && bun run scripts/update-rausach-categories.ts
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Load environment
const envPath = path.join(__dirname, '../../env/.env.prod.rausach');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// Force rausach database
process.env.DATABASE_URL = 'postgresql://postgres:postgres@116.118.49.243:12003/rausachcore';

// Cấu trúc danh mục từ website với từ khóa để phân loại sản phẩm
const CATEGORY_RULES = [
  {
    name: 'CÁC LOẠI CỦ',
    slug: 'cac-loai-cu',
    displayOrder: 1,
    keywords: [
      'củ gừng', 'gừng', 'hành tím', 'củ nghệ', 'nghệ', 'củ cải', 'radish', 'cà rốt', 'carrot',
      'củ dền', 'củ sắn', 'sắn', 'khoai môn', 'khoai lang', 'khoai tây', 'su hào', 'tỏi củ', 'tỏi',
      'khoai sọ', 'riềng', 'đậu phộng', 'lạc', 'khoai từ', 'củ năng', 'năng tươi', 'hành củ',
      'củ sen', 'ngó sen', 'hạt sen', 'sen tươi',
    ],
  },
  {
    name: 'CÁC LOẠI QUẢ',
    slug: 'cac-loai-qua',
    displayOrder: 2,
    keywords: [
      'bầu xanh', 'bầu', 'dưa leo', 'cà chua', 'bí nụ', 'bí nhật', 'bí ngòi', 'bí đỏ', 'bí đao',
      'khổ qua', 'mướp đắng', 'mướp', 'cà tím', 'cà pháo', 'đậu bắp', 'đậu ve', 'đậu cô ve',
      'đậu đũa', 'đậu hà lan', 'đậu que', 'đậu ngự', 'đậu hủ', 'dưa gang', 'dưa hường',
      'bắp ngô', 'bắp mỹ', 'bắp nếp', 'bắp non', 'ngô', 'su su', 'đậu đỏ', 'đậu trắng',
      'đậu xanh', 'đậu bo', 'đậu cove', 'đậu tương', 'đậu nành', 'đậu ván', 'đọt bí',
      'bí hồ lô', 'bí xanh', 'bí vàng',
    ],
  },
  {
    name: 'RAU LẤY BÔNG',
    slug: 'rau-lay-bong',
    displayOrder: 3,
    keywords: [
      'bông bí', 'bông cải', 'bông thiên lý', 'thiên lý', 'bông điên điển', 'điên điển',
      'bông atiso', 'atiso', 'artichoke', 'bông sò', 'bông súng', 'súng',
    ],
  },
  {
    name: 'CÁC LOẠI XÀ LÁCH',
    slug: 'cac-loai-xa-lach',
    displayOrder: 4,
    keywords: [
      'xà lách', 'lô lô', 'lolo', 'romaine', 'iceberg', 'frisse', 'frisee', 'radichio',
      'rau mầm', 'mầm cải', 'mầm củ cải',
    ],
  },
  {
    name: 'RAU GIA VỊ - RAU SỐNG',
    slug: 'rau-gia-vi-rau-song',
    displayOrder: 5,
    keywords: [
      'diếp cá', 'húng quế', 'húng', 'rau ôm', 'rau om', 'rau răm', 'tía tô', 'ngò gạo', 'ngò rí',
      'ngò om', 'hành lá', 'kinh giới', 'lá lốt', 'lá chanh', 'lá dứa', 'rau mùi', 'mùi tàu',
      'ngải cứu', 'é trắng', 'é đỏ', 'quế', 'bạc hà', 'mint', 'basil', 'thì là', 'hẹ', 'tỏi tây',
      'cần tàu', 'ngò', 'gia vị', 'sả', 'lá mơ', 'lá giang', 'lá quế',
    ],
  },
  {
    name: 'CÁC LOẠI ỚT',
    slug: 'cac-loai-ot',
    displayOrder: 6,
    keywords: [
      'ớt sừng', 'ớt xanh', 'ớt vàng', 'ớt đỏ', 'ớt batri', 'ớt hiểm', 'ớt chỉ thiên',
      'ớt chuông', 'bell pepper', 'paprika', 'ớt',
    ],
  },
  {
    name: 'CÁC LOẠI RAU CẢI',
    slug: 'cac-loai-rau-cai',
    displayOrder: 7,
    keywords: [
      'cải ngọt', 'cải bó xôi', 'bó xôi', 'spinach', 'cải thìa', 'cải bẹ', 'bắp cải', 'cải thảo',
      'cải kale', 'kale', 'cải xanh', 'cải ngồng', 'cải chip', 'cải chíp', 'cải dưa', 'cải bắc thảo',
      'cải canh', 'cải tím', 'cải trái tim', 'cải củ',
    ],
  },
  {
    name: 'RAU ĂN THÂN - LÁ',
    slug: 'rau-an-than-la',
    displayOrder: 8,
    keywords: [
      'rau bù ngót', 'bù ngót', 'rau muống', 'muống', 'rau dền', 'mồng tơi', 'nha đam', 'lô hội',
      'cần tây', 'celery', 'măng tây', 'asparagus', 'tau hũ ky', 'rau nhút', 'rau lang', 'rau mướp',
      'rau đắng', 'rau sam', 'rau má', 'bồ ngót', 'rau câu', 'tàu hũ', 'giá', 'giá tươi', 'giá đỗ',
      'cần nước', 'cần cạn', 'ngó sen', 'đọt', 'rau rừng',
    ],
  },
  {
    name: 'CÁC LOẠI NẤM',
    slug: 'cac-loai-nam',
    displayOrder: 9,
    keywords: [
      'nấm bào ngư', 'nấm mèo', 'nấm rơm', 'nấm đông cô', 'nấm kim châm', 'nấm linh chi',
      'nấm hương', 'nấm sò', 'nấm', 'mộc nhĩ',
    ],
  },
  {
    name: 'TRÁI CÂY CÁC LOẠI',
    slug: 'trai-cay-cac-loai',
    displayOrder: 10,
    keywords: [
      'xoài', 'táo', 'thơm', 'dứa', 'chanh', 'bưởi', 'cam', 'quýt', 'chuối', 'dưa hấu',
      'ổi', 'thanh long', 'đu đủ', 'mít', 'sầu riêng', 'chôm chôm', 'vải', 'nhãn', 'măng cụt',
      'kiwi', 'nho', 'lê', 'đào', 'mận', 'cherry', 'dâu tây', 'việt quất', 'bơ', 'avocado',
      'trái cây', 'hoa quả', 'sapoche', 'vú sữa', 'khế', 'dừa', 'me', 'mãng cầu',
    ],
  },
  {
    name: 'THỰC PHẨM CHẾ BIẾN',
    slug: 'thuc-pham-che-bien',
    displayOrder: 11,
    keywords: [
      'kim chi', 'kimchi', 'dưa muối', 'cà muối', 'tương', 'nước mắm', 'nước tương',
      'mắm', 'chả', 'nem', 'giò', 'bánh', 'bún', 'phở', 'mì', 'miến', 'nui', 'pasta',
      'tàu hũ ky', 'đậu phụ', 'chả giò', 'chả lụa', 'chế biến', 'xúc xích', 'lạp xưởng',
      'trứng', 'sữa', 'pho mát', 'cheese', 'bơ thực vật', 'sa tế', 'chao', 'mè',
      'hột vịt', 'trứng gà', 'trứng cút', 'tàu hủ', 'đậu hủ ky',
    ],
  },
  {
    name: 'ĐẶC SẢN - RAU RỪNG',
    slug: 'dac-san-rau-rung',
    displayOrder: 12,
    keywords: [
      'sao nhái', 'rau rừng', 'lá cóc', 'quế vị', 'lá trâm ổi', 'trâm ổi', 'đặc sản',
      'rau rừng gia lai', 'rau rừng tây ninh', 'lá giang', 'măng', 'lá mơ', 'lá bép',
    ],
  },
];

// Manual image to product name mapping for special cases
const MANUAL_IMAGE_MAPPING: { [key: string]: string | null } = {
  'chuoi-gia-chin': 'chuối già',
  'hoa-decor-hoa-an-duoc': null, // không phải sản phẩm
  'rau-sach-baby-carrot': 'baby carrot',
  'rau-sach-bap-non-baby': 'bắp non baby',
  'rau-sach-bong-atiso': 'atiso',
  'rau-sach-khoai-tay-dalat': 'khoai tây',
  'rau-sach-kinh-gioi': 'kinh giới',
  'rau-sach-la-ca-ri-curry-leaf': 'lá cà ri',
  'rau-sach-cu-nghe': 'nghệ',
  'rau-sach-tia-to': 'tía tô',
  'rau-sach-xa-lach-cai-beo': 'cải bèo',
  'rau-sach-ot-batri': 'ớt batri',
  'rau-sach-ot-do-da-lat': 'ớt đỏ',
  'rau-sach-ot-vang-da-lat': 'ớt vàng',
  'rau-sach-ot-xanh-da-lat': 'ớt xanh',
  'rau-sach-qua-khe': 'khế',
  'rau-sach-cai-ngong': 'cải ngồng',
  'rau-sach-radish-cu-cai-do': 'củ cải đỏ',
  'rau-sach-rau-lang': 'rau lang',
  'rau-sach-rau-om': 'rau om',
  'rau-sach-hat-sen-hue': 'hạt sen',
  'rau-sach-xa-lach-frisse': 'frisse',
  'rau-sach-xa-lach-lo-lo-tim': 'lô lô tím',
  'rau-sach-xa-lach-lo-lo-xanh': 'lô lô xanh',
  'rau-sach-xa-lach-mo': 'xà lách mỡ',
  'rau-sach-xa-lach-xoong-dalat': 'xà lách xoong',
};

// Vietnamese diacritics mapping
const VIETNAMESE_MAP: { [key: string]: string } = {
  'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
  'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
  'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
  'đ': 'd', 'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
  'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
  'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
  'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
  'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
  'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
  'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
  'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
  'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
};

function slugify(text: string): string {
  let result = text.split('').map(c => VIETNAMESE_MAP[c] || VIETNAMESE_MAP[c.toLowerCase()] || c).join('');
  result = result.toLowerCase();
  result = result.replace(/[^\w\s-]/g, '');
  result = result.replace(/[-\s]+/g, '-');
  return result.trim().replace(/^-+|-+$/g, '');
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/^rau sạch\s*-?\s*/i, '')
    .replace(/^rau sach\s*-?\s*/i, '')
    .replace(/^rau\s+/i, '')
    .trim();
}

// Find best matching category for a product
function findCategoryForProduct(productName: string): typeof CATEGORY_RULES[0] | null {
  const normalized = normalizeText(productName);
  
  // Check each category's keywords
  for (const category of CATEGORY_RULES) {
    for (const keyword of category.keywords) {
      if (normalized.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }
  
  return null;
}

async function main() {
  console.log('═'.repeat(70));
  console.log('🔄 CẬP NHẬT CẤU TRÚC DANH MỤC VÀ SẢN PHẨM CHO RAUSACH');
  console.log('═'.repeat(70));
  
  const prisma = new PrismaClient();
  
  try {
    // BƯỚC 1: Tạo/cập nhật danh mục
    console.log('\n📁 BƯỚC 1: TẠO/CẬP NHẬT DANH MỤC');
    console.log('-'.repeat(70));
    
    const categoryMap = new Map<string, string>(); // slug -> id
    
    for (const cat of CATEGORY_RULES) {
      const existing = await prisma.category.findFirst({
        where: {
          OR: [
            { slug: cat.slug },
            { name: cat.name },
          ],
        },
      });
      
      if (existing) {
        // Update existing
        await prisma.category.update({
          where: { id: existing.id },
          data: {
            name: cat.name,
            slug: cat.slug,
            displayOrder: cat.displayOrder,
            isActive: true,
            isFeatured: true,
          },
        });
        categoryMap.set(cat.slug, existing.id);
        console.log(`✅ Cập nhật: ${cat.name}`);
      } else {
        // Create new
        const newCat = await prisma.category.create({
          data: {
            name: cat.name,
            slug: cat.slug,
            displayOrder: cat.displayOrder,
            isActive: true,
            isFeatured: true,
          },
        });
        categoryMap.set(cat.slug, newCat.id);
        console.log(`🆕 Tạo mới: ${cat.name}`);
      }
    }
    
    // BƯỚC 2: Phân bổ sản phẩm vào danh mục
    console.log('\n📦 BƯỚC 2: PHÂN BỔ SẢN PHẨM VÀO DANH MỤC');
    console.log('-'.repeat(70));
    
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        categoryId: true,
        category: { select: { name: true, slug: true } },
      },
    });
    
    console.log(`Tổng sản phẩm: ${products.length}`);
    
    let categorizedCount = 0;
    let uncategorizedProducts: string[] = [];
    const categoryCounts: { [key: string]: number } = {};
    
    for (const product of products) {
      const matchedRule = findCategoryForProduct(product.name);
      
      if (matchedRule) {
        const newCategoryId = categoryMap.get(matchedRule.slug);
        
        if (newCategoryId && product.category?.slug !== matchedRule.slug) {
          await prisma.product.update({
            where: { id: product.id },
            data: { categoryId: newCategoryId },
          });
          categorizedCount++;
          categoryCounts[matchedRule.name] = (categoryCounts[matchedRule.name] || 0) + 1;
        }
      } else {
        uncategorizedProducts.push(product.name);
      }
    }
    
    console.log(`\n📊 Kết quả phân bổ:`);
    for (const [catName, count] of Object.entries(categoryCounts)) {
      console.log(`   ${catName}: ${count} sản phẩm`);
    }
    console.log(`\nĐã phân bổ: ${categorizedCount} sản phẩm`);
    
    if (uncategorizedProducts.length > 0) {
      console.log(`\n⚠️  Sản phẩm chưa phân loại được (${uncategorizedProducts.length}):`);
      uncategorizedProducts.slice(0, 20).forEach(p => console.log(`   - ${p}`));
      if (uncategorizedProducts.length > 20) {
        console.log(`   ... và ${uncategorizedProducts.length - 20} sản phẩm khác`);
      }
    }
    
    // BƯỚC 3: Cải thiện mapping hình ảnh
    console.log('\n\n🖼️ BƯỚC 3: CẢI THIỆN MAPPING HÌNH ẢNH');
    console.log('-'.repeat(70));
    
    let imageUpdatedCount = 0;
    const MINIO_PUBLIC_URL = 'https://storage.rausachtrangia.com';
    const MINIO_BUCKET = 'rausach-uploads';
    
    for (const [imageSlug, targetKeyword] of Object.entries(MANUAL_IMAGE_MAPPING)) {
      if (!targetKeyword) continue; // Skip null mappings
      
      // Find product matching the keyword
      const matchedProduct = await prisma.product.findFirst({
        where: {
          name: { contains: targetKeyword, mode: 'insensitive' },
          thumbnail: null,
        },
      });
      
      if (matchedProduct) {
        // Determine image extension
        const imageFile = `${imageSlug}.jpg`;
        const publicUrl = `${MINIO_PUBLIC_URL}/${MINIO_BUCKET}/products/${imageFile}`;
        
        await prisma.product.update({
          where: { id: matchedProduct.id },
          data: { thumbnail: publicUrl },
        });
        
        imageUpdatedCount++;
        console.log(`✅ ${matchedProduct.name} → ${imageFile}`);
      }
    }
    
    console.log(`\nĐã cập nhật thêm: ${imageUpdatedCount} hình ảnh`);
    
    // BƯỚC 4: Thống kê cuối cùng
    console.log('\n\n📊 THỐNG KÊ CUỐI CÙNG');
    console.log('-'.repeat(70));
    
    const finalCategories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { displayOrder: 'asc' },
    });
    
    console.log('\nDanh mục và số sản phẩm:');
    let totalProducts = 0;
    for (const cat of finalCategories) {
      console.log(`   ${cat.name}: ${cat._count.products}`);
      totalProducts += cat._count.products;
    }
    
    const productsWithImages = await prisma.product.count({
      where: { thumbnail: { not: null } },
    });
    
    const productsWithoutImages = await prisma.product.count({
      where: { thumbnail: null },
    });
    
    console.log(`\nTổng sản phẩm: ${totalProducts}`);
    console.log(`Có hình ảnh: ${productsWithImages}`);
    console.log(`Chưa có hình: ${productsWithoutImages}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
  
  console.log('\n✅ Hoàn thành!');
}

main().catch(console.error);
