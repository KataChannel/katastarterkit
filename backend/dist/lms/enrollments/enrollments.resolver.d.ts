import { EnrollmentsService } from './enrollments.service';
import { EnrollCourseInput } from './dto/enroll-course.input';
export declare class EnrollmentsResolver {
    private readonly enrollmentsService;
    constructor(enrollmentsService: EnrollmentsService);
    enrollCourse(user: any, enrollCourseInput: EnrollCourseInput): Promise<{
        course: {
            level: import("@prisma/client").$Enums.CourseLevel;
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            title: string;
            status: import("@prisma/client").$Enums.CourseStatus;
            tags: string[];
            duration: number | null;
            viewCount: number;
            categoryId: string | null;
            slug: string;
            publishedAt: Date | null;
            metaTitle: string | null;
            metaDescription: string | null;
            thumbnail: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
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
        completedAt: Date | null;
        expiresAt: Date | null;
        progress: number;
        paymentMethod: string | null;
        courseId: string;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        enrolledAt: Date;
        lastAccessedAt: Date | null;
    }>;
    getMyEnrollments(user: any): Promise<({
        course: {
            category: {
                name: string;
                description: string | null;
                id: string;
                updatedAt: Date;
                createdAt: Date;
                parentId: string | null;
                icon: string | null;
                slug: string;
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
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            title: string;
            status: import("@prisma/client").$Enums.CourseStatus;
            tags: string[];
            duration: number | null;
            viewCount: number;
            categoryId: string | null;
            slug: string;
            publishedAt: Date | null;
            metaTitle: string | null;
            metaDescription: string | null;
            thumbnail: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
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
        completedAt: Date | null;
        expiresAt: Date | null;
        progress: number;
        paymentMethod: string | null;
        courseId: string;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        enrolledAt: Date;
        lastAccessedAt: Date | null;
    })[]>;
    getEnrollment(user: any, courseId: string): Promise<{
        course: {
            modules: ({
                lessons: {
                    order: number;
                    description: string | null;
                    type: import("@prisma/client").$Enums.LessonType;
                    id: string;
                    updatedAt: Date;
                    content: string | null;
                    createdAt: Date;
                    title: string;
                    duration: number | null;
                    moduleId: string;
                    isPreview: boolean;
                    isFree: boolean;
                    attachments: import("@prisma/client/runtime/library").JsonValue | null;
                }[];
            } & {
                order: number;
                description: string | null;
                id: string;
                updatedAt: Date;
                createdAt: Date;
                title: string;
                isPublished: boolean;
                courseId: string;
            })[];
        } & {
            level: import("@prisma/client").$Enums.CourseLevel;
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            title: string;
            status: import("@prisma/client").$Enums.CourseStatus;
            tags: string[];
            duration: number | null;
            viewCount: number;
            categoryId: string | null;
            slug: string;
            publishedAt: Date | null;
            metaTitle: string | null;
            metaDescription: string | null;
            thumbnail: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
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
                order: number;
                description: string | null;
                type: import("@prisma/client").$Enums.LessonType;
                id: string;
                updatedAt: Date;
                content: string | null;
                createdAt: Date;
                title: string;
                duration: number | null;
                moduleId: string;
                isPreview: boolean;
                isFree: boolean;
                attachments: import("@prisma/client/runtime/library").JsonValue | null;
            };
        } & {
            id: string;
            updatedAt: Date;
            createdAt: Date;
            completedAt: Date | null;
            completed: boolean;
            enrollmentId: string;
            lessonId: string;
            watchTime: number | null;
        })[];
    } & {
        id: string;
        userId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        completedAt: Date | null;
        expiresAt: Date | null;
        progress: number;
        paymentMethod: string | null;
        courseId: string;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        enrolledAt: Date;
        lastAccessedAt: Date | null;
    }>;
    dropCourse(user: any, courseId: string): Promise<{
        id: string;
        userId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        completedAt: Date | null;
        expiresAt: Date | null;
        progress: number;
        paymentMethod: string | null;
        courseId: string;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        enrolledAt: Date;
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
        completedAt: Date | null;
        expiresAt: Date | null;
        progress: number;
        paymentMethod: string | null;
        courseId: string;
        paymentAmount: import("@prisma/client/runtime/library").Decimal | null;
        enrolledAt: Date;
        lastAccessedAt: Date | null;
    })[]>;
    markLessonComplete(user: any, enrollmentId: string, lessonId: string): Promise<{
        id: string;
        updatedAt: Date;
        createdAt: Date;
        completedAt: Date | null;
        completed: boolean;
        enrollmentId: string;
        lessonId: string;
        watchTime: number | null;
    }>;
}
