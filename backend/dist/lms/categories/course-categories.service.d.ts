import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseCategoryInput } from './dto/create-course-category.input';
import { UpdateCourseCategoryInput } from './dto/update-course-category.input';
export declare class CourseCategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCourseCategoryInput: CreateCourseCategoryInput): Promise<{
        parent: {
            name: string;
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            parentId: string | null;
            icon: string | null;
            slug: string;
        };
        children: {
            name: string;
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            parentId: string | null;
            icon: string | null;
            slug: string;
        }[];
    } & {
        name: string;
        description: string | null;
        id: string;
        updatedAt: Date;
        createdAt: Date;
        parentId: string | null;
        icon: string | null;
        slug: string;
    }>;
    findAll(): Promise<({
        _count: {
            courses: number;
        };
        parent: {
            name: string;
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            parentId: string | null;
            icon: string | null;
            slug: string;
        };
        children: {
            name: string;
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            parentId: string | null;
            icon: string | null;
            slug: string;
        }[];
    } & {
        name: string;
        description: string | null;
        id: string;
        updatedAt: Date;
        createdAt: Date;
        parentId: string | null;
        icon: string | null;
        slug: string;
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
                description: string | null;
                id: string;
                updatedAt: Date;
                createdAt: Date;
                parentId: string | null;
                icon: string | null;
                slug: string;
            }[];
        } & {
            name: string;
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            parentId: string | null;
            icon: string | null;
            slug: string;
        })[];
    } & {
        name: string;
        description: string | null;
        id: string;
        updatedAt: Date;
        createdAt: Date;
        parentId: string | null;
        icon: string | null;
        slug: string;
    })[]>;
    findOne(id: string): Promise<{
        _count: {
            courses: number;
        };
        parent: {
            name: string;
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            parentId: string | null;
            icon: string | null;
            slug: string;
        };
        children: {
            name: string;
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            parentId: string | null;
            icon: string | null;
            slug: string;
        }[];
    } & {
        name: string;
        description: string | null;
        id: string;
        updatedAt: Date;
        createdAt: Date;
        parentId: string | null;
        icon: string | null;
        slug: string;
    }>;
    update(id: string, updateCourseCategoryInput: UpdateCourseCategoryInput): Promise<{
        parent: {
            name: string;
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            parentId: string | null;
            icon: string | null;
            slug: string;
        };
        children: {
            name: string;
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            parentId: string | null;
            icon: string | null;
            slug: string;
        }[];
    } & {
        name: string;
        description: string | null;
        id: string;
        updatedAt: Date;
        createdAt: Date;
        parentId: string | null;
        icon: string | null;
        slug: string;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private isDescendant;
}
