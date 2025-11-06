/**
 * DEPRECATED: GraphQL types have been removed
 * Use Prisma types instead: @prisma/client
 * 
 * Migration Guide:
 * - Use Server Actions from @/actions/menu.actions
 * - Use Prisma types from @prisma/client
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

export interface MenuTreeNode extends MenuItem {
  children?: MenuTreeNode[]
}

// Stub functions - return empty/default values
export const buildMenuFindManyInput = () => ({})
export const buildMenuFindUniqueInput = () => ({})
export const buildMenuCreateInput = () => ({})
export const buildMenuUpdateInput = () => ({})
export const buildMenuDeleteInput = () => ({})
export const buildMenuCountInput = () => ({})

// Stub tree builder
export const buildMenuTree = (items: MenuItem[]): MenuTreeNode[] => {
  console.warn('buildMenuTree is deprecated. Use Server Actions instead.')
  return []
}

// Stub where clause builders
export const getMenusByTypeWhere = () => ({})
export const getActiveMenusWhere = () => ({ isActive: true })
export const getPublicMenusWhere = () => ({ isPublished: true })
export const getRootMenusWhere = () => ({ parentId: null })

// Default select
export const DEFAULT_MENU_SELECT = {
  id: true,
  title: true,
  url: true,
  order: true,
  parentId: true,
}

console.warn('⚠️ GraphQL menu queries are deprecated. Use @/actions/menu.actions instead')
