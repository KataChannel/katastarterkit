// API Route to test getting HEADER menus
// Access via: http://localhost:14000/api/test-header-menus

import { NextResponse } from 'next/server';
import { getPublicMenus } from '@/actions/menu.actions';

export async function GET() {
  try {
    console.log('[TEST API] Calling getPublicMenus for HEADER...');
    
    const menus = await getPublicMenus({
      type: 'HEADER',
      isActive: true,
      includeChildren: true
    });

    console.log('[TEST API] Received:', menus?.length || 0, 'menus');

    return NextResponse.json({
      success: true,
      count: menus?.length || 0,
      menus: menus?.map((m: any) => ({
        id: m.id,
        title: m.title,
        isActive: m.isActive,
        metadata: m.metadata,
      })),
    });
  } catch (error: any) {
    console.error('[TEST API] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
