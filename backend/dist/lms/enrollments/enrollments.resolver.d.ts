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
            description: string | null;
            status: import("@prisma/client").$Enums.CourseStatus;
            title: string;
            slug: string;
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
                description: string | null;
                slug: string;
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
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            status: import("@prisma/client").$Enums.CourseStatus;
            title: string;
            slug: string;
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
                    description: string | null;
                    title: string;
                    duration: number | null;
                    order: number;
                    type: import("@prisma/client").$Enums.LessonType;
                    content: string | null;
                    moduleId: string;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                courseId: string;
                title: string;
                order: number;
            })[];
        } & {
            level: import("@prisma/client").$Enums.CourseLevel;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            status: import("@prisma/client").$Enums.CourseStatus;
            title: string;
            slug: string;
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
                description: string | null;
                title: string;
                duration: number | null;
                order: number;
                type: import("@prisma/client").$Enums.LessonType;
                content: string | null;
                moduleId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            completedAt: Date | null;
            enrollmentId: string;
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
        createdAt: Date;
        updatedAt: Date;
        completedAt: Date | null;
        enrollmentId: string;
        lessonId: string;
        completed: boolean;
    }>;
}
