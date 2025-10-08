'use client';

import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Calendar, User, Edit3, Trash2 } from 'lucide-react';
import { CompletedTasksBlockContent, PageBlock } from '@/types/page-builder';

// GraphQL Query to fetch tasks with dynamic status filter
const GET_TASKS_BY_STATUS = gql`
  query GetTasksByStatus($page: Int!, $limit: Int!, $status: TaskStatus!) {
    getTasksPaginated(
      page: $page
      limit: $limit
      filters: { status: $status }
    ) {
      data {
        id
        title
        description
        status
        priority
        dueDate
        userId
        createdAt
        updatedAt
      }
      meta {
        total
        page
        limit
        totalPages
        hasNextPage
        hasPrevPage
      }
    }
  }
`;

interface CompletedTasksBlockProps {
  block: PageBlock;
  isEditable?: boolean;
  onUpdate?: (content: any, style?: any) => void;
  onDelete?: () => void;
}

export function CompletedTasksBlock({ block, isEditable = false, onUpdate, onDelete }: CompletedTasksBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState<CompletedTasksBlockContent>(block.content);

  const {
    title = 'Completed Tasks',
    subtitle = 'Our recent achievements',
    limit = 10,
    showDate = true,
    showAssignee = true,
    layout = 'list',
    filterByProject,
    sortBy = 'completedDate',
    statusFilter = ['COMPLETED']
  } = content;

  const handleSave = () => {
    onUpdate?.(content, block.style);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setContent(block.content);
    setIsEditing(false);
  };

  const toggleStatus = (status: string) => {
    const currentStatuses = content.statusFilter || ['COMPLETED'];
    if (currentStatuses.includes(status)) {
      // Remove if already selected
      setContent(prev => ({
        ...prev,
        statusFilter: currentStatuses.filter(s => s !== status)
      }));
    } else {
      // Add if not selected
      setContent(prev => ({
        ...prev,
        statusFilter: [...currentStatuses, status]
      }));
    }
  };

  // Get first status for single query (backend only supports single status filter)
  const primaryStatus = (statusFilter && statusFilter.length > 0) ? statusFilter[0] : 'COMPLETED';

  // Editing Mode UI
  if (isEditing && isEditable) {
    return (
      <div className="relative border-2 border-blue-500 rounded-lg p-6">
        <div className="space-y-4">
          {/* Title & Subtitle */}
          <div>
            <label className="block text-sm font-medium mb-1">Tiêu đề</label>
            <input
              type="text"
              value={content.title || 'Completed Tasks'}
              onChange={(e) => setContent(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 border rounded"
              placeholder="Tiêu đề block..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <input
              type="text"
              value={content.subtitle || ''}
              onChange={(e) => setContent(prev => ({ ...prev, subtitle: e.target.value }))}
              className="w-full p-2 border rounded"
              placeholder="Mô tả ngắn..."
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Trạng thái hiển thị</label>
            <div className="flex flex-wrap gap-2">
              {['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(status => (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={`px-3 py-1 rounded text-sm ${
                    (content.statusFilter || ['COMPLETED']).includes(status)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {status === 'PENDING' && '⏳ Chờ xử lý'}
                  {status === 'IN_PROGRESS' && '🔄 Đang thực hiện'}
                  {status === 'COMPLETED' && '✅ Hoàn thành'}
                  {status === 'CANCELLED' && '❌ Đã hủy'}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Hiện tại: {(content.statusFilter || ['COMPLETED']).join(', ')}
            </p>
          </div>

          {/* Limit Control */}
          <div>
            <label className="block text-sm font-medium mb-1">Số lượng hiển thị</label>
            <input
              type="number"
              value={content.limit || 10}
              onChange={(e) => setContent(prev => ({ ...prev, limit: parseInt(e.target.value) || 10 }))}
              className="w-full p-2 border rounded"
              min="1"
              max="100"
              placeholder="10"
            />
          </div>

          {/* Layout Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Kiểu hiển thị</label>
            <div className="flex gap-2">
              {[
                { value: 'list', label: '📋 Danh sách' },
                { value: 'grid', label: '🔲 Lưới' },
                { value: 'timeline', label: '⏱️ Timeline' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setContent(prev => ({ ...prev, layout: value as any }))}
                  className={`px-3 py-1 rounded text-sm ${
                    (content.layout || 'list') === value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Display Options */}
          <div>
            <label className="block text-sm font-medium mb-2">Tùy chọn hiển thị</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={content.showDate !== false}
                  onChange={(e) => setContent(prev => ({ ...prev, showDate: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm">Hiển thị ngày hoàn thành</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={content.showAssignee !== false}
                  onChange={(e) => setContent(prev => ({ ...prev, showAssignee: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm">Hiển thị người được giao</span>
              </label>
            </div>
          </div>

          {/* Save/Cancel Buttons */}
          <div className="flex gap-2 pt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Lưu
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { data, loading, error } = useQuery(GET_TASKS_BY_STATUS, {
    variables: { page: 1, limit, status: primaryStatus },
    skip: isEditing,
  });

  if (loading) {
    return (
      <div className="w-full py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12 text-center text-red-600">
        <p>Error loading tasks: {error.message}</p>
      </div>
    );
  }

  const tasks = data?.getTasksPaginated?.data || [];
  const totalTasks = data?.getTasksPaginated?.meta?.total || 0;

  if (tasks.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <CheckCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No completed tasks yet</p>
      </div>
    );
  }

  return (
    <section className={`relative w-full py-12 px-4 ${isEditable ? 'group' : ''}`} style={block.style}>
      {/* Edit/Delete buttons for editable mode */}
      {isEditable && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <div className="flex gap-1">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              title="Chỉnh sửa"
            >
              <Edit3 size={12} />
            </button>
            <button
              onClick={onDelete}
              className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
              title="Xóa"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
          )}
          <div className="mt-4">
            <Badge variant="secondary" className="text-lg px-4 py-1">
              {totalTasks} tasks completed
            </Badge>
          </div>
        </div>

        {/* Tasks List/Grid */}
        {layout === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task: any) => (
              <Card key={task.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <Badge 
                      variant={task.priority === 'HIGH' ? 'destructive' : task.priority === 'MEDIUM' ? 'default' : 'secondary'}
                      className="ml-2"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  <CardTitle className="mt-2">{task.title}</CardTitle>
                  {task.description && (
                    <CardDescription className="line-clamp-2">{task.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {showDate && task.updatedAt && (
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Completed: {new Date(task.updatedAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    )}
                    {task.dueDate && (
                      <div className="flex items-center text-gray-500 text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>Due: {new Date(task.dueDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : layout === 'timeline' ? (
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <div className="space-y-8">
              {tasks.map((task: any, index: number) => (
                <div key={task.id} className="relative pl-16">
                  <div className="absolute left-6 top-2 w-5 h-5 rounded-full bg-green-500 border-4 border-white"></div>
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle>{task.title}</CardTitle>
                          {task.description && (
                            <CardDescription className="mt-2">{task.description}</CardDescription>
                          )}
                        </div>
                        <Badge 
                          variant={task.priority === 'HIGH' ? 'destructive' : task.priority === 'MEDIUM' ? 'default' : 'secondary'}
                        >
                          {task.priority}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {showDate && task.updatedAt && (
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>Completed: {new Date(task.updatedAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                        )}
                        {task.dueDate && (
                          <div className="flex items-center text-gray-500">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>Due: {new Date(task.dueDate).toLocaleDateString('vi-VN')}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // List layout
          <div className="space-y-4">
            {tasks.map((task: any) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-start space-x-4 flex-1">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{task.title}</h3>
                      {task.description && (
                        <p className="text-gray-600 text-sm line-clamp-2">{task.description}</p>
                      )}
                      <div className="flex flex-wrap gap-3 mt-3 text-sm">
                        {showDate && task.updatedAt && (
                          <div className="flex items-center text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>Completed: {new Date(task.updatedAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                        )}
                        {task.dueDate && (
                          <div className="flex items-center text-gray-400 text-xs">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>Due: {new Date(task.dueDate).toLocaleDateString('vi-VN')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant={task.priority === 'HIGH' ? 'destructive' : task.priority === 'MEDIUM' ? 'default' : 'secondary'}
                    className="ml-4"
                  >
                    {task.priority}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
