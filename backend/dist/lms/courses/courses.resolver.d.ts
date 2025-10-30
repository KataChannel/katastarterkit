import { CoursesService } from './courses.service';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { CourseFiltersInput } from './dto/course-filters.input';
import { CreateModuleInput, UpdateModuleInput, ReorderModulesInput } from './dto/module.input';
import { CreateLessonInput, UpdateLessonInput, ReorderLessonsInput } from './dto/lesson.input';
export declare class CoursesResolver {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    createCourse(user: any, createCourseInput: CreateCourseInput): Promise<{
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
            password: string | null;
            id: string;
            isVerified: boolean;
            createdAt: Date;
            isActive: boolean;
            email: string | null;
            username: string;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
            avatar: string | null;
            roleType: import("@prisma/client").$Enums.UserRoleType;
            isTwoFactorEnabled: boolean;
            failedLoginAttempts: number;
            lockedUntil: Date | null;
            lastLoginAt: Date | null;
            updatedAt: Date;
            departmentId: string | null;
        };
    } & {
        level: import("@prisma/client").$Enums.CourseLevel;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        status: import("@prisma/client").$Enums.CourseStatus;
        description: string | null;
        thumbnail: string | null;
        price: number;
        categoryId: string | null;
        duration: number | null;
        rating: number;
        instructorId: string;
        whatYouWillLearn: string[];
        requirements: string[];
        reviewCount: number;
        enrollmentCount: number;
        avgRating: number;
    }>;
    findAll(filters?: CourseFiltersInput): Promise<{
        data: ({
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
            level: import("@prisma/client").$Enums.CourseLevel;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            status: import("@prisma/client").$Enums.CourseStatus;
            description: string | null;
            thumbnail: string | null;
            price: number;
            categoryId: string | null;
            duration: number | null;
            rating: number;
            instructorId: string;
            whatYouWillLearn: string[];
            requirements: string[];
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
        modules: ({
            lessons: {
                order: number;
                type: import("@prisma/client").$Enums.LessonType;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                content: string | null;
                description: string | null;
                duration: number | null;
                moduleId: string;
            }[];
        } & {
            order: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            courseId: string;
        })[];
    } & {
        level: import("@prisma/client").$Enums.CourseLevel;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        status: import("@prisma/client").$Enums.CourseStatus;
        description: string | null;
        thumbnail: string | null;
        price: number;
        categoryId: string | null;
        duration: number | null;
        rating: number;
        instructorId: string;
        whatYouWillLearn: string[];
        requirements: string[];
        reviewCount: number;
        enrollmentCount: number;
        avgRating: number;
    }>;
    findBySlug(slug: string): Promise<{
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
        modules: ({
            lessons: {
                order: number;
                type: import("@prisma/client").$Enums.LessonType;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                content: string | null;
                description: string | null;
                duration: number | null;
                moduleId: string;
            }[];
        } & {
            order: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            courseId: string;
        })[];
    } & {
        level: import("@prisma/client").$Enums.CourseLevel;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        status: import("@prisma/client").$Enums.CourseStatus;
        description: string | null;
        thumbnail: string | null;
        price: number;
        categoryId: string | null;
        duration: number | null;
        rating: number;
        instructorId: string;
        whatYouWillLearn: string[];
        requirements: string[];
        reviewCount: number;
        enrollmentCount: number;
        avgRating: number;
    }>;
    getMyCourses(user: any): Promise<({
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
        _count: {
            enrollments: number;
            modules: number;
        };
    } & {
        level: import("@prisma/client").$Enums.CourseLevel;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        status: import("@prisma/client").$Enums.CourseStatus;
        description: string | null;
        thumbnail: string | null;
        price: number;
        categoryId: string | null;
        duration: number | null;
        rating: number;
        instructorId: string;
        whatYouWillLearn: string[];
        requirements: string[];
        reviewCount: number;
        enrollmentCount: number;
        avgRating: number;
    })[]>;
    updateCourse(user: any, updateCourseInput: UpdateCourseInput): Promise<{
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
            password: string | null;
            id: string;
            isVerified: boolean;
            createdAt: Date;
            isActive: boolean;
            email: string | null;
            username: string;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
            avatar: string | null;
            roleType: import("@prisma/client").$Enums.UserRoleType;
            isTwoFactorEnabled: boolean;
            failedLoginAttempts: number;
            lockedUntil: Date | null;
            lastLoginAt: Date | null;
            updatedAt: Date;
            departmentId: string | null;
        };
    } & {
        level: import("@prisma/client").$Enums.CourseLevel;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        status: import("@prisma/client").$Enums.CourseStatus;
        description: string | null;
        thumbnail: string | null;
        price: number;
        categoryId: string | null;
        duration: number | null;
        rating: number;
        instructorId: string;
        whatYouWillLearn: string[];
        requirements: string[];
        reviewCount: number;
        enrollmentCount: number;
        avgRating: number;
    }>;
    publishCourse(user: any, id: string): Promise<{
        level: import("@prisma/client").$Enums.CourseLevel;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        status: import("@prisma/client").$Enums.CourseStatus;
        description: string | null;
        thumbnail: string | null;
        price: number;
        categoryId: string | null;
        duration: number | null;
        rating: number;
        instructorId: string;
        whatYouWillLearn: string[];
        requirements: string[];
        reviewCount: number;
        enrollmentCount: number;
        avgRating: number;
    }>;
    archiveCourse(user: any, id: string): Promise<{
        level: import("@prisma/client").$Enums.CourseLevel;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        status: import("@prisma/client").$Enums.CourseStatus;
        description: string | null;
        thumbnail: string | null;
        price: number;
        categoryId: string | null;
        duration: number | null;
        rating: number;
        instructorId: string;
        whatYouWillLearn: string[];
        requirements: string[];
        reviewCount: number;
        enrollmentCount: number;
        avgRating: number;
    }>;
    removeCourse(user: any, id: string): Promise<boolean>;
    createModule(user: any, input: CreateModuleInput): Promise<{
        lessons: {
            order: number;
            type: import("@prisma/client").$Enums.LessonType;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            content: string | null;
            description: string | null;
            duration: number | null;
            moduleId: string;
        }[];
    } & {
        order: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        courseId: string;
    }>;
    updateModule(user: any, input: UpdateModuleInput): Promise<{
        lessons: {
            order: number;
            type: import("@prisma/client").$Enums.LessonType;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            content: string | null;
            description: string | null;
            duration: number | null;
            moduleId: string;
        }[];
    } & {
        order: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        courseId: string;
    }>;
    deleteModule(user: any, id: string): Promise<boolean>;
    reorderModules(user: any, input: ReorderModulesInput): Promise<({
        lessons: {
            order: number;
            type: import("@prisma/client").$Enums.LessonType;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            content: string | null;
            description: string | null;
            duration: number | null;
            moduleId: string;
        }[];
    } & {
        order: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        courseId: string;
    })[]>;
    createLesson(user: any, input: CreateLessonInput): Promise<{
        order: number;
        type: import("@prisma/client").$Enums.LessonType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string | null;
        description: string | null;
        duration: number | null;
        moduleId: string;
    }>;
    updateLesson(user: any, input: UpdateLessonInput): Promise<{
        order: number;
        type: import("@prisma/client").$Enums.LessonType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string | null;
        description: string | null;
        duration: number | null;
        moduleId: string;
    }>;
    deleteLesson(user: any, id: string): Promise<boolean>;
    reorderLessons(user: any, input: ReorderLessonsInput): Promise<{
        order: number;
        type: import("@prisma/client").$Enums.LessonType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string | null;
        description: string | null;
        duration: number | null;
        moduleId: string;
    }[]>;
}
