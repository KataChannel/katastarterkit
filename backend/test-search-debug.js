const axios = require('axios');

const GRAPHQL_URL = 'http://localhost:14000/graphql';

// Test queries
const HEALTH_CHECK_QUERY = {
  query: `
    query {
      oramaHealthCheck {
        status
        indexes
      }
    }
  `
};

const UNIVERSAL_SEARCH_QUERY = {
  query: `
    query($input: OramaSearchInput!) {
      universalSearch(input: $input) {
        tasks {
          hits {
            id
            score
            document
          }
          count
          elapsed {
            formatted
          }
        }
        users {
          hits {
            id
            score
            document
          }
          count
          elapsed {
            formatted
          }
        }
        projects {
          hits {
            id
            score
            document
          }
          count
          elapsed {
            formatted
          }
        }
        affiliateCampaigns {
          hits {
            id
            score
            document
          }
          count
          elapsed {
            formatted
          }
        }
        affiliateLinks {
          hits {
            id
            score
            document
          }
          count
          elapsed {
            formatted
          }
        }
      }
    }
  `,
  variables: {
    input: {
      term: "tìm kiếm",
      limit: 5
    }
  }
};

async function testGraphQL() {
  console.log('🔍 Testing GraphQL Orama Search Integration...\n');

  try {
    // Test 1: Health check (no auth required)
    console.log('📋 Test 1: Health Check');
    const healthResponse = await axios.post(GRAPHQL_URL, HEALTH_CHECK_QUERY, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ Health Check Result:', JSON.stringify(healthResponse.data, null, 2));
    console.log('');

    // Test 2: Universal search (auth required) - WITHOUT token
    console.log('📋 Test 2: Universal Search (No Auth)');
    try {
      const searchResponse = await axios.post(GRAPHQL_URL, UNIVERSAL_SEARCH_QUERY, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('❌ Unexpected success:', JSON.stringify(searchResponse.data, null, 2));
    } catch (error) {
      if (error.response) {
        console.log('✅ Expected auth error:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.log('❌ Network error:', error.message);
      }
    }
    console.log('');

    // Test 3: Try to get a JWT token (login first)
    console.log('📋 Test 3: Get JWT Token');
    const loginQuery = {
      query: `
        mutation($input: LoginUserInput!) {
          loginUser(input: $input) {
            accessToken
            user {
              id
              email
              username
              firstName
              lastName
            }
          }
        }
      `,
      variables: {
        input: {
          emailOrUsername: "admin@kata.com",
          password: "admin123"
        }
      }
    };

    let jwtToken = null;
    try {
      const loginResponse = await axios.post(GRAPHQL_URL, loginQuery, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (loginResponse.data.data && loginResponse.data.data.loginUser) {
        jwtToken = loginResponse.data.data.loginUser.accessToken;
        console.log('✅ Login successful, got JWT token');
        console.log('👤 User:', loginResponse.data.data.loginUser.user);
      } else {
        console.log('❌ Login failed:', JSON.stringify(loginResponse.data, null, 2));
      }
    } catch (error) {
      if (error.response) {
        console.log('❌ Login error:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.log('❌ Login network error:', error.message);
      }
    }
    console.log('');

    // Test 4: Universal search with JWT token
    if (jwtToken) {
      console.log('📋 Test 4: Universal Search (With Auth)');
      try {
        const authenticatedSearchResponse = await axios.post(GRAPHQL_URL, UNIVERSAL_SEARCH_QUERY, {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
          }
        });
        console.log('✅ Authenticated search successful!');
        console.log('📊 Results:', JSON.stringify(authenticatedSearchResponse.data, null, 2));
      } catch (error) {
        if (error.response) {
          console.log('❌ Authenticated search error:', JSON.stringify(error.response.data, null, 2));
        } else {
          console.log('❌ Authenticated search network error:', error.message);
        }
      }
    } else {
      console.log('❌ Skipping authenticated search test - no JWT token');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testGraphQL();