import { PrismaService } from '../../prisma/prisma.service';
export declare class EnrollmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    enroll(userId: string, courseId: string): Promise<{
        course: {
            level: import("@prisma/client").$Enums.CourseLevel;
            id: string;
            slug: string;
            title: string;
            description: string | null;
            status: import("@prisma/client").$Enums.CourseStatus;
            createdAt: Date;
            updatedAt: Date;
            publishedAt: Date | null;
            thumbnail: string | null;
            trailer: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            duration: number | null;
            language: string | null;
            whatYouWillLearn: string[];
            requirements: string[];
            targetAudience: string[];
            categoryId: string | null;
            instructorId: string;
            avgRating: number;
            reviewCount: number;
            enrollmentCount: number;
            viewCount: number;
            metaTitle: string | null;
            metaDescription: string | null;
            tags: string[];
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        courseId: string;
        progress: number;
        expiresAt: Date | null;
        userId: string;
        completedAt: Date | null;
        paymentMethod: string | null;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        enrolledAt: Date;
        lastAccessedAt: Date | null;
    }>;
    getMyEnrollments(userId: string): Promise<({
        course: {
            category: {
                id: string;
                slug: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                parentId: string | null;
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
            level: import("@prisma/client").$Enums.CourseLevel;
            id: string;
            slug: string;
            title: string;
            description: string | null;
            status: import("@prisma/client").$Enums.CourseStatus;
            createdAt: Date;
            updatedAt: Date;
            publishedAt: Date | null;
            thumbnail: string | null;
            trailer: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            duration: number | null;
            language: string | null;
            whatYouWillLearn: string[];
            requirements: string[];
            targetAudience: string[];
            categoryId: string | null;
            instructorId: string;
            avgRating: number;
            reviewCount: number;
            enrollmentCount: number;
            viewCount: number;
            metaTitle: string | null;
            metaDescription: string | null;
            tags: string[];
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        courseId: string;
        progress: number;
        expiresAt: Date | null;
        userId: string;
        completedAt: Date | null;
        paymentMethod: string | null;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        enrolledAt: Date;
        lastAccessedAt: Date | null;
    })[]>;
    getEnrollment(userId: string, courseId: string): Promise<{
        course: {
            modules: ({
                lessons: {
                    id: string;
                    title: string;
                    description: string | null;
                    content: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    type: import("@prisma/client").$Enums.LessonType;
                    order: number;
                    duration: number | null;
                    moduleId: string;
                    isPreview: boolean;
                    isFree: boolean;
                    attachments: import("@prisma/client/runtime/library").JsonValue | null;
                }[];
            } & {
                id: string;
                title: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                order: number;
                isPublished: boolean;
                courseId: string;
            })[];
        } & {
            level: import("@prisma/client").$Enums.CourseLevel;
            id: string;
            slug: string;
            title: string;
            description: string | null;
            status: import("@prisma/client").$Enums.CourseStatus;
            createdAt: Date;
            updatedAt: Date;
            publishedAt: Date | null;
            thumbnail: string | null;
            trailer: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            duration: number | null;
            language: string | null;
            whatYouWillLearn: string[];
            requirements: string[];
            targetAudience: string[];
            categoryId: string | null;
            instructorId: string;
            avgRating: number;
            reviewCount: number;
            enrollmentCount: number;
            viewCount: number;
            metaTitle: string | null;
            metaDescription: string | null;
            tags: string[];
        };
        lessonProgress: ({
            lesson: {
                id: string;
                title: string;
                description: string | null;
                content: string | null;
                createdAt: Date;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.LessonType;
                order: number;
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
            lessonId: string;
            completedAt: Date | null;
            completed: boolean;
            enrollmentId: string;
            watchTime: number | null;
        })[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        courseId: string;
        progress: number;
        expiresAt: Date | null;
        userId: string;
        completedAt: Date | null;
        paymentMethod: string | null;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        enrolledAt: Date;
        lastAccessedAt: Date | null;
    }>;
    updateProgress(userId: string, courseId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        courseId: string;
        progress: number;
        expiresAt: Date | null;
        userId: string;
        completedAt: Date | null;
        paymentMethod: string | null;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        enrolledAt: Date;
        lastAccessedAt: Date | null;
    }>;
    dropCourse(userId: string, courseId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        courseId: string;
        progress: number;
        expiresAt: Date | null;
        userId: string;
        completedAt: Date | null;
        paymentMethod: string | null;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        enrolledAt: Date;
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
        expiresAt: Date | null;
        userId: string;
        completedAt: Date | null;
        paymentMethod: string | null;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        enrolledAt: Date;
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
