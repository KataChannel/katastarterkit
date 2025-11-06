/**
 * Server Actions for Blog Management
 * Next.js Full-Stack Architecture
 */

'use server'

import { prisma } from '../lib/prisma'
import { cache } from '../lib/redis'
import { revalidatePath } from 'next/cache'
import { auth } from '../lib/auth'

// Types
export type BlogPost = {
  id: string
  title: string
  slug: string
  content?: string | null
  excerpt?: string | null
  thumbnail?: string | null
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  publishedAt?: Date | null
  createdAt: Date
  updatedAt: Date
  authorId: string
  author?: {
    id: string
    name: string | null
    email: string
  }
}

export type CreateBlogPostInput = {
  title: string
  content?: string
  excerpt?: string
  thumbnail?: string
  status?: 'DRAFT' | 'PUBLISHED'
}

export type UpdateBlogPostInput = Partial<CreateBlogPostInput>

// Helper: Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD') // Normalize Vietnamese characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Helper: Get authenticated user
async function getAuthUser() {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  return session.user
}

/**
 * Get all blog posts with pagination
 */
export async function getBlogPosts(params?: {
  page?: number
  limit?: number
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  authorId?: string
}) {
  try {
    const page = params?.page || 1
    const limit = params?.limit || 10
    const skip = (page - 1) * limit

    const where: any = {}
    if (params?.status) where.status = params.status
    if (params?.authorId) where.authorId = params.authorId

    // Try cache first
    const cacheKey = `blog:list:${JSON.stringify({ ...where, page, limit })}`
    const cached = await cache.get<{ posts: BlogPost[]; total: number }>(cacheKey)
    if (cached) {
      return cached
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          category: true,
          tags: true,
        },
      }),
      prisma.post.count({ where }),
    ])

    const result = { posts, total }
    
    // Cache for 5 minutes
    await cache.set(cacheKey, result, 300)

    return result
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    throw new Error('Failed to fetch blog posts')
  }
}

/**
 * Get single blog post by slug
 */
export async function getBlogPostBySlug(slug: string) {
  try {
    // Try cache first
    const cacheKey = `blog:slug:${slug}`
    const cached = await cache.get<BlogPost>(cacheKey)
    if (cached) {
      return cached
    }

    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        category: true,
        tags: true,
      },
    })

    if (!post) {
      return null
    }

    // Increment view count (don't wait)
    prisma.post
      .update({
        where: { slug },
        data: { viewCount: { increment: 1 } },
      })
      .catch(() => {}) // Ignore errors

    // Cache for 10 minutes
    await cache.set(cacheKey, post, 600)

    return post
  } catch (error) {
    console.error('Error fetching blog post:', error)
    throw new Error('Failed to fetch blog post')
  }
}

/**
 * Get blog categories
 */
export async function getBlogCategories({ includeCount = false } = {}) {
  try {
    const cacheKey = `blog:categories:${includeCount}`
    const cached = await cache.get(cacheKey)
    if (cached) return cached

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: includeCount
        ? {
            _count: {
              select: {
                posts: {
                  where: { status: 'PUBLISHED' },
                },
              },
            },
          }
        : undefined,
    })

    await cache.set(cacheKey, categories, 600)
    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

/**
 * Get related blogs (same category or tags)
 */
export async function getRelatedBlogs(postId: string, limit = 5) {
  try {
    const cacheKey = `blog:related:${postId}:${limit}`
    const cached = await cache.get(cacheKey)
    if (cached) return cached

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { tags: true },
    })

    if (!post) return []

    // Find posts with same category or tags
    const related = await prisma.post.findMany({
      where: {
        id: { not: postId },
        status: 'PUBLISHED',
        OR: [
          { categoryId: post.categoryId },
          {
            tags: {
              some: {
                id: {
                  in: post.tags.map((t) => t.id),
                },
              },
            },
          },
        ],
      },
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        category: true,
      },
    })

    await cache.set(cacheKey, related, 600)
    return related
  } catch (error) {
    console.error('Error fetching related blogs:', error)
    return []
  }
}

/**
 * Create new blog post
 */
