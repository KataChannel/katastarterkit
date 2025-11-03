'use client';

import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StudentMyCoursesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Khóa học của tôi</h1>
      
      <Card>
        <CardContent className="py-16 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Chưa có khóa học nào
          </h3>
          <p className="text-gray-500 mb-6">
            Bắt đầu học tập bằng cách ghi danh vào khóa học
          </p>
          <Button>Khám phá khóa học</Button>
        </CardContent>
      </Card>
    </div>
  );
}
