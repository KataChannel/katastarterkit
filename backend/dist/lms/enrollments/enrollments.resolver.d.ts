import { EnrollmentsService } from './enrollments.service';
import { EnrollCourseInput } from './dto/enroll-course.input';
export declare class EnrollmentsResolver {
    private readonly enrollmentsService;
    constructor(enrollmentsService: EnrollmentsService);
    enrollCourse(user: any, enrollCourseInput: EnrollCourseInput): Promise<{
        course: {
            level: import("@prisma/client").$Enums.CourseLevel;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.CourseStatus;
            title: string;
            slug: string;
            description: string | null;
            thumbnail: string | null;
            price: number;
            duration: number | null;
            whatYouWillLearn: string[];
            requirements: string[];
            categoryId: string | null;
            instructorId: string;
            rating: number;
            reviewCount: number;
            enrollmentCount: number;
            avgRating: number;
        };
    } & {
        id: string;
        userId: string;
        courseId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        progress: number;
        enrolledAt: Date;
        completedAt: Date | null;
    }>;
    getMyEnrollments(user: any): Promise<({
        course: {
            category: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
                description: string | null;
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
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.CourseStatus;
            title: string;
            slug: string;
            description: string | null;
            thumbnail: string | null;
            price: number;
            duration: number | null;
            whatYouWillLearn: string[];
            requirements: string[];
            categoryId: string | null;
            instructorId: string;
            rating: number;
            reviewCount: number;
            enrollmentCount: number;
            avgRating: number;
        };
    } & {
        id: string;
        userId: string;
        courseId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        progress: number;
        enrolledAt: Date;
        completedAt: Date | null;
    })[]>;
    getEnrollment(user: any, courseId: string): Promise<{
        course: {
            modules: ({
                lessons: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                    description: string | null;
                    duration: number | null;
                    type: import("@prisma/client").$Enums.LessonType;
                    content: string | null;
                    order: number;
                    moduleId: string;
                }[];
            } & {
                id: string;
                courseId: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string | null;
                order: number;
            })[];
        } & {
            level: import("@prisma/client").$Enums.CourseLevel;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.CourseStatus;
            title: string;
            slug: string;
            description: string | null;
            thumbnail: string | null;
            price: number;
            duration: number | null;
            whatYouWillLearn: string[];
            requirements: string[];
            categoryId: string | null;
            instructorId: string;
            rating: number;
            reviewCount: number;
            enrollmentCount: number;
            avgRating: number;
        };
        lessonProgress: ({
            lesson: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string | null;
                duration: number | null;
                type: import("@prisma/client").$Enums.LessonType;
                content: string | null;
                order: number;
                moduleId: string;
            };
        } & {
            id: string;
            enrollmentId: string;
            createdAt: Date;
            updatedAt: Date;
            completedAt: Date | null;
            lessonId: string;
            completed: boolean;
        })[];
    } & {
        id: string;
        userId: string;
        courseId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        progress: number;
        enrolledAt: Date;
        completedAt: Date | null;
    }>;
    dropCourse(user: any, courseId: string): Promise<{
        id: string;
        userId: string;
        courseId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        progress: number;
        enrolledAt: Date;
        completedAt: Date | null;
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
        courseId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        progress: number;
        enrolledAt: Date;
        completedAt: Date | null;
    })[]>;
    markLessonComplete(user: any, enrollmentId: string, lessonId: string): Promise<{
        id: string;
        enrollmentId: string;
        createdAt: Date;
        updatedAt: Date;
        completedAt: Date | null;
        lessonId: string;
        completed: boolean;
    }>;
}
