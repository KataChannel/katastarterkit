import { EnrollmentsService } from './enrollments.service';
import { EnrollCourseInput } from './dto/enroll-course.input';
export declare class EnrollmentsResolver {
    private readonly enrollmentsService;
    constructor(enrollmentsService: EnrollmentsService);
    enrollCourse(user: any, enrollCourseInput: EnrollCourseInput): Promise<{
        course: {
            createdAt: Date;
            id: string;
            updatedAt: Date;
            level: import(".prisma/client").$Enums.CourseLevel;
            title: string;
            slug: string;
            status: import(".prisma/client").$Enums.CourseStatus;
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
        userId: string;
        id: string;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        completedAt: Date | null;
        progress: number;
        courseId: string;
        enrolledAt: Date;
    }>;
    getMyEnrollments(user: any): Promise<({
        course: {
            category: {
                createdAt: Date;
                name: string;
                id: string;
                updatedAt: Date;
                slug: string;
                parentId: string | null;
                description: string | null;
                icon: string | null;
            };
            instructor: {
                username: string;
                firstName: string;
                lastName: string;
                avatar: string;
                id: string;
            };
        } & {
            createdAt: Date;
            id: string;
            updatedAt: Date;
            level: import(".prisma/client").$Enums.CourseLevel;
            title: string;
            slug: string;
            status: import(".prisma/client").$Enums.CourseStatus;
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
        userId: string;
        id: string;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        completedAt: Date | null;
        progress: number;
        courseId: string;
        enrolledAt: Date;
    })[]>;
    getEnrollment(user: any, courseId: string): Promise<{
        course: {
            modules: ({
                lessons: {
                    type: import(".prisma/client").$Enums.LessonType;
                    createdAt: Date;
                    id: string;
                    updatedAt: Date;
                    title: string;
                    content: string | null;
                    description: string | null;
                    duration: number | null;
                    order: number;
                    moduleId: string;
                }[];
            } & {
                createdAt: Date;
                id: string;
                updatedAt: Date;
                title: string;
                description: string | null;
                order: number;
                courseId: string;
            })[];
        } & {
            createdAt: Date;
            id: string;
            updatedAt: Date;
            level: import(".prisma/client").$Enums.CourseLevel;
            title: string;
            slug: string;
            status: import(".prisma/client").$Enums.CourseStatus;
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
                type: import(".prisma/client").$Enums.LessonType;
                createdAt: Date;
                id: string;
                updatedAt: Date;
                title: string;
                content: string | null;
                description: string | null;
                duration: number | null;
                order: number;
                moduleId: string;
            };
        } & {
            createdAt: Date;
            id: string;
            updatedAt: Date;
            completedAt: Date | null;
            enrollmentId: string;
            lessonId: string;
            completed: boolean;
        })[];
    } & {
        userId: string;
        id: string;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        completedAt: Date | null;
        progress: number;
        courseId: string;
        enrolledAt: Date;
    }>;
    dropCourse(user: any, courseId: string): Promise<{
        userId: string;
        id: string;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        completedAt: Date | null;
        progress: number;
        courseId: string;
        enrolledAt: Date;
    }>;
    getCourseEnrollments(user: any, courseId: string): Promise<({
        user: {
            email: string;
            username: string;
            firstName: string;
            lastName: string;
            avatar: string;
            id: string;
        };
    } & {
        userId: string;
        id: string;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        completedAt: Date | null;
        progress: number;
        courseId: string;
        enrolledAt: Date;
    })[]>;
    markLessonComplete(user: any, enrollmentId: string, lessonId: string): Promise<{
        createdAt: Date;
        id: string;
        updatedAt: Date;
        completedAt: Date | null;
        enrollmentId: string;
        lessonId: string;
        completed: boolean;
    }>;
}
