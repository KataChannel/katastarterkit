import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTaskMutations } from '../../hooks/useTodos';
import { TaskCategory, TaskPriority, CreateTaskInput } from '../../types/todo';
import toast from 'react-hot-toast';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated?: () => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onTaskCreated,
}) => {
  const [formData, setFormData] = useState<CreateTaskInput>({
    title: '',
    description: '',
    category: TaskCategory.PERSONAL,
    priority: TaskPriority.MEDIUM,
    dueDate: '',
  });

  const { createTask, loading } = useTaskMutations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề task');
      return;
    }

    try {
      const taskData: CreateTaskInput = {
        title: formData.title.trim(),
        description: formData.description?.trim() || undefined,
        category: formData.category,
        priority: formData.priority,
        dueDate: formData.dueDate || undefined,
      };

      await createTask(taskData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: TaskCategory.PERSONAL,
        priority: TaskPriority.MEDIUM,
        dueDate: '',
      });

      onTaskCreated?.();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi tạo task');
    }
  };

  const handleInputChange = (field: keyof CreateTaskInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Tạo Task Mới
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Nhập tiêu đề task..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Nhập mô tả chi tiết..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value as TaskCategory)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={TaskCategory.WORK}>Công việc</option>
                  <option value={TaskCategory.PERSONAL}>Cá nhân</option>
                  <option value={TaskCategory.STUDY}>Học tập</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Độ ưu tiên
                </label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value as TaskPriority)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={TaskPriority.LOW}>Thấp</option>
                  <option value={TaskPriority.MEDIUM}>Trung bình</option>
                  <option value={TaskPriority.HIGH}>Cao</option>
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                Hạn chót
              </label>
              <input
                type="datetime-local"
                id="dueDate"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading.creating}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading.creating || !formData.title.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading.creating ? 'Đang tạo...' : 'Tạo Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
