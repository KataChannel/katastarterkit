#!/usr/bin/env node

/**
 * Test pg_trgm Fuzzy Matching
 * 
 * Verify that pg_trgm extension works correctly
 * Test similarity function and custom functions
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Test cases
const testCases = [
  {
    text1: 'main asus i7',
    text2: 'asus i7 main',
    expectedSimilarity: 0.7, // Should be > 0.7
  },
  {
    text1: 'main asus i7',
    text2: 'bo mạch asus i7300',
    expectedSimilarity: 0.5, // Should be > 0.5
  },
  {
    text1: 'laptop dell',
    text2: 'laptop hp',
    expectedSimilarity: 0.4, // Should be > 0.4
  },
  {
    text1: 'laptop dell',
    text2: 'mouse logitech',
    expectedSimilarity: 0.1, // Should be < 0.2 (very different)
  },
];

async function testSimilarity() {
  console.log('\n🧪 Testing pg_trgm Similarity Function\n');
  console.log('=' .repeat(70));

  for (const testCase of testCases) {
    const result = await prisma.$queryRaw`
      SELECT similarity(${testCase.text1}, ${testCase.text2}) as score
    `;

    const score = result[0]?.score || 0;
    const expected = testCase.expectedSimilarity;
    const status = score >= expected ? '✅ PASS' : '❌ FAIL';

    console.log(`\n${status}`);
    console.log(`Text 1: "${testCase.text1}"`);
    console.log(`Text 2: "${testCase.text2}"`);
    console.log(`Score: ${score.toFixed(3)} (expected >= ${expected})`);
  }
}

async function testExtension() {
  console.log('\n\n🔧 Testing pg_trgm Extension Installation\n');
  console.log('=' .repeat(70));

  try {
    const result = await prisma.$queryRaw`
      SELECT * FROM pg_extension WHERE extname = 'pg_trgm'
    `;

    if (result.length > 0) {
      console.log('✅ pg_trgm extension is installed');
      console.log('Extension details:', result[0]);
    } else {
      console.log('❌ pg_trgm extension NOT found');
    }
  } catch (error) {
    console.log('❌ Error checking extension:', error.message);
  }
}

async function testIndexes() {
  console.log('\n\n📊 Testing Indexes\n');
  console.log('=' .repeat(70));

  try {
    const result = await prisma.$queryRaw`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'ext_sanphamhoadon'
        AND indexname LIKE '%trgm%'
    `;

    if (result.length > 0) {
      console.log('✅ Found GIN index for trigram matching:');
      result.forEach(idx => {
        console.log(`\n  Index: ${idx.indexname}`);
        console.log(`  Definition: ${idx.indexdef}`);
      });
    } else {
      console.log('⚠️  No trigram indexes found');
      console.log('Run migration to create indexes');
    }
  } catch (error) {
    console.log('❌ Error checking indexes:', error.message);
  }
}

async function testCustomFunctions() {
  console.log('\n\n⚙️  Testing Custom Functions\n');
  console.log('=' .repeat(70));

  // Test find_canonical_name function
  try {
    console.log('\nTesting find_canonical_name() function...');
    const result = await prisma.$queryRaw`
      SELECT find_canonical_name('test product', 0.6::real)
    `;
    console.log('✅ find_canonical_name() function works');
    console.log('   Result:', result[0]?.find_canonical_name || 'NULL (no canonical found)');
  } catch (error) {
    console.log('❌ find_canonical_name() error:', error.message);
  }

  // Test get_similar_products function
  try {
    console.log('\nTesting get_similar_products() function...');
    const result = await prisma.$queryRaw`
      SELECT * FROM get_similar_products('test product', 0.3::real) LIMIT 5
    `;
    console.log('✅ get_similar_products() function works');
    console.log(`   Found ${result.length} similar products`);
  } catch (error) {
    console.log('❌ get_similar_products() error:', error.message);
  }
}

async function testWithRealData() {
  console.log('\n\n📦 Testing with Real Product Data\n');
  console.log('=' .repeat(70));

  // Count products
  const totalProducts = await prisma.ext_sanphamhoadon.count();
  console.log(`\nTotal products in database: ${totalProducts}`);

  if (totalProducts === 0) {
    console.log('⚠️  No products found. Run updatesanpham.js first.');
    return;
  }

  // Get sample product
  const sample = await prisma.ext_sanphamhoadon.findFirst({
    where: { ten: { not: null } },
  });

  if (sample && sample.ten) {
    console.log(`\nTesting with sample product: "${sample.ten}"`);

    // Find similar
    const similar = await prisma.$queryRaw`
      SELECT 
        id, 
        ten, 
        ten2,
        similarity(ten, ${sample.ten}) as score
      FROM ext_sanphamhoadon
      WHERE similarity(ten, ${sample.ten}) > 0.3
        AND id != ${sample.id}
      ORDER BY score DESC
      LIMIT 5
    `;

    console.log(`\nFound ${similar.length} similar products:`);
    similar.forEach((prod, idx) => {
      console.log(`  ${idx + 1}. "${prod.ten}" (score: ${prod.score.toFixed(3)})`);
    });
  }

  // Check normalized products
  const normalized = await prisma.ext_sanphamhoadon.count({
    where: { ten2: { not: null } },
  });

  console.log(`\n📊 Normalization Status:`);
  console.log(`   Total products: ${totalProducts}`);
  console.log(`   Normalized (ten2 set): ${normalized}`);
  console.log(`   Not normalized: ${totalProducts - normalized}`);

  if (normalized > 0) {
    // Show top groups
    const groups = await prisma.ext_sanphamhoadon.groupBy({
      by: ['ten2'],
      where: { ten2: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });

    console.log(`\n📊 Top 5 Product Groups:`);
    groups.forEach((group, idx) => {
      console.log(`   ${idx + 1}. "${group.ten2}" (${group._count.id} products)`);
    });
  }
}

async function main() {
  console.log('\n🚀 pg_trgm Fuzzy Matching Test Suite');
  console.log('=' .repeat(70));

  try {
    await testExtension();
    await testIndexes();
    await testCustomFunctions();
    await testSimilarity();
    await testWithRealData();

    console.log('\n\n✅ ALL TESTS COMPLETED\n');
  } catch (error) {
    console.error('\n❌ Test Suite Error:', error);
    process.exit(1);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
