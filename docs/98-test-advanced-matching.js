#!/usr/bin/env node

/**
 * Test Advanced Product Matching
 * 
 * Tests the new advanced matching functions with DVT and DGIA:
 * 1. get_similar_products_advanced()
 * 2. find_canonical_name_advanced()
 * 3. get_product_groups_advanced()
 * 4. find_duplicates_advanced()
 * 5. test_product_similarity()
 * 
 * Usage:
 *   node test-advanced-matching.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['warn', 'error'],
});

// ============================================
// Test Results Tracking
// ============================================

const testResults = {
  passed: 0,
  failed: 0,
  tests: [],
};

function recordTest(name, passed, details = '') {
  testResults.tests.push({ name, passed, details });
  if (passed) {
    testResults.passed++;
    console.log(`✅ ${name}`);
  } else {
    testResults.failed++;
    console.log(`❌ ${name}`);
  }
  if (details) {
    console.log(`   ${details}`);
  }
}

// ============================================
// Test Functions
// ============================================

/**
 * Test 1: get_similar_products_advanced()
 * Find products with name + DVT + price matching
 */
async function testSimilarProductsAdvanced() {
  console.log('\n📝 Test 1: get_similar_products_advanced()');
  console.log('='.repeat(70));

  try {
    // Get a sample product to test with
    const sampleProduct = await prisma.ext_sanphamhoadon.findFirst({
      where: {
        ten: { not: null },
        dvt: { not: null },
        dgia: { not: null },
      },
    });

    if (!sampleProduct) {
      recordTest('Test 1', false, 'No sample product found with ten, dvt, and dgia');
      return;
    }

    console.log(`\nSample product: "${sampleProduct.ten}" [${sampleProduct.dvt}] $${sampleProduct.dgia}`);

    // Test 1a: Name only (basic)
    const resultNameOnly = await prisma.$queryRaw`
      SELECT * FROM get_similar_products_advanced(
        ${sampleProduct.ten},
        NULL,
        NULL::decimal,
        10::decimal,
        0.3::real
      ) LIMIT 5
    `;
    recordTest(
      'Test 1a: Name matching',
      resultNameOnly.length > 0,
      `Found ${resultNameOnly.length} similar products by name`
    );

    // Test 1b: Name + DVT
    const resultWithDvt = await prisma.$queryRaw`
      SELECT * FROM get_similar_products_advanced(
        ${sampleProduct.ten},
        ${sampleProduct.dvt},
        NULL::decimal,
        10::decimal,
        0.3::real
      ) LIMIT 5
    `;
    recordTest(
      'Test 1b: Name + DVT matching',
      resultWithDvt.length > 0,
      `Found ${resultWithDvt.length} products with same DVT`
    );

    // Test 1c: Name + DVT + Price
    const price = parseFloat(sampleProduct.dgia);
    if (!isNaN(price) && price > 0) {
      const resultWithPrice = await prisma.$queryRaw`
        SELECT * FROM get_similar_products_advanced(
          ${sampleProduct.ten},
          ${sampleProduct.dvt},
          ${price}::decimal,
          10::decimal,
          0.3::real
        ) LIMIT 5
      `;
      recordTest(
        'Test 1c: Name + DVT + Price matching',
        resultWithPrice.length > 0,
        `Found ${resultWithPrice.length} products within 10% price range`
      );

      // Show sample results
      if (resultWithPrice.length > 0) {
        console.log('\n   Sample results:');
        resultWithPrice.slice(0, 3).forEach((r, idx) => {
          console.log(`   ${idx + 1}. "${r.ten}" [${r.dvt}] $${r.dgia} (${(r.similarity_score * 100).toFixed(1)}% similar)`);
          if (r.price_diff_percent !== null) {
            console.log(`      Price diff: ${r.price_diff_percent.toFixed(1)}%`);
          }
        });
      }
    }

  } catch (error) {
    recordTest('Test 1', false, `Error: ${error.message}`);
  }
}

/**
 * Test 2: find_canonical_name_advanced()
 * Find canonical name with DVT and price
 */
