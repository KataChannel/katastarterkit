/**
 * Test script for Affiliate Link Creation
 * Tests the complete flow with validation
 */

const USER_ID = '9ae9e59b-177c-41a8-b047-c197a343e8c3'; // katachanneloffical@gmail.com
const CAMPAIGN_ID = '006be158-ac5f-484c-ae29-ad8d3d42d482';

const mutation = `
mutation CreateAffiliateLink($input: CreateAffLinkInput!) {
  createAffiliateLink(input: $input) {
    id
    trackingCode
    customAlias
    title
    description
    originalUrl
    clicks
    conversions
    createdAt
  }
}
`;

// Test Case 1: Valid input
const validInput = {
  input: {
    campaignId: CAMPAIGN_ID,
    originalUrl: 'https://timona.edu.vn/khoa-hoc/combo-chu-spa/',
    customAlias: 'combo-chu-spa',
    title: 'KHOÁ HỌC QUẢN LÝ/CHỦ SPA',
    description: 'Khóa học quản lý spa chuyên nghiệp',
  }
};

// Test Case 2: Missing campaignId (should fail gracefully)
const invalidInput = {
  input: {
    originalUrl: 'https://timona.edu.vn/khoa-hoc/combo-chu-spa/',
    customAlias: 'combo-chu-spa',
    title: 'KHOÁ HỌC QUẢN LÝ/CHỦ SPA',
  }
};

async function testLinkCreation(testName, variables, shouldFail = false) {
  console.log(`\n========== ${testName} ==========`);
  console.log('Variables:', JSON.stringify(variables, null, 2));

  try {
    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE', // Replace with real token
      },
      body: JSON.stringify({
        query: mutation,
        variables,
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.log('❌ GraphQL Errors:');
      result.errors.forEach(err => {
        console.log(`  - ${err.message}`);
      });
      if (!shouldFail) {
        console.log('⚠️  Test FAILED: Expected success but got error');
      } else {
        console.log('✅ Test PASSED: Error as expected');
      }
    } else {
      console.log('✅ Success:');
      console.log(JSON.stringify(result.data, null, 2));
      if (shouldFail) {
        console.log('⚠️  Test FAILED: Expected error but got success');
      } else {
        console.log('✅ Test PASSED: Success as expected');
      }
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
}

async function runTests() {
  console.log('🧪 Testing Affiliate Link Creation');
  console.log('===================================');

  // Test 1: Valid input
  await testLinkCreation('Test 1: Valid Input', validInput, false);

  // Test 2: Missing campaignId
  await testLinkCreation('Test 2: Missing campaignId', invalidInput, true);

  console.log('\n========== Tests Complete ==========\n');
  console.log('📝 Notes:');
  console.log('1. Replace YOUR_JWT_TOKEN_HERE with actual JWT token');
  console.log('2. Make sure backend is running on http://localhost:4000');
  console.log('3. Check that user has access to the campaign');
  console.log('4. Verify auto-profile creation works');
  console.log('5. Check auto-campaign join logic');
}

// Run if executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testLinkCreation, runTests };
