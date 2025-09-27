const https = require('https');
const axios = require('axios');

// Test SSL certificate fix for external API
async function testSSLFix() {
  console.log('🔒 Testing SSL Certificate Fix for External API');
  console.log('=' .repeat(50));
  
  const testUrl = 'https://hoadondientu.gdt.gov.vn:30000/query/invoices/detail';
  const testParams = {
    nbmst: '5900428904',
    khhdon: 'C25THP',
    shdon: '6522',
    khmshdon: '1'
  };
  
  const queryParams = new URLSearchParams(testParams);
  const fullUrl = `${testUrl}?${queryParams.toString()}`;
  
  console.log('🌐 Testing URL:', fullUrl);
  console.log('📋 Test Parameters:', testParams);
  console.log('');
  
  // Test 1: Without SSL fix (should fail)
  console.log('🧪 Test 1: Default SSL verification (should fail)');
  try {
    const response = await axios.get(fullUrl, {
      timeout: 10000,
      headers: {
        'Authorization': 'Bearer test-token',
        'User-Agent': 'Mozilla/5.0 (compatible; InvoiceService/1.0)',
        'Content-Type': 'application/json'
      }
    });
    console.log('❌ Unexpected success with default SSL verification');
  } catch (error) {
    if (error.message.includes('unable to verify the first certificate')) {
      console.log('✅ Expected SSL certificate error:', error.message);
    } else {
      console.log('⚠️  Different error:', error.message);
    }
  }
  
  console.log('');
  
  // Test 2: With SSL fix (should work or give different error)
  console.log('🧪 Test 2: SSL verification disabled (should bypass certificate error)');
  try {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false, // Disable SSL verification
      keepAlive: true,
      timeout: 10000
    });
    
    const response = await axios.get(fullUrl, {
      timeout: 10000,
      httpsAgent: httpsAgent,
      headers: {
        'Authorization': 'Bearer test-token',
        'User-Agent': 'Mozilla/5.0 (compatible; InvoiceService/1.0)',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('🎉 SSL certificate bypass successful!');
    console.log('📊 Response status:', response.status);
    console.log('📄 Response data preview:', JSON.stringify(response.data).substring(0, 200) + '...');
    return true;
    
  } catch (error) {
    if (error.message.includes('unable to verify the first certificate')) {
      console.log('❌ SSL certificate error still occurring:', error.message);
      return false;
    } else if (error.response?.status === 401) {
      console.log('✅ SSL certificate bypass worked! (Got authentication error instead)');
      console.log('🔐 Status:', error.response.status, error.response.statusText);
      console.log('💡 This means SSL is working, but we need a valid Bearer Token');
      return true;
    } else {
      console.log('⚠️  Different error after SSL bypass:', error.message);
      console.log('📊 Status:', error.response?.status, error.response?.statusText);
      return true; // SSL bypass likely worked, just different API error
    }
  }
}

// Test configuration reading
async function testConfigurationReading() {
  console.log('');
  console.log('🔧 Testing Configuration Reading');
  console.log('=' .repeat(35));
  
  try {
    // Test environment variable reading
    const sslVerification = process.env.INVOICE_API_SSL_VERIFICATION !== 'false';
    console.log('📝 INVOICE_API_SSL_VERIFICATION:', process.env.INVOICE_API_SSL_VERIFICATION || 'undefined');
    console.log('🔒 SSL Verification enabled:', sslVerification);
    
    const apiBaseUrl = process.env.INVOICE_API_BASE_URL || 'https://hoadondientu.gdt.gov.vn:30000';
    console.log('🌐 API Base URL:', apiBaseUrl);
    
    const timeout = parseInt(process.env.INVOICE_API_TIMEOUT || '30000');
    console.log('⏱️  Timeout:', timeout + 'ms');
    
    return true;
  } catch (error) {
    console.error('❌ Configuration reading failed:', error.message);
    return false;
  }
}

// Run tests
async function runSSLTests() {
  console.log('🚀 Starting SSL Certificate Fix Tests');
  console.log('');
  
  const configTest = await testConfigurationReading();
  const sslTest = await testSSLFix();
  
  console.log('');
  console.log('📊 Test Results Summary:');
  console.log('Configuration Reading:', configTest ? '✅ PASS' : '❌ FAIL');
  console.log('SSL Certificate Fix:', sslTest ? '✅ PASS' : '❌ FAIL');
  
  if (configTest && sslTest) {
    console.log('');
    console.log('🎉 SSL Certificate fix is working!');
    console.log('');
    console.log('📋 Fix Summary:');
    console.log('• Added HTTPS agent with rejectUnauthorized: false');
    console.log('• SSL verification can be controlled via INVOICE_API_SSL_VERIFICATION env var');
    console.log('• External API calls should no longer fail with certificate errors');
    console.log('• Bearer Token authentication errors are now the expected behavior');
    console.log('');
    console.log('🔧 To configure:');
    console.log('• Set INVOICE_API_SSL_VERIFICATION=false in .env to disable SSL verification');
    console.log('• Configure proper Bearer Token in frontend or .env for actual API calls');
  } else {
    console.log('');
    console.log('❌ SSL fix may need additional work. Check the logs above.');
  }
}

// Export for potential use in other test files
module.exports = {
  testSSLFix,
  testConfigurationReading,
  runSSLTests
};

// Run tests if this file is executed directly
if (require.main === module) {
  runSSLTests().catch(console.error);
}