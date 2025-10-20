'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Star, ThumbsUp, MoreVertical, Edit, Trash2 } from 'lucide-react';
import {
  GET_REVIEWS,
  MARK_REVIEW_HELPFUL,
  DELETE_REVIEW,
} from '@/graphql/lms/reviews.graphql';
import { formatDistanceToNow } from 'date-fns';

interface ReviewListProps {
  courseId: string;
  currentUserId?: string;
  onEditReview?: (review: any) => void;
}

export default function ReviewList({
  courseId,
  currentUserId,
  onEditReview,
}: ReviewListProps) {
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');
  const [filterByRating, setFilterByRating] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, loading, error, refetch } = useQuery(GET_REVIEWS, {
    variables: {
      input: {
        courseId,
        page,
        pageSize,
        sortBy,
        ...(filterByRating && { filterByRating }),
      },
    },
  });

  const [markHelpful] = useMutation(MARK_REVIEW_HELPFUL, {
    refetchQueries: [{ query: GET_REVIEWS, variables: { input: { courseId, page, pageSize, sortBy } } }],
  });

  const [deleteReview] = useMutation(DELETE_REVIEW, {
    refetchQueries: [{ query: GET_REVIEWS, variables: { input: { courseId, page, pageSize, sortBy } } }],
  });

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      await markHelpful({ variables: { reviewId } });
    } catch (err) {
      console.error('Failed to mark review as helpful:', err);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await deleteReview({ variables: { reviewId } });
    } catch (err: any) {
      alert(err.message || 'Failed to delete review');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderRatingBars = () => {
    const stats = data?.reviews?.stats;
    if (!stats) return null;

    const ratingData = [
      { stars: 5, count: stats.fiveStars },
      { stars: 4, count: stats.fourStars },
      { stars: 3, count: stats.threeStars },
      { stars: 2, count: stats.twoStars },
      { stars: 1, count: stats.oneStar },
    ];

    return (
      <div className="space-y-2">
        {ratingData.map(({ stars, count }) => {
          const percentage =
            stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
          return (
            <button
              key={stars}
              onClick={() =>
                setFilterByRating(filterByRating === stars ? null : stars)
              }
              className={`w-full flex items-center gap-3 p-2 rounded hover:bg-gray-50 transition-colors ${
                filterByRating === stars ? 'bg-blue-50' : ''
              }`}
            >
              <span className="text-sm font-medium w-12">{stars} star</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">
                {count}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  if (loading && !data) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 border border-gray-200 rounded-lg animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Failed to load reviews: {error.message}</p>
      </div>
    );
  }

  const reviews = data?.reviews?.reviews || [];
  const stats = data?.reviews?.stats;
  const total = data?.reviews?.total || 0;

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {stats && (
        <div className="grid md:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-lg">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900">
              {stats.avgRating.toFixed(1)}
            </div>
            <div className="flex justify-center mt-2">
              {renderStars(Math.round(stats.avgRating))}
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="md:col-span-2">{renderRatingBars()}</div>
        </div>
      )}

      {/* Filters and Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          {filterByRating && (
            <button
              onClick={() => setFilterByRating(null)}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Clear filter: {filterByRating} stars ×
            </button>
          )}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
          <option value="rating">Highest Rating</option>
        </select>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">
            {filterByRating
              ? `No ${filterByRating}-star reviews yet`
              : 'No reviews yet. Be the first to review this course!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review: any) => {
            const isOwner = currentUserId === review.userId;
            const hasVoted = currentUserId && review.helpfulVoters?.includes(currentUserId);

            return (
              <div
                key={review.id}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {review.user?.firstName?.[0] || review.user?.username?.[0] || 'U'}
                    </div>

                    {/* User Info & Rating */}
                    <div>
                      <div className="font-medium text-gray-900">
                        {review.user?.firstName && review.user?.lastName
                          ? `${review.user.firstName} ${review.user.lastName}`
                          : review.user?.username || 'Anonymous'}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(review.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Menu (for owner) */}
                  {isOwner && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEditReview?.(review)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit review"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Comment */}
                {review.comment && (
                  <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                    {review.comment}
                  </p>
                )}

                {/* Helpful Button */}
                {currentUserId && !isOwner && (
                  <button
                    onClick={() => handleMarkHelpful(review.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      hasVoted
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <ThumbsUp
                      className={`w-4 h-4 ${hasVoted ? 'fill-current' : ''}`}
                    />
                    <span className="text-sm font-medium">
                      Helpful ({review.helpfulCount})
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {total > pageSize && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {page} of {Math.ceil(total / pageSize)}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(total / pageSize)}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
