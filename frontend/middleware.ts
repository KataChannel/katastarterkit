import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { offlineMiddleware } from './src/middleware/offline';
import { homepageMiddleware } from './src/middleware/homepage';

export async function middleware(request: NextRequest) {
  // Run offline middleware first (higher priority)
  const offlineResponse = await offlineMiddleware(request);
  if (offlineResponse.status !== 200) {
    return offlineResponse;
  }

  // Run homepage middleware
  const homepageResponse = await homepageMiddleware(request);
  if (homepageResponse.status !== 200) {
    return homepageResponse;
  }

  // Add more middleware here if needed
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
