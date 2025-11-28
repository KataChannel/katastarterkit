const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyUpload() {
  try {
    console.log('🔍 Verifying Image Upload Results...\n');
    
    // Count total products
    const totalProducts = await prisma.product.count();
    console.log(`📊 Total Products in Database: ${totalProducts}`);
    
    // Count products with MinIO images
    const productsWithMinioImages = await prisma.product.count({
      where: {
        thumbnail: { contains: 'storage.rausachtrangia.com/rausach-uploads/products/' }
      }
    });
    console.log(`✅ Products with MinIO Images: ${productsWithMinioImages}`);
    
    // Count products with old images
    const productsWithOldImages = await prisma.product.count({
      where: {
        OR: [
          { thumbnail: { contains: 'rausachtrangia.com/upload/' } },
          { thumbnail: { contains: 'rausachtrangia.com/quanly/' } }
        ]
      }
    });
    console.log(`📸 Products with Old Images: ${productsWithOldImages}`);
    
    // Count products without images
    const productsWithoutImages = await prisma.product.count({
      where: {
        OR: [
          { thumbnail: null },
          { thumbnail: '' }
        ]
      }
    });
    console.log(`⚠️  Products without Images: ${productsWithoutImages}`);
    
    console.log('\n📋 Image Sources Breakdown:');
    console.log(`   MinIO (New):        ${productsWithMinioImages} (${(productsWithMinioImages/totalProducts*100).toFixed(1)}%)`);
    console.log(`   Old Server:         ${productsWithOldImages} (${(productsWithOldImages/totalProducts*100).toFixed(1)}%)`);
    console.log(`   No Image:           ${productsWithoutImages} (${(productsWithoutImages/totalProducts*100).toFixed(1)}%)`);
    
    // Sample products with MinIO images
    console.log('\n📦 Sample Products with MinIO Images:');
    const samples = await prisma.product.findMany({
      where: {
        thumbnail: { contains: 'storage.rausachtrangia.com/rausach-uploads/products/' }
      },
      select: {
        name: true,
        thumbnail: true
      },
      take: 5
    });
    
    samples.forEach((p, i) => {
      console.log(`   ${i+1}. ${p.name}`);
      console.log(`      ${p.thumbnail?.substring(0, 80)}...`);
    });
    
    console.log('\n✅ Verification Complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyUpload();
