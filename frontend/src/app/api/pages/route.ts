/**
 * Pages API Route Handler
 * GET /api/pages - List all published pages
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPages } from '@/actions/page.actions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const result = await getPages({
      page,
      limit,
      isPublished: true, // Only published pages
    })

    return NextResponse.json({
      success: true,
      data: (result as any).pages || [],
      meta: {
        total: (result as any).total || 0,
        page,
        limit,
        totalPages: Math.ceil(((result as any).total || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Pages API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
