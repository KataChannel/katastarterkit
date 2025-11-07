/**
 * Single Page API Route Handler
 * GET /api/pages/[slug] - Get page by slug
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPageBySlug } from '@/actions/page.actions'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const page = await getPageBySlug(slug)

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }

    // Only return published pages
    if (!(page as any).isPublished) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: page,
    })
  } catch (error) {
    console.error('Page API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
