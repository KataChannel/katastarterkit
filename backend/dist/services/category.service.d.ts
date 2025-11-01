import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryInput, UpdateCategoryInput, GetCategoriesInput } from '../graphql/inputs/category.input';
export declare class CategoryService {
    private prisma;
    constructor(prisma: PrismaService);
    getCategories(input?: GetCategoriesInput): Promise<{
        items: any;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
        hasMore: boolean;
    }>;
    getCategoryTree(): Promise<any>;
    getCategoryById(id: string): Promise<any>;
    getCategoryBySlug(slug: string): Promise<any>;
    createCategory(input: CreateCategoryInput): Promise<any>;
    updateCategory(input: UpdateCategoryInput): Promise<any>;
    deleteCategory(id: string, deleteProducts?: boolean): Promise<any>;
    getProductCount(categoryId: string): Promise<number>;
    private wouldCreateCircularReference;
    private buildWhereClause;
}
