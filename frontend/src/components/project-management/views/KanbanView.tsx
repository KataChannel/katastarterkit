'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  MoreHorizontal, 
  Circle,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  GripVertical,
  Clock,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// GraphQL Queries
const GET_KANBAN_TASKS = gql`
  query GetKanbanTasks($projectId: ID!) {
    projectTasks(projectId: $projectId) {
      id
      title
      description
      status
      priority
      kanbanColumn
      storyPoints
      dueDate
      user {
        id
        firstName
        lastName
        avatar
      }
    }
  }
`;

const UPDATE_TASK_COLUMN = gql`
  mutation UpdateTaskColumn($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      kanbanColumn
      status
    }
  }
`;

interface KanbanViewProps {
  projectId: string;
}

// Default Kanban columns
const DEFAULT_COLUMNS = [
  { id: 'backlog', title: 'Backlog', icon: Circle, color: 'text-gray-500', limit: null },
  { id: 'todo', title: 'Cần làm', icon: AlertCircle, color: 'text-blue-500', limit: 5 },
  { id: 'in_progress', title: 'Đang làm', icon: PlayCircle, color: 'text-orange-500', limit: 3 },
  { id: 'review', title: 'Đang review', icon: Clock, color: 'text-purple-500', limit: 2 },
  { id: 'done', title: 'Hoàn thành', icon: CheckCircle2, color: 'text-green-500', limit: null },
];

export function KanbanView({ projectId }: KanbanViewProps) {
  const [columns] = useState(DEFAULT_COLUMNS);
  
  const { data, loading, refetch } = useQuery(GET_KANBAN_TASKS, {
    variables: { projectId },
    fetchPolicy: 'network-only',
  });

  const [updateTaskColumn] = useMutation(UPDATE_TASK_COLUMN, {
    onCompleted: () => refetch(),
  });

  const tasks = data?.projectTasks || [];

  // Group tasks by column
  const getTasksByColumn = (columnId: string) => {
    return tasks.filter((task: any) => {
      const col = task.kanbanColumn || mapStatusToColumn(task.status);
      return col === columnId;
    });
  };

  const mapStatusToColumn = (status: string) => {
    switch (status) {
      case 'PENDING': return 'todo';
      case 'IN_PROGRESS': return 'in_progress';
      case 'COMPLETED': return 'done';
      case 'CANCELLED': return 'done';
      default: return 'backlog';
    }
  };

  const mapColumnToStatus = (columnId: string) => {
    switch (columnId) {
      case 'todo': return 'PENDING';
      case 'in_progress': return 'IN_PROGRESS';
      case 'review': return 'IN_PROGRESS';
      case 'done': return 'COMPLETED';
      default: return 'PENDING';
    }
  };

  const handleMoveTask = async (taskId: string, newColumn: string) => {
    await updateTaskColumn({
      variables: {
        id: taskId,
        input: {
          kanbanColumn: newColumn,
          status: mapColumnToStatus(newColumn),
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Kanban Board</h2>
          <p className="text-muted-foreground">Theo dõi luồng công việc hàng ngày</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Thêm Task
        </Button>
      </div>

      {/* Kanban Board */}
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4 min-w-max">
          {columns.map((column) => {
            const columnTasks = getTasksByColumn(column.id);
            const isOverLimit = column.limit && columnTasks.length > column.limit;
            const Icon = column.icon;

            return (
              <div 
                key={column.id} 
                className="w-[300px] shrink-0"
              >
                <Card className={cn(
                  "h-full",
                  isOverLimit && "border-red-300 bg-red-50/50"
                )}>
                  {/* Column Header */}
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Icon className={cn("w-4 h-4", column.color)} />
                        {column.title}
                        <Badge variant="secondary" className={cn(
                          isOverLimit && "bg-red-100 text-red-700"
                        )}>
                          {columnTasks.length}
                          {column.limit && `/${column.limit}`}
                        </Badge>
                      </CardTitle>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                    {isOverLimit && (
                      <p className="text-xs text-red-600 mt-1">
                        ⚠️ Vượt quá giới hạn WIP
                      </p>
                    )}
                  </CardHeader>

                  {/* Column Content */}
                  <CardContent className="space-y-2 min-h-[200px]">
                    {columnTasks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Kéo thả tasks vào đây
                        </p>
                      </div>
                    ) : (
                      columnTasks.map((task: any) => (
                        <KanbanCard 
                          key={task.id} 
                          task={task} 
                          columns={columns}
                          currentColumn={column.id}
                          onMove={handleMoveTask}
                        />
                      ))
                    )}

                    {/* Add Task Button */}
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Thêm task
                    </Button>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

// Kanban Card Component
interface KanbanCardProps {
  task: any;
  columns: typeof DEFAULT_COLUMNS;
  currentColumn: string;
  onMove: (taskId: string, columnId: string) => void;
}

function KanbanCard({ task, columns, currentColumn, onMove }: KanbanCardProps) {
  const priorityColors: Record<string, string> = {
    URGENT: 'border-l-red-500',
    HIGH: 'border-l-orange-500',
    MEDIUM: 'border-l-blue-500',
    LOW: 'border-l-gray-400',
  };

  const priorityLabels: Record<string, string> = {
    URGENT: 'Khẩn cấp',
    HIGH: 'Cao',
    MEDIUM: 'TB',
    LOW: 'Thấp',
  };

  return (
    <Card className={cn(
      "border-l-4 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing",
      priorityColors[task.priority] || 'border-l-gray-400'
    )}>
      <CardContent className="p-3 space-y-2">
        {/* Header with drag handle */}
        <div className="flex items-start gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm line-clamp-2">{task.title}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {columns
                .filter((col) => col.id !== currentColumn)
                .map((col) => {
                  const Icon = col.icon;
                  return (
                    <DropdownMenuItem 
                      key={col.id}
                      onClick={() => onMove(task.id, col.id)}
                    >
                      <Icon className={cn("w-4 h-4 mr-2", col.color)} />
                      Di chuyển đến {col.title}
                    </DropdownMenuItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            {/* Priority Badge */}
            <Badge variant="outline" className="text-xs px-1.5 py-0">
              {priorityLabels[task.priority] || 'TB'}
            </Badge>
            
            {/* Story Points */}
            {task.storyPoints && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                {task.storyPoints} SP
              </Badge>
            )}
          </div>

          {/* Assignee */}
          {task.user && (
            <div className="flex items-center">
              {task.user.avatar ? (
                <img 
                  src={task.user.avatar} 
                  alt={task.user.firstName}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                  {task.user.firstName?.[0]}{task.user.lastName?.[0]}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {new Date(task.dueDate).toLocaleDateString('vi-VN')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
