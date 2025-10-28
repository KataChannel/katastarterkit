const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugXuatNhapTon() {
  console.log('🔍 Debugging Xuất Nhập Tồn Data\n');

  try {
    // Test MST
    const testMST = '5900363291';
    
    // 1. Check invoices
    const invoices = await prisma.ext_listhoadon.findMany({
      take: 5,
      select: {
        id: true,
        shdon: true,
        nbmst: true,
        nmmst: true,
        tdlap: true,
      },
    });
    
    console.log('📋 Sample invoices:');
    invoices.forEach((inv, idx) => {
      console.log(`  ${idx + 1}. Invoice #${inv.shdon}`);
      console.log(`     - nbmst (seller): ${inv.nbmst}`);
      console.log(`     - nmmst (buyer): ${inv.nmmst}`);
      console.log(`     - Date: ${inv.tdlap}`);
      console.log(`     - Matches seller? ${inv.nbmst?.toLowerCase() === testMST.toLowerCase()}`);
      console.log(`     - Matches buyer? ${inv.nmmst?.toLowerCase() === testMST.toLowerCase()}`);
    });
    
    // 2. Check matching invoices
    const salesCount = await prisma.ext_listhoadon.count({
      where: {
        nbmst: {
          equals: testMST,
          mode: 'insensitive',
        },
      },
    });
    
    const purchasesCount = await prisma.ext_listhoadon.count({
      where: {
        nmmst: {
          equals: testMST,
          mode: 'insensitive',
        },
      },
    });
    
    console.log(`\n📊 Invoices matching MST "${testMST}":`);
    console.log(`   Sales (nbmst matches): ${salesCount}`);
    console.log(`   Purchases (nmmst matches): ${purchasesCount}`);
    console.log(`   Total: ${salesCount + purchasesCount}`);
    
    // 3. Check details
    const detailsCount = await prisma.ext_detailhoadon.count();
    const sampleDetails = await prisma.ext_detailhoadon.findMany({
      take: 3,
      select: {
        id: true,
        idhdon: true,
        ten: true,
        sluong: true,
        thtien: true,
        dvtinh: true,
      },
    });
    
    console.log(`\n📦 Invoice details: ${detailsCount} total`);
    console.log('Sample details:');
    sampleDetails.forEach((det, idx) => {
      console.log(`  ${idx + 1}. ${det.ten}`);
      console.log(`     - Quantity: ${det.sluong}, Amount: ${det.thtien}`);
      console.log(`     - Unit: ${det.dvtinh}`);
      console.log(`     - Invoice ID: ${det.idhdon}`);
    });
    
    // 4. Check products
    const productsCount = await prisma.ext_sanphamhoadon.count();
    console.log(`\n🏷️ Products in ext_sanphamhoadon: ${productsCount}`);
    
    if (productsCount === 0) {
      console.log('⚠️  WARNING: No products in ext_sanphamhoadon!');
      console.log('   This means product normalization hasn\'t been run yet.');
      console.log('   The system will use original product names from invoice details.');
      console.log('\n💡 To populate products, run:');
      console.log('   Frontend: Click "Cập nhật SP" button in /ketoan/sanpham');
      console.log('   Or GraphQL: Run updateProductsFromDetails mutation');
    } else {
      const sampleProducts = await prisma.ext_sanphamhoadon.findMany({
        take: 3,
        select: {
          id: true,
          ten: true,
          ten2: true,
          ma: true,
          dvt: true,
        },
      });
      
      console.log('Sample products:');
      sampleProducts.forEach((prod, idx) => {
        console.log(`  ${idx + 1}. ${prod.ten}`);
        console.log(`     - Normalized: ${prod.ten2}`);
        console.log(`     - Code: ${prod.ma}`);
        console.log(`     - Unit: ${prod.dvt}`);
      });
    }
    
    // 5. Test invoice-detail relationship
    if (invoices.length > 0) {
      const firstInvoice = invoices[0];
      const relatedDetails = await prisma.ext_detailhoadon.count({
        where: {
          idhdon: firstInvoice.id,
        },
      });
      
      console.log(`\n🔗 Relationship test:`);
      console.log(`   Invoice ${firstInvoice.shdon} has ${relatedDetails} detail(s)`);
    }
    
    console.log('\n✅ Debug complete!');
    console.log('\n📝 Summary:');
    console.log(`   - Invoices: ${invoices.length} (total in DB)`);
    console.log(`   - Matching user MST: ${salesCount + purchasesCount}`);
    console.log(`   - Details: ${detailsCount}`);
    console.log(`   - Products: ${productsCount}`);
    
    if (salesCount + purchasesCount === 0) {
      console.log('\n⚠️  ISSUE FOUND: No invoices match the test MST!');
      console.log('   Possible causes:');
      console.log('   1. MST in UserConfig is incorrect');
      console.log('   2. Database has different MST values');
      console.log('   3. Case sensitivity issue (should be handled by insensitive mode)');
      console.log('\n   Action: Check the actual MST values in your invoices');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugXuatNhapTon();
