'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Loader2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  addMonths,
  subMonths,
  differenceInDays,
  isWithinInterval,
  isSameDay,
} from 'date-fns';
import { vi } from 'date-fns/locale';

// GraphQL Query
const GET_TIMELINE_TASKS = gql`
  query GetTimelineTasks($projectId: ID!) {
    projectTasks(projectId: $projectId) {
      id
      title
      status
      priority
      dueDate
      completedAt
      createdAt
      user {
        id
        firstName
        lastName
        avatar
      }
    }
  }
`;

interface TimelineViewProps {
  projectId: string;
}

type ViewMode = 'day' | 'week' | 'month';

export function TimelineView({ projectId }: TimelineViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  
  const { data, loading } = useQuery(GET_TIMELINE_TASKS, {
    variables: { projectId },
    fetchPolicy: 'network-only',
  });

  const tasks = data?.projectTasks || [];

  // Calculate date range based on view mode
  const dateRange = useMemo(() => {
    const start = startOfMonth(subMonths(currentDate, 1));
    const end = endOfMonth(addMonths(currentDate, 2));
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  // Group dates by week/month for headers
  const groupedDates = useMemo(() => {
    const groups: { label: string; days: Date[] }[] = [];
    let currentGroup: { label: string; days: Date[] } | null = null;

    dateRange.forEach((date) => {
      const monthLabel = format(date, 'MMMM yyyy', { locale: vi });
      
      if (!currentGroup || currentGroup.label !== monthLabel) {
        if (currentGroup) groups.push(currentGroup);
        currentGroup = { label: monthLabel, days: [date] };
      } else {
        currentGroup.days.push(date);
      }
    });

    if (currentGroup) groups.push(currentGroup);
    return groups;
  }, [dateRange]);

  // Navigate months
  const goToPrevious = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNext = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Calculate task position and width
  const getTaskStyle = (task: any) => {
    const taskStart = task.createdAt ? new Date(task.createdAt) : new Date();
    const taskEnd = task.dueDate ? new Date(task.dueDate) : addMonths(taskStart, 1);
    
    const rangeStart = dateRange[0];
    const rangeEnd = dateRange[dateRange.length - 1];

    // Check if task is within visible range
    if (taskEnd < rangeStart || taskStart > rangeEnd) {
      return null;
    }

    const visibleStart = taskStart < rangeStart ? rangeStart : taskStart;
    const visibleEnd = taskEnd > rangeEnd ? rangeEnd : taskEnd;

    const startOffset = differenceInDays(visibleStart, rangeStart);
    const duration = differenceInDays(visibleEnd, visibleStart) + 1;

    const dayWidth = viewMode === 'day' ? 40 : viewMode === 'week' ? 24 : 8;

    return {
      left: `${startOffset * dayWidth}px`,
      width: `${Math.max(duration * dayWidth - 4, dayWidth - 4)}px`,
    };
  };

  const statusColors: Record<string, string> = {
    PENDING: 'bg-blue-500',
    IN_PROGRESS: 'bg-orange-500',
    COMPLETED: 'bg-green-500',
    CANCELLED: 'bg-gray-400',
  };

  const priorityBorders: Record<string, string> = {
    URGENT: 'border-l-red-500',
    HIGH: 'border-l-orange-500',
    MEDIUM: 'border-l-blue-500',
    LOW: 'border-l-gray-400',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const dayWidth = viewMode === 'day' ? 40 : viewMode === 'week' ? 24 : 8;
  const totalWidth = dateRange.length * dayWidth;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Timeline / Gantt
          </h2>
          <p className="text-muted-foreground">
            Quản lý thời gian và tiến độ dự án
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode */}
          <Select value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Theo ngày</SelectItem>
              <SelectItem value="week">Theo tuần</SelectItem>
              <SelectItem value="month">Theo tháng</SelectItem>
            </SelectContent>
          </Select>

          {/* Navigation */}
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={goToPrevious}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={goToToday}>
              Hôm nay
            </Button>
            <Button variant="outline" size="icon" onClick={goToNext}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <div className="min-w-max">
              {/* Month Headers */}
              <div className="flex border-b bg-muted/30">
                <div className="w-[200px] shrink-0 p-2 font-medium border-r">
                  Tasks
                </div>
                <div className="flex">
                  {groupedDates.map((group, idx) => (
                    <div 
                      key={idx}
                      className="border-r text-center py-2 font-medium text-sm capitalize"
                      style={{ width: `${group.days.length * dayWidth}px` }}
                    >
                      {group.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Day Headers */}
              <div className="flex border-b">
                <div className="w-[200px] shrink-0 border-r" />
                <div className="flex">
                  {dateRange.map((date, idx) => {
                    const isToday = isSameDay(date, new Date());
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    
                    return (
                      <div 
                        key={idx}
                        className={cn(
                          "text-center py-1 text-xs border-r",
                          isToday && "bg-primary/10 font-bold",
                          isWeekend && "bg-muted/50"
                        )}
                        style={{ width: `${dayWidth}px` }}
                      >
                        {viewMode === 'day' && (
                          <>
                            <div>{format(date, 'EEE', { locale: vi })}</div>
                            <div className={cn(isToday && "text-primary")}>
                              {format(date, 'd')}
                            </div>
                          </>
                        )}
                        {viewMode === 'week' && format(date, 'd')}
                        {viewMode === 'month' && (date.getDate() === 1 ? format(date, 'd') : '')}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tasks */}
              {tasks.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-muted-foreground">
                  Không có tasks nào
                </div>
              ) : (
                tasks.map((task: any) => {
                  const style = getTaskStyle(task);
                  
                  return (
                    <div key={task.id} className="flex border-b hover:bg-muted/30">
                      {/* Task Name */}
                      <div className="w-[200px] shrink-0 p-2 border-r">
                        <div className="flex items-center gap-2">
                          {task.user?.avatar ? (
                            <img 
                              src={task.user.avatar} 
                              className="w-6 h-6 rounded-full"
                              alt=""
                            />
                          ) : task.user ? (
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                              {task.user.firstName?.[0]}
                            </div>
                          ) : null}
                          <span className="text-sm truncate" title={task.title}>
                            {task.title}
                          </span>
                        </div>
                      </div>

                      {/* Timeline Bar */}
                      <div 
                        className="relative h-10"
                        style={{ width: `${totalWidth}px` }}
                      >
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex">
                          {dateRange.map((date, idx) => {
                            const isToday = isSameDay(date, new Date());
                            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                            
                            return (
                              <div 
                                key={idx}
                                className={cn(
                                  "border-r h-full",
                                  isToday && "bg-primary/5",
                                  isWeekend && "bg-muted/30"
                                )}
                                style={{ width: `${dayWidth}px` }}
                              />
                            );
                          })}
                        </div>

                        {/* Task Bar */}
                        {style && (
                          <div
                            className={cn(
                              "absolute top-1 h-8 rounded cursor-pointer hover:opacity-80 transition-opacity border-l-4",
                              statusColors[task.status] || 'bg-gray-500',
                              priorityBorders[task.priority] || ''
                            )}
                            style={style}
                            title={`${task.title}\nStatus: ${task.status}\nPriority: ${task.priority}`}
                          >
                            <div className="px-2 py-1 text-xs text-white truncate">
                              {task.title}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-4">
          <span className="font-medium">Trạng thái:</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span>Chờ</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-orange-500" />
            <span>Đang làm</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span>Hoàn thành</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-medium">Ưu tiên:</span>
          <div className="flex items-center gap-1">
            <div className="w-1 h-3 bg-red-500" />
            <span>Khẩn cấp</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1 h-3 bg-orange-500" />
            <span>Cao</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1 h-3 bg-blue-500" />
            <span>TB</span>
          </div>
        </div>
      </div>
    </div>
  );
}
