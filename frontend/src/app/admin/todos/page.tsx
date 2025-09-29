'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { TaskDashboardView } from '@/components/todos/TaskDashboardView';
import { TaskListView } from '@/components/todos/TaskListView';
import { TaskTableView } from '@/components/todos/TaskTableView';
import { TaskKanbanView } from '@/components/todos/TaskKanbanView';
import { ViewModeSelector } from '@/components/todos/ViewModeSelector';

import CreateTaskModal from '@/components/todos/CreateTaskModal';
import { useTasks, useTaskMutations } from '@/hooks/useTodos';
import { useDynamicTasks } from '@/hooks/useDynamicTasks';
import { TaskStatus, TaskPriority, TaskCategory, Task, CreateTaskInput, UpdateTaskInput } from '@/types/todo';
import { TodoViewMode } from '@/types/todo-views';
import { PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function TodosPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<TodoViewMode>(TodoViewMode.DASHBOARD);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Dynamic GraphQL hooks
  const {
    tasks: dynamicTasks,
    loading: dynamicLoading,
    createTask: dynamicCreateTask,
    updateTask: dynamicUpdateTask,
    deleteTask: dynamicDeleteTask,
    refetch: dynamicRefetch
  } = useDynamicTasks();

  // Fallback hooks
  const { tasks, loading: tasksLoading, refetch } = useTasks();
  const { updateTask, deleteTask } = useTaskMutations();

  const finalTasks = dynamicTasks?.length > 0 ? dynamicTasks : (tasks || []);
  const finalLoading = dynamicLoading || tasksLoading;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // 🚀 ENHANCED TASK CREATE với Dynamic GraphQL - TÍNH NĂNG CHÍNH
  const handleTaskCreate = async (initialData?: Partial<CreateTaskInput>) => {
    try {
      if (initialData && initialData.title) {
        const taskData: CreateTaskInput = {
          title: initialData.title,
          description: initialData.description || '',
          category: initialData.category || TaskCategory.PERSONAL,
          priority: initialData.priority || TaskPriority.MEDIUM,
          dueDate: initialData.dueDate
        };

        // 🎯 Dynamic GraphQL Creation với full features
        const createdTask = await dynamicCreateTask(taskData, {
          showToast: true,
          onCreate: (task: Task) => {
            console.log('✅ Task created via Dynamic GraphQL:', task);
            toast.success(`🎉 Tạo thành công: "${task.title}"`);
          }
        });

        return createdTask;
      } else {
        // Hiển thị modal tạo task
        setShowCreateModal(true);
      }
    } catch (error) {
      console.error('❌ Task creation error:', error);
      toast.error(`❌ Lỗi tạo task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };



  // Enhanced task update với dynamic GraphQL
  const handleTaskUpdate = async (taskId: string, updates: Partial<UpdateTaskInput>) => {
    try {
      await dynamicUpdateTask(taskId, updates, {
        showToast: true,
        onUpdate: (task: Task) => {
          console.log('✅ Task updated via Dynamic GraphQL:', task);
        }
      });
    } catch (error) {
      console.error('❌ Update error:', error);
      // Fallback
      try {
        await updateTask(updates as any);
        toast.success('✅ Cập nhật thành công (fallback)');
        refetch();
      } catch (fallbackError) {
        toast.error('❌ Lỗi cập nhật task');
      }
    }
  };

  // Enhanced task delete với dynamic GraphQL
  const handleTaskDelete = async (taskId: string) => {
    try {
      // Confirm before delete
      if (!confirm('Bạn có chắc chắn muốn xóa task này?')) {
        return;
      }
      
      await dynamicDeleteTask(taskId, {
        showToast: true,
        onDelete: () => {
          console.log('✅ Task deleted via Dynamic GraphQL');
        }
      });
    } catch (error) {
      console.error('❌ Delete error:', error);
      // Fallback
      try {
        await deleteTask(taskId);
        toast.success('✅ Xóa thành công (fallback)');
        refetch();
      } catch (fallbackError) {
        toast.error('❌ Lỗi xóa task');
      }
    }
  };

  // Status change
  const handleTaskStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      await handleTaskUpdate(taskId, { status });
    } catch (error) {
      console.error('❌ Status change error:', error);
    }
  };

  // Render appropriate view based on selected mode
  const renderTaskView = () => {
    const commonProps = {
      tasks: finalTasks,
      loading: finalLoading,
      onTaskUpdate: handleTaskUpdate,
      onTaskDelete: handleTaskDelete,
      onTaskCreate: handleTaskCreate,
    };

    switch (viewMode) {
      case TodoViewMode.LIST:
        return <TaskListView {...commonProps} />;
      case TodoViewMode.TABLE:
        return <TaskTableView {...commonProps} />;
      case TodoViewMode.KANBAN:
        return <TaskKanbanView {...commonProps} />;
      case TodoViewMode.GANTT:
        // Gantt view might not be implemented yet, fallback to dashboard
        return <TaskDashboardView {...commonProps} />;
      case TodoViewMode.DASHBOARD:
      default:
        return <TaskDashboardView {...commonProps} />;
    }
  };

  if (loading || finalLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
            <p className="text-gray-600">Quản lý công việc hiệu quả</p>
          </div>
          <button
            onClick={() => handleTaskCreate()}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Tạo Task
          </button>
        </div>

        {/* View Mode Selector */}
        <div className="mt-6">
          <ViewModeSelector
            currentMode={viewMode}
            onModeChange={setViewMode}
          />
        </div>

        {/* Main Task View */}
        <div className="mt-8">
          {renderTaskView()}
        </div>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTaskCreated={() => {
          dynamicRefetch();
          refetch();
        }}
      />
    </div>
  );
}
