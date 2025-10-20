'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_MY_ENROLLMENTS } from '@/graphql/lms/enrollments.graphql';
import Image from 'next/image';
import Link from 'next/link';
import ProgressBar from '@/components/lms/ProgressBar';
import { BookOpen, Clock, TrendingUp, Award } from 'lucide-react';

export default function MyLearningPage() {
  const [filter, setFilter] = useState<'ALL' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');

  const { data, loading, error } = useQuery(GET_MY_ENROLLMENTS);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error loading courses</h1>
          <p className="text-gray-600">Please try again later</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">My Learning</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <h3 className="text-sm font-medium text-blue-900">Total Courses</h3>
              </div>
              <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
                <h3 className="text-sm font-medium text-yellow-900">In Progress</h3>
              </div>
              <p className="text-3xl font-bold text-yellow-900">{stats.inProgress}</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-6 h-6 text-green-600" />
                <h3 className="text-sm font-medium text-green-900">Completed</h3>
              </div>
              <p className="text-3xl font-bold text-green-900">{stats.completed}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-purple-600" />
                <h3 className="text-sm font-medium text-purple-900">Avg. Progress</h3>
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
              All Courses ({enrollments.length})
            </button>
            <button
              onClick={() => setFilter('IN_PROGRESS')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'IN_PROGRESS'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              In Progress ({stats.inProgress})
            </button>
            <button
              onClick={() => setFilter('COMPLETED')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'COMPLETED'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed ({stats.completed})
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
                ? 'No courses yet' 
                : filter === 'COMPLETED'
                ? 'No completed courses'
                : 'No courses in progress'}
            </h3>
            <p className="text-gray-600 mb-6">
              Start learning by enrolling in a course
            </p>
            <Link
              href="/courses"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEnrollments.map((enrollment: any) => (
              <Link
                key={enrollment.id}
                href={`/courses/${enrollment.course.slug}`}
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
                  {/* Category */}
                  {enrollment.course.category && (
                    <p className="text-xs text-blue-600 font-medium mb-2">
                      {enrollment.course.category.name}
                    </p>
                  )}

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {enrollment.course.title}
                  </h3>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
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
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                  )}

                  {enrollment.completedAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Completed on {new Date(enrollment.completedAt).toLocaleDateString()}
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
