import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseCategoryInput } from './dto/create-course-category.input';
import { UpdateCourseCategoryInput } from './dto/update-course-category.input';
export declare class CourseCategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCourseCategoryInput: CreateCourseCategoryInput): Promise<{
        parent: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            slug: string;
            icon: string | null;
        };
        children: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            slug: string;
            icon: string | null;
        }[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        parentId: string | null;
        slug: string;
        icon: string | null;
    }>;
    findAll(): Promise<({
        _count: {
            courses: number;
        };
        parent: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            slug: string;
            icon: string | null;
        };
        children: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            slug: string;
            icon: string | null;
        }[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
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
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                parentId: string | null;
                slug: string;
                icon: string | null;
            }[];
        } & {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            slug: string;
            icon: string | null;
        })[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        parentId: string | null;
        slug: string;
        icon: string | null;
    })[]>;
    findOne(id: string): Promise<{
        _count: {
            courses: number;
        };
        parent: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            slug: string;
            icon: string | null;
        };
        children: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            slug: string;
            icon: string | null;
        }[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        parentId: string | null;
        slug: string;
        icon: string | null;
    }>;
    update(id: string, updateCourseCategoryInput: UpdateCourseCategoryInput): Promise<{
        parent: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            slug: string;
            icon: string | null;
        };
        children: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            slug: string;
            icon: string | null;
        }[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
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
