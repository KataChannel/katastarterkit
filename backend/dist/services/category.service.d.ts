import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryInput, UpdateCategoryInput, GetCategoriesInput } from '../graphql/inputs/category.input';
export declare class CategoryService {
    private prisma;
    constructor(prisma: PrismaService);
    getCategories(input?: GetCategoriesInput): Promise<{
        items: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
            parentId: string | null;
            order: number;
            icon: string | null;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasMore: boolean;
    }>;
    getCategoryTree(): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        parentId: string | null;
        order: number;
        icon: string | null;
    }[]>;
    getCategoryById(id: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        parentId: string | null;
        order: number;
        icon: string | null;
    }>;
    getCategoryBySlug(slug: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        parentId: string | null;
        order: number;
        icon: string | null;
    }>;
    createCategory(input: CreateCategoryInput): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        parentId: string | null;
        order: number;
        icon: string | null;
    }>;
    updateCategory(input: UpdateCategoryInput): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        parentId: string | null;
        order: number;
        icon: string | null;
    }>;
    deleteCategory(id: string, deleteProducts?: boolean): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        parentId: string | null;
        order: number;
        icon: string | null;
    }>;
    getProductCount(categoryId: string): Promise<number>;
    private wouldCreateCircularReference;
    private buildWhereClause;
}
