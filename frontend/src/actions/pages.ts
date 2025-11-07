'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { Prisma } from '@prisma/client'

// ============================================================================
// PAGE QUERIES
// ============================================================================

export async function getPages(options?: {
  skip?: number
  take?: number
  where?: Prisma.PageWhereInput
  include?: Prisma.PageInclude
}) {
  try {
    const pages = await prisma.page.findMany({
      skip: options?.skip,
      take: options?.take,
      where: options?.where,
      include: options?.include ?? {
        createdBy: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const total = await prisma.page.count({
      where: options?.where,
    })

    return {
      success: true,
      data: pages,
      total,
    }
  } catch (error) {
    console.error('Error fetching pages:', error)
    return {
      success: false,
      error: 'Failed to fetch pages',
    }
  }
}

export async function getPageBySlug(slug: string) {
  try {
    const page = await prisma.page.findFirst({
      where: {
        slug,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    })

    if (!page) {
      return {
        success: false,
        error: 'Page not found',
      }
    }

    return {
      success: true,
      data: page,
    }
  } catch (error) {
    console.error('Error fetching page:', error)
    return {
      success: false,
      error: 'Failed to fetch page',
    }
  }
}

export async function getPageById(id: string) {
  try {
    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    })

    if (!page) {
      return {
        success: false,
        error: 'Page not found',
      }
    }

    return {
      success: true,
      data: page,
    }
  } catch (error) {
    console.error('Error fetching page:', error)
    return {
      success: false,
      error: 'Failed to fetch page',
    }
  }
}

// ============================================================================
// PAGE MUTATIONS
// ============================================================================

export async function createPage(data: Prisma.PageCreateInput) {
  try {
    const page = await prisma.page.create({
      data,
      include: {
        createdBy: true,
      },
    })

    revalidatePath('/admin/pagebuilder')
    revalidatePath(`/${page.slug}`)

    return {
      success: true,
      data: page,
    }
  } catch (error) {
    console.error('Error creating page:', error)
    return {
      success: false,
      error: 'Failed to create page',
    }
  }
}

export async function updatePage(
  id: string,
  data: Prisma.PageUpdateInput
) {
  try {
    const page = await prisma.page.update({
      where: { id },
      data,
      include: {
        createdBy: true,
      },
    })

    revalidatePath('/admin/pagebuilder')
    revalidatePath(`/${page.slug}`)

    return {
      success: true,
      data: page,
    }
  } catch (error) {
    console.error('Error updating page:', error)
    return {
      success: false,
      error: 'Failed to update page',
    }
  }
}

export async function deletePage(id: string) {
  try {
    // Hard delete (schema không có deletedAt)
    await prisma.page.delete({
      where: { id },
    })

    revalidatePath('/admin/pagebuilder')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error deleting page:', error)
    return {
      success: false,
      error: 'Failed to delete page',
    }
  }
}

export async function publishPage(id: string) {
  try {
    const page = await prisma.page.update({
      where: { id },
      data: {
        isPublished: true,
        publishedAt: new Date(),
      },
    })

    revalidatePath('/admin/pagebuilder')
    revalidatePath(`/${page.slug}`)

    return {
      success: true,
      data: page,
    }
  } catch (error) {
    console.error('Error publishing page:', error)
    return {
      success: false,
      error: 'Failed to publish page',
    }
  }
}

export async function unpublishPage(id: string) {
  try {
    const page = await prisma.page.update({
      where: { id },
      data: {
        isPublished: false,
      },
    })

    revalidatePath('/admin/pagebuilder')
    revalidatePath(`/${page.slug}`)

    return {
      success: true,
      data: page,
    }
  } catch (error) {
    console.error('Error unpublishing page:', error)
    return {
      success: false,
      error: 'Failed to unpublish page',
    }
  }
}
