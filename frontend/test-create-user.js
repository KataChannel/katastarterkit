// Test script for adminCreateUser mutation
// Paste this into browser console after logging in as ADMIN

console.log('🧪 Testing adminCreateUser mutation...');

const token = localStorage.getItem('token');
if (!token) {
  console.error('❌ No token found - please login first');
} else {
  console.log('✅ Token found, testing adminCreateUser...');
  
  const testUserData = {
    username: `testuser_${Date.now()}`,
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    phone: '+1234567890',
    roleType: 'USER',
    isActive: true,
    isVerified: false
  };

  fetch('http://localhost:14000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      query: `
        mutation AdminCreateUser($input: AdminCreateUserInput!) {
          adminCreateUser(input: $input) {
            id
            username
            email
            firstName
            lastName
            phone
            roleType
            isActive
            isVerified
            createdAt
          }
        }
      `,
      variables: {
        input: testUserData
      }
    })
  })
  .then(response => {
    console.log('Response status:', response.status);
    return response.json();
  })
  .then(data => {
    if (data.errors) {
      console.error('❌ GraphQL errors:', data.errors);
      data.errors.forEach(error => {
        console.log('Error details:', {
          message: error.message,
          extensions: error.extensions,
          path: error.path
        });
      });
    } else if (data.data?.adminCreateUser) {
      console.log('✅ User created successfully:', data.data.adminCreateUser);
      console.log('👤 Created user details:');
      console.log(`  - ID: ${data.data.adminCreateUser.id}`);
      console.log(`  - Username: ${data.data.adminCreateUser.username}`);
      console.log(`  - Email: ${data.data.adminCreateUser.email}`);
      console.log(`  - Role: ${data.data.adminCreateUser.roleType}`);
      console.log(`  - Active: ${data.data.adminCreateUser.isActive}`);
      console.log(`  - Verified: ${data.data.adminCreateUser.isVerified}`);
    } else {
      console.warn('⚠️ Unexpected response:', data);
    }
  })
  .catch(error => {
    console.error('❌ Network error:', error);
  });
}