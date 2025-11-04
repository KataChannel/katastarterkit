const axios = require('axios');

// Test File Logging System
async function testFileLogging() {
  console.log('🗂️  Testing File Logging System');
  console.log('=' .repeat(50));
  
  // Test API endpoints
  const API_BASE = 'http://localhost:14000/api/logs';
  
  try {
    console.log('1. Testing log statistics endpoint...');
    const statsResponse = await axios.get(`${API_BASE}/stats`);
    console.log('✅ Stats endpoint working:', {
      totalFiles: statsResponse.data.totalFiles,
      totalSize: statsResponse.data.totalSizeFormatted,
      newestLog: statsResponse.data.newestLog
    });
    
    console.log('\n2. Testing file list endpoint...');
    const filesResponse = await axios.get(`${API_BASE}/files`);
    console.log('✅ Files endpoint working:', {
      count: filesResponse.data.count,
      files: filesResponse.data.files.slice(0, 3) // Show first 3 files
    });
    
    console.log('\n3. Testing recent logs endpoint...');
    const recentResponse = await axios.get(`${API_BASE}/recent?lines=10`);
    console.log('✅ Recent logs endpoint working:', {
      count: recentResponse.data.count,
      sampleLogs: recentResponse.data.logs.slice(0, 2).map(log => ({
        filename: log.filename,
        timestamp: log.timestamp,
        level: log.level
      }))
    });
    
    console.log('\n4. Testing search endpoint...');
    const searchResponse = await axios.post(`${API_BASE}/search`, {
      query: 'invoice',
      maxResults: 5
    });
    console.log('✅ Search endpoint working:', {
      totalResults: searchResponse.data.totalResults,
      sampleResults: searchResponse.data.results.slice(0, 2).map(result => ({
        filename: result.filename,
        lineNumber: result.lineNumber
      }))
    });
    
    console.log('\n5. Testing log viewer web interface...');
    try {
      const webResponse = await axios.get('http://localhost:14000/logs/logs.html');
      console.log('✅ Log viewer web interface accessible');
    } catch (error) {
      console.log('⚠️  Log viewer web interface:', error.response?.status || error.code);
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ File logging test failed:', error.message);
    console.log('Status:', error.response?.status);
    console.log('Data:', error.response?.data);
    return false;
  }
}

// Test log file creation by making some API calls
async function generateTestLogs() {
  console.log('\n📝 Generating test logs...');
  
  const GRAPHQL_URL = 'http://localhost:3001/graphql';
  
  try {
    // Test some GraphQL operations to generate logs
    const query = `
      query GetInvoiceStats {
        invoiceStats {
          totalInvoices
          totalDetails
          totalAmount
          lastSyncDate
        }
      }
    `;
    
    await axios.post(GRAPHQL_URL, { query });
    console.log('✅ Generated logs via GraphQL stats query');
    
    // Test bulk create to generate more logs
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

    const variables = {
      input: {
        invoices: [{
          id: 'test-log-invoice',
          nbmst: '0123456789',
          khmshdon: 'TEST001',
          shdon: '0000001',
          tdlap: new Date().toISOString(),
          tgtttbso: 100000,
          tgtthue: 10000,
          tgtcthue: 110000,
          ttxly: 'Hoàn thành',
          dvtte: 'VND'
        }],
        skipExisting: true,
        includeDetails: false
      }
    };

    await axios.post(GRAPHQL_URL, { query: mutation, variables });
    console.log('✅ Generated logs via bulk create operation');
    
  } catch (error) {
    console.log('⚠️  Log generation (expected if server not running):', error.code);
  }
}

// Test file logger service directly
function testFileLoggerService() {
  console.log('\n🔧 Testing FileLoggerService directly...');
  
  try {
    // Import and test the service
    const { FileLoggerService } = require('./src/services/file-logger.service');
    const logger = new FileLoggerService();
    
    // Test different log levels
    logger.log('Test info message', 'TestContext');
    logger.warn('Test warning message', 'TestContext');
    logger.error('Test error message', 'TestContext');
    logger.debug('Test debug message', 'TestContext');
    
    // Test structured logging
    logger.logWithData('log', 'Test structured logging', {
      userId: 'test-user',
      operation: 'file-logging-test',
      timestamp: new Date().toISOString()
    }, 'TestContext');
    
    // Test invoice-specific logging
    logger.logInvoiceOperation('test', 'test-invoice-id', {
      action: 'file-logger-test',
      success: true
    });
    
    logger.logApiCall('POST', '/test/api', 200, 150);
    
    console.log('✅ FileLoggerService direct test completed');
    
    // Get log stats
    const stats = logger.getLogStats();
    console.log('📊 Log Statistics:', {
      totalFiles: stats.totalFiles,
      totalSize: stats.totalSize,
      newestLog: stats.newestLog
    });
    
    return true;
    
  } catch (error) {
    console.error('❌ FileLoggerService direct test failed:', error.message);
    return false;
  }
}

// Check if logs directory exists and show sample logs
function checkLogsDirectory() {
  console.log('\n📁 Checking logs directory...');
  
  const fs = require('fs');
  const path = require('path');
  
  const logsDir = path.join(process.cwd(), 'logs');
  
  try {
    if (fs.existsSync(logsDir)) {
      const files = fs.readdirSync(logsDir);
      console.log('✅ Logs directory exists');
      console.log('📋 Log files found:', files.length);
      
      if (files.length > 0) {
        files.forEach(file => {
          const filePath = path.join(logsDir, file);
          const stats = fs.statSync(filePath);
          console.log(`  - ${file} (${Math.round(stats.size / 1024)}KB, modified: ${stats.mtime.toLocaleString()})`);
        });
        
        // Show sample from most recent log file
        const newestFile = files
          .map(file => ({ name: file, mtime: fs.statSync(path.join(logsDir, file)).mtime }))
          .sort((a, b) => b.mtime - a.mtime)[0];
        
        if (newestFile) {
          console.log(`\n📄 Sample from ${newestFile.name}:`);
          const content = fs.readFileSync(path.join(logsDir, newestFile.name), 'utf8');
          const lines = content.split('\n').filter(line => line.trim()).slice(-5);
          lines.forEach(line => console.log(`  ${line}`));
        }
      } else {
        console.log('📝 No log files found (this is normal for first run)');
      }
    } else {
      console.log('📁 Logs directory does not exist yet');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Failed to check logs directory:', error.message);
    return false;
  }
}

// Run all tests
async function runFileLoggingTests() {
  console.log('🚀 Starting File Logging System Tests');
  console.log('');
  
  const directTest = testFileLoggerService();
  const dirCheck = checkLogsDirectory();
  await generateTestLogs();
  const apiTest = await testFileLogging();
  
  console.log('');
  console.log('📊 Test Results Summary:');
  console.log('FileLoggerService Direct Test:', directTest ? '✅ PASS' : '❌ FAIL');
  console.log('Logs Directory Check:', dirCheck ? '✅ PASS' : '❌ FAIL');
  console.log('API Endpoints Test:', apiTest ? '✅ PASS' : '❌ FAIL');
  
  if (directTest && dirCheck && apiTest) {
    console.log('');
    console.log('🎉 File logging system is working correctly!');
    console.log('');
    console.log('📋 Features Available:');
    console.log('• File-based logging with rotation and compression');
    console.log('• Structured logging with JSON data support');
    console.log('• Level-specific log files (error, warn, debug, info)');
    console.log('• Combined log files for all levels');
    console.log('• REST API for log management and viewing');
    console.log('• Web-based log viewer interface');
    console.log('• Log search and filtering capabilities');
    console.log('• Automatic log cleanup and rotation');
    console.log('');
    console.log('🌐 Access Log Viewer:');
    console.log('   http://localhost:14000/logs/logs.html');
    console.log('');
    console.log('🔗 API Endpoints:');
    console.log('   GET  /api/logs/stats     - Log statistics');
    console.log('   GET  /api/logs/files     - List log files');
    console.log('   GET  /api/logs/view      - View specific log file');
    console.log('   GET  /api/logs/recent    - Recent logs across all files');
    console.log('   GET  /api/logs/level/:level - Logs by level');
    console.log('   POST /api/logs/search    - Search logs');
    console.log('   POST /api/logs/cleanup   - Clear old logs');
  } else {
    console.log('');
    console.log('❌ Some tests failed. File logging system may need attention.');
  }
}

// Export for potential use in other test files
module.exports = {
  testFileLogging,
  generateTestLogs,
  testFileLoggerService,
  checkLogsDirectory,
  runFileLoggingTests
};

// Run tests if this file is executed directly
if (require.main === module) {
  runFileLoggingTests().catch(console.error);
}