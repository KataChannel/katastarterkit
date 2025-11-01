import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseCategoryInput } from './dto/create-course-category.input';
import { UpdateCourseCategoryInput } from './dto/update-course-category.input';
export declare class CourseCategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCourseCategoryInput: CreateCourseCategoryInput): Promise<any>;
    findAll(): Promise<any>;
    findTree(): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateCourseCategoryInput: UpdateCourseCategoryInput): Promise<any>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private isDescendant;
}
