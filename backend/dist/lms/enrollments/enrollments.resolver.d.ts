import { EnrollmentsService } from './enrollments.service';
import { EnrollCourseInput } from './dto/enroll-course.input';
export declare class EnrollmentsResolver {
    private readonly enrollmentsService;
    constructor(enrollmentsService: EnrollmentsService);
    enrollCourse(user: any, enrollCourseInput: EnrollCourseInput): Promise<{
        course: {
            level: import(".prisma/client").$Enums.CourseLevel;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            status: import(".prisma/client").$Enums.CourseStatus;
            description: string | null;
            thumbnail: string | null;
            price: number;
            categoryId: string | null;
            duration: number | null;
            instructorId: string;
            whatYouWillLearn: string[];
            requirements: string[];
            rating: number;
            reviewCount: number;
            enrollmentCount: number;
            avgRating: number;
        };
    } & {
        id: string;
        userId: string;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        completedAt: Date | null;
        progress: number;
        courseId: string;
        enrolledAt: Date;
    }>;
    getMyEnrollments(user: any): Promise<({
        course: {
            category: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                slug: string;
                parentId: string | null;
                description: string | null;
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
            level: import(".prisma/client").$Enums.CourseLevel;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            status: import(".prisma/client").$Enums.CourseStatus;
            description: string | null;
            thumbnail: string | null;
            price: number;
            categoryId: string | null;
            duration: number | null;
            instructorId: string;
            whatYouWillLearn: string[];
            requirements: string[];
            rating: number;
            reviewCount: number;
            enrollmentCount: number;
            avgRating: number;
        };
    } & {
        id: string;
        userId: string;
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
                    id: string;
                    createdAt: Date;
                    type: import(".prisma/client").$Enums.LessonType;
                    updatedAt: Date;
                    title: string;
                    content: string | null;
                    description: string | null;
                    order: number;
                    duration: number | null;
                    moduleId: string;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string | null;
                order: number;
                courseId: string;
            })[];
        } & {
            level: import(".prisma/client").$Enums.CourseLevel;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            status: import(".prisma/client").$Enums.CourseStatus;
            description: string | null;
            thumbnail: string | null;
            price: number;
            categoryId: string | null;
            duration: number | null;
            instructorId: string;
            whatYouWillLearn: string[];
            requirements: string[];
            rating: number;
            reviewCount: number;
            enrollmentCount: number;
            avgRating: number;
        };
        lessonProgress: ({
            lesson: {
                id: string;
                createdAt: Date;
                type: import(".prisma/client").$Enums.LessonType;
                updatedAt: Date;
                title: string;
                content: string | null;
                description: string | null;
                order: number;
                duration: number | null;
                moduleId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            completedAt: Date | null;
            completed: boolean;
            enrollmentId: string;
            lessonId: string;
        })[];
    } & {
        id: string;
        userId: string;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        completedAt: Date | null;
        progress: number;
        courseId: string;
        enrolledAt: Date;
    }>;
    dropCourse(user: any, courseId: string): Promise<{
        id: string;
        userId: string;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        completedAt: Date | null;
        progress: number;
        courseId: string;
        enrolledAt: Date;
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
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        completedAt: Date | null;
        progress: number;
        courseId: string;
        enrolledAt: Date;
    })[]>;
    markLessonComplete(user: any, enrollmentId: string, lessonId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        completedAt: Date | null;
        completed: boolean;
        enrollmentId: string;
        lessonId: string;
    }>;
}
