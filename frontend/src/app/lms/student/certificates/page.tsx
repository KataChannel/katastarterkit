'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Award } from 'lucide-react';

export default function StudentCertificatesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Chứng chỉ của tôi</h1>
      
      <Card>
        <CardContent className="py-16 text-center">
          <Award className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Chưa có chứng chỉ nào
          </h3>
          <p className="text-gray-500">
            Hoàn thành khóa học để nhận chứng chỉ
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
