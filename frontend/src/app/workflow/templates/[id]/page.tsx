'use client';

import React, { use } from 'react';
import { useQuery } from '@apollo/client';
import { GET_WORKFLOW_TEMPLATE } from '@/graphql/workflow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Edit, Play, CheckCircle2, Clock, Users, FileText, Bell, Settings, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface WorkflowTemplateDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const stepTypeLabels: Record<string, string> = {
  FORM: 'Form nhập liệu',
  APPROVAL: 'Phê duyệt',
  NOTIFICATION: 'Thông báo',
  AUTOMATION: 'Tự động',
  CONDITION: 'Điều kiện',
};

const stepTypeColors: Record<string, string> = {
  FORM: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  APPROVAL: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  NOTIFICATION: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  AUTOMATION: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  CONDITION: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
};

// Component hiển thị config theo từng loại step
function StepConfigDisplay({ config, stepType }: { config: any; stepType: string }) {
  // Parse config nếu là string
  const parsedConfig = typeof config === 'string' ? JSON.parse(config || '{}') : config;
  
  if (!parsedConfig || Object.keys(parsedConfig).length === 0) {
    return null;
  }

  // Hiển thị theo từng loại step
  switch (stepType) {
    case 'FORM':
      return (
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
            <FileText className="h-4 w-4" />
            Cấu hình Form
          </div>
          <div className="space-y-1 text-sm">
            {parsedConfig.formType && (
              <p><span className="text-gray-500">Loại form:</span> {parsedConfig.formType}</p>
            )}
            {parsedConfig.fields && (
              <p><span className="text-gray-500">Số trường:</span> {Array.isArray(parsedConfig.fields) ? parsedConfig.fields.length : 'N/A'}</p>
            )}
            {parsedConfig.requiredFields && (
              <p><span className="text-gray-500">Trường bắt buộc:</span> {parsedConfig.requiredFields.join(', ')}</p>
            )}
          </div>
        </div>
      );

    case 'APPROVAL':
      return (
        <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2 text-sm font-medium text-yellow-700 dark:text-yellow-300 mb-2">
            <Users className="h-4 w-4" />
            Cấu hình Phê duyệt
          </div>
          <div className="space-y-1 text-sm">
            {parsedConfig.approverRole && (
              <p><span className="text-gray-500">Vai trò phê duyệt:</span> {parsedConfig.approverRole}</p>
            )}
            {parsedConfig.approverRoles && (
              <p><span className="text-gray-500">Vai trò phê duyệt:</span> {parsedConfig.approverRoles.join(', ')}</p>
            )}
            {parsedConfig.minApprovers && (
              <p><span className="text-gray-500">Số người phê duyệt tối thiểu:</span> {parsedConfig.minApprovers}</p>
            )}
            {parsedConfig.autoApprove !== undefined && (
              <p><span className="text-gray-500">Tự động phê duyệt:</span> {parsedConfig.autoApprove ? 'Có' : 'Không'}</p>
            )}
          </div>
        </div>
      );

    case 'NOTIFICATION':
      return (
        <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
            <Bell className="h-4 w-4" />
            Cấu hình Thông báo
          </div>
          <div className="space-y-1 text-sm">
            {parsedConfig.channels && (
              <p><span className="text-gray-500">Kênh thông báo:</span> {parsedConfig.channels.join(', ')}</p>
            )}
            {parsedConfig.template && (
              <p><span className="text-gray-500">Template:</span> {parsedConfig.template}</p>
            )}
            {parsedConfig.recipients && (
              <p><span className="text-gray-500">Người nhận:</span> {Array.isArray(parsedConfig.recipients) ? parsedConfig.recipients.join(', ') : parsedConfig.recipients}</p>
            )}
            {parsedConfig.emailTemplate && (
              <p><span className="text-gray-500">Email template:</span> {parsedConfig.emailTemplate}</p>
            )}
          </div>
        </div>
      );

    case 'AUTOMATION':
      return (
        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-300 mb-2">
            <Settings className="h-4 w-4" />
            Cấu hình Tự động
          </div>
          <div className="space-y-1 text-sm">
            {parsedConfig.action && (
              <p><span className="text-gray-500">Hành động:</span> {parsedConfig.action}</p>
            )}
            {parsedConfig.actions && (
              <p><span className="text-gray-500">Các hành động:</span> {parsedConfig.actions.join(', ')}</p>
            )}
            {parsedConfig.trigger && (
              <p><span className="text-gray-500">Trigger:</span> {parsedConfig.trigger}</p>
            )}
            {parsedConfig.autoComplete !== undefined && (
              <p><span className="text-gray-500">Tự động hoàn thành:</span> {parsedConfig.autoComplete ? 'Có' : 'Không'}</p>
            )}
          </div>
        </div>
      );

    default:
      // Fallback: hiển thị các key-value một cách đẹp hơn
      return (
        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Settings className="h-4 w-4" />
            Cấu hình
          </div>
          <div className="space-y-1 text-sm">
            {Object.entries(parsedConfig).map(([key, value]) => (
              <p key={key}>
                <span className="text-gray-500">{key}:</span>{' '}
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </p>
            ))}
          </div>
        </div>
      );
  }
}

export default function WorkflowTemplateDetailPage({ params }: WorkflowTemplateDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { data, loading, error } = useQuery(GET_WORKFLOW_TEMPLATE, {
    variables: { id },
    skip: !id,
  });

  const template = data?.workflowTemplate;

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">
            {error?.message || 'Không tìm thấy workflow template'}
          </p>
          <Button onClick={() => router.back()}>Quay lại</Button>
        </div>
      </div>
    );
  }

  const handleStartWorkflow = () => {
    if (template.code === 'CHECKIN_NHANSU') {
      router.push('/workflow/employee-onboarding/new');
    } else {
      router.push(`/workflow/instances/new?templateId=${template.id}`);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {template.name}
              </h1>
              {template.isActive ? (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Hoạt động
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <Clock className="h-3 w-3 mr-1" />
                  Ngừng
                </Badge>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {template.description || 'Không có mô tả'}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/workflow/templates/${template.id}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
            <Button
              onClick={handleStartWorkflow}
              disabled={!template.isActive}
            >
              <Play className="h-4 w-4 mr-2" />
              Bắt đầu quy trình
            </Button>
          </div>
        </div>
      </div>

      {/* Template Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Thông tin template</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Mã template</p>
              <p className="font-mono font-medium">{template.code}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Danh mục</p>
              <Badge variant="outline">{template.category}</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Phiên bản</p>
              <p className="font-medium">v{template.version}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Các bước trong quy trình</CardTitle>
          <CardDescription>
            {template.steps?.length || 0} bước
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {template.steps && template.steps.length > 0 ? (
              template.steps.map((step: any, index: number) => (
                <div
                  key={step.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {step.stepNumber}
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {step.name}
                          {step.isRequired && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {step.description || 'Không có mô tả'}
                        </p>
                      </div>
                      <Badge className={stepTypeColors[step.stepType] || ''}>
                        {stepTypeLabels[step.stepType] || step.stepType}
                      </Badge>
                    </div>

                    {/* Step Config - Hiển thị thông tin cấu hình nếu có */}
                    {step.config && Object.keys(step.config).length > 0 && (
                      <StepConfigDisplay config={step.config} stepType={step.stepType} />
                    )}
                  </div>

                  {/* Connector line (except last item) */}
                  {index < template.steps.length - 1 && (
                    <div className="absolute left-[2.2rem] top-14 w-0.5 h-full bg-gray-300 dark:bg-gray-600 -z-10" />
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Chưa có bước nào trong quy trình
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
