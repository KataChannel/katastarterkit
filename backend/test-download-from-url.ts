/**
 * Test script để kiểm tra chức năng tải file từ URL
 * 
 * Chạy: bun run backend/test-download-from-url.ts
 */

import axios from 'axios';

const API_URL = 'http://localhost:13001/api/lms/source-documents/upload-from-url';

// Test URLs với các định dạng khác nhau
const testUrls = [
  // PDF
  {
    name: 'PDF Document',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    expectedMimeType: 'application/pdf',
  },
  // Text
  {
    name: 'Text File',
    url: 'https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore',
    expectedMimeType: 'text/plain',
  },
  // Markdown
  {
    name: 'Markdown File',
    url: 'https://raw.githubusercontent.com/microsoft/vscode/main/README.md',
    expectedMimeType: 'text/plain', // GitHub serves markdown as text/plain
  },
  // JSON
  {
    name: 'JSON File',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    expectedMimeType: 'application/json',
  },
  // Image
  {
    name: 'Image (PNG)',
    url: 'https://via.placeholder.com/150',
    expectedMimeType: 'image/png',
  },
];

async function testUploadFromUrl(testCase: typeof testUrls[0]) {
  console.log(`\n🧪 Testing: ${testCase.name}`);
  console.log(`📎 URL: ${testCase.url}`);

  try {
    const response = await axios.post(
      API_URL,
      { url: testCase.url },
      {
        headers: {
          'Content-Type': 'application/json',
          // Add JWT token if needed
          // 'Authorization': 'Bearer YOUR_TOKEN_HERE',
        },
        timeout: 60000, // 60s timeout
      }
    );

    if (response.data.success) {
      console.log('✅ SUCCESS');
      console.log(`   📁 Filename: ${response.data.fileName}`);
      console.log(`   📦 Size: ${(response.data.fileSize / 1024).toFixed(2)} KB`);
      console.log(`   🔖 MIME Type: ${response.data.mimeType}`);
      console.log(`   🔗 URL: ${response.data.url}`);
      
      // Verify MIME type
      if (response.data.mimeType.includes(testCase.expectedMimeType.split('/')[1])) {
        console.log('   ✓ MIME type matches expected');
      } else {
        console.log(`   ⚠️  MIME type mismatch (expected: ${testCase.expectedMimeType})`);
      }
    } else {
      console.log('❌ FAILED: Response success = false');
    }
  } catch (error: any) {
    console.log('❌ ERROR');
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Message: ${error.response.data?.message || error.message}`);
    } else {
      console.log(`   ${error.message}`);
    }
  }
}

async function runTests() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🚀 Test: Upload từ URL - Các định dạng file khác nhau');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`📡 API Endpoint: ${API_URL}`);
  console.log(`⏱️  Timeout: 60s per request`);
  
  // Run tests sequentially
  for (const testCase of testUrls) {
    await testUploadFromUrl(testCase);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between tests
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('✅ All tests completed!');
  console.log('═══════════════════════════════════════════════════════════\n');
}

// Run tests
runTests().catch(console.error);
