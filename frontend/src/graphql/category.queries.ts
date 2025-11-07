/**
 * DEPRECATED: GraphQL category queries removed
 * Use Server Actions from @/actions/categories instead
 */

export const GET_CATEGORIES = `query { categories { id } }`
export const GET_ACTIVE_CATEGORIES = `query { activeCategories { id } }`
export const GET_CATEGORY_TREE = `query { categoryTree { id } }`
export const CREATE_CATEGORY = `mutation { createCategory { id } }`
export const UPDATE_CATEGORY = `mutation { updateCategory { id } }`
export const DELETE_CATEGORY = `mutation { deleteCategory { id } }`

// TypeScript types for backward compatibility
export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  parentId?: string | null
  icon?: string | null
  order: number
  isActive: boolean
  createdAt?: Date | string
  updatedAt?: Date | string
  parent?: Category | null
  children?: Category[]
}

export interface CreateCategoryInput {
  name: string
  slug: string
  description?: string | null
  parentId?: string | null
  icon?: string | null
  order?: number
  isActive?: boolean
}

export interface UpdateCategoryInput {
  name?: string
  slug?: string
  description?: string | null
  parentId?: string | null
  icon?: string | null
  order?: number
  isActive?: boolean
}

console.warn('GraphQL category queries are deprecated. Use Server Actions from @/actions/categories instead')
