/**
 * Server Actions for Category & Tag Management
 * Next.js Full-Stack Architecture
 */

'use server'

import { prisma } from '../lib/prisma'
import { cache } from '../lib/redis'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '../lib/auth'
import slugify from 'slugify'

// ============================================
// CATEGORY ACTIONS
// ============================================

/**
 * Get all categories (with caching)
 */
export async function getCategories() {
  const cacheKey = 'categories:all'

  const cached = await cache.get<any>(cacheKey)
  if (cached) return cached

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  })

  await cache.set(cacheKey, categories, 600) // 10 minutes

  return categories
}

/**
 * Get categories with hierarchy
 */
export async function getCategoriesTree() {
  const cacheKey = 'categories:tree'

  const cached = await cache.get<any>(cacheKey)
  if (cached) return cached

  const categories = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    orderBy: { order: 'asc' },
    include: {
      children: {
        where: { isActive: true },
        orderBy: { order: 'asc' },
        include: {
          _count: {
            select: { posts: true },
          },
        },
      },
      _count: {
        select: { posts: true },
      },
    },
  })

  await cache.set(cacheKey, categories, 600)

  return categories
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string) {
  const cacheKey = `category:slug:${slug}`

  const cached = await cache.get<any>(cacheKey)
  if (cached) return cached

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      children: {
        where: { isActive: true },
        orderBy: { order: 'asc' },
      },
      parent: true,
      _count: {
        select: { posts: true },
      },
    },
  })

  if (!category) return null

  await cache.set(cacheKey, category, 600)

  return category
}

/**
 * Create category
 */
export async function createCategory(data: {
  name: string
  slug?: string
  description?: string
  parentId?: string
  icon?: string
  order?: number
}) {
  const user = await requireAuth()

  const slug = data.slug || slugify(data.name, { lower: true, strict: true })

  // Check if slug exists
  const existing = await prisma.category.findUnique({ where: { slug } })
  if (existing) {
    throw new Error('Category with this slug already exists')
  }

  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      parentId: data.parentId,
      icon: data.icon,
      order: data.order || 0,
    },
  })

  // Invalidate cache
  await cache.invalidatePattern('categories:*')

  revalidatePath('/blog')
  revalidatePath('/admin/categories')

  return category
}

/**
 * Update category
 */
export async function updateCategory(
  id: string,
  data: {
    name?: string
    slug?: string
    description?: string
    parentId?: string
    icon?: string
    order?: number
    isActive?: boolean
  }
) {
  await requireAuth()

  const existing = await prisma.category.findUnique({ where: { id } })
  if (!existing) throw new Error('Category not found')

  // Check slug uniqueness if changing
  if (data.slug && data.slug !== existing.slug) {
    const slugConflict = await prisma.category.findUnique({ where: { slug: data.slug } })
    if (slugConflict) {
      throw new Error('Category with this slug already exists')
    }
  }

  // Prevent setting itself as parent
  if (data.parentId === id) {
    throw new Error('Category cannot be its own parent')
  }

  const category = await prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      parentId: data.parentId,
      icon: data.icon,
      order: data.order,
      isActive: data.isActive,
    },
  })

  // Invalidate cache
  await cache.invalidatePattern('categories:*')
  await cache.del(`category:slug:${existing.slug}`)
  if (data.slug) {
    await cache.del(`category:slug:${data.slug}`)
  }

  revalidatePath('/blog')
  revalidatePath('/admin/categories')

  return category
}

/**
 * Delete category
 */
export async function deleteCategory(id: string) {
  await requireAuth()

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      children: true,
      _count: { select: { posts: true } },
    },
  })

  if (!category) throw new Error('Category not found')

  // Check if has children
  if (category.children.length > 0) {
    throw new Error('Cannot delete category with subcategories')
  }

  // Check if has posts
  if (category._count.posts > 0) {
    throw new Error('Cannot delete category with posts')
  }

  await prisma.category.delete({ where: { id } })

  // Invalidate cache
  await cache.invalidatePattern('categories:*')
  await cache.del(`category:slug:${category.slug}`)

  revalidatePath('/blog')
  revalidatePath('/admin/categories')

  return { success: true }
}

