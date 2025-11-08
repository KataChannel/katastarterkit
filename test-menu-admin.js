/**
 * Test script to verify admin menu Server Action
 */

const fetch = require('node-fetch');

async function testAdminMenu() {
  try {
    console.log('Testing admin menu endpoint...\n');
    
    // Test the public menus endpoint (should work without auth)
    const response = await fetch('http://localhost:14000/admin/menu', {
      method: 'GET',
      headers: {
        'Accept': 'text/html',
      },
    });
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Content-Type:', response.headers.get('content-type'));
    
    if (response.ok) {
      console.log('\n✓ Page loaded successfully!');
      const html = await response.text();
      console.log('HTML length:', html.length, 'bytes');
      
      // Check for error messages in HTML
      if (html.includes('$undefined')) {
        console.log('\n✗ Found $undefined in response - Server Action parameter issue');
      } else {
        console.log('✓ No $undefined found');
      }
      
      if (html.includes('error') || html.includes('Error')) {
        console.log('⚠ Contains error keywords');
      }
    } else {
      console.log('\n✗ Request failed');
      const text = await response.text();
      console.log('Response:', text.substring(0, 500));
    }
    
  } catch (error) {
    console.error('✗ Test failed:', error.message);
  }
}

testAdminMenu();
