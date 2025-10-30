import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseCategoryInput } from './dto/create-course-category.input';
import { UpdateCourseCategoryInput } from './dto/update-course-category.input';
export declare class CourseCategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCourseCategoryInput: CreateCourseCategoryInput): Promise<{
        children: {
            id: string;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            name: string;
            icon: string | null;
        }[];
        parent: {
            id: string;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            name: string;
            icon: string | null;
        };
    } & {
        id: string;
        parentId: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        name: string;
        icon: string | null;
    }>;
    findAll(): Promise<({
        children: {
            id: string;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            name: string;
            icon: string | null;
        }[];
        parent: {
            id: string;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            name: string;
            icon: string | null;
        };
        _count: {
            courses: number;
        };
    } & {
        id: string;
        parentId: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        name: string;
        icon: string | null;
    })[]>;
    findTree(): Promise<({
        children: ({
            children: {
                id: string;
                parentId: string | null;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                description: string | null;
                name: string;
                icon: string | null;
            }[];
            _count: {
                courses: number;
            };
        } & {
            id: string;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            name: string;
            icon: string | null;
        })[];
        _count: {
            courses: number;
        };
    } & {
        id: string;
        parentId: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        name: string;
        icon: string | null;
    })[]>;
    findOne(id: string): Promise<{
        children: {
            id: string;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            name: string;
            icon: string | null;
        }[];
        parent: {
            id: string;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            name: string;
            icon: string | null;
        };
        _count: {
            courses: number;
        };
    } & {
        id: string;
        parentId: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        name: string;
        icon: string | null;
    }>;
    update(id: string, updateCourseCategoryInput: UpdateCourseCategoryInput): Promise<{
        children: {
            id: string;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            name: string;
            icon: string | null;
        }[];
        parent: {
            id: string;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            name: string;
            icon: string | null;
        };
    } & {
        id: string;
        parentId: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        name: string;
        icon: string | null;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private isDescendant;
}
