import { EnrollmentsService } from './enrollments.service';
import { EnrollCourseInput } from './dto/enroll-course.input';
export declare class EnrollmentsResolver {
    private readonly enrollmentsService;
    constructor(enrollmentsService: EnrollmentsService);
    enrollCourse(user: any, enrollCourseInput: EnrollCourseInput): Promise<{
        course: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            level: import("@prisma/client").$Enums.CourseLevel;
            status: import("@prisma/client").$Enums.CourseStatus;
            tags: string[];
            description: string | null;
            thumbnail: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            slug: string;
            categoryId: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
            viewCount: number;
            publishedAt: Date | null;
            title: string;
            duration: number | null;
            trailer: string | null;
            language: string | null;
            whatYouWillLearn: string[];
            requirements: string[];
            targetAudience: string[];
            instructorId: string;
            avgRating: number;
            reviewCount: number;
            enrollmentCount: number;
        };
    } & {
        id: string;
        userId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        paymentMethod: string | null;
        courseId: string;
        progress: number;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        expiresAt: Date | null;
        enrolledAt: Date;
        completedAt: Date | null;
        lastAccessedAt: Date | null;
    }>;
    getMyEnrollments(user: any): Promise<({
        course: {
            category: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                slug: string;
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            level: import("@prisma/client").$Enums.CourseLevel;
            status: import("@prisma/client").$Enums.CourseStatus;
            tags: string[];
            description: string | null;
            thumbnail: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            slug: string;
            categoryId: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
            viewCount: number;
            publishedAt: Date | null;
            title: string;
            duration: number | null;
            trailer: string | null;
            language: string | null;
            whatYouWillLearn: string[];
            requirements: string[];
            targetAudience: string[];
            instructorId: string;
            avgRating: number;
            reviewCount: number;
            enrollmentCount: number;
        };
    } & {
        id: string;
        userId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        paymentMethod: string | null;
        courseId: string;
        progress: number;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        expiresAt: Date | null;
        enrolledAt: Date;
        completedAt: Date | null;
        lastAccessedAt: Date | null;
    })[]>;
    getEnrollment(user: any, courseId: string): Promise<{
        course: {
            modules: ({
                lessons: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    attachments: import("@prisma/client/runtime/library").JsonValue | null;
                    content: string | null;
                    description: string | null;
                    order: number;
                    title: string;
                    type: import("@prisma/client").$Enums.LessonType;
                    duration: number | null;
                    moduleId: string;
                    isPreview: boolean;
                    isFree: boolean;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                order: number;
                title: string;
                courseId: string;
                isPublished: boolean;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            level: import("@prisma/client").$Enums.CourseLevel;
            status: import("@prisma/client").$Enums.CourseStatus;
            tags: string[];
            description: string | null;
            thumbnail: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            slug: string;
            categoryId: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
            viewCount: number;
            publishedAt: Date | null;
            title: string;
            duration: number | null;
            trailer: string | null;
            language: string | null;
            whatYouWillLearn: string[];
            requirements: string[];
            targetAudience: string[];
            instructorId: string;
            avgRating: number;
            reviewCount: number;
            enrollmentCount: number;
        };
        lessonProgress: ({
            lesson: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                attachments: import("@prisma/client/runtime/library").JsonValue | null;
                content: string | null;
                description: string | null;
                order: number;
                title: string;
                type: import("@prisma/client").$Enums.LessonType;
                duration: number | null;
                moduleId: string;
                isPreview: boolean;
                isFree: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            lessonId: string;
            enrollmentId: string;
            completedAt: Date | null;
            completed: boolean;
            watchTime: number | null;
        })[];
    } & {
        id: string;
        userId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        paymentMethod: string | null;
        courseId: string;
        progress: number;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        expiresAt: Date | null;
        enrolledAt: Date;
        completedAt: Date | null;
        lastAccessedAt: Date | null;
    }>;
    dropCourse(user: any, courseId: string): Promise<{
        id: string;
        userId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        paymentMethod: string | null;
        courseId: string;
        progress: number;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        expiresAt: Date | null;
        enrolledAt: Date;
        completedAt: Date | null;
        lastAccessedAt: Date | null;
    }>;
    getCourseEnrollments(user: any, courseId: string): Promise<({
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
        userId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        paymentMethod: string | null;
        courseId: string;
        progress: number;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        expiresAt: Date | null;
        enrolledAt: Date;
        completedAt: Date | null;
        lastAccessedAt: Date | null;
    })[]>;
    markLessonComplete(user: any, enrollmentId: string, lessonId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lessonId: string;
        enrollmentId: string;
        completedAt: Date | null;
        completed: boolean;
        watchTime: number | null;
    }>;
}
