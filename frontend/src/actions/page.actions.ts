/**
 * Server Actions for Page Management (PageBuilder)
 * Next.js Full-Stack Architecture
 */

'use server'

import { prisma } from '../lib/prisma'
import { cache } from '../lib/redis'
import { revalidatePath } from 'next/cache'
import { auth, requireAuth } from '../lib/auth'
import slugify from 'slugify'

// ============================================
// GET ACTIONS (Public + Cached)
// ============================================

/**
 * Get all pages with pagination
 */
export async function getPages({
  page = 1,
  limit = 20,
  isPublished,
}: {
  page?: number
  limit?: number
  isPublished?: boolean
} = {}) {
  const cacheKey = `pages:list:${page}:${limit}:${isPublished ?? 'all'}`

  // Try cache first
  const cached = await cache.get(cacheKey)
  if (cached) return cached

  const skip = (page - 1) * limit
  const where = isPublished !== undefined ? { isPublished } : {}

  const [pages, total] = await Promise.all([
    prisma.page.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        blocks: {
          orderBy: { order: 'asc' },
        },
      },
    }),
    prisma.page.count({ where }),
  ])

  const result = { pages, total }
  await cache.set(cacheKey, result, 300) // 5 minutes

  return result
}

/**
 * Get homepage (page with slug 'home' or first published page)
 */
