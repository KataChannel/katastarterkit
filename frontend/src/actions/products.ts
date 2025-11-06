'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { Sanpham, Prisma } from '@prisma/client'

// ============================================================================
// PRODUCT QUERIES
// ============================================================================

export async function getProducts(options?: {
  skip?: number
  take?: number
  where?: Prisma.SanphamWhereInput
  orderBy?: Prisma.SanphamOrderByWithRelationInput
  include?: Prisma.SanphamInclude
}) {
  try {
    const products = await prisma.sanpham.findMany({
      skip: options?.skip,
      take: options?.take,
      where: options?.where,
      orderBy: options?.orderBy ?? { createdAt: 'desc' },
      include: options?.include ?? {
        category: true,
        images: true,
      },
    })

    const total = await prisma.sanpham.count({
      where: options?.where,
    })

    return {
      success: true,
      data: products,
      total,
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return {
      success: false,
      error: 'Failed to fetch products',
    }
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.sanpham.findUnique({
      where: { slug },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    })

    if (!product) {
      return {
        success: false,
        error: 'Product not found',
      }
    }

    return {
      success: true,
      data: product,
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    return {
      success: false,
      error: 'Failed to fetch product',
    }
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.sanpham.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    })

    if (!product) {
      return {
        success: false,
        error: 'Product not found',
      }
    }

    return {
      success: true,
      data: product,
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    return {
      success: false,
      error: 'Failed to fetch product',
    }
  }
}

// ============================================================================
// PRODUCT MUTATIONS
// ============================================================================

export async function createProduct(data: Prisma.SanphamCreateInput) {
  try {
    const product = await prisma.sanpham.create({
      data,
      include: {
        category: true,
        images: true,
      },
    })

    revalidatePath('/admin/products')
    revalidatePath('/san-pham')

    return {
      success: true,
      data: product,
    }
  } catch (error) {
    console.error('Error creating product:', error)
    return {
      success: false,
      error: 'Failed to create product',
    }
  }
}

export async function updateProduct(
  id: string,
  data: Prisma.SanphamUpdateInput
) {
  try {
    const product = await prisma.sanpham.update({
      where: { id },
      data,
      include: {
        category: true,
        images: true,
      },
    })

    revalidatePath('/admin/products')
    revalidatePath('/san-pham')
    revalidatePath(`/san-pham/${product.slug}`)

    return {
      success: true,
      data: product,
    }
  } catch (error) {
    console.error('Error updating product:', error)
    return {
      success: false,
      error: 'Failed to update product',
    }
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.sanpham.delete({
      where: { id },
    })

    revalidatePath('/admin/products')
    revalidatePath('/san-pham')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error deleting product:', error)
    return {
      success: false,
      error: 'Failed to delete product',
    }
  }
}

// ============================================================================
// SEARCH & FILTERS
// ============================================================================

export async function searchProducts(query: string, options?: {
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  skip?: number
  take?: number
}) {
  try {
    const where: Prisma.SanphamWhereInput = {
      AND: [
        {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { sku: { contains: query, mode: 'insensitive' } },
          ],
        },
        options?.categoryId ? { categoryId: options.categoryId } : {},
        options?.minPrice ? { price: { gte: options.minPrice } } : {},
        options?.maxPrice ? { price: { lte: options.maxPrice } } : {},
      ],
    }

    const products = await prisma.sanpham.findMany({
      where,
      skip: options?.skip,
      take: options?.take ?? 20,
      include: {
        category: true,
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const total = await prisma.sanpham.count({ where })

    return {
      success: true,
      data: products,
      total,
    }
  } catch (error) {
    console.error('Error searching products:', error)
    return {
      success: false,
      error: 'Failed to search products',
    }
  }
}
