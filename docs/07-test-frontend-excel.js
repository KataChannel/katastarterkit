// Debug script to test frontend Excel export functionality
const axios// Test server connection
async function testConnection() {
  try {
    console.log('🔍 Testing server connection...');
    
    // Test Excel export endpoint instead of health
    const exportTestResponse = await axios.head('http://localhost:14000/ketoan/listhoadon/export-excel?fromDate=2024-01-01&toDate=2024-01-31', {
      timeout: 5000
    });
    
    console.log('✅ Excel export endpoint is responding:', exportTestResponse.status);
    return true;
  } catch (error) {
    console.error('❌ Server connection failed:', error.message);
    return false;
  }
}xios');
const fs = require('fs');

async function testFrontendExcelExport() {
  console.log('🧪 Testing Frontend Excel Export Function...\n');
  
  const testParams = {
    fromDate: '2024-01-01',
    toDate: '2024-03-31',
    invoiceType: 'banra'
  };
  
  const apiUrl = 'http://localhost:14000/ketoan/listhoadon';
  
  try {
    console.log('📋 Test Parameters:', testParams);
    console.log('🌐 API URL:', apiUrl);
    console.log('\n🚀 Making request...');
    
    const response = await axios.get(`${apiUrl}/export-excel`, {
      params: {
        fromDate: testParams.fromDate,
        toDate: testParams.toDate,
        ...(testParams.invoiceType && { invoiceType: testParams.invoiceType }),
      },
      responseType: 'blob',
      timeout: 120000,
    });
    
    console.log('✅ Response received:');
    console.log('   Status:', response.status);
    console.log('   Content-Type:', response.headers['content-type']);
    console.log('   Content-Length:', response.headers['content-length']);
    console.log('   Content-Disposition:', response.headers['content-disposition']);
    
    // Write to file to verify it's a valid Excel file
    const filename = `test-export-${Date.now()}.xlsx`;
    fs.writeFileSync(filename, response.data);
    
    console.log(`✅ Excel file saved as: ${filename}`);
    console.log(`📏 File size: ${fs.statSync(filename).size} bytes`);
    
    console.log('\n🎉 Frontend Excel export test PASSED!');
    
  } catch (error) {
    console.error('❌ Frontend Excel export test FAILED:');
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Status Text:', error.response.statusText);
      console.error('   Headers:', error.response.headers);
      
      // Try to read error response
      if (error.response.data) {
        if (typeof error.response.data === 'string') {
          console.error('   Error Data:', error.response.data);
        } else {
          console.error('   Error Data Type:', typeof error.response.data);
          console.error('   Error Data Size:', error.response.data.size || 'unknown');
        }
      }
    } else if (error.request) {
      console.error('   Request Error:', error.message);
      console.error('   Code:', error.code);
    } else {
      console.error('   General Error:', error.message);
    }
  }
}

// Test server connection first
async function testServerConnection() {
  try {
    console.log('🔍 Testing server connection...');
    const response = await axios.get('http://localhost:14000/health', { timeout: 5000 });
    console.log('✅ Server is running:', response.status);
    console.log('📊 Health status:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Server connection failed:', error.message);
    return false;
  }
}

// Test ketoan endpoint
async function testKetoamEndpoint() {
  try {
    console.log('🔍 Testing ketoan endpoint...');
    const response = await axios.get('http://localhost:14000/ketoan/listhoadon/test', { timeout: 5000 });
    console.log('✅ Ketoan endpoint working:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Ketoan endpoint failed:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Frontend Excel Export Tests\n');
  
  if (await testServerConnection()) {
    if (await testKetoamEndpoint()) {
      console.log('\n📊 Testing Excel Export...');
      await testFrontendExcelExport();
    }
  }
  
  console.log('\n✅ All tests completed!');
}

runAllTests().catch(console.error);