'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { TaskDashboardView } from '@/components/todos/TaskDashboardView';
import { ViewModeSelector } from '@/components/todos/ViewModeSelector';
import { DynamicTaskDemo } from '@/components/todos/DynamicTaskDemo';
import CreateTaskModal from '@/components/todos/CreateTaskModal';
import { useTasks, useTaskMutations } from '@/hooks/useTodos';
import { useDynamicTasks } from '@/hooks/useDynamicTasks';
import { TaskStatus, TaskPriority, TaskCategory, Task, CreateTaskInput, UpdateTaskInput } from '@/types/todo';
import { TodoViewMode } from '@/types/todo-views';
import { PlusIcon, SparklesIcon, ClockIcon, BriefcaseIcon, UserIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function TodosPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<TodoViewMode>(TodoViewMode.DASHBOARD);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDemo, setShowDemo] = useState(true);

  // Dynamic GraphQL hooks
  const {
    tasks: dynamicTasks,
    loading: dynamicLoading,
    createTask: dynamicCreateTask,
    updateTask: dynamicUpdateTask,
    deleteTask: dynamicDeleteTask,
    quickActions,
    statistics,
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

  // Quick task templates với dynamic GraphQL
  const handleQuickTaskCreate = async (template: 'urgent' | 'meeting' | 'personal' | 'work') => {
    const templates = {
      urgent: {
        title: '🚨 Task Khẩn Cấp',
        description: 'Công việc cần xử lý ngay lập tức',
        category: TaskCategory.WORK,
        priority: TaskPriority.HIGH,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      },
      meeting: {
        title: '📅 Cuộc Họp',
        description: 'Chuẩn bị và tham dự cuộc họp',
        category: TaskCategory.WORK,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
      },
      personal: {
        title: '👤 Công Việc Cá Nhân',
        description: 'Ghi chú và quản lý công việc cá nhân',
        category: TaskCategory.PERSONAL,
        priority: TaskPriority.LOW
      },
      work: {
        title: '💼 Công Việc',
        description: 'Task công việc thường ngày',
        category: TaskCategory.WORK,
        priority: TaskPriority.MEDIUM
      }
    };

    return handleTaskCreate(templates[template]);
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
      await dynamicDeleteTask(taskId, {
        showToast: true,
        confirmMessage: 'Bạn có chắc chắn muốn xóa task này?',
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

  // Status change với quick actions
  const handleTaskStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      switch (status) {
        case TaskStatus.COMPLETED:
          await quickActions.markAsCompleted(taskId);
          break;
        case TaskStatus.IN_PROGRESS:
          await quickActions.markAsInProgress(taskId);
          break;
        case TaskStatus.PENDING:
          await quickActions.markAsPending(taskId);
          break;
        case TaskStatus.CANCELLED:
          await quickActions.markAsCancelled(taskId);
          break;
        default:
          await handleTaskUpdate(taskId, { status });
      }
    } catch (error) {
      console.error('❌ Status change error:', error);
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
        {/* Header với Statistics */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              🚀 Dynamic GraphQL Todos
            </h2>
            {statistics && (
              <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                <span>📊 Tổng: {statistics.total}</span>
                <span>✅ Hoàn thành: {statistics.completed}</span>
                <span>🔄 Đang làm: {statistics.inProgress}</span>
                <span>⏳ Chờ: {statistics.pending}</span>
                {statistics.overdue > 0 && (
                  <span className="text-red-600">⚠️ Quá hạn: {statistics.overdue}</span>
                )}
              </div>
            )}
          </div>

          {/* Quick Action Buttons - TÍNH NĂNG MỚI */}
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-2">
            <button
              onClick={() => setShowDemo(!showDemo)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              {showDemo ? 'Ẩn Demo' : 'Hiện Demo'}
            </button>

            <button
              onClick={() => handleQuickTaskCreate('urgent')}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
              title="Tạo task khẩn cấp ngay"
            >
              <SparklesIcon className="-ml-0.5 mr-2 h-4 w-4" />
              Khẩn cấp
            </button>
            
            <button
              onClick={() => handleQuickTaskCreate('meeting')}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <ClockIcon className="-ml-0.5 mr-2 h-4 w-4" />
              Họp
            </button>

            <button
              onClick={() => handleQuickTaskCreate('work')}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              <BriefcaseIcon className="-ml-0.5 mr-2 h-4 w-4" />
              Công việc
            </button>

            <button
              onClick={() => handleQuickTaskCreate('personal')}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              <UserIcon className="-ml-0.5 mr-2 h-4 w-4" />
              Cá nhân
            </button>

            <button
              onClick={() => handleTaskCreate()}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Tạo Task
            </button>
          </div>
        </div>

        {/* Dynamic Task Demo Component */}
        {showDemo && (
          <div className="mt-6">
            <DynamicTaskDemo 
              onTaskCreated={() => {
                dynamicRefetch();
                refetch();
              }}
            />
          </div>
        )}

        {/* View Mode Selector */}
        <div className="mt-6">
          <ViewModeSelector
            currentMode={viewMode}
            onModeChange={setViewMode}
          />
        </div>

        {/* Main Dashboard View */}
        <div className="mt-8">
          <TaskDashboardView
            tasks={finalTasks}
            loading={finalLoading}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            onTaskCreate={handleTaskCreate}
          />
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
