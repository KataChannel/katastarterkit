// Test admin login and GraphQL operations
const BASE_URL = 'http://localhost:4000/graphql';

// Test login mutation
const loginMutation = `
  mutation LoginUser($input: LoginUserInput!) {
    loginUser(input: $input) {
      user {
        id
        email
        username
        roleType
      }
      token
    }
  }
`;

// Test admin operations
const searchUsersQuery = `
  query SearchUsers($input: SearchUsersInput!) {
    searchUsers(input: $input) {
      users {
        id
        email
        username
        roleType
      }
      total
    }
  }
`;

const getUserStatsQuery = `
  query GetUserStats($input: UserStatsInput!) {
    getUserStats(input: $input) {
      totalUsers
      activeUsers
      newUsersToday
      roleDistribution {
        role
        count
      }
    }
  }
`;

async function testAdminOperations() {
  console.log('🚀 Testing admin GraphQL operations...');
  
  try {
    // 1. Login as admin
    console.log('\n1. Testing admin login...');
    const loginResponse = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: loginMutation,
        variables: {
          input: {
            email: 'admin@rausachcore.dev',
            password: 'admin123'
          }
        }
      })
    });
    
    const loginResult = await loginResponse.json();
    console.log('Login result:', JSON.stringify(loginResult, null, 2));
    
    if (loginResult.errors) {
      console.error('❌ Login failed:', loginResult.errors);
      return;
    }
    
    const token = loginResult.data.loginUser.token;
    const user = loginResult.data.loginUser.user;
    
    console.log(`✅ Login successful! Admin user role: ${user.roleType}`);
    
    // 2. Test searchUsers with admin token
    console.log('\n2. Testing searchUsers operation...');
    const searchResponse = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query: searchUsersQuery,
        variables: {
          input: {
            query: '',
            limit: 10,
            offset: 0
          }
        }
      })
    });
    
    const searchResult = await searchResponse.json();
    console.log('SearchUsers result:', JSON.stringify(searchResult, null, 2));
    
    // 3. Test getUserStats with admin token  
    console.log('\n3. Testing getUserStats operation...');
    const statsResponse = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query: getUserStatsQuery,
        variables: {
          input: {
            startDate: '2024-01-01',
            endDate: new Date().toISOString().split('T')[0]
          }
        }
      })
    });
    
    const statsResult = await statsResponse.json();
    console.log('GetUserStats result:', JSON.stringify(statsResult, null, 2));
    
    if (searchResult.data && !searchResult.errors && 
        statsResult.data && !statsResult.errors) {
      console.log('\n🎉 SUCCESS! All admin GraphQL operations are working correctly!');
      console.log('✅ Admin user can access searchUsers');
      console.log('✅ Admin user can access getUserStats');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAdminOperations();