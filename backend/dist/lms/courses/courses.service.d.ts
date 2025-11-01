import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { CourseFiltersInput } from './dto/course-filters.input';
import { CreateModuleInput, UpdateModuleInput, ReorderModulesInput } from './dto/module.input';
import { CreateLessonInput, UpdateLessonInput, ReorderLessonsInput } from './dto/lesson.input';
export declare class CoursesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createCourseInput: CreateCourseInput): Promise<any>;
    findAll(filters: CourseFiltersInput): Promise<{
        data: any;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<any>;
    findBySlug(slug: string): Promise<any>;
    update(id: string, userId: string, updateCourseInput: UpdateCourseInput): Promise<any>;
    publish(id: string, userId: string): Promise<any>;
    archive(id: string, userId: string): Promise<any>;
    remove(id: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getMyCourses(userId: string): Promise<any>;
    createModule(userId: string, input: CreateModuleInput): Promise<any>;
    updateModule(userId: string, input: UpdateModuleInput): Promise<any>;
    deleteModule(userId: string, moduleId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    reorderModules(userId: string, input: ReorderModulesInput): Promise<any>;
    createLesson(userId: string, input: CreateLessonInput): Promise<any>;
    updateLesson(userId: string, input: UpdateLessonInput): Promise<any>;
    deleteLesson(userId: string, lessonId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    reorderLessons(userId: string, input: ReorderLessonsInput): Promise<any>;
}
