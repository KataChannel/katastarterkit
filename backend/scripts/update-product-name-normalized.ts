/**
 * Script để cập nhật nameNormalized cho tất cả sản phẩm hiện có
 * Chạy script này sau khi chạy prisma db push hoặc prisma migrate dev
 * 
 * Cách sử dụng:
 * cd backend
 * npx ts-node scripts/update-product-name-normalized.ts
 */

import { PrismaClient } from '@prisma/client';

/**
 * Bảng chuyển đổi tiếng Việt có dấu sang không dấu
 */
const VIETNAMESE_DIACRITICS_MAP: { [key: string]: string } = {
  'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
  'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
  'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
  'đ': 'd',
  'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
  'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
  'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
  'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
  'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
  'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
  'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
  'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
  'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
  'À': 'A', 'Á': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
  'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
  'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
  'Đ': 'D',
  'È': 'E', 'É': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
  'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
  'Ì': 'I', 'Í': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
  'Ò': 'O', 'Ó': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
  'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
  'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
  'Ù': 'U', 'Ú': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
  'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
  'Ỳ': 'Y', 'Ý': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y',
};

/**
 * Chuyển đổi chuỗi tiếng Việt có dấu sang không dấu
 */
function removeVietnameseDiacritics(str: string): string {
  if (!str) return str;
  return str
    .split('')
    .map(char => VIETNAMESE_DIACRITICS_MAP[char] || char)
    .join('');
}

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Bắt đầu cập nhật nameNormalized cho tất cả sản phẩm...');

  // Lấy tất cả sản phẩm
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  console.log(`📦 Tìm thấy ${products.length} sản phẩm`);

  let updated = 0;

  for (const product of products) {
    const normalizedName = removeVietnameseDiacritics(product.name).toLowerCase();
    
    // Cập nhật nameNormalized cho sản phẩm
    await prisma.$executeRaw`UPDATE products SET "nameNormalized" = ${normalizedName} WHERE id = ${product.id}`;
    updated++;
    
    if (updated % 50 === 0) {
      console.log(`✅ Đã cập nhật ${updated}/${products.length} sản phẩm...`);
    }
  }

  console.log(`\n📊 Kết quả:`);
  console.log(`   - Đã cập nhật: ${updated} sản phẩm`);
  console.log(`   - Tổng: ${products.length} sản phẩm`);
  console.log('\n✨ Hoàn tất!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
