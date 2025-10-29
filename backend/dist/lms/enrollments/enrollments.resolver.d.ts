import { EnrollmentsService } from './enrollments.service';
import { EnrollCourseInput } from './dto/enroll-course.input';
export declare class EnrollmentsResolver {
    private readonly enrollmentsService;
    constructor(enrollmentsService: EnrollmentsService);
    enrollCourse(user: any, enrollCourseInput: EnrollCourseInput): Promise<{
        course: {
            level: import(".prisma/client").$Enums.CourseLevel;
            id: string;
            status: import(".prisma/client").$Enums.CourseStatus;
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
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        userId: string;
        courseId: string;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        progress: number;
        enrolledAt: Date;
        completedAt: Date | null;
    }>;
    getMyEnrollments(user: any): Promise<({
        course: {
            category: {
                id: string;
                name: string;
                slug: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
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
            level: import(".prisma/client").$Enums.CourseLevel;
            id: string;
            status: import(".prisma/client").$Enums.CourseStatus;
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
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        userId: string;
        courseId: string;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        progress: number;
        enrolledAt: Date;
        completedAt: Date | null;
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
                    type: import(".prisma/client").$Enums.LessonType;
                    content: string | null;
                    moduleId: string;
                }[];
            } & {
                id: string;
                courseId: string;
                title: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                order: number;
            })[];
        } & {
            level: import(".prisma/client").$Enums.CourseLevel;
            id: string;
            status: import(".prisma/client").$Enums.CourseStatus;
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
            createdAt: Date;
            updatedAt: Date;
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
                type: import(".prisma/client").$Enums.LessonType;
                content: string | null;
                moduleId: string;
            };
        } & {
            id: string;
            completedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            enrollmentId: string;
            lessonId: string;
            completed: boolean;
        })[];
    } & {
        id: string;
        userId: string;
        courseId: string;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        progress: number;
        enrolledAt: Date;
        completedAt: Date | null;
    }>;
    dropCourse(user: any, courseId: string): Promise<{
        id: string;
        userId: string;
        courseId: string;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
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
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        progress: number;
        enrolledAt: Date;
        completedAt: Date | null;
    })[]>;
    markLessonComplete(user: any, enrollmentId: string, lessonId: string): Promise<{
        id: string;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        enrollmentId: string;
        lessonId: string;
        completed: boolean;
    }>;
}
