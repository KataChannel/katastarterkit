'use client';

import React, { useMemo } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LayoutDashboard, 
  Loader2, 
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Users,
  Target,
  CalendarDays,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, differenceInDays, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

// GraphQL Queries
const GET_DASHBOARD_DATA = gql`
  query GetDashboardData($projectId: ID!) {
    projectTasks(projectId: $projectId) {
      id
      title
      status
      priority
      dueDate
      createdAt
      completedAt
      storyPoints
      user {
        id
        firstName
        lastName
        avatar
      }
    }
    project(id: $projectId) {
      id
      name
      methodology
      createdAt
      updatedAt
    }
  }
`;

interface DashboardViewProps {
  projectId: string;
}

export function DashboardView({ projectId }: DashboardViewProps) {
  const { data, loading } = useQuery(GET_DASHBOARD_DATA, {
    variables: { projectId },
    fetchPolicy: 'network-only',
  });

  const tasks = data?.projectTasks || [];
  const project = data?.project;

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t: any) => t.status === 'COMPLETED').length;
    const inProgress = tasks.filter((t: any) => t.status === 'IN_PROGRESS').length;
    const pending = tasks.filter((t: any) => t.status === 'PENDING').length;
    const review = tasks.filter((t: any) => t.status === 'REVIEW').length;

    const totalPoints = tasks.reduce((sum: number, t: any) => sum + (t.storyPoints || 0), 0);
    const completedPoints = tasks
      .filter((t: any) => t.status === 'COMPLETED')
      .reduce((sum: number, t: any) => sum + (t.storyPoints || 0), 0);

    const overdue = tasks.filter((t: any) => 
      t.dueDate && 
      new Date(t.dueDate) < new Date() && 
      t.status !== 'COMPLETED'
    ).length;

    const urgent = tasks.filter((t: any) => 
      t.priority === 'URGENT' && t.status !== 'COMPLETED'
    ).length;

    // This week tasks
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    
    const completedThisWeek = tasks.filter((t: any) => 
      t.completedAt && isWithinInterval(new Date(t.completedAt), { start: weekStart, end: weekEnd })
    ).length;

    // Assignee stats
    const assigneeMap = new Map<string, { name: string; avatar?: string; count: number; completed: number }>();
    tasks.forEach((t: any) => {
      if (t.user) {
        const key = t.user.id;
        if (!assigneeMap.has(key)) {
          assigneeMap.set(key, {
            name: `${t.user.firstName} ${t.user.lastName || ''}`.trim(),
            avatar: t.user.avatar,
            count: 0,
            completed: 0,
          });
        }
        const stats = assigneeMap.get(key)!;
        stats.count++;
        if (t.status === 'COMPLETED') stats.completed++;
      }
    });

    // Priority breakdown
    const priorityStats = {
      urgent: tasks.filter((t: any) => t.priority === 'URGENT').length,
      high: tasks.filter((t: any) => t.priority === 'HIGH').length,
      medium: tasks.filter((t: any) => t.priority === 'MEDIUM').length,
      low: tasks.filter((t: any) => t.priority === 'LOW').length,
    };

    return {
      total,
      completed,
      inProgress,
      pending,
      review,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      totalPoints,
      completedPoints,
      pointsRate: totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0,
      overdue,
      urgent,
      completedThisWeek,
      assignees: Array.from(assigneeMap.values()).sort((a, b) => b.count - a.count),
      priorityStats,
    };
  }, [tasks]);

  // Project progress (based on task completion, not dates)
  const projectProgress = useMemo(() => {
    if (!project) return null;
    
    // Since Project doesn't have startDate/endDate, we calculate based on task completion
    const total = tasks.length;
    const completed = tasks.filter((t: any) => t.status === 'COMPLETED').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Calculate days since project created
    const createdAt = new Date(project.createdAt);
    const now = new Date();
    const daysSinceCreated = differenceInDays(now, createdAt);
    
    return {
      totalTasks: total,
      completedTasks: completed,
      completionRate,
      daysSinceCreated,
      startDate: createdAt,
    };
  }, [project, tasks]);

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
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6" />
          Dashboard
        </h2>
        <p className="text-muted-foreground">
          Tổng quan dự án {project?.name}
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng tasks</p>
                <p className="text-3xl font-bold">{metrics.total}</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hoàn thành</p>
                <p className="text-3xl font-bold text-green-500">{metrics.completed}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đang thực hiện</p>
                <p className="text-3xl font-bold text-orange-500">{metrics.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Quá hạn</p>
                <p className="text-3xl font-bold text-red-500">{metrics.overdue}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Task Completion */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Tiến độ công việc
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Task completion</span>
                <span className="font-medium">{metrics.completionRate}%</span>
              </div>
              <Progress value={metrics.completionRate} className="h-3" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Story Points</span>
                <span className="font-medium">{metrics.completedPoints}/{metrics.totalPoints} pts</span>
              </div>
              <Progress value={metrics.pointsRate} className="h-3" />
            </div>

            {projectProgress && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Tiến độ dự án</span>
                  <span className="font-medium">{projectProgress.daysSinceCreated} ngày từ khi tạo</span>
                </div>
                <Progress value={projectProgress.completionRate} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Bắt đầu: {format(projectProgress.startDate, 'dd/MM/yyyy')}</span>
                  <span>{projectProgress.completedTasks}/{projectProgress.totalTasks} tasks</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Task Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Phân bố trạng thái
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm">Chờ xử lý</span>
                </div>
                <Badge variant="outline">{metrics.pending}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-sm">Đang thực hiện</span>
                </div>
                <Badge variant="outline">{metrics.inProgress}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-sm">Đang review</span>
                </div>
                <Badge variant="outline">{metrics.review}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm">Hoàn thành</span>
                </div>
                <Badge variant="outline">{metrics.completed}</Badge>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Hoàn thành tuần này</span>
                <Badge variant="secondary" className="text-green-600">
                  +{metrics.completedThisWeek}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team & Priority */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Team Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-5 h-5" />
              Thành viên
            </CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.assignees.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Chưa có task được giao
              </p>
            ) : (
              <div className="space-y-3">
                {metrics.assignees.slice(0, 5).map((member, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {member.avatar ? (
                        <img 
                          src={member.avatar}
                          className="w-8 h-8 rounded-full"
                          alt=""
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">
                          {member.name[0]}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.completed}/{member.count} tasks
                        </p>
                      </div>
                    </div>
                    <div className="w-16">
                      <Progress 
                        value={member.count > 0 ? (member.completed / member.count) * 100 : 0} 
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Priority Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              Ưu tiên công việc
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-500">Khẩn cấp</Badge>
                </div>
                <span className="font-medium">{metrics.priorityStats.urgent}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-orange-500">Cao</Badge>
                </div>
                <span className="font-medium">{metrics.priorityStats.high}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-500">Trung bình</Badge>
                </div>
                <span className="font-medium">{metrics.priorityStats.medium}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-gray-400">Thấp</Badge>
                </div>
                <span className="font-medium">{metrics.priorityStats.low}</span>
              </div>
            </div>

            {metrics.urgent > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  <span>{metrics.urgent} tasks khẩn cấp chưa hoàn thành</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
