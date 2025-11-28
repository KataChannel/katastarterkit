const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const products = await prisma.product.findMany({
      where: {
        thumbnail: { contains: 'storage.rausachtrangia.com/rausach-uploads/products/' }
      },
      select: {
        id: true,
        name: true,
        thumbnail: true
      },
      take: 15
    });
    
    console.log('📦 Sample Updated Products with MinIO Images:');
    console.log('Total found:', products.length);
    console.log('');
    products.forEach((p, i) => {
      console.log(`${i+1}. ${p.name}`);
      console.log(`   ID: ${p.id}`);
      console.log(`   Thumbnail: ${p.thumbnail}`);
      console.log('');
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
