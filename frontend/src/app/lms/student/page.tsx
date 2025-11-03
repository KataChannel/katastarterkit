'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Award, TrendingUp, Clock } from 'lucide-react';

export default function StudentDashboard() {
  const stats = {
    enrolledCourses: 0,
    completedCourses: 0,
    certificates: 0,
    hoursLearned: 0,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Chào mừng trở lại!</h1>
        <p className="text-gray-600 mt-2">Tiếp tục hành trình học tập của bạn</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khóa đang học</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.enrolledCourses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã hoàn thành</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedCourses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chứng chỉ</CardTitle>
            <Award className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.certificates}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giờ học</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hoursLearned}h</div>
          </CardContent>
        </Card>
      </div>

      {/* My Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Khóa học của tôi</CardTitle>
          <CardDescription>Tiếp tục các khóa học bạn đang tham gia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chưa có khóa học nào
            </h3>
            <p className="text-gray-500 mb-6">
              Bắt đầu học tập bằng cách ghi danh vào khóa học
            </p>
            <Button>Khám phá khóa học</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
