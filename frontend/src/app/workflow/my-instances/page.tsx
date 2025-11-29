'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_MY_WORKFLOW_INSTANCES } from '@/graphql/workflow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Filter, Eye, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface WorkflowInstance {
  id: string;
  instanceCode: string;
  title: string;
  description: string;
  status: string;
  currentStepNumber: number;
  createdAt: string;
  workflowTemplate: {
    id: string;
    name: string;
    code: string;
    category: string;
    icon: string;
    color: string;
  };
}

const statusConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  PENDING: {
    label: 'Chờ xử lý',
    icon: <Clock className="h-4 w-4" />,
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  },
  IN_PROGRESS: {
    label: 'Đang xử lý',
    icon: <AlertCircle className="h-4 w-4" />,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  },
  COMPLETED: {
    label: 'Hoàn thành',
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  },
  CANCELLED: {
    label: 'Đã hủy',
    icon: <XCircle className="h-4 w-4" />,
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  },
  FAILED: {
    label: 'Thất bại',
    icon: <XCircle className="h-4 w-4" />,
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  },
};

export default function MyWorkflowInstancesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const { loading, error, data } = useQuery(GET_MY_WORKFLOW_INSTANCES, {
    fetchPolicy: 'network-only',
  });

  const instances: WorkflowInstance[] = data?.myWorkflowInstances || [];

  // Filter instances
  const filteredInstances = instances.filter((instance) => {
    const matchesSearch =
      searchQuery === '' ||
      instance.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instance.instanceCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || instance.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-300">
            Lỗi tải dữ liệu: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Workflows của tôi
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Danh sách các workflow bạn đã tạo hoặc được phân công
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên, mã..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
            <SelectItem value="PENDING">Chờ xử lý</SelectItem>
            <SelectItem value="IN_PROGRESS">Đang xử lý</SelectItem>
            <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
            <SelectItem value="CANCELLED">Đã hủy</SelectItem>
            <SelectItem value="FAILED">Thất bại</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Tìm thấy {filteredInstances.length} workflow
      </div>

      {/* Instances list */}
      {filteredInstances.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Không có workflow
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery || statusFilter !== 'ALL'
              ? 'Không tìm thấy workflow phù hợp với bộ lọc'
              : 'Bạn chưa có workflow nào'}
          </p>
          <Button onClick={() => router.push('/workflow')}>
            Xem tất cả workflows
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInstances.map((instance) => {
            const statusInfo = statusConfig[instance.status] || statusConfig.PENDING;
            
            return (
              <Card key={instance.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {instance.instanceCode}
                        </Badge>
                        <Badge className={statusInfo.color}>
                          <span className="mr-1">{statusInfo.icon}</span>
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-1">{instance.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {instance.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Template:</span>
                      <Badge variant="secondary" className="text-xs">
                        {instance.workflowTemplate.name}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Bước hiện tại:</span>
                      <span>{instance.currentStepNumber}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(new Date(instance.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => router.push(`/workflow/instances/${instance.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Xem chi tiết
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
