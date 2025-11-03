import { PrismaService } from '../../prisma/prisma.service';
export declare class EnrollmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    enroll(userId: string, courseId: string): Promise<{
        course: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            level: import("@prisma/client").$Enums.CourseLevel;
            description: string | null;
            title: string;
            slug: string;
            status: import("@prisma/client").$Enums.CourseStatus;
            publishedAt: Date | null;
            tags: string[];
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
            categoryId: string | null;
            instructorId: string;
        };
    } & {
        id: string;
        expiresAt: Date | null;
        userId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        courseId: string;
        progress: number;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentMethod: string | null;
        enrolledAt: Date;
        completedAt: Date | null;
        lastAccessedAt: Date | null;
    }>;
    getMyEnrollments(userId: string): Promise<({
        course: {
            category: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                parentId: string | null;
                slug: string;
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
            level: import("@prisma/client").$Enums.CourseLevel;
            description: string | null;
            title: string;
            slug: string;
            status: import("@prisma/client").$Enums.CourseStatus;
            publishedAt: Date | null;
            tags: string[];
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
            categoryId: string | null;
            instructorId: string;
        };
    } & {
        id: string;
        expiresAt: Date | null;
        userId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        courseId: string;
        progress: number;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentMethod: string | null;
        enrolledAt: Date;
        completedAt: Date | null;
        lastAccessedAt: Date | null;
    })[]>;
    getEnrollment(userId: string, courseId: string): Promise<{
        course: {
            modules: ({
                lessons: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    title: string;
                    content: string | null;
                    type: import("@prisma/client").$Enums.LessonType;
                    order: number;
                    duration: number | null;
                    isPreview: boolean;
                    isFree: boolean;
                    attachments: import("@prisma/client/runtime/library").JsonValue | null;
                    moduleId: string;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                title: string;
                order: number;
                isPublished: boolean;
                courseId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            level: import("@prisma/client").$Enums.CourseLevel;
            description: string | null;
            title: string;
            slug: string;
            status: import("@prisma/client").$Enums.CourseStatus;
            publishedAt: Date | null;
            tags: string[];
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
            categoryId: string | null;
            instructorId: string;
        };
        lessonProgress: ({
            lesson: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                title: string;
                content: string | null;
                type: import("@prisma/client").$Enums.LessonType;
                order: number;
                duration: number | null;
                isPreview: boolean;
                isFree: boolean;
                attachments: import("@prisma/client/runtime/library").JsonValue | null;
                moduleId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            lessonId: string;
            completedAt: Date | null;
            completed: boolean;
            enrollmentId: string;
            watchTime: number | null;
        })[];
    } & {
        id: string;
        expiresAt: Date | null;
        userId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        courseId: string;
        progress: number;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentMethod: string | null;
        enrolledAt: Date;
        completedAt: Date | null;
        lastAccessedAt: Date | null;
    }>;
    updateProgress(userId: string, courseId: string): Promise<{
        id: string;
        expiresAt: Date | null;
        userId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        courseId: string;
        progress: number;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentMethod: string | null;
        enrolledAt: Date;
        completedAt: Date | null;
        lastAccessedAt: Date | null;
    }>;
    dropCourse(userId: string, courseId: string): Promise<{
        id: string;
        expiresAt: Date | null;
        userId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        courseId: string;
        progress: number;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentMethod: string | null;
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
        expiresAt: Date | null;
        userId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        courseId: string;
        progress: number;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentMethod: string | null;
        enrolledAt: Date;
        completedAt: Date | null;
        lastAccessedAt: Date | null;
    })[]>;
    markLessonComplete(userId: string, enrollmentId: string, lessonId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lessonId: string;
        completedAt: Date | null;
        completed: boolean;
        enrollmentId: string;
        watchTime: number | null;
    }>;
    private updateEnrollmentProgress;
}
