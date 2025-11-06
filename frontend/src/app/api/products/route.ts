import { NextRequest, NextResponse } from 'next/server'
import { getProducts, searchProducts } from '@/actions/products'

export const dynamic = 'force-dynamic'

/**
 * GET /api/products
 * Get list of products with pagination and filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit
    
    // Search
    const query = searchParams.get('q') || ''
    
    // Filters
    const categoryId = searchParams.get('categoryId') || undefined
    const minPrice = searchParams.get('minPrice') 
      ? parseFloat(searchParams.get('minPrice')!) 
      : undefined
    const maxPrice = searchParams.get('maxPrice')
      ? parseFloat(searchParams.get('maxPrice')!)
      : undefined
    
    let result
    
    if (query) {
      // Search products
      result = await searchProducts(query, {
        categoryId,
        minPrice,
        maxPrice,
        skip,
        take: limit,
      })
    } else {
      // Get all products
      result = await getProducts({
        skip,
        take: limit,
        where: {
          ...(categoryId && { categoryId }),
          ...(minPrice && { price: { gte: minPrice } }),
          ...(maxPrice && { price: { lte: maxPrice } }),
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
