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
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
            parentId: string | null;
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
            roleType: import("@prisma/client").$Enums.UserRoleType;
            isActive: boolean;
            isVerified: boolean;
            isTwoFactorEnabled: boolean;
            failedLoginAttempts: number;
            lockedUntil: Date | null;
            lastLoginAt: Date | null;
            departmentId: string | null;
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
    }>;
    findAll(filters?: CourseFiltersInput): Promise<{
        data: ({
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
    }>;
    findBySlug(slug: string): Promise<{
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
    }>;
    getMyCourses(user: any): Promise<({
        _count: {
            enrollments: number;
            modules: number;
        };
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
    })[]>;
    updateCourse(user: any, updateCourseInput: UpdateCourseInput): Promise<{
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
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            username: string;
            password: string | null;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
            avatar: string | null;
            roleType: import("@prisma/client").$Enums.UserRoleType;
            isActive: boolean;
            isVerified: boolean;
            isTwoFactorEnabled: boolean;
            failedLoginAttempts: number;
            lockedUntil: Date | null;
            lastLoginAt: Date | null;
            departmentId: string | null;
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
    }>;
    publishCourse(user: any, id: string): Promise<{
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
    }>;
    archiveCourse(user: any, id: string): Promise<{
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
    }>;
    removeCourse(user: any, id: string): Promise<boolean>;
    createModule(user: any, input: CreateModuleInput): Promise<{
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
    }>;
    updateModule(user: any, input: UpdateModuleInput): Promise<{
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
    }>;
    deleteModule(user: any, id: string): Promise<boolean>;
    reorderModules(user: any, input: ReorderModulesInput): Promise<({
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
    })[]>;
    createLesson(user: any, input: CreateLessonInput): Promise<{
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
    }>;
    updateLesson(user: any, input: UpdateLessonInput): Promise<{
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
    }>;
    deleteLesson(user: any, id: string): Promise<boolean>;
    reorderLessons(user: any, input: ReorderLessonsInput): Promise<{
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
    }[]>;
}
