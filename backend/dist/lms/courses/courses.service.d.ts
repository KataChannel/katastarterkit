import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { CourseFiltersInput } from './dto/course-filters.input';
import { CreateModuleInput, UpdateModuleInput, ReorderModulesInput } from './dto/module.input';
import { CreateLessonInput, UpdateLessonInput, ReorderLessonsInput } from './dto/lesson.input';
export declare class CoursesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createCourseInput: CreateCourseInput): Promise<{
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
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            username: string;
            password: string | null;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
            avatar: string | null;
            roleType: import(".prisma/client").$Enums.UserRoleType;
            isActive: boolean;
            isVerified: boolean;
            isTwoFactorEnabled: boolean;
            failedLoginAttempts: number;
            lockedUntil: Date | null;
            lastLoginAt: Date | null;
            departmentId: string | null;
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
    }>;
    findAll(filters: CourseFiltersInput): Promise<{
        data: ({
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
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
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
    }>;
    findBySlug(slug: string): Promise<{
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
    }>;
    update(id: string, userId: string, updateCourseInput: UpdateCourseInput): Promise<{
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
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            username: string;
            password: string | null;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
            avatar: string | null;
            roleType: import(".prisma/client").$Enums.UserRoleType;
            isActive: boolean;
            isVerified: boolean;
            isTwoFactorEnabled: boolean;
            failedLoginAttempts: number;
            lockedUntil: Date | null;
            lastLoginAt: Date | null;
            departmentId: string | null;
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
    }>;
    publish(id: string, userId: string): Promise<{
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
    }>;
    archive(id: string, userId: string): Promise<{
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
    }>;
    remove(id: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getMyCourses(userId: string): Promise<({
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
        _count: {
            enrollments: number;
            modules: number;
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
    })[]>;
    createModule(userId: string, input: CreateModuleInput): Promise<{
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
    }>;
    updateModule(userId: string, input: UpdateModuleInput): Promise<{
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
    }>;
    deleteModule(userId: string, moduleId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    reorderModules(userId: string, input: ReorderModulesInput): Promise<({
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
    })[]>;
    createLesson(userId: string, input: CreateLessonInput): Promise<{
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
    }>;
    updateLesson(userId: string, input: UpdateLessonInput): Promise<{
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
    }>;
    deleteLesson(userId: string, lessonId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    reorderLessons(userId: string, input: ReorderLessonsInput): Promise<{
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
    }[]>;
}
