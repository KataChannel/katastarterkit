#!/usr/bin/env node

/**
 * Test Orama Search GraphQL API
 * 
 * This script tests the Orama search GraphQL endpoints
 */

const query = `
  query TestHealthCheck {
    oramaHealthCheck {
      status
      indexes
    }
  }
`;

const searchQuery = `
  query TestUniversalSearch($input: OramaSearchInput!) {
    universalSearch(input: $input) {
      tasks {
        count
        hits {
          id
          score
        }
      }
      users {
        count
        hits {
          id
          score
        }
      }
    }
  }
`;

async function testHealthCheck() {
  console.log('Testing Orama Health Check...\n');
  
  try {
    const response = await fetch('http://localhost:14000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    
    if (result.errors) {
      console.error('❌ Health Check Failed:');
      console.error(JSON.stringify(result.errors, null, 2));
      return false;
    }
    
    console.log('✅ Health Check Passed:');
    console.log(JSON.stringify(result.data, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Request Failed:', error.message);
    return false;
  }
}

async function testUniversalSearch(token) {
  console.log('\n\nTesting Universal Search...\n');
  
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch('http://localhost:14000/graphql', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: searchQuery,
        variables: {
          input: {
            term: 'test',
            limit: 5
          }
        }
      }),
    });

    const result = await response.json();
    
    if (result.errors) {
      console.error('❌ Universal Search Failed:');
      console.error(JSON.stringify(result.errors, null, 2));
      
      // Check if it's an authentication error
      if (result.errors[0]?.message?.includes('Unauthorized')) {
        console.log('\n⚠️  Authentication required. Please login first.');
        console.log('You can get a token by logging in through the frontend or GraphQL playground.');
      }
      
      return false;
    }
    
    console.log('✅ Universal Search Passed:');
    console.log(JSON.stringify(result.data, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Request Failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🔍 Orama Search GraphQL API Test\n');
  console.log('================================\n');
  
  // Test health check (no auth required)
  const healthOk = await testHealthCheck();
  
  // Test universal search (requires auth)
  const token = process.env.JWT_TOKEN || process.argv[2];
  await testUniversalSearch(token);
  
  console.log('\n\n================================');
  console.log('Test Summary:');
  console.log(`  Health Check: ${healthOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log('\nNote: Universal search requires JWT authentication.');
  console.log('Pass token as: node test-orama-api.js <your-jwt-token>');
  console.log('or set JWT_TOKEN environment variable');
}

main();
