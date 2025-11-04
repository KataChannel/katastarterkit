import { EnrollmentsService } from './enrollments.service';
import { EnrollCourseInput } from './dto/enroll-course.input';
export declare class EnrollmentsResolver {
    private readonly enrollmentsService;
    constructor(enrollmentsService: EnrollmentsService);
    enrollCourse(user: any, enrollCourseInput: EnrollCourseInput): Promise<{
        course: {
            level: import("@prisma/client").$Enums.CourseLevel;
            id: string;
            title: string;
            slug: string;
            description: string | null;
            thumbnail: string | null;
            trailer: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            status: import("@prisma/client").$Enums.CourseStatus;
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
            createdAt: Date;
            updatedAt: Date;
            publishedAt: Date | null;
            categoryId: string | null;
            instructorId: string;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        courseId: string;
        progress: number;
        userId: string;
        enrolledAt: Date;
        completedAt: Date | null;
        expiresAt: Date | null;
        lastAccessedAt: Date | null;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentMethod: string | null;
    }>;
    getMyEnrollments(user: any): Promise<({
        course: {
            category: {
                id: string;
                slug: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                icon: string | null;
                parentId: string | null;
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
            title: string;
            slug: string;
            description: string | null;
            thumbnail: string | null;
            trailer: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            status: import("@prisma/client").$Enums.CourseStatus;
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
            createdAt: Date;
            updatedAt: Date;
            publishedAt: Date | null;
            categoryId: string | null;
            instructorId: string;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        courseId: string;
        progress: number;
        userId: string;
        enrolledAt: Date;
        completedAt: Date | null;
        expiresAt: Date | null;
        lastAccessedAt: Date | null;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentMethod: string | null;
    })[]>;
    getEnrollment(user: any, courseId: string): Promise<{
        course: {
            modules: ({
                lessons: {
                    id: string;
                    title: string;
                    description: string | null;
                    duration: number | null;
                    createdAt: Date;
                    updatedAt: Date;
                    order: number;
                    type: import("@prisma/client").$Enums.LessonType;
                    content: string | null;
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
                courseId: string;
                isPublished: boolean;
            })[];
        } & {
            level: import("@prisma/client").$Enums.CourseLevel;
            id: string;
            title: string;
            slug: string;
            description: string | null;
            thumbnail: string | null;
            trailer: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            status: import("@prisma/client").$Enums.CourseStatus;
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
            createdAt: Date;
            updatedAt: Date;
            publishedAt: Date | null;
            categoryId: string | null;
            instructorId: string;
        };
        lessonProgress: ({
            lesson: {
                id: string;
                title: string;
                description: string | null;
                duration: number | null;
                createdAt: Date;
                updatedAt: Date;
                order: number;
                type: import("@prisma/client").$Enums.LessonType;
                content: string | null;
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
            enrollmentId: string;
            completed: boolean;
            watchTime: number | null;
        })[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        courseId: string;
        progress: number;
        userId: string;
        enrolledAt: Date;
        completedAt: Date | null;
        expiresAt: Date | null;
        lastAccessedAt: Date | null;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentMethod: string | null;
    }>;
    dropCourse(user: any, courseId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        courseId: string;
        progress: number;
        userId: string;
        enrolledAt: Date;
        completedAt: Date | null;
        expiresAt: Date | null;
        lastAccessedAt: Date | null;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentMethod: string | null;
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
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        courseId: string;
        progress: number;
        userId: string;
        enrolledAt: Date;
        completedAt: Date | null;
        expiresAt: Date | null;
        lastAccessedAt: Date | null;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentMethod: string | null;
    })[]>;
    markLessonComplete(user: any, enrollmentId: string, lessonId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lessonId: string;
        completedAt: Date | null;
        enrollmentId: string;
        completed: boolean;
        watchTime: number | null;
    }>;
}
