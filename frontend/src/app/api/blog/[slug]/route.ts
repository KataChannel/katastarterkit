/**
 * Single Blog Post API Route Handler
 * GET /api/blog/[slug] - Get post by slug
 */

import { NextRequest, NextResponse } from 'next/server'
import { getBlogPostBySlug } from '@/actions/blog.actions'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await getBlogPostBySlug(params.slug)

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Only return published posts for public API
    if (post.status !== 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: post,
    })
  } catch (error) {
    console.error('Blog API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
