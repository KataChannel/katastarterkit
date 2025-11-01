#!/usr/bin/env node

/**
 * Test script to simulate offline middleware logic
 */

const GRAPHQL_ENDPOINT = 'http://localhost:12001/graphql';

async function testOfflineFlow() {
  console.log('='.repeat(60));
  console.log('TESTING OFFLINE MIDDLEWARE FLOW');
  console.log('='.repeat(60), '\n');

  const pathname = '/';
  console.log('Simulating request to:', pathname, '\n');

  // Check whitelist
  const WHITELIST_PATHS = ['/api', '/admin', '/_next', '/favicon.ico', '/assets', '/maintenance'];
  const isWhitelisted = WHITELIST_PATHS.some(path => pathname.startsWith(path));
  console.log('Is whitelisted:', isWhitelisted);
  
  if (isWhitelisted) {
    console.log('✅ Would return NextResponse.next() (whitelisted)');
    return;
  }

  console.log('\nFetching settings from GraphQL...');

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetPublicWebsiteSettings {
            publicWebsiteSettings(keys: ["site.offline", "site.offline_redirect_url"]) {
              key
              value
            }
          }
        `,
      }),
    });

    if (!response.ok) {
      console.log('❌ GraphQL fetch failed');
      return;
    }

    const { data, errors } = await response.json();
    
    if (errors) {
      console.log('❌ GraphQL errors:', errors);
      return;
    }

    const settings = data?.publicWebsiteSettings || [];
    console.log('Settings:', settings, '\n');

    const offlineSetting = settings.find(s => s.key === 'site.offline');
    const redirectUrlSetting = settings.find(s => s.key === 'site.offline_redirect_url');

    // Handle both boolean and string values
    const isOffline = offlineSetting?.value === 'true' || offlineSetting?.value === true;
    const redirectUrl = redirectUrlSetting?.value || '/maintenance';

    console.log('📊 ANALYSIS:');
    console.log('  Offline setting value:', offlineSetting?.value);
    console.log('  Type:', typeof offlineSetting?.value);
    console.log('  === "true":', offlineSetting?.value === 'true');
    console.log('  === true:', offlineSetting?.value === true);
    console.log('  Is offline (combined):', isOffline);
    console.log('  Redirect URL:', redirectUrl);
    console.log('  Current pathname:', pathname);
    console.log('  pathname !== redirectUrl:', pathname !== redirectUrl);
    console.log('  !pathname.startsWith(redirectUrl):', !pathname.startsWith(redirectUrl));

    console.log('\n📋 DECISION:');

    // If site is offline and not already on redirect page
    if (isOffline && pathname !== redirectUrl && !pathname.startsWith(redirectUrl)) {
      console.log('✅ SHOULD REDIRECT!');
      console.log('  Reason: Site is offline');
      console.log('  Action: Redirect to', redirectUrl);
      console.log('  Status: 307');
    } 
    // If site is NOT offline but user is on maintenance page
    else if (!isOffline && (pathname === redirectUrl || pathname.startsWith('/maintenance'))) {
      console.log('✅ SHOULD REDIRECT!');
      console.log('  Reason: Site is online but on maintenance page');
      console.log('  Action: Redirect to /');
      console.log('  Status: 307');
    }
    else {
      console.log('⏭️  NO REDIRECT');
      console.log('  Action: NextResponse.next()');
      
      if (isOffline) {
        console.log('  Reason: Already on maintenance page');
      } else {
        console.log('  Reason: Site is online');
      }
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }

  console.log('\n' + '='.repeat(60));
}

testOfflineFlow();