export async function getHomepage() {
  const cacheKey = 'page:homepage'

  const cached = await cache.get(cacheKey)
  if (cached) return cached

  // Try to find page with slug 'home' first
  let page = await prisma.page.findFirst({
    where: {
      slug: 'home',
      isPublished: true,
    },
    include: {
      blocks: {
        orderBy: { order: 'asc' },
      },
    },
  })

  // If no 'home' page, get the first published page
  if (!page) {
    page = await prisma.page.findFirst({
      where: {
        isPublished: true,
      },
      include: {
        blocks: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })
  }

  if (!page) return null

  await cache.set(cacheKey, page, 600) // 10 minutes
  return page
}

/**
 * Get single page by slug
 */
export async function getPageBySlug(slug: string) {
  const cacheKey = `page:slug:${slug}`

  const cached = await cache.get(cacheKey)
  if (cached) return cached

  const page = await prisma.page.findUnique({
    where: { slug },
    include: {
      blocks: {
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!page) return null

  await cache.set(cacheKey, page, 600) // 10 minutes
  return page
}

/**
 * Get page by ID (for admin)
 */
export async function getPageById(id: string) {
  await requireAuth()

  const cacheKey = `page:id:${id}`
  const cached = await cache.get(cacheKey)
  if (cached) return cached

  const page = await prisma.page.findUnique({
    where: { id },
    include: {
      blocks: {
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!page) return null

  await cache.set(cacheKey, page, 300)
  return page
}

// ============================================
// MUTATION ACTIONS (Require Auth)
// ============================================

/**
 * Create new page with blocks
 */
export async function createPage(data: {
  title: string
  slug?: string
  description?: string
  metaTitle?: string
  metaDescription?: string
  isPublished?: boolean
  blocks?: Array<{
    type: string
    name: string
    content: any
    order: number
    className?: string
    styles?: any
  }>
}) {
  const user = await requireAuth()

  // Generate slug if not provided
  const slug = data.slug || slugify(data.title, { lower: true, strict: true })

  // Check if slug already exists
  const existing = await prisma.page.findUnique({ where: { slug } })
  if (existing) {
    throw new Error('Page with this slug already exists')
  }

  const page = await prisma.page.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      isPublished: data.isPublished || false,
      publishedAt: data.isPublished ? new Date() : null,
      createdById: user.id,
      blocks: {
        create: data.blocks?.map(block => ({
          type: block.type,
          name: block.name,
          content: block.content,
          order: block.order,
          className: block.className,
          styles: block.styles,
          createdById: user.id,
        })) || [],
      },
    },
    include: {
      blocks: {
        orderBy: { order: 'asc' },
      },
    },
  })

  // Invalidate cache
  await cache.invalidatePattern('pages:*')
  revalidatePath('/pages')
  revalidatePath(`/pages/${slug}`)

  return page
}

/**
 * Update page
 */
export async function updatePage(
  id: string,
  data: {
    title?: string
    slug?: string
    description?: string
    metaTitle?: string
    metaDescription?: string
    isPublished?: boolean
    blocks?: Array<{
      type: string
      name: string
      content: any
      order: number
      className?: string
      styles?: any
    }>
  }
) {
  const user = await requireAuth()

  const existing = await prisma.page.findUnique({ where: { id } })
  if (!existing) throw new Error('Page not found')

  // If slug is changing, check for conflicts
  if (data.slug && data.slug !== existing.slug) {
    const slugConflict = await prisma.page.findUnique({ where: { slug: data.slug } })
    if (slugConflict) {
      throw new Error('Page with this slug already exists')
    }
  }

  const updateData: any = {
    title: data.title,
    slug: data.slug,
    description: data.description,
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    isPublished: data.isPublished,
  }

  // Update publishedAt when isPublished changes to true
  if (data.isPublished === true && existing.isPublished !== true) {
    updateData.publishedAt = new Date()
  }

  // Handle blocks update
  if (data.blocks) {
    // Delete all existing blocks
    await prisma.block.deleteMany({ where: { pageId: id } })
    
    // Create new blocks
    updateData.blocks = {
      create: data.blocks.map(block => ({
        type: block.type,
        name: block.name,
        content: block.content,
        order: block.order,
        className: block.className,
        styles: block.styles,
        createdById: user.id,
      })),
    }
  }

  const page = await prisma.page.update({
    where: { id },
    data: updateData,
    include: {
      blocks: {
        orderBy: { order: 'asc' },
      },
    },
  })

  // Invalidate cache
  await cache.invalidatePattern('pages:*')
  await cache.del(`page:id:${id}`)
  await cache.del(`page:slug:${existing.slug}`)
  if (data.slug && data.slug !== existing.slug) {
    await cache.del(`page:slug:${data.slug}`)
  }

  // Revalidate paths
  revalidatePath('/pages')
  revalidatePath(`/pages/${existing.slug}`)
  if (data.slug && data.slug !== existing.slug) {
    revalidatePath(`/pages/${data.slug}`)
  }

  return page
}

/**
 * Delete page
 */
export async function deletePage(id: string) {
  await requireAuth()

  const page = await prisma.page.findUnique({ where: { id } })
  if (!page) throw new Error('Page not found')

  // Delete page (blocks will cascade delete)
  await prisma.page.delete({ where: { id } })

  // Invalidate cache
  await cache.invalidatePattern('pages:*')
  await cache.del(`page:id:${id}`)
  await cache.del(`page:slug:${page.slug}`)

  // Revalidate
  revalidatePath('/pages')
  revalidatePath(`/pages/${page.slug}`)

  return { success: true }
}

/**
 * Toggle page published status
 */
export async function togglePageStatus(id: string) {
  await requireAuth()

  const page = await prisma.page.findUnique({ where: { id } })
  if (!page) throw new Error('Page not found')

  const newStatus = !page.isPublished
  const publishedAt = newStatus ? new Date() : page.publishedAt

  const updated = await prisma.page.update({
    where: { id },
    data: { 
      isPublished: newStatus,
      publishedAt,
    },
    include: {
      blocks: {
        orderBy: { order: 'asc' },
      },
    },
  })

  // Invalidate cache
  await cache.invalidatePattern('pages:*')
  await cache.del(`page:id:${id}`)
  await cache.del(`page:slug:${page.slug}`)

  // Revalidate
  revalidatePath('/pages')
  revalidatePath(`/pages/${page.slug}`)

  return updated
}

/**
 * Duplicate page
 */
export async function duplicatePage(id: string) {
  const user = await requireAuth()

  const original = await prisma.page.findUnique({
    where: { id },
    include: {
      blocks: true,
    },
  })

  if (!original) throw new Error('Page not found')

  // Generate new slug
  const newSlug = `${original.slug}-copy-${Date.now()}`

  const duplicate = await prisma.page.create({
    data: {
      title: `${original.title} (Copy)`,
      slug: newSlug,
      description: original.description,
      metaTitle: original.metaTitle,
      metaDescription: original.metaDescription,
      isPublished: false, // Always start as draft
      createdById: user.id,
      blocks: {
        create: original.blocks.map(block => ({
          type: block.type,
          name: block.name,
          content: block.content as any,
          order: block.order,
          className: block.className,
          styles: block.styles as any,
          createdBy: {
            connect: { id: user.id }
          },
        })),
      },
    },
    include: {
      blocks: {
        orderBy: { order: 'asc' },
      },
    },
  })

  // Invalidate cache
  await cache.invalidatePattern('pages:*')

  // Revalidate
  revalidatePath('/pages')

  return duplicate
}
