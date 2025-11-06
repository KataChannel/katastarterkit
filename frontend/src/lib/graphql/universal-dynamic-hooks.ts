/**
 * DEPRECATED: GraphQL hooks have been removed
 * Use Server Actions instead: @/actions/*
 */

export function useUniversalDynamicQuery(options?: any) {
  console.warn('useUniversalDynamicQuery is deprecated. Use Server Actions instead')
  
  return {
    data: null,
    loading: false,
    error: null,
    refetch: async () => ({}),
  }
}

export function useUniversalDynamicMutation(operation: string) {
  console.warn('useUniversalDynamicMutation is deprecated. Use Server Actions instead')
  
  return [
    async (data: any) => ({ data: null }),
    { loading: false, error: null }
  ] as const
}
