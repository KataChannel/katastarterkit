// Test GetPageBySlug GraphQL query to verify seoKeywords field works
const BASE_URL = 'http://localhost:14000/graphql';

const GET_PAGE_BY_SLUG = `
  query GetPageBySlug($slug: String!) {
    getPageBySlug(slug: $slug) {
      id
      title
      slug
      content
      status
      seoTitle
      seoDescription
      seoKeywords
      createdAt
      updatedAt
      blocks {
        id
        type
        content
        style
        order
      }
    }
  }
`;

async function testGetPageBySlug() {
  console.log('🚀 Testing GetPageBySlug query with seoKeywords field...');
  
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GET_PAGE_BY_SLUG,
        variables: {
          slug: 'test-page'  // Testing with a test slug
        }
      })
    });
    
    const result = await response.json();
    console.log('Query result:', JSON.stringify(result, null, 2));
    
    if (result.errors) {
      console.error('❌ GraphQL errors found:', result.errors);
      
      // Check if the seoKeywords error is resolved
      const seoKeywordsError = result.errors.find(error => 
        error.message.includes('seoKeywords')
      );
      
      if (seoKeywordsError) {
        console.error('❌ seoKeywords field is still causing errors!');
        return false;
      } else {
        console.log('✅ seoKeywords field error is resolved, but other errors exist');
      }
    } else {
      console.log('✅ SUCCESS! GetPageBySlug query executed without errors');
      console.log('✅ seoKeywords field is now available in the GraphQL schema');
      
      if (result.data && result.data.getPageBySlug) {
        console.log('📄 Page data received with seoKeywords field');
      } else {
        console.log('📄 No page found with the test slug (expected for non-existent page)');
      }
      return true;
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Test introspection to verify schema includes seoKeywords
async function testSchemaIntrospection() {
  console.log('\n🔍 Testing GraphQL schema introspection...');
  
  const introspectionQuery = `
    query {
      __type(name: "Page") {
        fields {
          name
          type {
            name
            ofType {
              name
            }
          }
        }
      }
    }
  `;
  
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: introspectionQuery
      })
    });
    
    const result = await response.json();
    
    if (result.data && result.data.__type) {
      const seoKeywordsField = result.data.__type.fields.find(field => 
        field.name === 'seoKeywords'
      );
      
      if (seoKeywordsField) {
        console.log('✅ seoKeywords field found in schema:', seoKeywordsField);
        return true;
      } else {
        console.error('❌ seoKeywords field not found in schema');
        return false;
      }
    }
    
  } catch (error) {
    console.error('❌ Schema introspection failed:', error);
    return false;
  }
}

async function runTests() {
  const test1 = await testGetPageBySlug();
  const test2 = await testSchemaIntrospection();
  
  if (test1 && test2) {
    console.log('\n🎉 ALL TESTS PASSED! The seoKeywords field issue has been resolved.');
  } else {
    console.log('\n❌ Some tests failed. Please check the errors above.');
  }
}

runTests();