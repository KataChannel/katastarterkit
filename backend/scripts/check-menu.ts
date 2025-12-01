import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Find header menu items with title containing 'Sản Phẩm'
  const menus = await prisma.menu.findMany({
    where: {
      type: 'HEADER',
      OR: [
        { title: { contains: 'Sản Phẩm', mode: 'insensitive' } },
        { title: { contains: 'San Pham', mode: 'insensitive' } },
        { slug: { contains: 'san-pham' } },
      ]
    },
    select: {
      id: true,
      title: true,
      slug: true,
      linkType: true,
      type: true,
    }
  });
  
  console.log('Found product menus:', JSON.stringify(menus, null, 2));
  
  // Show all header menus
  const allHeaderMenus = await prisma.menu.findMany({
    where: { type: 'HEADER', level: { in: [0, 1] } },
    select: { id: true, title: true, linkType: true, order: true },
    orderBy: { order: 'asc' }
  });
  
  console.log('\nAll header menus:', JSON.stringify(allHeaderMenus, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
