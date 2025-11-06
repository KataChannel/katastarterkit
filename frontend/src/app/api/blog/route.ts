/**
 * Blog API Route Handler
 * GET /api/blog - List all published posts
 * GET /api/blog/[slug] - Get single post by slug
 */

import { NextRequest, NextResponse } from 'next/server'
import { getBlogPosts, getBlogPostBySlug } from '@/actions/blog.actions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Get query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | undefined
    const authorId = searchParams.get('authorId') || undefined

    // Validate pagination
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      )
    }

    // Get posts
    const result = await getBlogPosts({
      page,
      limit,
      status: status || 'PUBLISHED', // Default to published only
      authorId,
    })

    return NextResponse.json({
      success: true,
      data: result.posts,
      meta: {
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
      },
    })
  } catch (error) {
    console.error('Blog API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
