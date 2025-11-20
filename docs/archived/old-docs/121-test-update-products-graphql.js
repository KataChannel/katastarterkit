const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testUpdateProductsGraphQL() {
  console.log('🧪 Testing updateProductsFromDetails GraphQL mutation\n');

  try {
    // Kiểm tra dữ liệu nguồn
    const detailCount = await prisma.ext_detailhoadon.count();
    console.log(`📊 Total records in ext_detailhoadon: ${detailCount}`);

    const sampleDetails = await prisma.ext_detailhoadon.findMany({
      take: 5,
      select: {
        id: true,
        ten: true,
      },
    });

    console.log('\n📝 Sample products from ext_detailhoadon:');
    sampleDetails.forEach((detail, index) => {
      console.log(`  ${index + 1}. ${detail.ten} (ID: ${detail.id})`);
    });

    // Kiểm tra dữ liệu đích
    const productCount = await prisma.ext_sanphamhoadon.count();
    console.log(`\n📦 Total products in ext_sanphamhoadon: ${productCount}`);

    console.log('\n✅ GraphQL endpoint ready at: http://localhost:14000/graphql');
    console.log('🔐 Note: Mutation requires authentication');
    console.log('\n📋 To test via GraphQL Playground:');
    console.log('   1. Open http://localhost:14000/graphql');
    console.log('   2. Add Authorization header: Bearer <your-token>');
    console.log('   3. Run mutation:');
    console.log(`
mutation {
  updateProductsFromDetails(dryRun: true, limit: 10) {
    success
    message
    stats {
      totalDetails
      processed
      created
      updated
      skipped
      errors
    }
  }
}
    `);

    console.log('\n🌐 Or test via frontend:');
    console.log('   1. Open http://localhost:13000/ketoan/sanpham');
    console.log('   2. Login as admin');
    console.log('   3. Click "Cập nhật SP" button');
    console.log('   4. Select preview/update mode');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUpdateProductsGraphQL();
