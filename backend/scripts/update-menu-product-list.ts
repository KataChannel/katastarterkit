import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const menuId = 'adb5b0fc-e0a4-4bdb-98da-cb8249d71bbd';
  
  // Update linkType to PRODUCT_LIST
  const updated = await prisma.menu.update({
    where: { id: menuId },
    data: { 
      linkType: 'PRODUCT_LIST',
      route: '/san-pham', // Also set route for fallback
    },
    select: {
      id: true,
      title: true,
      slug: true,
      linkType: true,
      route: true,
    }
  });
  
  console.log('✅ Updated menu "Sản Phẩm" to PRODUCT_LIST:');
  console.log(JSON.stringify(updated, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
