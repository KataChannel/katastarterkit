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
    const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:12001/graphql';
    
    const response = await fetch(graphqlUrl, {
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

    // Find homepage setting
    const homepageSetting = settings.find((s: any) => s.key === 'site.homepage_url');
    const homepageUrl = homepageSetting?.value?.trim();

    // Logic: If homepage_url has value (not null, undefined, empty, or "/")
    // then redirect to that URL
    if (!homepageUrl || homepageUrl === '' || homepageUrl === '/') {
      // No custom homepage or root path => no redirect
      return NextResponse.next();
    }

    // Has custom homepage URL => perform redirect
    // Check if redirect URL is external
    if (homepageUrl.startsWith('http://') || homepageUrl.startsWith('https://')) {
      // External redirect
      return NextResponse.redirect(homepageUrl);
    } else {
      // Internal redirect
      const url = request.nextUrl.clone();
      url.pathname = homepageUrl;
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.error('[Homepage Middleware] Error:', error);
    // On error, allow access (fail open)
    return NextResponse.next();
  }
}
