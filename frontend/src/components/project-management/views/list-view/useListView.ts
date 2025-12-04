'use client';

import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
  TaskData, 
  NewTaskForm, 
  SortField, 
  SortOrder,
  STATUS_LABELS,
  PRIORITY_LABELS,
} from './types';

// GraphQL Queries & Mutations
const GET_LIST_TASKS = gql`
  query GetListTasks($projectId: ID!) {
    projectTasks(projectId: $projectId) {
      id
      title
      description
      status
      priority
      dueDate
      createdAt
      completedAt
      storyPoints
      user {
        id
        firstName
        lastName
        avatar
      }
    }
  }
`;

const CREATE_PROJECT_TASK = gql`
  mutation CreateProjectTask($projectId: ID!, $input: CreateTaskInput!) {
    createProjectTask(projectId: $projectId, input: $input) {
      id
      title
      status
      priority
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      title
      status
      priority
    }
  }
`;

const DEFAULT_NEW_TASK: NewTaskForm = {
  title: '',
  description: '',
  priority: 'MEDIUM',
  category: 'OTHER',
};

export function useListView(projectId: string) {
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTask, setNewTask] = useState<NewTaskForm>(DEFAULT_NEW_TASK);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Queries & Mutations
  const { data, loading, error, refetch } = useQuery(GET_LIST_TASKS, {
    variables: { projectId },
    fetchPolicy: 'network-only',
  });

  const [createTaskMutation] = useMutation(CREATE_PROJECT_TASK, {
    onCompleted: () => {
      toast.success('Tạo task thành công!');
      setIsCreateOpen(false);
      setNewTask(DEFAULT_NEW_TASK);
      refetch();
    },
    onError: (err) => {
      toast.error('Lỗi: ' + err.message);
    },
  });

  const [deleteTaskMutation] = useMutation(DELETE_TASK, {
    onCompleted: () => {
      toast.success('Xóa task thành công!');
      refetch();
    },
    onError: (err) => {
      toast.error('Lỗi: ' + err.message);
    },
  });

  const [updateTaskMutation] = useMutation(UPDATE_TASK, {
    onCompleted: () => {
      toast.success('Cập nhật task thành công!');
      refetch();
    },
    onError: (err) => {
      toast.error('Lỗi: ' + err.message);
    },
  });

  const tasks: TaskData[] = data?.projectTasks || [];

  // Handlers
  const handleCreateTask = useCallback(async () => {
    if (!newTask.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề task');
      return;
    }
    setIsSubmitting(true);
    try {
      await createTaskMutation({
        variables: {
          projectId,
          input: {
            title: newTask.title,
            description: newTask.description || undefined,
            priority: newTask.priority,
            category: newTask.category,
          },
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [createTaskMutation, newTask, projectId]);

  const handleDeleteTask = useCallback(async (taskId: string) => {
    if (confirm('Bạn có chắc muốn xóa task này?')) {
      await deleteTaskMutation({ variables: { id: taskId } });
    }
  }, [deleteTaskMutation]);

  const handleStatusChange = useCallback(async (taskId: string, newStatus: string) => {
    await updateTaskMutation({
      variables: {
        id: taskId,
        input: { status: newStatus },
      },
    });
  }, [updateTaskMutation]);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((task) => 
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter) {
      result = result.filter((task) => task.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter) {
      result = result.filter((task) => task.priority === priorityFilter);
    }

    // Sort
    result.sort((a, b) => {
      let valueA: any = a[sortField as keyof TaskData];
      let valueB: any = b[sortField as keyof TaskData];

      // Handle null values
      if (valueA === null || valueA === undefined) return 1;
      if (valueB === null || valueB === undefined) return -1;

      // Handle dates
      if (sortField === 'dueDate' || sortField === 'createdAt') {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }

      // Handle priority ordering
      if (sortField === 'priority') {
        const priorityOrder: Record<string, number> = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        valueA = priorityOrder[valueA] || 0;
        valueB = priorityOrder[valueB] || 0;
      }

      // Handle status ordering
      if (sortField === 'status') {
        const statusOrder: Record<string, number> = { PENDING: 1, IN_PROGRESS: 2, REVIEW: 3, COMPLETED: 4 };
        valueA = statusOrder[valueA] || 0;
        valueB = statusOrder[valueB] || 0;
      }

      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      }
      return valueA < valueB ? 1 : -1;
    });

    return result;
  }, [tasks, searchQuery, statusFilter, priorityFilter, sortField, sortOrder]);

  // Toggle sort
  const toggleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  }, [sortField]);

  // Export to CSV
  const exportToCSV = useCallback(() => {
    const headers = ['Tiêu đề', 'Trạng thái', 'Ưu tiên', 'Deadline', 'Người thực hiện', 'Story Points'];
    const rows = filteredTasks.map((task) => [
      task.title,
      STATUS_LABELS[task.status] || task.status,
      PRIORITY_LABELS[task.priority] || task.priority,
      task.dueDate ? format(new Date(task.dueDate), 'dd/MM/yyyy') : '',
      task.user ? `${task.user.firstName} ${task.user.lastName || ''}`.trim() : '',
      task.storyPoints?.toString() || '',
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tasks-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  }, [filteredTasks]);

  // Stats
  const stats = useMemo(() => ({
    total: tasks.length,
    filtered: filteredTasks.length,
    pending: tasks.filter((t) => t.status === 'PENDING').length,
    inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    completed: tasks.filter((t) => t.status === 'COMPLETED').length,
  }), [tasks, filteredTasks]);

  return {
    // Data
    tasks,
    filteredTasks,
    stats,
    loading,
    error,
    
    // Filters
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    
    // Sorting
    sortField,
    sortOrder,
    toggleSort,
    
    // Create dialog
    isCreateOpen,
    setIsCreateOpen,
    newTask,
    setNewTask,
    isSubmitting,
    
    // Actions
    handleCreateTask,
    handleDeleteTask,
    handleStatusChange,
    exportToCSV,
    refetch,
  };
}
