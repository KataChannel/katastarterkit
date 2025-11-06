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
