'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
import {
  useDynamicQuery,
  useDynamicMutation,
  useUniversalMutation,
  useCRUD,
  BulkOperationResult,
  formatDynamicGraphQLError,
  isDynamicGraphQLError
} from '@/lib/graphql/dynamic-hooks';
import { 
  Task, 
  CreateTaskInput, 
  UpdateTaskInput, 
  TaskFilterInput,
  TaskStatus,
  TaskPriority,
  TaskCategory
} from '@/types/todo';
import toast from 'react-hot-toast';

// Dynamic Task CRUD Hook với tất cả tính năng
export function useDynamicTasks() {
  const [isLoading, setIsLoading] = useState(false);

  // Sử dụng CRUD hook cho Task model
  const taskCRUD = useCRUD<Task>('Task');

  // Dynamic queries với improved error handling
  const { data: allTasks, loading: tasksLoading, error: tasksError, refetch } = useDynamicQuery<Task[]>(
    'GET_ALL',
    'Task',
    {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all'
    }
  );

  // Handle data loading and errors with useEffect instead of deprecated callbacks
  useEffect(() => {
    if (allTasks) {
      console.log('✅ Dynamic tasks loaded:', allTasks);
      console.log('✅ Is array?', Array.isArray(allTasks));
      console.log('✅ Type:', typeof allTasks);
    }
  }, [allTasks]);

  useEffect(() => {
    if (tasksError) {
      console.error('❌ Dynamic tasks error:', tasksError);
    }
  }, [tasksError]);

  const { data: tasksPaginated, loading: paginatedLoading, refetch: refetchPaginated } = useDynamicQuery(
    'GET_PAGINATED',
    'Task',
    {
      variables: { page: 1, limit: 10 },
      fetchPolicy: 'cache-and-network'
    }
  );

  // Dynamic mutations
  const [createTask, { loading: creating }] = useDynamicMutation<Task, { data: CreateTaskInput }>(
    'CREATE',
    'Task',
    {
      refetchQueries: ['GET_TASKs', 'GET_TASKs_PAGINATED'],
      awaitRefetchQueries: true,
      errorPolicy: 'all'
    }
  );

  const [updateTask, { loading: updating }] = useDynamicMutation<Task, { id: string; data: Partial<UpdateTaskInput> }>(
    'UPDATE',
    'Task',
    {
      refetchQueries: ['GET_TASKs', 'GET_TASKs_PAGINATED', 'GET_TASK_BY_ID'],
      awaitRefetchQueries: true
    }
  );

  const [deleteTask, { loading: deleting }] = useDynamicMutation<boolean, { id: string }>(
    'DELETE',
    'Task',
    {
      refetchQueries: ['GET_TASKs', 'GET_TASKs_PAGINATED'],
      awaitRefetchQueries: true
    }
  );

  // Bulk operations
  const [createTasksBulk, { loading: bulkCreating }] = useDynamicMutation<BulkOperationResult<Task>, { data: CreateTaskInput[] }>(
    'CREATE_BULK',
    'Task',
    {
      refetchQueries: ['GET_TASKs', 'GET_TASKs_PAGINATED'],
      awaitRefetchQueries: true
    }
  );

  const [updateTasksBulk, { loading: bulkUpdating }] = useDynamicMutation<BulkOperationResult<Task>, { data: Array<{ id: string; data: Partial<UpdateTaskInput> }> }>(
    'UPDATE_BULK',
    'Task',
    {
      refetchQueries: ['GET_TASKs', 'GET_TASKs_PAGINATED'],
      awaitRefetchQueries: true
    }
  );

  const [deleteTasksBulk, { loading: bulkDeleting }] = useDynamicMutation<BulkOperationResult, { ids: string[] }>(
    'DELETE_BULK',
    'Task',
    {
      refetchQueries: ['GET_TASKs', 'GET_TASKs_PAGINATED'],
      awaitRefetchQueries: true
    }
  );

  // Universal mutations (sử dụng universal resolver)
  const [universalCreate] = useUniversalMutation<Task>(
    'CREATE',
    { modelName: 'Task' }
  );

  const [universalUpdate] = useUniversalMutation<Task>(
    'UPDATE',
    { modelName: 'Task' }
  );

  const [universalDelete] = useUniversalMutation<boolean>(
    'DELETE',
    { modelName: 'Task' }
  );

  // Enhanced task creation với better error handling
  const handleCreateTask = useCallback(async (taskData: CreateTaskInput, options?: {
    useUniversal?: boolean;
    showToast?: boolean;
    onCreate?: (task: Task) => void;
    onError?: (error: any) => void;
  }) => {
    const { useUniversal = false, showToast = true, onCreate, onError } = options || {};

    try {
      setIsLoading(true);

      // Validation
      if (!taskData.title?.trim()) {
        throw new Error('Tiêu đề task không được để trống');
      }

      const sanitizedData: CreateTaskInput = {
        title: taskData.title.trim(),
        description: taskData.description?.trim() || undefined,
        category: taskData.category,
        priority: taskData.priority,
        dueDate: taskData.dueDate || undefined
      };

      let result: Task | null = null;

      if (useUniversal) {
        // Sử dụng universal resolver
        const response = await universalCreate({
          data: sanitizedData
        });
        result = (response.data as any)?.dynamicCreate;
      } else {
        // Sử dụng specific resolver
        const response = await createTask({
          variables: { data: sanitizedData }
        });
        result = response.data || null;
      }

      if (!result) {
        throw new Error('Không thể tạo task - response rỗng');
      }

      if (showToast) {
        toast.success('✅ Tạo task thành công!');
      }

      onCreate?.(result);
      
      // Safe refetch
      try {
        await refetch();
      } catch (refetchError) {
        console.warn('⚠️ Refetch warning:', refetchError);
      }
      
      return result;

    } catch (error: any) {
      console.error('❌ Error creating task:', error);
      
      const errorMessage = isDynamicGraphQLError(error)
        ? formatDynamicGraphQLError(error)
        : error.message || 'Lỗi khi tạo task';

      if (showToast) {
        toast.error(`❌ ${errorMessage}`);
      }

      onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [createTask, universalCreate, refetch]);

  // Enhanced bulk task creation
  const handleCreateTasksBulk = useCallback(async (tasksData: CreateTaskInput[], options?: {
    showProgress?: boolean;
    showToast?: boolean;
    onProgress?: (progress: { completed: number; total: number }) => void;
    onCompleted?: (result: BulkOperationResult<Task>) => void;
  }) => {
    const { showProgress = true, showToast = true, onProgress, onCompleted } = options || {};

    try {
      setIsLoading(true);

      if (tasksData.length === 0) {
        throw new Error('Danh sách tasks trống');
      }

      // Validate all tasks
      const validatedData = tasksData.map((task, index) => {
        if (!task.title?.trim()) {
          throw new Error(`Task ${index + 1}: Tiêu đề không được để trống`);
        }
        return {
          title: task.title.trim(),
          description: task.description?.trim() || undefined,
          category: task.category,
          priority: task.priority,
          dueDate: task.dueDate || undefined
        };
      });

      if (showProgress) {
        toast.loading(`Đang tạo ${tasksData.length} tasks...`, { id: 'bulk-create' });
      }

      const response = await createTasksBulk({
        variables: { data: validatedData }
      });

      const result = response.data!;

      if (showProgress) {
        toast.dismiss('bulk-create');
      }

      if (showToast) {
        if (result.errors && result.errors.length > 0) {
          toast.success(`✅ Tạo thành công ${result.count}/${tasksData.length} tasks`);
          toast.error(`❌ Lỗi: ${result.errors.length} tasks`);
        } else {
          toast.success(`✅ Tạo thành công ${result.count} tasks!`);
        }
      }

      onProgress?.({ completed: result.count, total: tasksData.length });
      onCompleted?.(result);
      await refetch();

      return result;

    } catch (error: any) {
      console.error('Error creating tasks bulk:', error);
      
      if (showProgress) {
        toast.dismiss('bulk-create');
      }

      const errorMessage = isDynamicGraphQLError(error)
        ? formatDynamicGraphQLError(error)
        : error.message || 'Lỗi khi tạo tasks';

      if (showToast) {
        toast.error(`❌ ${errorMessage}`);
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [createTasksBulk, refetch]);

  // Enhanced task update
  const handleUpdateTask = useCallback(async (id: string, updates: Partial<UpdateTaskInput>, options?: {
    useUniversal?: boolean;
    showToast?: boolean;
    onUpdate?: (task: Task) => void;
  }) => {
    const { useUniversal = false, showToast = true, onUpdate } = options || {};

    try {
      setIsLoading(true);

      const sanitizedUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === 'string') {
            acc[key] = value.trim() || undefined;
          } else {
            acc[key] = value;
          }
        }
        return acc;
      }, {} as any);

      let result: Task;

      if (useUniversal) {
        const response = await universalUpdate({
          id,
          data: sanitizedUpdates
        });
        result = (response.data as any)?.dynamicUpdate;
      } else {
        const response = await updateTask({
          variables: { id, data: sanitizedUpdates }
        });
        result = response.data!;
      }

      if (showToast) {
        toast.success('✅ Cập nhật task thành công!');
      }

      onUpdate?.(result);
      await refetch();

      return result;

    } catch (error: any) {
      console.error('Error updating task:', error);
      
      const errorMessage = isDynamicGraphQLError(error)
        ? formatDynamicGraphQLError(error)
        : error.message || 'Lỗi khi cập nhật task';

      if (showToast) {
        toast.error(`❌ ${errorMessage}`);
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [updateTask, universalUpdate, refetch]);

  // Enhanced task deletion
  const handleDeleteTask = useCallback(async (id: string, options?: {
    useUniversal?: boolean;
    showToast?: boolean;
    confirmMessage?: string;
    onDelete?: () => void;
  }) => {
    const { useUniversal = false, showToast = true, confirmMessage, onDelete } = options || {};

    try {
      if (confirmMessage && !window.confirm(confirmMessage)) {
        return false;
      }

      setIsLoading(true);

      let success: boolean;

      if (useUniversal) {
        const response = await universalDelete({
          id
        });
        success = (response.data as any)?.dynamicDelete || false;
      } else {
        const response = await deleteTask({
          variables: { id }
        });
        success = response.data!;
      }

      if (showToast && success) {
        toast.success('✅ Xóa task thành công!');
      }

      onDelete?.();
      await refetch();

      return success;

    } catch (error: any) {
      console.error('Error deleting task:', error);
      
      const errorMessage = isDynamicGraphQLError(error)
        ? formatDynamicGraphQLError(error)
        : error.message || 'Lỗi khi xóa task';

      if (showToast) {
        toast.error(`❌ ${errorMessage}`);
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [deleteTask, universalDelete, refetch]);

  // Quick actions
  const quickActions = useMemo(() => ({
    markAsCompleted: (id: string) => handleUpdateTask(id, { status: TaskStatus.COMPLETED }),
    markAsInProgress: (id: string) => handleUpdateTask(id, { status: TaskStatus.IN_PROGRESS }),
    markAsPending: (id: string) => handleUpdateTask(id, { status: TaskStatus.PENDING }),
    markAsCancelled: (id: string) => handleUpdateTask(id, { status: TaskStatus.CANCELLED }),
    setHighPriority: (id: string) => handleUpdateTask(id, { priority: TaskPriority.HIGH }),
    setMediumPriority: (id: string) => handleUpdateTask(id, { priority: TaskPriority.MEDIUM }),
    setLowPriority: (id: string) => handleUpdateTask(id, { priority: TaskPriority.LOW }),
  }), [handleUpdateTask]);

  // Statistics với safe array check
  const statistics = useMemo(() => {
    // Đảm bảo tasks là array
    const tasks = Array.isArray(allTasks) ? allTasks : [];
    
    if (tasks.length === 0) {
      return {
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        cancelled: 0,
        highPriority: 0,
        overdue: 0
      };
    }

    return {
      total: tasks.length,
      completed: tasks.filter(t => t?.status === TaskStatus.COMPLETED).length,
      inProgress: tasks.filter(t => t?.status === TaskStatus.IN_PROGRESS).length,
      pending: tasks.filter(t => t?.status === TaskStatus.PENDING).length,
      cancelled: tasks.filter(t => t?.status === TaskStatus.CANCELLED).length,
      highPriority: tasks.filter(t => t?.priority === TaskPriority.HIGH).length,
      overdue: tasks.filter(t => {
        if (!t?.dueDate) return false;
        return new Date(t.dueDate) < new Date() && t.status !== TaskStatus.COMPLETED;
      }).length
    };
  }, [allTasks]);

  // Memoize the return object to prevent unnecessary re-renders
  const returnValue = useMemo(() => ({
    // Data - Đảm bảo luôn return array
    tasks: Array.isArray(allTasks) ? allTasks : [],
    tasksPaginated,
    statistics,

    // Loading states
    loading: tasksLoading || paginatedLoading || isLoading,
    creating,
    updating,
    deleting,
    bulkCreating,
    bulkUpdating,
    bulkDeleting,

    // Errors
    error: tasksError,

    // Actions
    createTask: handleCreateTask,
    createTasksBulk: handleCreateTasksBulk,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    refetch,
    refetchPaginated,

    // Quick actions
    quickActions,

    // CRUD operations (raw)
    crud: taskCRUD
  }), [
    allTasks, tasksPaginated, statistics, tasksLoading, paginatedLoading, isLoading,
    creating, updating, deleting, bulkCreating, bulkUpdating, bulkDeleting, tasksError,
    handleCreateTask, handleCreateTasksBulk, handleUpdateTask, handleDeleteTask,
    refetch, refetchPaginated, quickActions, taskCRUD
  ]);

  return returnValue;
}

// Hook for single task operations
export function useDynamicTask(taskId?: string) {
  const { data: task, loading, error, refetch } = useDynamicQuery<Task>(
    'GET_BY_ID',
    'Task',
    {
      variables: { id: taskId },
      skip: !taskId,
      fetchPolicy: 'cache-and-network'
    }
  );

  return {
    task,
    loading,
    error,
    refetch
  };
}
