#!/usr/bin/env node

/**
 * Test script to check publicWebsiteSettings query
 */

const GRAPHQL_ENDPOINT = 'http://localhost:12001/graphql';

async function testQuery() {
  console.log('Testing publicWebsiteSettings query...\n');
  console.log('Endpoint:', GRAPHQL_ENDPOINT, '\n');

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query GetPublicHomepage {
            publicWebsiteSettings(keys: ["site.homepage_url"]) {
              key
              value
              type
            }
          }
        `,
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok, '\n');

    const result = await response.json();
    
    console.log('Full response:', JSON.stringify(result, null, 2), '\n');

    if (result.errors) {
      console.error('GraphQL Errors:', result.errors);
      return;
    }

    const settings = result.data?.publicWebsiteSettings || [];
    console.log('Settings array:', settings, '\n');

    const homepageSetting = settings.find(s => s.key === 'site.homepage_url');
    console.log('Homepage setting:', homepageSetting, '\n');

    if (homepageSetting) {
      console.log('Value:', homepageSetting.value);
      console.log('Value type:', typeof homepageSetting.value);
      console.log('Value length:', homepageSetting.value?.length);
      console.log('Value trimmed:', homepageSetting.value?.trim());
      console.log('Value === null:', homepageSetting.value === null);
      console.log('Value === undefined:', homepageSetting.value === undefined);
      console.log('Value === "":', homepageSetting.value === '');
    } else {
      console.log('❌ Setting not found!');
    }

  } catch (error) {
    console.error('Error:', error.message);
    console.error(error);
  }
}

testQuery();
