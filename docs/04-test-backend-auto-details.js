/**
 * Test script for auto-fetch invoice details functionality
 * This script tests the backend service's ability to automatically
 * fetch and save invoice details after creating an invoice
 */

const axios = require('axios');

// Backend API URL
const API_BASE_URL = process.env.API_URL || 'http://localhost:3001/api';
const GRAPHQL_URL = process.env.GRAPHQL_URL || 'http://localhost:3001/graphql';

// Sample invoice data for testing
const sampleInvoiceData = {
  nbmst: '0304475742',
  khmshdon: '1',
  khhdon: 'C25TVP',
  shdon: '53271',
  nbten: 'CÔNG TY TNHH ABC',
  nmten: 'KHÁCH HÀNG XYZ',
  tdlap: new Date().toISOString(),
  tgtttbso: 1000000
};

async function testAutoFetchDetails() {
  console.log('🧪 Testing Auto-Fetch Invoice Details Functionality\n');

  try {
    // Step 1: Create invoice using bulk create (which should auto-fetch details)
    console.log('📝 Step 1: Creating invoice with auto-fetch details...');
    
    const bulkCreateMutation = `
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

    const response = await axios.post(GRAPHQL_URL, {
      query: bulkCreateMutation,
      variables: {
        input: {
          invoices: [sampleInvoiceData],
          skipExisting: true
        }
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.errors) {
      console.error('❌ GraphQL Errors:', response.data.errors);
      return;
    }

    const result = response.data.data.bulkCreateInvoices;
    console.log('✅ Bulk create result:', result);

    if (result.success) {
      console.log(`📊 Successfully created ${result.invoicesSaved} invoices`);
      console.log(`📋 Auto-fetched ${result.detailsSaved} details`);
      
      if (result.detailsSaved > 0) {
        console.log('🎉 SUCCESS: Auto-fetch details is working!');
      } else {
        console.log('⚠️  WARNING: No details were fetched automatically');
      }
    } else {
      console.log('❌ Failed to create invoice:', result.errors);
    }

    // Step 2: Query the created invoice to verify details were saved
    console.log('\n📋 Step 2: Querying invoice details...');
    
    const searchQuery = `
      query SearchInvoices($input: InvoiceSearchInput!) {
        searchInvoices(input: $input) {
          invoices {
            id
            idServer
            nbmst
            shdon
            details {
              id
              stt
              ten
              sluong
              dgia
              thtien
            }
          }
          total
        }
      }
    `;

    const searchResponse = await axios.post(GRAPHQL_URL, {
      query: searchQuery,
      variables: {
        input: {
          nbmst: sampleInvoiceData.nbmst,
          shdon: sampleInvoiceData.shdon,
          page: 0,
          size: 10
        }
      }
    });

    if (searchResponse.data.errors) {
      console.error('❌ Search errors:', searchResponse.data.errors);
      return;
    }

    const searchResult = searchResponse.data.data.searchInvoices;
    console.log(`📊 Found ${searchResult.total} invoices`);

    if (searchResult.invoices.length > 0) {
      const invoice = searchResult.invoices[0];
      console.log(`📄 Invoice ID: ${invoice.id}`);
      console.log(`🔑 Server ID: ${invoice.idServer}`);
      console.log(`📋 Details count: ${invoice.details.length}`);
      
      if (invoice.details.length > 0) {
        console.log('📝 Sample details:');
        invoice.details.slice(0, 3).forEach((detail, index) => {
          console.log(`  ${index + 1}. ${detail.ten} - ${detail.sluong} x ${detail.dgia} = ${detail.thtien}`);
        });
        console.log('🎉 SUCCESS: Details were automatically fetched and saved!');
      } else {
        console.log('⚠️  No details found in database');
      }
    }

    // Step 3: Test the external API directly (optional)
    console.log('\n🌐 Step 3: Testing external API directly...');
    
    try {
      const detailUrl = `https://hoadondientu.gdt.gov.vn:30000/query/invoices/detail?nbmst=${sampleInvoiceData.nbmst}&khhdon=${sampleInvoiceData.khhdon}&shdon=${sampleInvoiceData.shdon}&khmshdon=${sampleInvoiceData.khmshdon}`;
      console.log(`📡 Calling: ${detailUrl}`);
      
      const detailResponse = await axios.get(detailUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; TestScript/1.0)'
        }
      });

      if (detailResponse.data && detailResponse.data.datas) {
        console.log(`📋 External API returned ${detailResponse.data.datas.length} details`);
        console.log('✅ External API is accessible');
      } else {
        console.log('⚠️  External API returned no data');
      }
    } catch (apiError) {
      console.log('❌ External API error:', apiError.message);
      console.log('📝 This is expected if the external server is not accessible');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

async function testDatabaseStats() {
  console.log('\n📊 Testing Database Statistics...');
  
  try {
    const statsQuery = `
      query GetStats {
        getStats {
          totalInvoices
          totalDetails
          totalAmount
          totalTax
          lastSyncDate
        }
      }
    `;

    const response = await axios.post(GRAPHQL_URL, {
      query: statsQuery
    });

    if (response.data.errors) {
      console.error('❌ Stats query errors:', response.data.errors);
      return;
    }

    const stats = response.data.data.getStats;
    console.log('📈 Database Statistics:');
    console.log(`  📄 Total Invoices: ${stats.totalInvoices}`);
    console.log(`  📋 Total Details: ${stats.totalDetails}`);
    console.log(`  💰 Total Amount: ${stats.totalAmount?.toLocaleString('vi-VN')} VND`);
    console.log(`  💸 Total Tax: ${stats.totalTax?.toLocaleString('vi-VN')} VND`);
    console.log(`  📅 Last Sync: ${stats.lastSyncDate}`);

    if (stats.totalDetails > 0) {
      console.log('✅ Details are being saved to database');
    } else {
      console.log('⚠️  No details found in database');
    }

  } catch (error) {
    console.error('❌ Stats test failed:', error.message);
  }
}

// Main test execution
async function runTests() {
  console.log('🚀 Starting Auto-Fetch Invoice Details Tests\n');
  console.log('Backend URL:', API_BASE_URL);
  console.log('GraphQL URL:', GRAPHQL_URL);
  console.log('=' * 50);

  await testAutoFetchDetails();
  await testDatabaseStats();

  console.log('\n🏁 Tests completed!');
  console.log('=' * 50);
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testAutoFetchDetails,
  testDatabaseStats,
  runTests
};