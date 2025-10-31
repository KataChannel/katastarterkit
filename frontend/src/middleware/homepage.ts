import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to handle custom homepage
 * Redirects root path (/) to custom homepage URL if configured
 */
export async function homepageMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only process root path
  if (pathname !== '/') {
    return NextResponse.next();
  }

  try {
    // Check custom homepage URL by calling GraphQL API
    const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';
    
    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // No Authorization header - use public query
      },
      body: JSON.stringify({
        query: `
          query GetPublicHomepage {
            publicWebsiteSettings(keys: ["site.homepage_url"]) {
              key
              value
            }
          }
        `,
      }),
      // Don't cache this request
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch homepage settings');
      return NextResponse.next();
    }

    const { data, errors } = await response.json();
    
    if (errors) {
      console.error('GraphQL errors:', errors);
      return NextResponse.next();
    }

    const settings = data?.publicWebsiteSettings || [];

    // Find homepage setting
    const homepageSetting = settings.find((s: any) => s.key === 'site.homepage_url');
    const homepageUrl = homepageSetting?.value;

    // If custom homepage is set and not root path
    if (homepageUrl && homepageUrl !== '/' && homepageUrl !== '') {
      // Check if redirect URL is external
      if (homepageUrl.startsWith('http://') || homepageUrl.startsWith('https://')) {
        return NextResponse.redirect(homepageUrl);
      } else {
        // Internal redirect
        const url = request.nextUrl.clone();
        url.pathname = homepageUrl;
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Error in homepage middleware:', error);
    // On error, allow access (fail open)
    return NextResponse.next();
  }
}
