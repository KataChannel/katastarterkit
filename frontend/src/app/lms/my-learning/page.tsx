'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { GET_MY_ENROLLMENTS } from '@/graphql/lms/enrollments.graphql';
import Image from 'next/image';
import Link from 'next/link';
import ProgressBar from '@/components/lms/ProgressBar';
import { BookOpen, Clock, TrendingUp, Award } from 'lucide-react';

export default function MyLearningPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState<'ALL' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/lms/my-learning');
    }
  }, [user, authLoading, router]);

  const { data, loading, error } = useQuery(GET_MY_ENROLLMENTS, {
    skip: !user, // Skip query if user is not logged in
  });

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải khóa học của bạn...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Lỗi khi tải khóa học</h1>
          <p className="text-gray-600">Vui lòng thử lại sau</p>
        </div>
      </div>
    );
  }

  const enrollments = data?.myEnrollments || [];
  
  const filteredEnrollments = enrollments.filter((enrollment: any) => {
    if (filter === 'COMPLETED') return enrollment.status === 'COMPLETED';
    if (filter === 'IN_PROGRESS') return enrollment.status === 'ACTIVE' && enrollment.progress > 0;
    return true;
  });

  const stats = {
    total: enrollments.length,
    inProgress: enrollments.filter((e: any) => e.status === 'ACTIVE' && e.progress > 0).length,
    completed: enrollments.filter((e: any) => e.status === 'COMPLETED').length,
    averageProgress: enrollments.length > 0
      ? enrollments.reduce((acc: number, e: any) => acc + e.progress, 0) / enrollments.length
      : 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Học tập của tôi</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <h3 className="text-sm font-medium text-blue-900">Tổng khóa học</h3>
              </div>
              <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
                <h3 className="text-sm font-medium text-yellow-900">Đang học</h3>
              </div>
              <p className="text-3xl font-bold text-yellow-900">{stats.inProgress}</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-6 h-6 text-green-600" />
                <h3 className="text-sm font-medium text-green-900">Hoàn thành</h3>
              </div>
              <p className="text-3xl font-bold text-green-900">{stats.completed}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-purple-600" />
                <h3 className="text-sm font-medium text-purple-900">Tiến độ TB</h3>
              </div>
              <p className="text-3xl font-bold text-purple-900">
                {stats.averageProgress.toFixed(0)}%
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'ALL'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả ({enrollments.length})
            </button>
            <button
              onClick={() => setFilter('IN_PROGRESS')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'IN_PROGRESS'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Đang học ({stats.inProgress})
            </button>
            <button
              onClick={() => setFilter('COMPLETED')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'COMPLETED'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hoàn thành ({stats.completed})
            </button>
          </div>
        </div>
      </div>

      {/* Course List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredEnrollments.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'ALL' 
                ? 'Chưa có khóa học nào' 
                : filter === 'COMPLETED'
                ? 'Chưa có khóa học hoàn thành'
                : 'Chưa có khóa học đang học'}
            </h3>
            <p className="text-gray-600 mb-6">
              Bắt đầu học bằng cách ghi danh khóa học
            </p>
            <Link
              href="/lms/courses"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Duyệt khóa học
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEnrollments.map((enrollment: any) => (
              <Link
                key={enrollment.id}
                href={`/lms/courses/${enrollment.course.slug}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group"
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
                  {enrollment.course.thumbnail ? (
                    <Image
                      src={enrollment.course.thumbnail}
                      alt={enrollment.course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-blue-300" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {enrollment.course.title}
                  </h3>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Tiến độ</span>
                      <span className="text-sm font-medium text-gray-900">
                        {enrollment.progress}%
                      </span>
                    </div>
                    <ProgressBar 
                      progress={enrollment.progress} 
                      size="md"
                      color={enrollment.status === 'COMPLETED' ? 'green' : 'blue'}
                    />
                  </div>

                  {/* Status Badge */}
                  {enrollment.status === 'COMPLETED' && (
                    <div className="flex items-center gap-2 text-green-600">
                      <Award className="w-4 h-4" />
                      <span className="text-sm font-medium">Hoàn thành</span>
                    </div>
                  )}

                  {enrollment.completedAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Hoàn thành vào {new Date(enrollment.completedAt).toLocaleDateString('vi-VN')}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
