import { PrismaService } from '../../prisma/prisma.service';
export declare class EnrollmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    enroll(userId: string, courseId: string): Promise<{
        course: {
            id: string;
            description: string | null;
            title: string;
            status: import(".prisma/client").$Enums.CourseStatus;
            createdAt: Date;
            updatedAt: Date;
            level: import(".prisma/client").$Enums.CourseLevel;
            slug: string;
            thumbnail: string | null;
            duration: number | null;
            price: number;
            categoryId: string | null;
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
        userId: string;
        completedAt: Date | null;
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
                name: string;
                parentId: string | null;
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
            description: string | null;
            title: string;
            status: import(".prisma/client").$Enums.CourseStatus;
            createdAt: Date;
            updatedAt: Date;
            level: import(".prisma/client").$Enums.CourseLevel;
            slug: string;
            thumbnail: string | null;
            duration: number | null;
            price: number;
            categoryId: string | null;
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
        userId: string;
        completedAt: Date | null;
        progress: number;
        courseId: string;
        enrolledAt: Date;
    })[]>;
    getEnrollment(userId: string, courseId: string): Promise<{
        course: {
            modules: ({
                lessons: {
                    id: string;
                    description: string | null;
                    title: string;
                    createdAt: Date;
                    updatedAt: Date;
                    content: string | null;
                    type: import(".prisma/client").$Enums.LessonType;
                    order: number;
                    duration: number | null;
                    moduleId: string;
                }[];
            } & {
                id: string;
                description: string | null;
                title: string;
                createdAt: Date;
                updatedAt: Date;
                order: number;
                courseId: string;
            })[];
        } & {
            id: string;
            description: string | null;
            title: string;
            status: import(".prisma/client").$Enums.CourseStatus;
            createdAt: Date;
            updatedAt: Date;
            level: import(".prisma/client").$Enums.CourseLevel;
            slug: string;
            thumbnail: string | null;
            duration: number | null;
            price: number;
            categoryId: string | null;
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
                description: string | null;
                title: string;
                createdAt: Date;
                updatedAt: Date;
                content: string | null;
                type: import(".prisma/client").$Enums.LessonType;
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
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        userId: string;
        completedAt: Date | null;
        progress: number;
        courseId: string;
        enrolledAt: Date;
    }>;
    updateProgress(userId: string, courseId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        userId: string;
        completedAt: Date | null;
        progress: number;
        courseId: string;
        enrolledAt: Date;
    }>;
    dropCourse(userId: string, courseId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        userId: string;
        completedAt: Date | null;
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
        userId: string;
        completedAt: Date | null;
        progress: number;
        courseId: string;
        enrolledAt: Date;
    })[]>;
    markLessonComplete(userId: string, enrollmentId: string, lessonId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        completedAt: Date | null;
        completed: boolean;
        enrollmentId: string;
        lessonId: string;
    }>;
    private updateEnrollmentProgress;
}
