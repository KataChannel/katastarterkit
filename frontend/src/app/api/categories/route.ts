/**
 * Categories API Route Handler
 * GET /api/categories - List all active categories
 */

import { NextRequest, NextResponse } from 'next/server'
import { getCategories, getCategoriesTree } from '@/actions/category-tag.actions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tree = searchParams.get('tree') === 'true'

    const categories = tree ? await getCategoriesTree() : await getCategories()

    return NextResponse.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