// ============================================
// TAG ACTIONS
// ============================================

/**
 * Get all tags
 */
export async function getTags() {
  const cacheKey = 'tags:all'

  const cached = await cache.get<any>(cacheKey)
  if (cached) return cached

  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  })

  await cache.set(cacheKey, tags, 600) // 10 minutes

  return tags
}

/**
 * Get popular tags
 */
export async function getPopularTags(limit = 20) {
  const cacheKey = `tags:popular:${limit}`

  const cached = await cache.get<any>(cacheKey)
  if (cached) return cached

  const tags = await prisma.tag.findMany({
    take: limit,
    orderBy: {
      posts: {
        _count: 'desc',
      },
    },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  })

  await cache.set(cacheKey, tags, 600)

  return tags
}

/**
 * Get tag by slug
 */
export async function getTagBySlug(slug: string) {
  const cacheKey = `tag:slug:${slug}`

  const cached = await cache.get<any>(cacheKey)
  if (cached) return cached

  const tag = await prisma.tag.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  })

  if (!tag) return null

  await cache.set(cacheKey, tag, 600)

  return tag
}

/**
 * Create tag
 */
export async function createTag(data: {
  name: string
  slug?: string
  description?: string
}) {
  const user = await requireAuth()

  const slug = data.slug || slugify(data.name, { lower: true, strict: true })

  // Check if slug exists
  const existing = await prisma.tag.findUnique({ where: { slug } })
  if (existing) {
    throw new Error('Tag with this slug already exists')
  }

  const tag = await prisma.tag.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      createdById: user.id,
    },
  })

  // Invalidate cache
  await cache.invalidatePattern('tags:*')

  revalidatePath('/blog')
  revalidatePath('/admin/tags')

  return tag
}

/**
 * Update tag
 */
export async function updateTag(
  id: string,
  data: {
    name?: string
    slug?: string
    description?: string
  }
) {
  await requireAuth()

  const existing = await prisma.tag.findUnique({ where: { id } })
  if (!existing) throw new Error('Tag not found')

  // Check slug uniqueness if changing
  if (data.slug && data.slug !== existing.slug) {
    const slugConflict = await prisma.tag.findUnique({ where: { slug: data.slug } })
    if (slugConflict) {
      throw new Error('Tag with this slug already exists')
    }
  }

  const tag = await prisma.tag.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
    },
  })

  // Invalidate cache
  await cache.invalidatePattern('tags:*')
  await cache.del(`tag:slug:${existing.slug}`)
  if (data.slug) {
    await cache.del(`tag:slug:${data.slug}`)
  }

  revalidatePath('/blog')
  revalidatePath('/admin/tags')

  return tag
}

/**
 * Delete tag
 */
export async function deleteTag(id: string) {
  await requireAuth()

  const tag = await prisma.tag.findUnique({
    where: { id },
    include: {
      _count: { select: { posts: true } },
    },
  })

  if (!tag) throw new Error('Tag not found')

  // Check if has posts
  if (tag._count.posts > 0) {
    throw new Error('Cannot delete tag with posts. Remove tag from posts first.')
  }

  await prisma.tag.delete({ where: { id } })

  // Invalidate cache
  await cache.invalidatePattern('tags:*')
  await cache.del(`tag:slug:${tag.slug}`)

  revalidatePath('/blog')
  revalidatePath('/admin/tags')

  return { success: true }
}

/**
 * Search tags by name
 */
export async function searchTags(query: string, limit = 10) {
  const tags = await prisma.tag.findMany({
    where: {
      name: {
        contains: query,
        mode: 'insensitive',
      },
    },
    take: limit,
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  })

  return tags
}
