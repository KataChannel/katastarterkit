const axios = require('axios');
const fs = require('fs');

console.log('🚀 Starting Frontend Excel Export Tests');

// Test server connection
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
}

// Test Excel export
async function testExcelExport() {
  try {
    console.log('🔍 Testing Excel export...');
    
    const response = await axios.get('http://localhost:14000/ketoan/listhoadon/export-excel', {
      params: {
        fromDate: '2024-01-01',
        toDate: '2024-12-31'
      },
      responseType: 'arraybuffer',
      timeout: 30000
    });
    
    console.log('📊 Excel export response:', {
      status: response.status,
      contentType: response.headers['content-type'],
      contentLength: response.headers['content-length'],
      dataSize: response.data.byteLength
    });
    
    if (response.data.byteLength > 0) {
      const filename = 'test-export.xlsx';
      fs.writeFileSync(filename, response.data);
      console.log(`✅ Excel file saved as ${filename} (${response.data.byteLength} bytes)`);
      return true;
    } else {
      console.error('❌ Received empty file');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Excel export failed:', error.message);
    if (error.response) {
      console.error('Server response:', error.response.status, error.response.statusText);
    }
    return false;
  }
}

// Run tests
async function runTests() {
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.log('⚠️ Skipping Excel export test due to connection failure');
    return;
  }
  
  await testExcelExport();
}

runTests().then(() => {
  console.log('\n✅ All tests completed!');
}).catch(error => {
  console.error('❌ Test suite failed:', error);
});