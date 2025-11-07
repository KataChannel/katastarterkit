/**
 * DEPRECATED: GraphQL hooks have been removed
 * Use Server Actions instead: @/actions/*
 * 
 * This file provides stub implementations for backward compatibility
 */

export function useDynamicQuery(model: string, options?: any) {
  console.warn('useDynamicQuery is deprecated. Use Server Actions from @/actions instead')
  
  return {
    data: null,
    loading: false,
    error: null,
    refetch: async () => ({}),
  }
}

export function useDynamicMutation(model: string, operation: string) {
  console.warn('useDynamicMutation is deprecated. Use Server Actions from @/actions instead')
  
  return [
    async (data: any) => ({ data: null }),
    { loading: false, error: null }
  ] as const
}

export function useDynamicSubscription(model: string, options?: any) {
  console.warn('useDynamicSubscription is deprecated. Use Server-Sent Events or WebSockets instead')
  
  return {
    data: null,
    loading: false,
    error: null,
  }
}

// Additional exports for backward compatibility
export function formatDynamicGraphQLError(error: any) {
  console.warn('formatDynamicGraphQLError is deprecated')
  return String(error)
}

export function isDynamicGraphQLError(error: any): boolean {
  return false
}

export function useCRUD(model: string) {
  console.warn('useCRUD is deprecated. Use Server Actions from @/actions instead')
  
  return {
    create: async (data: any) => ({ data: null }),
    update: async (id: string, data: any) => ({ data: null }),
    delete: async (id: string) => ({ data: null }),
    loading: false,
    error: null,
  }
}

export interface BulkOperationResult {
  success: number
  failed: number
  total: number
  errors?: any[]
}
