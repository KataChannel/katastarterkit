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
            password: string | null;
            email: string | null;
            username: string;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
            avatar: string | null;
            roleType: import(".prisma/client").$Enums.UserRoleType;
            isActive: boolean;
            isVerified: boolean;
            createdAt: Date;
            isTwoFactorEnabled: boolean;
            id: string;
            failedLoginAttempts: number;
            lockedUntil: Date | null;
            lastLoginAt: Date | null;
            updatedAt: Date;
            departmentId: string | null;
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
    }>;
    findAll(filters?: CourseFiltersInput): Promise<{
        data: ({
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
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
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
    }>;
    findBySlug(slug: string): Promise<{
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
    }>;
    getMyCourses(user: any): Promise<({
        _count: {
            enrollments: number;
            modules: number;
        };
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
    })[]>;
    updateCourse(user: any, updateCourseInput: UpdateCourseInput): Promise<{
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
            password: string | null;
            email: string | null;
            username: string;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
            avatar: string | null;
            roleType: import(".prisma/client").$Enums.UserRoleType;
            isActive: boolean;
            isVerified: boolean;
            createdAt: Date;
            isTwoFactorEnabled: boolean;
            id: string;
            failedLoginAttempts: number;
            lockedUntil: Date | null;
            lastLoginAt: Date | null;
            updatedAt: Date;
            departmentId: string | null;
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
    }>;
    publishCourse(user: any, id: string): Promise<{
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
    }>;
    archiveCourse(user: any, id: string): Promise<{
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
    }>;
    removeCourse(user: any, id: string): Promise<boolean>;
    createModule(user: any, input: CreateModuleInput): Promise<{
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
    }>;
    updateModule(user: any, input: UpdateModuleInput): Promise<{
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
    }>;
    deleteModule(user: any, id: string): Promise<boolean>;
    reorderModules(user: any, input: ReorderModulesInput): Promise<({
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
    })[]>;
    createLesson(user: any, input: CreateLessonInput): Promise<{
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
    }>;
    updateLesson(user: any, input: UpdateLessonInput): Promise<{
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
    }>;
    deleteLesson(user: any, id: string): Promise<boolean>;
    reorderLessons(user: any, input: ReorderLessonsInput): Promise<{
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
    }[]>;
}
