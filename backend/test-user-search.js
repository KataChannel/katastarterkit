const axios = require('axios');

const GRAPHQL_URL = 'http://localhost:14000/graphql';

// Test user creation and login
async function testUserManagement() {
  console.log('🔍 Testing User Creation and Login...\n');

  try {
    // Create a test user first
    console.log('📋 Test 1: Create Test User');
    const registerQuery = {
      query: `
        mutation($input: RegisterUserInput!) {
          registerUser(input: $input) {
            accessToken
            user {
              id
              email
              username
            }
          }
        }
      `,
      variables: {
        input: {
          emailOrUsername: "test@example.com",
          password: "password123",
          firstName: "Test",
          lastName: "User"
        }
      }
    };

    try {
      const registerResponse = await axios.post(GRAPHQL_URL, registerQuery, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (registerResponse.data.data && registerResponse.data.data.registerUser) {
        console.log('✅ User created successfully');
        const jwtToken = registerResponse.data.data.registerUser.accessToken;
        console.log('🔑 Got JWT token from registration');
        
        // Now test search with this token
        console.log('\n📋 Test 2: Universal Search with Token');
        const searchQuery = {
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

        const searchResponse = await axios.post(GRAPHQL_URL, searchQuery, {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
          }
        });

        console.log('✅ Universal Search with Authentication SUCCESS!');
        console.log('📊 Search Results:', JSON.stringify(searchResponse.data, null, 2));
        
      } else {
        console.log('❌ Registration failed:', JSON.stringify(registerResponse.data, null, 2));
      }
    } catch (error) {
      if (error.response) {
        console.log('❌ Registration error:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.log('❌ Registration network error:', error.message);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testUserManagement();