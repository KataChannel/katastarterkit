import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Zalo Platform Site Verification File
 * Route: /zalo_verifierMeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp.html
 * 
 * This route serves the Zalo verification file for domain verification
 * Required by Zalo to verify ownership of the domain
 */
export async function GET() {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta property="zalo-platform-site-verification" content="MeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp" />
</head>

<body>
There Is No Limit To What You Can Accomplish Using Zalo!
</body>

</html>`;

  return new NextResponse(htmlContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
