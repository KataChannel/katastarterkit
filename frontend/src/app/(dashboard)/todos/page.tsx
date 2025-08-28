'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import TaskList from '@/components/todos/TaskList';
import { TaskListView } from '@/components/todos/TaskListView';
import { TaskTableView } from '@/components/todos/TaskTableView';
import { TaskKanbanView } from '@/components/todos/TaskKanbanView';
import { TaskGanttView } from '@/components/todos/TaskGanttView';
import { TaskDashboardView } from '@/components/todos/TaskDashboardView';
import { ViewModeSelector } from '@/components/todos/ViewModeSelector';
import { useTasks, useTaskMutations } from '@/hooks/useTodos';
import { TaskStatus, TaskPriority, TaskCategory, Task } from '@/types/todo';
import { TodoViewMode } from '@/types/todo-views';
import {
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function TodosPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<TodoViewMode>(TodoViewMode.DASHBOARD);

  // Get all tasks
  const { tasks, loading: tasksLoading, error: tasksError, refetch } = useTasks();
  const { updateTask, deleteTask } = useTaskMutations();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  const handleTaskStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      await updateTask({
        id: taskId,
        status,
      });
      
      const statusText = status === TaskStatus.COMPLETED ? 'hoàn thành' : 
                        status === TaskStatus.IN_PROGRESS ? 'đang thực hiện' :
                        status === TaskStatus.PENDING ? 'chờ xử lý' : 'đã hủy';
      
      toast.success(`Đã cập nhật trạng thái task thành "${statusText}"`);
      refetch();
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Không thể cập nhật trạng thái task');
    }
  };

  if (loading || tasksLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (tasksError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Lỗi tải dữ liệu</h3>
          <p className="mt-1 text-sm text-gray-500">
            Không thể tải danh sách task. Vui lòng thử lại.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle task operations
  const handleTaskUpdate = async (taskId: string, updates: any) => {
    try {
      await updateTask({ taskId, ...updates });
      toast.success('Cập nhật công việc thành công');
      refetch();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật công việc');
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      toast.success('Xóa công việc thành công');
      refetch();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa công việc');
    }
  };

  const handleTaskCreate = (initialData?: any) => {
    // You can implement task creation logic here
    // For now, just show a toast
    toast.success('Tính năng tạo công việc sẽ được triển khai');
  };

  // Render different views based on selected mode
  const renderTasksView = () => {
    const commonProps = {
      tasks: tasks || [],
      loading: tasksLoading,
      onTaskUpdate: handleTaskUpdate,
      onTaskDelete: handleTaskDelete,
      onTaskCreate: handleTaskCreate,
    };

    switch (viewMode) {
      case TodoViewMode.DASHBOARD:
        return <TaskDashboardView {...commonProps} />;
        
      case TodoViewMode.LIST:
        return (
          <div className="p-6">
            <TaskListView {...commonProps} />
          </div>
        );
      
      case TodoViewMode.TABLE:
        return <TaskTableView {...commonProps} />;
      
      case TodoViewMode.KANBAN:
        return (
          <div className="p-6">
            <TaskKanbanView {...commonProps} />
          </div>
        );
      
      case TodoViewMode.GANTT:
        return <TaskGanttView {...commonProps} />;
      
      default:
        return (
          <div className="p-6">
            <TaskList className="" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Quản lý công việc</h1>
            <p className="mt-2 text-gray-600">
              Chào {user?.username}, chào mừng bạn đến với hệ thống quản lý công việc
            </p>
          </div>

          {/* View Mode Selector */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {viewMode === TodoViewMode.DASHBOARD ? 'Tổng quan' : 'Danh sách công việc'}
            </h2>
            <ViewModeSelector 
              currentMode={viewMode}
              onModeChange={setViewMode}
            />
          </div>

          {/* Tasks View Container */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {renderTasksView()}
          </div>
        </div>
      </div>
    </div>
  );
}
