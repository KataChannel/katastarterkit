'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings,
  Bell,
  Mail,
  Lock,
  Globe,
  Palette,
  Database,
  Shield,
  Save,
  CheckCircle,
  AlertCircle,
  Upload,
  FileText,
  DollarSign,
  Award
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  
  // General Settings
  const [siteName, setSiteName] = useState('RauSachCore LMS');
  const [siteDescription, setSiteDescription] = useState('Nền tảng học trực tuyến hàng đầu');
  const [adminEmail, setAdminEmail] = useState('admin@rausachcore.com');
  const [language, setLanguage] = useState('vi');
  const [timezone, setTimezone] = useState('Asia/Ho_Chi_Minh');

  // Enrollment Settings
  const [autoEnrollment, setAutoEnrollment] = useState(false);
  const [requirePayment, setRequirePayment] = useState(true);
  const [allowGuestView, setAllowGuestView] = useState(false);
  const [maxEnrollments, setMaxEnrollments] = useState('100');

  // Certificate Settings
  const [enableCertificates, setEnableCertificates] = useState(true);
  const [certificatePrefix, setCertificatePrefix] = useState('RSC');
  const [requireCompletion, setRequireCompletion] = useState(true);
  const [minPassScore, setMinPassScore] = useState('80');

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [enrollmentNotify, setEnrollmentNotify] = useState(true);
  const [completionNotify, setCompletionNotify] = useState(true);
  const [quizNotify, setQuizNotify] = useState(false);

  // Payment Settings
  const [paymentGateway, setPaymentGateway] = useState('vnpay');
  const [currency, setCurrency] = useState('VND');
  const [taxRate, setTaxRate] = useState('10');

  const handleSave = (section: string) => {
    toast({
      title: "Đã lưu thành công",
      description: `Cài đặt ${section} đã được cập nhật`,
      type: "success",
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Cài đặt hệ thống</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Quản lý cấu hình và tùy chọn LMS</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="general" className="gap-1">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Chung</span>
          </TabsTrigger>
          <TabsTrigger value="enrollment" className="gap-1">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Ghi danh</span>
          </TabsTrigger>
          <TabsTrigger value="certificate" className="gap-1">
            <Award className="w-4 h-4" />
            <span className="hidden sm:inline">Chứng chỉ</span>
          </TabsTrigger>
          <TabsTrigger value="notification" className="gap-1">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Thông báo</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="gap-1">
            <DollarSign className="w-4 h-4" />
            <span className="hidden sm:inline">Thanh toán</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Bảo mật</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Thông tin chung
              </CardTitle>
              <CardDescription>Cấu hình thông tin cơ bản của hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Tên website</Label>
                <Input
                  id="siteName"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="Nhập tên website"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Mô tả</Label>
                <Textarea
                  id="siteDescription"
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  placeholder="Nhập mô tả website"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail">Email quản trị</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@example.com"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Ngôn ngữ</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">Tiếng Việt</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Múi giờ</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Ho_Chi_Minh">Việt Nam (GMT+7)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                      <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={() => handleSave('chung')} className="gap-2">
                <Save className="w-4 h-4" />
                Lưu thay đổi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enrollment Settings */}
        <TabsContent value="enrollment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Cài đặt ghi danh
              </CardTitle>
              <CardDescription>Quản lý quy trình ghi danh khóa học</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-0.5">
                  <Label>Tự động ghi danh</Label>
                  <p className="text-sm text-gray-600">Cho phép học viên tự ghi danh khóa học</p>
                </div>
                <Switch checked={autoEnrollment} onCheckedChange={setAutoEnrollment} />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-0.5">
                  <Label>Yêu cầu thanh toán</Label>
                  <p className="text-sm text-gray-600">Bắt buộc thanh toán trước khi ghi danh</p>
                </div>
                <Switch checked={requirePayment} onCheckedChange={setRequirePayment} />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-0.5">
                  <Label>Cho phép khách xem</Label>
                  <p className="text-sm text-gray-600">Khách có thể xem nội dung miễn phí</p>
                </div>
                <Switch checked={allowGuestView} onCheckedChange={setAllowGuestView} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxEnrollments">Số lượng ghi danh tối đa/khóa</Label>
                <Input
                  id="maxEnrollments"
                  type="number"
                  value={maxEnrollments}
                  onChange={(e) => setMaxEnrollments(e.target.value)}
                  placeholder="100"
                />
                <p className="text-xs text-gray-600">Để trống = không giới hạn</p>
              </div>

              <Button onClick={() => handleSave('ghi danh')} className="gap-2">
                <Save className="w-4 h-4" />
                Lưu thay đổi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificate Settings */}
        <TabsContent value="certificate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Cài đặt chứng chỉ
              </CardTitle>
              <CardDescription>Quản lý chứng chỉ hoàn thành khóa học</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-0.5">
                  <Label>Kích hoạt chứng chỉ</Label>
                  <p className="text-sm text-gray-600">Cấp chứng chỉ khi hoàn thành khóa học</p>
                </div>
                <Switch checked={enableCertificates} onCheckedChange={setEnableCertificates} />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-0.5">
                  <Label>Yêu cầu hoàn thành 100%</Label>
                  <p className="text-sm text-gray-600">Phải hoàn thành toàn bộ khóa học</p>
                </div>
                <Switch checked={requireCompletion} onCheckedChange={setRequireCompletion} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certificatePrefix">Tiền tố mã chứng chỉ</Label>
                <Input
                  id="certificatePrefix"
                  value={certificatePrefix}
                  onChange={(e) => setCertificatePrefix(e.target.value)}
                  placeholder="RSC"
                  maxLength={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minPassScore">Điểm tối thiểu để đạt (%)</Label>
                <Input
                  id="minPassScore"
                  type="number"
                  value={minPassScore}
                  onChange={(e) => setMinPassScore(e.target.value)}
                  min="0"
                  max="100"
                />
              </div>

              <Button onClick={() => handleSave('chứng chỉ')} className="gap-2">
                <Save className="w-4 h-4" />
                Lưu thay đổi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Cài đặt thông báo
              </CardTitle>
              <CardDescription>Quản lý thông báo email và hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-0.5">
                  <Label>Email thông báo</Label>
                  <p className="text-sm text-gray-600">Kích hoạt gửi email tự động</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <div className="pl-4 space-y-3 border-l-2 border-gray-200">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Thông báo ghi danh mới</Label>
                    <p className="text-xs text-gray-600">Email khi có ghi danh mới</p>
                  </div>
                  <Switch 
                    checked={enrollmentNotify} 
                    onCheckedChange={setEnrollmentNotify}
                    disabled={!emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Thông báo hoàn thành</Label>
                    <p className="text-xs text-gray-600">Email khi hoàn thành khóa học</p>
                  </div>
                  <Switch 
                    checked={completionNotify} 
                    onCheckedChange={setCompletionNotify}
                    disabled={!emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Thông báo kết quả quiz</Label>
                    <p className="text-xs text-gray-600">Email kết quả bài kiểm tra</p>
                  </div>
                  <Switch 
                    checked={quizNotify} 
                    onCheckedChange={setQuizNotify}
                    disabled={!emailNotifications}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave('thông báo')} className="gap-2">
                <Save className="w-4 h-4" />
                Lưu thay đổi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Cài đặt thanh toán
              </CardTitle>
              <CardDescription>Quản lý cổng thanh toán và tiền tệ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paymentGateway">Cổng thanh toán</Label>
                <Select value={paymentGateway} onValueChange={setPaymentGateway}>
                  <SelectTrigger id="paymentGateway">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vnpay">VNPay</SelectItem>
                    <SelectItem value="momo">MoMo</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Đơn vị tiền tệ</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VND">VND (₫)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxRate">Thuế (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Lưu ý</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Cần cấu hình API key của cổng thanh toán trong file .env
                    </p>
                  </div>
                </div>
              </div>

              <Button onClick={() => handleSave('thanh toán')} className="gap-2">
                <Save className="w-4 h-4" />
                Lưu thay đổi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Cài đặt bảo mật
              </CardTitle>
              <CardDescription>Quản lý bảo mật và quyền truy cập</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <Label className="text-base">Đổi mật khẩu quản trị</Label>
                  <p className="text-sm text-gray-600 mt-1 mb-3">Cập nhật mật khẩu tài khoản admin</p>
                  <Button variant="outline" className="gap-2">
                    <Lock className="w-4 h-4" />
                    Đổi mật khẩu
                  </Button>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <Label className="text-base">Sao lưu dữ liệu</Label>
                  <p className="text-sm text-gray-600 mt-1 mb-3">Tạo bản sao lưu toàn bộ hệ thống</p>
                  <Button variant="outline" className="gap-2">
                    <Database className="w-4 h-4" />
                    Sao lưu ngay
                  </Button>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <Label className="text-base">Nhật ký hoạt động</Label>
                  <p className="text-sm text-gray-600 mt-1 mb-3">Xem lịch sử thay đổi hệ thống</p>
                  <Button variant="outline" className="gap-2">
                    <FileText className="w-4 h-4" />
                    Xem nhật ký
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Cảnh báo bảo mật</p>
                    <p className="text-xs text-red-700 mt-1">
                      Thường xuyên cập nhật mật khẩu và sao lưu dữ liệu để đảm bảo an toàn
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
