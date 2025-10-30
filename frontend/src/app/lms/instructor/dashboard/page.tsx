'use client';

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_MY_COURSES } from '@/graphql/lms/courses.graphql';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  TrendingUp,
  Edit,
  Eye,
  Archive,
  Plus,
  BarChart3,
  List,
  PlayCircle,
  HelpCircle
} from 'lucide-react';

export default function InstructorDashboardPage() {
  const { data, loading, error } = useQuery(GET_MY_COURSES);

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Truy cập bị từ chối</h1>
          <p className="text-gray-600 mb-4">Bạn cần vai trò ADMIN để truy cập trang này</p>
          <Link 
            href="/lms/courses"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Duyệt khóa học
          </Link>
        </div>
      </div>
    );
  }

  const courses = data?.myCourses || [];
  
  const stats = {
    totalCourses: courses.length,
    publishedCourses: courses.filter((c: any) => c.status === 'PUBLISHED').length,
    totalStudents: courses.reduce((acc: number, c: any) => acc + c.enrollmentCount, 0),
    totalRevenue: courses.reduce((acc: number, c: any) => acc + (c.price * c.enrollmentCount), 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Bảng điều khiển giảng viên</h1>
              <p className="text-gray-600">Quản lý khóa học và theo dõi hiệu suất</p>
            </div>
            <Link
              href="/lms/instructor/courses/create"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Tạo khóa học
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalCourses}</h3>
            <p className="text-sm text-gray-600">Tổng số khóa học</p>
            <p className="text-xs text-green-600 mt-2">{stats.publishedCourses} đã xuất bản</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalStudents}</h3>
            <p className="text-sm text-gray-600">Tổng số học viên</p>
            <p className="text-xs text-gray-500 mt-2">Trên tất cả khóa học</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              ${stats.totalRevenue.toFixed(2)}
            </h3>
            <p className="text-sm text-gray-600">Tổng doanh thu</p>
            <p className="text-xs text-gray-500 mt-2">Thu nhập toàn thời gian</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stats.totalStudents > 0 ? (stats.totalRevenue / stats.totalStudents).toFixed(2) : '0.00'}
            </h3>
            <p className="text-sm text-gray-600">TB. Doanh thu/Học viên</p>
            <p className="text-xs text-gray-500 mt-2">Mỗi lần ghi danh</p>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Khóa học của tôi</h2>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có khóa học</h3>
              <p className="text-gray-600 mb-6">Bắt đầu tạo khóa học đầu tiên của bạn</p>
              <Link
                href="/lms/instructor/courses/create"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                Tạo khóa học
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khóa học
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Học viên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doanh thu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đánh giá
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.map((course: any) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {course.thumbnail ? (
                            <Image
                              src={course.thumbnail}
                              alt={course.title}
                              width={64}
                              height={48}
                              className="rounded object-cover"
                            />
                          ) : (
                            <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{course.title}</p>
                            <p className="text-sm text-gray-500">{course.level}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            course.status === 'PUBLISHED'
                              ? 'bg-green-100 text-green-800'
                              : course.status === 'DRAFT'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {course.status === 'PUBLISHED' ? 'Đã xuất bản' : course.status === 'DRAFT' ? 'Bản nháp' : course.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {course.enrollmentCount}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ${(course.price * course.enrollmentCount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ⭐ {course.avgRating.toFixed(1)} ({course.reviewCount})
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/lms/courses/${course.slug}`}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                            title="Xem"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/lms/instructor/courses/${course.id}/manage`}
                            className="text-purple-600 hover:text-purple-900 p-2 hover:bg-purple-50 rounded transition-colors"
                            title="Quản lý Module"
                          >
                            <List className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/lms/instructor/courses/${course.id}/lessons`}
                            className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded transition-colors"
                            title="Quản lý Bài học"
                          >
                            <PlayCircle className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/lms/instructor/courses/${course.id}/quizzes`}
                            className="text-amber-600 hover:text-amber-900 p-2 hover:bg-amber-50 rounded transition-colors"
                            title="Quản lý Quiz"
                          >
                            <HelpCircle className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/lms/instructor/courses/${course.id}/edit`}
                            className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded transition-colors"
                            title="Sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            className="text-orange-600 hover:text-orange-900 p-2 hover:bg-orange-50 rounded transition-colors"
                            title="Archive"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
