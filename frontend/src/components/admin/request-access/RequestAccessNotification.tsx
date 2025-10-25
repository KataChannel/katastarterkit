/**
 * RequestAccessNotification Component
 * 
 * Display a notification for users without admin access requesting permission
 * Shows admin contact information and instructions
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Mail, Phone, FileText, Home } from 'lucide-react';

interface RequestAccessNotificationProps {
  userRole?: string;
  userName?: string;
}

export function RequestAccessNotification({ 
  userRole = 'User',
  userName = 'User'
}: RequestAccessNotificationProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Main Card */}
        <Card className="border-2 border-yellow-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-t-lg border-b-2 border-yellow-200">
            <div className="flex items-center gap-3 mb-2">
              <ShieldAlert className="w-8 h-8 text-yellow-600" />
              <CardTitle className="text-2xl text-yellow-900">
                Truy cập bị hạn chế
              </CardTitle>
            </div>
            <CardDescription className="text-yellow-800">
              Bạn không có quyền truy cập vào khu vực quản trị này
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-8 pb-8">
            {/* Current Role Info */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Thông tin tài khoản hiện tại:</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Tên người dùng:</p>
                  <p className="font-semibold text-gray-900">{userName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Quyền hạn:</p>
                  <p className="font-semibold text-blue-600">{userRole}</p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Làm cách nào để yêu cầu quyền truy cập?
              </h3>
              
              <div className="space-y-4">
                {/* Option 1: Email */}
                <div className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Gửi email yêu cầu</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Liên hệ với nhóm quản trị bằng email để yêu cầu quyền truy cập
                    </p>
                    <a 
                      href="mailto:admin@rausachcore.dev?subject=Yêu cầu quyền truy cập quản trị&body=Tôi muốn yêu cầu quyền truy cập vào khu vực quản trị."
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 underline"
                    >
                      admin@rausachcore.dev
                    </a>
                  </div>
                </div>

                {/* Option 2: Phone */}
                <div className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Gọi điện thoại</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Liên hệ trực tiếp với đội hỗ trợ qua điện thoại
                    </p>
                    <a 
                      href="tel:+84912345678"
                      className="text-sm font-medium text-green-600 hover:text-green-700 underline"
                    >
                      +84 (912) 345-678
                    </a>
                  </div>
                </div>

                {/* Option 3: Form */}
                <div className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Điền mẫu yêu cầu</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Điền mẫu yêu cầu quyền truy cập trực tuyến
                    </p>
                    <button 
                      onClick={() => router.push('/contact?type=admin-access')}
                      className="text-sm font-medium text-purple-600 hover:text-purple-700 underline"
                    >
                      Mở biểu mẫu yêu cầu
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Note */}
            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-900">
                <span className="font-semibold">📌 Lưu ý:</span> Nhóm quản trị sẽ xem xét yêu cầu của bạn trong vòng 1-2 ngày làm việc. 
                Vui lòng cung cấp thông tin chi tiết về lý do cần truy cập.
              </p>
            </div>

            {/* Typical Process */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quy trình xét duyệt
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-semibold text-blue-600 text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Gửi yêu cầu</p>
                    <p className="text-sm text-gray-600">Liên hệ với quản trị viên với lý do yêu cầu</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-semibold text-blue-600 text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Xem xét</p>
                    <p className="text-sm text-gray-600">Nhóm quản trị sẽ xem xét yêu cầu của bạn</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-semibold text-blue-600 text-sm">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Cấp quyền</p>
                    <p className="text-sm text-gray-600">Nếu được phê duyệt, bạn sẽ nhận được quyền quản trị</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                className="flex-1"
              >
                <Home className="w-4 h-4 mr-2" />
                Quay về trang chủ
              </Button>
              <Button
                onClick={() => router.push('/dashboard')}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Vào bảng điều khiển người dùng
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Nếu bạn cho rằng đây là một lỗi, vui lòng{' '}
            <a href="mailto:admin@rausachcore.dev" className="text-blue-600 hover:text-blue-700 underline">
              liên hệ với quản trị viên
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
