#!/usr/bin/env node

/**
 * Test automatic invoice details fetching after sync
 * This script tests the enhanced syncInvoices functionality
 */

const { InvoiceDatabaseService } = require('./frontend/src/services/invoiceDatabaseService');

// Mock invoice data for testing
const mockInvoiceData = [
  {
    nbmst: '0304475742',
    khhdon: 'C25TVP',
    shdon: '53271',
    khmshdon: '1',
    msttcgp: '0304475742',
    ten: 'Test Invoice 1',
    tgtttbso: 1000000,
    tgtthue: 100000
  },
  {
    nbmst: '0304475742',
    khhdon: 'C25TVP', 
    shdon: '53272',
    khmshdon: '1',
    msttcgp: '0304475742',
    ten: 'Test Invoice 2',
    tgtttbso: 2000000,
    tgtthue: 200000
  }
];

async function testAutoSyncDetails() {
  console.log('🚀 Testing automatic invoice details fetching...\n');

  try {
    // Test 1: Sync with automatic detail fetching (default behavior)
    console.log('📋 Test 1: syncInvoices with default settings (auto-fetch details)');
    const result1 = await InvoiceDatabaseService.syncInvoices(mockInvoiceData);
    
    console.log('Result:', {
      success: result1.success,
      invoicesSaved: result1.invoicesSaved,
      detailsSaved: result1.detailsSaved,
      errors: result1.errors.length > 0 ? result1.errors : 'None'
    });
    console.log('Message:', result1.message);
    console.log('\n---\n');

    // Test 2: Using the new wrapper method
    console.log('📋 Test 2: syncInvoicesWithDetails wrapper method');
    const result2 = await InvoiceDatabaseService.syncInvoicesWithDetails(mockInvoiceData);
    
    console.log('Result:', {
      success: result2.success,
      invoicesSaved: result2.invoicesSaved,
      detailsSaved: result2.detailsSaved,
      errors: result2.errors.length > 0 ? result2.errors : 'None'
    });
    console.log('Message:', result2.message);
    console.log('\n---\n');

    // Test 3: Sync without details (backward compatibility)
    console.log('📋 Test 3: syncInvoicesOnly (without details)');
    const result3 = await InvoiceDatabaseService.syncInvoicesOnly(mockInvoiceData);
    
    console.log('Result:', {
      success: result3.success,
      invoicesSaved: result3.invoicesSaved,
      detailsSaved: result3.detailsSaved,
      errors: result3.errors.length > 0 ? result3.errors : 'None'
    });
    console.log('Message:', result3.message);
    console.log('\n---\n');

    // Test 4: Test individual detail fetching
    console.log('📋 Test 4: fetchAndSaveInvoiceDetails for individual invoice');
    if (result1.invoicesSaved > 0) {
      // This would require an actual invoice ID from database
      console.log('⚠️  Skipping individual test - requires actual invoice ID from database');
    }

  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    console.error('Stack:', error.stack);
  }
}

async function testConfiguration() {
  console.log('🔧 Testing configuration and API endpoints...\n');

  try {
    // Test API configuration
    const configTest = await fetch('http://localhost:3001/api/invoices/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (configTest.ok) {
      const stats = await configTest.json();
      console.log('✅ Backend API connection successful');
      console.log('Current database stats:', stats);
    } else {
      console.log('⚠️  Backend API not available - tests will use mock data');
    }

  } catch (error) {
    console.log('⚠️  Backend API connection failed - tests will use mock data');
    console.log('Error:', error.message);
  }

  console.log('\n---\n');
}

async function main() {
  console.log('🧪 Auto-Sync Invoice Details Test Suite');
  console.log('======================================\n');

  await testConfiguration();
  await testAutoSyncDetails();

  console.log('✅ Testing completed!');
  console.log('\n📝 Summary of Changes:');
  console.log('- syncInvoices now defaults to includeDetails=true');
  console.log('- Added syncInvoicesWithDetails() wrapper method');
  console.log('- Added syncInvoicesOnly() for backward compatibility');
  console.log('- Added fetchAndSaveInvoiceDetails() for individual processing');
  console.log('- Enhanced error handling and logging');
  console.log('\n🎯 Expected Behavior:');
  console.log('- After syncing invoices successfully, system automatically calls:');
  console.log('  https://hoadondientu.gdt.gov.vn:30000/query/invoices/detail');
  console.log('- With parameters: nbmst, khhdon, shdon, khmshdon');
  console.log('- And saves details to ext_detailhoadon table');
}

// Run tests
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  testAutoSyncDetails,
  testConfiguration
};