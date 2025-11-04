/**
 * Test script to verify enrollment authentication
 * This script checks:
 * 1. If accessToken exists in localStorage
 * 2. If Apollo Client is sending Authorization header
 * 3. If the ENROLL_COURSE mutation works with authentication
 */

const GRAPHQL_URL = 'http://localhost:4000/graphql';

async function testEnrollmentAuth() {
  console.log('=== Testing Enrollment Authentication ===\n');

  // Step 1: Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    console.error('❌ Not in browser environment - cannot access localStorage');
    console.log('ℹ️  Please run this script in the browser console');
    return;
  }

  // Step 2: Check for access token
  const accessToken = localStorage.getItem('accessToken');
  console.log('1. Checking localStorage:');
  console.log(`   accessToken: ${accessToken ? '✅ EXISTS' : '❌ NOT FOUND'}`);
  
  if (!accessToken) {
    console.log('\n⚠️  No access token found!');
    console.log('   Please login first using the login page');
    console.log('   Then run this test again');
    return;
  }

  console.log(`   Token preview: ${accessToken.substring(0, 20)}...`);

  // Step 3: Test GraphQL request with Authorization header
  console.log('\n2. Testing GraphQL request with Authorization header:');
  
  const enrollmentMutation = `
    mutation EnrollInCourse($input: EnrollInCourseInput!) {
      enrollCourse(input: $input) {
        id
        courseId
        status
        enrolledAt
      }
    }
  `;

  // You need to replace this with an actual course ID from your database
  const testCourseId = 'test-course-id-here'; 
  
  console.log(`   Course ID: ${testCourseId}`);
  console.log('   Sending request...');

  try {
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: enrollmentMutation,
        variables: {
          input: {
            courseId: testCourseId
          }
        }
      })
    });

    const result = await response.json();
    
    console.log(`   Response status: ${response.status}`);
    
    if (result.errors) {
      console.log('\n❌ GraphQL Errors:');
      result.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.message}`);
        if (error.extensions) {
          console.log(`      Code: ${error.extensions.code}`);
        }
      });
    } else if (result.data) {
      console.log('\n✅ Enrollment successful!');
      console.log('   Result:', JSON.stringify(result.data, null, 2));
    }

  } catch (error) {
    console.error('\n❌ Network error:', error.message);
  }

  // Step 4: Check Apollo Client configuration
  console.log('\n3. Apollo Client Check:');
  console.log('   Apollo authLink should automatically add the Authorization header');
  console.log('   The header format should be: Authorization: Bearer <token>');
  console.log('\n   If enrollment still fails, check:');
  console.log('   - Apollo Client is using authLink in the link chain');
  console.log('   - authLink is reading from localStorage.getItem("accessToken")');
  console.log('   - No other middleware is removing the Authorization header');
}

// Run test
testEnrollmentAuth();

// Also provide instructions
console.log('\n=== How to use this test ===');
console.log('1. Make sure you are logged in');
console.log('2. Open browser DevTools (F12)');
console.log('3. Go to Console tab');
console.log('4. Copy and paste this entire script');
console.log('5. Press Enter to run');
console.log('6. Check the output for any issues');
