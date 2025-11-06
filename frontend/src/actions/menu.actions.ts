/**
 * Server Actions for Menu Management
 * Next.js Full-Stack Architecture
 */

'use server'

import { prisma } from '../lib/prisma'
import { cache } from '../lib/redis'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '../lib/auth'

// ============================================
// GET ACTIONS (Public + Cached)
// ============================================

/**
 * Get public menus (no authentication required)
 * Used for website header, footer navigation
 */
export async function getPublicMenus({
  menuId,
  isActive = true,
  includeChildren = true,
}: {
  menuId?: string
  isActive?: boolean
  includeChildren?: boolean
} = {}) {
  const cacheKey = `menus:public:${menuId || 'all'}:${isActive}:${includeChildren}`

  // Try cache first
  const cached = await cache.get(cacheKey)
  if (cached) return cached

  const where: any = { parentId: null } // Only get top-level items
  if (menuId) where.menuId = menuId
  if (isActive !== undefined) where.isActive = isActive

  const menus = await prisma.menuItem.findMany({
    where,
    orderBy: { order: 'asc' },
    include: includeChildren
      ? {
          children: {
            where: { isActive: true },
            orderBy: { order: 'asc' },
            include: {
              children: {
                where: { isActive: true },
                orderBy: { order: 'asc' },
              },
            },
          },
        }
      : undefined,
  })

  await cache.set(cacheKey, menus, 600) // Cache 10 minutes
  return menus
}

/**
 * Get menu by ID
 */
export async function getMenuById(id: string, includeChildren = true) {
  const cacheKey = `menu:id:${id}:${includeChildren}`

  const cached = await cache.get(cacheKey)
  if (cached) return cached

  const menu = await prisma.menuItem.findUnique({
    where: { id },
    include: includeChildren
      ? {
          children: {
            orderBy: { order: 'asc' },
            include: {
              children: {
                orderBy: { order: 'asc' },
              },
            },
          },
        }
      : undefined,
  })

  if (!menu) return null

  await cache.set(cacheKey, menu, 300)
  return menu
}

// ============================================
// MUTATION ACTIONS (Require Auth)
// ============================================

/**
 * Create menu item
 */
export async function createMenu(data: {
  title: string
  menuId: string
  parentId?: string
  url?: string
  pageId?: string
  target?: string
  icon?: string
  order?: number
  isActive?: boolean
}) {
  const user = await requireAuth()

  const menu = await prisma.menuItem.create({
    data: {
      ...data,
      order: data.order || 0,
      isActive: data.isActive ?? true,
      createdById: user.id,
    },
    include: {
      children: true,
    },
  })

  // Invalidate cache
  await cache.invalidatePattern('menus:*')
  await cache.invalidatePattern('menu:*')
  revalidatePath('/admin/menu')

  return menu
}

/**
 * Update menu item
 */
export async function updateMenu(
  id: string,
  data: {
    title?: string
    menuId?: string
    parentId?: string
    url?: string
    pageId?: string
    target?: string
    icon?: string
    order?: number
    isActive?: boolean
  }
) {
  await requireAuth()

  const menu = await prisma.menuItem.update({
    where: { id },
    data,
    include: {
      children: true,
    },
  })

  // Invalidate cache
  await cache.invalidatePattern('menus:*')
  await cache.invalidatePattern('menu:*')
  await cache.del(`menu:id:${id}`)
  revalidatePath('/admin/menu')

  return menu
}

/**
 * Delete menu item
 */
export async function deleteMenu(id: string) {
  await requireAuth()

  await prisma.menuItem.delete({
    where: { id },
  })

  // Invalidate cache
  await cache.invalidatePattern('menus:*')
  await cache.invalidatePattern('menu:*')
  revalidatePath('/admin/menu')

  return { success: true }
}

/**
 * Toggle menu active status
 */
export async function toggleMenuActive(id: string) {
  await requireAuth()

  const menu = await prisma.menuItem.findUnique({ where: { id } })
  if (!menu) throw new Error('Menu not found')

  const updated = await prisma.menuItem.update({
    where: { id },
    data: { isActive: !menu.isActive },
  })

  // Invalidate cache
  await cache.invalidatePattern('menus:*')
  await cache.del(`menu:id:${id}`)
  revalidatePath('/admin/menu')

  return updated
}
