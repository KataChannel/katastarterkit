'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  List, 
  Loader2, 
  Search,
  Filter,
  Download,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

// GraphQL Query
const GET_LIST_TASKS = gql`
  query GetListTasks($projectId: ID!) {
    projectTasks(projectId: $projectId) {
      id
      title
      description
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
  }
`;

interface ListViewProps {
  projectId: string;
}

type SortField = 'title' | 'status' | 'priority' | 'dueDate' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export function ListView({ projectId }: ListViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  const { data, loading } = useQuery(GET_LIST_TASKS, {
    variables: { projectId },
    fetchPolicy: 'network-only',
  });

  const tasks = data?.projectTasks || [];

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((task: any) => 
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter) {
      result = result.filter((task: any) => task.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter) {
      result = result.filter((task: any) => task.priority === priorityFilter);
    }

    // Sort
    result.sort((a: any, b: any) => {
      let valueA = a[sortField];
      let valueB = b[sortField];

      // Handle null values
      if (valueA === null) return 1;
      if (valueB === null) return -1;

      // Handle dates
      if (sortField === 'dueDate' || sortField === 'createdAt') {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }

      // Handle priority ordering
      if (sortField === 'priority') {
        const priorityOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        valueA = priorityOrder[valueA as keyof typeof priorityOrder] || 0;
        valueB = priorityOrder[valueB as keyof typeof priorityOrder] || 0;
      }

      // Handle status ordering
      if (sortField === 'status') {
        const statusOrder = { PENDING: 1, IN_PROGRESS: 2, REVIEW: 3, COMPLETED: 4 };
        valueA = statusOrder[valueA as keyof typeof statusOrder] || 0;
        valueB = statusOrder[valueB as keyof typeof statusOrder] || 0;
      }

      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      }
      return valueA < valueB ? 1 : -1;
    });

    return result;
  }, [tasks, searchQuery, statusFilter, priorityFilter, sortField, sortOrder]);

  // Toggle sort
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 ml-1" />;
    }
    return sortOrder === 'asc' 
      ? <ArrowUp className="w-4 h-4 ml-1" /> 
      : <ArrowDown className="w-4 h-4 ml-1" />;
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Tiêu đề', 'Trạng thái', 'Ưu tiên', 'Deadline', 'Người thực hiện', 'Story Points'];
    const rows = filteredTasks.map((task: any) => [
      task.title,
      task.status,
      task.priority,
      task.dueDate ? format(new Date(task.dueDate), 'dd/MM/yyyy') : '',
      task.user ? `${task.user.firstName} ${task.user.lastName}` : '',
      task.storyPoints || '',
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tasks-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const statusLabels: Record<string, string> = {
    PENDING: 'Chờ xử lý',
    IN_PROGRESS: 'Đang thực hiện',
    REVIEW: 'Đang review',
    COMPLETED: 'Hoàn thành',
  };

  const priorityLabels: Record<string, string> = {
    URGENT: 'Khẩn cấp',
    HIGH: 'Cao',
    MEDIUM: 'Trung bình',
    LOW: 'Thấp',
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
            <List className="w-6 h-6" />
            Danh sách Tasks
          </h2>
          <p className="text-muted-foreground">
            {filteredTasks.length} / {tasks.length} tasks
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 lg:flex-none lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Trạng thái
                {statusFilter && <Badge variant="secondary" className="ml-2">{statusLabels[statusFilter]}</Badge>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Lọc theo trạng thái</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                Tất cả
              </DropdownMenuItem>
              {Object.entries(statusLabels).map(([value, label]) => (
                <DropdownMenuItem key={value} onClick={() => setStatusFilter(value)}>
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Priority Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Ưu tiên
                {priorityFilter && <Badge variant="secondary" className="ml-2">{priorityLabels[priorityFilter]}</Badge>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Lọc theo ưu tiên</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setPriorityFilter(null)}>
                Tất cả
              </DropdownMenuItem>
              {Object.entries(priorityLabels).map(([value, label]) => (
                <DropdownMenuItem key={value} onClick={() => setPriorityFilter(value)}>
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export */}
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleSort('title')}
                  >
                    <div className="flex items-center">
                      Tiêu đề
                      {getSortIcon('title')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleSort('status')}
                  >
                    <div className="flex items-center">
                      Trạng thái
                      {getSortIcon('status')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleSort('priority')}
                  >
                    <div className="flex items-center">
                      Ưu tiên
                      {getSortIcon('priority')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleSort('dueDate')}
                  >
                    <div className="flex items-center">
                      Deadline
                      {getSortIcon('dueDate')}
                    </div>
                  </TableHead>
                  <TableHead>Người thực hiện</TableHead>
                  <TableHead className="text-center">Points</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Không có task nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTasks.map((task: any) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div className="max-w-[300px]">
                          <p className="font-medium truncate">{task.title}</p>
                          {task.description && (
                            <p className="text-xs text-muted-foreground truncate">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          task.status === 'COMPLETED' && "border-green-500 text-green-500",
                          task.status === 'IN_PROGRESS' && "border-orange-500 text-orange-500",
                          task.status === 'REVIEW' && "border-purple-500 text-purple-500",
                          task.status === 'PENDING' && "border-blue-500 text-blue-500",
                        )}>
                          {statusLabels[task.status] || task.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          task.priority === 'URGENT' && "border-red-500 text-red-500",
                          task.priority === 'HIGH' && "border-orange-500 text-orange-500",
                          task.priority === 'MEDIUM' && "border-blue-500 text-blue-500",
                          task.priority === 'LOW' && "border-gray-500 text-gray-500",
                        )}>
                          {priorityLabels[task.priority] || task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {task.dueDate ? (
                          <span className={cn(
                            new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED' && "text-red-500"
                          )}>
                            {format(new Date(task.dueDate), 'dd/MM/yyyy')}
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {task.user ? (
                          <div className="flex items-center gap-2">
                            {task.user.avatar ? (
                              <img 
                                src={task.user.avatar}
                                className="w-6 h-6 rounded-full"
                                alt=""
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                                {task.user.firstName?.[0]}
                              </div>
                            )}
                            <span className="text-sm">
                              {task.user.firstName} {task.user.lastName?.[0]}.
                            </span>
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        {task.storyPoints || '-'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Footer */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>Chờ xử lý: {tasks.filter((t: any) => t.status === 'PENDING').length}</span>
        </div>
        <div className="flex items-center gap-1">
          <AlertCircle className="w-4 h-4 text-orange-500" />
          <span>Đang thực hiện: {tasks.filter((t: any) => t.status === 'IN_PROGRESS').length}</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span>Hoàn thành: {tasks.filter((t: any) => t.status === 'COMPLETED').length}</span>
        </div>
      </div>
    </div>
  );
}
