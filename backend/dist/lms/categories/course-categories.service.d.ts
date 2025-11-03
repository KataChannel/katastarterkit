import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseCategoryInput } from './dto/create-course-category.input';
import { UpdateCourseCategoryInput } from './dto/update-course-category.input';
export declare class CourseCategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCourseCategoryInput: CreateCourseCategoryInput): Promise<{
        parent: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            slug: string;
            icon: string | null;
        };
        children: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            slug: string;
            icon: string | null;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        parentId: string | null;
        slug: string;
        icon: string | null;
    }>;
    findAll(): Promise<({
        _count: {
            courses: number;
        };
        parent: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            slug: string;
            icon: string | null;
        };
        children: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            slug: string;
            icon: string | null;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        parentId: string | null;
        slug: string;
        icon: string | null;
    })[]>;
    findTree(): Promise<({
        _count: {
            courses: number;
        };
        children: ({
            _count: {
                courses: number;
            };
            children: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                parentId: string | null;
                slug: string;
                icon: string | null;
            }[];
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            slug: string;
            icon: string | null;
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        parentId: string | null;
        slug: string;
        icon: string | null;
    })[]>;
    findOne(id: string): Promise<{
        _count: {
            courses: number;
        };
        parent: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            slug: string;
            icon: string | null;
        };
        children: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            slug: string;
            icon: string | null;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        parentId: string | null;
        slug: string;
        icon: string | null;
    }>;
    update(id: string, updateCourseCategoryInput: UpdateCourseCategoryInput): Promise<{
        parent: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            slug: string;
            icon: string | null;
        };
        children: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            slug: string;
            icon: string | null;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        parentId: string | null;
        slug: string;
        icon: string | null;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private isDescendant;
}
