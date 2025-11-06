'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Star, ThumbsUp, MessageSquare, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const GET_PRODUCT_REVIEWS = gql`
  query GetProductReviews($productId: ID!, $rating: Int, $limit: Int, $offset: Int) {
    productReviews(productId: $productId, rating: $rating, limit: $limit, offset: $offset) {
      reviews {
        id
        rating
        comment
        createdAt
        helpful
        user {
          id
          name
          avatar
        }
      }
      stats {
        averageRating
        totalReviews
        ratingDistribution {
          rating
          count
          percentage
        }
      }
    }
  }
`;

const CREATE_REVIEW = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      review {
        id
        rating
        comment
        createdAt
      }
    }
  }
`;

const MARK_HELPFUL = gql`
  mutation MarkReviewHelpful($reviewId: ID!) {
    markReviewHelpful(reviewId: $reviewId) {
      success
    }
  }
`;

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface RatingStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Array<{
    rating: number;
    count: number;
    percentage: number;
  }>;
}

interface ProductReviewsProps {
  productId: string;
  canReview?: boolean;
}

export function ProductReviews({ productId, canReview = false }: ProductReviewsProps) {
  const { toast } = useToast();
  const [ratingFilter, setRatingFilter] = useState<string>('ALL');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const { data, loading, refetch } = useQuery<{
    productReviews: {
      reviews: Review[];
      stats: RatingStats;
    };
  }>(GET_PRODUCT_REVIEWS, {
    variables: {
      productId,
      rating: ratingFilter === 'ALL' ? undefined : parseInt(ratingFilter),
      limit: 10,
      offset: 0,
    },
  });

  const [createReview, { loading: submitting }] = useMutation(CREATE_REVIEW, {
    onCompleted: () => {
      toast({
        title: 'Đánh giá thành công',
        description: 'Cảm ơn bạn đã đánh giá sản phẩm',
        type: 'success',
      });
      setShowReviewForm(false);
      setNewRating(5);
      setNewComment('');
      refetch();
    },
    onError: () => {
      toast({
        title: 'Lỗi',
        description: 'Không thể gửi đánh giá. Vui lòng thử lại.',
        type: 'error',
        variant: 'destructive',
      });
    },
  });

  const [markHelpful] = useMutation(MARK_HELPFUL, {
    onCompleted: () => {
      refetch();
    },
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    await createReview({
      variables: {
        input: {
          productId,
          rating: newRating,
          comment: newComment,
        },
      },
    });
  };

  const handleMarkHelpful = async (reviewId: string) => {
    await markHelpful({ variables: { reviewId } });
  };

  const reviews = data?.productReviews?.reviews || [];
  const stats = data?.productReviews?.stats;

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Đánh giá sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Average Rating */}
              <div className="text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div>
                    <div className="text-5xl font-bold text-gray-900">
                      {stats.averageRating.toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            'h-5 w-5',
                            star <= Math.round(stats.averageRating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {stats.totalReviews} đánh giá
                    </p>
                  </div>
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const dist = stats.ratingDistribution.find(
                    (d) => d.rating === rating
                  );
                  const percentage = dist?.percentage || 0;
                  const count = dist?.count || 0;

                  return (
                    <div key={rating} className="flex items-center gap-2">
                      <div className="flex items-center gap-1 w-16">
                        <span className="text-sm font-medium">{rating}</span>
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      </div>
                      <Progress value={percentage} className="flex-1 h-2" />
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Form */}
      {canReview && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Viết đánh giá</CardTitle>
              {!showReviewForm && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReviewForm(true)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Đánh giá
                </Button>
              )}
            </div>
          </CardHeader>
          {showReviewForm && (
            <CardContent>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Star Rating */}
                <div>
                  <Label>Đánh giá của bạn</Label>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="focus:outline-none focus:ring-2 focus:ring-primary rounded"
                      >
                        <Star
                          className={cn(
                            'h-8 w-8 transition-colors',
                            star <= newRating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200 hover:fill-yellow-200 hover:text-yellow-200'
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <Label htmlFor="comment">Nhận xét (tùy chọn)</Label>
                  <Textarea
                    id="comment"
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                    className="mt-2"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowReviewForm(false);
                      setNewRating(5);
                      setNewComment('');
                    }}
                  >
                    Hủy
                  </Button>
                </div>
              </form>
            </CardContent>
          )}
        </Card>
      )}

      {/* Reviews Filter */}
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-gray-500" />
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc theo sao" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả đánh giá</SelectItem>
            <SelectItem value="5">5 sao</SelectItem>
            <SelectItem value="4">4 sao</SelectItem>
            <SelectItem value="3">3 sao</SelectItem>
            <SelectItem value="2">2 sao</SelectItem>
            <SelectItem value="1">1 sao</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">Đang tải...</p>
            </CardContent>
          </Card>
        ) : reviews.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">
                {ratingFilter === 'ALL'
                  ? 'Chưa có đánh giá nào'
                  : 'Không có đánh giá phù hợp'}
              </p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  {/* Avatar */}
                  <Avatar className="flex-shrink-0">
                    <AvatarImage src={review.user.avatar} />
                    <AvatarFallback>
                      {review.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* User & Rating */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <div>
                        <p className="font-medium text-gray-900">
                          {review.user.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  'h-4 w-4',
                                  star <= review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-gray-200 text-gray-200'
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(review.createdAt), {
                              addSuffix: true,
                              locale: vi,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Comment */}
                    {review.comment && (
                      <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                        {review.comment}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-4 mt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-gray-600 hover:text-primary"
                        onClick={() => handleMarkHelpful(review.id)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1.5" />
                        <span className="text-xs">
                          Hữu ích ({review.helpful})
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
