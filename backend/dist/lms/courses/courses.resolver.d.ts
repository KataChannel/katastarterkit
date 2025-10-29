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
    findAll(filters?: CourseFiltersInput): Promise<{
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
    getMyCourses(user: any): Promise<({
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
    updateCourse(user: any, updateCourseInput: UpdateCourseInput): Promise<{
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
    publishCourse(user: any, id: string): Promise<{
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
    archiveCourse(user: any, id: string): Promise<{
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
    removeCourse(user: any, id: string): Promise<boolean>;
    createModule(user: any, input: CreateModuleInput): Promise<{
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
    updateModule(user: any, input: UpdateModuleInput): Promise<{
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
    deleteModule(user: any, id: string): Promise<boolean>;
    reorderModules(user: any, input: ReorderModulesInput): Promise<({
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
    createLesson(user: any, input: CreateLessonInput): Promise<{
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
    updateLesson(user: any, input: UpdateLessonInput): Promise<{
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
    deleteLesson(user: any, id: string): Promise<boolean>;
    reorderLessons(user: any, input: ReorderLessonsInput): Promise<{
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
