import { PrismaService } from '../../prisma/prisma.service';
export declare class EnrollmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    enroll(userId: string, courseId: string): Promise<{
        course: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            description: string | null;
            status: import("@prisma/client").$Enums.CourseStatus;
            publishedAt: Date | null;
            level: import("@prisma/client").$Enums.CourseLevel;
            thumbnail: string | null;
            trailer: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            duration: number | null;
            language: string | null;
            whatYouWillLearn: string[];
            requirements: string[];
            targetAudience: string[];
            avgRating: number;
            reviewCount: number;
            enrollmentCount: number;
            viewCount: number;
            metaTitle: string | null;
            metaDescription: string | null;
            tags: string[];
            categoryId: string | null;
            instructorId: string;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        courseId: string;
        progress: number;
        userId: string;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentMethod: string | null;
        expiresAt: Date | null;
        enrolledAt: Date;
        completedAt: Date | null;
        lastAccessedAt: Date | null;
    }>;
    getMyEnrollments(userId: string): Promise<({
        course: {
            category: {
                id: string;
                parentId: string | null;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                description: string | null;
                name: string;
                icon: string | null;
            };
            instructor: {
                id: string;
                username: string;
                firstName: string;
                lastName: string;
                avatar: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            description: string | null;
            status: import("@prisma/client").$Enums.CourseStatus;
            publishedAt: Date | null;
            level: import("@prisma/client").$Enums.CourseLevel;
            thumbnail: string | null;
            trailer: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            duration: number | null;
            language: string | null;
            whatYouWillLearn: string[];
            requirements: string[];
            targetAudience: string[];
            avgRating: number;
            reviewCount: number;
            enrollmentCount: number;
            viewCount: number;
            metaTitle: string | null;
            metaDescription: string | null;
            tags: string[];
            categoryId: string | null;
            instructorId: string;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        courseId: string;
        progress: number;
        userId: string;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentMethod: string | null;
        expiresAt: Date | null;
        enrolledAt: Date;
        completedAt: Date | null;
        lastAccessedAt: Date | null;
    })[]>;
    getEnrollment(userId: string, courseId: string): Promise<{
        course: {
            modules: ({
                lessons: {
                    id: string;
                    type: import("@prisma/client").$Enums.LessonType;
                    content: string | null;
                    order: number;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                    description: string | null;
                    duration: number | null;
                    moduleId: string;
                    isPreview: boolean;
                    isFree: boolean;
                    attachments: import("@prisma/client/runtime/library").JsonValue | null;
                }[];
            } & {
                id: string;
                order: number;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string | null;
                courseId: string;
                isPublished: boolean;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            description: string | null;
            status: import("@prisma/client").$Enums.CourseStatus;
            publishedAt: Date | null;
            level: import("@prisma/client").$Enums.CourseLevel;
            thumbnail: string | null;
            trailer: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            duration: number | null;
            language: string | null;
            whatYouWillLearn: string[];
            requirements: string[];
            targetAudience: string[];
            avgRating: number;
            reviewCount: number;
            enrollmentCount: number;
            viewCount: number;
            metaTitle: string | null;
            metaDescription: string | null;
            tags: string[];
            categoryId: string | null;
            instructorId: string;
        };
        lessonProgress: ({
            lesson: {
                id: string;
                type: import("@prisma/client").$Enums.LessonType;
                content: string | null;
                order: number;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string | null;
                duration: number | null;
                moduleId: string;
                isPreview: boolean;
                isFree: boolean;
                attachments: import("@prisma/client/runtime/library").JsonValue | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            completedAt: Date | null;
            enrollmentId: string;
            lessonId: string;
            completed: boolean;
            watchTime: number | null;
        })[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        courseId: string;
        progress: number;
        userId: string;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentMethod: string | null;
        expiresAt: Date | null;
        enrolledAt: Date;
        completedAt: Date | null;
        lastAccessedAt: Date | null;
    }>;
    updateProgress(userId: string, courseId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        courseId: string;
        progress: number;
        userId: string;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentMethod: string | null;
        expiresAt: Date | null;
        enrolledAt: Date;
        completedAt: Date | null;
        lastAccessedAt: Date | null;
    }>;
    dropCourse(userId: string, courseId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        courseId: string;
        progress: number;
        userId: string;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentMethod: string | null;
        expiresAt: Date | null;
        enrolledAt: Date;
        completedAt: Date | null;
        lastAccessedAt: Date | null;
    }>;
    getCourseEnrollments(courseId: string, instructorId?: string): Promise<({
        user: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
            avatar: string;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        courseId: string;
        progress: number;
        userId: string;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentMethod: string | null;
        expiresAt: Date | null;
        enrolledAt: Date;
        completedAt: Date | null;
        lastAccessedAt: Date | null;
    })[]>;
    markLessonComplete(userId: string, enrollmentId: string, lessonId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        completedAt: Date | null;
        enrollmentId: string;
        lessonId: string;
        completed: boolean;
        watchTime: number | null;
    }>;
    private updateEnrollmentProgress;
}
