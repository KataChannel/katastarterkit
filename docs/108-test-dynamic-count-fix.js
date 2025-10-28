/**
 * Test Dynamic Count Query Fix
 */

const axios = require('axios');

const GRAPHQL_ENDPOINT = 'http://localhost:14000/graphql';

const DYNAMIC_COUNT_QUERY = `
  query DynamicCount($input: CountInput!) {
    dynamicCount(input: $input)
  }
`;

async function testDynamicCount() {
  console.log('🧪 Testing Dynamic Count Fix...\n');

  const testCases = [
    {
      name: '✅ Count all users',
      variables: {
        input: {
          model: 'user',
          where: {}
        }
      },
      shouldPass: true
    },
    {
      name: '✅ Count active users',
      variables: {
        input: {
          model: 'user',
          where: {
            isActive: { equals: true }
          }
        }
      },
      shouldPass: true
    },
    {
      name: '✅ Count verified users',
      variables: {
        input: {
          model: 'user',
          where: {
            isVerified: { equals: true }
          }
        }
      },
      shouldPass: true
    },
    {
      name: '✅ Count admin users',
      variables: {
        input: {
          model: 'user',
          where: {
            roleType: { equals: 'ADMIN' }
          }
        }
      },
      shouldPass: true
    }
  ];

  let passedTests = 0;
  let failedTests = 0;

  for (const testCase of testCases) {
    console.log(`\n📝 ${testCase.name}`);
    console.log('Variables:', JSON.stringify(testCase.variables, null, 2));

    try {
      const response = await axios.post(
        GRAPHQL_ENDPOINT,
        {
          query: DYNAMIC_COUNT_QUERY,
          variables: testCase.variables
        },
        {
          headers: { 'Content-Type': 'application/json' },
          validateStatus: () => true
        }
      );

      if (response.data.errors) {
        console.log('❌ FAILED - Got errors:');
        console.log(JSON.stringify(response.data.errors, null, 2));
        failedTests++;
      } else {
        const result = response.data.data.dynamicCount;
        console.log('✅ PASSED - Count result:', result);
        console.log('   Count value:', result.data);
        passedTests++;
      }
    } catch (error) {
      console.log('❌ FAILED - Request error:', error.message);
      failedTests++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Results Summary');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${passedTests}/${testCases.length}`);
  console.log(`❌ Failed: ${failedTests}/${testCases.length}`);
  console.log('='.repeat(60));

  if (failedTests === 0) {
    console.log('\n🎉 All tests passed! dynamicCount fix successful!');
    console.log('\n✅ Bug fixed:');
    console.log('   - Changed: count(model, input) → count(model, input.where)');
    console.log('   - Return format: { data: count }');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.');
    process.exit(1);
  }
}

testDynamicCount().catch(error => {
  console.error('\n💥 Test execution failed:', error);
  process.exit(1);
});
