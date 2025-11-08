/**
 * Server Actions for Block Management (PageBuilder)
 * Individual block operations for real-time editing
 */

'use server'

import { prisma } from '../lib/prisma'
import { cache } from '../lib/redis'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '../lib/auth'

// ============================================
// BLOCK CRUD OPERATIONS
// ============================================

/**
 * Add a new block to a page
 */
export async function addBlock(data: {
  pageId: string
  type: string
  name: string
  content: any
  order: number
  className?: string
  styles?: any
}) {
  const user = await requireAuth()

  const block = await prisma.block.create({
    data: {
      pageId: data.pageId,
      type: data.type,
      name: data.name,
      content: data.content,
      order: data.order,
      className: data.className,
      styles: data.styles,
      createdById: user.id,
    },
  })

  // Invalidate cache
  await cache.invalidatePattern('pages:*')
  await cache.del(`page:id:${data.pageId}`)

  // Revalidate paths
  revalidatePath('/admin/pagebuilder')
  revalidatePath(`/admin/pagebuilder/${data.pageId}`)

  return block
}

/**
 * Update an existing block
 */
export async function updateBlock(
  blockId: string,
  data: {
    type?: string
    name?: string
    content?: any
    order?: number
    className?: string
    styles?: any
  }
) {
  await requireAuth()

  // Get the block to find its pageId for cache invalidation
  const existingBlock = await prisma.block.findUnique({
    where: { id: blockId },
    select: { pageId: true },
  })

  if (!existingBlock) {
    throw new Error('Block not found')
  }

  const block = await prisma.block.update({
    where: { id: blockId },
    data: {
      ...(data.type !== undefined && { type: data.type }),
      ...(data.name !== undefined && { name: data.name }),
      ...(data.content !== undefined && { content: data.content }),
      ...(data.order !== undefined && { order: data.order }),
      ...(data.className !== undefined && { className: data.className }),
      ...(data.styles !== undefined && { styles: data.styles }),
    },
  })

  // Invalidate cache
  await cache.invalidatePattern('pages:*')
  await cache.del(`page:id:${existingBlock.pageId}`)

  // Revalidate paths
  revalidatePath('/admin/pagebuilder')
  revalidatePath(`/admin/pagebuilder/${existingBlock.pageId}`)

  return block
}

/**
 * Delete a block
 */
export async function deleteBlock(blockId: string) {
  await requireAuth()

  // Get the block to find its pageId for cache invalidation
  const existingBlock = await prisma.block.findUnique({
    where: { id: blockId },
    select: { pageId: true },
  })

  if (!existingBlock) {
    throw new Error('Block not found')
  }

  await prisma.block.delete({
    where: { id: blockId },
  })

  // Invalidate cache
  await cache.invalidatePattern('pages:*')
  await cache.del(`page:id:${existingBlock.pageId}`)

  // Revalidate paths
  revalidatePath('/admin/pagebuilder')
  revalidatePath(`/admin/pagebuilder/${existingBlock.pageId}`)

  return { success: true }
}

/**
 * Update the order of multiple blocks
 */
export async function updateBlocksOrder(
  updates: Array<{ id: string; order: number }>
) {
  await requireAuth()

  if (updates.length === 0) {
    return { success: true }
  }

  // Get pageId from first block for cache invalidation
  const firstBlock = await prisma.block.findUnique({
    where: { id: updates[0].id },
    select: { pageId: true },
  })

  if (!firstBlock) {
    throw new Error('Block not found')
  }

  // Update all blocks in a transaction
  await prisma.$transaction(
    updates.map(({ id, order }) =>
      prisma.block.update({
        where: { id },
        data: { order },
      })
    )
  )

  // Invalidate cache
  await cache.invalidatePattern('pages:*')
  await cache.del(`page:id:${firstBlock.pageId}`)

  // Revalidate paths
  revalidatePath('/admin/pagebuilder')
  revalidatePath(`/admin/pagebuilder/${firstBlock.pageId}`)

  return { success: true }
}

/**
 * Duplicate a block
 */
export async function duplicateBlock(blockId: string) {
  const user = await requireAuth()

  const originalBlock = await prisma.block.findUnique({
    where: { id: blockId },
  })

  if (!originalBlock) {
    throw new Error('Block not found')
  }

  // Get the highest order in the page
  const maxOrderBlock = await prisma.block.findFirst({
    where: { pageId: originalBlock.pageId },
    orderBy: { order: 'desc' },
  })

  const newOrder = (maxOrderBlock?.order ?? 0) + 1

  // Create duplicate block
  const duplicatedBlock = await prisma.block.create({
    data: {
      pageId: originalBlock.pageId,
      type: originalBlock.type,
      name: `${originalBlock.name} (Copy)`,
      content: originalBlock.content as any,
      order: newOrder,
      className: originalBlock.className,
      styles: originalBlock.styles as any,
      createdById: user.id,
    },
  })

  // Invalidate cache
  await cache.invalidatePattern('pages:*')
  await cache.del(`page:id:${originalBlock.pageId}`)

  // Revalidate paths
  revalidatePath('/admin/pagebuilder')
  revalidatePath(`/admin/pagebuilder/${originalBlock.pageId}`)

  return duplicatedBlock
}
