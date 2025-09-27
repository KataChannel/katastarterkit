/**
 * Test script to verify Bearer Token configuration and external API connectivity
 * This script tests the backend's ability to use Bearer Token for invoice detail API calls
 */

const axios = require('axios');
require('dotenv').config();

// Configuration
const GRAPHQL_URL = process.env.GRAPHQL_URL || 'http://localhost:3001/graphql';
const TEST_INVOICE_DATA = {
  nbmst: '0304475742',
  khmshdon: '1',
  khhdon: 'C25TVP',
  shdon: '53271',
  nbten: 'TEST COMPANY',
  nmten: 'TEST CUSTOMER',
  tdlap: new Date().toISOString(),
  tgtttbso: 1000000
};

console.log('🔧 Bearer Token Configuration Test\n');
console.log('Environment Variables:');
console.log(`├── INVOICE_API_BEARER_TOKEN: ${process.env.INVOICE_API_BEARER_TOKEN ? '✅ Set' : '❌ Not set'}`);
console.log(`├── DEFAULT_BEARER_TOKEN: ${process.env.DEFAULT_BEARER_TOKEN ? '✅ Set' : '❌ Not set'}`);
console.log(`├── INVOICE_API_BASE_URL: ${process.env.INVOICE_API_BASE_URL || 'Using default'}`);
console.log(`└── GraphQL URL: ${GRAPHQL_URL}\n`);

