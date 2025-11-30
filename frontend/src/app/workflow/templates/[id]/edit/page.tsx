'use client';

import React, { use, useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_WORKFLOW_TEMPLATE, UPDATE_WORKFLOW_TEMPLATE } from '@/graphql/workflow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface WorkflowStep {
  id?: string;
  stepNumber: number;
  name: string;
  description: string;
  stepType: string;
  isRequired: boolean;
  config: Record<string, any>;
}

interface EditWorkflowTemplatePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditWorkflowTemplatePage({ params }: EditWorkflowTemplatePageProps) {
  const router = useRouter();
  const { id } = use(params);
  
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    category: 'Operations',
    icon: 'layout',
    color: '#3b82f6',
    isActive: true,
  });

  const [steps, setSteps] = useState<WorkflowStep[]>([]);

  const { data, loading: queryLoading, error: queryError } = useQuery(GET_WORKFLOW_TEMPLATE, {
    variables: { id },
    skip: !id,
  });

  const [updateWorkflowTemplate, { loading: updateLoading }] = useMutation(UPDATE_WORKFLOW_TEMPLATE, {
    onCompleted: () => {
      toast.success('Cập nhật workflow template thành công!');
      router.push(`/workflow/templates/${id}`);
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  // Load data into form when query completes
  useEffect(() => {
    if (data?.workflowTemplate) {
      const template = data.workflowTemplate;
      setFormData({
        code: template.code || '',
        name: template.name || '',
        description: template.description || '',
        category: template.category || 'Operations',
        icon: template.icon || 'layout',
        color: template.color || '#3b82f6',
        isActive: template.isActive ?? true,
      });

      if (template.steps && template.steps.length > 0) {
        setSteps(
          template.steps.map((step: any) => ({
            id: step.id,
            stepNumber: step.stepNumber,
            name: step.name || '',
            description: step.description || '',
            stepType: step.stepType || 'FORM',
            isRequired: step.isRequired ?? true,
            config: typeof step.config === 'string' ? JSON.parse(step.config || '{}') : step.config || {},
          }))
        );
      }
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!formData.code || !formData.name) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (steps.length === 0) {
      toast.error('Vui lòng thêm ít nhất 1 bước');
      return;
    }

    // Validate steps
    for (const step of steps) {
      if (!step.name || !step.stepType) {
        toast.error(`Bước ${step.stepNumber}: Vui lòng điền đầy đủ thông tin`);
        return;
      }
    }

    await updateWorkflowTemplate({
      variables: {
        id,
        input: {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          icon: formData.icon,
          color: formData.color,
          isActive: formData.isActive,
          steps: steps.map((step) => ({
            id: step.id,
            stepNumber: step.stepNumber,
            name: step.name,
            description: step.description || '',
            stepType: step.stepType,
            isRequired: step.isRequired,
            config: JSON.stringify(step.config),
          })),
        },
      },
    });
  };

  const addStep = () => {
    setSteps([
      ...steps,
      {
        stepNumber: steps.length + 1,
        name: '',
        description: '',
        stepType: 'FORM',
        isRequired: true,
        config: {},
      },
    ]);
  };

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    // Re-number steps
    setSteps(
      newSteps.map((step, i) => ({
        ...step,
        stepNumber: i + 1,
      }))
    );
  };

  const updateStep = (index: number, field: keyof WorkflowStep, value: any) => {
    const newSteps = [...steps];
    newSteps[index] = {
      ...newSteps[index],
      [field]: value,
    };
    setSteps(newSteps);
  };

  if (queryLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (queryError || !data?.workflowTemplate) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">
            {queryError?.message || 'Không tìm thấy workflow template'}
          </p>
          <Button onClick={() => router.back()}>Quay lại</Button>
        </div>
      </div>
    );
  }

  const loading = updateLoading;

  return (
    <div className="container mx-auto py-6 max-w-4xl">
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Chỉnh sửa Workflow Template
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Cập nhật mẫu quy trình: <span className="font-medium">{formData.name}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
            <CardDescription>
              Chỉnh sửa thông tin chung về workflow template
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">
                  Mã template <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  placeholder="VD: NGHI_PHEP"
                  value={formData.code}
                  disabled
                  className="bg-gray-100 dark:bg-gray-800"
                />
                <p className="text-xs text-gray-500">Mã template không thể thay đổi</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">
                  Tên template <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="VD: Yêu cầu nghỉ phép"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                placeholder="Mô tả về quy trình này..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Danh mục</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HR">Nhân sự (HR)</SelectItem>
                    <SelectItem value="Finance">Tài chính</SelectItem>
                    <SelectItem value="IT">Công nghệ (IT)</SelectItem>
                    <SelectItem value="Operations">Vận hành</SelectItem>
                    <SelectItem value="Sales">Bán hàng</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Màu sắc</Label>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="isActive">Trạng thái</Label>
                <Select
                  value={formData.isActive.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, isActive: value === 'true' })
                  }
                >
                  <SelectTrigger id="isActive">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Hoạt động</SelectItem>
                    <SelectItem value="false">Ngừng hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Steps */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Các bước workflow</CardTitle>
                <CardDescription>
                  Chỉnh sửa các bước trong quy trình ({steps.length} bước)
                </CardDescription>
              </div>
              <Button type="button" variant="outline" onClick={addStep}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm bước
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.map((step, index) => (
              <Card key={step.id || index} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Bước {step.stepNumber}
                    </CardTitle>
                    {steps.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStep(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>
                        Tên bước <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="VD: Nhập thông tin yêu cầu"
                        value={step.name}
                        onChange={(e) =>
                          updateStep(index, 'name', e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>
                        Loại bước <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={step.stepType}
                        onValueChange={(value) =>
                          updateStep(index, 'stepType', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FORM">Form nhập liệu</SelectItem>
                          <SelectItem value="APPROVAL">Phê duyệt</SelectItem>
                          <SelectItem value="NOTIFICATION">Thông báo</SelectItem>
                          <SelectItem value="AUTOMATION">Tự động</SelectItem>
                          <SelectItem value="CONDITION">Điều kiện</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Mô tả</Label>
                    <Textarea
                      placeholder="Mô tả chi tiết về bước này..."
                      value={step.description}
                      onChange={(e) =>
                        updateStep(index, 'description', e.target.value)
                      }
                      rows={2}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`required-${index}`}
                      checked={step.isRequired}
                      onChange={(e) =>
                        updateStep(index, 'isRequired', e.target.checked)
                      }
                      className="h-4 w-4"
                    />
                    <Label htmlFor={`required-${index}`} className="cursor-pointer">
                      Bắt buộc hoàn thành
                    </Label>
                  </div>
                </CardContent>
              </Card>
            ))}

            {steps.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Chưa có bước nào. Nhấn &quot;Thêm bước&quot; để bắt đầu.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
