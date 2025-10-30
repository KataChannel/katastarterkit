'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_COURSE_BY_SLUG, GET_ENROLLMENT } from '@/graphql/lms/courses.graphql';
import { GET_COURSE_DISCUSSIONS, CREATE_DISCUSSION } from '@/graphql/lms/discussions.graphql';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import EnrollButton from '@/components/lms/EnrollButton';
import RatingStars from '@/components/lms/RatingStars';
import ReviewsSection from '@/components/lms/ReviewsSection';
import DiscussionThread from '@/components/lms/DiscussionThread';
import { Clock, Users, BookOpen, Globe, Award, CheckCircle, PlayCircle, FileText, MessageSquare, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'reviews' | 'discussions'>('overview');
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [discussionTitle, setDiscussionTitle] = useState('');
  const [discussionContent, setDiscussionContent] = useState('');

  const { data, loading, error } = useQuery(GET_COURSE_BY_SLUG, {
    variables: { slug },
    skip: !slug,
  });

  const { data: enrollmentData, refetch: refetchEnrollment } = useQuery(GET_ENROLLMENT, {
    variables: { courseId: data?.courseBySlug?.id },
    skip: !data?.courseBySlug?.id || !isAuthenticated,
  });

  // Refetch enrollment when user authentication changes
  useEffect(() => {
    if (isAuthenticated && data?.courseBySlug?.id) {
      refetchEnrollment();
    }
  }, [isAuthenticated, data?.courseBySlug?.id, refetchEnrollment]);

  const { data: discussionsData, refetch: refetchDiscussions } = useQuery(GET_COURSE_DISCUSSIONS, {
    variables: { courseId: data?.courseBySlug?.id },
    skip: !data?.courseBySlug?.id || activeTab !== 'discussions',
  });

  const [createDiscussion] = useMutation(CREATE_DISCUSSION, {
    onCompleted: () => {
      setShowNewDiscussion(false);
      setDiscussionTitle('');
      setDiscussionContent('');
      refetchDiscussions();
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 animate-pulse">
        <div className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="h-10 bg-gray-700 rounded w-3/4 mb-4" />
            <div className="h-6 bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.courseBySlug) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy khóa học</h1>
          <p className="text-gray-600">Khóa học bạn đang tìm kiếm không tồn tại.</p>
        </div>
      </div>
    );
  }

  const course = data.courseBySlug;
  const totalLessons = course.modules?.reduce(
    (acc: number, mod: any) => acc + (mod.lessons?.length || 0),
    0
  ) || 0;

  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discussionTitle.trim() || !discussionContent.trim()) return;

    try {
      await createDiscussion({
        variables: {
          input: {
            courseId: course.id,
            title: discussionTitle,
            content: discussionContent,
          },
        },
      });
    } catch (error) {
      console.error('Error creating discussion:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Breadcrumb */}
              {course.category && (
                <p className="text-blue-300 text-sm mb-4">
                  {course.category.name}
                </p>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {course.title}
              </h1>

              {/* Description */}
              <p className="text-xl text-gray-300 mb-6">
                {course.description}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <RatingStars 
                  rating={course.avgRating} 
                  size="lg" 
                  showNumber 
                  reviewCount={course.reviewCount}
                />
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{course.enrollmentCount} students</span>
                </div>
              </div>

              {/* Instructor */}
              {course.instructor && (
                <div className="flex items-center gap-3">
                  {course.instructor.avatar ? (
                    <Image
                      src={course.instructor.avatar}
                      alt={course.instructor.username}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="text-lg font-medium">
                        {course.instructor.firstName?.[0] || course.instructor.username[0]}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-400">Created by</p>
                    <p className="font-medium">
                      {course.instructor.firstName && course.instructor.lastName
                        ? `${course.instructor.firstName} ${course.instructor.lastName}`
                        : course.instructor.username}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Card */}
            <div className="lg:col-span-1">
              <div className="bg-white text-gray-900 rounded-xl shadow-xl p-6 sticky top-4">
                {/* Thumbnail */}
                {course.thumbnail && (
                  <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Price */}
                <div className="text-3xl font-bold mb-6">
                  {course.price > 0 ? `$${course.price}` : 'Free'}
                </div>

                {/* Enroll Button */}
                <EnrollButton 
                  courseId={course.id}
                  courseSlug={course.slug}
                  price={course.price}
                  isEnrolled={!!enrollmentData?.enrollment}
                />

                {/* Course Info */}
                <div className="mt-6 pt-6 border-t space-y-4">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Cấp độ</p>
                      <p className="font-medium">{course.level}</p>
                    </div>
                  </div>

                  {course.duration && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Thời lượng</p>
                        <p className="font-medium">
                          {Math.floor(course.duration / 60)}h {course.duration % 60}m
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Bài học</p>
                      <p className="font-medium">{totalLessons} bài học</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Ngôn ngữ</p>
                      <p className="font-medium">Tiếng Việt</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-4 font-medium ${
                    activeTab === 'overview'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('content')}
                  className={`px-6 py-4 font-medium ${
                    activeTab === 'content'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Course Content
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-6 py-4 font-medium ${
                    activeTab === 'reviews'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Đánh giá
                </button>
                <button
                  onClick={() => setActiveTab('discussions')}
                  className={`px-6 py-4 font-medium flex items-center gap-2 ${
                    activeTab === 'discussions'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Thảo luận
                </button>
              </div>

              <div className="p-8">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {/* What You'll Learn */}
                    {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                      <div>
                        <h2 className="text-2xl font-bold mb-6">Bạn sẽ học được gì</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {course.whatYouWillLearn.map((item: string, index: number) => (
                            <div key={index} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Requirements */}
                    {course.requirements && course.requirements.length > 0 && (
                      <div>
                        <h2 className="text-2xl font-bold mb-6">Yêu cầu</h2>
                        <ul className="space-y-2">
                          {course.requirements.map((req: string, index: number) => (
                            <li key={index} className="flex items-start gap-3 text-gray-700">
                              <span className="text-gray-400">•</span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Content Tab */}
                {activeTab === 'content' && (
                  <div>
                    {course.modules && course.modules.length > 0 ? (
                      <div className="space-y-4">
                        {course.modules.map((module: any, moduleIndex: number) => (
                          <details key={module.id} className="group" open={moduleIndex === 0}>
                            <summary className="flex items-center justify-between cursor-pointer bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors">
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-gray-900">
                                  {moduleIndex + 1}. {module.title}
                                </span>
                              </div>
                              <span className="text-sm text-gray-600">
                                {module.lessons?.length || 0} bài học
                              </span>
                            </summary>
                            <div className="mt-2 ml-4 space-y-2">
                              {module.lessons?.map((lesson: any, lessonIndex: number) => (
                                <div
                                  key={lesson.id}
                                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                  {lesson.type === 'VIDEO' ? (
                                    <PlayCircle className="w-4 h-4 text-gray-400" />
                                  ) : (
                                    <FileText className="w-4 h-4 text-gray-400" />
                                  )}
                                  <span className="text-gray-700">
                                    {moduleIndex + 1}.{lessonIndex + 1} {lesson.title}
                                  </span>
                                  {lesson.duration && (
                                    <span className="ml-auto text-sm text-gray-500">
                                      {lesson.duration} min
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </details>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Chưa có nội dung khóa học.</p>
                    )}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <ReviewsSection
                    courseId={course.id}
                    currentUserId={user?.id}
                    isEnrolled={!!enrollmentData?.enrollment}
                  />
                )}

                {/* Discussions Tab */}
                {activeTab === 'discussions' && (
                  <div className="space-y-6">
                    {/* New Discussion Button */}
                    {enrollmentData?.enrollment && !showNewDiscussion && (
                      <button
                        onClick={() => setShowNewDiscussion(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        <Plus className="w-5 h-5" />
                        Bắt đầu thảo luận mới
                      </button>
                    )}

                    {/* New Discussion Form */}
                    {showNewDiscussion && (
                      <form onSubmit={handleCreateDiscussion} className="bg-gray-50 rounded-lg p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Thảo luận mới</h3>
                        <div>
                          <input
                            type="text"
                            value={discussionTitle}
                            onChange={(e) => setDiscussionTitle(e.target.value)}
                            placeholder="Tiêu đề thảo luận..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <textarea
                            value={discussionContent}
                            onChange={(e) => setDiscussionContent(e.target.value)}
                            placeholder="Bạn muốn thảo luận điều gì?"
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            required
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            Đăng thảo luận
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowNewDiscussion(false);
                              setDiscussionTitle('');
                              setDiscussionContent('');
                            }}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                          >
                            Hủy
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Discussions List */}
                    {!enrollmentData?.enrollment && (
                      <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 mb-4">Ghi danh khóa học này để tham gia thảo luận</p>
                      </div>
                    )}

                    {discussionsData?.courseDiscussions && discussionsData.courseDiscussions.length > 0 ? (
                      <div className="space-y-4">
                        {discussionsData.courseDiscussions.map((discussion: any) => (
                          <DiscussionThread
                            key={discussion.id}
                            discussion={discussion}
                            refetch={refetchDiscussions}
                            canModerate={course.instructor?.id === user?.id}
                            isOwner={discussion.user.id === user?.id}
                          />
                        ))}
                      </div>
                    ) : enrollmentData?.enrollment ? (
                      <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">Chưa có thảo luận nào. Hãy là người đầu tiên bắt đầu!</p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Empty for now - could add related courses, etc */}
          </div>
        </div>
      </div>
    </div>
  );
}
