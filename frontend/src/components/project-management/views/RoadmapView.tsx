'use client';

import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Lightbulb, 
  Calendar, 
  Target, 
  TrendingUp,
  CheckCircle2,
  Circle,
  Loader2,
  Flag,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

// GraphQL Queries
const GET_ROADMAP_ITEMS = gql`
  query GetRoadmapItems($projectId: ID!) {
    roadmapItems(projectId: $projectId) {
      id
      title
      description
      status
      priority
      startDate
      endDate
      quarter
      progress
      estimatedValue
      owner {
        id
        firstName
        lastName
        avatar
      }
    }
  }
`;

interface RoadmapViewProps {
  projectId: string;
}

export function RoadmapView({ projectId }: RoadmapViewProps) {
  const { data, loading } = useQuery(GET_ROADMAP_ITEMS, {
    variables: { projectId },
    fetchPolicy: 'network-only',
  });

  const items = data?.roadmapItems || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Roadmap trống</CardTitle>
          <CardDescription>
            Thêm roadmap items để lập kế hoạch phát triển sản phẩm
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Group by status
  const ideaItems = items.filter((item: any) => item.status === 'IDEA');
  const plannedItems = items.filter((item: any) => item.status === 'PLANNED');
  const inProgressItems = items.filter((item: any) => item.status === 'IN_PROGRESS');
  const completedItems = items.filter((item: any) => item.status === 'COMPLETED');

  // Group by quarter
  const quarters = Array.from(new Set(items.map((item: any) => item.quarter).filter(Boolean))).sort();

  return (
    <div className="space-y-6">
      {/* Roadmap Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Product Roadmap</h2>
          <p className="text-muted-foreground">
            Lộ trình phát triển sản phẩm và kế hoạch tính năng
          </p>
        </div>
        <Button>
          <Target className="w-4 h-4 mr-2" />
          Thêm Roadmap Item
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Ý tưởng
            </CardDescription>
            <CardTitle className="text-3xl">{ideaItems.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Đã lên kế hoạch
            </CardDescription>
            <CardTitle className="text-3xl">{plannedItems.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Đang thực hiện
            </CardDescription>
            <CardTitle className="text-3xl text-blue-600">{inProgressItems.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Hoàn thành
            </CardDescription>
            <CardTitle className="text-3xl text-green-600">{completedItems.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Roadmap Timeline by Quarter */}
      <div className="space-y-8">
        {quarters.map((quarter: any) => {
          const quarterItems = items.filter((item: any) => item.quarter === quarter);
          
          return (
            <div key={quarter} className="space-y-4">
              <div className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold">{quarter}</h3>
                <Badge variant="outline">{quarterItems.length} items</Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {quarterItems.map((item: any) => (
                  <RoadmapItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          );
        })}

        {/* Items without quarter */}
        {items.filter((item: any) => !item.quarter).length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Circle className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-xl font-semibold">Chưa xác định</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {items
                .filter((item: any) => !item.quarter)
                .map((item: any) => (
                  <RoadmapItemCard key={item.id} item={item} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Roadmap Item Card Component
function RoadmapItemCard({ item }: { item: any }) {
  const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
    IDEA: { color: 'bg-purple-500', icon: Lightbulb, label: 'Ý tưởng' },
    PLANNED: { color: 'bg-blue-500', icon: Calendar, label: 'Kế hoạch' },
    IN_PROGRESS: { color: 'bg-orange-500', icon: TrendingUp, label: 'Đang làm' },
    COMPLETED: { color: 'bg-green-500', icon: CheckCircle2, label: 'Hoàn thành' },
    CANCELLED: { color: 'bg-gray-500', icon: Circle, label: 'Hủy bỏ' },
  };

  const priorityConfig: Record<string, string> = {
    LOW: 'border-l-gray-400',
    MEDIUM: 'border-l-blue-500',
    HIGH: 'border-l-orange-500',
    CRITICAL: 'border-l-red-500',
  };

  const status = statusConfig[item.status] || statusConfig.IDEA;
  const StatusIcon = status.icon;

  return (
    <Card className={cn("border-l-4 hover:shadow-md transition-shadow", priorityConfig[item.priority])}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <CardTitle className="text-base">{item.title}</CardTitle>
            {item.description && (
              <CardDescription className="line-clamp-2">
                {item.description}
              </CardDescription>
            )}
          </div>
          <Badge variant="outline" className="gap-1 shrink-0">
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Progress */}
        {item.progress > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Tiến độ</span>
              <span>{item.progress}%</span>
            </div>
            <Progress value={item.progress} className="h-2" />
          </div>
        )}

        {/* Timeline */}
        {item.startDate && item.endDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              {format(new Date(item.startDate), 'dd/MM/yyyy', { locale: vi })}
            </span>
            <span>→</span>
            <span>
              {format(new Date(item.endDate), 'dd/MM/yyyy', { locale: vi })}
            </span>
          </div>
        )}

        {/* Estimated Value */}
        {item.estimatedValue && (
          <div className="flex items-start gap-2 text-sm">
            <Target className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span className="text-muted-foreground">{item.estimatedValue}</span>
          </div>
        )}

        {/* Owner */}
        {item.owner && (
          <div className="flex items-center gap-2 pt-2 border-t">
            {item.owner.avatar ? (
              <img 
                src={item.owner.avatar} 
                alt={item.owner.firstName}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                {item.owner.firstName?.[0]}{item.owner.lastName?.[0]}
              </div>
            )}
            <span className="text-sm text-muted-foreground">
              {item.owner.firstName} {item.owner.lastName}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