export async function createBlogPost(input: CreateBlogPostInput) {
  try {
    const user = await getAuthUser()

    const slug = generateSlug(input.title)

    // Check if slug exists
    const existing = await prisma.post.findUnique({
      where: { slug },
    })

    if (existing) {
      return {
        success: false,
        error: 'A post with this title already exists',
      }
    }

    const post = await prisma.post.create({
      data: {
        title: input.title,
        slug,
        content: input.content,
        excerpt: input.excerpt,
        thumbnail: input.thumbnail,
        status: input.status || 'DRAFT',
        authorId: user.id,
        publishedAt: input.status === 'PUBLISHED' ? new Date() : null,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    })

    // Invalidate cache
    await cache.invalidatePattern('blog:list:*')

    // Revalidate paths
    revalidatePath('/admin/blog')
    if (post.status === 'PUBLISHED') {
      revalidatePath('/blog')
      revalidatePath(`/blog/${post.slug}`)
    }

    return {
      success: true,
      post,
    }
  } catch (error) {
    console.error('Error creating blog post:', error)
    return {
      success: false,
      error: 'Failed to create blog post',
    }
  }
}

/**
 * Update blog post
 */
export async function updateBlogPost(id: string, input: UpdateBlogPostInput) {
  try {
    const user = await getAuthUser()

    // Check ownership (unless admin)
    const existing = await prisma.post.findUnique({
      where: { id },
    })

    if (!existing) {
      return {
        success: false,
        error: 'Post not found',
      }
    }

    // Generate new slug if title changed
    let slug = existing.slug
    if (input.title && input.title !== existing.title) {
      slug = generateSlug(input.title)
      
      // Check if new slug exists
      const slugExists = await prisma.post.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      })

      if (slugExists) {
        return {
          success: false,
          error: 'A post with this title already exists',
        }
      }
    }

    const updateData: any = {
      ...input,
      slug,
      updatedAt: new Date(),
    }

    // Set publishedAt if changing to PUBLISHED
    if (input.status === 'PUBLISHED' && existing.status !== 'PUBLISHED') {
      updateData.publishedAt = new Date()
    }

    const post = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    })

    // Invalidate cache
    await cache.del(`blog:slug:${existing.slug}`)
    if (post.slug !== existing.slug) {
      await cache.del(`blog:slug:${post.slug}`)
    }
    await cache.invalidatePattern('blog:list:*')

    // Revalidate paths
    revalidatePath('/admin/blog')
    revalidatePath(`/admin/blog/${id}`)
    if (post.status === 'PUBLISHED') {
      revalidatePath('/blog')
      revalidatePath(`/blog/${post.slug}`)
    }

    return {
      success: true,
      post,
    }
  } catch (error) {
    console.error('Error updating blog post:', error)
    return {
      success: false,
      error: 'Failed to update blog post',
    }
  }
}

/**
 * Delete blog post
 */
export async function deleteBlogPost(id: string) {
  try {
    const user = await getAuthUser()

    const post = await prisma.post.findUnique({
      where: { id },
    })

    if (!post) {
      return {
        success: false,
        error: 'Post not found',
      }
    }

    await prisma.post.delete({
      where: { id },
    })

    // Invalidate cache
    await cache.del(`blog:slug:${post.slug}`)
    await cache.invalidatePattern('blog:list:*')

    // Revalidate paths
    revalidatePath('/admin/blog')
    revalidatePath('/blog')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return {
      success: false,
      error: 'Failed to delete blog post',
    }
  }
}

/**
 * Toggle blog post status
 */
export async function toggleBlogPostStatus(id: string) {
  try {
    const user = await getAuthUser()

    const post = await prisma.post.findUnique({
      where: { id },
    })

    if (!post) {
      return {
        success: false,
        error: 'Post not found',
      }
    }

    const newStatus = post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'

    const updated = await prisma.post.update({
      where: { id },
      data: {
        status: newStatus,
        publishedAt: newStatus === 'PUBLISHED' ? new Date() : null,
      },
    })

    // Invalidate cache
    await cache.del(`blog:slug:${post.slug}`)
    await cache.invalidatePattern('blog:list:*')

    // Revalidate paths
    revalidatePath('/admin/blog')
    revalidatePath('/blog')
    revalidatePath(`/blog/${post.slug}`)

    return {
      success: true,
      post: updated,
    }
  } catch (error) {
    console.error('Error toggling blog post status:', error)
    return {
      success: false,
      error: 'Failed to toggle status',
    }
  }
}
