'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { START_EMPLOYEE_ONBOARDING } from '@/graphql/workflow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle2, UserPlus, Mail, Phone, Briefcase, Building2, Calendar, MapPin, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ThirdPartyAccount {
  accountType: string;
  username: string;
  email?: string;
  phone?: string;
  accountName?: string;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  startDate: string;
  address: string;
  thirdPartyAccounts: ThirdPartyAccount[];
}

const initialFormData: FormData = {
  fullName: '',
  email: '',
  phone: '',
  position: '',
  department: '',
  startDate: new Date().toISOString().split('T')[0],
  address: '',
  thirdPartyAccounts: [],
};

const accountTypes = [
  { value: 'GMAIL', label: 'Gmail' },
  { value: 'FACEBOOK', label: 'Facebook' },
  { value: 'ZALO', label: 'Zalo' },
  { value: 'CRM', label: 'CRM Công ty' },
  { value: 'SLACK', label: 'Slack' },
  { value: 'TEAMS', label: 'Microsoft Teams' },
  { value: 'ZOOM', label: 'Zoom' },
  { value: 'OTHER', label: 'Khác' },
];

const steps = [
  { number: 1, title: 'Thông tin cơ bản', description: 'Nhập thông tin nhân sự' },
  { number: 2, title: 'Tài khoản hệ thống', description: 'Tự động tạo từ email' },
  { number: 3, title: 'Tài khoản bên thứ 3', description: 'Gmail, Slack, CRM...' },
  { number: 4, title: 'Phê duyệt', description: 'Chờ quản lý phê duyệt' },
  { number: 5, title: 'Xác nhận', description: 'Nhân sự xác nhận' },
];

export default function EmployeeOnboardingForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [startOnboarding, { loading }] = useMutation(START_EMPLOYEE_ONBOARDING, {
    onCompleted: (data) => {
      toast.success('Đã khởi tạo quy trình checkin nhân sự thành công');
      router.push(`/workflow/instances/${data.startEmployeeOnboarding.id}`);
    },
    onError: (err) => {
      toast.error(`Lỗi: ${err.message}`);
    },
  });

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ (10-11 số)';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Vui lòng nhập vị trí';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Vui lòng nhập phòng ban';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) {
        toast.error('Vui lòng điền đầy đủ thông tin');
        return;
      }
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) {
      // Submit form
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    startOnboarding({
      variables: {
        input: {
          formData: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            position: formData.position,
            department: formData.department,
            startDate: formData.startDate,
            address: formData.address,
            thirdPartyAccounts: formData.thirdPartyAccounts,
          },
        },
      },
    });
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const addThirdPartyAccount = () => {
    setFormData({
      ...formData,
      thirdPartyAccounts: [
        ...formData.thirdPartyAccounts,
        { accountType: 'GMAIL', username: '', email: '', phone: '', accountName: '' },
      ],
    });
  };

  const removeThirdPartyAccount = (index: number) => {
    setFormData({
      ...formData,
      thirdPartyAccounts: formData.thirdPartyAccounts.filter((_, i) => i !== index),
    });
  };

  const updateThirdPartyAccount = (index: number, field: keyof ThirdPartyAccount, value: string) => {
    const updated = [...formData.thirdPartyAccounts];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, thirdPartyAccounts: updated });
  };

  const progress = (currentStep / 5) * 100;

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 mb-2">
          <UserPlus className="h-8 w-8" />
          Checkin Nhân Sự Mới
        </h1>
        <p className="text-muted-foreground">
          Quy trình nhập thông tin và tạo tài khoản cho nhân sự mới
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Bước {currentStep} / 5</span>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2 mb-4" />

        {/* Steps Indicator */}
        <div className="hidden md:flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                    currentStep > step.number
                      ? 'bg-green-500 text-white'
                      : currentStep === step.number
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step.number ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <p className="text-xs font-medium mt-2 text-center">{step.title}</p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 rounded transition-colors ${
                    currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="required">
                    Họ và tên <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={errors.fullName ? 'border-red-500' : ''}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500">{errors.fullName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nguyenvana@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Số điện thoại <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="0901234567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">
                    Vị trí <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="position"
                      placeholder="Nhân viên kinh doanh"
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      className={`pl-10 ${errors.position ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.position && (
                    <p className="text-sm text-red-500">{errors.position}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">
                    Phòng ban <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="department"
                      placeholder="Phòng kinh doanh"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className={`pl-10 ${errors.department ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.department && (
                    <p className="text-sm text-red-500">{errors.department}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">
                    Ngày bắt đầu <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className={`pl-10 ${errors.startDate ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.startDate && (
                    <p className="text-sm text-red-500">{errors.startDate}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    placeholder="123 Đường ABC, Quận 1, TP.HCM"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: User Account (Auto) */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <h3 className="font-medium text-green-900 dark:text-green-100">
                    Tài khoản sẽ được tạo tự động
                  </h3>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Hệ thống sẽ tự động tạo tài khoản user dựa trên email: <strong>{formData.email}</strong>
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Email đăng nhập</p>
                  <p className="font-medium">{formData.email}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Tên đăng nhập</p>
                  <p className="font-medium">{formData.email}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Mật khẩu mặc định sẽ được gửi qua email sau khi quy trình hoàn tất.
              </p>
            </div>
          )}

          {/* Step 3: Third-party Accounts */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Thêm các tài khoản bên thứ 3 (Gmail, Slack, CRM...)
                </p>
                <Button onClick={addThirdPartyAccount} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Thêm tài khoản
                </Button>
              </div>

              {formData.thirdPartyAccounts.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground mb-2">Chưa có tài khoản nào</p>
                  <Button onClick={addThirdPartyAccount} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm tài khoản đầu tiên
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.thirdPartyAccounts.map((account, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Tài khoản #{index + 1}</h4>
                        <Button
                          onClick={() => removeThirdPartyAccount(index)}
                          size="sm"
                          variant="ghost"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Loại tài khoản</Label>
                          <Select
                            value={account.accountType}
                            onValueChange={(value) =>
                              updateThirdPartyAccount(index, 'accountType', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {accountTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Tên đăng nhập</Label>
                          <Input
                            placeholder="username"
                            value={account.username}
                            onChange={(e) =>
                              updateThirdPartyAccount(index, 'username', e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            placeholder="email@example.com"
                            value={account.email || ''}
                            onChange={(e) =>
                              updateThirdPartyAccount(index, 'email', e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Tên hiển thị</Label>
                          <Input
                            placeholder="Tên hiển thị"
                            value={account.accountName || ''}
                            onChange={(e) =>
                              updateThirdPartyAccount(index, 'accountName', e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between mt-6">
        <Button
          onClick={handleBack}
          variant="outline"
          disabled={currentStep === 1 || loading}
          className="w-full md:w-auto"
        >
          Quay lại
        </Button>
        <Button
          onClick={handleNext}
          disabled={loading}
          className="w-full md:w-auto"
        >
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {currentStep < 3 ? 'Tiếp tục' : 'Gửi phê duyệt'}
        </Button>
      </div>
    </div>
  );
}
