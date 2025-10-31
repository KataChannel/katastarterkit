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
    createReview(userId: string, input: CreateReviewInput): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            avatar: string;
        };
        product: {
            id: string;
            name: string;
            slug: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        rating: number;
        guestEmail: string | null;
        guestName: string | null;
        orderId: string | null;
        productId: string;
        images: string[];
        title: string | null;
        comment: string | null;
        helpfulCount: number;
        isVerifiedPurchase: boolean;
        isApproved: boolean;
        moderatedBy: string | null;
        moderatedAt: Date | null;
    }>;
    getReviews(input: GetReviewsInput): Promise<{
        items: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                avatar: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            rating: number;
            guestEmail: string | null;
            guestName: string | null;
            orderId: string | null;
            productId: string;
            images: string[];
            title: string | null;
            comment: string | null;
            helpfulCount: number;
            isVerifiedPurchase: boolean;
            isApproved: boolean;
            moderatedBy: string | null;
            moderatedAt: Date | null;
        })[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
        hasMore: boolean;
    }>;
    getReviewById(id: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            avatar: string;
        };
        product: {
            id: string;
            name: string;
            slug: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        rating: number;
        guestEmail: string | null;
        guestName: string | null;
        orderId: string | null;
        productId: string;
        images: string[];
        title: string | null;
        comment: string | null;
        helpfulCount: number;
        isVerifiedPurchase: boolean;
        isApproved: boolean;
        moderatedBy: string | null;
        moderatedAt: Date | null;
    }>;
    updateReview(reviewId: string, userId: string, input: UpdateReviewInput): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            avatar: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        rating: number;
        guestEmail: string | null;
        guestName: string | null;
        orderId: string | null;
        productId: string;
        images: string[];
        title: string | null;
        comment: string | null;
        helpfulCount: number;
        isVerifiedPurchase: boolean;
        isApproved: boolean;
        moderatedBy: string | null;
        moderatedAt: Date | null;
    }>;
    deleteReview(reviewId: string, userId: string, isAdmin?: boolean): Promise<{
        success: boolean;
        message: string;
    }>;
    markHelpful(userId: string, input: ReviewHelpfulInput): Promise<{
        success: boolean;
        helpfulCount: number;
    }>;
    getProductRatingSummary(productId: string): Promise<{
        averageRating: number;
        totalReviews: number;
        ratingDistribution: {
            rating5: number;
            rating4: number;
            rating3: number;
            rating2: number;
            rating1: number;
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
