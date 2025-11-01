#!/usr/bin/env node

/**
 * Test script to check offline settings
 */

const GRAPHQL_ENDPOINT = 'http://localhost:12001/graphql';

async function testOfflineSettings() {
  console.log('Testing offline settings...\n');
  console.log('Endpoint:', GRAPHQL_ENDPOINT, '\n');

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query GetPublicWebsiteSettings {
            publicWebsiteSettings(keys: ["site.offline", "site.offline_redirect_url"]) {
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

    const offlineSetting = settings.find(s => s.key === 'site.offline');
    const redirectUrlSetting = settings.find(s => s.key === 'site.offline_redirect_url');

    console.log('Offline setting:', offlineSetting);
    console.log('Redirect URL setting:', redirectUrlSetting, '\n');

    if (offlineSetting) {
      const isOffline = offlineSetting.value === 'true';
      console.log('📊 OFFLINE STATUS:');
      console.log('  Value:', offlineSetting.value);
      console.log('  Type:', typeof offlineSetting.value);
      console.log('  Is offline:', isOffline);
      console.log('  === "true":', offlineSetting.value === 'true');
      console.log('  === true:', offlineSetting.value === true);
    } else {
      console.log('❌ Offline setting not found!');
    }

    if (redirectUrlSetting) {
      console.log('\n📊 REDIRECT URL:');
      console.log('  Value:', redirectUrlSetting.value);
      console.log('  Default:', redirectUrlSetting.value || '/maintenance');
    } else {
      console.log('\n⚠️  Redirect URL setting not found, will use default: /maintenance');
    }

  } catch (error) {
    console.error('Error:', error.message);
    console.error(error);
  }
}

testOfflineSettings();
