'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Task } from '@/types/task';

export interface TaskCardProps {
  task: Task;
  index: number;
  onMove?: (dragIndex: number, dropIndex: number) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onToggleComplete?: (taskId: string) => void;
  isSelected?: boolean;
  onSelect?: (taskId: string) => void;
  showPresence?: boolean;
  collaborators?: Array<{
    userId: string;
    userName: string;
    avatar?: string;
    isEditing?: boolean;
  }>;
  className?: string;
  style?: React.CSSProperties;
}

const ItemType = 'TASK_CARD';

interface DragItem {
  id: string;
  index: number;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  index,
  onMove,
  onEdit,
  onDelete,
  onToggleComplete,
  isSelected = false,
  onSelect,
  showPresence = false,
  collaborators = [],
  className = '',
  style,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Drag functionality
  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>({
    type: ItemType,
    item: { id: task.id, index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => !!onMove,
  });
  
  // Drop functionality
  const [, drop] = useDrop<DragItem, void, {}>({
    accept: ItemType,
    hover: (draggedItem: DragItem) => {
      if (!cardRef.current || !onMove) return;
      
      if (draggedItem.index !== index) {
        setIsDragOver(true);
      }
    },
    drop: (draggedItem: DragItem) => {
      setIsDragOver(false);
      if (draggedItem.index !== index && onMove) {
        onMove(draggedItem.index, index);
      }
    },
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
    }),
  });
  
  // Combine drag and drop refs
  const dragDropRef = useCallback(
    (node: HTMLDivElement | null) => {
      cardRef.current = node;
      drag(node);
      drop(node);
    },
    [drag, drop]
  );
  
  // Priority color mapping
  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-300 bg-white';
    }
  };
  
  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
  
  // Format date
  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffTime = d.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 0) return `In ${diffDays} days`;
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    
    return d.toLocaleDateString();
  };
  
  // Handle card click
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(task.id);
  }, [task.id, onSelect]);
  
  // Handle edit
  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(task);
  }, [task, onEdit]);
  
  // Handle delete
  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(task.id);
  }, [task.id, onDelete]);
  
  // Handle toggle complete
  const handleToggleComplete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete?.(task.id);
  }, [task.id, onToggleComplete]);
  
  const cardClasses = `
    ${getPriorityColor(task.priority)}
    ${isSelected ? 'ring-2 ring-blue-500' : ''}
    ${isDragging ? 'opacity-50 transform rotate-2' : ''}
    ${isDragOver ? 'border-t-4 border-t-blue-500' : ''}
    ${className}
    border-l-4 rounded-lg p-4 mb-3 shadow-sm hover:shadow-md
    transition-all duration-200 cursor-pointer
    transform hover:scale-[1.02]
  `.trim();
  
  return (
    <div
      ref={onMove ? dragDropRef : cardRef}
      className={cardClasses}
      style={style}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragOver(false);
      }}
      role="article"
      aria-selected={isSelected}
      tabIndex={0}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        
        {/* Action buttons */}
        {isHovered && (
          <div className="flex items-center space-x-1 ml-2">
            <button
              onClick={handleToggleComplete}
              className={`p-1 rounded-full hover:bg-gray-200 ${
                task.status === 'COMPLETED' ? 'text-green-600' : 'text-gray-400'
              }`}
              title={task.status === 'COMPLETED' ? 'Mark incomplete' : 'Mark complete'}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path 
                  fillRule="evenodd" 
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                  clipRule="evenodd"
                />
              </svg>
            </button>
            
            <button
              onClick={handleEdit}
              className="p-1 rounded-full hover:bg-gray-200 text-gray-400"
              title="Edit task"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            
            <button
              onClick={handleDelete}
              className="p-1 rounded-full hover:bg-gray-200 text-red-400 hover:text-red-600"
              title="Delete task"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path 
                  fillRule="evenodd" 
                  d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 102 0v3a1 1 0 11-2 0V9zm4 0a1 1 0 10-2 0v3a1 1 0 102 0V9z" 
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.tags.map((tag: string, idx: number) => (
            <span
              key={idx}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
        <div className="flex items-center space-x-2">
          {/* Status badge */}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
            {task.status?.replace('_', ' ')}
          </span>
          
          {/* Due date */}
          {task.dueDate && (
            <span className={`${
              new Date(task.dueDate) < new Date() ? 'text-red-600' : 'text-gray-600'
            }`}>
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
        
        {/* Collaborators and presence indicators */}
        <div className="flex items-center space-x-1">
          {/* Progress indicator */}
          {task.subtasks && task.subtasks.length > 0 && (
            <div className="flex items-center space-x-1">
              <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{
                    width: `${(task.completedSubtasks || 0) / task.subtasks.length * 100}%`
                  }}
                />
              </div>
              <span className="text-xs">
                {task.completedSubtasks || 0}/{task.subtasks.length}
              </span>
            </div>
          )}
          
          {/* Collaborator avatars */}
          {showPresence && collaborators.length > 0 && (
            <div className="flex -space-x-1">
              {collaborators.slice(0, 3).map((collaborator, idx) => (
                <div
                  key={collaborator.userId}
                  className={`
                    relative w-6 h-6 rounded-full border-2 border-white
                    ${collaborator.isEditing ? 'ring-2 ring-green-500' : ''}
                  `}
                  title={`${collaborator.userName}${collaborator.isEditing ? ' (editing)' : ''}`}
                >
                  {collaborator.avatar ? (
                    <img
                      src={collaborator.avatar}
                      alt={collaborator.userName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                      {collaborator.userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  
                  {collaborator.isEditing && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white">
                      <div className="w-full h-full bg-green-400 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              ))}
              
              {collaborators.length > 3 && (
                <div 
                  className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600"
                  title={`+${collaborators.length - 3} more`}
                >
                  +{collaborators.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Drag indicator */}
      {onMove && isDragging && (
        <div className="absolute inset-0 bg-blue-100 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center">
          <span className="text-blue-600 font-medium">Moving...</span>
        </div>
      )}
    </div>
  );
};

// Task List with Virtual Scrolling and Drag & Drop
export interface VirtualTaskListProps {
  tasks: Task[];
  itemHeight?: number;
  containerHeight: number;
  onMove?: (dragIndex: number, dropIndex: number) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onToggleComplete?: (taskId: string) => void;
  onSelect?: (taskId: string) => void;
  selectedTaskIds?: string[];
  showPresence?: boolean;
  collaboratorsMap?: Record<string, Array<{
    userId: string;
    userName: string;
    avatar?: string;
    isEditing?: boolean;
  }>>;
  loadMoreTasks?: (offset: number, limit: number) => Promise<Task[]>;
  hasNextPage?: boolean;
  isLoading?: boolean;
}

export const VirtualTaskList: React.FC<VirtualTaskListProps> = ({
  tasks,
  itemHeight = 120,
  containerHeight,
  onMove,
  onEdit,
  onDelete,
  onToggleComplete,
  onSelect,
  selectedTaskIds = [],
  showPresence = false,
  collaboratorsMap = {},
  loadMoreTasks,
  hasNextPage = false,
  isLoading = false,
}) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="virtual-task-list">
        {/* Add VirtualScroll implementation here */}
        <div className="space-y-2">
          {tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              onMove={onMove}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleComplete={onToggleComplete}
              onSelect={onSelect}
              isSelected={selectedTaskIds.includes(task.id)}
              showPresence={showPresence}
              collaborators={collaboratorsMap[task.id] || []}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};