async function testBackendConfig() {
  console.log('📋 Testing Backend Configuration...\n');

  try {
    // Test configuration validation through a simple query
    const configTestQuery = `
      query TestConfig {
        getStats {
          totalInvoices
          totalDetails
        }
      }
    `;

    const response = await axios.post(GRAPHQL_URL, {
      query: configTestQuery
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.errors) {
      console.error('❌ GraphQL errors:', response.data.errors);
      return false;
    }

    console.log('✅ Backend is accessible');
    console.log(`📊 Current database stats:`, response.data.data.getStats);
    return true;

  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    return false;
  }
}

async function testBearerTokenIntegration() {
  console.log('\n🔐 Testing Bearer Token Integration...\n');

  try {
    // Create an invoice which should trigger auto-fetch details with Bearer Token
    const bulkCreateMutation = `
      mutation TestBearerToken($input: BulkInvoiceInput!) {
        bulkCreateInvoices(input: $input) {
          success
          invoicesSaved
          detailsSaved
          errors
          message
        }
      }
    `;

    console.log('📤 Creating test invoice to trigger Bearer Token usage...');

    const response = await axios.post(GRAPHQL_URL, {
      query: bulkCreateMutation,
      variables: {
        input: {
          invoices: [TEST_INVOICE_DATA],
          skipExisting: false // Force creation to test token
        }
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.errors) {
      console.error('❌ GraphQL errors:', response.data.errors);
      return false;
    }

    const result = response.data.data.bulkCreateInvoices;
    console.log('📊 Bulk create result:', result);

    // Analyze results
    if (result.success) {
      console.log(`✅ Invoice created successfully: ${result.invoicesSaved} invoice(s)`);
      
      if (result.detailsSaved > 0) {
        console.log(`🎉 SUCCESS: Bearer Token is working! Fetched ${result.detailsSaved} details`);
        console.log('🔑 External API call with Bearer Token was successful');
        return true;
      } else {
        console.log('⚠️  WARNING: No details were fetched');
        console.log('💡 This could mean:');
        console.log('   - Bearer Token is not configured properly');
        console.log('   - External API rejected the token (401/403)');
        console.log('   - No details available for this invoice');
        console.log('   - Network connectivity issues');
        
        if (result.errors.length > 0) {
          console.log('❌ Errors found:');
          result.errors.forEach(error => console.log(`   - ${error}`));
        }
        return false;
      }
    } else {
      console.log('❌ Invoice creation failed');
      if (result.errors.length > 0) {
        console.log('Errors:');
        result.errors.forEach(error => console.log(`   - ${error}`));
      }
      return false;
    }

  } catch (error) {
    console.error('❌ Bearer Token test failed:', error.message);
    if (error.response?.data) {
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

async function testDirectExternalAPI() {
  console.log('\n🌐 Testing Direct External API Call...\n');

  const bearerToken = process.env.INVOICE_API_BEARER_TOKEN || process.env.DEFAULT_BEARER_TOKEN;
  
  if (!bearerToken || bearerToken.includes('your-') || bearerToken.includes('token-here')) {
    console.log('⚠️  No valid Bearer Token configured for direct API test');
    console.log('💡 Set INVOICE_API_BEARER_TOKEN in your .env file to test direct access');
    return false;
  }

  try {
    const apiUrl = `https://hoadondientu.gdt.gov.vn:30000/query/invoices/detail`;
    const params = new URLSearchParams({
      nbmst: TEST_INVOICE_DATA.nbmst,
      khhdon: TEST_INVOICE_DATA.khhdon,
      shdon: TEST_INVOICE_DATA.shdon,
      khmshdon: TEST_INVOICE_DATA.khmshdon
    });

    console.log(`📡 Testing direct API call: ${apiUrl}?${params.toString()}`);
    console.log(`🔑 Using Bearer Token: ${bearerToken.substring(0, 10)}...`);

    const response = await axios.get(`${apiUrl}?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'User-Agent': 'Mozilla/5.0 (compatible; TestScript/1.0)',
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });

    if (response.data && response.data.datas) {
      console.log(`✅ Direct API call successful!`);
      console.log(`📋 Found ${response.data.datas.length} detail records`);
      console.log('🔑 Bearer Token is valid and working');
      return true;
    } else {
      console.log('⚠️  API call successful but no data returned');
      console.log('📋 Response:', response.data);
      return true; // Still successful call
    }

  } catch (error) {
    console.error('❌ Direct API call failed:', error.message);
    
    if (error.response) {
      console.error(`📊 Status: ${error.response.status} - ${error.response.statusText}`);
      
      if (error.response.status === 401) {
        console.error('🔐 Authentication failed - Bearer Token is invalid or expired');
      } else if (error.response.status === 403) {
        console.error('🚫 Access forbidden - Bearer Token lacks sufficient permissions');
      } else if (error.response.status === 404) {
        console.error('📋 No data found for the provided invoice parameters');
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('⏱️  Request timeout - External API is not responding');
    } else if (error.code === 'ENOTFOUND') {
      console.error('🌐 Network error - Cannot reach external API');
    }
    
    return false;
  }
}

async function generateConfigInstructions() {
  console.log('\n📝 Configuration Instructions:\n');
  
  console.log('1. Create/update your .env file in the backend directory:');
  console.log('   ```');
  console.log('   # Invoice API Bearer Token (replace with actual token)');
  console.log('   INVOICE_API_BEARER_TOKEN=your-actual-bearer-token-here');
  console.log('   DEFAULT_BEARER_TOKEN=fallback-token-if-needed');
  console.log('   INVOICE_API_BASE_URL=https://hoadondientu.gdt.gov.vn:30000');
  console.log('   INVOICE_API_TIMEOUT=30000');
  console.log('   ```\n');
  
  console.log('2. Restart your backend server after updating the .env file\n');
  
  console.log('3. The Bearer Token should be obtained from:');
  console.log('   - Vietnamese Tax Authority (Tổng cục Thuế)');
  console.log('   - Electronic Invoice System portal');
  console.log('   - Your organization\'s tax department\n');
  
  console.log('4. For testing, you can check the backend logs for detailed error messages');
  console.log('   when auto-fetching invoice details fails\n');
}

// Main test execution
async function runAllTests() {
  console.log('🚀 Starting Bearer Token Configuration Tests\n');
  console.log('=' .repeat(60));

  let allPassed = true;

  // Test 1: Backend Configuration
  const backendOk = await testBackendConfig();
  allPassed = allPassed && backendOk;

  // Test 2: Bearer Token Integration
  const tokenOk = await testBearerTokenIntegration();
  allPassed = allPassed && tokenOk;

  // Test 3: Direct External API
  const directOk = await testDirectExternalAPI();
  allPassed = allPassed && directOk;

  console.log('\n' + '=' .repeat(60));
  console.log('🏁 Test Results Summary:');
  console.log(`├── Backend Configuration: ${backendOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`├── Bearer Token Integration: ${tokenOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`├── Direct External API: ${directOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`└── Overall Status: ${allPassed ? '🎉 ALL TESTS PASSED' : '⚠️  SOME TESTS FAILED'}\n`);

  if (!allPassed) {
    await generateConfigInstructions();
  } else {
    console.log('🎉 Congratulations! Bearer Token is configured correctly and working!');
    console.log('📋 Invoice details will be automatically fetched when creating invoices.\n');
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testBackendConfig,
  testBearerTokenIntegration,
  testDirectExternalAPI,
  runAllTests
};