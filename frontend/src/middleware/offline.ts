import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Whitelist paths that should always be accessible
const WHITELIST_PATHS = [
  '/api',
  '/admin',
  '/_next',
  '/favicon.ico',
  '/assets',
  '/maintenance', // Maintenance page itself
];

/**
 * Middleware to handle offline mode
 * Redirects to maintenance page when site.offline is true
 */
export async function offlineMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip whitelist paths
  if (WHITELIST_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  try {
    // Check if site is offline by calling GraphQL API
    const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:12001/graphql';
    
    const response = await fetch(graphqlUrl, {
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
            }
          }
        `,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.next();
    }

    const { data, errors } = await response.json();
    
    if (errors) {
      return NextResponse.next();
    }

    const settings = data?.publicWebsiteSettings || [];

    // Find offline setting
    const offlineSetting = settings.find((s: any) => s.key === 'site.offline');
    const redirectUrlSetting = settings.find((s: any) => s.key === 'site.offline_redirect_url');

    // Handle both boolean and string values
    const isOffline = offlineSetting?.value === 'true' || offlineSetting?.value === true;
    const redirectUrl = redirectUrlSetting?.value || '/maintenance';

    // If site is offline and not already on redirect page
    if (isOffline && pathname !== redirectUrl && !pathname.startsWith(redirectUrl)) {
      // Check if redirect URL is external
      if (redirectUrl.startsWith('http://') || redirectUrl.startsWith('https://')) {
        return NextResponse.redirect(redirectUrl, { status: 307 });
      } else {
        // Internal redirect
        const url = request.nextUrl.clone();
        url.pathname = redirectUrl;
        return NextResponse.redirect(url, { status: 307 });
      }
    }

    // If site is NOT offline but user is on maintenance page, redirect to home
    if (!isOffline && (pathname === redirectUrl || pathname.startsWith('/maintenance'))) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('[Offline Middleware] Error:', error);
    // On error, allow access (fail open)
    return NextResponse.next();
  }
}
