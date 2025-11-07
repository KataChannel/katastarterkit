/**
 * DEPRECATED: useCategories hook removed
 * Use Server Actions from @/actions/categories instead
 * 
 * This file provides stub implementations for backward compatibility
 */

'use client';

export function useCategories(options?: any) {
  console.warn('useCategories is deprecated. Use Server Actions from @/actions/categories instead')
  
  return {
    categories: [],
    loading: false,
    error: null,
    refetch: async () => ({}),
  }
}

export function useCategory(id: string) {
  console.warn('useCategory is deprecated. Use Server Actions from @/actions/categories instead')
  
  return {
    category: null,
    loading: false,
    error: null,
    refetch: async () => ({}),
  }
}

export function useCreateCategory() {
  console.warn('useCreateCategory is deprecated. Use Server Actions from @/actions/categories instead')
  
  const createCategory = async (data: any) => ({ data: null })
  
  return {
    createCategory,
    loading: false,
    error: null,
  }
}

export function useUpdateCategory() {
  console.warn('useUpdateCategory is deprecated. Use Server Actions from @/actions/categories instead')
  
  const updateCategory = async (id: string, data: any) => ({ data: null })
  
  return {
    updateCategory,
    loading: false,
    error: null,
  }
}

export function useDeleteCategory() {
  console.warn('useDeleteCategory is deprecated. Use Server Actions from @/actions/categories instead')
  
  const deleteCategory = async (id: string) => ({ data: null })
  
  return {
    deleteCategory,
    loading: false,
    error: null,
  }
}

export function useCategoryTree() {
  console.warn('useCategoryTree is deprecated. Use Server Actions from @/actions/categories instead')
  
  return {
    categoryTree: [],
    loading: false,
    error: null as Error | null,
    refetch: async () => ({}),
  }
}

export function useActiveCategories() {
  console.warn('useActiveCategories is deprecated. Use Server Actions from @/actions/categories instead')
  
  return {
    categories: [],
    loading: false,
    error: null,
    refetch: async () => ({}),
  }
}
