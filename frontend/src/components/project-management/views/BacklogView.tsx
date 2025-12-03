'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Inbox, 
  ArrowUp, 
  ArrowDown,
  Search,
  Filter,
  MoreVertical,
  Plus,
  ChevronRight,
  Loader2,
  GripVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// GraphQL Queries
const GET_BACKLOG_TASKS = gql`
  query GetBacklogTasks($projectId: ID!) {
    projectTasks(projectId: $projectId) {
      id
      title
      description
      status
      priority
      storyPoints
      createdAt
      sprintId
      user {
        id
        firstName
        lastName
        avatar
      }
    }
  }
`;

const GET_SPRINTS = gql`
  query GetSprints($projectId: ID!) {
    sprints(projectId: $projectId) {
      id
      name
      status
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      sprintId
      storyPoints
      priority
    }
  }
`;

interface BacklogViewProps {
  projectId: string;
}

export function BacklogView({ projectId }: BacklogViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'created' | 'points'>('priority');

  const { data, loading, refetch } = useQuery(GET_BACKLOG_TASKS, {
    variables: { projectId },
    fetchPolicy: 'network-only',
  });

  const { data: sprintsData } = useQuery(GET_SPRINTS, {
    variables: { projectId },
  });

  const [updateTask] = useMutation(UPDATE_TASK, {
    onCompleted: () => refetch(),
  });

  // Filter only tasks without sprintId (backlog tasks)
  const allTasks = data?.projectTasks || [];
  const tasks = allTasks.filter((t: any) => !t.sprintId);
  const sprints = sprintsData?.sprints || [];
  const plannedSprints = sprints.filter((s: any) => s.status === 'PLANNED' || s.status === 'ACTIVE');

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter((task: any) => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    })
    .sort((a: any, b: any) => {
      if (sortBy === 'priority') {
        const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
        return (priorityOrder[a.priority as keyof typeof priorityOrder] || 4) - 
               (priorityOrder[b.priority as keyof typeof priorityOrder] || 4);
      }
      if (sortBy === 'created') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'points') {
        return (b.storyPoints || 0) - (a.storyPoints || 0);
      }
      return 0;
    });

  // Calculate stats
  const totalPoints = tasks.reduce((sum: number, task: any) => sum + (task.storyPoints || 0), 0);
  const urgentCount = tasks.filter((t: any) => t.priority === 'URGENT').length;
  const highCount = tasks.filter((t: any) => t.priority === 'HIGH').length;

  const handleMoveToSprint = async (taskId: string, sprintId: string) => {
    await updateTask({
      variables: {
        id: taskId,
        input: { sprintId },
      },
    });
  };

  const handleUpdatePoints = async (taskId: string, points: number) => {
    await updateTask({
      variables: {
        id: taskId,
        input: { storyPoints: points },
      },
    });
  };

  const handleUpdatePriority = async (taskId: string, priority: string) => {
    await updateTask({
      variables: {
        id: taskId,
        input: { priority },
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Inbox className="w-6 h-6" />
            Product Backlog
          </h2>
          <p className="text-muted-foreground">
            Quản lý và ưu tiên các tasks chưa được gán vào sprint
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Thêm Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tổng Tasks</CardDescription>
            <CardTitle className="text-3xl">{tasks.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Story Points</CardDescription>
            <CardTitle className="text-3xl">{totalPoints}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              Khẩn cấp
            </CardDescription>
            <CardTitle className="text-3xl text-red-600">{urgentCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              Cao
            </CardDescription>
            <CardTitle className="text-3xl text-orange-600">{highCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Ưu tiên" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="URGENT">Khẩn cấp</SelectItem>
              <SelectItem value="HIGH">Cao</SelectItem>
              <SelectItem value="MEDIUM">Trung bình</SelectItem>
              <SelectItem value="LOW">Thấp</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">Theo ưu tiên</SelectItem>
              <SelectItem value="created">Mới nhất</SelectItem>
              <SelectItem value="points">Story Points</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Backlog Items */}
      {filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Inbox className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Backlog trống</h3>
            <p className="text-muted-foreground text-sm">
              {searchQuery || priorityFilter !== 'all' 
                ? 'Không tìm thấy tasks phù hợp với bộ lọc'
                : 'Thêm tasks mới hoặc di chuyển từ sprint về backlog'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task: any, index: number) => (
            <BacklogItemCard
              key={task.id}
              task={task}
              index={index}
              sprints={plannedSprints}
              onMoveToSprint={handleMoveToSprint}
              onUpdatePoints={handleUpdatePoints}
              onUpdatePriority={handleUpdatePriority}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Backlog Item Card Component
interface BacklogItemCardProps {
  task: any;
  index: number;
  sprints: any[];
  onMoveToSprint: (taskId: string, sprintId: string) => void;
  onUpdatePoints: (taskId: string, points: number) => void;
  onUpdatePriority: (taskId: string, priority: string) => void;
}

function BacklogItemCard({ 
  task, 
  index, 
  sprints, 
  onMoveToSprint,
  onUpdatePoints,
  onUpdatePriority,
}: BacklogItemCardProps) {
  const priorityConfig: Record<string, { color: string; bg: string; label: string }> = {
    URGENT: { color: 'text-red-600', bg: 'bg-red-100', label: 'Khẩn cấp' },
    HIGH: { color: 'text-orange-600', bg: 'bg-orange-100', label: 'Cao' },
    MEDIUM: { color: 'text-blue-600', bg: 'bg-blue-100', label: 'Trung bình' },
    LOW: { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Thấp' },
  };

  const priority = priorityConfig[task.priority] || priorityConfig.MEDIUM;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <GripVertical className="w-4 h-4 cursor-grab" />
            <span className="text-sm font-medium w-6">#{index + 1}</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium line-clamp-1">{task.title}</h4>
                {task.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {task.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Story Points */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 w-12">
                      {task.storyPoints || '-'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {[1, 2, 3, 5, 8, 13, 21].map((points) => (
                      <DropdownMenuItem 
                        key={points}
                        onClick={() => onUpdatePoints(task.id, points)}
                      >
                        {points} SP
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Move to Sprint */}
                {sprints.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {sprints.map((sprint: any) => (
                        <DropdownMenuItem 
                          key={sprint.id}
                          onClick={() => onMoveToSprint(task.id, sprint.id)}
                        >
                          {sprint.name}
                          {sprint.status === 'ACTIVE' && (
                            <Badge variant="default" className="ml-2 text-xs">
                              Active
                            </Badge>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {/* More Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onUpdatePriority(task.id, 'URGENT')}>
                      <ArrowUp className="w-4 h-4 mr-2 text-red-600" />
                      Đặt Khẩn cấp
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUpdatePriority(task.id, 'HIGH')}>
                      <ArrowUp className="w-4 h-4 mr-2 text-orange-600" />
                      Đặt Cao
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUpdatePriority(task.id, 'LOW')}>
                      <ArrowDown className="w-4 h-4 mr-2 text-gray-600" />
                      Đặt Thấp
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-3 mt-3">
              <Badge variant="outline" className={cn('text-xs', priority.color, priority.bg)}>
                {priority.label}
              </Badge>
              {task.user && (
                <div className="flex items-center gap-1">
                  {task.user.avatar ? (
                    <img src={task.user.avatar} className="w-5 h-5 rounded-full" alt="" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                      {task.user.firstName?.[0]}
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {task.user.firstName}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
