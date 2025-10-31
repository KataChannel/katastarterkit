'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Users, Award, TrendingUp, Play, FileText, CheckCircle } from 'lucide-react';
import { useSiteName } from '@/hooks/useSiteName';

export default function LMSHomePage() {
  const router = useRouter();
  const { siteName } = useSiteName();

  const features = [
    {
      icon: <Play className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />,
      title: 'Khóa học Video',
      description: 'Video chất lượng cao với theo dõi tiến độ học tập',
      link: '/lms/courses',
    },
    {
      icon: <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />,
      title: 'Nội dung Đa dạng',
      description: 'Bài giảng text với trình soạn thảo tương tác',
      link: '/lms/courses',
    },
    {
      icon: <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600" />,
      title: 'Bài kiểm tra',
      description: 'Kiểm tra kiến thức với hệ thống chấm điểm tự động',
      link: '/lms/courses',
    },
    {
      icon: <Award className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-600" />,
      title: 'Chứng chỉ',
      description: 'Nhận chứng chỉ khi hoàn thành khóa học',
      link: '/lms/my-learning',
    },
  ];

  const stats = [
    { label: 'Khóa học', value: '100+', icon: <BookOpen className="w-6 h-6 sm:w-8 sm:h-8" /> },
    { label: 'Học viên', value: '10K+', icon: <Users className="w-6 h-6 sm:w-8 sm:h-8" /> },
    { label: 'Giảng viên', value: '50+', icon: <Award className="w-6 h-6 sm:w-8 sm:h-8" /> },
    { label: 'Tỉ lệ thành công', value: '95%', icon: <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight">
              Chào mừng đến {siteName} LMS
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              Chuyển đổi hành trình học tập của bạn với hệ thống quản lý học tập toàn diện
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <button
                onClick={() => router.push('/lms/courses')}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-lg font-semibold text-base sm:text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                Khám phá Khóa học
              </button>
              <button
                onClick={() => router.push('/lms/my-learning')}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-700 text-white rounded-lg font-semibold text-base sm:text-lg hover:bg-blue-800 transition-all transform hover:scale-105 shadow-lg border-2 border-white"
              >
                Học tập của tôi
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 md:-mt-16 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 text-center transform hover:scale-105 transition-all"
            >
              <div className="flex justify-center text-blue-600 mb-2 sm:mb-3">
                {stat.icon}
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
            Tại sao chọn {siteName} LMS?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Trải nghiệm nền tảng học tập toàn diện và thân thiện nhất
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => router.push(feature.link)}
              className="bg-white rounded-xl shadow-md p-6 sm:p-8 hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="mb-3 sm:mb-4">{feature.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">
              Sẵn sàng bắt đầu học?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Tham gia cùng hàng nghìn học viên đang học tập trên nền tảng của chúng tôi
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <button
                onClick={() => router.push('/lms/courses')}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-lg font-semibold text-base sm:text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                Khám phá tất cả khóa học
              </button>
              <button
                onClick={() => router.push('/lms/instructor/dashboard')}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-transparent text-white rounded-lg font-semibold text-base sm:text-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg border-2 border-white"
              >
                Trở thành Giảng viên
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 sm:p-8 border border-blue-200">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Dành cho Học viên
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 sm:mt-1 flex-shrink-0" />
                <span>Truy cập hơn 100+ khóa học</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 sm:mt-1 flex-shrink-0" />
                <span>Theo dõi tiến độ học tập</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 sm:mt-1 flex-shrink-0" />
                <span>Nhận chứng chỉ hoàn thành</span>
              </li>
            </ul>
            <button
              onClick={() => router.push('/lms/courses')}
              className="mt-4 sm:mt-6 w-full py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg font-semibold text-sm sm:text-base hover:bg-blue-700 transition-colors"
            >
              Bắt đầu học
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 sm:p-8 border border-purple-200">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Dành cho Giảng viên
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 sm:mt-1 flex-shrink-0" />
                <span>Tạo khóa học không giới hạn</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 sm:mt-1 flex-shrink-0" />
                <span>Upload video & tài liệu</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 sm:mt-1 flex-shrink-0" />
                <span>Theo dõi tiến độ học viên</span>
              </li>
            </ul>
            <button
              onClick={() => router.push('/lms/instructor/dashboard')}
              className="mt-4 sm:mt-6 w-full py-2.5 sm:py-3 bg-purple-600 text-white rounded-lg font-semibold text-sm sm:text-base hover:bg-purple-700 transition-colors"
            >
              Bắt đầu giảng dạy
            </button>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 sm:p-8 border border-green-200">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Tính năng
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 sm:mt-1 flex-shrink-0" />
                <span>Video HD chất lượng cao</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 sm:mt-1 flex-shrink-0" />
                <span>Bài kiểm tra tương tác</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 sm:mt-1 flex-shrink-0" />
                <span>Theo dõi tiến độ chi tiết</span>
              </li>
            </ul>
            <button
              onClick={() => router.push('/lms/courses')}
              className="mt-4 sm:mt-6 w-full py-2.5 sm:py-3 bg-green-600 text-white rounded-lg font-semibold text-sm sm:text-base hover:bg-green-700 transition-colors"
            >
              Khám phá tính năng
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
