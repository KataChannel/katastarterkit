import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseCategoryInput } from './dto/create-course-category.input';
import { UpdateCourseCategoryInput } from './dto/update-course-category.input';
export declare class CourseCategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCourseCategoryInput: CreateCourseCategoryInput): Promise<{
        parent: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            icon: string | null;
        };
        children: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            icon: string | null;
        }[];
    } & {
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        parentId: string | null;
        icon: string | null;
    }>;
    findAll(): Promise<({
        parent: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            icon: string | null;
        };
        children: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            icon: string | null;
        }[];
        _count: {
            courses: number;
        };
    } & {
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        parentId: string | null;
        icon: string | null;
    })[]>;
    findTree(): Promise<({
        children: ({
            children: {
                id: string;
                slug: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                parentId: string | null;
                icon: string | null;
            }[];
            _count: {
                courses: number;
            };
        } & {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            icon: string | null;
        })[];
        _count: {
            courses: number;
        };
    } & {
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        parentId: string | null;
        icon: string | null;
    })[]>;
    findOne(id: string): Promise<{
        parent: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            icon: string | null;
        };
        children: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            icon: string | null;
        }[];
        _count: {
            courses: number;
        };
    } & {
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        parentId: string | null;
        icon: string | null;
    }>;
    update(id: string, updateCourseCategoryInput: UpdateCourseCategoryInput): Promise<{
        parent: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            icon: string | null;
        };
        children: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            icon: string | null;
        }[];
    } & {
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        parentId: string | null;
        icon: string | null;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private isDescendant;
}
