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
    }>;
    findAll(filters?: CourseFiltersInput): Promise<{
        data: ({
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
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
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
    }>;
    findBySlug(slug: string): Promise<{
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
    }>;
    getMyCourses(user: any): Promise<({
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
        _count: {
            modules: number;
            enrollments: number;
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
    })[]>;
    updateCourse(user: any, updateCourseInput: UpdateCourseInput): Promise<{
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
    }>;
    publishCourse(user: any, id: string): Promise<{
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
    }>;
    archiveCourse(user: any, id: string): Promise<{
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
    }>;
    removeCourse(user: any, id: string): Promise<boolean>;
    createModule(user: any, input: CreateModuleInput): Promise<{
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
    }>;
    updateModule(user: any, input: UpdateModuleInput): Promise<{
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
    }>;
    deleteModule(user: any, id: string): Promise<boolean>;
    reorderModules(user: any, input: ReorderModulesInput): Promise<({
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
    })[]>;
    createLesson(user: any, input: CreateLessonInput): Promise<{
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
    }>;
    updateLesson(user: any, input: UpdateLessonInput): Promise<{
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
    }>;
    deleteLesson(user: any, id: string): Promise<boolean>;
    reorderLessons(user: any, input: ReorderLessonsInput): Promise<{
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
    }[]>;
}
