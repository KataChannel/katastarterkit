'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useParams, useSearchParams } from 'next/navigation';
import { GET_COURSE_BY_SLUG, GET_ENROLLMENT } from '@/graphql/lms/courses.graphql';
import LessonViewer from '@/components/lms/LessonViewer';
import { CheckCircle, Lock, PlayCircle, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function LearnCoursePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const lessonIdParam = searchParams?.get('lesson');

  const { data: courseData, loading: courseLoading } = useQuery(GET_COURSE_BY_SLUG, {
    variables: { slug },
    skip: !slug,
  });

  const { data: enrollmentData, loading: enrollmentLoading, refetch: refetchEnrollment } = useQuery(GET_ENROLLMENT, {
    variables: { courseId: courseData?.courseBySlug?.id },
    skip: !courseData?.courseBySlug?.id,
  });

  const course = courseData?.courseBySlug;
  const enrollment = enrollmentData?.enrollment;

  // Flatten lessons with module info
  const allLessons = course?.modules?.flatMap((module: any) =>
    module.lessons.map((lesson: any) => ({
      ...lesson,
      moduleName: module.title,
      moduleOrder: module.order,
    }))
  ).sort((a: any, b: any) => {
    if (a.moduleOrder !== b.moduleOrder) return a.moduleOrder - b.moduleOrder;
    return a.order - b.order;
  }) || [];

  // Get current lesson
  const [currentLessonIndex, setCurrentLessonIndex] = useState(() => {
    if (lessonIdParam) {
      return allLessons.findIndex((l: any) => l.id === lessonIdParam);
    }
    return 0;
  });

  const currentLesson = allLessons[currentLessonIndex];
  const nextLesson = allLessons[currentLessonIndex + 1];

  // Check if lesson is completed
  const isLessonCompleted = (lessonId: string) => {
    return enrollment?.lessonProgress?.some(
      (progress: any) => progress.lessonId === lessonId && progress.completed
    );
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const handleSelectLesson = (index: number) => {
    setCurrentLessonIndex(index);
  };

  if (courseLoading || enrollmentLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course || !enrollment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h1>
          <p className="text-gray-600 mb-4">You may not be enrolled in this course</p>
          <Link
            href="/courses"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar - Course Content */}
        <aside className="w-96 bg-white border-r border-gray-200 h-screen overflow-y-auto sticky top-0">
          {/* Course Header */}
          <div className="p-6 border-b border-gray-200">
            <Link href={`/courses/${slug}`} className="text-sm text-blue-600 hover:text-blue-700 mb-2 block">
              ← Back to course
            </Link>
            <h2 className="text-lg font-bold text-gray-900">{course.title}</h2>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Your Progress</span>
                <span className="text-sm font-bold text-blue-600">{enrollment.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${enrollment.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Lesson List */}
          <div className="p-4">
            {course.modules?.map((module: any, moduleIndex: number) => (
              <div key={module.id} className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 px-2">
                  {moduleIndex + 1}. {module.title}
                </h3>
                <div className="space-y-1">
                  {module.lessons.map((lesson: any, lessonIndex: number) => {
                    const globalIndex = allLessons.findIndex((l: any) => l.id === lesson.id);
                    const isCompleted = isLessonCompleted(lesson.id);
                    const isCurrent = globalIndex === currentLessonIndex;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleSelectLesson(globalIndex)}
                        className={`w-full text-left p-3 rounded-lg transition-colors flex items-start gap-3 ${
                          isCurrent
                            ? 'bg-blue-50 border-2 border-blue-500'
                            : 'hover:bg-gray-50 border-2 border-transparent'
                        }`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : lesson.type === 'VIDEO' ? (
                            <PlayCircle className="w-5 h-5 text-gray-400" />
                          ) : (
                            <FileText className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${isCurrent ? 'text-blue-900' : 'text-gray-900'}`}>
                            {lesson.title}
                          </p>
                          {lesson.duration && (
                            <p className="text-xs text-gray-500 mt-1">{lesson.duration} min</p>
                          )}
                        </div>
                        {isCurrent && <ChevronRight className="w-5 h-5 text-blue-600 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 max-w-5xl mx-auto">
          {currentLesson ? (
            <LessonViewer
              lesson={currentLesson}
              enrollmentId={enrollment.id}
              isCompleted={isLessonCompleted(currentLesson.id)}
              onComplete={() => refetchEnrollment()}
              nextLesson={nextLesson}
              onNextLesson={handleNextLesson}
            />
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600">No lessons available</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
