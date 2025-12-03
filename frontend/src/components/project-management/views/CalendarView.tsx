'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Loader2,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { vi } from 'date-fns/locale';

// GraphQL Query
const GET_CALENDAR_TASKS = gql`
  query GetCalendarTasks($projectId: ID!) {
    projectTasks(projectId: $projectId) {
      id
      title
      status
      priority
      dueDate
      completedAt
      user {
        id
        firstName
        lastName
        avatar
      }
    }
  }
`;

interface CalendarViewProps {
  projectId: string;
}

export function CalendarView({ projectId }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const { data, loading } = useQuery(GET_CALENDAR_TASKS, {
    variables: { projectId },
    fetchPolicy: 'network-only',
  });

  const tasks = data?.projectTasks || [];

  // Calculate calendar grid
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  // Group tasks by date
  const tasksByDate = useMemo(() => {
    const map = new Map<string, any[]>();
    
    tasks.forEach((task: any) => {
      if (task.dueDate) {
        const dateKey = format(new Date(task.dueDate), 'yyyy-MM-dd');
        if (!map.has(dateKey)) {
          map.set(dateKey, []);
        }
        map.get(dateKey)!.push(task);
      }
    });
    
    return map;
  }, [tasks]);

  // Get tasks for selected date
  const selectedDateTasks = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return tasksByDate.get(dateKey) || [];
  }, [selectedDate, tasksByDate]);

  // Navigate months
  const goToPrevious = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNext = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  const priorityColors: Record<string, string> = {
    URGENT: 'bg-red-500',
    HIGH: 'bg-orange-500',
    MEDIUM: 'bg-blue-500',
    LOW: 'bg-gray-400',
  };

  const statusIcons: Record<string, any> = {
    PENDING: Clock,
    IN_PROGRESS: AlertCircle,
    COMPLETED: CheckCircle2,
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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Lịch
          </h2>
          <p className="text-muted-foreground">
            Theo dõi deadline và sự kiện
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPrevious}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={goToToday}>
            Hôm nay
          </Button>
          <Button variant="outline" size="icon" onClick={goToNext}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <div className="font-semibold ml-2 capitalize min-w-[150px] text-center">
            {format(currentDate, 'MMMM yyyy', { locale: vi })}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        {/* Calendar Grid */}
        <Card>
          <CardContent className="p-4">
            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div 
                  key={day} 
                  className="text-center text-sm font-medium text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date) => {
                const dateKey = format(date, 'yyyy-MM-dd');
                const dayTasks = tasksByDate.get(dateKey) || [];
                const isCurrentMonth = isSameMonth(date, currentDate);
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                const today = isToday(date);

                return (
                  <div
                    key={dateKey}
                    onClick={() => setSelectedDate(date)}
                    className={cn(
                      "min-h-[80px] lg:min-h-[100px] p-1 border rounded-lg cursor-pointer transition-colors",
                      !isCurrentMonth && "bg-muted/30 text-muted-foreground",
                      isSelected && "border-primary bg-primary/5",
                      today && !isSelected && "border-primary/50",
                      "hover:bg-muted/50"
                    )}
                  >
                    {/* Date Number */}
                    <div className={cn(
                      "text-sm font-medium mb-1",
                      today && "text-primary"
                    )}>
                      {format(date, 'd')}
                    </div>

                    {/* Task Indicators */}
                    <div className="space-y-0.5">
                      {dayTasks.slice(0, 3).map((task: any) => (
                        <div
                          key={task.id}
                          className={cn(
                            "text-xs px-1 py-0.5 rounded truncate text-white",
                            priorityColors[task.priority] || 'bg-gray-500'
                          )}
                          title={task.title}
                        >
                          {task.title}
                        </div>
                      ))}
                      {dayTasks.length > 3 && (
                        <div className="text-xs text-muted-foreground px-1">
                          +{dayTasks.length - 3} khác
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {selectedDate 
                ? format(selectedDate, 'EEEE, d MMMM yyyy', { locale: vi })
                : 'Chọn ngày để xem chi tiết'
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              selectedDateTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Không có task nào</p>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {selectedDateTasks.map((task: any) => {
                      const StatusIcon = statusIcons[task.status] || Clock;
                      
                      return (
                        <Card key={task.id} className="p-3">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium text-sm line-clamp-2">
                                {task.title}
                              </p>
                              <StatusIcon className={cn(
                                "w-4 h-4 shrink-0",
                                task.status === 'COMPLETED' && "text-green-500",
                                task.status === 'IN_PROGRESS' && "text-orange-500",
                                task.status === 'PENDING' && "text-blue-500"
                              )} />
                            </div>

                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "text-xs",
                                  task.priority === 'URGENT' && "border-red-500 text-red-500",
                                  task.priority === 'HIGH' && "border-orange-500 text-orange-500",
                                  task.priority === 'MEDIUM' && "border-blue-500 text-blue-500",
                                  task.priority === 'LOW' && "border-gray-500 text-gray-500"
                                )}
                              >
                                {task.priority === 'URGENT' && 'Khẩn cấp'}
                                {task.priority === 'HIGH' && 'Cao'}
                                {task.priority === 'MEDIUM' && 'Trung bình'}
                                {task.priority === 'LOW' && 'Thấp'}
                              </Badge>

                              {task.user && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  {task.user.avatar ? (
                                    <img 
                                      src={task.user.avatar}
                                      className="w-4 h-4 rounded-full"
                                      alt=""
                                    />
                                  ) : (
                                    <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-[10px]">
                                      {task.user.firstName?.[0]}
                                    </div>
                                  )}
                                  {task.user.firstName}
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              )
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Click vào ngày để xem tasks</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="font-medium">Ưu tiên:</span>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-500" />
          <span>Khẩn cấp</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-orange-500" />
          <span>Cao</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-blue-500" />
          <span>Trung bình</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-gray-400" />
          <span>Thấp</span>
        </div>
      </div>
    </div>
  );
}
