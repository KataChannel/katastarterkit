'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Users, Star, BookOpen } from 'lucide-react';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    slug: string;
    description?: string;
    thumbnail?: string;
    price: number;
    level: string;
    duration?: number;
    rating: number;
    enrollmentCount: number;
    reviewCount: number;
    instructor?: {
      firstName?: string;
      lastName?: string;
      username: string;
      avatar?: string;
    };
    category?: {
      name: string;
      slug: string;
    };
  };
  showInstructor?: boolean;
}

const LEVEL_COLORS = {
  BEGINNER: 'bg-green-100 text-green-800',
  INTERMEDIATE: 'bg-blue-100 text-blue-800',
  ADVANCED: 'bg-purple-100 text-purple-800',
  EXPERT: 'bg-red-100 text-red-800',
};

export default function CourseCard({ course, showInstructor = true }: CourseCardProps) {
  const levelColor = LEVEL_COLORS[course.level as keyof typeof LEVEL_COLORS] || 'bg-gray-100 text-gray-800';

  return (
    <Link href={`/courses/${course.slug}`}>
      <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-blue-300" />
            </div>
          )}
          
          {/* Price Badge */}
          <div className="absolute top-3 right-3">
            {course.price > 0 ? (
              <span className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900 shadow-sm">
                ${course.price}
              </span>
            ) : (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                Free
              </span>
            )}
          </div>

          {/* Level Badge */}
          <div className="absolute top-3 left-3">
            <span className={`${levelColor} px-2 py-1 rounded text-xs font-medium`}>
              {course.level}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Category */}
          {course.category && (
            <p className="text-xs text-blue-600 font-medium mb-2">
              {course.category.name}
            </p>
          )}

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>

          {/* Description */}
          {course.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
              {course.description}
            </p>
          )}

          {/* Instructor */}
          {showInstructor && course.instructor && (
            <div className="flex items-center gap-2 mb-4 text-sm text-gray-700">
              {course.instructor.avatar ? (
                <Image
                  src={course.instructor.avatar}
                  alt={course.instructor.username}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    {course.instructor.firstName?.[0] || course.instructor.username[0]}
                  </span>
                </div>
              )}
              <span className="truncate">
                {course.instructor.firstName && course.instructor.lastName
                  ? `${course.instructor.firstName} ${course.instructor.lastName}`
                  : course.instructor.username}
              </span>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-600 pt-4 border-t border-gray-100">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-medium">{course.rating.toFixed(1)}</span>
              <span className="text-gray-400">({course.reviewCount})</span>
            </div>

            {/* Students */}
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.enrollmentCount}</span>
            </div>

            {/* Duration */}
            {course.duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{Math.floor(course.duration / 60)}h {course.duration % 60}m</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
