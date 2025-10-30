// ✅ MIGRATED TO DYNAMIC GRAPHQL - 2025-10-29
// Original backup: ReviewsSection.tsx.backup

'use client';

import { useState } from 'react';
import { useFindMany, useFindUnique } from '@/hooks/useDynamicGraphQL';
import { MessageSquare, Edit2 } from 'lucide-react';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

interface ReviewsSectionProps {
  courseId: string;
  currentUserId?: string;
  isEnrolled: boolean;
}

export default function ReviewsSection({
  courseId,
  currentUserId,
  isEnrolled,
}: ReviewsSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);

  // ✅ Migrated to Dynamic GraphQL  
  const { data: userReviews, refetch: refetchUserReview } = useFindMany('review', {
    where: {
      courseId,
      ...(currentUserId && { userId: currentUserId }),
    },
    take: 1,
  });

  const userReview = userReviews?.[0];

  const handleSuccess = () => {
    setShowForm(false);
    setEditingReview(null);
    refetchUserReview();
  };

  const handleEditReview = (review: any) => {
    setEditingReview(review);
    setShowForm(true);
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Đánh giá từ học viên
          </h2>
        </div>

        {/* Add/Edit Review Button */}
        {isEnrolled && currentUserId && (
          <div>
            {userReview && !showForm ? (
              <button
                onClick={() => {
                  setEditingReview(userReview);
                  setShowForm(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Chỉnh sửa đánh giá
              </button>
            ) : !userReview && !showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Viết đánh giá
              </button>
            ) : null}
          </div>
        )}
      </div>

      {/* Enrollment Requirement Notice */}
      {!isEnrolled && currentUserId && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Ghi danh khóa học này</strong> để viết đánh giá và chia sẻ trải nghiệm của bạn với các học viên khác.
          </p>
        </div>
      )}

      {/* Review Form */}
      {showForm && isEnrolled && currentUserId && (
        <div className="p-6 bg-white border-2 border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingReview ? 'Chỉnh sửa đánh giá của bạn' : 'Viết đánh giá của bạn'}
          </h3>
          <ReviewForm
            courseId={courseId}
            existingReview={editingReview}
            onSuccess={handleSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingReview(null);
            }}
          />
        </div>
      )}

      {/* Review List */}
      <ReviewList
        courseId={courseId}
        currentUserId={currentUserId}
        onEditReview={handleEditReview}
      />
    </div>
  );
}
