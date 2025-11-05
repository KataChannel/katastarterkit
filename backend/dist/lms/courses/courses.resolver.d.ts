import { CoursesService } from './courses.service';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { CourseFiltersInput } from './dto/course-filters.input';
import { CreateModuleInput, UpdateModuleInput, ReorderModulesInput } from './dto/module.input';
import { CreateLessonInput, UpdateLessonInput, ReorderLessonsInput } from './dto/lesson.input';
export declare class CoursesResolver {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    createCourse(user: any, createCourseInput: CreateCourseInput): Promise<any>;
    findAll(filters?: CourseFiltersInput): Promise<{
        data: any;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<any>;
    findBySlug(slug: string): Promise<any>;
    getMyCourses(user: any): Promise<any>;
    updateCourse(user: any, updateCourseInput: UpdateCourseInput): Promise<any>;
    publishCourse(user: any, id: string): Promise<any>;
    archiveCourse(user: any, id: string): Promise<any>;
    removeCourse(user: any, id: string): Promise<boolean>;
    createModule(user: any, input: CreateModuleInput): Promise<any>;
    updateModule(user: any, input: UpdateModuleInput): Promise<any>;
    deleteModule(user: any, id: string): Promise<boolean>;
    reorderModules(user: any, input: ReorderModulesInput): Promise<any>;
    createLesson(user: any, input: CreateLessonInput): Promise<any>;
    updateLesson(user: any, input: UpdateLessonInput): Promise<any>;
    deleteLesson(user: any, id: string): Promise<boolean>;
    reorderLessons(user: any, input: ReorderLessonsInput): Promise<any>;
}
