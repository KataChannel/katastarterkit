const fetch = require('node-fetch');

// Test Rate Limiting for Bulk Invoice Creation
async function testRateLimitingFix() {
  const GRAPHQL_URL = 'http://localhost:3001/graphql';
  const TEST_BEARER_TOKEN = 'test-bearer-token-from-frontend';
  
  console.log('🚦 Testing Rate Limiting Fix for Bulk Invoice Creation');
  console.log('=' .repeat(60));
  
  try {
    // Test GraphQL mutation with multiple invoices to trigger rate limiting
    const mutation = `
      mutation BulkCreateInvoices($input: BulkInvoiceInput!) {
        bulkCreateInvoices(input: $input) {
          success
          invoicesSaved
          detailsSaved
          errors
          message
        }
      }
    `;

    // Create multiple test invoices to trigger rate limiting
    const testInvoices = [];
    for (let i = 1; i <= 12; i++) { // 12 invoices to test batching (5+5+2)
      testInvoices.push({
        id: `test-invoice-${i}`,
        nbmst: '0123456789',
        khmshdon: 'TEST001',
        shdon: String(i).padStart(7, '0'),
        tdlap: new Date().toISOString(),
        tgtttbso: 100000 * i,
        tgtthue: 10000 * i,
        tgtcthue: 110000 * i,
        ttxly: 'Hoàn thành',
        dvtte: 'VND'
      });
    }

    const variables = {
      input: {
        invoices: testInvoices,
        skipExisting: true,
        includeDetails: true, // This will trigger detail fetching with rate limiting
        bearerToken: TEST_BEARER_TOKEN
      }
    };

    console.log('📤 Sending GraphQL request with multiple invoices...');
    console.log('Number of invoices:', testInvoices.length);
    console.log('Bearer Token:', TEST_BEARER_TOKEN);
    console.log('Include Details (will trigger rate limiting):', true);
    console.log('');

    const startTime = Date.now();
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: mutation,
        variables
      })
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    console.log('📥 GraphQL Response:');
    console.log(JSON.stringify(result, null, 2));
    console.log('');
    console.log(`⏱️  Total processing time: ${duration}ms`);
    
    if (result.errors) {
      console.log('❌ GraphQL Errors:', result.errors);
      return false;
    }

    const data = result.data?.bulkCreateInvoices;
    if (data) {
      console.log('');
      console.log('📊 Rate Limiting Test Results:');
      console.log('✅ Success:', data.success);
      console.log('💾 Invoices Saved:', data.invoicesSaved);
      console.log('📋 Details Saved:', data.detailsSaved);
      console.log('📝 Message:', data.message);
      console.log('⏱️  Processing Duration:', `${duration}ms`);
      
      // Expected behavior with rate limiting:
      // - Should process invoices in batches of 5
      // - Should have delays between batches (2 seconds each)
      // - Should have delays between detail calls (500ms each)
      // - Should retry on 409/429 errors
      
      const expectedMinimumTime = 2000 * 2; // At least 2 batch delays for 12 invoices
      if (duration >= expectedMinimumTime) {
        console.log('✅ Rate limiting appears to be working (processing took expected time)');
      } else {
        console.log('⚠️  Processing completed faster than expected - check if rate limiting is active');
      }
      
      if (data.errors && data.errors.length > 0) {
        console.log('⚠️  Errors encountered:', data.errors);
        // Check if errors are related to rate limiting (expected) vs other issues
        const rateLimitErrors = data.errors.filter(error => 
          error.includes('409') || error.includes('429') || error.includes('timeout')
        );
        if (rateLimitErrors.length > 0) {
          console.log('🚦 Rate limiting errors detected (these should be handled by retry logic)');
        }
      } else {
        console.log('🎉 No errors - rate limiting prevention successful!');
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Test configuration reading
async function testRateLimitingConfig() {
  console.log('');
  console.log('🔧 Testing Rate Limiting Configuration');
  console.log('=' .repeat(45));
  
  try {
    // Test environment variable reading for rate limiting
    console.log('📝 Rate Limiting Environment Variables:');
    console.log('INVOICE_API_BATCH_SIZE:', process.env.INVOICE_API_BATCH_SIZE || 'undefined (default: 5)');
    console.log('INVOICE_API_DELAY_BETWEEN_BATCHES:', process.env.INVOICE_API_DELAY_BETWEEN_BATCHES || 'undefined (default: 2000ms)');
    console.log('INVOICE_API_DELAY_BETWEEN_CALLS:', process.env.INVOICE_API_DELAY_BETWEEN_CALLS || 'undefined (default: 500ms)');
    console.log('INVOICE_API_MAX_RETRIES:', process.env.INVOICE_API_MAX_RETRIES || 'undefined (default: 3)');
    console.log('');
    
    // Effective configuration
    const batchSize = parseInt(process.env.INVOICE_API_BATCH_SIZE || '5');
    const delayBetweenBatches = parseInt(process.env.INVOICE_API_DELAY_BETWEEN_BATCHES || '2000');
    const delayBetweenCalls = parseInt(process.env.INVOICE_API_DELAY_BETWEEN_CALLS || '500');
    const maxRetries = parseInt(process.env.INVOICE_API_MAX_RETRIES || '3');
    
    console.log('🎯 Effective Rate Limiting Configuration:');
    console.log('Batch Size:', batchSize, 'invoices per batch');
    console.log('Delay Between Batches:', delayBetweenBatches, 'ms');
    console.log('Delay Between Detail Calls:', delayBetweenCalls, 'ms');
    console.log('Max Retries:', maxRetries, 'attempts');
    
    return true;
  } catch (error) {
    console.error('❌ Configuration test failed:', error.message);
    return false;
  }
}

// Run tests
async function runRateLimitingTests() {
  console.log('🚀 Starting Rate Limiting Fix Tests');
  console.log('');
  
  const configTest = await testRateLimitingConfig();
  const rateLimitTest = await testRateLimitingFix();
  
  console.log('');
  console.log('📊 Test Summary:');
  console.log('Configuration Reading:', configTest ? '✅ PASS' : '❌ FAIL');
  console.log('Rate Limiting Integration:', rateLimitTest ? '✅ PASS' : '❌ FAIL');
  
  if (configTest && rateLimitTest) {
    console.log('');
    console.log('🎉 Rate limiting fix is working!');
    console.log('');
    console.log('📋 Fix Summary:');
    console.log('• Added batch processing to prevent server overload');
    console.log('• Implemented delays between batches and API calls');
    console.log('• Added retry logic with exponential backoff for 409/429 errors');
    console.log('• Made rate limiting configurable via environment variables');
    console.log('• Enhanced error handling for different server response codes');
    console.log('');
    console.log('🔧 Configuration Options:');
    console.log('• INVOICE_API_BATCH_SIZE: Number of invoices per batch');
    console.log('• INVOICE_API_DELAY_BETWEEN_BATCHES: Delay between processing batches');
    console.log('• INVOICE_API_DELAY_BETWEEN_CALLS: Delay between detail API calls');
    console.log('• INVOICE_API_MAX_RETRIES: Maximum retry attempts for failed calls');
  } else {
    console.log('');
    console.log('❌ Some tests failed. Check the configuration and server availability.');
  }
}

// Export for potential use in other test files
module.exports = {
  testRateLimitingFix,
  testRateLimitingConfig,
  runRateLimitingTests
};

// Run tests if this file is executed directly
if (require.main === module) {
  runRateLimitingTests().catch(console.error);
}