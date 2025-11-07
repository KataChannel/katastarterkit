'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { Prisma } from '@prisma/client'

// ============================================================================
// POST/BLOG QUERIES
// ============================================================================

export async function getPosts(options?: {
  skip?: number
  take?: number
  where?: Prisma.PostWhereInput
  orderBy?: Prisma.PostOrderByWithRelationInput
  include?: Prisma.PostInclude
}) {
  try {
    const posts = await prisma.post.findMany({
      skip: options?.skip,
      take: options?.take ?? 10,
      where: options?.where,
      orderBy: options?.orderBy ?? { createdAt: 'desc' },
      include: options?.include ?? {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
          },
        },
        category: true,
        tags: true,
      },
    })

    const total = await prisma.post.count({
      where: options?.where,
    })

    return {
      success: true,
      data: posts,
      total,
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return {
      success: false,
      error: 'Failed to fetch posts',
    }
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const post = await prisma.post.findFirst({
      where: {
        slug,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
          },
        },
        category: true,
        tags: true,
      },
    })

    if (!post) {
      return {
        success: false,
        error: 'Post not found',
      }
    }

    // Increment view count
    await prisma.post.update({
      where: { id: post.id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })

    return {
      success: true,
      data: post,
    }
  } catch (error) {
    console.error('Error fetching post:', error)
    return {
      success: false,
      error: 'Failed to fetch post',
    }
  }
}

export async function getPostById(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
          },
        },
        category: true,
        tags: true,
      },
    })

    if (!post) {
      return {
        success: false,
        error: 'Post not found',
      }
    }

    return {
      success: true,
      data: post,
    }
  } catch (error) {
    console.error('Error fetching post:', error)
    return {
      success: false,
      error: 'Failed to fetch post',
    }
  }
}

// ============================================================================
// POST MUTATIONS
// ============================================================================

export async function createPost(data: Prisma.PostCreateInput) {
  try {
    const post = await prisma.post.create({
      data,
      include: {
        author: true,
        category: true,
        tags: true,
      },
    })

    revalidatePath('/admin/blog')
    revalidatePath('/bai-viet')

    return {
      success: true,
      data: post,
    }
  } catch (error) {
    console.error('Error creating post:', error)
    return {
      success: false,
      error: 'Failed to create post',
    }
  }
}

export async function updatePost(
  id: string,
  data: Prisma.PostUpdateInput
) {
  try {
    const post = await prisma.post.update({
      where: { id },
      data,
      include: {
        author: true,
        category: true,
        tags: true,
      },
    })

    revalidatePath('/admin/blog')
    revalidatePath('/bai-viet')
    revalidatePath(`/bai-viet/${post.slug}`)

    return {
      success: true,
      data: post,
    }
  } catch (error) {
    console.error('Error updating post:', error)
    return {
      success: false,
      error: 'Failed to update post',
    }
  }
}

export async function deletePost(id: string) {
  try {
    // Hard delete (schema không có deletedAt)
    await prisma.post.delete({
      where: { id },
    })

    revalidatePath('/admin/blog')
    revalidatePath('/bai-viet')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error deleting post:', error)
    return {
      success: false,
      error: 'Failed to delete post',
    }
  }
}

// ============================================================================
// SEARCH & FILTERS
// ============================================================================

export async function searchPosts(query: string, options?: {
  categoryId?: string
  tagIds?: string[]
  authorId?: string
  status?: string
  skip?: number
  take?: number
}) {
  try {
    const where: Prisma.PostWhereInput = {
      AND: [
        {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
            { excerpt: { contains: query, mode: 'insensitive' } },
          ],
        },
        options?.categoryId ? { categoryId: options.categoryId } : {},
        options?.authorId ? { authorId: options.authorId } : {},
        options?.status ? { status: options.status as any } : {},
        options?.tagIds ? {
          tags: {
            some: {
              id: {
                in: options.tagIds,
              },
            },
          },
        } : {},
      ],
    }

    const posts = await prisma.post.findMany({
      where,
      skip: options?.skip,
      take: options?.take ?? 20,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
          },
        },
        category: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const total = await prisma.post.count({ where })

    return {
      success: true,
      data: posts,
      total,
    }
  } catch (error) {
    console.error('Error searching posts:', error)
    return {
      success: false,
      error: 'Failed to search posts',
    }
  }
}
