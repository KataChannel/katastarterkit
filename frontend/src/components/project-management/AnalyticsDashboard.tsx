'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, TrendingUp, Users, Target, Calendar, Zap } from 'lucide-react';

// GraphQL Queries
const PROJECT_ANALYTICS_QUERY = gql`
  query ProjectAnalytics($projectId: ID!) {
    projectAnalytics(projectId: $projectId)
    taskStatistics(projectId: $projectId)
    memberStatistics(projectId: $projectId)
    taskVelocity(projectId: $projectId, days: 30)
    projectHealthScore(projectId: $projectId)
    upcomingDeadlines(projectId: $projectId, days: 7)
    overdueTasks(projectId: $projectId)
    tagStatistics(projectId: $projectId)
  }
`;

// Color schemes
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const HEALTH_COLORS = {
  excellent: '#10b981',
  good: '#3b82f6',
  fair: '#f59e0b',
  poor: '#ef4444',
};

interface AnalyticsDashboardProps {
  projectId: string;
}

interface ProjectAnalytics {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  totalMembers: number;
  completionRate: number;
  averageCompletionTime: string;
}

interface TaskStatistics {
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  byCategory: Record<string, number>;
}

interface MemberStats {
  userId: string;
  userName: string;
  tasksAssigned: number;
  tasksCompleted: number;
  completionRate: number;
  averageCompletionTime: string;
}

interface VelocityData {
  date: string;
  tasksCompleted: number;
}

interface TagStat {
  tag: string;
  count: number;
}

export function AnalyticsDashboard({ projectId }: AnalyticsDashboardProps) {
  const { data, loading, error } = useQuery(PROJECT_ANALYTICS_QUERY, {
    variables: { projectId },
    skip: !projectId,
  });

  const [selectedTab, setSelectedTab] = useState('overview');

  // Parse JSON strings from GraphQL responses
  const parsedData = useMemo(() => {
    if (!data) return null;

    return {
      analytics: JSON.parse(data.projectAnalytics || '{}') as ProjectAnalytics,
      taskStats: JSON.parse(data.taskStatistics || '{}') as TaskStatistics,
      memberStats: JSON.parse(data.memberStatistics || '[]') as MemberStats[],
      velocity: JSON.parse(data.taskVelocity || '[]') as VelocityData[],
      healthScore: parseInt(data.projectHealthScore || '0'),
      upcomingDeadlines: JSON.parse(data.upcomingDeadlines || '[]'),
      overdueTasks: JSON.parse(data.overdueTasks || '[]'),
      tagStats: JSON.parse(data.tagStatistics || '[]') as TagStat[],
    };
  }, [data]);

  if (error) {
    return (
      <Alert className="border-destructive bg-destructive/10">
        <AlertCircle className="h-4 w-4 text-destructive" />
        <AlertDescription className="text-destructive">
          Failed to load analytics: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return <AnalyticsLoadingSkeleton />;
  }

  if (!parsedData) {
    return null;
  }

  const getHealthStatus = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: HEALTH_COLORS.excellent };
    if (score >= 60) return { label: 'Good', color: HEALTH_COLORS.good };
    if (score >= 40) return { label: 'Fair', color: HEALTH_COLORS.fair };
    return { label: 'Poor', color: HEALTH_COLORS.poor };
  };

  const healthStatus = getHealthStatus(parsedData.healthScore);
  const taskStatusData = Object.entries(parsedData.taskStats.byStatus || {}).map(([name, value]) => ({
    name,
    value,
  }));
  const priorityData = Object.entries(parsedData.taskStats.byPriority || {}).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Health Score */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Project Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{parsedData.healthScore}</div>
                <p className="text-sm text-gray-500">{healthStatus.label}</p>
              </div>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: healthStatus.color + '20' }}
              >
                <Zap className="h-6 w-6" style={{ color: healthStatus.color }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completion Rate */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{parsedData.analytics.completionRate.toFixed(1)}%</div>
                <p className="text-sm text-gray-500">
                  {parsedData.analytics.completedTasks}/{parsedData.analytics.totalTasks}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Team Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{parsedData.analytics.totalMembers}</div>
                <p className="text-sm text-gray-500">Active Members</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Tasks */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{parsedData.analytics.inProgressTasks}</div>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-100">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="velocity">Velocity</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Task Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Task Status Distribution</CardTitle>
                <CardDescription>Tasks by current status</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={taskStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {taskStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Task Priority Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Task Priority Distribution</CardTitle>
                <CardDescription>Tasks by priority level</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={priorityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {parsedData.overdueTasks.length > 0 && (
              <Alert className="border-destructive bg-destructive/10">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive">
                  {parsedData.overdueTasks.length} task(s) are overdue. Action required!
                </AlertDescription>
              </Alert>
            )}

            {parsedData.upcomingDeadlines.length > 0 && (
              <Alert className="border-blue-200 bg-blue-50">
                <Calendar className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  {parsedData.upcomingDeadlines.length} task(s) with upcoming deadline (7 days)
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>

        {/* Velocity Tab */}
        <TabsContent value="velocity">
          <Card>
            <CardHeader>
              <CardTitle>Task Velocity (Last 30 Days)</CardTitle>
              <CardDescription>Number of tasks completed per day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={parsedData.velocity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="tasksCompleted"
                    stroke="#10b981"
                    dot={{ fill: '#10b981' }}
                    name="Tasks Completed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Team Member Performance</CardTitle>
              <CardDescription>Individual task completion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parsedData.memberStats.map((member) => (
                  <div key={member.userId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{member.userName}</p>
                      <p className="text-sm text-gray-500">
                        {member.tasksCompleted}/{member.tasksAssigned} completed
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{member.completionRate.toFixed(0)}%</div>
                      <p className="text-sm text-gray-500">{member.averageCompletionTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
          {/* Top Tags */}
          {parsedData.tagStats.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Popular Tags</CardTitle>
                <CardDescription>Most used tags in tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {parsedData.tagStats.map((tag) => (
                    <Badge key={tag.tag} variant="secondary">
                      {tag.tag} ({tag.count})
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Statistics Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Tasks</p>
                  <p className="text-2xl font-bold">{parsedData.analytics.totalTasks}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{parsedData.analytics.completedTasks}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{parsedData.analytics.inProgressTasks}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{parsedData.analytics.pendingTasks}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Avg Completion Time</p>
                  <p className="text-2xl font-bold">{parsedData.analytics.averageCompletionTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AnalyticsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
