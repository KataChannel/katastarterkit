'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Target, 
  TrendingUp,
  PlayCircle,
  PauseCircle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';
import { vi } from 'date-fns/locale';

// GraphQL Queries
const GET_ACTIVE_SPRINT = gql`
  query GetActiveSprint($projectId: ID!) {
    activeSprint(projectId: $projectId) {
      id
      name
      goal
      status
      startDate
      endDate
      capacity
      committed
      completed
      velocity
      tasks {
        id
        title
        status
        priority
        storyPoints
        completedAt
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
      startDate
      endDate
      capacity
      committed
      completed
      velocity
    }
  }
`;

const CLOSE_SPRINT = gql`
  mutation CloseSprint($input: CloseSprintInput!) {
    closeSprint(input: $input) {
      id
      status
      velocity
    }
  }
`;

interface SprintViewProps {
  projectId: string;
}

export function SprintView({ projectId }: SprintViewProps) {
  const { data, loading, refetch } = useQuery(GET_ACTIVE_SPRINT, {
    variables: { projectId },
    fetchPolicy: 'network-only',
  });

  const { data: sprintsData } = useQuery(GET_SPRINTS, {
    variables: { projectId },
  });

  const [closeSprint, { loading: closing }] = useMutation(CLOSE_SPRINT, {
    onCompleted: () => {
      refetch();
    },
  });

  const sprint = data?.activeSprint;
  const sprints = sprintsData?.sprints || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!sprint) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Không có Sprint đang hoạt động</CardTitle>
          <CardDescription>
            Tạo sprint mới hoặc kích hoạt sprint từ backlog để bắt đầu
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const daysRemaining = sprint.endDate 
    ? differenceInDays(new Date(sprint.endDate), new Date())
    : 0;
  
  const progressPercent = sprint.capacity > 0 
    ? Math.round((sprint.completed / sprint.capacity) * 100) 
    : 0;

  const completedTasks = sprint.tasks?.filter((t: any) => t.status === 'COMPLETED') || [];
  const inProgressTasks = sprint.tasks?.filter((t: any) => t.status === 'IN_PROGRESS') || [];
  const pendingTasks = sprint.tasks?.filter((t: any) => t.status === 'PENDING') || [];

  const handleCloseSprint = () => {
    if (confirm(`Đóng sprint "${sprint.name}"? Tasks chưa hoàn thành sẽ được đưa về backlog.`)) {
      closeSprint({
        variables: {
          input: {
            id: sprint.id,
          },
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Sprint Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="gap-1">
              <PlayCircle className="w-3 h-3" />
              {sprint.status}
            </Badge>
            <h2 className="text-2xl font-bold">{sprint.name}</h2>
          </div>
          {sprint.goal && (
            <p className="text-muted-foreground flex items-center gap-2">
              <Target className="w-4 h-4" />
              {sprint.goal}
            </p>
          )}
          {sprint.startDate && sprint.endDate && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(new Date(sprint.startDate), 'dd/MM/yyyy', { locale: vi })}
              </span>
              <span>→</span>
              <span>{format(new Date(sprint.endDate), 'dd/MM/yyyy', { locale: vi })}</span>
              <Badge variant="outline" className="gap-1">
                <Clock className="w-3 h-3" />
                {daysRemaining} ngày còn lại
              </Badge>
            </div>
          )}
        </div>
        <Button 
          onClick={handleCloseSprint} 
          disabled={closing}
          variant="outline"
          className="gap-2"
        >
          {closing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <PauseCircle className="w-4 h-4" />
          )}
          Đóng Sprint
        </Button>
      </div>

      {/* Sprint Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Capacity</CardDescription>
            <CardTitle className="text-3xl">{sprint.capacity}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Story Points tổng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Committed</CardDescription>
            <CardTitle className="text-3xl">{sprint.committed}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Story Points cam kết</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl text-green-600">{sprint.completed}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Story Points hoàn thành</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Velocity</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              {sprint.velocity || sprint.completed}
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {progressPercent}% hoàn thành
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Tiến độ Sprint</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={progressPercent} className="h-3" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{sprint.completed} / {sprint.capacity} Story Points</span>
            <span>{progressPercent}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Sprint Board */}
      <Tabs defaultValue="board" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto">
          <TabsTrigger value="board">Sprint Board</TabsTrigger>
          <TabsTrigger value="burndown">Burndown Chart</TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="mt-6">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Pending Column */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Circle className="w-4 h-4 text-gray-400" />
                  Chưa bắt đầu
                  <Badge variant="secondary">{pendingTasks.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {pendingTasks.map((task: any) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </CardContent>
            </Card>

            {/* In Progress Column */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <PlayCircle className="w-4 h-4 text-blue-600" />
                  Đang làm
                  <Badge variant="secondary">{inProgressTasks.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {inProgressTasks.map((task: any) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </CardContent>
            </Card>

            {/* Completed Column */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Hoàn thành
                  <Badge variant="secondary">{completedTasks.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {completedTasks.map((task: any) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="burndown" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Burndown Chart</CardTitle>
              <CardDescription>
                Biểu đồ theo dõi tiến độ hoàn thành Story Points theo thời gian
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <p>Burndown chart sẽ được implement với Recharts</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sprint History */}
      {sprints.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Lịch sử Sprint</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sprints
                .filter((s: any) => s.id !== sprint.id)
                .slice(0, 3)
                .map((s: any) => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {s.startDate && format(new Date(s.startDate), 'dd/MM/yyyy', { locale: vi })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={s.status === 'COMPLETED' ? 'default' : 'secondary'}>
                        {s.status}
                      </Badge>
                      {s.velocity && (
                        <div className="text-right">
                          <p className="text-sm font-medium">{s.velocity} SP</p>
                          <p className="text-xs text-muted-foreground">Velocity</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Task Card Component
function TaskCard({ task }: { task: any }) {
  const priorityColors: Record<string, string> = {
    LOW: 'bg-gray-500',
    MEDIUM: 'bg-blue-500',
    HIGH: 'bg-orange-500',
    URGENT: 'bg-red-500',
  };

  return (
    <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-sm line-clamp-2">{task.title}</p>
          {task.storyPoints && (
            <Badge variant="outline" className="shrink-0">
              {task.storyPoints} SP
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", priorityColors[task.priority] || 'bg-gray-500')} />
          <span className="text-xs text-muted-foreground capitalize">
            {task.priority?.toLowerCase() || 'medium'}
          </span>
        </div>
      </div>
    </Card>
  );
}
