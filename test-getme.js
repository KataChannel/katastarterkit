const fetch = require('node-fetch');

async function testGetMe() {
  const url = 'http://localhost:4000/graphql';
  
  // First, try to login to get a valid token
  console.log('🔐 Step 1: Login to get token...\n');
  
  const loginQuery = `
    mutation Login {
      login(email: "admin@kata.vn", password: "123456") {
        user {
          id
          email
          username
          roleType
        }
        accessToken
      }
    }
  `;
  
  try {
    const loginResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: loginQuery,
      }),
    });
    
    const loginResult = await loginResponse.json();
    
    if (loginResult.errors) {
      console.error('❌ Login failed:', JSON.stringify(loginResult.errors, null, 2));
      return;
    }
    
    const token = loginResult.data.login.accessToken;
    const user = loginResult.data.login.user;
    
    console.log('✅ Login successful!');
    console.log('User:', user);
    console.log('Token:', token.substring(0, 50) + '...\n');
    
    // Now test GetCurrentUser (getMe)
    console.log('👤 Step 2: Testing GetCurrentUser query...\n');
    
    const getMeQuery = `
      query GetCurrentUser {
        getMe {
          id
          email
          username
          roleType
          avatar
          firstName
          lastName
          createdAt
          updatedAt
        }
      }
    `;
    
    const getMeResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: getMeQuery,
        operationName: 'GetCurrentUser',
      }),
    });
    
    const getMeResult = await getMeResponse.json();
    
    if (getMeResult.errors) {
      console.error('❌ GetCurrentUser failed:');
      console.error(JSON.stringify(getMeResult.errors, null, 2));
      console.error('\nFull response:', JSON.stringify(getMeResult, null, 2));
      return;
    }
    
    console.log('✅ GetCurrentUser successful!');
    console.log('Current User:', JSON.stringify(getMeResult.data.getMe, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

// Test without token
async function testWithoutToken() {
  const url = 'http://localhost:4000/graphql';
  
  console.log('\n🔒 Step 3: Testing GetCurrentUser WITHOUT token...\n');
  
  const getMeQuery = `
    query GetCurrentUser {
      getMe {
        id
        email
      }
    }
  `;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: getMeQuery,
        operationName: 'GetCurrentUser',
      }),
    });
    
    const result = await response.json();
    
    if (result.errors) {
      console.log('✅ Expected error (no token):');
      console.log(JSON.stringify(result.errors, null, 2));
    } else {
      console.log('⚠️ Unexpected success (should fail without token)');
      console.log(result);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run tests
(async () => {
  await testGetMe();
  await testWithoutToken();
})();
