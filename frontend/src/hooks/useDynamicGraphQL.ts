/**
 * DEPRECATED: Dynamic GraphQL hooks removed
 * Use Server Actions from @/actions/* instead
 * 
 * This file provides stub implementations for backward compatibility
 */

'use client';

export function useFindMany(model: string, options?: any) {
  console.warn(`useFindMany("${model}") is deprecated. Use Server Actions from @/actions instead`)
  
  return {
    data: null,
    loading: false,
    error: null,
    refetch: async () => ({}),
  }
}

export function useFindUnique(model: string, ...options: any[]) {
  console.warn(`useFindUnique("${model}") is deprecated. Use Server Actions from @/actions instead`)
  
  return {
    data: null,
    loading: false,
    error: null,
    refetch: async () => ({}),
  }
}

export function useCreateOne(model: string) {
  console.warn(`useCreateOne("${model}") is deprecated. Use Server Actions from @/actions instead`)
  
  return [
    async (data: any) => ({ data: null }),
    { loading: false, error: null }
  ] as const
}

export function useUpdateOne(model: string) {
  console.warn(`useUpdateOne("${model}") is deprecated. Use Server Actions from @/actions instead`)
  
  return [
    async (id: string, data: any) => ({ data: null }),
    { loading: false, error: null }
  ] as const
}

export function useDeleteOne(model: string) {
  console.warn(`useDeleteOne("${model}") is deprecated. Use Server Actions from @/actions instead`)
  
  return [
    async (id: string) => ({ data: null }),
    { loading: false, error: null }
  ] as const
}

export function useFindFirst(model: string, options?: any) {
  console.warn(`useFindFirst("${model}") is deprecated. Use Server Actions from @/actions instead`)
  
  return {
    data: null,
    loading: false,
    error: null,
    refetch: async () => ({}),
  }
}

export function useCount(model: string, options?: any) {
  console.warn(`useCount("${model}") is deprecated. Use Server Actions from @/actions instead`)
  
  return {
    data: 0,
    loading: false,
    error: null,
    refetch: async () => ({}),
  }
}

export function useAggregate(model: string, options?: any) {
  console.warn(`useAggregate("${model}") is deprecated. Use Server Actions from @/actions instead`)
  
  return {
    data: null,
    loading: false,
    error: null,
    refetch: async () => ({}),
  }
}
