import { NextResponse } from 'next/server';

/**
 * Google Search Console Verification File
 * Route: /googleca2f7c2a9539b58a.html
 */
export async function GET() {
  return new NextResponse('google-site-verification: googleca2f7c2a9539b58a.html', {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
