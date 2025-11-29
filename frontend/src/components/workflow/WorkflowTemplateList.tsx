'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_WORKFLOW_TEMPLATES } from '@/graphql/workflow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Search, Filter, Layout, CheckCircle2, Clock, Archive } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';

interface WorkflowTemplate {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

const categoryColors: Record<string, string> = {
  HR: 'bg-blue-500',
  Finance: 'bg-green-500',
  IT: 'bg-purple-500',
  Operations: 'bg-orange-500',
  Sales: 'bg-pink-500',
  Marketing: 'bg-yellow-500',
};

const statusIcons: Record<string, React.ReactNode> = {
  active: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  inactive: <Clock className="h-4 w-4 text-gray-400" />,
  archived: <Archive className="h-4 w-4 text-gray-600" />,
};

export default function WorkflowTemplateList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined);

  const { data, loading, error, refetch } = useQuery(GET_WORKFLOW_TEMPLATES, {
    variables: {
      category: categoryFilter || undefined,
      isActive: statusFilter,
    },
  });

  const templates: WorkflowTemplate[] = data?.workflowTemplates || [];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleCreateNew = () => {
    router.push('/workflow/templates/new');
  };

  const handleViewTemplate = (id: string) => {
    router.push(`/workflow/templates/${id}`);
  };

  const handleStartWorkflow = (templateId: string, templateCode: string) => {
    if (templateCode === 'CHECKIN_NHANSU') {
      router.push('/workflow/employee-onboarding/new');
    } else {
      router.push(`/workflow/instances/new?templateId=${templateId}`);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-500 mb-4">Lỗi tải danh sách quy trình</p>
          <Button onClick={() => refetch()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Layout className="h-8 w-8" />
              Quy trình Workflow
            </h1>
            <p className="text-muted-foreground mt-1">
              Quản lý các mẫu quy trình và tạo quy trình mới
            </p>
          </div>
          <Button onClick={handleCreateNew} size="lg" className="w-full md:w-auto">
            <Plus className="h-5 w-5 mr-2" />
            Tạo quy trình mới
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm quy trình..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter || 'all'} onValueChange={(value) => setCategoryFilter(value === 'all' ? '' : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Tất cả danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                <SelectItem value="HR">Nhân sự (HR)</SelectItem>
                <SelectItem value="Finance">Tài chính</SelectItem>
                <SelectItem value="IT">Công nghệ (IT)</SelectItem>
                <SelectItem value="Operations">Vận hành</SelectItem>
                <SelectItem value="Sales">Bán hàng</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={statusFilter === undefined ? 'all' : statusFilter.toString()}
              onValueChange={(value) =>
                setStatusFilter(value === 'all' ? undefined : value === 'true')
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="true">Đang hoạt động</SelectItem>
                <SelectItem value="false">Ngừng hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Templates Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Layout className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery || categoryFilter
                  ? 'Không tìm thấy quy trình phù hợp'
                  : 'Chưa có quy trình nào'}
              </p>
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleViewTemplate(template.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className={`p-2 rounded-lg ${categoryColors[template.category] || 'bg-gray-500'}`}
                      style={{ backgroundColor: template.color || undefined }}
                    >
                      <Layout className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      {statusIcons[template.isActive ? 'active' : 'inactive']}
                      <Badge variant={template.isActive ? 'default' : 'secondary'}>
                        {template.isActive ? 'Hoạt động' : 'Ngừng'}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span className="font-mono text-xs">{template.code}</span>
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                  <Button
                    className="w-full"
                    variant={template.isActive ? 'default' : 'secondary'}
                    disabled={!template.isActive}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartWorkflow(template.id, template.code);
                    }}
                  >
                    Bắt đầu quy trình
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
