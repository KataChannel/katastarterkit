'use client';

import React, { useState } from 'react';
import { AnalyticsDashboard } from '@/components/project-management/AnalyticsDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { InviteMemberDialog } from '@/components/team/InviteMemberDialog';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Activity,
  UserPlus
} from 'lucide-react';

export default function DashboardPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const handleInviteMember = async (email: string, role: string) => {
    // This will be handled by the InviteMemberDialog's internal logic
    // which uses useTeamData hook
    console.log('Inviting member:', email, role);
  };

  // Mock stats data
  const stats = [
    {
      title: 'Total Projects',
      value: '12',
      change: '+2 this month',
      trend: 'up',
      icon: BarChart3,
      color: 'text-blue-600'
    },
    {
      title: 'Active Tasks',
      value: '48',
      change: '+12 this week',
      trend: 'up',
      icon: Activity,
      color: 'text-green-600'
    },
    {
      title: 'Team Members',
      value: '24',
      change: '+3 this month',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Completion Rate',
      value: '87%',
      change: '+5% this week',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-orange-600'
    },
  ];

  const recentActivity = [
    {
      user: 'John Doe',
      action: 'completed task',
      task: 'Design Homepage',
      time: '2 hours ago',
      type: 'complete'
    },
    {
      user: 'Jane Smith',
      action: 'commented on',
      task: 'API Integration',
      time: '4 hours ago',
      type: 'comment'
    },
    {
      user: 'Mike Johnson',
      action: 'created',
      task: 'Bug Fix - Login',
      time: '5 hours ago',
      type: 'create'
    },
  ];

  return (
    <div className="h-full overflow-auto">
      <div className="container max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Overview of your projects and team performance
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              className="flex-1 sm:flex-initial"
              onClick={() => setIsInviteDialogOpen(true)}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-initial">
              <Calendar className="mr-2 h-4 w-4" />
              Date Range
            </Button>
          </div>
        </div>

        {/* Stats Grid - Mobile First */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="analytics" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <AnalyticsDashboard projectId={selectedProjectId || ''} />
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest updates from your team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 pb-4 last:pb-0 border-b last:border-0"
                    >
                      <div className={`
                        mt-1 h-8 w-8 rounded-full flex items-center justify-center
                        ${activity.type === 'complete' ? 'bg-green-100' : 
                          activity.type === 'comment' ? 'bg-blue-100' : 'bg-purple-100'}
                      `}>
                        {activity.type === 'complete' && (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                        {activity.type === 'comment' && (
                          <AlertCircle className="h-4 w-4 text-blue-600" />
                        )}
                        {activity.type === 'create' && (
                          <Activity className="h-4 w-4 text-purple-600" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span>
                          {' '}{activity.action}{' '}
                          <span className="font-medium">{activity.task}</span>
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Task Overview</CardTitle>
                <CardDescription>
                  Summary of tasks across all projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm text-muted-foreground">Pending</div>
                      <div className="text-2xl font-bold mt-1">24</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm text-muted-foreground">In Progress</div>
                      <div className="text-2xl font-bold mt-1">18</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm text-muted-foreground">Completed</div>
                      <div className="text-2xl font-bold mt-1">156</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Invite Member Dialog */}
        <InviteMemberDialog 
          open={isInviteDialogOpen}
          onOpenChange={setIsInviteDialogOpen}
          onInvite={handleInviteMember}
        />
      </div>
    </div>
  );
}
