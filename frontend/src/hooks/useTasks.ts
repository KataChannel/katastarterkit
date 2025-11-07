// DEPRECATED: Apollo Client removed - Stubs for backward compatibility
// TODO: Migrate to Server Actions in src/actions/tasks.ts

if (typeof window !== 'undefined') {
  console.warn('⚠️ DEPRECATED: useTasks hooks are stubs. Please migrate to Server Actions in src/actions/tasks.ts');
}

// Stub hooks - return empty data
export const useProjectTasks = (projectId: string | null, filters?: any) => ({
  data: null,
  loading: false,
  error: null,
  refetch: async () => ({ data: null })
});

export const useTask = (taskId: string | null) => ({
  data: null,
  loading: false,
  error: null,
  refetch: async () => ({ data: null })
});

export const useMyTasks = (filters?: any) => ({
  data: null,
  loading: false,
  error: null,
  refetch: async () => ({ data: null })
});

export const useCreateProjectTask = () => [
  async () => ({ data: null }),
  { data: null, loading: false, error: null }
] as const;

export const useUpdateTask = () => [
  async () => ({ data: null }),
  { data: null, loading: false, error: null }
] as const;

export const useDeleteTask = () => [
  async () => ({ data: null }),
  { data: null, loading: false, error: null }
] as const;

export const useUpdateTaskOrder = () => [
  async () => ({ data: null }),
  { data: null, loading: false, error: null }
] as const;

export const useAssignTask = () => [
  async () => ({ data: null }),
  { data: null, loading: false, error: null }
] as const;

export const useUpdateTaskStatus = () => [
  async () => ({ data: null }),
  { data: null, loading: false, error: null }
] as const;
