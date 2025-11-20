/**
 * Quick test to check if CallCenter GraphQL types are available
 * Run: node backend/test-callcenter-schema.js
 */

const GRAPHQL_ENDPOINT = 'http://localhost:14000/graphql';

const INTROSPECTION_QUERY = `
  query IntrospectCallCenterTypes {
    __type(name: "CallCenterRecord") {
      name
      kind
      fields {
        name
        type {
          name
          kind
        }
      }
    }
  }
`;

const CHECK_QUERIES = `
  {
    __schema {
      queryType {
        fields {
          name
          description
        }
      }
    }
  }
`;

const CHECK_MUTATIONS = `
  {
    __schema {
      mutationType {
        fields {
          name
          description
        }
      }
    }
  }
`;

async function checkSchema() {
  console.log('🔍 Checking Call Center GraphQL Schema\n');
  console.log('=' .repeat(60));

  try {
    // Check if CallCenterRecord type exists
    console.log('\n📋 Checking CallCenterRecord type...');
    const typeResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: INTROSPECTION_QUERY }),
    });

    const typeResult = await typeResponse.json();
    
    if (typeResult.data?.__type) {
      console.log('✅ CallCenterRecord type found!');
      console.log(`   Fields: ${typeResult.data.__type.fields.length} fields`);
      console.log('   Sample fields:', typeResult.data.__type.fields.slice(0, 5).map(f => f.name).join(', '));
    } else {
      console.log('❌ CallCenterRecord type not found');
    }

    // Check available queries
    console.log('\n📋 Checking available queries...');
    const queriesResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: CHECK_QUERIES }),
    });

    const queriesResult = await queriesResponse.json();
    const callCenterQueries = queriesResult.data?.__schema?.queryType?.fields?.filter(
      f => f.name.toLowerCase().includes('callcenter')
    );

    if (callCenterQueries && callCenterQueries.length > 0) {
      console.log(`✅ Found ${callCenterQueries.length} Call Center queries:`);
      callCenterQueries.forEach(q => {
        console.log(`   - ${q.name}`);
      });
    } else {
      console.log('❌ No Call Center queries found');
    }

    // Check available mutations
    console.log('\n📋 Checking available mutations...');
    const mutationsResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: CHECK_MUTATIONS }),
    });

    const mutationsResult = await mutationsResponse.json();
    const callCenterMutations = mutationsResult.data?.__schema?.mutationType?.fields?.filter(
      f => f.name.toLowerCase().includes('callcenter')
    );

    if (callCenterMutations && callCenterMutations.length > 0) {
      console.log(`✅ Found ${callCenterMutations.length} Call Center mutations:`);
      callCenterMutations.forEach(m => {
        console.log(`   - ${m.name}`);
      });
    } else {
      console.log('❌ No Call Center mutations found');
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 Schema check completed!');
    console.log('='.repeat(60));

    if (callCenterQueries?.length > 0 && callCenterMutations?.length > 0) {
      console.log('\n✅ SUCCESS: CallCenter module is properly loaded!');
      console.log('\n📝 Next steps:');
      console.log('1. Open GraphQL Playground: http://localhost:14000/graphql');
      console.log('2. Test queries and mutations');
      console.log('3. Open frontend: http://localhost:3000/admin/callcenter');
      console.log('4. Configure and test manual sync');
    } else {
      console.log('\n⚠️  WARNING: CallCenter module may not be loaded properly');
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Check if backend is running');
      console.log('2. Check backend logs for errors');
      console.log('3. Verify CallCenterModule is imported in app.module.ts');
      console.log('4. Restart backend server');
    }

  } catch (error) {
    console.error('\n❌ Schema check failed:');
    console.error(error.message);
    
    if (error.message.includes('fetch') || error.message.includes('ECONNREFUSED')) {
      console.log('\n⚠️  Backend is not running or not accessible at', GRAPHQL_ENDPOINT);
      console.log('Please start the backend server first.');
    }
  }
}

// Run check
checkSchema().catch(console.error);
