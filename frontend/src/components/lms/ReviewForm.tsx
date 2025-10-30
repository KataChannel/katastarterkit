// ✅ MIGRATED TO LMS REVIEW MUTATIONS - 2025-10-30
// Original backup: ReviewForm.DYNAMIC.tsx

'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_REVIEW, UPDATE_REVIEW } from '@/graphql/lms/reviews.graphql';
import { Star } from 'lucide-react';

interface ReviewFormProps {
  courseId: string;
  existingReview?: {
    id: string;
    rating: number;
    comment?: string;
  } | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({
  courseId,
  existingReview,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [error, setError] = useState('');

  // ✅ Use custom LMS mutations
  const [createReview, { loading: creating }] = useMutation(CREATE_REVIEW, {
    onCompleted: () => {
      onSuccess?.();
    },
    onError: (err) => {
      setError(err.message || 'Không thể tạo đánh giá');
    },
  });

  const [updateReview, { loading: updating }] = useMutation(UPDATE_REVIEW, {
    onCompleted: () => {
      onSuccess?.();
    },
    onError: (err) => {
      setError(err.message || 'Không thể cập nhật đánh giá');
    },
  });

  const loading = creating || updating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Vui lòng chọn đánh giá sao');
      return;
    }

    try {
      if (existingReview) {
        // Update existing review
        await updateReview({
          variables: {
            input: {
              reviewId: existingReview.id,
              rating,
              comment: comment.trim() || undefined,
            },
          },
        });
      } else {
        // Create new review
        await createReview({
          variables: {
            input: {
              courseId,
              rating,
              comment: comment.trim() || undefined,
            },
          },
        });
      }
    } catch (err: any) {
      // Error handled in onError callback
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Star Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Đánh giá của bạn *
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-3 text-sm font-medium text-gray-700">
              {rating} sao
            </span>
          )}
        </div>
      </div>

      {/* Comment */}
      <div>
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Nhận xét của bạn (Tùy chọn)
        </label>
        <textarea
          id="comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={1000}
          placeholder="Chia sẻ trải nghiệm của bạn về khóa học này..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <p className="mt-1 text-sm text-gray-500">
          {comment.length} / 1000 ký tự
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading
            ? 'Đang gửi...'
            : existingReview
            ? 'Cập nhật đánh giá'
            : 'Gửi đánh giá'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Hủy
          </button>
        )}
      </div>
    </form>
  );
}
