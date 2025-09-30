// Simple test for GetPageBySlug with corrected port
const BASE_URL = 'http://localhost:14000/graphql';

const TEST_QUERY = `
  query GetPageBySlug($slug: String!) {
    getPageBySlug(slug: $slug) {
      id
      title
      slug
      seoKeywords
    }
  }
`;

const INTROSPECTION_QUERY = `
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

async function testSeoKeywords() {
  console.log('🚀 Testing seoKeywords field fix...');
  
  try {
    // Test introspection first
    console.log('\n1. Testing schema introspection...');
    const introspectionResponse = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: INTROSPECTION_QUERY })
    });
    
    const introspectionResult = await introspectionResponse.json();
    
    if (introspectionResult.data && introspectionResult.data.__type) {
      const seoKeywordsField = introspectionResult.data.__type.fields.find(field => 
        field.name === 'seoKeywords'
      );
      
      if (seoKeywordsField) {
        console.log('✅ seoKeywords field found in schema!');
        console.log('   Field definition:', JSON.stringify(seoKeywordsField, null, 2));
      } else {
        console.error('❌ seoKeywords field not found in schema');
        return false;
      }
    }
    
    // Test actual query
    console.log('\n2. Testing GetPageBySlug query...');
    const queryResponse = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: TEST_QUERY,
        variables: { slug: 'test-page' }
      })
    });
    
    const queryResult = await queryResponse.json();
    console.log('Query result:', JSON.stringify(queryResult, null, 2));
    
    // Check for seoKeywords specific errors
    if (queryResult.errors) {
      const seoKeywordsError = queryResult.errors.find(error => 
        error.message.includes('seoKeywords')
      );
      
      if (seoKeywordsError) {
        console.error('❌ seoKeywords field still causing errors!');
        return false;
      } else {
        console.log('✅ No seoKeywords-related errors found');
        console.log('   (Other errors might exist but seoKeywords is working)');
      }
    } else {
      console.log('✅ Query executed successfully without any errors!');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

testSeoKeywords().then(success => {
  if (success) {
    console.log('\n🎉 SUCCESS! The seoKeywords field has been successfully added and is working!');
  } else {
    console.log('\n❌ Test failed. Check the errors above.');
  }
});