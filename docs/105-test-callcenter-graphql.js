/**
 * Test Call Center GraphQL API
 * Run: node backend/test-callcenter-graphql.js
 */

const GRAPHQL_ENDPOINT = 'http://localhost:14000/graphql';

// Test queries
const GET_CONFIG = `
  query GetCallCenterConfig {
    getCallCenterConfig {
      id
      apiUrl
      domain
      syncMode
      isActive
      defaultDaysBack
      batchSize
      lastSyncAt
      totalRecordsSynced
    }
  }
`;

const CREATE_CONFIG = `
  mutation CreateCallCenterConfig($input: CreateCallCenterConfigInput!) {
    createCallCenterConfig(input: $input) {
      id
      apiUrl
      domain
      syncMode
      isActive
    }
  }
`;

const SYNC_DATA = `
  mutation SyncCallCenterData($input: SyncCallCenterInput) {
    syncCallCenterData(input: $input) {
      success
      message
      recordsCreated
      recordsUpdated
      recordsSkipped
      totalFetched
    }
  }
`;

const GET_RECORDS = `
  query GetCallCenterRecords($pagination: PaginationInput!, $filters: CallCenterRecordFiltersInput) {
    getCallCenterRecords(pagination: $pagination, filters: $filters) {
      items {
        id
        direction
        callerIdNumber
        destinationNumber
        callStatus
        duration
        billsec
        startEpoch
      }
      pagination {
        currentPage
        totalPages
        totalItems
        hasNextPage
      }
    }
  }
`;

async function graphqlRequest(query, variables = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();
  
  if (result.errors) {
    console.error('❌ GraphQL Errors:', JSON.stringify(result.errors, null, 2));
    return null;
  }
  
  return result.data;
}

async function testCallCenterAPI() {
  console.log('🧪 Testing Call Center GraphQL API\n');
  console.log('=' .repeat(60));

  try {
    // Test 1: Get Config (should return null or existing config)
    console.log('\n📋 Test 1: Get Call Center Config');
    console.log('-'.repeat(60));
    const configData = await graphqlRequest(GET_CONFIG);
    
    if (configData) {
      console.log('✅ Config query successful!');
      console.log('Config:', JSON.stringify(configData.getCallCenterConfig, null, 2));
    } else {
      console.log('⚠️  Config query failed (may need authentication)');
    }

    // Test 2: Create Config (if not exists)
    if (!configData?.getCallCenterConfig) {
      console.log('\n📋 Test 2: Create Call Center Config');
      console.log('-'.repeat(60));
      
      const createConfigInput = {
        apiUrl: 'https://pbx01.onepos.vn:8080/api/v2/cdrs',
        domain: 'tazaspa102019',
        syncMode: 'MANUAL',
        isActive: false,
        defaultDaysBack: 30,
        batchSize: 200,
      };

      const createResult = await graphqlRequest(CREATE_CONFIG, { input: createConfigInput });
      
      if (createResult) {
        console.log('✅ Config created successfully!');
        console.log('New Config:', JSON.stringify(createResult.createCallCenterConfig, null, 2));
      } else {
        console.log('⚠️  Config creation failed (may need authentication)');
      }
    }

    // Test 3: Get Records
    console.log('\n📋 Test 3: Get Call Center Records');
    console.log('-'.repeat(60));
    
    const recordsData = await graphqlRequest(GET_RECORDS, {
      pagination: { page: 1, limit: 10 },
    });
    
    if (recordsData) {
      console.log('✅ Records query successful!');
      const records = recordsData.getCallCenterRecords;
      console.log(`Total Records: ${records.pagination.totalItems}`);
      console.log(`Total Pages: ${records.pagination.totalPages}`);
      console.log(`Records in page: ${records.items.length}`);
      
      if (records.items.length > 0) {
        console.log('\nSample Record:');
        console.log(JSON.stringify(records.items[0], null, 2));
      }
    } else {
      console.log('⚠️  Records query failed (may need authentication)');
    }

    // Test 4: Manual Sync (commented out to avoid actual API call)
    console.log('\n📋 Test 4: Manual Sync (Skipped)');
    console.log('-'.repeat(60));
    console.log('⏭️  Manual sync test skipped to avoid calling external API');
    console.log('To test sync, uncomment the code below and run again:');
    console.log(`
    const syncResult = await graphqlRequest(SYNC_DATA, {
      input: {}  // Will use default config settings
    });
    
    if (syncResult) {
      console.log('✅ Sync successful!');
      console.log('Result:', JSON.stringify(syncResult.syncCallCenterData, null, 2));
    }
    `);

    console.log('\n' + '='.repeat(60));
    console.log('🎉 All tests completed!');
    console.log('='.repeat(60));
    
    console.log('\n📝 Notes:');
    console.log('- If queries failed with authentication errors, you need to:');
    console.log('  1. Login via GraphQL mutation or frontend');
    console.log('  2. Get JWT token');
    console.log('  3. Pass token to graphqlRequest() function');
    console.log('- To test manual sync, enable it in the test and ensure config is active');
    console.log('- Check GraphQL Playground at: http://localhost:14000/graphql');

  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(error.message);
    console.error(error.stack);
  }
}

// Run tests
testCallCenterAPI().catch(console.error);
