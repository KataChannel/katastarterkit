import { PrismaService } from '../../prisma/prisma.service';
export declare class EnrollmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    enroll(userId: string, courseId: string): Promise<{
        course: {
            id: string;
            title: string;
            description: string | null;
            status: import(".prisma/client").$Enums.CourseStatus;
            createdAt: Date;
            updatedAt: Date;
            level: import(".prisma/client").$Enums.CourseLevel;
            slug: string;
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
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        completedAt: Date | null;
        userId: string;
        progress: number;
        courseId: string;
        enrolledAt: Date;
    }>;
    getMyEnrollments(userId: string): Promise<({
        course: {
            category: {
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                parentId: string | null;
                name: string;
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
            title: string;
            description: string | null;
            status: import(".prisma/client").$Enums.CourseStatus;
            createdAt: Date;
            updatedAt: Date;
            level: import(".prisma/client").$Enums.CourseLevel;
            slug: string;
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
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        completedAt: Date | null;
        userId: string;
        progress: number;
        courseId: string;
        enrolledAt: Date;
    })[]>;
    getEnrollment(userId: string, courseId: string): Promise<{
        course: {
            modules: ({
                lessons: {
                    id: string;
                    title: string;
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    order: number;
                    type: import(".prisma/client").$Enums.LessonType;
                    content: string | null;
                    duration: number | null;
                    moduleId: string;
                }[];
            } & {
                id: string;
                title: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                order: number;
                courseId: string;
            })[];
        } & {
            id: string;
            title: string;
            description: string | null;
            status: import(".prisma/client").$Enums.CourseStatus;
            createdAt: Date;
            updatedAt: Date;
            level: import(".prisma/client").$Enums.CourseLevel;
            slug: string;
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
                title: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                order: number;
                type: import(".prisma/client").$Enums.LessonType;
                content: string | null;
                duration: number | null;
                moduleId: string;
            };
        } & {
            id: string;
            completedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            completed: boolean;
            enrollmentId: string;
            lessonId: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        completedAt: Date | null;
        userId: string;
        progress: number;
        courseId: string;
        enrolledAt: Date;
    }>;
    updateProgress(userId: string, courseId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        completedAt: Date | null;
        userId: string;
        progress: number;
        courseId: string;
        enrolledAt: Date;
    }>;
    dropCourse(userId: string, courseId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        completedAt: Date | null;
        userId: string;
        progress: number;
        courseId: string;
        enrolledAt: Date;
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
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        completedAt: Date | null;
        userId: string;
        progress: number;
        courseId: string;
        enrolledAt: Date;
    })[]>;
    markLessonComplete(userId: string, enrollmentId: string, lessonId: string): Promise<{
        id: string;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        completed: boolean;
        enrollmentId: string;
        lessonId: string;
    }>;
    private updateEnrollmentProgress;
}
