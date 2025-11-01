import { PrismaService } from '../prisma/prisma.service';
export interface CreateReviewInput {
    productId: string;
    orderId?: string;
    rating: number;
    title?: string;
    comment?: string;
    images?: string[];
}
export interface UpdateReviewInput {
    rating?: number;
    title?: string;
    comment?: string;
    images?: string[];
}
export interface GetReviewsInput {
    productId?: string;
    userId?: string;
    rating?: number;
    isVerified?: boolean;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'rating' | 'helpful';
    sortOrder?: 'asc' | 'desc';
}
export interface ReviewHelpfulInput {
    reviewId: string;
    helpful: boolean;
}
export declare class ReviewService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createReview(userId: string, input: CreateReviewInput): Promise<any>;
    getReviews(input: GetReviewsInput): Promise<{
        items: any;
        total: any;
        page: number;
        pageSize: number;
        totalPages: number;
        hasMore: boolean;
    }>;
    getReviewById(id: string): Promise<any>;
    updateReview(reviewId: string, userId: string, input: UpdateReviewInput): Promise<any>;
    deleteReview(reviewId: string, userId: string, isAdmin?: boolean): Promise<{
        success: boolean;
        message: string;
    }>;
    markHelpful(userId: string, input: ReviewHelpfulInput): Promise<{
        success: boolean;
        helpfulCount: any;
    }>;
    getProductRatingSummary(productId: string): Promise<{
        averageRating: number;
        totalReviews: any;
        ratingDistribution: {
            rating5: any;
            rating4: any;
            rating3: any;
            rating2: any;
            rating1: any;
        };
    }>;
    private updateProductRatingStats;
    canReview(userId: string, productId: string): Promise<{
        canReview: boolean;
        reason: string;
        isVerifiedPurchase?: undefined;
    } | {
        canReview: boolean;
        isVerifiedPurchase: boolean;
        reason?: undefined;
    }>;
}
