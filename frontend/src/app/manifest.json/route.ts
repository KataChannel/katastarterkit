import { NextRequest, NextResponse } from 'next/server';
import { 
  getManifestConfigForDomain, 
  defaultManifestIcons 
} from '@/config/manifest.config';

export async function GET(request: NextRequest) {
  const host = request.headers.get('host') || 'localhost';
  const config = getManifestConfigForDomain(host);

  const manifest = {
    name: config.name,
    short_name: config.short_name,
    description: config.description,
    version: '1.0.0',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    theme_color: config.theme_color,
    background_color: config.background_color,
    scope: '/',
    lang: config.lang,
    dir: 'ltr',
    categories: config.categories,
    icons: config.icons || defaultManifestIcons,
    shortcuts: config.shortcuts || [],
    share_target: {
      action: '/share',
      method: 'POST',
      enctype: 'multipart/form-data',
      params: {
        title: 'title',
        text: 'text',
        url: 'url'
      }
    },
    capture_links: 'new-client',
    display_override: ['window-controls-overlay', 'minimal-ui'],
    permissions: [
      'notifications',
      'push',
      'background-sync'
    ]
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=3600' // Cache 1 hour
    }
  });
}
