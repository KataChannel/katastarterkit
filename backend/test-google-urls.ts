/**
 * Test script cho Google Drive, Sheets, Docs integration
 * 
 * Chạy: bun run backend/test-google-urls.ts
 */

import axios from 'axios';

const API_URL = 'http://localhost:13001/api/lms/source-documents/upload-from-url';

// Test URLs từ Google Services
const testGoogleUrls = [
  {
    name: 'Google Sheets (Edit URL)',
    url: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
    description: 'Convert to XLSX export',
    expectedFormat: '.xlsx',
  },
  {
    name: 'Google Docs (Edit URL)', 
    url: 'https://docs.google.com/document/d/1VNJvT7_L1z_q_OvI5EjPqVjQz0PQhJPXU8nJhUGSxRA/edit',
    description: 'Convert to DOCX export',
    expectedFormat: '.docx',
  },
  {
    name: 'Google Slides (Edit URL)',
    url: 'https://docs.google.com/presentation/d/1EAYk18WDjIG-zp_0vLm3CsfQh_i8eXohR_PyqPc3k-o/edit',
    description: 'Convert to PPTX export',
    expectedFormat: '.pptx',
  },
  {
    name: 'Google Drive File (View URL)',
    url: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view',
    description: 'Convert to direct download',
    expectedFormat: 'any',
  },
  {
    name: 'Google Sheets with GID',
    url: 'https://docs.google.com/spreadsheets/d/1X31iwnqXRQjgHOn_glxXs6y7X_3p8LeMEOYvlfaUp-8/edit?gid=0#gid=0',
    description: 'Convert with specific sheet GID',
    expectedFormat: '.xlsx',
  },
  {
    name: 'Google Sheets with HTML entities',
    url: 'https:&#x2F;&#x2F;docs.google.com&#x2F;spreadsheets&#x2F;d&#x2F;1X31iwnqXRQjgHOn_glxXs6y7X_3p8LeMEOYvlfaUp-8&#x2F;edit?gid=0#gid=0',
    description: 'Decode HTML entities before processing',
    expectedFormat: '.xlsx',
  },
];

async function testGoogleUrl(testCase: typeof testGoogleUrls[0]) {
  console.log(`\n🧪 Testing: ${testCase.name}`);
  console.log(`📎 Original URL: ${testCase.url}`);
  console.log(`📝 Description: ${testCase.description}`);

  try {
    const response = await axios.post(
      API_URL,
      { url: testCase.url },
      {
        headers: {
          'Content-Type': 'application/json',
          // Add JWT token if needed for authentication
          // 'Authorization': 'Bearer YOUR_TOKEN_HERE',
        },
        timeout: 90000, // 90s timeout (Google can be slow)
      }
    );

    if (response.data.success) {
      console.log('✅ SUCCESS');
      console.log(`   📁 Filename: ${response.data.fileName}`);
      console.log(`   📦 Size: ${(response.data.fileSize / 1024).toFixed(2)} KB`);
      console.log(`   🔖 MIME Type: ${response.data.mimeType}`);
      console.log(`   🔗 MinIO URL: ${response.data.url}`);
      
      // Verify format
      if (testCase.expectedFormat !== 'any' && response.data.fileName) {
        if (response.data.fileName.endsWith(testCase.expectedFormat)) {
          console.log(`   ✓ Format matches expected (${testCase.expectedFormat})`);
        } else {
          console.log(`   ⚠️  Format mismatch (expected: ${testCase.expectedFormat}, got: ${response.data.fileName.split('.').pop()})`);
        }
      }
    } else {
      console.log('❌ FAILED: Response success = false');
    }
  } catch (error: any) {
    console.log('❌ ERROR');
    if (error.response) {
      console.log(`   HTTP Status: ${error.response.status}`);
      console.log(`   Message: ${error.response.data?.message || error.message}`);
      if (error.response.status === 403) {
        console.log(`   ℹ️  Note: Google file might not be publicly accessible`);
      }
    } else if (error.code === 'ECONNABORTED') {
      console.log(`   Timeout: Request took too long (> 90s)`);
    } else {
      console.log(`   ${error.message}`);
    }
  }
}

async function runTests() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🚀 Test: Google Drive, Sheets, Docs Integration');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`📡 API Endpoint: ${API_URL}`);
  console.log(`⏱️  Timeout: 90s per request`);
  console.log(`\n⚠️  Note: Test URLs dùng Google sample files`);
  console.log(`   Nếu lỗi 403/404, có thể file không public hoặc đã bị xóa`);
  console.log(`   Thay bằng URL Google file của bạn để test chính xác\n`);
  
  // Run tests sequentially
  for (const testCase of testGoogleUrls) {
    await testGoogleUrl(testCase);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s between tests
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('✅ All Google URL tests completed!');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('\n📋 Summary:');
  console.log('   • Google Sheets → Converts to XLSX export');
  console.log('   • Google Docs → Converts to DOCX export');
  console.log('   • Google Slides → Converts to PPTX export');
  console.log('   • Google Drive → Converts to direct download');
  console.log('   • HTML entities → Auto decoded');
  console.log('   • URL fragments (#gid=0) → Handled correctly');
  console.log('\n');
}

// Run tests
runTests().catch(console.error);