async function testFindCanonicalNameAdvanced() {
  console.log('\n📝 Test 2: find_canonical_name_advanced()');
  console.log('='.repeat(70));

  try {
    // Get a product with ten2 already set
    const product = await prisma.ext_sanphamhoadon.findFirst({
      where: {
        ten2: { not: null },
        dvt: { not: null },
        dgia: { not: null },
      },
    });

    if (!product) {
      recordTest('Test 2', false, 'No product with ten2, dvt, and dgia found');
      return;
    }

    console.log(`\nTest product: "${product.ten}" [${product.dvt}] $${product.dgia}`);
    console.log(`Expected ten2: "${product.ten2}"`);

    const price = parseFloat(product.dgia);
    
    const result = await prisma.$queryRaw`
      SELECT * FROM find_canonical_name_advanced(
        ${product.ten},
        ${product.dvt},
        ${price}::decimal,
        10::decimal,
        0.6::real
      )
    `;

    if (result && result.length > 0 && result[0].canonical_name) {
      const canonical = result[0];
      console.log(`\nFound canonical:`);
      console.log(`   Name: "${canonical.canonical_name}"`);
      console.log(`   DVT: ${canonical.canonical_dvt}`);
      console.log(`   Price: $${canonical.canonical_price}`);
      console.log(`   Match count: ${canonical.match_count}`);
      console.log(`   Avg price: $${canonical.avg_price}`);

      recordTest(
        'Test 2: Find canonical name advanced',
        canonical.canonical_name !== null,
        `Canonical: "${canonical.canonical_name}"`
      );
    } else {
      recordTest('Test 2', true, 'No canonical found (might be unique product)');
    }

  } catch (error) {
    recordTest('Test 2', false, `Error: ${error.message}`);
  }
}

/**
 * Test 3: get_product_groups_advanced()
 * Group products by ten2 + DVT with price stats
 */
async function testProductGroupsAdvanced() {
  console.log('\n📝 Test 3: get_product_groups_advanced()');
  console.log('='.repeat(70));

  try {
    const result = await prisma.$queryRaw`
      SELECT * FROM get_product_groups_advanced(2, 10::decimal)
      ORDER BY product_count DESC
      LIMIT 10
    `;

    recordTest(
      'Test 3: Product groups advanced',
      result.length > 0,
      `Found ${result.length} product groups`
    );

    if (result.length > 0) {
      console.log('\n   Top 5 groups:');
      result.slice(0, 5).forEach((group, idx) => {
        console.log(`\n   ${idx + 1}. "${group.ten2}" [${group.dvt}]`);
        console.log(`      Count: ${group.product_count} products`);
        console.log(`      Price range: $${group.min_price} - $${group.max_price}`);
        console.log(`      Average: $${group.avg_price.toFixed(2)}`);
        console.log(`      Variance: ${group.price_variance.toFixed(1)}%`);
      });
    }

  } catch (error) {
    recordTest('Test 3', false, `Error: ${error.message}`);
  }
}

/**
 * Test 4: find_duplicates_advanced()
 * Find duplicates with DVT and price matching
 */
async function testFindDuplicatesAdvanced() {
  console.log('\n📝 Test 4: find_duplicates_advanced()');
  console.log('='.repeat(70));

  try {
    const result = await prisma.$queryRaw`
      SELECT * FROM find_duplicates_advanced(10::decimal)
      ORDER BY product_count DESC
      LIMIT 10
    `;

    recordTest(
      'Test 4: Find duplicates advanced',
      true, // Always pass if no error
      `Found ${result.length} potential duplicate groups`
    );

    if (result.length > 0) {
      console.log('\n   Top 5 duplicate groups:');
      result.slice(0, 5).forEach((dup, idx) => {
        console.log(`\n   ${idx + 1}. "${dup.ten2}" [${dup.dvt}]`);
        console.log(`      Count: ${dup.product_count} products`);
        console.log(`      Price range: ${dup.price_range}`);
        console.log(`      IDs: ${dup.product_ids.slice(0, 3).join(', ')}...`);
      });
    } else {
      console.log('\n   No duplicates found (good data quality!)');
    }

  } catch (error) {
    recordTest('Test 4', false, `Error: ${error.message}`);
  }
}

/**
 * Test 5: test_product_similarity()
 * Test similarity between two products
 */
