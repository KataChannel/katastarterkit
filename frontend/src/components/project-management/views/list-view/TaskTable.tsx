'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { TaskData, SortField, SortOrder, STATUS_LABELS, PRIORITY_LABELS } from './types';

interface TaskTableProps {
  tasks: TaskData[];
  sortField: SortField;
  sortOrder: SortOrder;
  onToggleSort: (field: SortField) => void;
  onStatusChange: (taskId: string, status: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskTable({
  tasks,
  sortField,
  sortOrder,
  onToggleSort,
  onStatusChange,
  onDeleteTask,
}: TaskTableProps) {
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />;
    }
    return sortOrder === 'asc' 
      ? <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4 ml-1" /> 
      : <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />;
  };

  const getStatusBadgeClass = (status: string) => {
    return cn(
      "text-xs",
      status === 'COMPLETED' && "border-green-500 text-green-600 bg-green-50",
      status === 'IN_PROGRESS' && "border-orange-500 text-orange-600 bg-orange-50",
      status === 'REVIEW' && "border-purple-500 text-purple-600 bg-purple-50",
      status === 'PENDING' && "border-blue-500 text-blue-600 bg-blue-50",
    );
  };

  const getPriorityBadgeClass = (priority: string) => {
    return cn(
      "text-xs",
      priority === 'URGENT' && "border-red-500 text-red-600 bg-red-50",
      priority === 'HIGH' && "border-orange-500 text-orange-600 bg-orange-50",
      priority === 'MEDIUM' && "border-blue-500 text-blue-600 bg-blue-50",
      priority === 'LOW' && "border-gray-400 text-gray-600 bg-gray-50",
    );
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-sm">Không có task nào</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table - Hidden on mobile */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th 
                className="text-left p-3 font-medium cursor-pointer hover:bg-muted transition-colors"
                onClick={() => onToggleSort('title')}
              >
                <div className="flex items-center text-sm">
                  Tiêu đề
                  {getSortIcon('title')}
                </div>
              </th>
              <th 
                className="text-left p-3 font-medium cursor-pointer hover:bg-muted transition-colors"
                onClick={() => onToggleSort('status')}
              >
                <div className="flex items-center text-sm">
                  Trạng thái
                  {getSortIcon('status')}
                </div>
              </th>
              <th 
                className="text-left p-3 font-medium cursor-pointer hover:bg-muted transition-colors"
                onClick={() => onToggleSort('priority')}
              >
                <div className="flex items-center text-sm">
                  Ưu tiên
                  {getSortIcon('priority')}
                </div>
              </th>
              <th 
                className="text-left p-3 font-medium cursor-pointer hover:bg-muted transition-colors"
                onClick={() => onToggleSort('dueDate')}
              >
                <div className="flex items-center text-sm">
                  Deadline
                  {getSortIcon('dueDate')}
                </div>
              </th>
              <th className="text-left p-3 font-medium text-sm">
                Người thực hiện
              </th>
              <th className="text-center p-3 font-medium text-sm">
                Points
              </th>
              <th className="w-12 p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-3">
                  <div className="max-w-[300px]">
                    <p className="font-medium text-sm truncate">{task.title}</p>
                    {task.description && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </div>
                </td>
                <td className="p-3">
                  <Badge variant="outline" className={getStatusBadgeClass(task.status)}>
                    {STATUS_LABELS[task.status] || task.status}
                  </Badge>
                </td>
                <td className="p-3">
                  <Badge variant="outline" className={getPriorityBadgeClass(task.priority)}>
                    {PRIORITY_LABELS[task.priority] || task.priority}
                  </Badge>
                </td>
                <td className="p-3">
                  {task.dueDate ? (
                    <span className={cn(
                      "text-sm",
                      new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED' && "text-red-500 font-medium"
                    )}>
                      {format(new Date(task.dueDate), 'dd/MM/yyyy')}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </td>
                <td className="p-3">
                  {task.user ? (
                    <div className="flex items-center gap-2">
                      {task.user.avatar ? (
                        <img 
                          src={task.user.avatar}
                          className="w-6 h-6 rounded-full object-cover"
                          alt=""
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                          {task.user.firstName?.[0]}
                        </div>
                      )}
                      <span className="text-sm">
                        {task.user.firstName} {task.user.lastName?.[0]}.
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </td>
                <td className="p-3 text-center">
                  <span className="text-sm font-medium">{task.storyPoints || '-'}</span>
                </td>
                <td className="p-3">
                  <TaskActions
                    task={task}
                    onStatusChange={onStatusChange}
                    onDelete={onDeleteTask}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden divide-y">
        {tasks.map((task) => (
          <MobileTaskCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onDelete={onDeleteTask}
            getStatusBadgeClass={getStatusBadgeClass}
            getPriorityBadgeClass={getPriorityBadgeClass}
          />
        ))}
      </div>
    </>
  );
}

// Task Actions Dropdown
function TaskActions({
  task,
  onStatusChange,
  onDelete,
}: {
  task: TaskData;
  onStatusChange: (taskId: string, status: string) => void;
  onDelete: (taskId: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Đổi trạng thái</DropdownMenuLabel>
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <DropdownMenuItem 
            key={value} 
            onClick={() => onStatusChange(task.id, value)}
            disabled={task.status === value}
            className="cursor-pointer"
          >
            {label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive cursor-pointer focus:text-destructive" 
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Mobile Task Card
function MobileTaskCard({
  task,
  onStatusChange,
  onDelete,
  getStatusBadgeClass,
  getPriorityBadgeClass,
}: {
  task: TaskData;
  onStatusChange: (taskId: string, status: string) => void;
  onDelete: (taskId: string) => void;
  getStatusBadgeClass: (status: string) => string;
  getPriorityBadgeClass: (priority: string) => string;
}) {
  return (
    <div className="p-4 space-y-3">
      {/* Header: Title + Actions */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm leading-tight">{task.title}</p>
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
              {task.description}
            </p>
          )}
        </div>
        <TaskActions
          task={task}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      </div>

      {/* Badges: Status + Priority */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className={getStatusBadgeClass(task.status)}>
          {STATUS_LABELS[task.status] || task.status}
        </Badge>
        <Badge variant="outline" className={getPriorityBadgeClass(task.priority)}>
          {PRIORITY_LABELS[task.priority] || task.priority}
        </Badge>
      </div>

      {/* Info Row: Deadline + User + Points */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {task.dueDate && (
          <div className={cn(
            "flex items-center gap-1",
            new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED' && "text-red-500"
          )}>
            <span>📅</span>
            <span>{format(new Date(task.dueDate), 'dd/MM/yyyy')}</span>
          </div>
        )}
        
        {task.user && (
          <div className="flex items-center gap-1.5">
            {task.user.avatar ? (
              <img 
                src={task.user.avatar}
                className="w-4 h-4 rounded-full object-cover"
                alt=""
              />
            ) : (
              <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium">
                {task.user.firstName?.[0]}
              </div>
            )}
            <span>{task.user.firstName} {task.user.lastName?.[0]}.</span>
          </div>
        )}
        
        {task.storyPoints && (
          <div className="flex items-center gap-1">
            <span>⭐</span>
            <span>{task.storyPoints} pts</span>
          </div>
        )}
      </div>
    </div>
  );
}
