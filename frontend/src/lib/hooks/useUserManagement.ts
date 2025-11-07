// DEPRECATED: Apollo Client removed - Stubs for backward compatibility
// TODO: Migrate to Server Actions in src/actions/users.ts

if (typeof window !== 'undefined') {
  console.warn('⚠️ DEPRECATED: useUserManagement hooks are stubs. Please migrate to Server Actions in src/actions/users.ts');
}

// Stub hooks - return empty data
export const useUserStats = (options?: any) => ({
  data: null,
  loading: false,
  error: null,
  refetch: async () => ({ data: null })
});

export const useUserById = (id: string) => ({
  data: null,
  loading: false,
  error: null,
  refetch: async () => ({ data: null })
});

export const useAllUsers = () => ({
  data: null,
  loading: false,
  error: null,
  refetch: async () => ({ data: null })
});

export const useAdminUpdateUser = () => [
  async () => ({ data: null }),
  { data: null, loading: false, error: null }
] as const;

export const useAdminCreateUser = () => [
  async () => ({ data: null }),
  { data: null, loading: false, error: null }
] as const;

export const useBulkUserAction = () => [
  async () => ({ data: null }),
  { data: null, loading: false, error: null }
] as const;

export const useDeleteUser = () => [
  async () => ({ data: null }),
  { data: null, loading: false, error: null }
] as const;

export const useUpdateUser = () => [
  async () => ({ data: null }),
  { data: null, loading: false, error: null }
] as const;

// Additional stub hooks
export const useUserManagement = () => ({
  users: [],
  loading: false,
  error: null,
  refetch: async () => ({ data: null }),
  updateUser: async () => ({ data: null }),
  createUser: async () => ({ data: null }),
  deleteUser: async () => ({ data: null }),
});

export const useUsers = () => ({
  data: null,
  loading: false,
  error: null,
  refetch: async () => ({ data: null })
});

export const useSearchUsers = (...args: any[]) => ({
  data: null,
  loading: false,
  error: null,
  refetch: async () => ({ data: null })
});
