import { CategoryService } from '../../services/category.service';
import { CategoryType } from '../types/category.type';
import { CreateCategoryInput, UpdateCategoryInput, GetCategoriesInput } from '../inputs/category.input';
export declare class CategoryResolver {
    private categoryService;
    constructor(categoryService: CategoryService);
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
    getCategory(id: string): Promise<{
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
    deleteCategory(id: string, deleteProducts: boolean): Promise<{
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
    productCount(category: CategoryType): Promise<number>;
}
