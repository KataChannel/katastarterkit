/**
 * Tags API Route Handler
 * GET /api/tags - List all tags
 * GET /api/tags?popular=true&limit=20 - Get popular tags
 */

import { NextRequest, NextResponse } from 'next/server'
import { getTags, getPopularTags } from '@/actions/category-tag.actions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const popular = searchParams.get('popular') === 'true'
    const limit = parseInt(searchParams.get('limit') || '20')

    const tags = popular ? await getPopularTags(limit) : await getTags()

    return NextResponse.json({
      success: true,
      data: tags,
    })
  } catch (error) {
    console.error('Tags API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