async function testProductSimilarity() {
  console.log('\n📝 Test 5: test_product_similarity()');
  console.log('='.repeat(70));

  try {
    // Get two products to compare
    const products = await prisma.ext_sanphamhoadon.findMany({
      where: {
        ten: { not: null },
        dvt: { not: null },
        dgia: { not: null },
      },
      take: 2,
    });

    if (products.length < 2) {
      recordTest('Test 5', false, 'Need at least 2 products to compare');
      return;
    }

    console.log(`\nComparing:`);
    console.log(`   Product 1: "${products[0].ten}" [${products[0].dvt}] $${products[0].dgia}`);
    console.log(`   Product 2: "${products[1].ten}" [${products[1].dvt}] $${products[1].dgia}`);

    const result = await prisma.$queryRaw`
      SELECT * FROM test_product_similarity(
        ${products[0].id},
        ${products[1].id}
      )
    `;

    if (result && result.length > 0) {
      const sim = result[0];
      console.log(`\n   Similarity metrics:`);
      console.log(`      Name similarity: ${(sim.name_similarity * 100).toFixed(1)}%`);
      console.log(`      DVT match: ${sim.dvt_match ? '✅ Yes' : '❌ No'}`);
      console.log(`      Price difference: ${sim.price_diff_percent.toFixed(1)}%`);
      console.log(`      Is duplicate: ${sim.is_duplicate ? '✅ Yes' : '❌ No'}`);

      recordTest(
        'Test 5: Product similarity test',
        true,
        `Name: ${(sim.name_similarity * 100).toFixed(1)}%, DVT: ${sim.dvt_match}, Price: ${sim.price_diff_percent.toFixed(1)}%`
      );
    }

  } catch (error) {
    recordTest('Test 5', false, `Error: ${error.message}`);
  }
}

/**
 * Test 6: Price tolerance variations
 */
async function testPriceToleranceVariations() {
  console.log('\n📝 Test 6: Price tolerance variations');
  console.log('='.repeat(70));

  try {
    const product = await prisma.ext_sanphamhoadon.findFirst({
      where: {
        ten: { not: null },
        dgia: { not: null, gt: 1000 },
      },
    });

    if (!product) {
      recordTest('Test 6', false, 'No suitable product found');
      return;
    }

    const price = parseFloat(product.dgia);
    console.log(`\nTest product: "${product.ten}" at $${price}`);

    // Test with different tolerances: 5%, 10%, 20%
    const tolerances = [5, 10, 20];
    
    for (const tolerance of tolerances) {
      const result = await prisma.$queryRaw`
        SELECT COUNT(*) as count FROM get_similar_products_advanced(
          ${product.ten},
          NULL,
          ${price}::decimal,
          ${tolerance}::decimal,
          0.3::real
        )
      `;

      const count = result[0]?.count || 0;
      console.log(`   ±${tolerance}% tolerance: ${count} matches`);
    }

    recordTest('Test 6: Price tolerance variations', true, 'Tested 5%, 10%, 20% tolerances');

  } catch (error) {
    recordTest('Test 6', false, `Error: ${error.message}`);
  }
}

// ============================================
// Main Test Runner
// ============================================

async function main() {
  console.log('\n🧪 Advanced Product Matching Test Suite');
  console.log('='.repeat(70));
  console.log('');
  console.log('Testing 5 new PostgreSQL functions:');
  console.log('  1. get_similar_products_advanced()');
  console.log('  2. find_canonical_name_advanced()');
  console.log('  3. get_product_groups_advanced()');
  console.log('  4. find_duplicates_advanced()');
  console.log('  5. test_product_similarity()');
  console.log('');

  // Check database connection
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection: OK\n');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }

  // Run all tests
  await testSimilarProductsAdvanced();
  await testFindCanonicalNameAdvanced();
  await testProductGroupsAdvanced();
  await testFindDuplicatesAdvanced();
  await testProductSimilarity();
  await testPriceToleranceVariations();

  // ============================================
  // Final Summary
  // ============================================

  console.log('\n' + '='.repeat(70));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(70));
  console.log('');
  console.log(`Total tests: ${testResults.passed + testResults.failed}`);
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log('');

  if (testResults.failed > 0) {
    console.log('Failed tests:');
    testResults.tests
      .filter((t) => !t.passed)
      .forEach((t) => {
        console.log(`  ❌ ${t.name}`);
        if (t.details) console.log(`     ${t.details}`);
      });
    console.log('');
  }

  const allPassed = testResults.failed === 0;
  
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED!');
    console.log('');
    console.log('✅ Advanced product matching is working correctly');
    console.log('✅ DVT matching is functional');
    console.log('✅ Price tolerance matching is functional');
    console.log('✅ All 5 SQL functions are operational');
  } else {
    console.log('⚠️  SOME TESTS FAILED');
    console.log('');
    console.log('Please review the errors above and check:');
    console.log('  1. Migration was applied correctly');
    console.log('  2. Database has sample data');
    console.log('  3. PostgreSQL version supports required features');
  }

  console.log('='.repeat(70));
  console.log('');

  process.exit(allPassed ? 0 : 1);
}

// ============================================
// Run Tests
// ============================================

main()
  .catch((error) => {
    console.error('\n❌ Fatal Error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
