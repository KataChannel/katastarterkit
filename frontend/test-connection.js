// Test the BackendExcelExportService connection detection
import BackendExcelExportService from '../src/services/backendExcelExport';

async function testConnection() {
  console.log('🧪 Testing backend connection detection...');
  
  try {
    const result = await BackendExcelExportService.checkServerConnection();
    console.log('Connection result:', result);
    
    if (result.connected) {
      console.log('✅ Server is accessible');
      
      // Test date validation as well
      console.log('\n🧪 Testing date validation...');
      const validationTests = [
        { from: '2025-01-01', to: '2025-01-31', expected: true },
        { from: '01/01/2025', to: '31/01/2025', expected: true },
        { from: '', to: '2025-01-31', expected: false },
      ];
      
      validationTests.forEach((test, i) => {
        const validation = BackendExcelExportService.validateDateRange(test.from, test.to);
        console.log(`Test ${i+1}: ${validation.isValid === test.expected ? '✅' : '❌'} ${test.from} -> ${test.to}`);
        if (!validation.isValid) console.log(`  Message: ${validation.message}`);
      });
      
    } else {
      console.log('❌ Server not accessible:', result.message);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run test if called directly
if (require.main === module) {
  testConnection();
}

module.exports = { testConnection };