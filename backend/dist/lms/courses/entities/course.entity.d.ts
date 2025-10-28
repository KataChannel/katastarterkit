import { CourseLevel, CourseStatus } from '@prisma/client';
export declare class Course {
    id: string;
    title: string;
    slug: string;
    description?: string;
    thumbnail?: string;
    trailer?: string;
    price: number;
    level: CourseLevel;
    status: CourseStatus;
    duration?: number;
    metaTitle?: string;
    metaDescription?: string;
    tags: string[];
    categoryId?: string;
    enrollmentCount: number;
    rating: number;
    avgRating: number;
    reviewCount: number;
    instructorId: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
}
