/**
 * DEPRECATED: GraphQL types have been removed
 * Use Prisma types instead: @prisma/client
 */

export interface Menu {
  id: string
  name: string
  slug: string
  items?: MenuItem[]
  createdAt?: Date
  updatedAt?: Date
}

export interface MenuItem {
  id: string
  title: string
  url: string
  order: number
  parentId?: string
  children?: MenuItem[]
}

console.warn('GraphQL menu types are deprecated. Use Prisma types from @prisma/client instead')
