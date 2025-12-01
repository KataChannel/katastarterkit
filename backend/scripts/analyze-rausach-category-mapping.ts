#!/usr/bin/env bun
/**
 * Script phân tích và điều chỉnh cấu trúc danh mục sản phẩm cho rausach
 * 
 * So sánh cấu trúc từ website rausachtrangia.com với database hiện tại
 * Phân tích mapping hình ảnh với sản phẩm
 * 
 * Usage: cd backend && bun run scripts/analyze-rausach-category-mapping.ts
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

// Cấu trúc danh mục từ website rausachtrangia.com
// (Crawled from homepage)
const WEBSITE_CATEGORIES = [
  {
    name: 'CÁC LOẠI CỦ',
    slug: 'cac-loai-cu',
    url: 'https://rausachtrangia.com/san-pham/cac-loai-cu.html',
    order: 1,
    products: [
      'RAU SẠCH - CỦ GỪNG',
      'RAU SẠCH - HÀNH TÍM CỦ',
      'RAU SẠCH - CỦ NGHỆ',
      'RAU SẠCH - RADISH - CỦ CẢI ĐỎ',
      'RAU SẠCH - BABY CARROT',
      'RAU SẠCH - CÀ RỐT ĐÀ LẠT',
      'RAU SẠCH - CỦ DỀN',
      'RAU SẠCH - CỦ CẢI TRẮNG',
      'RAU SẠCH - CỦ SẮN',
      'RAU SẠCH - KHOAI MÔN',
      'RAU SẠCH - KHOAI LANG',
      'RAU SẠCH - KHOAI TÂY',
      'RAU SẠCH - SU HÀO',
      'RAU SẠCH - TỎI CỦ',
    ],
  },
  {
    name: 'CÁC LOẠI QUẢ',
    slug: 'cac-loai-qua',
    url: 'https://rausachtrangia.com/san-pham/cac-loai-qua.html',
    order: 2,
    products: [
      'RAU SẠCH - BẦU XANH',
      'RAU SẠCH - DƯA LEO',
      'RAU SẠCH - CÀ CHUA',
      'RAU SẠCH - BÍ NỤ',
      'RAU SẠCH - BÍ NHẬT',
      'RAU SẠCH - BÍ NGÒI XANH',
      'RAU SẠCH - BÍ NGÒI VÀNG',
      'RAU SẠCH - BÍ ĐỎ TRÒN',
      'RAU SẠCH - KHỔM QUA',
      'RAU SẠCH - MƯỚP ĐẮNG',
      'RAU SẠCH - MƯỚP',
      'RAU SẠCH - CÀ TÍM',
      'RAU SẠCH - ĐẬU BẮP',
      'RAU SẠCH - ĐẬU VE',
      'RAU SẠCH - ĐẬU CÔ VE',
    ],
  },
  {
    name: 'RAU LẤY BÔNG',
    slug: 'rau-lay-bong',
    url: 'https://rausachtrangia.com/san-pham/rau-lay-bong.html',
    order: 3,
    products: [
      'RAU SẠCH - BÔNG BÍ',
      'RAU SẠCH - BÔNG CẢI TRẮNG',
      'RAU SẠCH - BÔNG CẢI XANH',
      'RAU SẠCH - BÔNG THIÊN LÝ',
      'RAU SẠCH - BÔNG ĐIÊN ĐIỂN',
      'RAU SẠCH - BÔNG ATISO',
      'RAU SẠCH - BÔNG SÒ ĐƯA',
      'RAU SẠCH - BÔNG SÚNG',
    ],
  },
  {
    name: 'CÁC LOẠI XÀ LÁCH',
    slug: 'cac-loai-xa-lach',
    url: 'https://rausachtrangia.com/san-pham/cac-loai-xa-lach.html',
    order: 4,
    products: [
      'RAU SẠCH - XÀ LÁCH LO LO XANH',
      'RAU SẠCH - XÀ LÁCH LÔ LÔ TÍM',
      'RAU SẠCH - XÀ LÁCH - CẢI BÈO',
      'RAU SẠCH - XÀ LÁCH FRISSE',
      'RAU SẠCH - XÀ LÁCH RADICHIO',
      'RAU SẠCH - XÀ LÁCH ĐÀ LẠT',
      'RAU SẠCH - XÀ LÁCH ROMAINE',
      'RAU SẠCH - XÀ LÁCH ICEBERG',
    ],
  },
  {
    name: 'RAU GIA VỊ - RAU SỐNG',
    slug: 'rau-gia-vi-rau-song',
    url: 'https://rausachtrangia.com/san-pham/rau-gia-vi-rau-song.html',
    order: 5,
    products: [
      'RAU SẠCH - RAU DIẾP CÁ',
      'RAU SẠCH - HÚNG QUẾ',
      'RAU SẠCH - RAU ÔM',
      'RAU SẠCH - RAU RĂM',
      'RAU SẠCH - TÍA TÔ',
      'RAU SẠCH - NGÒ GẠO',
      'RAU SẠCH - NGÒ RÍ',
      'RAU SẠCH - HÀNH LÁ',
      'RAU SẠCH - SẢ',
      'RAU SẠCH - LÁ LỘT',
      'RAU SẠCH - LÁ CHANH',
    ],
  },
  {
    name: 'CÁC LOẠI ỚT',
    slug: 'cac-loai-ot',
    url: 'https://rausachtrangia.com/san-pham/cac-loai-ot.html',
    order: 6,
    products: [
      'RAU SẠCH - ỚT SỪNG',
      'RAU SẠCH - ỚT XANH ĐÀ LẠT',
      'RAU SẠCH - ỚT VÀNG ĐÀ LẠT',
      'RAU SẠCH - ỚT BATRI',
      'RAU SẠCH - ỚT HIỂM ĐỎ',
      'RAU SẠCH - ỚT HIỂM XANH',
      'RAU SẠCH - ỚT CHỈ THIÊN',
    ],
  },
  {
    name: 'CÁC LOẠI RAU CẢI',
    slug: 'cac-loai-rau-cai',
    url: 'https://rausachtrangia.com/san-pham/cac-loai-rau-cai.html',
    order: 7,
    products: [
      'RAU SẠCH - CẢI NGỌT',
      'RAU SẠCH - CẢI BÓ XÔI',
      'RAU SẠCH - CẢI THÌA',
      'RAU SẠCH - CẢI BẸ XANH',
      'RAU SẠCH - BẮP CẢI TÍM',
      'RAU SẠCH - BẮP CẢI TRẮNG',
      'RAU SẠCH - CẢI THẢO',
      'RAU SẠCH - CẢI KALE',
      'RAU SẠCH - CẢI NGỌT NHÍ',
    ],
  },
  {
    name: 'RAU ĂN THÂN - LÁ',
    slug: 'rau-an-than-la',
    url: 'https://rausachtrangia.com/san-pham/rau-an-than-la.html',
    order: 8,
    products: [
      'RAU SẠCH - RAU BÙ NGÓT',
      'RAU SẠCH - RAU MUỐNG',
      'RAU SẠCH - RAU DỀN',
      'RAU SẠCH - MỒNG TƠI',
      'RAU SẠCH - NHA ĐAM',
      'RAU SẠCH - CẦN TÂY',
      'RAU SẠCH - CẦN TÂY BABY',
      'RAU SẠCH - MĂNG TÂY',
      'RAU SẠCH - TAU HŨ KY',
    ],
  },
  {
    name: 'CÁC LOẠI NẤM',
    slug: 'cac-loai-nam',
    url: 'https://rausachtrangia.com/san-pham/cac-loai-nam.html',
    order: 9,
    products: [
      'RAU SẠCH - NẤM BÀO NGƯ TRẮNG',
      'RAU SẠCH - NẤM MÈO',
      'RAU SẠCH - NẤM RƠM',
      'RAU SẠCH - NẤM BÀO NGƯ XÁM',
      'RAU SẠCH - NẤM ĐÔNG CÔ',
      'RAU SẠCH - NẤM KIM CHÂM',
      'RAU SẠCH - NẤM LINH CHI',
      'RAU SẠCH - NẤM HƯƠNG',
    ],
  },
  {
    name: 'TRÁI CÂY CÁC LOẠI',
    slug: 'trai-cay-cac-loai',
    url: 'https://rausachtrangia.com/san-pham/trai-cay-cac-loai.html',
    order: 10,
    products: [
      'RAU SẠCH - XOÀI THÁI',
      'RAU SẠCH - TÁO XANH VN',
      'RAU SẠCH - THƠM TRÁI',
      'RAU SẠCH - CHANH KHÔNG HẠT',
      'RAU SẠCH - CHANH VÀNG',
      'RAU SẠCH - BƯỞI 5 ROI',
      'RAU SẠCH - BÒ TRÁI',
      'CHUỐI SU',
      'CHUỐI GIÀ CHIN',
      'CAM TƯƠI',
      'DƯA HẤU',
      'BƯỞI DA XANH',
    ],
  },
  {
    name: 'THỰC PHẨM CHẾ BIẾN',
    slug: 'thuc-pham-che-bien',
    url: 'https://rausachtrangia.com/san-pham/thuc-pham-che-bien.html',
    order: 11,
    products: [
      'KIM CHI CẢI THẢO',
      'KIM CHI SU HÀO',
      'KIM CHI CỦ CẢI',
      'KIM CHI HÀNH HƯƠNG',
    ],
  },
  {
    name: 'ĐẶC SẢN - RAU RỪNG',
    slug: 'dac-san-rau-rung',
    url: 'https://rausachtrangia.com/san-pham/dac-san-rau-rung.html',
    order: 12,
    products: [
      'RAU SẠCH - SAO NHÁI',
      'RAU SẠCH - RAU RỪNG GIA LAI',
      'RAU RỪNG TÂY NINH - LÁ CÓC',
      'RAU RỪNG TÂY NINH - QUẾ VỊ',
      'RAU RỪNG TÂY NINH - LÁ TRÂM ỔI',
      'RAU RỪNG TÂY NINH - CÁC LOẠI',
    ],
  },
];

// Vietnamese diacritics mapping for slug matching
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

// Normalize product name for comparison
function normalizeProductName(name: string): string {
  return name
    .toUpperCase()
    .replace(/^RAU SẠCH\s*-?\s*/i, '')
    .replace(/^RAU SACH\s*-?\s*/i, '')
    .replace(/^RAU RỪNG\s*-?\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function main() {
  console.log('═'.repeat(70));
  console.log('📊 PHÂN TÍCH CẤU TRÚC DANH MỤC VÀ SẢN PHẨM CHO RAUSACH');
  console.log('═'.repeat(70));
  
  const prisma = new PrismaClient();
  
  try {
    // 1. Lấy danh mục từ database
    console.log('\n📁 1. DANH MỤC TRONG DATABASE:');
    console.log('-'.repeat(70));
    
    const dbCategories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { displayOrder: 'asc' },
    });
    
    console.log(`Tổng số danh mục: ${dbCategories.length}\n`);
    
    for (const cat of dbCategories) {
      const status = cat.isActive ? '✅' : '❌';
      const featured = cat.isFeatured ? '⭐' : '  ';
      console.log(`${status} ${featured} [${cat.displayOrder}] ${cat.name}`);
      console.log(`      Slug: ${cat.slug}`);
      console.log(`      Sản phẩm: ${cat._count.products}`);
    }
    
    // 2. Lấy sản phẩm từ database
    console.log('\n\n📦 2. SẢN PHẨM TRONG DATABASE:');
    console.log('-'.repeat(70));
    
    const dbProducts = await prisma.product.findMany({
      include: {
        category: { select: { name: true, slug: true } },
      },
      orderBy: [
        { category: { displayOrder: 'asc' } },
        { displayOrder: 'asc' },
        { name: 'asc' },
      ],
    });
    
    console.log(`Tổng số sản phẩm: ${dbProducts.length}`);
    
    // Group by category
    const productsByCategory = new Map<string, typeof dbProducts>();
    for (const product of dbProducts) {
      const catName = product.category?.name || 'Không có danh mục';
      if (!productsByCategory.has(catName)) {
        productsByCategory.set(catName, []);
      }
      productsByCategory.get(catName)!.push(product);
    }
    
    console.log(`\nSản phẩm theo danh mục:`);
    for (const [catName, products] of productsByCategory) {
      console.log(`\n  📁 ${catName} (${products.length} sp):`);
      products.slice(0, 5).forEach(p => {
        const hasImg = p.thumbnail ? '🖼️' : '❌';
        console.log(`      ${hasImg} ${p.name}`);
      });
      if (products.length > 5) {
        console.log(`      ... và ${products.length - 5} sản phẩm khác`);
      }
    }
    
    // 3. So sánh với cấu trúc website
    console.log('\n\n🔄 3. SO SÁNH VỚI CẤU TRÚC WEBSITE:');
    console.log('-'.repeat(70));
    
    const dbCategoryMap = new Map(dbCategories.map(c => [c.slug.toLowerCase(), c]));
    const dbCategoryNameMap = new Map(dbCategories.map(c => [slugify(c.name), c]));
    
    const matchedCategories: string[] = [];
    const missingCategories: typeof WEBSITE_CATEGORIES = [];
    
    for (const webCat of WEBSITE_CATEGORIES) {
      const dbCat = dbCategoryMap.get(webCat.slug) || dbCategoryNameMap.get(webCat.slug);
      if (dbCat) {
        matchedCategories.push(webCat.name);
        console.log(`✅ ${webCat.name} → ${dbCat.name} (${dbCat.slug})`);
      } else {
        missingCategories.push(webCat);
        console.log(`❌ ${webCat.name} → KHÔNG TÌM THẤY`);
      }
    }
    
    // 4. Phân tích hình ảnh đã crawl
    console.log('\n\n🖼️ 4. PHÂN TÍCH MAPPING HÌNH ẢNH:');
    console.log('-'.repeat(70));
    
    const CRAWL_IMAGES_DIR = path.join(__dirname, '../../crawl-rausach/images');
    
    if (!fs.existsSync(CRAWL_IMAGES_DIR)) {
      console.log('⚠️  Thư mục crawl-rausach/images không tồn tại!');
    } else {
      const imageFiles = fs.readdirSync(CRAWL_IMAGES_DIR).filter(f => 
        /\.(jpg|jpeg|png|gif|webp)$/i.test(f)
      );
      
      console.log(`Tổng số hình đã crawl: ${imageFiles.length}`);
      
      // Build product lookup
      const productSlugMap = new Map<string, typeof dbProducts[0]>();
      for (const product of dbProducts) {
        productSlugMap.set(product.slug.toLowerCase(), product);
        productSlugMap.set(slugify(product.name), product);
        
        // Normalize variations
        const normalized = normalizeProductName(product.name);
        productSlugMap.set(slugify(normalized), product);
        
        // Without prefix
        if (product.slug.startsWith('rau-sach-')) {
          productSlugMap.set(product.slug.replace('rau-sach-', ''), product);
        }
      }
      
      let matchedImages = 0;
      let unmatchedImages: string[] = [];
      const imageToProduct: Map<string, string> = new Map();
      
      for (const imageFile of imageFiles) {
        const imageSlug = imageFile.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '').toLowerCase();
        
        let matched = productSlugMap.get(imageSlug);
        
        // Try variations
        if (!matched) matched = productSlugMap.get(`rau-sach-${imageSlug}`);
        if (!matched) matched = productSlugMap.get(imageSlug.replace('rau-sach-', ''));
        if (!matched) matched = productSlugMap.get(imageSlug.replace('rau-rung-tay-ninh-', ''));
        
        // Fuzzy match
        if (!matched) {
          for (const [slug, product] of productSlugMap) {
            if (slug.includes(imageSlug) || imageSlug.includes(slug)) {
              matched = product;
              break;
            }
          }
        }
        
        if (matched) {
          matchedImages++;
          imageToProduct.set(imageFile, matched.name);
        } else {
          unmatchedImages.push(imageFile);
        }
      }
      
      console.log(`Khớp: ${matchedImages}/${imageFiles.length}`);
      console.log(`Không khớp: ${unmatchedImages.length}`);
      
      if (unmatchedImages.length > 0) {
        console.log(`\n⚠️  Hình ảnh không tìm thấy sản phẩm tương ứng:`);
        unmatchedImages.forEach(img => {
          console.log(`   - ${img}`);
        });
      }
      
      // 5. Sản phẩm không có hình ảnh
      console.log('\n\n📷 5. SẢN PHẨM CHƯA CÓ HÌNH ẢNH:');
      console.log('-'.repeat(70));
      
      const productsWithoutImages = dbProducts.filter(p => !p.thumbnail);
      console.log(`Tổng: ${productsWithoutImages.length}/${dbProducts.length}`);
      
      if (productsWithoutImages.length > 0) {
        productsWithoutImages.slice(0, 30).forEach(p => {
          console.log(`   - ${p.name} (${p.slug})`);
        });
        if (productsWithoutImages.length > 30) {
          console.log(`   ... và ${productsWithoutImages.length - 30} sản phẩm khác`);
        }
      }
    }
    
    // 6. Đề xuất cấu trúc danh mục mới
    console.log('\n\n📋 6. ĐỀ XUẤT CẤU TRÚC DANH MỤC MỚI:');
    console.log('-'.repeat(70));
    
    if (missingCategories.length > 0) {
      console.log(`\n🆕 Cần tạo ${missingCategories.length} danh mục mới:\n`);
      for (const cat of missingCategories) {
        console.log(`{`);
        console.log(`  name: '${cat.name}',`);
        console.log(`  slug: '${cat.slug}',`);
        console.log(`  displayOrder: ${cat.order},`);
        console.log(`  isActive: true,`);
        console.log(`  isFeatured: true,`);
        console.log(`}`);
      }
    }
    
    // 7. Kiểm tra slug hình ảnh cần điều chỉnh
    console.log('\n\n🔧 7. MAPPING HÌNH ẢNH CẦN ĐIỀU CHỈNH:');
    console.log('-'.repeat(70));
    
    // Mapping thủ công cho các tên đặc biệt
    const MANUAL_IMAGE_MAPPING: { [key: string]: string } = {
      'rau-sach-ca-rot-da-lat': 'rau-sach-ca-rot',
      'kim-chi-cai-thao': 'kim-chi-cai-thao',
      'kim-chi-su-hao': 'kim-chi-su-hao',
      'kim-chi-cu-cai': 'kim-chi-cu-cai',
      'kim-chi-hanh-huong': 'kim-chi-hanh-huong',
      'rau-rung-tay-ninh-cac-loai': 'rau-rung-tay-ninh',
      'rau-rung-tay-ninh-la-coc': 'la-coc',
      'rau-rung-tay-ninh-la-tram-oi': 'la-tram-oi',
      'rau-rung-tay-ninh-que-vi': 'que-vi',
      'buoi-da-xanh': 'buoi-da-xanh',
      'cam-tuoi': 'cam-tuoi',
      'chuoi-gia-chin': 'chuoi-gia',
      'chuoi-su': 'chuoi-su',
      'dua-hau': 'dua-hau',
    };
    
    console.log('\nMapping thủ công cho tên đặc biệt:');
    for (const [imageSlug, productSlug] of Object.entries(MANUAL_IMAGE_MAPPING)) {
      console.log(`  ${imageSlug} → ${productSlug}`);
    }
    
    // Summary
    console.log('\n\n' + '═'.repeat(70));
    console.log('📊 TÓM TẮT');
    console.log('═'.repeat(70));
    console.log(`Danh mục website:    ${WEBSITE_CATEGORIES.length}`);
    console.log(`Danh mục database:   ${dbCategories.length}`);
    console.log(`Danh mục khớp:       ${matchedCategories.length}`);
    console.log(`Danh mục thiếu:      ${missingCategories.length}`);
    console.log(`Tổng sản phẩm:       ${dbProducts.length}`);
    console.log(`Sản phẩm có hình:    ${dbProducts.filter(p => p.thumbnail).length}`);
    console.log(`Sản phẩm thiếu hình: ${dbProducts.filter(p => !p.thumbnail).length}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
