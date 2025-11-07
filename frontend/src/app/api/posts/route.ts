import { NextRequest, NextResponse } from 'next/server'
import { getPosts, searchPosts } from '@/actions/posts'

export const dynamic = 'force-dynamic'

/**
 * GET /api/posts
 * Get list of posts/blogs with pagination and filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    
    // Search
    const query = searchParams.get('q') || ''
    
    // Filters
    const categoryId = searchParams.get('categoryId') || undefined
    const authorId = searchParams.get('authorId') || undefined
    const status = searchParams.get('status') || undefined
    
    let result
    
    if (query) {
      // Search posts
      result = await searchPosts(query, {
        categoryId,
        authorId,
        status,
        skip,
        take: limit,
      })
    } else {
      // Get all posts
      result = await getPosts({
        skip,
        take: limit,
        where: {
          ...(categoryId && { categoryId }),
          ...(authorId && { authorId }),
          ...(status && { status: status as any }),
        },
      })
    }
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      data: result.data,
      pagination: {
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil((result.total || 0) / limit),
      },
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
