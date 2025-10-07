/**
 * Test Dynamic Find Many Query with Validation Fix
 * Tests that class-validator decorators properly validate FindManyInput
 */

const axios = require('axios');

const GRAPHQL_ENDPOINT = 'http://localhost:14000/graphql';

// Test query
const DYNAMIC_FIND_MANY_QUERY = `
  query DynamicFindMany($input: FindManyInput!) {
    dynamicFindMany(input: $input)
  }
`;

async function testDynamicFindMany() {
  console.log('🧪 Testing Dynamic Find Many with Validation Fix...\n');

  const testCases = [
    {
      name: '✅ Valid Query - All fields',
      variables: {
        input: {
          model: 'user',
          where: {},
          orderBy: {
            createdAt: 'desc'
          },
          pagination: {
            page: 0,
            limit: 20,
            sortBy: 'createdAt',
            sortOrder: 'desc'
          },
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatar: true,
            roleType: true,
            isActive: true,
            isVerified: true,
            isTwoFactorEnabled: true,
            failedLoginAttempts: true,
            lockedUntil: true,
            lastLoginAt: true,
            createdAt: true,
            updatedAt: true
          }
        }
      },
      shouldPass: true
    },
    {
      name: '✅ Valid Query - Minimal fields',
      variables: {
        input: {
          model: 'user'
        }
      },
      shouldPass: true
    },
    {
      name: '✅ Valid Query - With where filter',
      variables: {
        input: {
          model: 'user',
          where: {
            isActive: { equals: true }
          },
          pagination: {
            page: 0,
            limit: 10,
            sortBy: 'createdAt',
            sortOrder: 'desc'
          }
        }
      },
      shouldPass: true
    },
    {
      name: '❌ Invalid Query - Missing model',
      variables: {
        input: {
          where: {},
          pagination: {
            page: 0,
            limit: 20
          }
        }
      },
      shouldPass: false
    },
    {
      name: '❌ Invalid Query - Invalid model type',
      variables: {
        input: {
          model: 123, // Should be string
          where: {}
        }
      },
      shouldPass: false
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
          query: DYNAMIC_FIND_MANY_QUERY,
          variables: testCase.variables
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          validateStatus: () => true // Don't throw on any status
        }
      );

      if (response.data.errors) {
        if (testCase.shouldPass) {
          console.log('❌ FAILED - Expected success but got errors:');
          console.log(JSON.stringify(response.data.errors, null, 2));
          failedTests++;
        } else {
          console.log('✅ PASSED - Correctly rejected invalid input');
          console.log('Error:', response.data.errors[0].message);
          passedTests++;
        }
      } else {
        if (testCase.shouldPass) {
          const result = response.data.data.dynamicFindMany;
          console.log('✅ PASSED - Query executed successfully');
          console.log('Result type:', typeof result);
          if (result && result.data) {
            console.log('Records returned:', result.data.length);
            console.log('Total:', result.total);
          }
          passedTests++;
        } else {
          console.log('❌ FAILED - Expected error but query succeeded');
          failedTests++;
        }
      }
    } catch (error) {
      console.log('❌ FAILED - Request error:', error.message);
      if (error.response?.data) {
        console.log('Response:', JSON.stringify(error.response.data, null, 2));
      }
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
    console.log('\n🎉 All tests passed! Bug fix successful!');
    console.log('\n✅ FindManyInput validation is working correctly with class-validator decorators');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.');
    process.exit(1);
  }
}

// Run tests
testDynamicFindMany().catch(error => {
  console.error('\n💥 Test execution failed:', error);
  process.exit(1);
});
